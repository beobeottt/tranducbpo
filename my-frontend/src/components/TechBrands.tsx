import React from "react";
import {
  Smartphone,
  Laptop,
  Monitor,
  Camera,
  Headphones,
  Watch,
  Cpu
} from "lucide-react";
import { link } from "fs";
import { Link } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
  logo: string;
  icon: React.ReactNode;
  href: string;
}

const TechBrands: React.FC = () => {
  const brands: Brand[] = [
    {
      id: "apple",
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      icon: <Smartphone className="w-10 h-10" />,
      href: "/brand/apple",
    },
    {
      id: "samsung",
      name: "Samsung",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
      icon: <Monitor className="w-10 h-10" />,
      href: "/brand/samsung",
    },
    {
      id: "xiaomi",
      name: "Xiaomi",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/81/Xiaomi_logo.svg",
      icon: <Smartphone className="w-10 h-10" />,
      href: "/brand/xiaomi",
    },
    {
      id: "sony",
      name: "Sony",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Sony_logo.svg",
      icon: <Camera className="w-10 h-10" />,
      href: "/brand/sony",
    },
    {
      id: "dell",
      name: "Dell",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
      icon: <Laptop className="w-10 h-10" />,
      href: "/brand/dell",
    },
    {
      id: "hp",
      name: "HP",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
      icon: <Laptop className="w-10 h-10" />,
      href: "/brand/hp",
    },
    {
      id: "lenovo",
      name: "Lenovo",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Lenovo_logo_2015.svg",
      icon: <Laptop className="w-10 h-10" />,
      href: "/brand/lenovo",
    },
    {
      id: "asus",
      name: "ASUS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
      icon: <Cpu className="w-10 h-10" />,
      href: "/brand/asus",
    },
    {
      id: "lg",
      name: "LG",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/LG_logo_%282015%29.svg",
      icon: <Monitor className="w-10 h-10" />,
      href: "/brand/lg",
    },
    {
      id: "oppo",
      name: "OPPO",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Oppo_logo.svg",
      icon: <Smartphone className="w-10 h-10" />,
      href: "/brand/oppo",
    },
  ];

  return (
    <div className="bg-white py-6 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          THƯƠNG HIỆU CÔNG NGHỆ
        </h2>

        {/* Cuộn ngang */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-5 min-w-max pb-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brand/${brand.name.toLowerCase()}`} // apple, samsung
                className="flex flex-col items-center justify-center p-4 w-28 text-center group transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg bg-gray-50 hover:bg-white"
              >
                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                  <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                </div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </p>
                <div className="mt-1 text-gray-400 group-hover:text-blue-500 transition-colors">
                  {brand.icon}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Xem thêm */}
        <div className="mt-3 text-right">
          <a
            href="/brands/tech"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
          >
            Xem tất cả thương hiệu
          </a>
        </div>
      </div>
    </div>
  );
};

export default TechBrands;