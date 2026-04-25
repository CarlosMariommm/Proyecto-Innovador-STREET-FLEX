import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './screens/web/HomeScreen';
import AccountLayout from './screens/web/AccountLayout';
import AccountInformation from './screens/web/AccountInformation';
import SavedItems from './screens/web/SavedItems';
import OrderHistory from './screens/web/OrderHistory';
import ProductDetailsScreen from './screens/web/ProductDetailsScreen';

import AdminAuthScreen from './screens/admin/AdminAuthScreen';
import AdminLayout from './screens/admin/AdminLayout';
import SuppliersScreen from './screens/admin/SuppliersScreen';
import InventoryScreen from './screens/admin/InventoryScreen';
import InventoryDetailsScreen from './screens/admin/InventoryDetailsScreen';
import AdminAccountScreen from './screens/admin/AdminAccountScreen';

import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/product/:id" element={<ProductDetailsScreen />} />
      <Route path="/account" element={<AccountLayout />}>
        <Route index element={<Navigate to="information" replace />} />
        <Route path="information" element={<AccountInformation />} />
        <Route path="saved" element={<SavedItems />} />
        <Route path="orders" element={<OrderHistory />} />
      </Route>

      <Route path="/admin/login" element={<AdminAuthScreen />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="suppliers" replace />} />
        <Route path="suppliers" element={<SuppliersScreen />} />
        <Route path="dashboard" element={<div></div>} />
        <Route path="inventory" element={<InventoryScreen />} />
        <Route path="inventory/:id" element={<InventoryDetailsScreen />} />
        <Route path="employees" element={<div></div>} />
        <Route path="account" element={<AdminAccountScreen />} />
        <Route path="deliveries" element={<div></div>} />
      </Route>
    </Routes>
  );
}

export default App;
