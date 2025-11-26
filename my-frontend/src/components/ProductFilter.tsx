import { useEffect, useState } from "react";

interface FilterProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: any;
}

const ProductFilter: React.FC<FilterProps> = ({ onFilterChange, initialFilters }) => {
  const [brand, setBrand] = useState(initialFilters?.brand || "");
  const [priceMin, setPriceMin] = useState(initialFilters?.priceMin || 0);
  const [priceMax, setPriceMax] = useState(initialFilters?.priceMax || 50000000);

  const [typeProduct, setTypeProduct] = useState(initialFilters?.typeProduct || "");

  const brandList = ["Apple", "Samsung", "Dell", "Sony", "ASUS", "LG"];

  // Mỗi khi thay đổi filter → gửi lên parent
  useEffect(() => {
    onFilterChange({
      brand: brand || undefined,
      priceMin,
      priceMax,
      typeProduct: typeProduct || undefined,
    });
  }, [brand, priceMin, priceMax, typeProduct]);

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">

      {/* BRAND */}
      <div>
        <label className="font-semibold">Thương Hiệu Nổi Bật</label>
        <select
          className="w-full border p-2 rounded mt-1"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Tất cả</option>
          {brandList.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* PRICE RANGE */}
      <div className="mt-4">
        <label className="font-semibold">Tầm Giá Sản Phẩm</label>

        <div className="flex items-center gap-4 mt-2">
          <span>{priceMin.toLocaleString()}₫</span>

          <input
            type="range"
            min={0}
            max={50000000}
            value={priceMin}
            step={50000}
            onChange={(e) => setPriceMin(Number(e.target.value))}
            className="flex-1"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="font-semibold">Loại Sản Phẩm</label>
        <select
          className="w-full border p-2 rounded mt-1"
          value={typeProduct}
          onChange={(e) => setTypeProduct(e.target.value)}
        >
          <option value="">Tất cả</option>
          <option value="New Product">New Product</option>
          <option value="Best Seller">Best Seller</option>
        </select>
      </div>

    </div>
  );
};

export default ProductFilter;
