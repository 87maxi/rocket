use chrono::NaiveDateTime;
use rocket::serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(crate = "rocket::serde")]
pub struct Order {
    #[serde(rename = "orderID")]
    pub order_id: Option<i32>,

    #[serde(rename = "customerID")]
    pub customer_id: Option<String>,

    #[serde(rename = "employeeID")]
    pub employee_id: Option<i32>,

    #[serde(rename = "orderDate")]
    pub order_date: Option<NaiveDateTime>,

    #[serde(rename = "requiredDate")]
    pub required_date: Option<NaiveDateTime>,

    #[serde(rename = "shippedDate")]
    pub shipped_date: Option<NaiveDateTime>,

    #[serde(rename = "shipVia")]
    pub ship_via: Option<i32>,

    pub freight: Option<f64>,

    #[serde(rename = "shipName")]
    pub ship_name: Option<String>,

    #[serde(rename = "shipAddress")]
    pub ship_address: Option<String>,

    #[serde(rename = "shipCity")]
    pub ship_city: Option<String>,

    #[serde(rename = "shipRegion")]
    pub ship_region: Option<String>,

    #[serde(rename = "shipPostalCode")]
    pub ship_postal_code: Option<String>,

    #[serde(rename = "shipCountry")]
    pub ship_country: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct NewOrder {
    #[serde(rename = "customerID")]
    pub customer_id: Option<String>,

    #[serde(rename = "employeeID")]
    pub employee_id: Option<i32>,

    #[serde(rename = "orderDate")]
    pub order_date: Option<NaiveDateTime>,

    #[serde(rename = "requiredDate")]
    pub required_date: Option<NaiveDateTime>,

    #[serde(rename = "shippedDate")]
    pub shipped_date: Option<NaiveDateTime>,

    #[serde(rename = "shipVia")]
    pub ship_via: Option<i32>,

    pub freight: Option<f64>,

    #[serde(rename = "shipName")]
    pub ship_name: Option<String>,

    #[serde(rename = "shipAddress")]
    pub ship_address: Option<String>,

    #[serde(rename = "shipCity")]
    pub ship_city: Option<String>,

    #[serde(rename = "shipRegion")]
    pub ship_region: Option<String>,

    #[serde(rename = "shipPostalCode")]
    pub ship_postal_code: Option<String>,

    #[serde(rename = "shipCountry")]
    pub ship_country: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct UpdateOrder {
    #[serde(rename = "customerID")]
    pub customer_id: Option<String>,

    #[serde(rename = "employeeID")]
    pub employee_id: Option<i32>,

    #[serde(rename = "orderDate")]
    pub order_date: Option<NaiveDateTime>,

    #[serde(rename = "requiredDate")]
    pub required_date: Option<NaiveDateTime>,

    #[serde(rename = "shippedDate")]
    pub shipped_date: Option<NaiveDateTime>,

    #[serde(rename = "shipVia")]
    pub ship_via: Option<i32>,

    pub freight: Option<f64>,

    #[serde(rename = "shipName")]
    pub ship_name: Option<String>,

    #[serde(rename = "shipAddress")]
    pub ship_address: Option<String>,

    #[serde(rename = "shipCity")]
    pub ship_city: Option<String>,

    #[serde(rename = "shipRegion")]
    pub ship_region: Option<String>,

    #[serde(rename = "shipPostalCode")]
    pub ship_postal_code: Option<String>,

    #[serde(rename = "shipCountry")]
    pub ship_country: Option<String>,
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
