# Proyecto Antigravity - Avance 2

## Descripción
Este proyecto corresponde al **Avance 2** del módulo 3.8 del Instituto Técnico Ricaldone. Consiste en el Front-end de una tienda en línea llamada "Antigravity", desarrollada con React.js. Cuenta con una parte pública orientada al registro e inicio de sesión de clientes, y una parte administrativa (privada) con paneles de control y CRUDs 100% operativos.

## Tecnologías y Herramientas
- **React.js (Vite)**: Biblioteca principal para la interfaz de usuario.
- **Tailwind CSS**: Framework de utilidades CSS para un diseño premium, moderno y responsive.
- **React Router DOM**: Para el enrutamiento y la protección de rutas.
- **React Hook Form**: Para el control eficiente y la validación de formularios.
- **React Hot Toast**: Para notificaciones amigables al usuario (alertas de éxito, error).
- **Lucide React**: Biblioteca de iconos estéticos y modernos.

## Estructura del Proyecto
El proyecto respeta de forma estricta la siguiente estructura de carpetas:

```text
/backend (Reservado para integraciones futuras)
/frontend-private
  /public
  /src
    /api           -> (Mocks de endpoints usando localStorage)
    /assets        -> (Imágenes y otros estáticos)
    /components
      /Auth        -> (Contexto de Autenticación y ProtectedRoute)
      /Categories  -> (Módulo y Custom Hooks)
      /Customers   -> (Módulo y Custom Hooks)
      /Employees   -> (Módulo y Custom Hooks)
      /Orders      -> (Módulo y Custom Hooks)
      /Products    -> (Módulo y Custom Hooks)
      /Layout      -> (AdminLayout con Sidebar y Topbar)
      /UI          -> (Componentes reutilizables: Button, Input)
    /pages         -> (Vistas principales: Home, Login, Register, AdminDashboard)
    /utils         -> (Funciones utilitarias)
```

## Funcionalidades Implementadas
1. **Autenticación (Mock LocalStorage)**: 
   - Login y Registro con validaciones.
   - Protección de rutas: Solo el administrador (`admin@antigravity.com` / `admin123`) puede acceder a `/admin`.
2. **Dashboard Administrativo**: Diseño premium con menú lateral para navegar entre módulos sin recargar la página.
3. **Módulos CRUD Operativos**: 
   - Categorías
   - Productos
   - Clientes
   - Empleados
   - Pedidos
   *Todos los CRUDs utilizan Custom Hooks exclusivos y mantienen la persistencia en el `localStorage` del navegador.*

## Instrucciones de Ejecución

1. Clona este repositorio o descarga el código.
2. Abre una terminal y navega a la carpeta principal del frontend:
   ```bash
   cd frontend-private
   ```
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
4. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre la URL local (usualmente `http://localhost:5173/`) en tu navegador.

## Credenciales de Acceso Administrador
Para probar los módulos privados, inicia sesión con:
- **Correo**: `admin@antigravity.com`
- **Contraseña**: `admin123`

## Equipo de Desarrollo
- Carlos Mario (Front-end Developer)
