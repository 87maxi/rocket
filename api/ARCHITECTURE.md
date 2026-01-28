# Arquitectura del Proyecto Northwind Orders API

## Resumen Ejecutivo

Este proyecto implementa una API REST completa para la gestión de pedidos (orders) de la base de datos Northwind utilizando Rust con el framework Rocket. La arquitectura sigue patrones modernos de desarrollo con separación clara de responsabilidades y enfoque en seguridad de tipos.

## Stack Tecnológico

### Core Framework
- **Rust 1.70+**: Lenguaje de programación principal
- **Rocket 0.5**: Framework web asíncrono y tipo-seguro
- **Tokio**: Runtime asíncrono para operaciones concurrentes

### Base de Datos
- **SQLx 0.7**: Driver y query builder para MySQL/MariaDB
- **MariaDB/MySQL**: Sistema de gestión de base de datos
- **Rocket DB Pools**: Pool de conexiones integrado con Rocket

### Serialización y Datos
- **Serde**: Serialización/deserialización JSON
- **Chrono**: Manejo de fechas y tiempo

## Arquitectura del Sistema

```
┌─────────────────────────────────────────┐
│              HTTP Client                │
└─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│            Rocket Server                │
│  ┌─────────────────────────────────┐    │
│  │        HTTP Layer               │    │
│  │   (handlers.rs)                 │    │
│  │  - Request/Response handling    │    │
│  │  - JSON serialization          │    │
│  │  - HTTP status codes           │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│          Business Logic                 │
│  ┌─────────────────────────────────┐    │
│  │      Service Layer              │    │
│  │    (services.rs)                │    │
│  │  - CRUD operations              │    │
│  │  - Query logic                  │    │
│  │  - Business rules               │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│          Data Layer                     │
│  ┌─────────────────────────────────┐    │
│  │       SQLx + Connection Pool    │    │
│  │  - Database queries             │    │
│  │  - Connection management        │    │
│  │  - Transaction handling         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│        MariaDB/MySQL Database           │
│           (Northwind Schema)            │
└─────────────────────────────────────────┘
```

## Estructura de Módulos

### 1. `main.rs` - Punto de Entrada
```rust
// Configuración principal del servidor Rocket
// - Inicialización de pool de base de datos
// - Montaje de rutas HTTP
// - Configuración de middleware
```

### 2. `models.rs` - Capa de Datos
```rust
// Estructuras de datos y DTOs
#[derive(Serialize, Deserialize, FromRow)]
pub struct Order { ... }           // Modelo principal
pub struct NewOrder { ... }        // DTO para creación
pub struct UpdateOrder { ... }     // DTO para actualización  
pub struct ApiResponse<T> { ... }  // Response wrapper
```

### 3. `handlers.rs` - Capa de Controladores
```rust
// Endpoints HTTP y manejo de requests/responses
#[get("/")]                        // GET all orders
#[get("/<id>")]                   // GET order by ID
#[post("/", data = "<order>")]    // CREATE new order
#[put("/<id>", data = "<order>")] // UPDATE order
#[delete("/<id>")]                // DELETE order
```

### 4. `services.rs` - Capa de Servicios
```rust
// Lógica de negocio y operaciones de base de datos
impl OrderService {
    pub async fn get_all_orders(...)      // Listar todos
    pub async fn get_order_by_id(...)     // Obtener por ID
    pub async fn create_order(...)        // Crear nuevo
    pub async fn update_order(...)        // Actualizar existente
    pub async fn delete_order(...)        // Eliminar
    pub async fn get_orders_by_customer(...) // Filtrar por cliente
    pub async fn get_orders_by_employee(...) // Filtrar por empleado
}
```

## Patrones de Diseño Implementados

### 1. Repository Pattern
- `OrderService` actúa como repositorio para operaciones de datos
- Abstracción de la lógica de acceso a datos
- Separación clara entre lógica de negocio y persistencia

### 2. DTO Pattern
- `NewOrder` y `UpdateOrder` como Data Transfer Objects
- Validación de entrada separada del modelo de dominio
- Flexibilidad en la API sin exponer estructura interna

### 3. Response Wrapper Pattern
```rust
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: String,
    pub data: Option<T>,
}
```

### 4. Dependency Injection
- Pool de conexiones inyectado automáticamente por Rocket
- Testabilidad mejorada y acoplamiento reducido

## Endpoints de la API

