import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import NavBar from "../../components/NavBar";
import { Product } from "../../types/product";
import { getImageUrl } from "../../utils/imageUtils";
import { useAuth } from "../../auth/useAuth";

interface Review {
  _id: string;
  productId: string;
  userId: string | null;
  fullname: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  
  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);


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

  // LẤY SẢN PHẨM VÀ REVIEWS
  useEffect(() => {
    if (!id) return;
    
    // Load product
    axiosInstance
      .get(`/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Không tải được sản phẩm."))
      .finally(() => setLoading(false));

    // Load reviews
    setLoadingReviews(true);
    axiosInstance
      .get(`/product/${id}/reviews`)
      .then((res) => setReviews(res.data || []))
      .catch((err) => {
        console.error("Lỗi khi tải reviews:", err);
        setReviews([]);
      })
      .finally(() => setLoadingReviews(false));
  }, [id]);

  // SUBMIT REVIEW
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !reviewComment.trim()) {
      alert("Vui lòng nhập đánh giá!");
      return;
    }

    setSubmittingReview(true);
    try {
      await axiosInstance.post(`/product/${id}/review`, {
        userId: user?._id || user?.id || null,
        fullname: user?.fullname || user?.name || "Khách vãng lai",
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      // Reload reviews
      const res = await axiosInstance.get(`/product/${id}/reviews`);
      setReviews(res.data || []);
      
      // Reset form
      setReviewComment("");
      setReviewRating(5);
      setShowReviewForm(false);
      setAddedMessage("✅ Cảm ơn bạn đã đánh giá!");
      setTimeout(() => setAddedMessage(null), 2000);
    } catch (err: any) {
      console.error("Lỗi khi gửi review:", err);
      alert("❌ Không thể gửi đánh giá. Vui lòng thử lại!");
    } finally {
      setSubmittingReview(false);
    }
  };

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
                src={getImageUrl(product.img)}
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
                    className="w-20 text-center border-2 border-gray-300 rounded-lg py-2 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition shadow-lg flex items-center justify-center gap-2"
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

        {/* REVIEWS SECTION */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Đánh giá sản phẩm ({reviews.length})
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {showReviewForm ? "✕ Đóng" : "✍️ Viết đánh giá"}
            </button>
          </div>

          {/* REVIEW FORM */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá của bạn:
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-3xl transition ${
                        star <= reviewRating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {reviewRating}/5 sao
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhận xét:
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </form>
          )}

          {/* REVIEWS LIST */}
          {loadingReviews ? (
            <div className="text-center py-8">Đang tải đánh giá...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-gray-200 pb-6 last:border-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.fullname}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xl ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;