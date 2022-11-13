use chrono::NaiveDateTime;
use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Clone, sqlx::FromRow, Serialize)]
pub struct Meeting {
    pub id: Uuid,
    pub year: i32,
    pub lp: i32,
    pub meeting_no: i32,
    pub date: NaiveDateTime,
    pub last_upload: NaiveDateTime,
    pub check_for_deadline: bool,
}
