import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

import Home from './pages/Home';
import Categories from './pages/Categories';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Support from './pages/Support';
import Profile from './pages/Profile';
import StoreDashboard from './pages/StoreDashboard';
import BusinessInsights from './pages/BusinessInsights';
import AdminStores from './pages/AdminStores';
import StoreDetails from './pages/StoreDetails';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/store-dashboard" element={<StoreDashboard />} />
          <Route path="/business-insights" element={<BusinessInsights />} />
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/admin/stores/:id" element={<StoreDetails />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
