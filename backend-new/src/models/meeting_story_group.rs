use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Clone, sqlx::FromRow, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MeetingStoryGroup {
    pub group_name: String,
    pub year: String,
    pub id: Uuid,
}
