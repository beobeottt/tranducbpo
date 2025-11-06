import React, { useState } from "react";
import { Facebook, Chrome } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import Footer from "../../components/Footter";
import axiosInstance from "../../api/axios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // XỬ LÝ ĐĂNG NHẬP EMAIL/PASSWORD
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      await login(email, password); // Cập nhật context
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Email hoặc mật khẩu không đúng.");
    }
  };

  // XỬ LÝ GOOGLE LOGIN
  const handleGoogleLogin = () => {
    // Redirect đến backend NestJS
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-red-500 flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Banner trái */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-sky-400 to-red-500 items-center justify-center p-8">
          <h2 className="text-5xl font-bold text-white text-center leading-tight">
            TRẦN GIA LONG
          </h2>
        </div>

        {/* Form login */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Đăng nhập</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Email / Số điện thoại / Tên đăng nhập"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              required
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              required
            />

            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition transform hover:scale-105"
            >
              ĐĂNG NHẬP
            </button>
          </form>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <div className="flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm font-medium">HOẶC</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* ĐĂNG NHẬP MXH */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition transform hover:scale-105"
            >
              <Facebook className="text-blue-600" size={22} />
              <span className="font-medium">Facebook</span>
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin} // GỌI GOOGLE LOGIN
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 hover:bg-red-50 transition transform hover:scale-105"
            >
              <Chrome className="text-red-500" size={22} />
              <span className="font-medium text-red-600">Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Bạn mới biết đến TGL?{" "}
            <Link to="/register" className="text-red-500 font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;