// components/ProductCard.tsx

import { Link } from "react-router-dom";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
        <img
          src={product.img}
          alt={product.productName}
          className="w-full h-48 object-cover group-hover:scale-105 transition"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600">
            {product.productName}
          </h3>
          <p className="text-xl font-bold text-blue-600 mt-2">
            {product.price.toLocaleString("vi-VN")}₫
          </p>
          {product.quantity < 5 && (
            <p className="text-sm text-red-500 mt-1">
              Chỉ còn {product.quantity} sản phẩm!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;