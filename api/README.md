# Northwind Orders API

Una API REST construida con Rust y Rocket para gestionar pedidos de la base de datos Northwind con MariaDB.

## Características

- 🚀 **Rocket Framework**: Framework web rápido y tipo-seguro
- 🗄️ **MariaDB/MySQL**: Conexión a base de datos Northwind
- 📝 **CRUD Completo**: Crear, leer, actualizar y eliminar pedidos
- 🔍 **Consultas Avanzadas**: Buscar por cliente y empleado
- 📊 **Respuestas JSON**: API RESTful con respuestas estructuradas
- ⚡ **Async/Await**: Operaciones asíncronas para mejor rendimiento
- 🛡️ **Seguridad de Tipos**: Validación en tiempo de compilación
- 🔄 **Conexión Pool**: Pool de conexiones para mejor rendimiento

## Prerequisitos

- Rust 1.70+ con Cargo
- MariaDB/MySQL 8.0+ o compatible
- Base de datos Northwind disponible
- Cliente MySQL para verificación (opcional)

## Configuración Rápida

### 1. Instalar Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### 2. Configurar Base de Datos
Asegúrate de que MariaDB/MySQL esté ejecutándose con la base de datos Northwind:
```bash
# Verificar conexión
mysql -u root -p -e "SHOW DATABASES;"

# Debe aparecer 'northwind' en la lista
mysql -u root -p -e "USE northwind; SHOW TABLES;"
```

### 3. Configurar Proyecto
```bash
# Clonar/navegar al directorio del proyecto
cd northwind-orders-api

# Copiar configuración de ejemplo
cp .env.example .env

# Editar configuración si es necesario
nano Rocket.toml  # o tu editor preferido
```

### 4. Ejecutar con Script
```bash
# Usar el script de inicio (recomendado)
./start.sh
```

O ejecutar manualmente:
```bash
# Compilar e instalar dependencias
cargo build

# Ejecutar la aplicación
cargo run
```

La API estará disponible en `http://localhost:8000`

## Endpoints

### Health Check
- **GET** `/api/health` - Verificar estado de la API

### Operaciones CRUD de Pedidos

#### Obtener todos los pedidos
- **GET** `/api/orders/`
- **Respuesta**: Lista de todos los pedidos

#### Obtener pedido por ID
- **GET** `/api/orders/{id}`
- **Parámetros**: 
  - `id` (int): ID del pedido
- **Respuesta**: Pedido específico o error si no existe

#### Crear nuevo pedido
- **POST** `/api/orders/`
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "customerID": "ALFKI",
  "employeeID": 1,
  "orderDate": "2024-01-15T10:30:00",
  "requiredDate": "2024-02-15T10:30:00",
  "shippedDate": null,
  "shipVia": 1,
  "freight": 32.38,
  "shipName": "Alfreds Futterkiste",
  "shipAddress": "Obere Str. 57",
  "shipCity": "Berlin",
  "shipRegion": null,
  "shipPostalCode": "12209",
  "shipCountry": "Germany"
}
```

#### Actualizar pedido
- **PUT** `/api/orders/{id}`
- **Content-Type**: `application/json`
- **Body**: Campos a actualizar (todos opcionales)
```json
{
  "freight": 45.50,
  "shippedDate": "2024-01-20T14:30:00"
}
```

#### Eliminar pedido
- **DELETE** `/api/orders/{id}`
- **Parámetros**: 
  - `id` (int): ID del pedido a eliminar

### Consultas Especializadas

#### Obtener pedidos por cliente
- **GET** `/api/orders/customer/{customerID}`
- **Parámetros**: 
  - `customerID` (string): ID del cliente

#### Obtener pedidos por empleado
- **GET** `/api/orders/employee/{employeeID}`
- **Parámetros**: 
  - `employeeID` (int): ID del empleado

## Formato de Respuesta

Todas las respuestas siguen el siguiente formato:

```json
{
  "success": true,
  "message": "Descripción de la operación",
  "data": { /* datos del resultado */ }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "data": null
}
```

## Ejemplos de Uso

### Usando curl

```bash
# Health check
curl http://localhost:8000/api/health

