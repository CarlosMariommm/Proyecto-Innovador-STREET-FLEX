# Proyecto StreetFlex - Avance 3

## Descripción
Este proyecto corresponde al **Avance 3** del módulo 3.8 del Instituto Técnico Ricaldone. Es una aplicación fullstack desacoplada para una tienda en línea. Cuenta con un **Backend RESTful** construido con Node.js y Express conectado a MongoDB Atlas, y un **Frontend** construido con React.js (Vite) que consume la API mediante `fetch`. La comunicación entre ambas partes se maneja a través de **JWT almacenado en cookies HttpOnly** para garantizar seguridad en la autenticación.

---

## Tecnologías y Herramientas

### Backend
- **Node.js + Express**: Servidor HTTP y API RESTful bajo el patrón MVC.
- **Mongoose**: ODM para modelado de datos y conexión a MongoDB.
- **MongoDB Atlas**: Base de datos NoSQL en la nube.
- **JSON Web Token (JWT)**: Autenticación con tokens almacenados en cookies `httpOnly`.
- **bcryptjs**: Hash seguro de contraseñas.
- **Cloudinary + Multer**: Gestión y subida de imágenes de productos a servidor externo.
- **express-rate-limit**: Middleware de protección contra ataques de fuerza bruta.
- **cookie-parser**: Lectura de cookies en las peticiones del servidor.
- **CORS**: Habilitado exclusivamente para los orígenes `localhost:5173` y `localhost:5174`.

### Frontend
- **React.js (Vite)**: Biblioteca principal para la interfaz de usuario.
- **Tailwind CSS v4**: Framework de utilidades CSS para un diseño premium y responsive.
- **React Router DOM**: Enrutamiento declarativo y protección de rutas privadas.
- **React Hook Form**: Gestión y validación eficiente de formularios.
- **React Hot Toast**: Notificaciones visuales (toasts) para confirmar acciones al usuario.
- **Lucide React**: Biblioteca de iconos modernos.
- **Fetch API (nativa)**: Comunicación HTTP con el backend con `credentials: 'include'` para cookies.

---

## Estructura del Proyecto

```text
/Proyecto-Innovador-STREET-FLEX
│
├── /backend                        → Servidor de la API RESTful
│   ├── app.js                      → Configuración de Express, middlewares y rutas
│   ├── .env                        → Variables de entorno (DB, JWT, Cloudinary)
│   └── /src
│       ├── /config
│       │   └── db.js               → Conexión a MongoDB Atlas con Mongoose
│       ├── /controllers            → Lógica de negocio (objetos planos, ES Modules)
│       │   ├── auth.controller.js
│       │   ├── category.controller.js
│       │   ├── product.controller.js
│       │   ├── customer.controller.js
│       │   ├── employee.controller.js
│       │   ├── order.controller.js
│       │   └── dashboard.controller.js
│       ├── /models                 → Esquemas de Mongoose (timestamps: true, strict: false)
│       │   ├── User.js
│       │   ├── Category.js
│       │   ├── Product.js
│       │   └── Order.js
│       ├── /routes                 → Endpoints con .route() encadenado
│       │   ├── auth.routes.js
│       │   ├── category.routes.js
│       │   ├── product.routes.js
│       │   ├── customer.routes.js
│       │   ├── employee.routes.js
│       │   ├── order.routes.js
│       │   └── dashboard.routes.js
│       ├── /middlewares
│       │   └── auth.middleware.js  → Protección de rutas con JWT desde cookies
│       └── /utils
│           ├── cloudinary.js       → Configuración de Multer + Cloudinary
│           └── generateToken.js    → Generación y seteo de cookie JWT
│
└── /frontend-private               → Aplicación React conectada al backend
    └── /src
        ├── /api
        │   └── auth.js             → Funciones fetch para Login, Registro y Logout
        ├── /components
        │   ├── /Auth               → AuthContext (useContext) y ProtectedRoute
        │   ├── /Categories         → Módulo CRUD + useCategories (Custom Hook)
        │   ├── /Customers          → Módulo CRUD + useCustomers (Custom Hook)
        │   ├── /Employees          → Módulo CRUD + useEmployees (Custom Hook)
        │   ├── /Orders             → Módulo CRUD + useOrders (Custom Hook)
        │   ├── /Products           → Módulo CRUD + useProducts (Custom Hook, FormData)
        │   ├── /Layout             → AdminLayout con Sidebar y Topbar
        │   └── /UI                 → Componentes reutilizables: Button, Input
        ├── /hooks
        │   └── useDashboard.js     → Métricas del panel desde /api/dashboard
        └── /pages
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── AdminDashboard.jsx  → Panel con métricas y pedidos recientes en tiempo real
            └── /admin
                ├── Categories.jsx
                ├── Products.jsx
                ├── Customers.jsx
                ├── Employees.jsx
                └── Orders.jsx
```

---

## Endpoints de la API

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registra un nuevo usuario |
| POST | `/api/auth/login` | Público | Inicia sesión y emite cookie JWT |
| POST | `/api/auth/logout` | Autenticado | Cierra sesión limpiando la cookie |
| GET | `/api/categories` | Público | Lista todas las categorías |
| POST / PUT / DELETE | `/api/categories/:id` | Admin | CRUD de categorías |
| GET | `/api/products` | Público | Lista todos los productos |
| POST / PUT / DELETE | `/api/products/:id` | Admin | CRUD de productos (imagen vía Cloudinary) |
| GET / POST | `/api/customers` | Admin | Lista y crea clientes |
| GET / PUT / DELETE | `/api/customers/:id` | Admin | CRUD de clientes |
| GET / POST | `/api/employees` | Admin | Lista y crea empleados |
| GET / PUT / DELETE | `/api/employees/:id` | Admin | CRUD de empleados |
| GET / POST | `/api/orders` | Autenticado | Lista y crea pedidos |
| GET / PUT / DELETE | `/api/orders/:id` | Admin | Gestión de pedidos |
| GET | `/api/dashboard` | Admin | Métricas consolidadas del panel |

---

## Instrucciones de Ejecución

Necesitas tener **dos terminales** abiertas simultáneamente.

### Terminal 1 — Backend

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Crea el archivo `.env` con las variables necesarias (ver sección de Variables de Entorno).
3. Instala las dependencias (solo la primera vez):
   ```bash
   npm install
   ```
4. Levanta el servidor:
   ```bash
   node app.js
   ```
   Deberías ver: `Server running on port 5000` y `MongoDB Connected: ...`

### Terminal 2 — Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd frontend-private
   ```
2. Instala las dependencias (solo la primera vez):
   ```bash
   npm install
   ```
3. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:5173/` (o `5174/`) en el navegador.

---

## Variables de Entorno (`backend/.env`)

```env
DB_URI="mongodb+srv://USUARIO:CONTRASEÑA@cluster.mongodb.net/streetFlexDB?retryWrites=true&w=majority"
JWT_secret_key="tu_clave_secreta_jwt"

CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
```

> ⚠️ **Importante**: Asegúrate de agregar tu IP actual al Network Access de MongoDB Atlas para que la conexión funcione.

---

## Primer Acceso como Administrador

Para acceder al panel administrativo, debes:
1. **Registrarte** en la app (`/register`).
2. Ir a **MongoDB Atlas → Collections → Users** y cambiar el campo `role` de `customer` a `admin`.
3. **Iniciar sesión** con ese correo y contraseña.

---

## Equipo de Desarrollo
- Carlos Mario
- Andrés Emanuel
- Marco Alejandro
- Javier Eliezer