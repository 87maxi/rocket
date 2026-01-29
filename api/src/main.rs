//! Northwind Orders API
//!
//! A REST API built with Rust and Rocket for managing orders from the Northwind database.
//! This application provides CRUD operations and specialized queries for order management.

mod handlers;
mod models;
mod services;

use handlers::Db;
use rocket::fairing::AdHoc;
use rocket::http::Method;
use rocket::{launch, Request};
use rocket_cors::{AllowedHeaders, AllowedOrigins, CorsOptions};
use rocket_db_pools::Database;

/// Custom catcher for 404 errors
#[rocket::catch(404)]
fn not_found(req: &Request) -> rocket::serde::json::Json<models::ApiResponse<()>> {
    use models::ApiResponse;
    rocket::serde::json::Json(ApiResponse::error(&format!(
        "Endpoint '{}' not found. Check /api/health for available routes.",
        req.uri()
    )))
}

/// Custom catcher for 500 errors
#[rocket::catch(500)]
fn internal_error(_req: &Request) -> rocket::serde::json::Json<models::ApiResponse<()>> {
    use models::ApiResponse;
    rocket::serde::json::Json(ApiResponse::error(
        "Internal server error. Please check server logs for details.",
    ))
}

/// Custom catcher for 422 errors (Unprocessable Entity)
#[rocket::catch(422)]
fn unprocessable_entity(_req: &Request) -> rocket::serde::json::Json<models::ApiResponse<()>> {
    use models::ApiResponse;
    rocket::serde::json::Json(ApiResponse::error(
        "Invalid request data. Please check your JSON payload format.",
    ))
}

/// Configure CORS to allow requests from the Next.js frontend
fn configure_cors() -> rocket_cors::Cors {
    let allowed_origins = AllowedOrigins::some_exact(&[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]);

    CorsOptions {
        allowed_origins,
        allowed_methods: vec![
            Method::Get,
            Method::Post,
            Method::Put,
            Method::Delete,
            Method::Options,
        ]
        .into_iter()
        .map(From::from)
        .collect(),
        allowed_headers: AllowedHeaders::some(&[
            "Authorization",
            "Accept",
            "Content-Type",
            "Origin",
            "X-Requested-With",
        ]),
        allow_credentials: true,
        ..Default::default()
    }
    .to_cors()
    .expect("CORS configuration error")
}

/// Verify that all required modules are properly loaded
fn verify_modules() -> Result<(), &'static str> {
    // This function will fail to compile if any module is missing or has errors

    // Verify models module
    let _order: models::Order = models::Order {
        id: None,
        employee_id: None,
        customer_id: None,
        order_date: None,
        shipped_date: None,
        shipper_id: None,
        ship_name: None,
        ship_address: None,
        ship_city: None,
        ship_state_province: None,
        ship_zip_postal_code: None,
        ship_country_region: None,
        shipping_fee: None,
        taxes: None,
        payment_type: None,
        paid_date: None,
        notes: None,
        tax_rate: None,
        tax_status_id: None,
        status_id: None,
    };

    // Verify that ApiResponse works
    let _response = models::ApiResponse::success("test", "Module verification successful");

    println!("✅ All modules loaded and verified successfully");
    Ok(())
}

#[launch]
fn rocket() -> _ {
    // Initialize logging only if not already initialized
    let _ = env_logger::try_init();

    // Only print banner if not in test mode
    if !cfg!(test) {
        println!("╔═══════════════════════════════════════════════════════════════╗");
        println!("║                    NORTHWIND ORDERS API                       ║");
        println!("║                   Built with Rust + Rocket                   ║");
        println!("║               https://github.com/your-username               ║");
        println!("╚═══════════════════════════════════════════════════════════════╝");
    }

    // Verify modules
    if let Err(e) = verify_modules() {
        eprintln!("❌ Module verification failed: {}", e);
        if !cfg!(test) {
            std::process::exit(1);
        }
    }

    // Configure CORS
    let cors = configure_cors();

    // Build and configure Rocket
    rocket::build()
        .attach(cors)
        .attach(AdHoc::on_liftoff("Startup Info", |rocket| {
            Box::pin(async move {
                let config = rocket.config();
                println!("🌟 Northwind Orders API successfully started!");
                println!(
                    "📍 Server running at: http://{}:{}",
                    config.address, config.port
                );
                println!(
                    "🏥 Health check: http://{}:{}/api/health",
                    config.address, config.port
                );
                println!(
                    "📦 Orders API: http://{}:{}/api/orders/",
                    config.address, config.port
                );

                println!("📚 Available endpoints:");
                println!("   GET    /api/health");
                println!("   GET    /api/orders/");
                println!("   GET    /api/orders/<id>");
                println!("   POST   /api/orders/");
                println!("   PUT    /api/orders/<id>");
                println!("   DELETE /api/orders/<id>");
                println!("   GET    /api/orders/customer/<customer_id>");
                println!("   GET    /api/orders/employee/<employee_id>");
                println!("🔓 CORS enabled for localhost:3000, localhost:3001");
                println!("🎯 API is ready to receive requests!");
            })
        }))
        .attach(Db::init())
        .mount("/api/orders", handlers::routes())
        .mount("/api", rocket::routes![handlers::health_check])
        .register(
            "/",
            rocket::catchers![not_found, internal_error, unprocessable_entity],
        )
        .manage(std::sync::Arc::new(std::sync::Mutex::new(
            std::collections::HashMap::<String, String>::new(),
        ))) // For future application state management
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_module_verification() {
        assert!(verify_modules().is_ok());
    }

    #[test]
    fn test_rocket_configuration() {
        // Test that we can build a Rocket instance (without launching)
        let rocket = rocket::build().mount("/api", rocket::routes![handlers::health_check]);

        assert_eq!(rocket.routes().count(), 1);
    }

    #[test]
    fn test_api_response_creation() {
        let success_response = models::ApiResponse::success("test_data", "Success message");
        assert!(success_response.success);
        assert_eq!(success_response.message, "Success message");
        assert!(success_response.data.is_some());

        let error_response: models::ApiResponse<()> = models::ApiResponse::error("Error message");
        assert!(!error_response.success);
        assert_eq!(error_response.message, "Error message");
        assert!(error_response.data.is_none());
    }

    #[test]
    fn test_order_model_creation() {
        let order = models::Order {
            id: Some(1),
            employee_id: Some(1),
            customer_id: Some(123),
            order_date: None,
            shipped_date: None,
            shipper_id: Some(1),
            ship_name: Some("Test Order".to_string()),
            ship_address: None,
            ship_city: None,
            ship_state_province: None,
            ship_zip_postal_code: None,
            ship_country_region: None,
            shipping_fee: Some(rust_decimal::Decimal::from_f64_retain(32.38).unwrap()),
            taxes: Some(rust_decimal::Decimal::from_f64_retain(0.0).unwrap()),
            payment_type: None,
            paid_date: None,
            notes: None,
            tax_rate: Some(0.0),
            tax_status_id: Some(1),
            status_id: Some(0),
        };

        assert_eq!(order.id, Some(1));
        assert_eq!(order.customer_id, Some(123));
    }

    #[test]
    fn test_cors_configuration() {
        let cors = configure_cors();
        // If we get here without panicking, CORS is configured correctly
        assert!(true);
    }
}
