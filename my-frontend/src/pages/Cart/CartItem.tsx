import React from "react";

interface CartItemProps {
  item: {
    _id?: string;
    productId?: string;
    shopName?: string;
    productName: string;
    image?: string;
    price: number;
    quantity: number;
    status?: string;
  };
  onDelete: (key: string) => void;
  onSelect: (key: string, selected: boolean) => void;
  isSelected: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ item, onDelete, onSelect, isSelected }) => {
  // TẠO KEY ỔN ĐỊNH
  const key = item._id ? `srv_${item._id}` : item.productId ? `loc_${item.productId}` : `temp_${item.productName}_${item.price}`;

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(key, e.target.checked)}
          className="mt-1 w-5 h-5 text-orange-500 rounded focus:ring-orange-400"
        />

        {/* Hình ảnh */}
        <img
          src={item.image || "https://via.placeholder.com/150?text=No+Image"}
          alt={item.productName}
          className="w-20 h-20 object-cover rounded-lg"
        />

        {/* Thông tin */}
        <div className="flex-1">
          <p className="font-semibold text-lg">{item.productName}</p>
          <p className="text-sm text-gray-500">{item.shopName || "Cửa hàng không xác định"}</p>
          <p className="text-sm text-green-600">{item.status || "Chưa giao hàng"}</p>
        </div>

        {/* Giá */}
        <div className="text-right">
          <p className="font-bold text-red-600">{item.price.toLocaleString()}₫</p>
          <p className="text-sm">x{item.quantity}</p>
          <p className="font-semibold text-orange-600">
            {(item.price * item.quantity).toLocaleString()}₫
          </p>
          <button
            onClick={() => onDelete(key)}
            className="mt-2 text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;