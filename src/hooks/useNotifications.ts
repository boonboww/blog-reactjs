import { useEffect } from "react";
import { toast } from "react-toastify";
import { socketService } from "../services/socket.service";
import type {
  PrivateMessageReceived,
  FriendRequestReceivedEvent,
  FriendRequestAcceptedEvent,
} from "../types";

/**
 * useNotifications - Global hook for real-time notifications
 * Should be used once at the app level (e.g., in Home component)
 * Provides toast notifications for:
 * - New private messages (when not in that chat)
 * - Friend request received
 * - Friend request accepted
 */
export function useNotifications(currentUserId: string | null | undefined) {
  useEffect(() => {
    if (!currentUserId) return;

    // Check if socket is connected, if not wait for it
    const socket = socketService.getSocket();
    if (!socket) {
      console.log("⏳ Socket not connected yet for notifications");
      return;
    }

    console.log("🔔 Setting up global notification listeners");

    // Listen for private messages (show notification if not in that chat)
    const cleanupPrivateMsg = socketService.onPrivateMessage(
      (data: PrivateMessageReceived) => {
        // Only show notification if the message is from someone else
        if (data.from !== currentUserId) {
          // Check if user is currently viewing this chat
          // We can check URL or use a global state, for now just show notification
          const currentPath = window.location.pathname;
          const isInMessagesPage = currentPath.includes("/messages");

          // Show toast for new message
          if (!isInMessagesPage) {
            toast.info(`💬 Tin nhắn mới từ User #${data.from}`, {
              position: "top-right",
              autoClose: 4000,
              onClick: () => {
                // Navigate to messages when clicked
                window.location.href = "/";
              },
            });
          }
        }
      }
    );

    // Listen for friend requests
    const cleanupFriendRequest = socketService.onFriendRequestReceived(
      (data: FriendRequestReceivedEvent) => {
        const requesterName =
          `${data.from.first_Name || ""} ${data.from.last_Name || ""}`.trim() ||
          "Ai đó";
        toast.info(`🔔 ${requesterName} đã gửi lời mời kết bạn!`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    );

    // Listen for friend request accepted
    const cleanupFriendAccepted = socketService.onFriendRequestAccepted(
      (data: FriendRequestAcceptedEvent) => {
        const friendName =
          `${data.friend.first_Name || ""} ${
            data.friend.last_Name || ""
          }`.trim() || "Ai đó";
        toast.success(`🎉 ${friendName} đã chấp nhận lời mời kết bạn!`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    );

    return () => {
      cleanupPrivateMsg();
      cleanupFriendRequest();
      cleanupFriendAccepted();
    };
  }, [currentUserId]);
}
