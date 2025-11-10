import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";


const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
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
          navigate("/home");
        } catch (err) {
          console.error("Fetch user failed:", err);
          alert("❌ Failed to load user info.");
          navigate("/login");
        }
      } else {
        alert("❌ Login failed: missing token.");
        navigate("/login");
      }
    };

    handleGoogleLogin();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthSuccess;
