# Field Mapping Documentation - Northwind Orders API

## Overview

This document explains the field structure used in the Northwind Orders API. The API uses the actual Northwind database schema with **snake_case** field names, providing a direct mapping between the database and API without any conversion layer.

## Database Schema

The `orders` table uses the following structure:

```sql
CREATE TABLE orders (
  id int(11) NOT NULL AUTO_INCREMENT,
  employee_id int(11) DEFAULT NULL,
  customer_id int(11) DEFAULT NULL,
  order_date datetime DEFAULT NULL,
  shipped_date datetime DEFAULT NULL,
  shipper_id int(11) DEFAULT NULL,
  ship_name varchar(50) DEFAULT NULL,
  ship_address longtext DEFAULT NULL,
  ship_city varchar(50) DEFAULT NULL,
  ship_state_province varchar(50) DEFAULT NULL,
  ship_zip_postal_code varchar(50) DEFAULT NULL,
  ship_country_region varchar(50) DEFAULT NULL,
  shipping_fee decimal(19,4) DEFAULT 0.0000,
  taxes decimal(19,4) DEFAULT 0.0000,
  payment_type varchar(50) DEFAULT NULL,
  paid_date datetime DEFAULT NULL,
  notes longtext DEFAULT NULL,
  tax_rate double DEFAULT 0,
  tax_status_id tinyint(4) DEFAULT NULL,
  status_id tinyint(4) DEFAULT 0,
  PRIMARY KEY (id)
);
```

## Complete Field Reference

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `id` | `int(11)` | NOT NULL AUTO_INCREMENT | Unique order identifier (Primary Key) |
| `employee_id` | `int(11)` | DEFAULT NULL | Employee who processed the order |
| `customer_id` | `int(11)` | DEFAULT NULL | Customer who placed the order |
| `order_date` | `datetime` | DEFAULT NULL | Date and time when order was placed |
| `shipped_date` | `datetime` | DEFAULT NULL | Date and time when order was shipped |
| `shipper_id` | `int(11)` | DEFAULT NULL | Shipping company identifier |
| `ship_name` | `varchar(50)` | DEFAULT NULL | Name for shipping |
| `ship_address` | `longtext` | DEFAULT NULL | Complete shipping address |
| `ship_city` | `varchar(50)` | DEFAULT NULL | Shipping city |
| `ship_state_province` | `varchar(50)` | DEFAULT NULL | Shipping state or province |
| `ship_zip_postal_code` | `varchar(50)` | DEFAULT NULL | Shipping postal/ZIP code |
| `ship_country_region` | `varchar(50)` | DEFAULT NULL | Shipping country or region |
| `shipping_fee` | `decimal(19,4)` | DEFAULT 0.0000 | Cost of shipping |
| `taxes` | `decimal(19,4)` | DEFAULT 0.0000 | Tax amount applied to order |
| `payment_type` | `varchar(50)` | DEFAULT NULL | Payment method (Credit Card, Cash, etc.) |
| `paid_date` | `datetime` | DEFAULT NULL | Date when payment was received |
| `notes` | `longtext` | DEFAULT NULL | Additional order notes or comments |
| `tax_rate` | `double` | DEFAULT 0 | Applied tax rate (as float, e.g., 0.08 for 8%) |
| `tax_status_id` | `tinyint(4)` | DEFAULT NULL | Tax status identifier |
| `status_id` | `tinyint(4)` | DEFAULT 0 | Order status identifier |

## Rust Type Mapping

The Rust structs map directly to the database types:

