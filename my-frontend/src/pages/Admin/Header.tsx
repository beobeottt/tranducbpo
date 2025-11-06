import { Bell, LogOut } from "lucide-react";

const Header = ({ title }: { title: string }) => {
  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-3 border-b">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-orange-500">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="admin"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">Admin</span>
        </div>
        <button className="text-red-500 hover:text-red-600">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
