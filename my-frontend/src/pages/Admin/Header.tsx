import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Nếu bạn dùng react-hot-toast (khuyên dùng)
// hoặc dùng alert() nếu chưa có toast

const Header = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Thông báo đẹp (tùy chọn)
    toast.success("Đăng xuất thành công!", {
      duration: 2000,
      position: "top-right",
    });

    // Chuyển về trang chủ
    navigate("/home");
    // hoặc navigate("/") nếu trang chủ là root
  };

  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-3 border-b">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Thông báo */}
        <button className="text-gray-600 hover:text-orange-500 transition-colors">
          <Bell size={20} />
        </button>

        {/* Avatar + tên */}
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="admin"
            className="w-8 h-8 rounded-full ring-2 ring-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>

        {/* Nút Đăng xuất */}
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 transition-all hover:scale-110 flex items-center gap-1"
          title="Đăng xuất"
        >
          <LogOut size={20} />
          <span className="hidden md:inline text-sm">Thoát</span>
        </button>
      </div>
    </header>
  );
};

export default Header;