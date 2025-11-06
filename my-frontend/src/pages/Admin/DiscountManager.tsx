import { useEffect, useState } from "react";
import { discountService } from "../../services/authService";
import DashboardLayout from "./DashboardLayout";


interface Discount {
  _id: string;
  code: string;
  value: number;
}

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    discountService.getAll().then(setDiscounts);
  }, []);

  return (
    <DashboardLayout title="">
      <h2 className="text-2xl font-bold mb-4">Discount Codes</h2>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Code</th>
            <th className="p-3">Value</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d) => (
            <tr key={d._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{d.code}</td>
              <td className="p-3">{d.value}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default AdminDiscounts;
