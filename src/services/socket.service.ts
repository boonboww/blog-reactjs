import { io, Socket } from "socket.io-client";
import type {
  PrivateMessageReceived,
  GroupMessagePayload,
  GroupMessageReceived,
  RoomInfo,
  UserEvent,
  FriendRequestReceivedEvent,
  FriendRequestAcceptedEvent,
  FriendRequestRejectedEvent,
  UnfriendedEvent,
  BlockedEvent,
} from "../types";

/**
 * SocketService - Singleton service for managing Socket.IO connection
 * Handles real-time messaging: private chat, group chat, and broadcasts
 */
class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private readonly SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL || "http://localhost:3002";

  /**
   * Initialize socket connection with user ID
   * @param userId - Unique identifier for the current user
   */
  connect(userId: string): void {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    this.userId = userId;

    this.socket = io(this.SOCKET_URL, {
      query: { userId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  /**
   * Setup basic connection event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log(`✅ Socket connected: ${this.socket?.id}`);
    });

    this.socket.on("disconnect", (reason) => {
      console.log(`❌ Socket disconnected: ${reason}`);
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
    });
  }

  /**
   * Disconnect the socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
      console.log("Socket disconnected manually");
    }
  }

  /**
   * Get socket instance (for custom event listeners)
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return this.userId;
  }

  // =========================
  //    PRIVATE CHAT (1-1)
  // =========================

  /**
   * Send a private message to another user
   * @param toUserId - Recipient user ID
   * @param message - Message content
   * @param imageUrl - Optional image URL
   */
  sendPrivateMessage(
    toUserId: string,
    message: string,
    imageUrl?: string
  ): void {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }

    const fromUserId = localStorage.getItem("user_id") || "";
    if (!fromUserId) {
      console.error("Cannot send message: user_id not found");
      return;
    }

    const payload: {
      fromUserId: string;
      toUserId: string;
      message: string;
      imageUrl?: string;
    } = {
      fromUserId,
      toUserId,
      message,
    };

    if (imageUrl) {
      payload.imageUrl = imageUrl;
    }

    this.socket.emit("privateMessage", payload);
    console.log(
      `📤 Private message sent from ${fromUserId} to ${toUserId}:`,
      message,
      imageUrl ? `with image: ${imageUrl}` : ""
    );
  }

  /**
   * Listen for incoming private messages
   * @param callback - Handler for received messages
   */
  onPrivateMessage(
    callback: (data: PrivateMessageReceived) => void
  ): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("privateMessage", callback);

    // Return cleanup function
    return () => {
      this.socket?.off("privateMessage", callback);
    };
  }

  // =========================
  //      GROUP CHAT
  // =========================

  /**
   * Join a chat room
   * @param room - Room ID to join
   */
  joinRoom(room: string): void {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }

    this.socket.emit("joinRoom", room);
    console.log(`🚪 Joined room: ${room}`);
  }

  /**
   * Leave a chat room
   * @param room - Room ID to leave
   */
  leaveRoom(room: string): void {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }

    this.socket.emit("leaveRoom", room);
    console.log(`🚪 Left room: ${room}`);
  }

  /**
   * Send a message to a group/room
   * @param room - Room ID
   * @param message - Message content
   */
  sendGroupMessage(room: string, message: string): void {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }

    const payload: GroupMessagePayload = { room, message };
    this.socket.emit("groupMessage", payload);
    console.log(`📤 Group message sent to ${room}:`, message);
  }

  /**
   * Listen for incoming group messages
   * @param callback - Handler for received messages
   */
  onGroupMessage(callback: (data: GroupMessageReceived) => void): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("groupMessage", callback);

    return () => {
      this.socket?.off("groupMessage", callback);
    };
  }

  /**
   * Listen for room information events (user joined/left room)
   * @param callback - Handler for room events
   */
  onRoomInfo(callback: (data: RoomInfo) => void): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("roomInfo", callback);

    return () => {
      this.socket?.off("roomInfo", callback);
    };
  }

  // =========================
  //   USER EVENTS (GLOBAL)
  // =========================

  /**
   * Listen for user joined events
   * @param callback - Handler for user joined events
   */
  onUserJoined(callback: (data: UserEvent) => void): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("user-joined", callback);

    return () => {
      this.socket?.off("user-joined", callback);
    };
  }

  /**
   * Listen for user left events
   * @param callback - Handler for user left events
   */
  onUserLeft(callback: (data: UserEvent) => void): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("user-left", callback);

    return () => {
      this.socket?.off("user-left", callback);
    };
  }

  // =========================
  //    BROADCAST EVENTS
  // =========================

  /**
   * Send a broadcast message to all connected clients
   * @param message - Message to broadcast
   */
  broadcastMessage(message: unknown): void {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }

    this.socket.emit("newMessage", message);
    console.log("📢 Broadcast message sent:", message);
  }

  /**
   * Listen for broadcast messages
   * @param callback - Handler for broadcast messages
   */
  onBroadcastMessage(callback: (message: unknown) => void): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("newMessage", callback);

    return () => {
      this.socket?.off("newMessage", callback);
    };
  }

  // =========================
  //   FRIEND NOTIFICATIONS
  // =========================

  /**
   * Listen for incoming friend requests
   * @param callback - Handler for friend request received events
   */
  onFriendRequestReceived(
    callback: (data: FriendRequestReceivedEvent) => void
  ): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("friendRequestReceived", callback);

    return () => {
      this.socket?.off("friendRequestReceived", callback);
    };
  }

  /**
   * Listen for friend request accepted events
   * @param callback - Handler for request accepted events
   */
  onFriendRequestAccepted(
    callback: (data: FriendRequestAcceptedEvent) => void
  ): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("friendRequestAccepted", callback);

    return () => {
      this.socket?.off("friendRequestAccepted", callback);
    };
  }

  /**
   * Listen for friend request rejected events
   * @param callback - Handler for request rejected events
   */
  onFriendRequestRejected(
    callback: (data: FriendRequestRejectedEvent) => void
  ): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("friendRequestRejected", callback);

    return () => {
      this.socket?.off("friendRequestRejected", callback);
    };
  }

  /**
   * Listen for unfriend events
   * @param callback - Handler for unfriend events
   */
  onUnfriended(callback: (data: UnfriendedEvent) => void): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("unfriended", callback);

    return () => {
      this.socket?.off("unfriended", callback);
    };
  }

  /**
   * Listen for user blocked events
   * @param callback - Handler for blocked events
   */
  onBlocked(callback: (data: BlockedEvent) => void): () => void {
    if (!this.socket) {
      console.error("Socket not connected");
      return () => {};
    }

    this.socket.on("blocked", callback);

    return () => {
      this.socket?.off("blocked", callback);
    };
  }
}

// Export singleton instance
export const socketService = new SocketService();