# Obtener todos los pedidos
curl http://localhost:8000/api/orders/

# Obtener pedido específico
curl http://localhost:8000/api/orders/10248

# Crear nuevo pedido
curl -X POST http://localhost:8000/api/orders/ \
  -H "Content-Type: application/json" \
  -d '{
    "customerID": "ALFKI",
    "employeeID": 1,
    "orderDate": "2024-01-15T10:30:00",
    "freight": 32.38,
    "shipName": "Test Order"
  }'

# Actualizar pedido
curl -X PUT http://localhost:8000/api/orders/10248 \
  -H "Content-Type: application/json" \
  -d '{
    "freight": 45.50
  }'

# Eliminar pedido
curl -X DELETE http://localhost:8000/api/orders/10248

# Obtener pedidos por cliente
curl http://localhost:8000/api/orders/customer/ALFKI

# Obtener pedidos por empleado
curl http://localhost:8000/api/orders/employee/1
```

## Estructura del Proyecto

```
northwind-orders-api/
├── src/
│   ├── main.rs          # Punto de entrada, configuración de Rocket
│   ├── handlers.rs      # Controladores HTTP y endpoints REST
│   ├── services.rs      # Lógica de negocio y operaciones de BD
│   └── models.rs        # Estructuras de datos y modelos
├── Rocket.toml          # Configuración de Rocket y base de datos
├── Cargo.toml           # Dependencias y metadatos del proyecto
├── README.md            # Documentación del proyecto
├── examples.http        # Ejemplos de requests HTTP para testing
├── start.sh            # Script de inicio con verificaciones
└── .env.example        # Plantilla de variables de entorno
```

### Descripción de Módulos

- **`main.rs`**: Configuración principal de Rocket, montaje de rutas y inicialización de la base de datos
- **`handlers.rs`**: Endpoints HTTP que manejan requests/responses y validación
- **`services.rs`**: Capa de servicios con lógica de negocio y operaciones CRUD
- **`models.rs`**: Definición de estructuras de datos, DTOs y responses de API

## Modelo de Datos

La estructura `Order` incluye los siguientes campos:

- `orderID`: ID único del pedido (auto-generado)
- `customerID`: ID del cliente
- `employeeID`: ID del empleado que procesó el pedido
- `orderDate`: Fecha del pedido
- `requiredDate`: Fecha requerida de entrega
- `shippedDate`: Fecha de envío
- `shipVia`: ID del transportista
- `freight`: Costo de envío
- `shipName`: Nombre para envío
- `shipAddress`: Dirección de envío
- `shipCity`: Ciudad de envío
- `shipRegion`: Región de envío
- `shipPostalCode`: Código postal
- `shipCountry`: País de envío

## Desarrollo

### Ejecutar en modo desarrollo
```bash
# Con script (incluye verificaciones)
./start.sh

# O directamente
cargo run
```

### Ejecutar con logs detallados
```bash
RUST_LOG=debug cargo run
```

### Ejecutar tests
```bash
cargo test
```

### Compilar para producción
```bash
cargo build --release

# El binario estará en target/release/northwind-orders-api
```

### Formato de código
```bash
cargo fmt
```

### Linting
```bash
cargo clippy
```

## Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que MariaDB esté ejecutándose
systemctl status mariadb  # o mysql

# Verificar puerto
netstat -tlnp | grep :3306

# Probar conexión manual
mysql -h localhost -u root -p -e "USE northwind; SELECT COUNT(*) FROM orders;"
```

### Error de compilación SQLx
Si obtienes errores relacionados con SQLx, configura:
```bash
export DATABASE_URL="mysql://root:@localhost:3306/northwind"
```

### Puerto en uso
Si el puerto 8000 está ocupado, modifica `Rocket.toml`:
```toml
[default]
port = 8080  # o cualquier puerto libre
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Soporte

Para reportar bugs o solicitar nuevas funcionalidades, por favor abre un issue en el repositorio.