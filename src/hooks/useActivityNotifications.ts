import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../services/notification.service";
import type { NotificationEntity } from "../services/notification.service";
import { socketService } from "../services/socket.service";

/**
 * useActivityNotifications - Hook for managing like/comment notifications
 * Provides:
 * - Unread count for badge
 * - Notification list
 * - Real-time updates via Socket.IO
 * - Mark as read functionality
 */
export function useActivityNotifications() {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Real-time socket listener for new notifications
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    // Listen for new notifications from backend
    const handleNewNotification = (payload: {
      type: string;
      data: NotificationEntity;
    }) => {
      console.log("📬 Received notification:", payload);

      if (payload.type === "new_notification" && payload.data) {
        // Add to beginning of list
        setNotifications((prev) => [payload.data, ...prev]);
        // Increment unread count
        setUnreadCount((prev) => prev + 1);

        // Show toast notification
        const senderName =
          `${payload.data.sender?.first_Name || ""} ${
            payload.data.sender?.last_Name || ""
          }`.trim() || "Ai đó";
        const actionText =
          payload.data.type === "like" ? "đã thích" : "đã bình luận";

        // Import toast dynamically to avoid circular deps
        import("react-toastify").then(({ toast }) => {
          toast.info(`❤️ ${senderName} ${actionText} bài viết của bạn`, {
            position: "top-right",
            autoClose: 4000,
          });
        });
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
}
