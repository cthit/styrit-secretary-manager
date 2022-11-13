use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Meeting {
    id: Option<uuid::Uuid>,
    date: DateTime<Utc>,
    last_upload: DateTime<Utc>,
    lp: u32,
    meeting_no: u32,
    groups_tasks: Vec<()>,
}
