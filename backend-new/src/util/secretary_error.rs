#[derive(Debug, thiserror::Error)]
pub enum SecretaryError {
    #[error("Sqlx error")]
    SqlxError(#[from] sqlx::Error),
    #[error("An internal error occurred `{0}`")]
    InternalError(String),
}

pub type SecretaryResult<T> = Result<T, SecretaryError>;
