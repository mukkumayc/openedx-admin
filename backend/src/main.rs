use std::env;
use actix_web::{
    web, App, HttpServer,
    middleware::Logger,
};
use env_logger::Env;

mod api;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    env_logger::from_env(
        Env::default()
            .default_filter_or("info")
    ).init();

    let address = match env::var("SERVER_HOST") {
        Ok(host) => host,
        Err(_) => "0.0.0.0:8080".to_string()
    };

    HttpServer::new(move || {
        App::new()
            .route("/hello", web::get().to(api::auth::hello))
            .wrap(Logger::default())
    })
        .bind(&address)?
        .run()
        .await
}