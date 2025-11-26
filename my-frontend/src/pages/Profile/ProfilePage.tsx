import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../auth/useAuth";

interface User {
  _id: string;
  fullname: string;
  email: string;
  shippingAddress?: string;
  gender?: "Male" | "Female";
  role: "User" | "Admin" | "Manager";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  point?: number;
}

interface OrderStatusEntry {
  status: string;
  timestamp: string;
}

interface OrderHistory {
  _id: string;
  totalPrice: number;
  payableAmount?: number;
  pointsEarned?: number;
  pointsRedeemed?: number;
  status: string;
  statusHistory?: OrderStatusEntry[];
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);


  const [formData, setFormData] = useState<Partial<User>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [ordersError, setOrdersError] = useState<string>("");


  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/user/${id}`);
        setUser(res.data);
        setFormData(res.data); // Sync formData
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const res = await axiosInstance.get(`/order/user/${id}`);
        setOrders(res.data || []);
        setOrdersError("");
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrdersError("Không thể tải danh sách đơn hàng.");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  // ============================
  // Handle Input Change
  // ============================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      const body = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          body.append(key, value.toString());
        }
      });

      if (avatarFile) body.append("avatar", avatarFile);

      const res = await axiosInstance.patch(`/user/${id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setFormData(res.data);
      setAvatarFile(null);
      setEditMode(false);

      alert("Cập nhật hồ sơ thành công!");
    } catch (err: any) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Cập nhật thất bại.");
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleChangePassword = async () => {
  if (!currentPassword || !newPassword) {
    setPasswordMessage("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordMessage("Mật khẩu không trùng khớp!");
    return;
  }

  try {
    const res = await axiosInstance.post("/auth/change-password", {
      userId: id,
      currentPassword,
      newPassword,
    });

    alert(res.data.message);

    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("");
  } catch (err: any) {
    setPasswordMessage(err.response?.data?.message || "Đổi mật khẩu thất bại.");
  }
};


  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (!user)
    return (
      <div className="text-center py-20 text-red-600">
        Không tìm thấy người dùng.
      </div>
    );

  const displayAvatar =
    avatarFile
      ? URL.createObjectURL(avatarFile)
      : user.avatar
        ? `http://localhost:3000${user.avatar}`
        : "https://via.placeholder.com/150?text=Avatar";

  const formatCurrency = (value?: number) =>
    (value ?? 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  const formatDateTime = (value?: string) =>
    value ? new Date(value).toLocaleString("vi-VN") : "—";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-xl p-8">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={displayAvatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
            />

            {editMode && (
              <label className="mt-3 cursor-pointer">
                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                  Chọn ảnh
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow">
              <p className="text-sm uppercase tracking-wide opacity-90">
                Điểm thưởng khả dụng
              </p>
              <p className="text-4xl font-bold mt-1">
                {(user.point ?? 0).toLocaleString("vi-VN")} điểm
              </p>
              <p className="text-xs mt-2 opacity-90">
                Bạn sẽ nhận 10% giá trị mỗi đơn hàng sau khi hoàn tất thanh toán.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>


            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              />
            </div>


            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Địa chỉ giao hàng
              </label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
              >
                <option value="">Chọn giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>
          </div>


          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-medium transition"
            >
              Đăng xuất
            </button>

            <div className="flex gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setAvatarFile(null);
                      setFormData(user); 
                    }}
                    className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Đổi mật khẩu
                  </button>
                </>
              )}
            </div>
          </div>


          {showPasswordModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Đổi mật khẩu
                </h2>

                <input
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full mb-3 px-4 py-2 border rounded-lg"
                />

                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mb-3 px-4 py-2 border rounded-lg"
                />

                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mb-3 px-4 py-2 border rounded-lg"
                />

                {passwordMessage && (
                  <p className="text-red-600 text-center mb-3">
                    {passwordMessage}
                  </p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Đơn hàng của bạn</h2>
          {ordersLoading ? (
            <div className="text-center py-10 text-gray-500">Đang tải đơn hàng...</div>
          ) : ordersError ? (
            <div className="text-center py-10 text-red-600">{ordersError}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow">
              Bạn chưa có đơn hàng nào.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const history = [...(order.statusHistory || [])].sort(
                  (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                return (
                  <div key={order._id} className="bg-white shadow rounded-xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Mã đơn</p>
                        <p className="font-semibold break-all">{order._id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày tạo</p>
                        <p className="font-semibold">{formatDateTime(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái hiện tại</p>
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-gray-500">Giá trị đơn</p>
                        <p className="text-lg font-semibold">{formatCurrency(order.totalPrice)}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-gray-500">Đã áp dụng điểm</p>
                        <p className="text-lg font-semibold text-purple-600">
                          {(order.pointsRedeemed ?? 0).toLocaleString("vi-VN")} điểm
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-gray-500">Điểm nhận được</p>
                        <p className="text-lg font-semibold text-green-600">
                          {(order.pointsEarned ?? 0).toLocaleString("vi-VN")} điểm
                        </p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                          <tr>
                            <th className="px-4 py-2">Trạng thái</th>
                            <th className="px-4 py-2">Thời gian</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="px-4 py-3 text-center text-gray-500">
                                Chưa có lịch sử trạng thái.
                              </td>
                            </tr>
                          ) : (
                            history.map((entry, index) => (
                              <tr key={`${order._id}-${entry.status}-${index}`} className="border-t">
                                <td className="px-4 py-2 font-medium">{entry.status}</td>
                                <td className="px-4 py-2 text-gray-500">{formatDateTime(entry.timestamp)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
