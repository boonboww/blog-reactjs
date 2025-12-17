import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { notificationService } from "../services/notification.service";
import type { NotificationEntity } from "../services/notification.service";
import { socketService } from "../services/socket.service";
import { toast } from "react-toastify";
import { faviconService } from "../services/favicon.service";

interface NotificationContextValue {
  notifications: NotificationEntity[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (page?: number, itemsPerPage?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update favicon badge when unreadCount changes
  useEffect(() => {
    faviconService.setBadge(unreadCount);
  }, [unreadCount]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await notificationService.getUnreadCount();
      setUnreadCount(result.unreadCount);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (page = 1, itemsPerPage = 20) => {
      try {
        setLoading(true);
        setError(null);
        const result = await notificationService.getNotifications({
          page,
          items_per_page: itemsPerPage,
        });
        setNotifications(result.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Không thể tải thông báo");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();
  }, [fetchUnreadCount, fetchNotifications]);

  // Real-time socket listener
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    const handleNewNotification = (payload: {
      type: string;
      data: NotificationEntity;
    }) => {
      console.log("📬 Received notification:", payload);

      if (payload.type === "new_notification" && payload.data) {
        setNotifications((prev) => [payload.data, ...prev]);
        setUnreadCount((prev) => prev + 1);

        const senderName =
          `${payload.data.sender?.first_Name || ""} ${
            payload.data.sender?.last_Name || ""
          }`.trim() || "Ai đó";
        const actionText =
          payload.data.type === "like" ? "đã thích" : "đã bình luận";

        toast.info(`❤️ ${senderName} ${actionText} bài viết của bạn`, {
          position: "top-right",
          autoClose: 4000,
        });
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, []);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  }
  return context;
}
