#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthRequest {
    pub code: String,
}

#[post("/api/auth")]
pub async fn auth(req: Json<AuthRequest>) {}
