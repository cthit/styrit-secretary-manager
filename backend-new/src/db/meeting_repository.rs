use sqlx::Transaction;
use uuid::Uuid;

use crate::{models::meeting::Meeting, util::secretary_error::SecretaryResult};

use super::DB;

pub async fn get_all_meetings(
    transaction: &mut Transaction<'_, DB>,
) -> SecretaryResult<Vec<Meeting>> {
    Ok(sqlx::query_as!(
        Meeting,
        "
SELECT id, year, date, last_upload, lp, meeting_no, check_for_deadline
FROM meeting
        "
    )
    .fetch_all(transaction)
    .await?)
}

pub async fn get_meeting_by_id(
    transaction: &mut Transaction<'_, DB>,
    id: Uuid,
) -> SecretaryResult<Option<Meeting>> {
    Ok(sqlx::query_as!(
        Meeting,
        "
SELECT id, year, date, last_upload, lp, meeting_no, check_for_deadline
FROM meeting
WHERE id=$1
        ",
        id
    )
    .fetch_optional(transaction)
    .await?)
}
