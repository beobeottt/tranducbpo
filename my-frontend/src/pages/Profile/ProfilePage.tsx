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
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Lấy dữ liệu người dùng
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/user/${id}`);
        setUser(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Lưu thay đổi
  const handleSave = async () => {
    if (!id) return;

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) dataToSend.append(key, value as string);
      });
      if (avatarFile) dataToSend.append("avatar", avatarFile);

      const res = await axiosInstance.patch(`/user/${id}`, dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setEditMode(false);
      setAvatarFile(null);
      alert("Cập nhật hồ sơ thành công!");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Cập nhật thất bại.");
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // Về trang chủ, không cho back
  };

  // Loading & Not Found
  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (!user) return <div className="text-center py-20 text-red-600">Không tìm thấy người dùng.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-xl p-8">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : user.avatar
                  ? `http://localhost:3000${user.avatar}`
                  : "https://via.placeholder.com/150?text=Avatar"
              }
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

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ giao hàng</label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính</label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Chọn giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-medium transition flex items-center gap-2"
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
                    className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Lưu
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;