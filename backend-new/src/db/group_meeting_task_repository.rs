use sqlx::Transaction;
use uuid::Uuid;

use crate::{models::group_task_code::GroupTaskCode, util::secretary_error::SecretaryResult};

use super::DB;

pub async fn get_tasks_for_meeting(
    transaction: &mut Transaction<'_, DB>,
    meeting_id: Uuid,
) -> SecretaryResult<Vec<GroupTaskCode>> {
    Ok(sqlx::query_as!(
        GroupTaskCode,
        "
SELECT gmt.group_name, gm.code, gmt.task
FROM group_meeting_task gmt 
JOIN group_meeting gm ON gmt.meeting = gm.meeting AND gmt.group_name = gm.group_name
JOIN task t ON gmt.task = t.name
WHERE t.for_finished_group = FALSE
AND gmt.meeting = $1
        ",
        meeting_id
    )
    .fetch_all(transaction)
    .await?)
}
