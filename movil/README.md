# STREET FLEX — App Móvil

Avance (~50%) de la aplicación móvil del proyecto **STREET FLEX** (Módulo 5: Desarrollo de componentes para dispositivos móviles, Instituto Técnico Ricaldone). Es el cliente móvil de la misma tienda en línea que ya tiene web en `../frontend` y backend en `../backendST`: consume la misma API REST, sin backend propio.

## Equipo de desarrollo
- Carlos Mario
- Andrés Emanuel
- Marco Alejandro
- Javier Eliezer

## Stack y por qué

| Herramienta | Uso |
|---|---|
| **Expo (~54) + React Native 0.81** | El proyecto y su runtime. |
| **@react-navigation/native-stack + bottom-tabs** | Navegación: un Stack para el flujo completo (splash, sesión, detalle, carrito, checkout) y un Tab dentro para los 4 apartados principales. |
| **expo-secure-store** | Guardar el token de sesión (Keychain en iOS, KeyStore en Android) — el equivalente móvil de `localStorage`. |
| **expo-image** | Mostrar las fotos de producto (vienen de Cloudinary en `.webp`); decodifica mejor que el `Image` nativo. |
| **lucide-react-native** | Los mismos iconos que usa `frontend/` (`lucide-react`) en su versión nativa. |
| **fetch nativo (sin axios)** | React Native ya lo trae; `src/api/api.js` es el único lugar que arma las peticiones. |

No se agregó ninguna dependencia que no se estuviera usando ya en el proyecto web equivalente.

## Por qué el login es con Bearer token y no con cookie

`backendST` firma el JWT como cookie `httpOnly`, que es lo que usa `frontend/` (un navegador). **`fetch` en React Native no administra cookies solo** como lo hace un navegador, así que la app depende de un token que ella misma guarda y reenvía. Por eso `loginClient`/`createClient` ahora también devuelven `token` en el body (ver `backendST/src/controllers/clientController.js`) y `authMiddleware.js` acepta además `Authorization: Bearer <token>` — la cookie se dejó intacta, así que `frontend/` sigue funcionando exactamente igual.

`src/api/api.js` guarda ese token en memoria (`setAuthToken`) y lo manda en cada petición; `AuthContext` es quien lo persiste con `expo-secure-store` entre aperturas de la app.

## Estructura de carpetas

```
movil/
  App.js                # arma los providers + RootNavigator, nada más
  app.json               # icon, adaptive-icon, splash
  assets/                 # icon.png, adaptive-icon.png, splash-icon.png, favicon.png
  src/
    api/                  # un archivo por recurso del backend (products, categories, cart, sales...)
    context/              # AuthContext (sesión) y CartContext (carrito)
    hooks/                 # useAuth, useSplashTimer
    navigation/            # RootNavigator (Stack) y TabMenu (Tabs)
    screens/               # una pantalla por archivo; screens/account/ para el sub-flujo de cuenta
    components/
      ui/                  # Button, TextField, ProductCard, BackHeader, BottomTabBar... reutilizables
      product/             # RatingStars, ReviewItem
    theme/                 # colors.js — la misma paleta (negro/blanco) que frontend/src/index.css
    utils/                 # storage (expo-secure-store), validations, formatCurrency
```

## Cómo correr

Se necesitan **dos terminales**: el backend y la app.

### Terminal 1 — Backend
```bash
cd backendST
npm install
npm run dev
```
Debe quedar escuchando en el puerto `4000` (ver `backendST/index.js`) y mostrar `DB is connected`.

### Terminal 2 — App móvil
```bash
cd movil
npm install
npm start
```
Desde ahí:
- `a` abre el emulador de Android, `i` el simulador de iOS.
- `npm run web` la abre en el navegador (sirve para probar rápido sin emulador).
- Para un **teléfono físico** con Expo Go: edite `HOST_MANUAL` en `src/api/api.js` con la IP de su computadora en la red (la que Expo imprime al arrancar), porque ni `localhost` ni `10.0.2.2` llegan al backend desde un teléfono de verdad.

### Semilla de datos de prueba (opcional)
Para tener productos/categorías reales que mostrar sin depender de que alguien ya los haya creado desde el panel admin:
```bash
node backendST/seedMovilDemo.js
```
Es idempotente: si ya hay productos, no hace nada.

## Nomenclatura

Inglés, `camelCase` para variables y funciones, `PascalCase` con sufijo `Screen`/`Context`/`Provider` para componentes — la misma convención que ya usa `frontend/src/screens/web/*.jsx`. Los campos que vienen tal cual del backend (`product_name`, `full_name`, `delivery_addres`, etc.) se dejan como el modelo de Mongoose los define, sin traducirlos a mitad de camino.

## Qué falta para el 100%
- Pantalla de Try-On con IA (existe en la web vía `/api/ai-try-ons`; no se incluyó en este avance).
- Recuperar/restablecer contraseña desde la app (sí existe en la web).
- Verificar las pantallas contra el Figma real (`frontend/FIGMA.txt`) — este avance se construyó a partir de las pantallas ya existentes en `frontend/` por no poder leer el lienzo de Figma en este entorno.
