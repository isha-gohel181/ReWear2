// frontend/src/lib/apiServices.js
import api from "./api";

// 🔐 Auth Services
export const authService = {
  getMe: () => api.get("/auth/me"),
  getStatus: () => api.get("/auth/status"),
};

// 👤 User Services
export const userService = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (data) => api.put("/users/me", data),
  getAllUsers: (params) => api.get("/users", { params }),
  deleteAccount: () => api.delete("/users/me"),
};

// 📦 Item Services
export const itemService = {
  createItem: (formData) =>
    api.post("/items", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getItems: (params) => api.get("/items", { params }),
  getItemById: (id) => api.get(`/items/${id}`),
  updateItem: (id, formData) =>
    api.put(`/items/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteItem: (id) => api.delete(`/items/${id}`),
  moderateItem: (data) => api.post("/items/moderate", data),
  // 👍 Like functionality
  toggleLike: (id) => api.post(`/items/${id}/like`),
  // 📤 Share functionality
  shareItem: (id) => api.post(`/items/${id}/share`),
  // 💖 NEW: Get liked items
  getLikedItems: (params) => api.get("/items/user/liked", { params }),
};

// 🔁 Swap Services
export const swapService = {
  requestSwap: (data) => api.post("/swaps/request", data),
  respondToSwap: (data) => api.post("/swaps/respond", data),
  getUserSwaps: (params = {}) => api.get("/swaps/user", { params }),
  addMessage: (data) => api.post("/swaps/message", data),
};

// 🛠️ Admin Services
export const adminService = {
  getPendingItems: (params) => api.get("/admin/pending-items", { params }),
  getStats: () => api.get("/admin/stats"),
  updateUserRole: (data) => api.post("/admin/user-role", data),
};

// 💬 Message Services
export const messageService = {
  sendMessage: (data) => api.post('/messages', data),
  getMessages: (params) => api.get('/messages', { params }),
  markAsRead: (messageId) => api.patch(`/messages/${messageId}/read`),
  getUnreadCount: () => api.get('/messages/unread-count'),
};