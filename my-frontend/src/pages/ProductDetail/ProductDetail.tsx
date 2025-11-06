import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import NavBar from "../../components/NavBar";
import { Product } from "../../types/product";



const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1); // SỐ LƯỢNG CHỌN
  const [addedMessage, setAddedMessage] = useState<string | null>(null);


  // TĂNG/GIẢM SỐ LƯỢNG
  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    if (product && newQty > product.quantity) {
      alert(`Chỉ còn ${product.quantity} sản phẩm!`);
      return;
    }
    setQty(newQty);
  };

  // THÊM VÀO GIỎ HÀNG
  const handleAddToCart = async () => {
    if (!product) return;

    const token = localStorage.getItem("token");

    const cartItem = {
      productId: product._id,
      productName: product.productName,
      price: product.price,
      quantity: qty,
      image: product.img,
    };

    if (token) {
      try {
        await axiosInstance.post("/cart", cartItem, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddedMessage(`Đã thêm ${qty} ${product.productName} vào giỏ!`);
      } catch (err) {
        setAddedMessage("Lỗi server! Không thể thêm.");
      }
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = cart.findIndex((item: any) => item.productId === product._id);

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += qty;
      } else {
        cart.push({ ...cartItem, productId: `local_${Date.now()}` });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      setAddedMessage(`Đã thêm ${qty} ${product.productName} (local)!`);
    }

    // Tự ẩn sau 2s
    setTimeout(() => setAddedMessage(null), 2000);
  };

  // LẤY SẢN PHẨM
  useEffect(() => {
    axiosInstance
      .get(`/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Không tải được sản phẩm."))
      .finally(() => setLoading(false));
  }, [id]);

  // LOADING & ERROR
  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (error || !product)
    return (
      <div className="text-center py-20 text-red-500">
        {error || "Không tìm thấy sản phẩm."}
        <Link to="/" className="block mt-4 text-blue-600 underline">
          ← Quay lại Trang Chủ
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Thông báo thêm giỏ */}
      {addedMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {addedMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Ảnh */}
            <div className="flex justify-center">
              <img
                src={product.img}
                alt={product.productName}
                className="w-full max-w-md h-96 object-cover rounded-xl shadow-md hover:scale-105 transition duration-300"
              />
            </div>

            {/* Chi tiết */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {product.productName}
                </h1>

                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-4">
                  <p className="text-3xl font-bold text-orange-600">
                    {product.price.toLocaleString("vi-VN")} ₫
                  </p>

                  <p className="text-sm text-gray-500">
                    Còn lại:{" "}
                    <span className="font-bold text-green-600">
                      {product.quantity} sản phẩm
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Loại:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.typeProduct === "New Product"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.typeProduct}
                    </span>
                  </div>
                </div>
              </div>

              {/* CHỌN SỐ LƯỢNG */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQtyChange(qty - 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gray-100 flex items-center justify-center text-xl font-bold transition"
                    disabled={qty <= 1}
                  >
                    −
                  </button>

                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => handleQtyChange(Number(e.target.value))}
                    className="w-20 text-center border-2 border-gray-300 rounded-lg py-2 text-lg font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    min="1"
                    max={product.quantity}
                  />

                  <button
                    onClick={() => handleQtyChange(qty + 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gray-100 flex items-center justify-center text-xl font-bold transition"
                    disabled={qty >= product.quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* NÚT HÀNH ĐỘNG */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>🛒</span> Thêm vào giỏ ({qty})
                </button>

                <Link
                  to="/"
                  className="px-6 py-4 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  ← Quay lại
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;