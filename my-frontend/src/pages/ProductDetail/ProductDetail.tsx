import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import NavBar from "../../components/NavBar";
import { Product } from "../../types/product";
import { useAuth } from "../../auth/useAuth";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const { user } = useAuth();

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    if (product && newQty > product.quantity) {
      alert(`Chỉ còn ${product.quantity} sản phẩm!`);
      return;
    }
    setQty(newQty);
  };

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
      const existingIndex = cart.findIndex(
        (item: any) => item.productId === product._id
      );

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += qty;
      } else {
        cart.push({ ...cartItem, productId: `local_${Date.now()}` });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      setAddedMessage(`Đã thêm ${qty} ${product.productName} (local)!`);
    }

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

  // ⭐ LẤY REVIEW
  useEffect(() => {
    axiosInstance
      .get(`/product/${id}/reviews`)
      .then((res) => setReviews(res.data))
      .catch(() => {})
      .finally(() => setLoadingReviews(false));
  }, [id]);

  const handleSubmitReview = async () => {
  if (!user) {
    return alert("Bạn cần đăng nhập để đánh giá sản phẩm!");
  }

  if (rating === 0) return alert("Hãy chọn số sao đánh giá!");
  if (!comment.trim()) return alert("Hãy nhập nội dung đánh giá!");

  try {
    const token = localStorage.getItem("token");

    const reviewData = {
      rating,
      comment,
      userId: user._id,
      fullname: user.fullname,
    };

    // Xuất ra console để bạn kiểm tra
    console.log("DATA gửi lên backend:", reviewData);

    const res = await axiosInstance.post(
      `/product/${id}/review`,
      reviewData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setReviews((prev) => [res.data, ...prev]);
    setRating(0);
    setComment("");
    alert("Đánh giá thành công!");
  } catch (err) {
    console.error("LỖI gửi đánh giá:", err);
    alert("Không thể gửi đánh giá. Vui lòng thử lại!");
  }
};





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

      {addedMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {addedMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">
        {/* SẢN PHẨM */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="flex justify-center">
              <img
                src={product.img}
                alt={product.productName}
                className="w-full max-w-md h-96 object-cover rounded-xl shadow-md hover:scale-105 transition duration-300"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {product.productName}
                </h1>

                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {product.description}
                </p>

                <p className="text-3xl font-bold text-orange-600">
                  {product.price.toLocaleString("vi-VN")} ₫
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Còn lại:{" "}
                  <span className="font-bold text-green-600">
                    {product.quantity} sản phẩm
                  </span>
                </p>

                <div className="flex items-center gap-2 mt-3">
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

              {/* Số lượng */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQtyChange(qty - 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gray-100"
                    disabled={qty <= 1}
                  >
                    −
                  </button>

                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => handleQtyChange(Number(e.target.value))}
                    className="w-20 text-center border-2 border-gray-300 rounded-lg py-2"
                  />

                  <button
                    onClick={() => handleQtyChange(qty + 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gray-100"
                    disabled={qty >= product.quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600"
                >
                  🛒 Thêm vào giỏ
                </button>

                <Link
                  to="/"
                  className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  ← Quay lại
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ⭐⭐⭐⭐⭐ REVIEW ⭐⭐⭐⭐⭐ */}
        <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Đánh giá sản phẩm</h2>

          {/* Chọn sao */}
          <div className="flex gap-1 text-3xl mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Nhập đánh giá */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Hãy chia sẻ cảm nhận của bạn..."
            className="w-full border rounded-lg p-3 h-24"
          />

          <button
            onClick={handleSubmitReview}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Gửi đánh giá
          </button>

          <hr className="my-6" />

          <h3 className="text-xl font-bold mb-4">Các đánh giá gần đây</h3>

          {loadingReviews ? (
            <p>Đang tải đánh giá...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">Chưa có đánh giá nào.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="p-4 border rounded-lg mb-4">
                <p className="font-semibold">{r.fullname || "Khách vãng lai"}</p>

                <div className="flex gap-1 text-yellow-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>

                <p className="mt-2">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
