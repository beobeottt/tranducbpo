import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import axiosInstance from "../../api/axios";
import ProductGrid from "../ProductDetail/ProductGrid";
import ProductFilter from "../../components/ProductFilter";

import { Product } from "../../types/product";
import FloatingActionButtons from "../../components/ActionButton";

interface FilterParams {
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  typeProduct?: "New Product" | "Best Seller";
  minQuantity?: number;
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
  page?: number;
  limit?: number;
}

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Lấy filter từ URL params
  const getFiltersFromParams = (): FilterParams | null => {
    const brand = searchParams.get("brand");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const typeProduct = searchParams.get("typeProduct");
    const minQuantity = searchParams.get("minQuantity");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");

    const hasAnyFilter =
      brand || priceMin || priceMax || typeProduct || minQuantity || search;

    if (!hasAnyFilter) return null;

    return {
      brand: brand || undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      typeProduct: typeProduct as "New Product" | "Best Seller" | undefined,
      minQuantity: minQuantity ? Number(minQuantity) : undefined,
      search: search || undefined,
      sortBy: sortBy as FilterParams["sortBy"] || undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
    };
  };

  // Fetch có filter
  const fetchProducts = async (filters: FilterParams) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await axiosInstance.get(`/product/filter?${params}`);

      setProducts(
        (response.data.products || []).map((p: any) => ({
          ...p,
          img: p.img || p.image || "",
        }))
      );

      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải sản phẩm!");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ALL khi không có filter
  const fetchAllProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/product");
      setProducts(
        (response.data || []).map((p: any) => ({
          ...p,
          img: p.img || p.image || "",
        }))
      );
    } catch (err) {
      setError("Không thể tải sản phẩm!");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filters = getFiltersFromParams();
    if (filters) fetchProducts(filters);
    else fetchAllProducts();
  }, [searchParams]);

  // Khi đổi filter
  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    const currentParams = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        currentParams.set(key, String(value));
      } else {
        currentParams.delete(key);
      }
    });

    currentParams.set("page", "1");

    setSearchParams(currentParams);
  };

  // Pagination
  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", String(newPage));
    setSearchParams(currentParams);
  };

  return (
    <div>
      <NavBar />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h1>

          <ProductFilter
            onFilterChange={handleFilterChange}
            initialFilters={getFiltersFromParams() || undefined}
          />

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
              {error}
            </div>
          )}

          <ProductGrid
            products={products}
            search={searchParams.get("search") || ""}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-3">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Trước
              </button>

              <span>
                Trang {pagination.page} / {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
      <FloatingActionButtons/>
    </div>
  );
};

export default ProductsPage;
