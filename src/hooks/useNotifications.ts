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

    // Listen for private messages - no toast, only sidebar badge
    // (Badge is handled separately in chat component)
    const cleanupPrivateMsg = socketService.onPrivateMessage(
      (_data: PrivateMessageReceived) => {
        // No toast for chat messages - badge notification is enough
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
