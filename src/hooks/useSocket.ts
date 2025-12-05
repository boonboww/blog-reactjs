import { useEffect, useState } from "react";
import { socketService } from "../services/socket.service";
import type { SocketStatus } from "../types";

/**
 * useSocket - React hook for managing Socket.IO connection lifecycle
 * @param userId - User ID to connect with (optional, can be null/undefined)
 * @returns Socket connection status and service instance
 */
export function useSocket(userId?: string | null) {
  const [status, setStatus] = useState<SocketStatus>("disconnected");

  useEffect(() => {
    // Don't connect if no userId
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("disconnected");
      return;
    }

    // Connect to socket
    setStatus("connecting");
    socketService.connect(userId);

    const socket = socketService.getSocket();
    if (!socket) {
      setStatus("error");
      return;
    }

    // Listen to connection events
    const handleConnect = () => setStatus("connected");
    const handleDisconnect = () => setStatus("disconnected");
    const handleError = () => setStatus("error");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    // Check if already connected
    if (socket.connected) {
      setStatus("connected");
    }

    // Cleanup on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socketService.disconnect();
    };
  }, [userId]);

  return {
    status,
    isConnected: status === "connected",
    service: socketService,
  };
}
