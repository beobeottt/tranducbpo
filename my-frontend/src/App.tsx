import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/Home/HomePage";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import ProductManager from "./pages/Admin/ProductManager";
import OrderManager from "./pages/Admin/OrderManager";
import UserManager from "./pages/Admin/UserManager";
import DiscountManager from "./pages/Admin/DiscountManager";
import DashboardLayout from "./pages/Admin/DashboardLayout";
import ProfilePage from "./pages/Profile/ProfilePage";
import CartPage from "./pages/Cart/CartPage";
import PaymentPage from "./sections/PaymentPage";
import VNPayResult from "./pages/Payment/VNPayResult";
import ProductsPage from "./pages/Products/ProductsPage";
import AuthSuccess from "./pages/Auth/AuthSuccess";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AiChat from "./components/aichatbox";

import { AuthProvider } from "./auth/useAuth";

import FloatingBanner from "./components/FloatingBanner";
import FloatingActionButtons from "./components/ActionButton";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <FloatingBanner />
      <FloatingActionButtons />
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/home?priceMin=0&priceMax=50000000&page=1"
              replace
            />
          }
        />


        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/vnpay-result" element={<VNPayResult />} />
        <Route path="/chatbot" element={<AiChat />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/profile/:id" element={<ProfilePage />} />
        <Route
          path="/admin"
          element={
            <DashboardLayout title="Admin">
              <></>
            </DashboardLayout>
          }
        />
        <Route path="/admin/product" element={<ProductManager />} />
        <Route path="/admin/order" element={<OrderManager />} />
        <Route path="/admin/user" element={<UserManager />} />
        <Route path="/admin/discount" element={<DiscountManager />} />
        <Route
          path="*"
          element={
            <Navigate
              to="/home?priceMin=0&priceMax=50000000&page=1"
              replace
            />
          }
        />
        </Routes>
    </AuthProvider>
  );
}

export default App;