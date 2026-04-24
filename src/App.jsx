import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import AccountLayout from './screens/AccountLayout';
import AccountInformation from './screens/AccountInformation';
import SavedItems from './screens/SavedItems';
import OrderHistory from './screens/OrderHistory';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
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
    </Routes>
  );
}

export default App;
