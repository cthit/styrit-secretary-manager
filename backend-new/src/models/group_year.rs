use serde::Serialize;

#[derive(Debug, Clone, sqlx::FromRow, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GroupYear {
    pub group: String,
    pub year: String,
    pub finished: bool,
}
