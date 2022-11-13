use sqlx::postgres::PgPoolOptions;
use util::config::Config;

mod api;
mod db;
mod models;
mod service;
mod util;

#[macro_use]
extern crate rocket;

#[launch]
async fn rocket() -> _ {
    // Load
    let config = Config::new().expect("Failed to load config");

    // Setup DB
    let db_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await
        .expect("Failed to connect to DB");
    //    db::init(&db_pool).await.expect("Failed to initialize db");

    rocket::build()
        // .mount("/api/code", routes![])
        .mount("/api/auth", routes![api::config::get_config])
        .manage(db_pool.clone())
        .manage(config)
}
