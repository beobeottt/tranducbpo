
export interface Product {
  _id: string;
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  img: string;
  brand?: string;
  typeProduct?: "New Product" | "Best Seller";
}