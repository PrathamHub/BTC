import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------- 🧾 Bill APIs --------------------

export const createBill = async (billData) =>
  api.post("/bill/create", billData);
export const getAllBills = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "/bill");

    // Check if response is an array, or if wrapped inside an object
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.bills && Array.isArray(response.data.bills)) {
      return response.data.bills;
    } else {
      return []; // fallback
    }
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw error;
  }
};
export const getBillByCustomerName = async (name) =>
  api.get(`/bills/customer/${name}`);
export const getTotalRevenue = async () => api.get("/bills/total");
export const updateBill = async (id, billData) => {
  const res = await api.put(`/bill/update/${id}`, billData);
  return res.data;
};
export const deleteBill = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/bill/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting bill:", error);
    throw error;
  }
};
export const updateBillAPI = async (id, updatedData) => {
  const res = await api.put(`/bill/${id}`, updatedData);
  return res.data;
};

// -------------------- 📦 Stock APIs --------------------

export const getAllStocks = () => api.get("/stocks");

// Update stock
export const updateStock = (data) => api.post("/stocks/update", data);

// -------------------- 🛒 Product APIs --------------------

export const getAllProducts = async () => api.get("/products");
export const getProductById = async (id) => api.get(`/products/${id}`);
export const createProduct = async (productData) =>
  api.post("/products", productData);
export const updateProduct = async (id, updatedData) =>
  api.put(`/products/${id}`, updatedData);
export const deleteProduct = async (id) => api.delete(`/products/${id}`);

export default api;
