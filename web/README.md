# Northwind Orders - Web UI

Interfaz de usuario para la API de Northwind Orders construida con **Next.js 16** y **Tailwind CSS 4**.

## 🚀 Características

- ✅ **Listado de Órdenes**: Vista de todas las órdenes con paginación
- ✅ **Crear Orden**: Formulario completo para nuevas órdenes
- ✅ **Editar Orden**: Modificar órdenes existentes
- ✅ **Eliminar Orden**: Eliminar órdenes con confirmación
- ✅ **Ver Detalles**: Vista detallada de cada orden
- ✅ **Filtros**: Filtrar por Cliente ID o Empleado ID
- ✅ **Health Check**: Indicador de estado de la API
- ✅ **Modo Oscuro**: Soporte completo para dark mode
- ✅ **Responsive**: Diseño adaptable a móviles y desktop

## 📁 Estructura del Proyecto

```
web/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── Alert.tsx        # Alertas de notificación
│   │   ├── LoadingSpinner.tsx
│   │   ├── OrderCard.tsx    # Tarjeta de orden
│   │   ├── OrderForm.tsx    # Formulario crear/editar
│   │   └── index.ts
│   ├── lib/
│   │   └── api.ts           # Cliente API
│   ├── orders/
│   │   ├── page.tsx         # Lista de órdenes
│   │   ├── new/
│   │   │   └── page.tsx     # Crear orden
│   │   └── [id]/
│   │       ├── page.tsx     # Detalle de orden
│   │       └── edit/
│   │           └── page.tsx # Editar orden
│   ├── types/
│   │   └── order.ts         # TypeScript interfaces
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Página principal
├── public/
├── package.json
└── README.md
```

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar producción
npm start
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# URL de la API Rocket (por defecto: http://localhost:8000)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Endpoints de la API

La UI se conecta a los siguientes endpoints:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/orders/` | Listar órdenes |
| `GET` | `/api/orders/{id}` | Obtener orden |
| `POST` | `/api/orders/` | Crear orden |
| `PUT` | `/api/orders/{id}` | Actualizar orden |
| `DELETE` | `/api/orders/{id}` | Eliminar orden |
| `GET` | `/api/orders/customer/{id}` | Por cliente |
| `GET` | `/api/orders/employee/{id}` | Por empleado |

## 📱 Páginas

### Página Principal (`/`)
- Hero con descripción del proyecto
- Características de la API
- Lista de endpoints disponibles

### Lista de Órdenes (`/orders`)
- Tabla/Cards con todas las órdenes
- Filtros por cliente o empleado
- Indicador de estado de la API
- Botón para crear nueva orden

### Nueva Orden (`/orders/new`)
- Formulario completo con todos los campos
- Validación de datos
- Redirección automática tras crear

### Detalle de Orden (`/orders/[id]`)
- Información completa de la orden
- Datos de cliente y empleado
- Información de envío
- Datos financieros
- Botones de editar y eliminar

### Editar Orden (`/orders/[id]/edit`)
- Formulario pre-llenado con datos actuales
- Actualización de cualquier campo

## 🎨 Componentes

### `OrderCard`
Muestra una orden en formato tarjeta con:
- Estado de la orden (badge de color)
- Información del cliente/empleado
- Dirección de envío
- Costos
- Acciones (ver, editar, eliminar)

### `OrderForm`
Formulario reutilizable para crear/editar con campos:
- IDs (customer, employee, shipper)
- Fechas (order, shipped, paid)
- Dirección de envío
- Información financiera
- Estado y notas

### `Alert`
Notificaciones con tipos:
- `success` - Verde
- `error` - Rojo
- `warning` - Amarillo
- `info` - Azul

### `LoadingSpinner`
Indicador de carga con tamaños: `sm`, `md`, `lg`

## 🔧 Tecnologías

- **Next.js 16** - Framework React
- **React 19** - UI Library
- **Tailwind CSS 4** - Estilos
- **TypeScript 5** - Tipado estático

## 📊 Modelo de Datos

```typescript
interface Order {
  id: number | null;
  employee_id: number | null;
  customer_id: number | null;
  order_date: string | null;
  shipped_date: string | null;
  shipper_id: number | null;
  ship_name: string | null;
  ship_address: string | null;
  ship_city: string | null;
  ship_state_province: string | null;
  ship_zip_postal_code: string | null;
  ship_country_region: string | null;
  shipping_fee: string | null;
  taxes: string | null;
  payment_type: string | null;
  paid_date: string | null;
  notes: string | null;
  tax_rate: number | null;
  tax_status_id: number | null;
  status_id: number | null;
}
```

## 🚦 Estados de Orden

| ID | Estado | Color |
|----|--------|-------|
| 0 | New | 🔵 Azul |
| 1 | Invoiced | 🟡 Amarillo |
| 2 | Shipped | 🟢 Verde |
| 3 | Closed | ⚫ Gris |

## 🔗 Integración con API

La UI se comunica con la API Rocket a través del cliente en `app/lib/api.ts`:

```typescript
import { ordersApi } from '@/app/lib/api';

// Obtener todas las órdenes
const response = await ordersApi.getAllOrders();

// Crear orden
const response = await ordersApi.createOrder(newOrder);

// Actualizar orden
const response = await ordersApi.updateOrder(id, updateData);

// Eliminar orden
const response = await ordersApi.deleteOrder(id);
```

## 📝 Licencia

Este proyecto es parte del ejemplo Northwind Orders API con Rocket (Rust) + Next.js.