# STREET FLEX — App móvil

Cliente móvil (Expo + React Native) de la tienda en línea STREET FLEX. Entrega final del Módulo 5 — Instituto Técnico Ricaldone.

La documentación completa —equipo, **licencia Creative Commons (CC BY-NC-SA 4.0)**, dependencias, configuración, cómo correr, desplegar el backend y generar el APK— está en el [README principal del repositorio](../README.md). Este archivo es la guía rápida y el mapa de la rúbrica.

## Arranque rápido

```bash
cd movil
npm install
npm run android      # emulador o dispositivo conectado
npm run web          # probar en el navegador
```

Necesita el backend corriendo (`cd backendST && npm run dev`). Cuentas de demostración: `ana.demo@streetflex.test` / `Demo1234` (también `luis.demo@…` y `sofia.demo@…`).

## Dónde está cada punto de la rúbrica

| # | Criterio | Dónde |
|---|---|---|
| 5 | Estructura de carpetas | `src/screens`, `src/components`, `src/navigation`; `App.js` solo arma los providers |
| 6 | Componentes reutilizables | `src/components/ui/` (`Button`, `TextField`, `ProductCard`, `BackHeader`, `BottomTabBar`, `CategorySidebar`, `OrderStatusTag`…) y `src/components/product/` |
| 7 | Fetch API | `src/api/api.js` (único lugar con `fetch`) + un archivo por recurso |
| 8 | State de padres a hijos | `AuthContext`/`CartContext` y props; los formularios se reinician al guardar o salir |
| 9 | Menú y navegabilidad | `src/navigation/TabMenu.js` (pestañas) + `CategorySidebar` (lateral) + botón de volver en cada pantalla |
| 10 | Registro | `RegisterScreen` → `VerifyCodeScreen` (código de 6 dígitos al correo) |
| 11 | Edición de usuarios | `screens/account/AccountInformationScreen` → `PUT /clients/profile` |
| 12 | Inicio de sesión | `LoginScreen`; la sesión se restaura en `AuthContext` y redirige a Home |
| 13 | Splash personalizado | `app.json` (splash nativo) + `SplashScreen` + `useSplashTimer` |
| 14 | Home con el nombre real | `HomeScreen`: "Hola, {nombre completo}" |
| 15 | Productos, valoraciones y comentarios | `HomeScreen`/`ProductCard` (promedio y cantidad), `ProductDetailsScreen` (comentarios; solo valora quien compró) |
| 16 | Carrito | `CartContext`, `CartScreen`, `CheckoutScreen`; con carrito vacío no se puede pagar |
| 17 | Validaciones del carrito | `CartContext.addToCart/updateAmount` (tope de stock) + `saleController.createSale` (stock atómico) + `cancelSale` (devuelve el stock) |
| 18 | Historial de compras | `OrderHistoryScreen` + `OrderDetailScreen` |
| 19 | Recuperación de contraseña | `ForgotPasswordScreen` → `ResetPasswordScreen` (código al correo) |
| 20 | APK | `scripts/generar-apk.ps1` → `apk/StreetFlex.apk` |
| 21 | Validaciones | `src/utils/validations.js`: correo, edad (entera, 13–100), teléfono, vacíos, números no negativos, código de 6 dígitos, comentario; el servidor repite las reglas |
