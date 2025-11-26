import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const searchParams =
      window.location.search && window.location.search.length > 1
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams(window.location.hash.replace("#", "?"));

    const token = searchParams.get("token");

    const handleGoogleLogin = async () => {
      if (!token) {
        alert("❌ Login failed: missing token.");
        navigate("/login");
        return;
      }

      try {
        await loginWithToken(token);
        alert("✅ Google login success!");
        navigate("/home");
      } catch (err) {
        console.error("Google login error:", err);
        alert("❌ Failed to load user info.");
        navigate("/login");
      }
    };

    handleGoogleLogin();
  }, [loginWithToken, navigate]);

  return <div>Loading...</div>;
};

export default AuthSuccess;
