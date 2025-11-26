import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import axiosInstance from "../../api/axios";

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
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("token", token);

        try {
          const res = await axiosInstance.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          localStorage.setItem("user", JSON.stringify(res.data));

          alert("✅ Google login success!");
          navigate("/");
        } catch (err) {
          console.error("Fetch user failed:", err);
          alert("❌ Failed to load user info.");
          navigate("/login");
        }
      } else {
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
