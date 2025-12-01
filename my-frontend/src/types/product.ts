
export interface ProductVariant {
  id?: string;
  label: string;
  price: number;
  quantity?: number;
  sku?: string;
  image?: string;
}

export interface Product {
  _id: string;
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  img: string;
  brand?: string;
  typeProduct?: "New Product" | "Best Seller";
  variants?: ProductVariant[];
}