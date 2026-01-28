use crate::models::{NewOrder, Order, UpdateOrder};

use rocket_db_pools::sqlx::{MySqlConnection, MySqlPool, Row};
use rocket_db_pools::{sqlx, Connection};

pub type DbPool = MySqlPool;
pub type DbConnection = Connection<DbPool>;

pub struct OrderService;

impl OrderService {
    pub async fn get_all_orders(conn: &mut MySqlConnection) -> Result<Vec<Order>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT
                OrderID,
                CustomerID,
                EmployeeID,
                OrderDate,
                RequiredDate,
                ShippedDate,
                ShipVia,
                Freight,
                ShipName,
                ShipAddress,
                ShipCity,
                ShipRegion,
                ShipPostalCode,
                ShipCountry
            FROM orders
            ORDER BY OrderID DESC
            "#,
        )
        .fetch_all(conn)
        .await?;

        let mut orders = Vec::new();
        for row in rows {
            orders.push(Order {
                order_id: row.get("OrderID"),
                customer_id: row.get("CustomerID"),
                employee_id: row.get("EmployeeID"),
                order_date: row.get("OrderDate"),
                required_date: row.get("RequiredDate"),
                shipped_date: row.get("ShippedDate"),
                ship_via: row.get("ShipVia"),
                freight: row.get("Freight"),
                ship_name: row.get("ShipName"),
                ship_address: row.get("ShipAddress"),
                ship_city: row.get("ShipCity"),
                ship_region: row.get("ShipRegion"),
                ship_postal_code: row.get("ShipPostalCode"),
                ship_country: row.get("ShipCountry"),
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
                OrderID,
                CustomerID,
                EmployeeID,
                OrderDate,
                RequiredDate,
                ShippedDate,
                ShipVia,
                Freight,
                ShipName,
                ShipAddress,
                ShipCity,
                ShipRegion,
                ShipPostalCode,
                ShipCountry
            FROM orders
            WHERE OrderID = ?
            "#,
        )
        .bind(order_id)
        .fetch_optional(conn)
        .await?;

        match row {
            Some(r) => Ok(Some(Order {
                order_id: r.get("OrderID"),
                customer_id: r.get("CustomerID"),
                employee_id: r.get("EmployeeID"),
                order_date: r.get("OrderDate"),
                required_date: r.get("RequiredDate"),
                shipped_date: r.get("ShippedDate"),
                ship_via: r.get("ShipVia"),
                freight: r.get("Freight"),
                ship_name: r.get("ShipName"),
                ship_address: r.get("ShipAddress"),
                ship_city: r.get("ShipCity"),
                ship_region: r.get("ShipRegion"),
                ship_postal_code: r.get("ShipPostalCode"),
                ship_country: r.get("ShipCountry"),
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
                CustomerID, EmployeeID, OrderDate, RequiredDate, ShippedDate,
                ShipVia, Freight, ShipName, ShipAddress, ShipCity,
                ShipRegion, ShipPostalCode, ShipCountry
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&new_order.customer_id)
        .bind(&new_order.employee_id)
        .bind(&new_order.order_date)
        .bind(&new_order.required_date)
        .bind(&new_order.shipped_date)
        .bind(&new_order.ship_via)
        .bind(&new_order.freight)
        .bind(&new_order.ship_name)
        .bind(&new_order.ship_address)
        .bind(&new_order.ship_city)
        .bind(&new_order.ship_region)
        .bind(&new_order.ship_postal_code)
        .bind(&new_order.ship_country)
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
                CustomerID = COALESCE(?, CustomerID),
                EmployeeID = COALESCE(?, EmployeeID),
                OrderDate = COALESCE(?, OrderDate),
                RequiredDate = COALESCE(?, RequiredDate),
                ShippedDate = COALESCE(?, ShippedDate),
                ShipVia = COALESCE(?, ShipVia),
                Freight = COALESCE(?, Freight),
                ShipName = COALESCE(?, ShipName),
                ShipAddress = COALESCE(?, ShipAddress),
                ShipCity = COALESCE(?, ShipCity),
                ShipRegion = COALESCE(?, ShipRegion),
                ShipPostalCode = COALESCE(?, ShipPostalCode),
                ShipCountry = COALESCE(?, ShipCountry)
            WHERE OrderID = ?
            "#,
        )
        .bind(&update_order.customer_id)
        .bind(&update_order.employee_id)
        .bind(&update_order.order_date)
        .bind(&update_order.required_date)
        .bind(&update_order.shipped_date)
        .bind(&update_order.ship_via)
        .bind(&update_order.freight)
        .bind(&update_order.ship_name)
        .bind(&update_order.ship_address)
        .bind(&update_order.ship_city)
        .bind(&update_order.ship_region)
        .bind(&update_order.ship_postal_code)
        .bind(&update_order.ship_country)
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
        let result = sqlx::query("DELETE FROM orders WHERE OrderID = ?")
            .bind(order_id)
            .execute(conn)
            .await?;

        Ok(result.rows_affected() > 0)
    }

    pub async fn get_orders_by_customer(
        conn: &mut MySqlConnection,
        customer_id: &str,
    ) -> Result<Vec<Order>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT
                OrderID,
                CustomerID,
                EmployeeID,
                OrderDate,
                RequiredDate,
                ShippedDate,
                ShipVia,
                Freight,
                ShipName,
                ShipAddress,
                ShipCity,
                ShipRegion,
                ShipPostalCode,
                ShipCountry
            FROM orders
            WHERE CustomerID = ?
            ORDER BY OrderDate DESC
            "#,
        )
        .bind(customer_id)
        .fetch_all(conn)
        .await?;

        let mut orders = Vec::new();
        for row in rows {
            orders.push(Order {
                order_id: row.get("OrderID"),
                customer_id: row.get("CustomerID"),
                employee_id: row.get("EmployeeID"),
                order_date: row.get("OrderDate"),
                required_date: row.get("RequiredDate"),
                shipped_date: row.get("ShippedDate"),
                ship_via: row.get("ShipVia"),
                freight: row.get("Freight"),
                ship_name: row.get("ShipName"),
                ship_address: row.get("ShipAddress"),
                ship_city: row.get("ShipCity"),
                ship_region: row.get("ShipRegion"),
                ship_postal_code: row.get("ShipPostalCode"),
                ship_country: row.get("ShipCountry"),
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
                OrderID,
                CustomerID,
                EmployeeID,
                OrderDate,
                RequiredDate,
                ShippedDate,
                ShipVia,
                Freight,
                ShipName,
                ShipAddress,
                ShipCity,
                ShipRegion,
                ShipPostalCode,
                ShipCountry
            FROM orders
            WHERE EmployeeID = ?
            ORDER BY OrderDate DESC
            "#,
        )
        .bind(employee_id)
        .fetch_all(conn)
        .await?;

        let mut orders = Vec::new();
        for row in rows {
            orders.push(Order {
                order_id: row.get("OrderID"),
                customer_id: row.get("CustomerID"),
                employee_id: row.get("EmployeeID"),
                order_date: row.get("OrderDate"),
                required_date: row.get("RequiredDate"),
                shipped_date: row.get("ShippedDate"),
                ship_via: row.get("ShipVia"),
                freight: row.get("Freight"),
                ship_name: row.get("ShipName"),
                ship_address: row.get("ShipAddress"),
                ship_city: row.get("ShipCity"),
                ship_region: row.get("ShipRegion"),
                ship_postal_code: row.get("ShipPostalCode"),
                ship_country: row.get("ShipCountry"),
            });
        }

        Ok(orders)
    }
}
