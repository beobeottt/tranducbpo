import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axiosInstance from "../api/axios";

interface CartContextType {
  cartCount: number;
  refreshCart: () => Promise<void>;
  addToCart: (product: any) => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: async () => {},
  addToCart: async () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);


  const refreshCart = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const res = await axiosInstance.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartCount(res.data.length || 0);
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(localCart.length);
      }
    } catch (err) {
      console.error("Lỗi khi load giỏ hàng:", err);
      setCartCount(0);
    }
  };

  // ✅ Thêm sản phẩm
  const addToCart = async (product: any) => {
    const token = localStorage.getItem("token");
    const cartItem = {
      productId: product._id,
      productName: product.productName,
      price: product.price,
      quantity: 1,
      url: product.img,
    };

    try {
      if (token) {
        await axiosInstance.post("/cart", cartItem, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = localCart.find((i: any) => i.productId === product._id);
        if (existing) existing.quantity += 1;
        else localCart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(localCart));
      }
      await refreshCart();
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
    }
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener("storage", refreshCart);
    return () => window.removeEventListener("storage", refreshCart);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
