import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import axiosInstance from "../../api/axios";

interface Order {
  _id: string;
  user: string;
  totalPrice: number;
  status: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");

  // ✅ Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("http://localhost:3000/order");
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Xóa đơn hàng
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) return;
    try {
      await axiosInstance.delete(`http://localhost:3000/order/${id}`);
      setOrders(orders.filter((o) => o._id !== id));
      alert("✅ Đã xóa đơn hàng!");
    } catch (err) {
      console.error("Lỗi khi xóa đơn hàng:", err);
      alert("❌ Xóa thất bại!");
    }
  };

  // ✅ Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async () => {
    if (!editingOrder) return;
    try {
      await axiosInstance.patch(`http://localhost:3000/order/${editingOrder._id}`, {
        status: newStatus,
      });
      alert("✅ Cập nhật trạng thái thành công!");
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert("❌ Cập nhật thất bại!");
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải đơn hàng...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <DashboardLayout title="Orders">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Orders</h2>
      </div>

      {/* Bảng danh sách đơn hàng */}
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">User</th>
            <th className="p-3">Total Price</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{o.user}</td>
              <td className="p-3">${o.totalPrice.toLocaleString()}</td>
              <td className="p-3 font-medium">
                <span
                  className={`px-2 py-1 rounded ${
                    o.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : o.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : o.status === "Canceled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {o.status}
                </span>
              </td>
              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => {
                    setEditingOrder(o);
                    setNewStatus(o.status);
                  }}
                  className="px-3 py-1 bg-sky-400 text-white rounded hover:bg-sky-500"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(o._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chỉnh sửa trạng thái */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h3 className="text-lg font-semibold mb-4">
              Cập nhật trạng thái đơn hàng
            </h3>
            <p className="text-sm mb-2">
              <strong>Người dùng:</strong> {editingOrder.user}
            </p>
            <p className="text-sm mb-4">
              <strong>Tổng tiền:</strong> ${editingOrder.totalPrice}
            </p>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="Pending">Pending</option>
              <option value="Shipping">Shipping</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminOrders;
