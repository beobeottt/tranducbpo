import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import axiosInstance from "../../api/axios";

interface Product {
  _id?: string;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  typeProduct: "New Product" | "Best Seller";
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Product>({
    productName: "",
    description: "",
    price: 0,
    quantity: 0,
    typeProduct: "New Product",
  });


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("http://localhost:3000/product");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      productName: "",
      description: "",
      price: 0,
      quantity: 0,
      typeProduct: "New Product",
    });
    setIsModalOpen(true);
  };


  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };


  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    try {
      await axiosInstance.delete(`http://localhost:3000/product/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      alert("❌ Xóa thất bại!");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {

        await axiosInstance.patch(`http://localhost:3000/product/${editingProduct._id}`, formData);
        alert("✅ Cập nhật sản phẩm thành công!");
      } else {

        await axiosInstance.post("http://localhost:3000/product", formData);
        alert("✅ Thêm sản phẩm thành công!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
      alert("❌ Lưu sản phẩm thất bại!");
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <DashboardLayout title="Products">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Description</th>
            <th className="p-3">Price</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Type</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.productName}</td>
              <td className="p-3">{p.description}</td>
              <td className="p-3">{p.price} $</td>
              <td className="p-3">{p.quantity}</td>
              <td className="p-3">{p.typeProduct}</td>
              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 bg-sky-400 text-white rounded hover:bg-sky-500"
                >
                  Edit✏️
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete🗑
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
              {editingProduct ? "✏️ Edit Product" : "➕ Add Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <select
                name="typeProduct"
                value={formData.typeProduct}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="New Product">New Product</option>
                <option value="Best Seller">Best Seller</option>
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
                  {editingProduct ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminProducts;
