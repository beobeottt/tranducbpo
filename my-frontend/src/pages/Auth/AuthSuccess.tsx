// src/pages/AuthSuccess.tsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";


const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      loginWithToken(token)
        .then(() => {
          navigate("/home", { replace: true });
        })
        .catch(() => {
          navigate("/login");
        });
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl font-medium">Đang đăng nhập bằng Google...</div>
    </div>
  );
};

export default AuthSuccess;