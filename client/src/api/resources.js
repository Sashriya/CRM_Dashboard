import api from "./client.js";

// ---- Auth ----
export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ---- Contacts ----
export const contactsApi = {
  list: (params) => api.get("/contacts", { params }),
  get: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post("/contacts", data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  remove: (id) => api.delete(`/contacts/${id}`),
};

// ---- Leads ----
export const leadsApi = {
  list: (params) => api.get("/leads", { params }),
  get: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post("/leads", data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  remove: (id) => api.delete(`/leads/${id}`),
  score: (id) => api.post(`/ai/leads/${id}/score`),
};

// ---- Deals ----
export const dealsApi = {
  list: (params) => api.get("/deals", { params }),
  get: (id) => api.get(`/deals/${id}`),
  create: (data) => api.post("/deals", data),
  update: (id, data) => api.put(`/deals/${id}`, data),
  remove: (id) => api.delete(`/deals/${id}`),
};

// ---- Tasks ----
export const tasksApi = {
  list: (params) => api.get("/tasks", { params }),
  get: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  remove: (id) => api.delete(`/tasks/${id}`),
};

// ---- AI ----
export const aiApi = {
  chat: (data) => api.post("/ai/chat", data),
  emailDraft: (data) => api.post("/ai/email-draft", data),
  summarize: (data) => api.post("/ai/summarize", data),
};
