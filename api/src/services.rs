use crate::models::{NewOrder, Order, UpdateOrder};

use rocket_db_pools::sqlx;
use rocket_db_pools::sqlx::{MySqlConnection, Row};

pub struct OrderService;

impl OrderService {
    pub async fn get_all_orders(conn: &mut MySqlConnection) -> Result<Vec<Order>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT
                id,
                employee_id,
                customer_id,
                order_date,
                shipped_date,
                shipper_id,
                ship_name,
                ship_address,
                ship_city,
                ship_state_province,
                ship_zip_postal_code,
                ship_country_region,
                shipping_fee,
                taxes,
                payment_type,
                paid_date,
                notes,
                tax_rate,
                tax_status_id,
                status_id
            FROM orders
            ORDER BY id DESC
            "#,
        )
        .fetch_all(conn)
        .await?;

        let mut orders = Vec::new();
        for row in rows {
            orders.push(Order {
                id: row.get("id"),
                employee_id: row.get("employee_id"),
                customer_id: row.get("customer_id"),
                order_date: row.get("order_date"),
                shipped_date: row.get("shipped_date"),
                shipper_id: row.get("shipper_id"),
                ship_name: row.get("ship_name"),
                ship_address: row.get("ship_address"),
                ship_city: row.get("ship_city"),
                ship_state_province: row.get("ship_state_province"),
                ship_zip_postal_code: row.get("ship_zip_postal_code"),
                ship_country_region: row.get("ship_country_region"),
                shipping_fee: row.get("shipping_fee"),
                taxes: row.get("taxes"),
                payment_type: row.get("payment_type"),
                paid_date: row.get("paid_date"),
                notes: row.get("notes"),
                tax_rate: row.get("tax_rate"),
                tax_status_id: row.get("tax_status_id"),
                status_id: row.get("status_id"),
            });
        }

        Ok(orders)
    }

    pub async fn get_order_by_id(
        conn: &mut MySqlConnection,
        order_id: i32,
    ) -> Result<Option<Order>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT
                id,
                employee_id,
                customer_id,
                order_date,
                shipped_date,
                shipper_id,
                ship_name,
                ship_address,
                ship_city,
                ship_state_province,
                ship_zip_postal_code,
                ship_country_region,
                shipping_fee,
                taxes,
                payment_type,
                paid_date,
                notes,
                tax_rate,
                tax_status_id,
                status_id
            FROM orders
            WHERE id = ?
            "#,
        )
        .bind(order_id)
        .fetch_optional(conn)
        .await?;

        match row {
            Some(r) => Ok(Some(Order {
                id: r.get("id"),
                employee_id: r.get("employee_id"),
                customer_id: r.get("customer_id"),
                order_date: r.get("order_date"),
                shipped_date: r.get("shipped_date"),
                shipper_id: r.get("shipper_id"),
                ship_name: r.get("ship_name"),
                ship_address: r.get("ship_address"),
                ship_city: r.get("ship_city"),
                ship_state_province: r.get("ship_state_province"),
                ship_zip_postal_code: r.get("ship_zip_postal_code"),
                ship_country_region: r.get("ship_country_region"),
                shipping_fee: r.get("shipping_fee"),
                taxes: r.get("taxes"),
                payment_type: r.get("payment_type"),
                paid_date: r.get("paid_date"),
                notes: r.get("notes"),
                tax_rate: r.get("tax_rate"),
                tax_status_id: r.get("tax_status_id"),
                status_id: r.get("status_id"),
            })),
            None => Ok(None),
        }
    }

    pub async fn create_order(
        conn: &mut MySqlConnection,
        new_order: NewOrder,
    ) -> Result<Order, sqlx::Error> {
        let result = sqlx::query(
            r#"
            INSERT INTO orders (
                employee_id,
                customer_id,
                order_date,
                shipped_date,
                shipper_id,
                ship_name,
                ship_address,
                ship_city,
                ship_state_province,
                ship_zip_postal_code,
                ship_country_region,
                shipping_fee,
                taxes,
                payment_type,
                paid_date,
                notes,
                tax_rate,
                tax_status_id,
                status_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&new_order.employee_id)
        .bind(&new_order.customer_id)
        .bind(&new_order.order_date)
        .bind(&new_order.shipped_date)
        .bind(&new_order.shipper_id)
        .bind(&new_order.ship_name)
        .bind(&new_order.ship_address)
        .bind(&new_order.ship_city)
        .bind(&new_order.ship_state_province)
        .bind(&new_order.ship_zip_postal_code)
        .bind(&new_order.ship_country_region)
        .bind(&new_order.shipping_fee)
        .bind(&new_order.taxes)
        .bind(&new_order.payment_type)
        .bind(&new_order.paid_date)
        .bind(&new_order.notes)
        .bind(&new_order.tax_rate)
        .bind(&new_order.tax_status_id)
        .bind(&new_order.status_id)
        .execute(&mut *conn)
        .await?;

        let order_id = result.last_insert_id() as i32;

        // Fetch the created order
        let created_order = Self::get_order_by_id(conn, order_id).await?;

        match created_order {
            Some(order) => Ok(order),
            None => Err(sqlx::Error::RowNotFound),
        }
    }

    pub async fn update_order(
        conn: &mut MySqlConnection,
        order_id: i32,
        update_order: UpdateOrder,
    ) -> Result<Option<Order>, sqlx::Error> {
        let result = sqlx::query(
            r#"
            UPDATE orders SET
                employee_id = COALESCE(?, employee_id),
                customer_id = COALESCE(?, customer_id),
                order_date = COALESCE(?, order_date),
                shipped_date = COALESCE(?, shipped_date),
                shipper_id = COALESCE(?, shipper_id),
                ship_name = COALESCE(?, ship_name),
                ship_address = COALESCE(?, ship_address),
                ship_city = COALESCE(?, ship_city),
                ship_state_province = COALESCE(?, ship_state_province),
                ship_zip_postal_code = COALESCE(?, ship_zip_postal_code),
                ship_country_region = COALESCE(?, ship_country_region),
                shipping_fee = COALESCE(?, shipping_fee),
                taxes = COALESCE(?, taxes),
                payment_type = COALESCE(?, payment_type),
                paid_date = COALESCE(?, paid_date),
                notes = COALESCE(?, notes),
                tax_rate = COALESCE(?, tax_rate),
                tax_status_id = COALESCE(?, tax_status_id),
                status_id = COALESCE(?, status_id)
            WHERE id = ?
            "#,
        )
        .bind(&update_order.employee_id)
        .bind(&update_order.customer_id)
        .bind(&update_order.order_date)
        .bind(&update_order.shipped_date)
        .bind(&update_order.shipper_id)
        .bind(&update_order.ship_name)
        .bind(&update_order.ship_address)
        .bind(&update_order.ship_city)
        .bind(&update_order.ship_state_province)
        .bind(&update_order.ship_zip_postal_code)
        .bind(&update_order.ship_country_region)
        .bind(&update_order.shipping_fee)
        .bind(&update_order.taxes)
        .bind(&update_order.payment_type)
        .bind(&update_order.paid_date)
        .bind(&update_order.notes)
        .bind(&update_order.tax_rate)
        .bind(&update_order.tax_status_id)
        .bind(&update_order.status_id)
        .bind(order_id)
        .execute(&mut *conn)
        .await?;

        if result.rows_affected() > 0 {
            Self::get_order_by_id(conn, order_id).await
        } else {
            Ok(None)
        }
    }

    pub async fn delete_order(
        conn: &mut MySqlConnection,
        order_id: i32,
    ) -> Result<bool, sqlx::Error> {
        let result = sqlx::query("DELETE FROM orders WHERE id = ?")
            .bind(order_id)
            .execute(conn)
            .await?;

        Ok(result.rows_affected() > 0)
    }

    pub async fn get_orders_by_customer(
        conn: &mut MySqlConnection,
        customer_id: i32,
    ) -> Result<Vec<Order>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT
                id,
                employee_id,
                customer_id,
                order_date,
                shipped_date,
                shipper_id,
                ship_name,
                ship_address,
                ship_city,
                ship_state_province,
                ship_zip_postal_code,
                ship_country_region,
                shipping_fee,
                taxes,
                payment_type,
                paid_date,
                notes,
                tax_rate,
                tax_status_id,
                status_id
            FROM orders
            WHERE customer_id = ?
            ORDER BY order_date DESC
            "#,
        )
        .bind(customer_id)
        .fetch_all(conn)
        .await?;

        let mut orders = Vec::new();
        for row in rows {
            orders.push(Order {
                id: row.get("id"),
                employee_id: row.get("employee_id"),
                customer_id: row.get("customer_id"),
                order_date: row.get("order_date"),
                shipped_date: row.get("shipped_date"),
                shipper_id: row.get("shipper_id"),
                ship_name: row.get("ship_name"),
                ship_address: row.get("ship_address"),
                ship_city: row.get("ship_city"),
                ship_state_province: row.get("ship_state_province"),
                ship_zip_postal_code: row.get("ship_zip_postal_code"),
                ship_country_region: row.get("ship_country_region"),
                shipping_fee: row.get("shipping_fee"),
                taxes: row.get("taxes"),
                payment_type: row.get("payment_type"),
                paid_date: row.get("paid_date"),
                notes: row.get("notes"),
                tax_rate: row.get("tax_rate"),
                tax_status_id: row.get("tax_status_id"),
                status_id: row.get("status_id"),
            });
        }

        Ok(orders)
    }

    pub async fn get_orders_by_employee(
        conn: &mut MySqlConnection,
        employee_id: i32,
    ) -> Result<Vec<Order>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT
                id,
                employee_id,
                customer_id,
                order_date,
                shipped_date,
                shipper_id,
                ship_name,
                ship_address,
                ship_city,
                ship_state_province,
                ship_zip_postal_code,
                ship_country_region,
                shipping_fee,
                taxes,
                payment_type,
                paid_date,
                notes,
                tax_rate,
                tax_status_id,
                status_id
            FROM orders
            WHERE employee_id = ?
            ORDER BY order_date DESC
            "#,
        )
        .bind(employee_id)
        .fetch_all(conn)
        .await?;

        let mut orders = Vec::new();
        for row in rows {
            orders.push(Order {
                id: row.get("id"),
                employee_id: row.get("employee_id"),
                customer_id: row.get("customer_id"),
                order_date: row.get("order_date"),
                shipped_date: row.get("shipped_date"),
                shipper_id: row.get("shipper_id"),
                ship_name: row.get("ship_name"),
                ship_address: row.get("ship_address"),
                ship_city: row.get("ship_city"),
                ship_state_province: row.get("ship_state_province"),
                ship_zip_postal_code: row.get("ship_zip_postal_code"),
                ship_country_region: row.get("ship_country_region"),
                shipping_fee: row.get("shipping_fee"),
                taxes: row.get("taxes"),
                payment_type: row.get("payment_type"),
                paid_date: row.get("paid_date"),
                notes: row.get("notes"),
                tax_rate: row.get("tax_rate"),
                tax_status_id: row.get("tax_status_id"),
                status_id: row.get("status_id"),
            });
        }

        Ok(orders)
    }
}
