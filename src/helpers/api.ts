import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";

// Base URL từ .env
const BASE_URL = import.meta.env.VITE_API_URL;

// Tạo một instance chung
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// RESPONSE INTERCEPTOR (REFRESH TOKEN)
// =====================================================
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // Access token hết hạn (419)
    if (error.response?.status === 419 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        // 🟢 Dùng axios gốc, KHÔNG dùng instance (tránh interceptor conflict)
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refresh_token: localStorage.getItem("refresh_token"),
        });

        const { access_token, refresh_token } = res.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // Cập nhật token mới cho request cũ
        originalConfig.headers["Authorization"] = `Bearer ${access_token}`;

        return instance(originalConfig);
      } catch (err) {
        // Refresh hết hạn → logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// =====================================================
// REQUEST FUNCTION
// =====================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function requestApi<T = any>(
  endpoint: string,
  method: Method,
  body?: unknown,
  responseType: AxiosRequestConfig["responseType"] = "json"
): Promise<AxiosResponse<T>> {
  return instance.request<T>({
    method,
    url: endpoint,
    data: body,
    responseType,
  });
}
