# STREET FLEX — Tienda en línea

[![Licencia: CC BY-NC-SA 4.0](https://img.shields.io/badge/Licencia-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)

Tienda en línea de ropa y accesorios hecha por estudiantes de **3.er año de Desarrollo de Software, Instituto Técnico Ricaldone**. Es un sistema completo con tres partes que comparten la misma base de datos:

| Carpeta | Qué es | Tecnología |
|---|---|---|
| [`backendST/`](backendST) | API REST | Node.js, Express 5, MongoDB Atlas (Mongoose), JWT |
| [`frontend/`](frontend) | Tienda web y panel de administración | React 19 (Vite) |
| [`movil/`](movil) | **Aplicación móvil Android/iOS** (entrega del Módulo 5) | React Native, Expo SDK 54 |

## Equipo de desarrollo

- Carlos Mario
- Andrés Emanuel
- Marco Alejandro
- Javier Eliezer

**Docente:** Daniel Wilfredo Granados Hernández · **Módulo 5:** Desarrollo de componentes para dispositivos móviles.

## Licencia

Este proyecto se publica bajo la licencia **Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**: se puede copiar, adaptar y compartir citando al equipo, sin fines comerciales y manteniendo la misma licencia. Texto completo en [`LICENSE`](LICENSE) y en <https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es>.

---

## Aplicación móvil (`movil/`)

Cliente móvil de la tienda. Consume la API de `backendST/` con la función nativa `fetch`.

### Funcionalidades

- Inicio de sesión (la sesión se guarda y se restaura al abrir la app) y **registro** con verificación de correo por código de 6 dígitos.
- **Edición del perfil** (nombre, usuario, teléfono y edad).
- **Recuperación de contraseña** con un código que llega al correo.
- **Catálogo** de productos con valoraciones, filtro por categoría (menú lateral con subcategorías) y búsqueda.
- **Detalle del producto**: elegir talla y color, ver comentarios y valorar (solo si ya se compró).
- **Carrito de compras** y compra con control de inventario (no deja comprar más de lo que hay).
- **Historial de pedidos** con detalle, **cancelación** de pedidos pendientes (el stock vuelve a estar disponible) y favoritos.
- Pantalla de carga (splash) personalizada y saludo con el nombre real del usuario en Home.

### Dependencias instaladas

Aplicación móvil (`movil/package.json`):

| Paquete | Para qué |
|---|---|
| `expo` ~54, `react-native` 0.81, `react` 19 | Base del proyecto |
| `@react-navigation/native`, `native-stack`, `bottom-tabs` | Navegación: pila de pantallas + menú de pestañas inferior |
| `react-native-screens`, `react-native-safe-area-context` | Requeridas por la navegación |
| `expo-secure-store` | Guardar la sesión (token) de forma segura |
| `expo-image` | Mostrar las fotos de producto (WebP de Cloudinary) |
| `expo-status-bar`, `expo-build-properties` | Barra de estado y propiedades de la compilación Android |
| `lucide-react-native`, `react-native-svg`, `@expo/vector-icons` | Iconos |
| `react-dom`, `react-native-web` | Solo para probar la app en el navegador (`npm run web`) |

Backend (`backendST/package.json`): `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `cookie-parser`, `dotenv`, `nodemailer`, `multer` + `cloudinary`, `replicate`.

### Configuración adicional

1. **Backend con su `.env`**: copiar `backendST/.env.example` como `backendST/.env` y completar los valores (base de datos, `JWT_SECRET`, correo de Gmail con *contraseña de aplicación*, Cloudinary). El `.env` real **no se sube a GitHub**.
2. **Dirección del backend en la app**: se define con la variable `EXPO_PUBLIC_API_URL` (ver `movil/.env.example`). Si no se define, el emulador de Android usa `http://10.0.2.2:4000/api`.
3. **Android sin HTTPS**: `app.json` habilita `usesCleartextTraffic` (vía `expo-build-properties`) para poder probar contra una IP local. Con el backend desplegado con HTTPS no se usa.
4. **Datos de prueba**: `node backendST/seedMovilDemo.js` (productos, categorías y banners) y `node backendST/seedMovilUsuarios.js` (clientes con pedidos y valoraciones).

### Cómo correr todo en local

```bash
# Terminal 1 — backend (puerto 4000)
cd backendST
npm install
npm run dev

# Terminal 2 — app móvil
cd movil
npm install
npm run android        # abre el emulador / dispositivo conectado
```

Cuentas de demostración (ya verificadas, con pedidos y valoraciones): `ana.demo@streetflex.test`, `luis.demo@streetflex.test`, `sofia.demo@streetflex.test`, todas con contraseña `Demo1234`.

### Desplegar el backend (Render)

El APK instalado en un celular necesita un backend con dirección pública. Pasos con [Render](https://render.com) (plan gratuito):

1. En **MongoDB Atlas → Network Access**, permitir `0.0.0.0/0` (Render no tiene IP fija).
2. **Correo por API (obligatorio en Render gratis).** Render bloquea el envío por SMTP (puertos 25/465/587) en el plan gratuito, así que el Gmail del `.env` no puede mandar los códigos de verificación y recuperación desde allí. Se usa [Brevo](https://www.brevo.com) (gratis, no pide dominio propio):
   1. Crear la cuenta → **Senders, Domains & Dedicated IPs → Senders → Add a sender** con el mismo correo de `USER_EMAIL` y confirmarlo desde el correo que llega.
   2. **SMTP & API → API Keys → Generate a new API key** y copiarla.
3. En Render: **New → Blueprint**, elegir este repositorio. Render lee [`render.yaml`](render.yaml) y crea el servicio `streetflex-api`.
4. Completar las variables que Render pide: `DB_URI`, `USER_EMAIL`, `BREVO_API_KEY` (la del paso 2), `CLOUDINARY_*`, `REPLICATE_API_TOKEN`, `FRONTEND_URL`. `JWT_SECRET` se genera solo. `USER_PASSWORD` (la contraseña de aplicación de Gmail) no hace falta en Render: solo se usa en local.
5. Cuando termine, probar `https://TU-SERVICIO.onrender.com/api/health` (debe responder `{"ok":true}`).

> El plan gratuito "duerme" el servidor tras 15 minutos sin uso; la primera petición tarda ~1 minuto. La app lo "despierta" mientras muestra la pantalla de carga.

### Generar el APK

Requisitos: Node, JDK 17 y el SDK de Android (el de Android Studio).

```powershell
cd movil
powershell -ExecutionPolicy Bypass -File .\scripts\generar-apk.ps1 -ApiUrl "https://TU-SERVICIO.onrender.com/api"
```

Sale en `movil/apk/StreetFlex.apk`. Para compartirlo: subirlo a **GitHub → Releases** del repositorio o a Google Drive.

**Descarga del APK:** _(pegar aquí el enlace)_

### Estructura de carpetas de la app

```
movil/
├── App.js                 # Solo arma los providers y el navegador
├── app.json               # Nombre, iconos, splash, paquete Android
├── scripts/generar-apk.ps1
└── src/
    ├── api/               # Una función por endpoint (fetch)
    ├── components/        # Componentes reutilizables (ui/, product/)
    ├── context/           # AuthContext (sesión) y CartContext (carrito)
    ├── hooks/             # useAuth, useSplashTimer
    ├── navigation/        # RootNavigator (pila) y TabMenu (pestañas)
    ├── screens/           # Una pantalla por archivo (account/ para Mi cuenta)
    ├── theme/             # Colores
    └── utils/             # Validaciones, almacenamiento, formato
```

Convenciones: inglés y `camelCase` para variables y funciones; `PascalCase` para componentes (`ProductCard`, `TextField`...) y archivos de pantalla con sufijo `Screen`. Los campos que vienen de la API (`product_name`, `full_name`...) se dejan como los define el modelo.

---

## Backend y web

- API: `cd backendST && npm install && npm run dev` (puerto 4000). Rutas en [`backendST/src/routes`](backendST/src/routes).
- Web: `cd frontend && npm install && npm run dev` (puerto 5173, usa el proxy `/api`).
- Para ser administrador hay que crear el usuario con `node backendST/createAdminScript.js`.
