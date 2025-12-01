import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../auth/useAuth";
import { ShippingAddress } from "../../types/user";

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

  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalLoading, setAddressModalLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const emptyAddressForm: Omit<ShippingAddress, "id"> = {
    fullName: "",
    phone: "",
    addressLine: "",
    ward: "",
    district: "",
    city: "",
    label: "",
    note: "",
    isDefault: false,
  };
  const [addressForm, setAddressForm] = useState<Omit<ShippingAddress, "id">>(
    emptyAddressForm
  );


  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const { logout, user: authUser } = useAuth();
  const navigate = useNavigate();
  const isSelf =
    !!authUser && (authUser._id === id || authUser.id === id);

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

  const fetchAddresses = useCallback(async () => {
    if (!isSelf) return;
    try {
      const res = await axiosInstance.get("/user/addresses/me");
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Lỗi tải địa chỉ:", err);
    }
  }, [isSelf]);

  useEffect(() => {
    if (isSelf) {
      fetchAddresses();
    }
  }, [isSelf, fetchAddresses]);

  const defaultAddress = useMemo(
    () =>
      addresses.find((address) => address.isDefault) ||
      addresses[0] ||
      null,
    [addresses]
  );

  const openAddressModal = (address?: ShippingAddress) => {
    if (address) {
      setEditingAddress(address);
      const { id: _id, ...rest } = address;
      setAddressForm({ ...emptyAddressForm, ...rest });
    } else {
      setEditingAddress(null);
      setAddressForm({
        ...emptyAddressForm,
        isDefault: addresses.length === 0,
      });
    }
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
    setEditingAddress(null);
    setAddressForm(emptyAddressForm);
    setAddressModalLoading(false);
  };

  const handleAddressFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddressForm((prev) => ({
      ...prev,
      isDefault: e.target.checked,
    }));
  };

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addressForm.fullName?.trim() || !addressForm.phone?.trim() || !addressForm.addressLine?.trim()) {
      alert("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ.");
      return;
    }

    try {
      setAddressModalLoading(true);
      if (editingAddress) {
        await axiosInstance.patch(
          `/user/addresses/${editingAddress.id}`,
          addressForm
        );
      } else {
        await axiosInstance.post("/user/addresses", addressForm);
      }
      await fetchAddresses();
      closeAddressModal();
    } catch (err: any) {
      console.error("Lưu địa chỉ thất bại:", err);
      alert(err.response?.data?.message || "Không thể lưu địa chỉ.");
      setAddressModalLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await axiosInstance.delete(`/user/addresses/${addressId}`);
      fetchAddresses();
    } catch (err) {
      console.error("Xóa địa chỉ thất bại:", err);
      alert("Không thể xóa địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await axiosInstance.post(`/user/addresses/${addressId}/default`);
      fetchAddresses();
    } catch (err) {
      console.error("Đặt mặc định thất bại:", err);
      alert("Không thể đặt địa chỉ mặc định.");
    }
  };

  const formatAddressLine = (address: ShippingAddress) => {
    return [
      address.addressLine,
      address.ward,
      address.district,
      address.city,
    ]
      .filter(Boolean)
      .join(", ");
  };

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
                Địa chỉ giao hàng (Legacy)
              </label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Bạn có thể quản lý nhiều địa chỉ bên dưới và chọn địa chỉ mặc định cho các đơn hàng.
              </p>
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
            {isSelf && (
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Sổ địa chỉ giao hàng
                    </p>
                    <p className="text-sm text-gray-500">
                      Đặt một địa chỉ làm mặc định để sử dụng nhanh khi đặt hàng.
                    </p>
                  </div>
                  <button
                    onClick={() => openAddressModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    + Thêm địa chỉ
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="p-4 border border-dashed rounded-lg text-sm text-gray-500 bg-gray-50">
                    Bạn chưa có địa chỉ nào. Nhấn \"Thêm địa chỉ\" để tạo mới.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => {
                      const isDefault = address.isDefault;
                      return (
                        <div
                          key={address.id}
                          className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${
                            isDefault
                              ? "border-blue-500 bg-blue-50/60"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-800">
                                {address.fullName}
                              </p>
                              {isDefault && (
                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatAddressLine(address)}
                            </p>
                            {address.note && (
                              <p className="text-xs text-gray-500 mt-1">
                                Ghi chú: {address.note}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm">
                            <button
                              onClick={() => openAddressModal(address)}
                              className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                            >
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                            >
                              Xóa
                            </button>
                            {!isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Đặt mặc định
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleSaveAddress}
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg space-y-4"
          >
            <h2 className="text-xl font-semibold text-center">
              {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  name="fullName"
                  value={addressForm.fullName}
                  onChange={handleAddressFormChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  name="phone"
                  value={addressForm.phone}
                  onChange={handleAddressFormChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  name="addressLine"
                  value={addressForm.addressLine}
                  onChange={handleAddressFormChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phường/Xã</label>
                <input
                  name="ward"
                  value={addressForm.ward}
                  onChange={handleAddressFormChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Quận/Huyện</label>
                <input
                  name="district"
                  value={addressForm.district}
                  onChange={handleAddressFormChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                <input
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressFormChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nhãn</label>
                <input
                  name="label"
                  value={addressForm.label}
                  onChange={handleAddressFormChange}
                  placeholder="Nhà riêng, Văn phòng..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                <textarea
                  name="note"
                  value={addressForm.note}
                  onChange={handleAddressFormChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  rows={2}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={addressForm.isDefault || false}
                onChange={handleAddressCheckbox}
              />
              Đặt làm địa chỉ mặc định
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeAddressModal}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={addressModalLoading}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {addressModalLoading ? "Đang lưu..." : "Lưu địa chỉ"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
