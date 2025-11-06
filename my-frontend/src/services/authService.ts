import axiosInstance from "../api/axios";



export const authService = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/auth/Login", { email, password });
    return response.data;
  },

  register: async (
    email: string,
    fullname: string,
    password: string,
    gender: string,
    shippingAddress: string
  ) => {
    const response = await axiosInstance.post("/auth/register", {
      email,
      fullname,
      password,
      gender,
      shippingAddress,
    });
    return response.data;
  },
};


export const productService = {
  getAll: async () => {
    const res = await axiosInstance.get("/product");
    return res.data;
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(`/product/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await axiosInstance.post("/product", data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await axiosInstance.put(`/product/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.delete(`/product/${id}`);
    return res.data;
  },
};


export const orderService = {
  getAll: async () => {
    const res = await axiosInstance.get("/order");
    return res.data;
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(`/order/${id}`);
    return res.data;
  },
};


export const userService = {
  getAll: async () => {
    const res = await axiosInstance.get("/user");
    return res.data;
  },
};


export const discountService = {
  getAll: async () => {
    const res = await axiosInstance.get("/discount");
    return res.data;
  },
};
