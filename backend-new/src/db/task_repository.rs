use sqlx::Transaction;

use crate::{models::task::Task, util::secretary_error::SecretaryResult};

use super::DB;

pub async fn get_all_tasks(transaction: &mut Transaction<'_, DB>) -> SecretaryResult<Vec<Task>> {
    Ok(sqlx::query_as!(
        Task,
        "
SELECT name, display_name
FROM task
        "
    )
    .fetch_all(transaction)
    .await?)
}
