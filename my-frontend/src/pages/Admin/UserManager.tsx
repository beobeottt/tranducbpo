import { useEffect, useState } from "react";
import { userService } from "../../services/authService";
import DashboardLayout from "./DashboardLayout";
import axiosInstance from "../../api/axios";
import axios from "axios";


interface User {
  _id?: string;
  fullname: string;
  email: string;
  shippingAddress: string;
  gender: string;
  role: string;
  favourite: Object;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<User>
  ({
    fullname: "",
    email: "",
    shippingAddress: "",
    gender: "Male",
    role: "User",
    favourite:[],
  });
  const fetchUsers = async () => {
    setLoading(true);

    try{
      const res = await axiosInstance.get("http://localhost:3000/user");
      setUsers(res.data);
    }
    catch(err)
    {
      console.error("Error fetching product:", err);
      setError("can not solve User data");
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() =>
  {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
  {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      fullname: "",
    email: "",
    shippingAddress: "",
    gender: "Male",
    role: "User",
    favourite:[],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) =>
  {
    setEditingUser(user);
    setFormData(user);
    setIsModalOpen(true);
  }

  const handleDelete = async (id?: string) =>
  {
    if (!id) return;
    if(!window.confirm("Bạn có chắc chắn muốn xoá User này không??"))  return;
    try {
      await axiosInstance.delete(`http://localhost:3000/user/${id}`);
      setUsers(users.filter((p) => p._id !== id));
    }
    catch(err)
    {
      console.error("Error when you delete User", err);
      alert("Delete error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    try{
      if(editingUser)
      {
        await axiosInstance.patch(`http://localhost:3000/user/${editingUser._id}`, formData);
        alert("Cập nhật sản phẩm thành công!");
      }
      else
      {
        await axiosInstance.post("http://localhost:3000/user", formData);
        alert("them san pham thanh cong");
      }
      setIsModalOpen(false);
      fetchUsers();
    }
    catch(err)
    {
      console.error("Error when save User", err);
      alert("Save User fail");
    }
  };

  return (
    <DashboardLayout title="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
      <button 
      onClick={handleAdd}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Add User
      </button>
      </div>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Full Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Shipping Address</th>
            <th className="p-3">Gender</th>
            <th className="p-3">Role</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{u.fullname}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.shippingAddress}</td>
              <td className="p-3">{u.gender}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3 text-center space-x-2">
                  <button
                  onClick={() => handleEdit(u)}
                  className="px-3"
                  >
                    Edit
                  </button>
                  <button
                  onClick={() => handleDelete(u._id)}
                  className="px-3"
                  >
                    Delete
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              {editingUser ? " Edit User" : " Add User"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="shippingAddress"
                placeholder="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="Male">Male</option>
                <option value="FeMale">FeMale</option>
              </select>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {editingUser ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminUsers;
