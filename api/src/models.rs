use chrono::NaiveDateTime;
use rocket::serde::{Deserialize, Serialize};
use rust_decimal::Decimal;
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(crate = "rocket::serde")]
pub struct Order {
    pub id: Option<i32>,

    pub employee_id: Option<i32>,

    pub customer_id: Option<i32>,

    pub order_date: Option<NaiveDateTime>,

    pub shipped_date: Option<NaiveDateTime>,

    pub shipper_id: Option<i32>,

    pub ship_name: Option<String>,

    pub ship_address: Option<String>,

    pub ship_city: Option<String>,

    pub ship_state_province: Option<String>,

    pub ship_zip_postal_code: Option<String>,

    pub ship_country_region: Option<String>,

    pub shipping_fee: Option<Decimal>,

    pub taxes: Option<Decimal>,

    pub payment_type: Option<String>,

    pub paid_date: Option<NaiveDateTime>,

    pub notes: Option<String>,

    pub tax_rate: Option<f64>,

    pub tax_status_id: Option<i8>,

    pub status_id: Option<i8>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct NewOrder {
    pub employee_id: Option<i32>,

    pub customer_id: Option<i32>,

    pub order_date: Option<NaiveDateTime>,

    pub shipped_date: Option<NaiveDateTime>,

    pub shipper_id: Option<i32>,

    pub ship_name: Option<String>,

    pub ship_address: Option<String>,

    pub ship_city: Option<String>,

    pub ship_state_province: Option<String>,

    pub ship_zip_postal_code: Option<String>,

    pub ship_country_region: Option<String>,

    pub shipping_fee: Option<Decimal>,

    pub taxes: Option<Decimal>,

    pub payment_type: Option<String>,

    pub paid_date: Option<NaiveDateTime>,

    pub notes: Option<String>,

    pub tax_rate: Option<f64>,

    pub tax_status_id: Option<i8>,

    pub status_id: Option<i8>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct UpdateOrder {
    pub employee_id: Option<i32>,

    pub customer_id: Option<i32>,

    pub order_date: Option<NaiveDateTime>,

    pub shipped_date: Option<NaiveDateTime>,

    pub shipper_id: Option<i32>,

    pub ship_name: Option<String>,

    pub ship_address: Option<String>,

    pub ship_city: Option<String>,

    pub ship_state_province: Option<String>,

    pub ship_zip_postal_code: Option<String>,

    pub ship_country_region: Option<String>,

    pub shipping_fee: Option<Decimal>,

    pub taxes: Option<Decimal>,

    pub payment_type: Option<String>,

    pub paid_date: Option<NaiveDateTime>,

    pub notes: Option<String>,

    pub tax_rate: Option<f64>,

    pub tax_status_id: Option<i8>,

    pub status_id: Option<i8>,
}

#[derive(Debug, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: String,
    pub data: Option<T>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T, message: &str) -> Self {
        Self {
            success: true,
            message: message.to_string(),
            data: Some(data),
        }
    }

    pub fn error(message: &str) -> ApiResponse<T> {
        ApiResponse {
            success: false,
            message: message.to_string(),
            data: None,
        }
    }
}
