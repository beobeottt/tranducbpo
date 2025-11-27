import { ShoppingCart, Menu, X, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import axiosInstance from "../api/axios";
import io from "socket.io-client";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Socket Realtime ---
  useEffect(() => {
    if (!user?._id) return;

    const socket = io("http://localhost:3000");
    socket.emit("joinCart", user._id);

    socket.on("cartUpdated", (items) => {
      setCartCount(items.length);
    });

    return () => {
      socket.disconnect();
    }
  }, [user]);

  // --- Hàm load cart cho user login / guest ---
  const loadCartCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token && user?._id) {
        const res = await axiosInstance.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartCount(res.data?.length || 0);
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(localCart.length);
      }
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
      setCartCount(0);
    }
  };

  // --- Load khi NavBar mount + khi user đổi trạng thái ---
  useEffect(() => {
    loadCartCount();
  }, [user]);

  // --- Lắng nghe sự kiện localStorage thay đổi (guest mode) ---
  useEffect(() => {
    window.addEventListener("storage", loadCartCount);
    return () => window.removeEventListener("storage", loadCartCount);
  }, []);

  const handleSearchSubmit = () => {
    const term = search.trim();
    const params = new URLSearchParams(location.search);

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    navigate(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const getProfileLink = () => {
    if (!user) return null;
    const id = user._id || user.id;
    if (!id) return null;
    return `/user/profile/${id}`;
  };

  const profileLink = getProfileLink();
  const displayName = user?.fullname || user?.name || user?.email || "User";
  const displayInitial = displayName.charAt(0).toUpperCase();
  const isAdmin = user?.role === "Admin" || user?.role === "admin";

  return (
    <nav 
      className="text-yellow-300 shadow-lg"
      style={{ background: "linear-gradient(135deg, #3B82F6, #a2c8adff, #000000)" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">

        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-wide">DucBoDepTrai</span>
        </Link>

        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full px-3 py-2 rounded text-gray-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-5 relative">

          {/* Giỏ hàng */}
          <div className="relative">
            <Link to="/cart">
              <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-gray-200" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#ee4d2d] text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Admin Button - chỉ hiển thị cho Admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
              title="Quản trị viên"
            >
              <Shield className="w-5 h-5" />
              <span>Admin</span>
            </Link>
          )}

          {/* User */}
          {profileLink ? (
            <Link
              to={profileLink}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#ee4d2d] font-bold hover:opacity-80 transition"
              title={displayName}
            >
              {displayInitial}
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-3 text-sm font-medium">
              <Link to="/login" className="hover:underline hover:text-gray-200 transition">
                Đăng nhập
              </Link>
              <span>|</span>
              <Link to="/register" className="hover:underline hover:text-gray-200 transition">
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <X className="w-6 h-6 cursor-pointer" /> : <Menu className="w-6 h-6 cursor-pointer" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#f05d40] px-4 pb-4 space-y-3">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full px-3 py-2 rounded text-gray-700 focus:outline-none"
          />

          <div className="flex flex-col gap-2 mt-2 text-sm font-medium">
            {profileLink ? (
              <>
                <Link
                  to={profileLink}
                  className="hover:underline hover:text-gray-200 transition flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-[#ee4d2d] font-bold flex items-center justify-center">
                    {displayInitial}
                  </div>
                  <span>{displayName}</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hover:underline hover:text-gray-200 transition flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                    onClick={() => setOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="hover:underline hover:text-gray-200 transition text-left"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline hover:text-gray-200 transition" onClick={() => setOpen(false)}>
                  Đăng nhập
                </Link>
                <Link to="/register" className="hover:underline hover:text-gray-200 transition" onClick={() => setOpen(false)}>
                  Đăng ký
                </Link>
              </>
            )}
            <Link to="/cart" className="hover:underline hover:text-gray-200 transition" onClick={() => setOpen(false)}>
              Giỏ hàng ({cartCount})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
