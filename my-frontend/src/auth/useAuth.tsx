// src/auth/useAuth.ts
import { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";
import axiosInstance from "../api/axios";

interface User {
  _id?: string;
  id?: string;
  email: string;
  fullname?: string;
  name?: string;
  role?: string;
  gender?: string;
  point?: number;
  shippingAddress?: string;
  avatar?: string;
  googleId?: string;
  favourites?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // KIỂM TRA TOKEN KHI MỞ ỨNG DỤNG
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          // Gọi /auth/me để xác thực token
          const res = await axiosInstance.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const freshUser = res.data;
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        } catch (err) {
          console.warn("Token không hợp lệ → xóa");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // LOGIN BẰNG EMAIL/PASSWORD
  const login = async (email: string, password: string) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  // LOGIN BẰNG TOKEN (DÙNG CHO GOOGLE)
  const loginWithToken = async (token: string) => {
    try {
      localStorage.setItem("token", token);

      const res = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (err: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      throw new Error("Token không hợp lệ");
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithToken,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được gọi bên trong AuthProvider");
  }
  return context;
};