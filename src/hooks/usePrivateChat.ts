import { useEffect, useState, useCallback } from "react";
import { socketService } from "../services/socket.service";
import { chatService } from "../services/chat.service";
import type { Message, PrivateMessageReceived } from "../types";

export function usePrivateChat(
  currentUserId: string | null | undefined,
  recipientUserId: string | null | undefined
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load chat history from backend
  useEffect(() => {
    if (!currentUserId || !recipientUserId) {
      setLoading(false);
      return;
    }

    const loadHistory = async () => {
      try {
        setLoading(true);
        const history = await chatService.getChatHistory(
          Number(recipientUserId)
        );

        console.log("✅ Chat history loaded:", history.data.length, "messages");

        // Backend returns: senderId, createdAt, isFromMe (camelCase)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const loadedMessages: Message[] = history.data.map((msg: any) => ({
          id: msg.id?.toString() || `msg-${Date.now()}`,
          sender: msg.senderId?.toString() || "",
          content: msg.content || "",
          timestamp: msg.createdAt ? new Date(msg.createdAt) : new Date(),
          isCurrentUser: msg.isFromMe || false,
        }));

        setMessages(loadedMessages);
        setError(null);

        await chatService.markAsRead(Number(recipientUserId));
      } catch (err) {
        console.error("❌ Error loading chat:", err);
        setError("Failed to load chat history");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [currentUserId, recipientUserId]);

  // Send message
  const sendMessage = useCallback(
    (content: string) => {
      if (!currentUserId || !recipientUserId) return;

      socketService.sendPrivateMessage(recipientUserId, content);

      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        sender: currentUserId,
        content,
        timestamp: new Date(),
        isCurrentUser: true,
      };

      setMessages((prev) => [...prev, newMessage]);
    },
    [currentUserId, recipientUserId]
  );

  // Listen for incoming messages
  useEffect(() => {
    if (!currentUserId || !recipientUserId) return;

    const cleanup = socketService.onPrivateMessage(
      (data: PrivateMessageReceived) => {
        if (data.from === recipientUserId) {
          const newMessage: Message = {
            id: data.id?.toString() || `${Date.now()}`,
            sender: data.from,
            content: data.message,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            isCurrentUser: false,
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      }
    );

    return cleanup;
  }, [currentUserId, recipientUserId]);

  return { messages, sendMessage, loading, error };
}
