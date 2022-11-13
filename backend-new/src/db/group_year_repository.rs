use sqlx::Transaction;

use crate::{models::group_year::GroupYear, util::secretary_error::SecretaryResult};

use super::DB;

pub async fn get_group_years(
    transaction: &mut Transaction<'_, DB>,
) -> SecretaryResult<Vec<GroupYear>> {
    Ok(sqlx::query_as!(
        GroupYear,
        "
SELECT gy.group, gy.year, gy.finished
FROM group_year gy
WHERE finished = FALSE AND year != 'active'
        "
    )
    .fetch_all(transaction)
    .await?)
}
