// Central API helper for College Service Request Management System
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const getToken = () => localStorage.getItem("access_token");

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }
};

export const getUser = () => {
  try {
    const userStr = localStorage.getItem("user_info");
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user_info", JSON.stringify(user));
  } else {
    localStorage.removeItem("user_info");
  }
};

export const clearAuth = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_info");
};

// Core fetch wrapper
export async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      clearAuth();
      // Only redirect if not already on the login or register page
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login?session_expired=1";
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || "Session expired. Please log in again.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg =
        data.detail || data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Unable to connect to the backend server. Please make sure FastAPI is running on port 8000.");
    }
    throw error;
  }
}

// Grouped API services
export const authApi = {
  login: async (email, password) => {
    const data = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    setUser({
      role: data.role,
      name: data.name || email.split("@")[0],
      email: data.email || email,
      user_id: data.user_id,
    });
    return data;
  },

  register: async (name, email, password, role = "STUDENT") => {
    return await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  logout: () => {
    clearAuth();
    window.location.href = "/login";
  },
};

export const studentApi = {
  getMyRequests: () => apiRequest("/requests/my"),
  getRequest: (id) => apiRequest(`/requests/${id}`),
  createRequest: (data) =>
    apiRequest("/requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateRequest: (id, data) =>
    apiRequest(`/requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteRequest: (id) =>
    apiRequest(`/requests/${id}`, {
      method: "DELETE",
    }),
};

export const staffApi = {
  getRequests: () => apiRequest("/staff/requests"),
  getRequest: (id) => apiRequest(`/staff/requests/${id}`),
  updateStatus: (id, status) =>
    apiRequest(`/staff/requests/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  assignRequest: (id, staff_id) =>
    apiRequest(`/staff/requests/${id}/assign`, {
      method: "PUT",
      body: JSON.stringify({ staff_id }),
    }),
  getStaffMembers: () => apiRequest("/staff/members"),
  deleteRequest: (id) =>
    apiRequest(`/staff/requests/${id}`, {
      method: "DELETE",
    }),
};

export const adminApi = {
  getUsers: () => apiRequest("/users"),
  getUser: (id) => apiRequest(`/users/${id}`),
  updateUser: (id, data) =>
    apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteUser: (id) =>
    apiRequest(`/users/${id}`, {
      method: "DELETE",
    }),
  getCategories: () => apiRequest("/categories"),
  getCategory: (id) => apiRequest(`/categories/${id}`),
  createCategory: (name) =>
    apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  updateCategory: (id, name) =>
    apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),
  deleteCategory: (id) =>
    apiRequest(`/categories/${id}`, {
      method: "DELETE",
    }),
};
