mod handlers;
mod models;
mod services;

use handlers::Db;
use rocket::launch;
use rocket_db_pools::Database;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Db::init())
        .mount("/api/orders", handlers::routes())
        .mount("/api", rocket::routes![handlers::health_check])
}
