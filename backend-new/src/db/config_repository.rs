use sqlx::Transaction;

use crate::{models::config::Config, util::secretary_error::SecretaryResult};

use super::DB;

pub async fn get_all_configs(
    transaction: &mut Transaction<'_, DB>,
) -> SecretaryResult<Vec<Config>> {
    Ok(sqlx::query_as!(
        Config,
        r#"
SELECT key, value, config_type as "config_type: _", description
FROM config
        "#
    )
    .fetch_all(transaction)
    .await?)
}

pub async fn get_config_value(
    key: String,
    transaction: &mut Transaction<'_, DB>,
) -> SecretaryResult<String> {
    let conf = sqlx::query_as!(
        Config,
        r#"
SELECT key, value, config_type as "config_type: _", description
FROM config
WHERE key = $1
        "#,
        key
    )
    .fetch_one(transaction)
    .await?;

    Ok(conf.value)
}
