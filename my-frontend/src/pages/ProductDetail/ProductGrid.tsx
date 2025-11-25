import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { Product } from "../../types/product";

interface ProductGridProps {
  products: Product[];
  search?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, search = "" }) => {
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "New Product" | "Best Seller">("All");
  const [favourites, setFavourites] = useState<string[]>([]);


  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem("favourites") || "[]");
    setFavourites(savedFavs);
  }, []);


  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      filter === "All" ? true : product.typeProduct === filter;
    return matchesSearch && matchesType;
  });


  const handleAddToCart = async (product: Product) => {
    const token = localStorage.getItem("token");

    const cartItem = {
      productId: product._id,
      productName: product.productName,
      price: product.price,
      quantity: 1,
      url: product.img,
    };

    if (token) {
      try {
        await axiosInstance.post("http://localhost:3000/cart", cartItem, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddedMessage(`✅ ${cartItem.productName} đã được thêm vào giỏ hàng (server)!`);
      } catch (err: any) {
        console.error("❌ Lỗi khi thêm vào giỏ server:", err);
        setAddedMessage("❌ Không thể thêm sản phẩm vào giỏ hàng (server)!");
      }
    } else {
      const localCart: any[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = localCart.find((item) => item.productId === cartItem.productId);

      if (existing) {
        existing.quantity += 1;
      } else {
        localCart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      setAddedMessage(`🛒 ${cartItem.productName} đã được thêm vào giỏ hàng (local)!`);
    }

    setTimeout(() => setAddedMessage(null), 2000);
  };

  const handleToggleFavourite = async (productId: string) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // ✅ Gửi request tới backend để toggle
        const response = await axiosInstance.post(
          `http://localhost:3000/user/favourite/${productId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setFavourites(response.data.favourites.map((f: any) => f._id));
        setAddedMessage("❤️ Danh sách yêu thích đã được cập nhật (server)");
      } catch (err) {
        console.error("❌ Lỗi khi cập nhật yêu thích:", err);
        setAddedMessage("❌ Không thể cập nhật yêu thích trên server!");
      }
    } else {
      // 🔸 Nếu chưa login thì lưu local
      const updatedFavs = favourites.includes(productId)
        ? favourites.filter((id) => id !== productId)
        : [...favourites, productId];

      setFavourites(updatedFavs);
      localStorage.setItem("favourites", JSON.stringify(updatedFavs));
      setAddedMessage(
        favourites.includes(productId)
          ? "💔 Đã xóa khỏi yêu thích (local)"
          : "❤️ Đã thêm vào yêu thích (local)"
      );
    }

    setTimeout(() => setAddedMessage(null), 2000);
  };


  return (
    <section className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm nổi bật</h2>

      {/* Thông báo */}
      {addedMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center animate-fadeIn">
          {addedMessage}
        </div>
      )}

      {/* Bộ lọc */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("All")}
          className={`px-4 py-2 rounded-lg font-medium transition ${filter === "All"
              ? "bg-gradient-to-b from-purple-400 to-sky-300 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Tất cả
        </button>

        <button
          onClick={() => setFilter("New Product")}
          className={`px-4 py-2 rounded-lg font-medium transition ${filter === "New Product"
              ? "bg-gradient-to-b from-sky-300 to-pink-300 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          New Product
        </button>

        <button
          onClick={() => setFilter("Best Seller")}
          className={`px-4 py-2 rounded-lg font-medium transition ${filter === "Best Seller"
              ? "bg-gradient-to-b from-pink-300 to-teal-300 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Best Seller
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col relative"
            >

              {/* Badge */}
              <div className="flex justify-between mb-2 mt-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${product.typeProduct === "New Product"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                    }`}
                >
                  {product.typeProduct}
                </span>
                <span className="text-gray-400 text-xs">SL: {product.quantity}</span>
              </div>

              {/* Image */}
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.img || "https://via.placeholder.com/300?text=No+Image"}
                  alt={product.productName}
                  className="w-full h-40 object-cover rounded-lg mb-3 hover:opacity-90 transition"
                />
              </Link>

              {/* Info */}
              <Link
                to={`/product/${product._id}`}
                className="hover:text-blue-600 transition"
              >
                <h3 className="text-sm font-semibold mb-1 line-clamp-2">
                  {product.productName}
                </h3>
              </Link>
              <p className="text-sky-400 font-bold mb-2">
                {product.price.toLocaleString()}₫
              </p>

              <div className="mt-auto flex items-center justify-between gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-blue-700 text-white py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                  🛒 Thêm vào giỏ
                </button>

                <button
                  onClick={() => handleToggleFavourite(product._id)}
                  className="text-2xl hover:scale-110 transition-transform"
                  title={
                    favourites.includes(product._id)
                      ? "Xóa khỏi yêu thích"
                      : "Thêm vào yêu thích"
                  }
                >
                  {favourites.includes(product._id) ? "❤️" : "🤍"}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
