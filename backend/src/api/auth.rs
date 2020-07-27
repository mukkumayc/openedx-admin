use crate::{
    Pool,
    models::User,
    schema::users::dsl::*,
};
use diesel::RunQueryDsl;
use actix_web::{web, HttpResponse};

fn get_users(pool: web::Data<Pool>) -> Result<Vec<User>, diesel::result::Error> {
    let connection = pool.get().unwrap();
    let items = users.load::<User>(&connection)?;
    Ok(items)
}

pub async fn hello(db: web::Data<Pool>) -> Result<HttpResponse, actix_web::Error> {
    Ok(web::block(move || get_users(db))
        .await
        .map(|user| HttpResponse::Ok().json(user))
        .map_err(|_| HttpResponse::InternalServerError())?)
}
