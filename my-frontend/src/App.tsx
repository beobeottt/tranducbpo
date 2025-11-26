import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Bỏ BrowserRouter nếu đã dùng ở index.tsx

// --- Import các trang ---
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
import ProductsPage from "./pages/Products/ProductsPage";
import AuthSuccess from "./pages/Auth/AuthSuccess";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AiChat from "./components/aichatbox";

// --- Import Context ---
import { AuthProvider } from "./auth/useAuth";

// --- 1. IMPORT BANNER MỚI TẠO Ở ĐÂY ---
import FloatingBanner from "./components/FloatingBanner";

function App() {
  return (
    <AuthProvider>
      
      {/* 2. ĐẶT BANNER Ở ĐÂY (Ngoài Routes để hiện mọi nơi) */}
      <FloatingBanner />

      <Routes>
        {/* Public Routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/chatbot" element={<AiChat />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User Routes */}
        <Route path="/user/profile/:id" element={<ProfilePage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout title="Admin"><></></DashboardLayout>} />
        <Route path="/admin/product" element={<ProductManager />} />
        <Route path="/admin/order" element={<OrderManager />} />
        <Route path="/admin/user" element={<UserManager />} />
        <Route path="/admin/discount" element={<DiscountManager />} />

        {/* Redirect mặc định */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      
    </AuthProvider>
  );
}

export default App;