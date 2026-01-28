use crate::models::{ApiResponse, NewOrder, Order, UpdateOrder};
use crate::services::OrderService;
use rocket::serde::json::Json;
use rocket::{delete, get, post, put, routes, Route};
use rocket_db_pools::sqlx::MySqlPool;
use rocket_db_pools::{Connection, Database};

#[derive(Database)]
#[database("northwind")]
pub struct Db(MySqlPool);

#[get("/")]
pub async fn get_all_orders(mut db: Connection<Db>) -> Json<ApiResponse<Vec<Order>>> {
    match OrderService::get_all_orders(&mut **db).await {
        Ok(orders) => Json(ApiResponse::success(
            orders,
            "Orders retrieved successfully",
        )),
        Err(e) => {
            eprintln!("Error retrieving orders: {:?}", e);
            Json(ApiResponse::error("Failed to retrieve orders"))
        }
    }
}

#[get("/<order_id>")]
pub async fn get_order_by_id(mut db: Connection<Db>, order_id: i32) -> Json<ApiResponse<Order>> {
    match OrderService::get_order_by_id(&mut **db, order_id).await {
        Ok(Some(order)) => Json(ApiResponse::success(order, "Order found successfully")),
        Ok(None) => Json(ApiResponse::error("Order not found")),
        Err(e) => {
            eprintln!("Error retrieving order {}: {:?}", order_id, e);
            Json(ApiResponse::error("Failed to retrieve order"))
        }
    }
}

#[post("/", data = "<new_order>")]
pub async fn create_order(
    mut db: Connection<Db>,
    new_order: Json<NewOrder>,
) -> Json<ApiResponse<Order>> {
    match OrderService::create_order(&mut **db, new_order.into_inner()).await {
        Ok(order) => Json(ApiResponse::success(order, "Order created successfully")),
        Err(e) => {
            eprintln!("Error creating order: {:?}", e);
            Json(ApiResponse::error("Failed to create order"))
        }
    }
}

#[put("/<order_id>", data = "<update_order>")]
pub async fn update_order(
    mut db: Connection<Db>,
    order_id: i32,
    update_order: Json<UpdateOrder>,
) -> Json<ApiResponse<Order>> {
    match OrderService::update_order(&mut **db, order_id, update_order.into_inner()).await {
        Ok(Some(order)) => Json(ApiResponse::success(order, "Order updated successfully")),
        Ok(None) => Json(ApiResponse::error("Order not found")),
        Err(e) => {
            eprintln!("Error updating order {}: {:?}", order_id, e);
            Json(ApiResponse::error("Failed to update order"))
        }
    }
}

#[delete("/<order_id>")]
pub async fn delete_order(mut db: Connection<Db>, order_id: i32) -> Json<ApiResponse<()>> {
    match OrderService::delete_order(&mut **db, order_id).await {
        Ok(true) => Json(ApiResponse::success((), "Order deleted successfully")),
        Ok(false) => Json(ApiResponse::error("Order not found")),
        Err(e) => {
            eprintln!("Error deleting order {}: {:?}", order_id, e);
            Json(ApiResponse::error("Failed to delete order"))
        }
    }
}

#[get("/customer/<customer_id>")]
pub async fn get_orders_by_customer(
    mut db: Connection<Db>,
    customer_id: i32,
) -> Json<ApiResponse<Vec<Order>>> {
    match OrderService::get_orders_by_customer(&mut **db, customer_id).await {
        Ok(orders) => Json(ApiResponse::success(
            orders,
            "Orders retrieved successfully for customer",
        )),
        Err(e) => {
            eprintln!(
                "Error retrieving orders for customer {}: {:?}",
                customer_id, e
            );
            Json(ApiResponse::error("Failed to retrieve orders for customer"))
        }
    }
}

#[get("/employee/<employee_id>")]
pub async fn get_orders_by_employee(
    mut db: Connection<Db>,
    employee_id: i32,
) -> Json<ApiResponse<Vec<Order>>> {
    match OrderService::get_orders_by_employee(&mut **db, employee_id).await {
        Ok(orders) => Json(ApiResponse::success(
            orders,
            "Orders retrieved successfully for employee",
        )),
        Err(e) => {
            eprintln!(
                "Error retrieving orders for employee {}: {:?}",
                employee_id, e
            );
            Json(ApiResponse::error("Failed to retrieve orders for employee"))
        }
    }
}

#[get("/health")]
pub async fn health_check() -> Json<ApiResponse<String>> {
    Json(ApiResponse::success(
        "API is running".to_string(),
        "Health check passed",
    ))
}

pub fn routes() -> Vec<Route> {
    routes![
        health_check,
        get_all_orders,
        get_order_by_id,
        create_order,
        update_order,
        delete_order,
        get_orders_by_customer,
        get_orders_by_employee,
    ]
}
