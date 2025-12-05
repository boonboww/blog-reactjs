import { useEffect, useState, useCallback } from "react";
import { socketService } from "../services/socket.service";
import type { Message, GroupMessageReceived, RoomInfo } from "../types";

interface GroupMessages {
  [roomId: string]: Message[];
}

/**
 * useGroupChat - React hook for group chat functionality
 * @param currentUserId - Current logged-in user ID
 * @returns Rooms state, messages, and room management functions
 */
export function useGroupChat(currentUserId: string | null | undefined) {
  const [joinedRooms, setJoinedRooms] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<GroupMessages>({});
  const [roomInfo, setRoomInfo] = useState<string[]>([]);

  // Join a room
  const joinRoom = useCallback((roomId: string) => {
    socketService.joinRoom(roomId);
    setJoinedRooms((prev) => new Set(prev).add(roomId));

    // Initialize messages array for this room if not exists
    setMessages((prev) => ({
      ...prev,
      [roomId]: prev[roomId] || [],
    }));
  }, []);

  // Leave a room
  const leaveRoom = useCallback((roomId: string) => {
    socketService.leaveRoom(roomId);
    setJoinedRooms((prev) => {
      const updated = new Set(prev);
      updated.delete(roomId);
      return updated;
    });
  }, []);

  // Send message to a room
  const sendMessage = useCallback(
    (roomId: string, content: string) => {
      if (!currentUserId) {
        console.error("Missing userId");
        return;
      }

      socketService.sendGroupMessage(roomId, content);

      // Add own message to UI immediately
      const newMessage: Message = {
        id: `${Date.now()}-${Math.random()}`,
        sender: currentUserId,
        content,
        timestamp: new Date(),
        isCurrentUser: true,
      };

      setMessages((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), newMessage],
      }));
    },
    [currentUserId]
  );

  // Listen for group messages
  useEffect(() => {
    if (!currentUserId) return;

    // Listen for group messages
    const cleanupGroupMsg = socketService.onGroupMessage(
      (data: GroupMessageReceived) => {
        const roomId = data.room || "default";

        // Only add if from someone else
        if (data.from !== socketService.getSocket()?.id) {
          const newMessage: Message = {
            id: `${Date.now()}-${Math.random()}`,
            sender: data.from,
            content: data.message,
            timestamp: new Date(),
            isCurrentUser: false,
          };

          setMessages((prev) => ({
            ...prev,
            [roomId]: [...(prev[roomId] || []), newMessage],
          }));
        }
      }
    );

    // Listen for room info events
    const cleanupRoomInfo = socketService.onRoomInfo((data: RoomInfo) => {
      setRoomInfo((prev) => [...prev, data.message]);
      console.log("🔔 Room info:", data.message);
    });

    return () => {
      cleanupGroupMsg();
      cleanupRoomInfo();
    };
  }, [currentUserId]);

  return {
    joinedRooms: Array.from(joinedRooms),
    messages,
    roomInfo,
    joinRoom,
    leaveRoom,
    sendMessage,
  };
}
