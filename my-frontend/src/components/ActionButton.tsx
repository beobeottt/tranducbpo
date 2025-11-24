// src/components/FloatingActionButtons.tsx
import React, { useState, useEffect } from "react";
import { FaPhone, FaFacebookMessenger, FaArrowUp } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

// ĐÂY LÀ CÁCH DUY NHẤT CHẠY ĐƯỢC 100% HIỆN NAY (2025)
const IconWrapper: React.FC<{ icon: any; className?: string }> = ({ icon: Icon, className }) => {
  return <Icon className={className} />;
};

const FloatingActionButtons: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Hotline */}
      <a
        href="tel:0903073939"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl transition-all hover:scale-110 hover:bg-red-700"
        aria-label="Gọi 09.0307.3939"
      >
        <IconWrapper icon={FaPhone} className="text-2xl" />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          Gọi 09.0307.3939
        </span>
      </a>

      {/* Zalo */}
      <a
        href="https://zalo.me/0903073939"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-all hover:scale-110 hover:bg-blue-700"
      >
        <IconWrapper icon={SiZalo} className="text-4xl" />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          Chat qua Zalo
        </span>
      </a>

      {/* Messenger */}
      <a
        href="https://m.me/your_fanpage_id"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0084ff] text-white shadow-2xl transition-all hover:scale-110 hover:bg-[#0066cc]"
      >
        <IconWrapper icon={FaFacebookMessenger} className="text-3xl" />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          Chat Messenger
        </span>
      </a>

      {/* Lên đầu trang */}
      <button
        onClick={scrollToTop}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-white shadow-2xl transition-all hover:scale-110 hover:bg-gray-900 ${
          showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <IconWrapper icon={FaArrowUp} className="text-2xl" />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          Lên đầu trang
        </span>
      </button>
    </div>
  );
};

export default FloatingActionButtons;