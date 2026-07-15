import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './screens/web/HomeScreen';
import AccountLayout from './screens/web/AccountLayout';
import AccountInformation from './screens/web/AccountInformation';
import SavedItems from './screens/web/SavedItems';
import OrderHistory from './screens/web/OrderHistory';
import ProductDetailsScreen from './screens/web/ProductDetailsScreen';
import CartScreen from './screens/web/CartScreen';
import ReceiptScreen from './screens/web/ReceiptScreen';
import TryOnScreen from './screens/web/TryOnScreen';
import ClientAuthScreen from './screens/web/ClientAuthScreen';
import VerifyEmailScreen from './screens/web/VerifyEmailScreen';
import ForgotPasswordScreen from './screens/web/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/web/ResetPasswordScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import AdminAuthScreen from './screens/admin/AdminAuthScreen';
import AdminLayout from './screens/admin/AdminLayout';
import SuppliersScreen from './screens/admin/SuppliersScreen';
import InventoryScreen from './screens/admin/InventoryScreen';
import InventoryDetailsScreen from './screens/admin/InventoryDetailsScreen';
import AdminCategoriesScreen from './screens/admin/AdminCategoriesScreen';
import AdminAccountScreen from './screens/admin/AdminAccountScreen';
import DashboardScreen from './screens/admin/DashboardScreen';
import DeliveriesScreen from './screens/admin/DeliveriesScreen';
import ClientsScreen from './screens/admin/ClientsScreen';
import ModulesScreen from './screens/admin/ModulesScreen';
import AdminBannersScreen from './screens/admin/AdminBannersScreen';

import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/product/:id" element={<ProductDetailsScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/receipt" element={<ReceiptScreen />} />
      <Route path="/try-on" element={<TryOnScreen />} />
      <Route path="/login" element={<ClientAuthScreen />} />
      <Route path="/verify/:token" element={<VerifyEmailScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<Navigate to="information" replace />} />
          <Route path="information" element={<AccountInformation />} />
          <Route path="saved" element={<SavedItems />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>
      </Route>

      <Route path="/admin/login" element={<AdminAuthScreen />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="suppliers" replace />} />
          <Route path="suppliers" element={<SuppliersScreen />} />
          <Route path="dashboard" element={<DashboardScreen />} />
          <Route path="inventory" element={<InventoryScreen />} />
          <Route path="inventory/:id" element={<InventoryDetailsScreen />} />
          <Route path="categories" element={<AdminCategoriesScreen />} />
          <Route path="clients" element={<ClientsScreen />} />
          <Route path="modules" element={<ModulesScreen />} />
          <Route path="banners" element={<AdminBannersScreen />} />
          <Route path="account" element={<AdminAccountScreen />} />
          <Route path="deliveries" element={<DeliveriesScreen />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
