use std::fmt::{Display, Formatter};

use rocket::http::Status;
use rocket::response::{Responder, Response};
use rocket::serde::json::{json, Json};
use rocket::Request;
use serde::Serialize;

#[derive(Clone)]
pub struct SecretaryResponse<T: Serialize + Clone> {
    status: Status,
    data: ResponseData<T>,
}

#[derive(Clone, Serialize)]
pub struct ResponseData<T: Serialize + Clone> {
    data: Option<T>,
    is_error: bool,
    message: String,
}

impl<T: Serialize + Clone> SecretaryResponse<T> {
    pub fn ok(data: T) -> SecretaryResponse<T> {
        SecretaryResponse {
            status: Status::Ok,
            data: ResponseData {
                data: Some(data),
                is_error: false,
                message: String::new(),
            },
        }
    }

    pub fn err(message: String, status: Status) -> SecretaryResponse<T> {
        SecretaryResponse {
            status: status,
            data: ResponseData {
                message: message,
                is_error: true,
                data: None,
            },
        }
    }

    pub fn internal_err(message: String) -> SecretaryResponse<T> {
        SecretaryResponse {
            status: Status::InternalServerError,
            data: ResponseData {
                message: message,
                is_error: true,
                data: None,
            },
        }
    }
}

impl<T: Serialize + Clone> Display for ResponseData<T> {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self.is_error {
            true => write!(f, "Success"),
            false => write!(f, "Error: {}", self.message),
        }
    }
}

impl<'r, T: Serialize + Clone> Responder<'r, 'static> for SecretaryResponse<T> {
    fn respond_to(self, request: &'r Request<'_>) -> Result<Response<'static>, Status> {
        if self.status.code >= 400 {
            warn!(
                "Status: {} :: ResponseData: {}",
                self.status.code, self.data
            )
        } else {
            info!("Success, status: {}", self.status)
        }

        let mut response = Json(json!({
            "data": self.data.data,
            "is_error": self.data.is_error,
            "message": self.data.message
        }))
        .respond_to(request)?;

        response.set_status(self.status);

        Ok(response)
    }
}
