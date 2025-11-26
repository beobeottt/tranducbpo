import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Users, Tag, Package } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { path: "/admin", name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/product", name: "Products", icon: <Package size={18} /> },
    { path: "/admin/order", name: "Orders", icon: <ShoppingBag size={18} /> },
    { path: "/admin/user", name: "Users", icon: <Users size={18} /> },
    { path: "/admin/discount", name: "Discount", icon: <Tag size={18} /> },
  ];

  return (
    <aside className="w-60 bg-[#1E293B] text-gray-100 min-h-screen flex flex-col p-4">
      <h2 className="text-lg font-bold mb-6 text-center">🛍️ ADMIN PANEL</h2>
      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              location.pathname === item.path
                ? "bg-sky-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
