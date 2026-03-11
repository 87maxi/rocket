# Northwind Orders Management System

![Descripción](assets/northwind_crud.png)

Este proyecto es un **caso de estudio full-stack** que demuestra la implementación de una arquitectura moderna utilizando **Rust (Rocket)** para el backend y **Next.js** para el frontend. El sistema permite la gestión integral de órdenes de la base de datos clásica "Northwind".

## 🚀 Arquitectura del Proyecto

El proyecto está dividido en tres componentes principales:

1.  **Backend (`/api`)**: API REST robusta construida con Rust y el framework Rocket.
2.  **Frontend (`/web`)**: Interfaz de usuario moderna construida con Next.js y Tailwind CSS.
3.  **Database (`/northwind-db`)**: Instancia de MariaDB/MySQL que contiene el esquema de datos de Northwind.

---

## 🛠️ Funcionalidades

- **CRUD Completo de Órdenes**: Creación, lectura, actualización y eliminación de registros de ventas.
- **Consultas Especializadas**: Filtrado de órdenes por `customer_id` y `employee_id`.
- **Health Check**: Endpoint dedicado para monitoreo del estado de la API.
- **CORS Configurado**: Soporte nativo para comunicación entre el frontend y backend en diferentes puertos.
- **Tipado Fuerte**: Modelos de datos compartidos y validados en ambos extremos.
- **Manejo de Decimales**: Uso de `rust_decimal` para precisión financiera en `shipping_fee` y `taxes`.

---

## 📦 Dependencias Principales

### Backend (Rust)
- `rocket (0.5)`: Framework web asíncrono.
- `sqlx (0.7)`: Driver de base de datos con soporte para MariaDB/MySQL y consultas en tiempo de compilación.
- `serde`: Serialización/deserialización de JSON.
- `chrono`: Gestión de fechas y tiempos.
- `rust_decimal`: Manejo preciso de valores monetarios.
- `rocket_cors`: Middleware para Cross-Origin Resource Sharing.

### Frontend (Next.js)
- `next (16.1.6)`: Framework de React para aplicaciones web.
- `react (19.2.3)`: Biblioteca para la UI.
- `tailwindcss (4)`: Framework de utilidades CSS.
- `typescript`: Tipado estático para JavaScript.

---

## 📊 Diagrama de Clases (Backend)

El siguiente diagrama representa la estructura de datos y servicios implementada en la API de Rust:

```mermaid
classDiagram
    class Order {
        +Option~i32~ id
        +Option~i32~ employee_id
        +Option~i32~ customer_id
        +Option~NaiveDateTime~ order_date
        +Option~Decimal~ shipping_fee
        +Option~String~ ship_name
        +Option~i8~ status_id
    }

    class ApiResponse~T~ {
        +bool success
        +String message
        +Option~T~ data
        +success(data: T, message: &str) ApiResponse
        +error(message: &str) ApiResponse
    }

    class OrderService {
        +get_all_orders(conn) Result~Vec~Order~~
        +get_order_by_id(conn, id) Result~Option~Order~~
        +create_order(conn, new_order) Result~Order~
        +update_order(conn, id, update_order) Result~Option~Order~~
        +delete_order(conn, id) Result~bool~
    }

    class Handlers {
        +get_all_orders() Json
        +get_order_by_id() Json
        +create_order() Json
        +health_check() Json
    }

    OrderService ..> Order : Gestiona
    Handlers ..> OrderService : Invoca
    Handlers ..> ApiResponse : Retorna
```

---

## 🛠️ Instrucciones para Inicio en Desarrollo

Sigue estos pasos para levantar el entorno completo localmente:

### 1. Requisitos Previos
- Docker y Docker Compose.
- Rust (Cargo) instalado.
- Node.js (v18 o superior) y npm.

### 2. Base de Datos (Infraestructura)
Levanta el contenedor de MariaDB con los datos pre-cargados:
```bash
docker-compose up -d
```
*La base de datos estará disponible en `localhost:3306` con el usuario `user` y contraseña `password`.*

### 3. Backend (API)
Configura y ejecuta el servidor de Rust:
```bash
cd api
# Revisa que el archivo Rocket.toml tenga la URL de conexión correcta:
# url = "mysql://user:password@localhost:3306/northwind"

cargo run
```
La API se iniciará en `http://localhost:8000`.

### 4. Frontend (Web)
Instala las dependencias y lanza el servidor de desarrollo:
```bash
cd web
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:3000`.

---

## 🔌 Endpoints de la API

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Estado del servidor |
| `GET` | `/api/orders` | Lista todas las órdenes |
| `GET` | `/api/orders/<id>` | Obtiene una orden por su ID |
| `POST` | `/api/orders` | Crea una nueva orden |
| `PUT` | `/api/orders/<id>` | Actualiza una orden existente |
| `DELETE` | `/api/orders/<id>` | Elimina una orden |
| `GET` | `/api/orders/customer/<id>` | Órdenes por cliente |
| `GET` | `/api/orders/employee/<id>` | Órdenes por empleado |

---

## 📝 Notas del Caso de Estudio
- **Conexiones**: Se utiliza un pool de conexiones gestionado por `rocket_db_pools`.
- **Snake Case**: La API utiliza convención `snake_case` para mantener consistencia entre el esquema de la base de datos y la serialización JSON.
- **Validación**: El backend incluye catchers personalizados para errores 404, 500 y 422, asegurando que las respuestas siempre sigan el formato de `ApiResponse`.
