import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Banner from "../../components/Banner";
import ProductGrid from "../ProductDetail/ProductGrid";
import axiosInstance from "../../api/axios";
import { authService } from "../../services/authService";
import TechBrands from "../../components/TechBrands";

interface Product {
  _id: string;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  typeProduct: "New Product" | "Best Seller";
  img: string;
}
interface User{
  email: string;
  password: string;
}
const HomePage = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    axiosInstance
      .get("http://localhost:3000/product")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Error when taking Products data:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau!");
      })
      .finally(() => setLoading(false));
  }, []);

  
  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(search.toLowerCase())

  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <NavBar/>
      
      <div className="bg-gray-50 min-h-screen">
      <Banner/>
      <TechBrands/>
      {/* Search Bar */}

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button>
          
        </button>
      </div>

      <ProductGrid products={products} search={search}/>
    </div>
    </div>
  );
};

export default HomePage;