```rust
use rust_decimal::Decimal;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(crate = "rocket::serde")]
pub struct Order {
    pub id: Option<i32>,                    // id int(11)
    pub employee_id: Option<i32>,           // employee_id int(11)
    pub customer_id: Option<i32>,           // customer_id int(11)
    pub order_date: Option<NaiveDateTime>,  // order_date datetime
    pub shipped_date: Option<NaiveDateTime>, // shipped_date datetime
    pub shipper_id: Option<i32>,            // shipper_id int(11)
    pub ship_name: Option<String>,          // ship_name varchar(50)
    pub ship_address: Option<String>,       // ship_address longtext
    pub ship_city: Option<String>,          // ship_city varchar(50)
    pub ship_state_province: Option<String>, // ship_state_province varchar(50)
    pub ship_zip_postal_code: Option<String>, // ship_zip_postal_code varchar(50)
    pub ship_country_region: Option<String>, // ship_country_region varchar(50)
    pub shipping_fee: Option<Decimal>,      // shipping_fee decimal(19,4)
    pub taxes: Option<Decimal>,             // taxes decimal(19,4)
    pub payment_type: Option<String>,       // payment_type varchar(50)
    pub paid_date: Option<NaiveDateTime>,   // paid_date datetime
    pub notes: Option<String>,              // notes longtext
    pub tax_rate: Option<f64>,              // tax_rate double
    pub tax_status_id: Option<i8>,          // tax_status_id tinyint(4)
    pub status_id: Option<i8>,              // status_id tinyint(4)
}
```

## JSON Examples

### Request Example (POST/PUT)
```json
{
  "employee_id": 1,
  "customer_id": 123,
  "order_date": "2024-01-15T10:30:00",
  "shipped_date": null,
  "shipper_id": 1,
  "ship_name": "John Doe",
  "ship_address": "123 Main St, Apt 4B",
  "ship_city": "Boston",
  "ship_state_province": "MA",
  "ship_zip_postal_code": "02101",
  "ship_country_region": "USA",
  "shipping_fee": "15.50",
  "taxes": "1.24",
  "payment_type": "Credit Card",
  "paid_date": null,
  "notes": "Handle with care - fragile items",
  "tax_rate": 0.08,
  "tax_status_id": 1,
  "status_id": 0
}
```

### Response Example (GET)
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": 1001,
    "employee_id": 1,
    "customer_id": 123,
    "order_date": "2024-01-15T10:30:00",
    "shipped_date": "2024-01-17T14:20:00",
    "shipper_id": 1,
    "ship_name": "John Doe",
    "ship_address": "123 Main St, Apt 4B",
    "ship_city": "Boston",
    "ship_state_province": "MA",
    "ship_zip_postal_code": "02101",
    "ship_country_region": "USA",
    "shipping_fee": "15.50",
    "taxes": "1.24",
    "payment_type": "Credit Card",
    "paid_date": "2024-01-16T09:45:00",
    "notes": "Handle with care - fragile items",
    "tax_rate": 0.08,
    "tax_status_id": 1,
    "status_id": 2
  }
}
```

## Decimal Field Handling

### Important Note on Decimal Fields

The API uses `rust_decimal::Decimal` for precise decimal arithmetic, which is essential for financial calculations. This provides exact decimal representation without floating-point precision errors.

#### JSON Format for Decimal Fields
- **In JSON requests/responses**: Decimal values are represented as **strings**
- **Examples**: `"15.50"`, `"0.08"`, `"125.7500"`
- **Precision**: Up to 28 decimal places supported
- **Database mapping**: Direct mapping to `DECIMAL(19,4)` types

#### Decimal Fields in Order Model
- `shipping_fee`: Shipping cost as decimal string
- `taxes`: Tax amount as decimal string  
- `tax_rate`: Tax rate as float number (e.g., 0.08 for 8%)

#### Example Usage
```json
// Correct format - strings for decimals, number for tax_rate
{
  "shipping_fee": "32.38",
  "taxes": "2.59",
  "tax_rate": 0.08
}

