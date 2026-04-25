import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './screens/web/HomeScreen';
import AccountLayout from './screens/web/AccountLayout';
import AccountInformation from './screens/web/AccountInformation';
import SavedItems from './screens/web/SavedItems';
import OrderHistory from './screens/web/OrderHistory';
import ProductDetailsScreen from './screens/web/ProductDetailsScreen';

// Admin imports
import AdminAuthScreen from './screens/admin/AdminAuthScreen';
import AdminLayout from './screens/admin/AdminLayout';
import SuppliersScreen from './screens/admin/SuppliersScreen';

import './index.css';

function App() {
  return (
    <Routes>
      {/* Web Routes */}
      <Route path="/" element={<HomeScreen />} />
      <Route path="/product/:id" element={<ProductDetailsScreen />} />
      <Route path="/account" element={<AccountLayout />}>
        <Route index element={<Navigate to="information" replace />} />
        <Route path="information" element={<AccountInformation />} />
        <Route path="saved" element={<SavedItems />} />
        <Route path="orders" element={<OrderHistory />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminAuthScreen />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="suppliers" replace />} />
        <Route path="suppliers" element={<SuppliersScreen />} />
        <Route path="dashboard" element={<div>Dashboard Placeholder</div>} />
        <Route path="inventory" element={<div>Inventory Placeholder</div>} />
        <Route path="employees" element={<div>Employees Placeholder</div>} />
        <Route path="account" element={<div>Account Placeholder</div>} />
        <Route path="deliveries" element={<div>Deliveries Placeholder</div>} />
      </Route>
    </Routes>
  );
}

export default App;
