import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { AuthProvider } from "./auth/useAuth";
import AuthSuccess from "./pages/Auth/AuthSuccess";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AiChat from "./components/aichatbox";




function App() {
  return (
      <AuthProvider>
        <Routes>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="/product/:id" element={<ProductDetail/>}/>
        <Route path="/admin" element={<DashboardLayout title="Admin"><></></DashboardLayout>} />
        <Route path="/admin/product" element={<ProductManager/>}/>
        <Route path="/admin/order" element={<OrderManager/>}/>
        <Route path="/admin/user" element={<UserManager/>}/>
        <Route path="/admin/discount" element={<DiscountManager/>}/>
        <Route path="/user/profile/:id" element={<ProfilePage/>}/>
        <Route path="/cart" element={<CartPage/>}/>
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/payment" element={<PaymentPage/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/chatbot" element={<AiChat/>}/>
      </Routes>
        </AuthProvider>
  );
}

export default App;
