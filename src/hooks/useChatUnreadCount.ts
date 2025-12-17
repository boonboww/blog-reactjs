import { useState, useEffect, useCallback } from "react";
import { chatService } from "../services/chat.service";
import { socketService } from "../services/socket.service";
import type { PrivateMessageReceived } from "../types";

interface ConversationData {
  userId: number;
  userName: string;
  userAvatar: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

/**
 * Hook to manage chat unread count for sidebar badge
 * Fetches from conversations API and listens for real-time updates
 */
export function useChatUnreadCount() {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("user_id") || "";

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      // Sum up all unread counts
      const total = data.reduce(
        (sum, conv) => sum + (conv.unreadCount || 0),
        0
      );
      setTotalUnreadCount(total);
    } catch (error) {
      console.error("Failed to fetch chat conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Listen for new messages to update unread count
  useEffect(() => {
    if (!currentUserId) return;

    const cleanup = socketService.onPrivateMessage(
      (data: PrivateMessageReceived) => {
        // New message from someone else - increment unread
        if (data.from !== currentUserId) {
          setTotalUnreadCount((prev) => prev + 1);
          // Update conversations list
          setConversations((prev) => {
            const existingIdx = prev.findIndex(
              (c) => c.userId.toString() === data.from
            );
            if (existingIdx >= 0) {
              const updated = [...prev];
              updated[existingIdx] = {
                ...updated[existingIdx],
                lastMessage: data.message,
                lastMessageTime: new Date(),
                unreadCount: (updated[existingIdx].unreadCount || 0) + 1,
              };
              return updated;
            }
            return prev;
          });
        }
      }
    );

    return cleanup;
  }, [currentUserId]);

  // Mark conversation as read (decrease unread count)
  const markAsRead = useCallback((userId: number, count: number) => {
    setTotalUnreadCount((prev) => Math.max(0, prev - count));
    setConversations((prev) =>
      prev.map((c) => (c.userId === userId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  return {
    totalUnreadCount,
    conversations,
    loading,
    refresh: fetchConversations,
    markAsRead,
  };
}
