use sqlx::{Pool, Postgres, Transaction};

pub mod config_repository;
pub mod group_meeting_repository;
pub mod group_meeting_task_repository;
pub mod group_repository;
pub mod group_year_repository;
pub mod meeting_repository;
pub mod task_repository;

use crate::util::secretary_error::{SecretaryError, SecretaryResult};

pub type DB = Postgres;

pub async fn new_transaction(db_pool: &Pool<DB>) -> SecretaryResult<Transaction<'_, DB>> {
    match db_pool.begin().await {
        Ok(transaction) => Ok(transaction),
        Err(err) => {
            error!("Failed to create transaction: {:?}", err);
            Err(SecretaryError::SqlxError(err))
        }
    }
}
