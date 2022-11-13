use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Clone, sqlx::FromRow, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GroupTaskCode {
    pub group_name: String,
    pub code: Uuid,
    pub task: String,
}
