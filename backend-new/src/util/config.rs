use std::env::{self, VarError};

#[derive(Debug, thiserror::Error)]
pub enum ConfigError {
    #[error("Empty variable error")]
    VarEmpty(&'static str),
    #[error("Failed to read .env file, err `{0}`")]
    DotEnvError(#[from] dotenv::Error),
    #[error("Environment variable error")]
    EnvVarError(#[from] VarError),
}

pub type ConfigResult<T> = Result<T, ConfigError>;

#[derive(Clone)]
pub struct Config {
    pub database_url: String,
    pub secret_key: String,
    pub gamma_client_id: String,
    pub gamma_secret: String,
    pub gamma_me_uri: String,
    pub gamma_token_uri: String,
    pub gamma_authorization_uri: String,
    pub gamma_redirect_uri: String,
}

impl Config {
    pub fn new() -> ConfigResult<Self> {
        dotenv::dotenv()?;

        Ok(Self {
            database_url: load_env_str("DATABASE_URL")?,
            secret_key: load_env_str("SECRET_KEY")?,
            gamma_client_id: load_env_str("GAMMA_CLIENT_ID")?,
            gamma_secret: load_env_str("GAMMA_SECRET")?,
            gamma_me_uri: load_env_str("GAMMA_ME_URI")?,
            gamma_token_uri: load_env_str("GAMMA_TOKEN_URI")?,
            gamma_authorization_uri: load_env_str("GAMMA_AUTHORIZATION_URI")?,
            gamma_redirect_uri: load_env_str("GAMMA_REDIRECT_URI")?,
        })
    }
}

fn load_env_str(key: &'static str) -> ConfigResult<String> {
    let var = env::var(key)?;

    if var.is_empty() {
        return Err(ConfigError::VarEmpty(key));
    }

    Ok(var)
}
