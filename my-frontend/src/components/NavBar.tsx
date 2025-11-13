import { ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import axiosInstance from "../api/axios";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const res = await axiosInstance.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartCount(res.data.length || 0);
      } else {

        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(localCart.length);
      }
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();

    window.addEventListener("storage", loadCartCount);
    return () => window.removeEventListener("storage", loadCartCount);
  }, []);

  return (
    <nav className="bg-gradient-to-b from-blue-700 to-purple-700 text-yellow-300 shadow-lg">
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
            className="w-full px-3 py-2 rounded text-gray-700 focus:outline-none"
          />
        </div>


        <div className="flex items-center gap-5 relative">

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


          {user ? (
            <Link
              to={`/user/profile/${user._id || user.id}`}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#ee4d2d] font-bold hover:opacity-80 transition"
              title={user.fullname || user.email}
            >
              {(user.fullname || user.email || "U").charAt(0).toUpperCase()}
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


          <button onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <X className="w-6 h-6 cursor-pointer" /> : <Menu className="w-6 h-6 cursor-pointer" />}
          </button>
        </div>
      </div>


      {open && (
        <div className="md:hidden bg-[#f05d40] px-4 pb-4 space-y-3">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded text-gray-700 focus:outline-none"
          />

          <div className="flex flex-col gap-2 mt-2 text-sm font-medium">
            {user ? (
              <>
                <Link
                  to={`/user/profile/${user._id || user.id}`}
                  className="hover:underline hover:text-gray-200 transition flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-[#ee4d2d] font-bold flex items-center justify-center">
                    {(user.fullname || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <span>{user.fullname || user.email}</span>
                </Link>
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
