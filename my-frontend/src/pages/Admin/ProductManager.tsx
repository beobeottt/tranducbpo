import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import axiosInstance from "../../api/axios";
import { getImageUrl } from "../../utils/imageUtils";

interface Product {
  _id?: string;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  typeProduct: "New Product" | "Best Seller";
  img?: string;
  brand?: string;
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
    brand: "",
    img: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/product");
      setProducts(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      productName: "",
      description: "",
      price: 0,
      quantity: 0,
      typeProduct: "New Product",
      brand: "",
      img: "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };


  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setSelectedImage(null);
    setImagePreview(product.img ? getImageUrl(product.img) : null);
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
    if (submitting) return;
    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("productName", formData.productName);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price.toString());
      submitData.append("quantity", formData.quantity.toString());
      submitData.append("typeProduct", formData.typeProduct);
      if (formData.brand) {
        submitData.append("brand", formData.brand);
      }
      if (selectedImage) {
        submitData.append("image", selectedImage);
      }

      if (editingProduct) {
        await axiosInstance.patch(
          `/product/${editingProduct._id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("✅ Cập nhật sản phẩm thành công!");
      } else {
        await axiosInstance.post("/product", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("✅ Thêm sản phẩm thành công!");
      }
      setIsModalOpen(false);
      setSelectedImage(null);
      setImagePreview(null);
      await fetchProducts();
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
      alert("❌ Lưu sản phẩm thất bại!");
    } finally {
      setSubmitting(false);
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
            <th className="p-3">Ảnh</th>
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
              <td className="p-3">
                {p.img ? (
                  <img
                    src={getImageUrl(p.img)}
                    alt={p.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </td>
              <td className="p-3">{p.productName}</td>
              <td className="p-3">{p.description}</td>
              <td className="p-3">{p.price} ₫</td>
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
              {/* Upload Ảnh */}
              <div>
                <label className="block text-sm font-medium mb-1">Ảnh sản phẩm</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border p-2 rounded"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

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
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand || ""}
                onChange={handleChange}
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
                  disabled={submitting}
                  className={`px-4 py-2 rounded text-white ${
                    submitting
                      ? "bg-green-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {submitting
                    ? "Đang lưu..."
                    : editingProduct
                    ? "Update"
                    : "Add"}
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
