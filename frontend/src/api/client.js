const BASE = import.meta.env.VITE_API_URL ?? "/api";
const TOKEN_KEY = "kutubxona_token";

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details ?? [];
  }
  /** Validatsiya xatolarini {maydon: xabar} ko'rinishida qaytaradi */
  get fieldErrors() {
    return Object.fromEntries(this.details.map((d) => [d.path, d.message]));
  }
}

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const listeners = { unauthorized: [] };
export const onUnauthorized = (fn) => listeners.unauthorized.push(fn);

const toQuery = (params = {}) => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  return entries.length ? `?${new URLSearchParams(entries)}` : "";
};

export const request = async (method, path, { body, params, form } = {}) => {
  const headers = {};
  const token = tokenStorage.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !form) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(`${BASE}${path}${toQuery(params)}`, {
      method,
      headers,
      body: form ?? (body ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError(0, "Server bilan aloqa yo'q. Internetni tekshiring");
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) listeners.unauthorized.forEach((fn) => fn());
    throw new ApiError(res.status, data.message ?? "Xatolik yuz berdi", data.details);
  }
  return data;
};

export const api = {
  get: (path, params) => request("GET", path, { params }),
  post: (path, body) => request("POST", path, { body }),
  patch: (path, body) => request("PATCH", path, { body }),
  delete: (path) => request("DELETE", path),
  upload: (path, form) => request("POST", path, { form }),
};
