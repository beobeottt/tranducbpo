export interface CartProduct {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  url?: string;
}

export const getCart = (): CartProduct[] => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

export const addToCart = (product: CartProduct): void => {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === product.productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Đã thêm vào giỏ hàng!");
};

export const clearCart = (): void => {
  localStorage.removeItem("cart");
};

export const syncCartToServer = async (token: string): Promise<void> => {
  const cart = getCart();
  if (cart.length === 0) return;

  await fetch("http://localhost:3000/cart/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cart),
  });

  clearCart();
};
