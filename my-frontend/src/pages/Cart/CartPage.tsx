import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import CartItem from "./CartItem";

interface CartItemType {
  _id?: string;
  userId?: string;
  productId?: string;
  shopName?: string;
  productName: string;
  url?: string;
  image?: string;
  price: number;
  quantity: number;
  status?: string;
  guestId?: string;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  const getKey = (item: CartItemType): string => {
    if (item._id) return `srv_${item._id}`;
    if (item.productId) return `loc_${item.productId}`;
    return `temp_${item.productName}_${item.price}`;
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      if (token) {
        const res = await axiosInstance.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data.items || []);
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(localCart);
      }
    } catch (err: any) {
      console.error("Lỗi khi tải giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleDelete = async (key: string) => {
    const token = localStorage.getItem("token");

    try {
      if (token && key.startsWith("srv_")) {
        const id = key.replace("srv_", "");
        await axiosInstance.delete(`/cart/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updated = localCart.filter((item: any) => getKey(item) !== key);
        localStorage.setItem("cart", JSON.stringify(updated));
        setCartItems(updated);
      }

      setSelectedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const handleSelect = (key: string, selected: boolean) => {
    setSelectedKeys((prev) => {
      const newSet = new Set(prev);
      selected ? newSet.add(key) : newSet.delete(key);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedKeys.size === cartItems.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(cartItems.map(getKey)));
    }
  };

  const selectedTotal = cartItems
    .filter((item) => selectedKeys.has(getKey(item)))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 🔥 Nhấn thanh toán -> mở popup nhập email
  const handleCheckout = () => {
    if (selectedKeys.size === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }

    setShowEmailModal(true);
  };

  // 🟩 Check email
  const checkEmail = async () => {
    if (!email) {
      alert("Vui lòng nhập email!");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/check-email", { email });

      if (res.data.exists) {
        alert("Email đã đăng ký. Vui lòng đăng nhập!");
        navigate("/login", { state: { email } });
      } else {
        // Email chưa có -> hiện form đăng ký nhanh
        setShowRegisterForm(true);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi kiểm tra email");
    }
  };

  // 🟦 Đăng ký + gửi mật khẩu email + chuyển sang thanh toán
  const registerAndContinue = async () => {
    if (!fullname || !address) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/register-quick", {
        email,
        fullname,
        address,
      });

      alert("Đăng ký thành công! Mật khẩu đã được gửi về email.");

      localStorage.setItem("token", res.data.token);

      const itemsToPay = cartItems.filter((item) =>
        selectedKeys.has(getKey(item))
      );

      navigate("/payment", {
        state: { cartItems: itemsToPay, total: selectedTotal },
      });
    } catch (err) {
      console.error(err);
      alert("Đăng ký thất bại!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Giỏ Hàng Của Bạn</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-xl text-gray-500 mb-4">Giỏ hàng trống</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={
                selectedKeys.size === cartItems.length && cartItems.length > 0
              }
              onChange={toggleSelectAll}
              className="w-5 h-5 text-orange-600"
            />
            <span className="font-medium">
              Chọn tất cả ({selectedKeys.size}/{cartItems.length})
            </span>
          </div>

          <div className="space-y-4 mb-6">
            {cartItems.map((item) => {
              const key = getKey(item);
              return (
                <CartItem
                  key={key}
                  item={item}
                  onDelete={handleDelete}
                  onSelect={handleSelect}
                  isSelected={selectedKeys.has(key)}
                />
              );
            })}
          </div>

          <div className="border-t pt-6 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">
                Tổng tiền ({selectedKeys.size} sản phẩm):
              </p>
              <p className="text-2xl font-bold text-red-600">
                {selectedTotal.toLocaleString("vi-VN")}₫
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className={`w-full py-4 rounded-lg font-bold text-white bg-orange-500 hover:bg-orange-600 text-lg shadow-lg`}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </>
      )}

      {/* 🔥 FORM NHẬP EMAIL */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Nhập email của bạn</h2>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Email"
            />

            <button
              onClick={checkEmail}
              className="w-full bg-orange-500 text-white py-2 rounded"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {/* 🔥 FORM ĐĂNG KÝ NHANH */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Đăng ký tài khoản</h2>

            <input
              type="text"
              className="w-full p-2 border rounded mb-3"
              placeholder="Họ và tên"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />

            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button
              onClick={registerAndContinue}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Đăng ký & Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
