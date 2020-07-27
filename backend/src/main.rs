#[macro_use]
extern crate diesel;

use std::env;
use actix_web::{
    web, App, HttpServer,
    middleware::Logger,
};
use env_logger::Env;
use diesel::{
    prelude::*,
    r2d2::{self, ConnectionManager},
};

mod api;
mod schema;
mod models;

pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;

fn create_dbcp() -> Pool {
    dotenv::dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL should be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool")
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    env_logger::from_env(Env::default().default_filter_or("info"))
        .init();

    let pool = create_dbcp();

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .route("/hello", web::get().to(api::auth::hello))
            .wrap(Logger::default())
    })
        .bind("localhost:8080")?
        .run()
        .await
}