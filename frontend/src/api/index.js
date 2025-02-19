import { api } from "./client.js";

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  updateProfile: (data) => api.patch("/auth/me", data),
  changePassword: (data) => api.post("/auth/change-password", data),
};

export const booksApi = {
  list: (params) => api.get("/books", params),
  top: () => api.get("/books/top"),
  latest: () => api.get("/books/latest"),
  get: (id) => api.get(`/books/${id}`),
  create: (data) => api.post("/books", data),
  update: (id, data) => api.patch(`/books/${id}`, data),
  remove: (id) => api.delete(`/books/${id}`),
  uploadCover: (id, file) => {
    const form = new FormData();
    form.append("cover", file);
    return api.upload(`/books/${id}/cover`, form);
  },
  uploadFile: (id, file) => {
    const form = new FormData();
    form.append("file", file);
    return api.upload(`/books/${id}/file`, form);
  },
};

export const categoriesApi = {
  list: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const ordersApi = {
  my: () => api.get("/orders/my"),
  create: (data) => api.post("/orders", data),
  cancel: (id) => api.delete(`/orders/${id}`),
  list: (params) => api.get("/orders", params),
  setStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const usersApi = {
  list: (params) => api.get("/users", params),
  setStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  setRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  createStaff: (data) => api.post("/users", data),
};

export const statsApi = {
  public: () => api.get("/stats"),
  admin: () => api.get("/stats/admin"),
};