### CRUD Básico
- `GET /api/orders/` - Listar todos los pedidos
- `GET /api/orders/{id}` - Obtener pedido por ID
- `POST /api/orders/` - Crear nuevo pedido
- `PUT /api/orders/{id}` - Actualizar pedido
- `DELETE /api/orders/{id}` - Eliminar pedido

### Endpoints Especializados
- `GET /api/orders/customer/{customerID}` - Pedidos por cliente
- `GET /api/orders/employee/{employeeID}` - Pedidos por empleado
- `GET /api/health` - Health check de la API

## Manejo de Errores

### Estrategia de Errores
1. **Database Errors**: Capturados y convertidos a respuestas HTTP apropiadas
2. **Validation Errors**: Manejados por Rocket automáticamente
3. **Business Logic Errors**: Envueltos en `ApiResponse` con mensajes descriptivos

### Códigos de Estado HTTP
- `200 OK` - Operación exitosa
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## Configuración

### `Rocket.toml`
```toml
[default]
port = 8000
address = "127.0.0.1"

[default.databases.northwind]
url = "mysql://root:@localhost:3306/northwind"
min_connections = 1
max_connections = 16
```

### Variables de Entorno
- `DATABASE_URL` - URL de conexión a base de datos
- `ROCKET_PORT` - Puerto del servidor (opcional)
- `RUST_LOG` - Nivel de logging (opcional)

## Características de Seguridad

### Tipo Safety
- Rust garantiza memory safety sin garbage collector
- Sistema de tipos previene many common vulnerabilities
- Compile-time verification de queries (opcional con SQLx macros)

### Database Security
- Prepared statements para prevenir SQL injection
- Connection pooling para manejo eficiente de recursos
- Validación automática de tipos en queries

## Performance

### Async/Await
- Operaciones de I/O no bloqueantes
- Concurrencia eficiente con Tokio runtime
- Escalabilidad mejorada comparado con threads tradicionales

### Connection Pooling
- Reutilización de conexiones de base de datos
- Configuración de min/max connections
- Timeout automático para conexiones idle

### Memory Management
- Zero-copy deserialization donde es posible
- Stack allocation por defecto (no heap allocation)
- Predictable memory usage patterns

## Testing Strategy

### Unit Tests
```bash
cargo test
```

### Integration Tests
- Tests contra base de datos real
- Verificación de endpoints completos
- Validation de serialization/deserialization

### Manual Testing
- `examples.http` con requests de prueba
- Script `start.sh` con verificaciones automáticas
- Health check endpoint para monitoring

## Deployment

### Development
```bash
./start.sh          # Con verificaciones automáticas
cargo run           # Ejecución directa
```

### Production
```bash
cargo build --release
./target/release/northwind-orders-api
```

### Docker (Futuro)
```dockerfile
# Multi-stage build para optimizar tamaño
FROM rust:1.70 as builder
# ... build steps
FROM debian:bookworm-slim
# ... runtime setup
```

## Escalabilidad y Extensiones Futuras

### Horizontal Scaling
- Stateless design permite múltiples instancias
- Load balancer compatible
- Database connection pooling preparado para réplicas

### Funcionalidades Adicionales
- [ ] Autenticación y autorización (JWT)
- [ ] Paginación en listados grandes
- [ ] Filtros avanzados y búsqueda
- [ ] Audit logging
- [ ] Rate limiting
- [ ] OpenAPI/Swagger documentation
- [ ] GraphQL endpoint
- [ ] Caching layer (Redis)
- [ ] Metrics y observability

### Database Evolution
- [ ] Migrations con SQLx
- [ ] Database versioning
- [ ] Read replicas support
- [ ] Sharding strategy

## Monitoring y Observability

### Logging
- Structured logging con `tracing`
- Configurable log levels
- Request/response logging

### Health Checks
- Database connectivity check
- Application health endpoint
- Resource usage monitoring

### Metrics (Futuro)
- Request latency
- Database query performance
- Error rates
- Connection pool statistics

## Contribución y Desarrollo

### Code Style
- `cargo fmt` para formateo automático
- `cargo clippy` para linting
- Rust idioms y best practices

### Documentation
- Inline documentation con `///`
- README comprehensivo
- Architecture documentation (este archivo)
- API examples para testing manual

## Conclusión

Esta arquitectura proporciona una base sólida, escalable y mantenible para una API REST moderna. El uso de Rust garantiza performance y safety, mientras que Rocket proporciona una API ergonómica para desarrollo web. La separación clara de responsabilidades facilita testing, mantenimiento y futuras extensiones.