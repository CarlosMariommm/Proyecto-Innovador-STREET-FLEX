/*
 * TAB MENU — los cuatro apartados de abajo. Inicio es publico; Favoritos,
 * Pedidos y Cuenta piden sesion (igual que la web protege /account con
 * ProtectedRoute): si se tocan sin haber iniciado sesion, se manda a Login y
 * se recuerda a donde volver.
 */

import { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { pendingDestination, navigateTo } from './navigationRef';
import BottomTabBar from '../components/ui/BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import SavedItemsScreen from '../screens/account/SavedItemsScreen';
import OrderHistoryScreen from '../screens/account/OrderHistoryScreen';
import AccountInformationScreen from '../screens/account/AccountInformationScreen';

const Tab = createBottomTabNavigator();

const AUTH_REQUIRED_TABS = ['saved', 'orders', 'account'];

const TabBarWithGuard = ({ state, navigation }) => {
  const { isAuthenticated } = useAuth();
  const activeTab = state.routes[state.index].name;

  useEffect(() => {
    if (!isAuthenticated && AUTH_REQUIRED_TABS.includes(activeTab)) {
      navigation.navigate('home');
    }
  }, [isAuthenticated, activeTab, navigation]);

  const handleChange = (key) => {
    if (AUTH_REQUIRED_TABS.includes(key) && !isAuthenticated) {
      pendingDestination.current = key;
      navigateTo('Login');
      return;
    }
    navigation.navigate(key);
  };

  return <BottomTabBar activeTab={activeTab} onChange={handleChange} />;
};

// Home necesita mandar a ProductDetails y Cart, dos pantallas que viven en el
// Stack de mas arriba (no son apartados de la barra): navigation.navigate
// sube por el arbol y las encuentra igual.
const HomeTab = ({ navigation }) => (
  <HomeScreen
    onOpenProduct={(productId) => navigation.navigate('ProductDetails', { productId })}
    onOpenCart={() => navigation.navigate('Cart')}
  />
);

const SavedTab = ({ navigation }) => (
  <SavedItemsScreen onOpenProduct={(productId) => navigation.navigate('ProductDetails', { productId })} />
);

const OrdersTab = ({ navigation }) => (
  <OrderHistoryScreen onOpenOrder={(sale) => navigation.navigate('OrderDetail', { sale })} />
);

const TabMenu = () => (
  <Tab.Navigator tabBar={(props) => <TabBarWithGuard {...props} />} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="home" component={HomeTab} />
    <Tab.Screen name="saved" component={SavedTab} />
    <Tab.Screen name="orders" component={OrdersTab} />
    <Tab.Screen name="account" component={AccountInformationScreen} />
  </Tab.Navigator>
);

export default TabMenu;
