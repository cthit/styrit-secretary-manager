use serde::Serialize;

#[derive(Debug, Clone, sqlx::FromRow, Serialize)]
pub struct Config {
    pub key: String,
    pub value: String,
    pub config_type: ConfigType,
    pub description: String,
}

#[derive(Debug, Clone, sqlx::Type, Serialize)]
#[sqlx(type_name = "CONFIG_TYPE", rename_all = "snake_case")]
pub enum ConfigType {
    #[serde(rename = "string")]
    String,
    #[serde(rename = "long_string")]
    LongString,
    #[serde(rename = "number")]
    Number,
}
