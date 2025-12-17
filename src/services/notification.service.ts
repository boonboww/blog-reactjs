import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Notification types matching backend enum
export type NotificationType = "like" | "comment";

// Notification entity from backend
export interface NotificationEntity {
  id: number;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  sender: {
    id: number;
    first_Name: string;
    last_Name: string;
    avatar?: string;
  };
  post: {
    id: number;
    title: string;
  };
}

// Paginated response
export interface GetNotificationsResponse {
  data: NotificationEntity[];
  total: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

// Query params
export interface GetNotificationsDto {
  page?: number;
  items_per_page?: number;
}

// Unread count response
export interface UnreadCountResponse {
  unreadCount: number;
}

/**
 * Get auth headers for API requests
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * NotificationService - API client for notification endpoints
 */
class NotificationService {
  /**
   * Get paginated notifications for current user
   */
  async getNotifications(
    query: GetNotificationsDto = {}
  ): Promise<GetNotificationsResponse> {
    const params = new URLSearchParams();
    if (query.page) params.append("page", query.page.toString());
    if (query.items_per_page)
      params.append("items_per_page", query.items_per_page.toString());

    const response = await axios.get<GetNotificationsResponse>(
      `${API_URL}/notifications?${params.toString()}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await axios.get<UnreadCountResponse>(
      `${API_URL}/notifications/unread-count`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: number): Promise<{ message: string }> {
    const response = await axios.patch<{ message: string }>(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ message: string }> {
    const response = await axios.patch<{ message: string }>(
      `${API_URL}/notifications/read-all`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
}

export const notificationService = new NotificationService();
