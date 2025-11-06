// pages/BrandDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import ProductCard from "./ProductCard";
import { Product } from "../types/product";

const BrandDetail = () => {
  const {brand} = useParams<{ brand: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const displayName = brand
  ? brand.charAt(0).toUpperCase() + brand.slice(1)
  : "brand";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get(`/product/brand/${brand}`);
        setProducts(res.data);
      } catch (err: any) {
        setError("Không tải được sản phẩm.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [brand]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {brand}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {error || "Hiện chưa có sản phẩm nào."}
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          ← Quay lại Trang Chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{brand}</h1>
        <Link
          to="/"
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Tất cả sản phẩm
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BrandDetail;