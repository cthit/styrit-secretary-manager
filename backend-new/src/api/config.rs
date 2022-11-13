use rocket::State;

use crate::{
    db::DB,
    service::admin_service::{get_admin_config, AdminConfig},
    util::response::SecretaryResponse,
};

#[get("/config")]
pub async fn get_config(db_pool: &State<sqlx::Pool<DB>>) -> SecretaryResponse<AdminConfig> {
    let conf = match get_admin_config(db_pool).await {
        Ok(v) => v,
        Err(e) => {
            error!("Failed to retrieve admin config, err: {e}");
            return SecretaryResponse::internal_err(String::from(""));
        }
    };
    SecretaryResponse::ok(conf)
}
