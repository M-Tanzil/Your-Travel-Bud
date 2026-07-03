import axiosInstance from '../utils/axiosInstance';

// ─── CITIES ───────────────────────────────────────────────────────
export const cityAPI = {
  getAll: (params) => axiosInstance.get('/cities', { params }),
  getOne: (id) => axiosInstance.get(`/cities/${id}`),
  create: (data) => axiosInstance.post('/cities', data),
  update: (id, data) => axiosInstance.put(`/cities/${id}`, data),
  delete: (id) => axiosInstance.delete(`/cities/${id}`),
  addPhoto: (id, formData) => axiosInstance.post(`/cities/${id}/photos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ─── PLACES ───────────────────────────────────────────────────────
export const placeAPI = {
  getAll: (params) => axiosInstance.get('/places', { params }),
  getOne: (id) => axiosInstance.get(`/places/${id}`),
  getNearby: (params) => axiosInstance.get('/places/nearby', { params }),
  create: (data) => axiosInstance.post('/places', data),
  update: (id, data) => axiosInstance.put(`/places/${id}`, data),
  delete: (id) => axiosInstance.delete(`/places/${id}`),
};

// ─── HOTELS ───────────────────────────────────────────────────────
export const hotelAPI = {
  search: (params) => axiosInstance.get('/hotels', { params }),
  getOne: (id) => axiosInstance.get(`/hotels/${id}`),
  compare: (ids) => axiosInstance.get('/hotels/compare', { params: { ids } }),
  searchAmadeus: (params) => axiosInstance.get('/bookings/hotel/search', { params }),
  create: (data) => axiosInstance.post('/hotels', data),
  update: (id, data) => axiosInstance.put(`/hotels/${id}`, data),
  delete: (id) => axiosInstance.delete(`/hotels/${id}`),
};

// ─── ITINERARIES ──────────────────────────────────────────────────
export const itineraryAPI = {
  getAll: (params) => axiosInstance.get('/itineraries', { params }),
  getOne: (id) => axiosInstance.get(`/itineraries/${id}`),
  create: (data) => axiosInstance.post('/itineraries', data),
  aiGenerate: (data) => axiosInstance.post('/itineraries/ai-generate', data),
  update: (id, data) => axiosInstance.put(`/itineraries/${id}`, data),
  delete: (id) => axiosInstance.delete(`/itineraries/${id}`),
  duplicate: (id, data) => axiosInstance.post(`/itineraries/${id}/duplicate`, data),
  getTravelTimes: (id, data) => axiosInstance.post(`/itineraries/${id}/travel-times`, data),
};

// ─── BOOKINGS ─────────────────────────────────────────────────────
export const bookingAPI = {
  getAll: (params) => axiosInstance.get('/bookings', { params }),
  getRefunds: () => axiosInstance.get('/bookings/refunds'),
  // Hotel
  searchHotels: (params) => axiosInstance.get('/bookings/hotel/search', { params }),
  getHotelBookings: (params) => axiosInstance.get('/bookings/hotel', { params }),
  bookHotel: (data) => axiosInstance.post('/bookings/hotel', data),
  cancelHotel: (id, data) => axiosInstance.put(`/bookings/hotel/${id}/cancel`, data),
  // Train
  searchTrains: (params) => axiosInstance.get('/bookings/train/search', { params }),
  checkTrainAvailability: (params) => axiosInstance.get('/bookings/train/availability', { params }),
  getTrainBookings: (params) => axiosInstance.get('/bookings/train', { params }),
  bookTrain: (data) => axiosInstance.post('/bookings/train', data),
  cancelTrain: (id, data) => axiosInstance.put(`/bookings/train/${id}/cancel`, data),
  // Bus
  searchBuses: (params) => axiosInstance.get('/bookings/bus/search', { params }),
  getBusSeatLayout: (busId) => axiosInstance.get(`/bookings/bus/seats/${busId}`),
  getBusBookings: (params) => axiosInstance.get('/bookings/bus', { params }),
  bookBus: (data) => axiosInstance.post('/bookings/bus', data),
  cancelBus: (id, data) => axiosInstance.put(`/bookings/bus/${id}/cancel`, data),
};

// ─── HIDDEN GEMS ──────────────────────────────────────────────────
export const hiddenGemAPI = {
  getByCity: (cityId) => axiosInstance.get(`/hidden-gems/city/${cityId}`),
  getOne: (id) => axiosInstance.get(`/hidden-gems/${id}`),
  getTravelTime: (data) => axiosInstance.post('/hidden-gems/travel-time', data),
  create: (data) => axiosInstance.post('/hidden-gems', data),
  update: (id, data) => axiosInstance.put(`/hidden-gems/${id}`, data),
  delete: (id) => axiosInstance.delete(`/hidden-gems/${id}`),
};

// ─── BLOGS ────────────────────────────────────────────────────────
export const blogAPI = {
  getAll: (params) => axiosInstance.get('/blogs', { params }),
  getOne: (id) => axiosInstance.get(`/blogs/${id}`),
  getMyBlogs: (params) => axiosInstance.get('/blogs/my-blogs', { params }),
  create: (data) => axiosInstance.post('/blogs', data),
  update: (id, data) => axiosInstance.put(`/blogs/${id}`, data),
  delete: (id) => axiosInstance.delete(`/blogs/${id}`),
};

// ─── REVIEWS ──────────────────────────────────────────────────────
export const reviewAPI = {
  getAll: (params) => axiosInstance.get('/reviews', { params }),
  create: (data) => axiosInstance.post('/reviews', data),
  update: (id, data) => axiosInstance.put(`/reviews/${id}`, data),
  delete: (id) => axiosInstance.delete(`/reviews/${id}`),
};

// ─── WISHLIST ─────────────────────────────────────────────────────
export const wishlistAPI = {
  get: () => axiosInstance.get('/wishlist'),
  add: (data) => axiosInstance.post('/wishlist', data),
  remove: (itemId) => axiosInstance.delete(`/wishlist/${itemId}`),
};

// ─── SUPPORT ──────────────────────────────────────────────────────
export const supportAPI = {
  getMyConversation: () => axiosInstance.get('/support/my'),
  sendMessage: (data) => axiosInstance.post('/support/my', data),
  getAllConversations: (params) => axiosInstance.get('/support', { params }),
  adminReply: (id, data) => axiosInstance.post(`/support/${id}/reply`, data),
  closeConversation: (id) => axiosInstance.put(`/support/${id}/close`),
};

// ─── WEATHER ──────────────────────────────────────────────────────
export const weatherAPI = {
  get: (params) => axiosInstance.get('/weather', { params }),
};

// ─── BUDGET ───────────────────────────────────────────────────────
export const budgetAPI = {
  estimate: (data) => axiosInstance.post('/budget/estimate', data),
};

// ─── LEADERBOARD ──────────────────────────────────────────────────
export const leaderboardAPI = {
  getPlaces: (params) => axiosInstance.get('/leaderboard/places', { params }),
  getHotels: (params) => axiosInstance.get('/leaderboard/hotels', { params }),
};

// ─── ADMIN ────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: (params) => axiosInstance.get('/admin/stats', { params }),
  getActivity: () => axiosInstance.get('/admin/activity'),
  getUsers: (params) => axiosInstance.get('/admin/users', { params }),
  toggleUser: (id) => axiosInstance.put(`/admin/users/${id}/toggle`),
  getRefunds: (params) => axiosInstance.get('/admin/refunds', { params }),
  processRefund: (id, data) => axiosInstance.put(`/admin/refunds/${id}`, data),
  sendAnnouncement: (data) => axiosInstance.post('/admin/announcements', data),
  getSettings: () => axiosInstance.get('/admin/settings'),
  updateSettings: (data) => axiosInstance.put('/admin/settings', data),
  aiChat: (data) => axiosInstance.post('/admin/ai-chat', data),
  getFoodShops: (params) => axiosInstance.get('/admin/food-shops', { params }),
  createFoodShop: (data) => axiosInstance.post('/admin/food-shops', data),
  updateFoodShop: (id, data) => axiosInstance.put(`/admin/food-shops/${id}`, data),
  deleteFoodShop: (id) => axiosInstance.delete(`/admin/food-shops/${id}`),
  getEvents: (params) => axiosInstance.get('/admin/events', { params }),
  createEvent: (data) => axiosInstance.post('/admin/events', data),
  updateEvent: (id, data) => axiosInstance.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => axiosInstance.delete(`/admin/events/${id}`),
};

// ─── USER ─────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: (id) => axiosInstance.get(id ? `/users/profile/${id}` : '/users/profile'),
  updateProfile: (data) => axiosInstance.put('/users/profile', data),
  updateSettings: (data) => axiosInstance.put('/users/settings', data),
  getHistory: () => axiosInstance.get('/users/history'),
  deleteAccount: () => axiosInstance.delete('/users/account'),
};
