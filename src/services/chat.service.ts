import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ChatMessage {
  id: number;
  senderId: number; // Backend uses camelCase
  senderName: string;
  senderAvatar: string | null;
  content: string;
  isRead: boolean;
  isFromMe: boolean;
  createdAt: Date; // Backend uses camelCase
}

interface ChatHistoryResponse {
  data: ChatMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Conversation {
  userId: number;
  userName: string;
  userAvatar: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

/**
 * ChatService - Service for chat-related API calls
 * Handles message history, conversations, and read status
 */
class ChatService {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Get chat history with a specific user
   * @param userId - The ID of the user to get chat history with
   * @param page - Page number for pagination
   * @param limit - Number of messages per page
   */
  async getChatHistory(
    userId: number,
    page: number = 1,
    limit: number = 50
  ): Promise<ChatHistoryResponse> {
    const response = await axios.get<ChatHistoryResponse>(
      `${API_URL}/chat/history/${userId}`,
      {
        params: { page, limit },
        ...this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Get list of conversations (recent chats)
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await axios.get<Conversation[]>(
      `${API_URL}/chat/conversations`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Mark messages from a user as read
   * @param userId - The ID of the user whose messages to mark as read
   */
  async markAsRead(userId: number): Promise<void> {
    await axios.patch(
      `${API_URL}/chat/read/${userId}`,
      {},
      this.getAuthHeaders()
    );
  }
}

// Export singleton instance
export const chatService = new ChatService();