// Incorrect format
{
  "shipping_fee": 32.38,    // ❌ Will cause parsing errors (use string)
  "taxes": 2.59,           // ❌ Will cause parsing errors (use string)
  "tax_rate": "0.08"       // ❌ Will cause parsing errors (use number)
}
```

## Status Codes Reference

### Order Status (`status_id`)
| ID | Status | Description |
|----|--------|-------------|
| 0 | New | Order has been created but not processed |
| 1 | On Hold | Order is temporarily paused |
| 2 | Shipped | Order has been shipped |
| 3 | Closed | Order is completed and closed |

### Tax Status (`tax_status_id`)
| ID | Status | Description |
|----|--------|-------------|
| 0 | None | No tax applied |
| 1 | Taxable | Standard tax rate applied |
| 2 | Tax Exempt | Order is exempt from taxes |

## Data Validation Rules

### Required Fields
- None (all fields are optional, `id` is auto-generated)

### Field Constraints
- **id**: Auto-increment, managed by database
- **employee_id, customer_id, shipper_id**: Must reference valid IDs in respective tables
- **ship_name**: Maximum 50 characters
- **ship_city, ship_state_province, ship_zip_postal_code, ship_country_region**: Maximum 50 characters
- **payment_type**: Maximum 50 characters
- **shipping_fee, taxes**: Decimal with up to 4 decimal places
- **tax_rate**: Double precision, typically between 0.0 and 1.0
- **tax_status_id, status_id**: Tiny integers (0-255)

## SQL Query Patterns

### SELECT Queries
```sql
SELECT
    id, employee_id, customer_id, order_date, shipped_date,
    shipper_id, ship_name, ship_address, ship_city,
    ship_state_province, ship_zip_postal_code, ship_country_region,
    shipping_fee, taxes, payment_type, paid_date, notes,
    tax_rate, tax_status_id, status_id
FROM orders
WHERE id = ?
```

### INSERT Queries
```sql
INSERT INTO orders (
    employee_id, customer_id, order_date, shipped_date, shipper_id,
    ship_name, ship_address, ship_city, ship_state_province,
    ship_zip_postal_code, ship_country_region, shipping_fee, taxes,
    payment_type, paid_date, notes, tax_rate, tax_status_id, status_id
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```

### UPDATE Queries
```sql
UPDATE orders SET
    employee_id = COALESCE(?, employee_id),
    customer_id = COALESCE(?, customer_id),
    order_date = COALESCE(?, order_date),
    shipped_date = COALESCE(?, shipped_date),
    -- ... other fields
    status_id = COALESCE(?, status_id)
WHERE id = ?
```

## Benefits of Direct Mapping

1. **Simplicity**: No transformation layer between API and database
2. **Performance**: Direct field access without conversion overhead
3. **Consistency**: Field names match exactly between API and database
4. **Transparency**: Developers can easily understand the data structure
5. **Maintenance**: Single source of truth for field definitions

## Common Usage Patterns

### Creating a Basic Order
```json
{
  "employee_id": 1,
  "customer_id": 123,
  "ship_name": "Customer Name",
  "status_id": 0
}
```

### Updating Order Status
```json
{
  "status_id": 2,
  "shipped_date": "2024-01-20T10:30:00"
}
```

### Adding Payment Information
```json
{
  "payment_type": "Credit Card",
  "paid_date": "2024-01-18T14:25:00",
  "taxes": "12.50",
  "tax_rate": 0.08,
  "tax_status_id": 1
}
```

## Migration and Evolution

When database schema changes are needed:

1. **Adding Fields**: Add to database schema, then update Rust structs
2. **Removing Fields**: Update Rust structs first, then remove from database
3. **Renaming Fields**: Requires coordinated update of both API and database
4. **Type Changes**: Update Rust types to match new database types

## Testing Field Mappings

Use the provided `examples.http` file to test all field mappings:

```bash
# Test complete order creation
POST http://localhost:8000/api/orders/
Content-Type: application/json

{
  "employee_id": 1,
  "customer_id": 123,
  "order_date": "2024-01-15T10:30:00",
  "ship_name": "Test Customer",
  "shipping_fee": "25.00",
  "taxes": "2.00",
  "tax_rate": 0.08,
  "status_id": 0
}
```

## Future Considerations

- **Indexing**: Consider adding indexes for frequently queried fields (employee_id, customer_id, status_id)
- **Constraints**: Add foreign key constraints for referential integrity
- **Validation**: Implement business logic validation in the service layer
- **Audit Trail**: Consider adding created_at/updated_at timestamps for audit purposes