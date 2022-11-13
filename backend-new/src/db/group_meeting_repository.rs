use sqlx::Transaction;
use uuid::Uuid;

use crate::{
    models::meeting_story_group::MeetingStoryGroup, util::secretary_error::SecretaryResult,
};

use super::DB;

pub async fn get_story_groups_for_meeting(
    transaction: &mut Transaction<'_, DB>,
    meeting_id: Uuid,
) -> SecretaryResult<Vec<MeetingStoryGroup>> {
    Ok(sqlx::query_as!(
        MeetingStoryGroup,
        "
SELECT group_name, group_year as year, code as id
FROM group_meeting
WHERE meeting = $1 AND group_year != 'active'
        ",
        meeting_id
    )
    .fetch_all(transaction)
    .await?)
}
