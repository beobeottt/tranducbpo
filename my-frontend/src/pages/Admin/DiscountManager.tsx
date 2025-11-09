import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import axiosInstance from "../../api/axios";

interface Discount {
  _id?: string;
  code: string;
  value: number;
  discountType: string;
  startDate: string;
  endDate: string;
}

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCode, setNewCode] = useState("");
  const [newValue, setNewValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // 📦 Fetch all discounts
  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("http://localhost:3000/discount");
      setDiscounts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load discount codes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // ➕ Create discount
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCode || newValue <= 0 || !startDate || !endDate)
      return alert("Please fill in all fields!");

    try {
      setSubmitting(true);

      // ✅ Convert to ISO Date (MongoDB chuẩn)
      const payload = {
        code: newCode.trim().toUpperCase(),
        value: newValue,
        discountType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };

      await axiosInstance.post("http://localhost:3000/discount", payload);

      // Reset form
      setNewCode("");
      setNewValue(0);
      setStartDate("");
      setEndDate("");
      setDiscountType("percentage");

      // Reload data
      fetchDiscounts();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create discount!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Discount Management">
      <h2 className="text-2xl font-bold mb-4">Discount Codes</h2>

      {/* ➕ FORM CREATE DISCOUNT */}
      <form
        onSubmit={handleCreate}
        className="bg-white shadow-md rounded p-4 mb-6 grid grid-cols-6 gap-4 items-end"
      >
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Code</label>
          <input
            type="text"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="e.g. SPRING2025"
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Value</label>
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(Number(e.target.value))}
            placeholder="10"
            className="border p-2 rounded"
            min={1}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Type</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
            className="border p-2 rounded"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₫)</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Discount"}
        </button>
      </form>

      {/* 📋 LIST DISCOUNTS */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : discounts.length === 0 ? (
        <p>No discount codes found.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">Value</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono">{d.code}</td>
                <td className="p-3 capitalize">{d.discountType}</td>
                <td className="p-3">
                  {d.discountType === "percentage"
                    ? `${d.value}%`
                    : `${d.value.toLocaleString()}₫`}
                </td>
                <td className="p-3">
                  {new Date(d.startDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3">
                  {new Date(d.endDate).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
};

export default AdminDiscounts;
