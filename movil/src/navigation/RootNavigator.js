/*
 * ROOT NAVIGATOR — arma el Stack completo: arranque (Splash), sesion
 * (Login/Register/VerifyCode), la app con tabs, y las pantallas sueltas
 * que van encima de la barra (ProductDetails, Cart, Checkout, Receipt).
 *
 * `Splash` siempre termina en Tabs, con o sin sesion — se puede ver la tienda
 * sin cuenta, igual que la web. Usa un efecto y no `initialRouteName` porque
 * si HABIA sesion guardada hay que restaurar el apartado en el que se habia
 * quedado (`pendingDestination`), y eso no se sabe hasta que AuthProvider
 * termina de leer el almacen (ver useSplashTimer + AuthContext).
 *
 * `AuthWatcher` es el login interactivo, `Splash` es el arranque: los dos
 * miran `isAuthenticated` pero no se pisan porque AuthWatcher se queda
 * apagado hasta que Splash marca `startupResolved`.
 */

import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useSplashTimer } from '../hooks/useSplashTimer';
import { goToTabs, navigationRef, pendingDestination, startupResolved } from './navigationRef';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import TabMenu from './TabMenu';

const Stack = createNativeStackNavigator();

const SplashRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const showSplash = useSplashTimer(loading);

  useEffect(() => {
    if (showSplash) return;

    startupResolved.current = true;

    // Se puede ver la tienda sin cuenta (igual que la web): el arranque va
    // siempre a Tabs, con o sin sesion. El login solo se pide en el momento
    // en que hace falta de verdad — pagar, o abrir Favoritos/Pedidos/Cuenta
    // (ver TabMenu.js y CartScreen.js).
    goToTabs(isAuthenticated ? pendingDestination.current : null);
    pendingDestination.current = null;
    // Solo debe correr cuando el splash termina, no en cada cambio de sesion:
    // el login interactivo lo atiende AuthWatcher, no esta pantalla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSplash]);

  return <SplashScreen />;
};

// Sin pantalla propia: solo escucha, para poder navegar en cuanto
// `isAuthenticated` pasa a true despues del arranque (login o registro hechos
// a mano, no la restauracion de sesion que ya atendio Splash).
const AuthWatcher = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!startupResolved.current || !isAuthenticated) return;
    goToTabs(pendingDestination.current);
    pendingDestination.current = null;
  }, [isAuthenticated]);

  return null;
};

const LoginRoute = ({ navigation }) => (
  <LoginScreen
    onGoToRegister={() => navigation.navigate('Register')}
    // Cuenta registrada pero nunca verificada: en vez de un error sin salida,
    // se manda directo a pedir un codigo nuevo (ver needsVerification en
    // backendST/src/controllers/clientController.js: loginClient).
    onNeedsVerification={(email) => navigation.navigate('VerifyCode', { email, sendOnMount: true })}
    // Ver la tienda no pide cuenta: quien llego aca porque tocó Favoritos/
    // Pedidos/Cuenta o "Ir a pagar" sin sesion puede volver a mirar sin
    // completar el login.
    onSkip={() => {
      pendingDestination.current = null;
      goToTabs(null);
    }}
  />
);

const RegisterRoute = ({ navigation }) => (
  <RegisterScreen
    onGoToLogin={() => navigation.navigate('Login')}
    onRegistered={(email) => navigation.replace('VerifyCode', { email })}
  />
);

const VerifyCodeRoute = ({ route, navigation }) => (
  <VerifyCodeScreen
    email={route.params?.email}
    sendOnMount={!!route.params?.sendOnMount}
    onGoToLogin={() => navigation.navigate('Login')}
  />
);

const ProductDetailsRoute = ({ route, navigation }) => (
  <ProductDetailsScreen productId={route.params?.productId} onBack={() => navigation.goBack()} />
);

const CartRoute = ({ navigation }) => (
  <CartScreen onBack={() => navigation.goBack()} onCheckout={() => navigation.navigate('Checkout')} />
);

const CheckoutRoute = ({ navigation }) => (
  <CheckoutScreen
    onBack={() => navigation.goBack()}
    onConfirmed={(order) => navigation.replace('Receipt', { order })}
  />
);

const ReceiptRoute = ({ route, navigation }) => (
  <ReceiptScreen
    order={route.params?.order}
    onViewOrders={() => navigation.reset({ index: 0, routes: [{ name: 'Tabs', state: { routes: [{ name: 'orders' }] } }] })}
    onGoHome={() => navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] })}
  />
);

const RootNavigator = () => (
  <NavigationContainer ref={navigationRef}>
    <AuthWatcher />
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashRoute} />
      <Stack.Screen name="Login" component={LoginRoute} />
      <Stack.Screen name="Register" component={RegisterRoute} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeRoute} />
      <Stack.Screen name="Tabs" component={TabMenu} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsRoute} />
      <Stack.Screen name="Cart" component={CartRoute} />
      <Stack.Screen name="Checkout" component={CheckoutRoute} />
      <Stack.Screen name="Receipt" component={ReceiptRoute} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
