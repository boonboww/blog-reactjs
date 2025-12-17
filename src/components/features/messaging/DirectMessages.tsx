import { useState, useEffect } from "react";
import type { Conversation, UserEntity } from "../../../types";
import { Send } from "lucide-react";
import { ImageWithFallback } from "../../shared/ImageWithFallback";
import { useFriends } from "../../../hooks/useFriends";
import { MessagingPanel } from "./MessagingPanel";
import requestApi from "../../../helpers/api";
import { chatService } from "../../../services/chat.service";

interface ConversationFromAPI {
  userId: number;
  userName: string;
  userAvatar: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export function DirectMessages() {
  // Load real friends
  const { friends, loading: loadingFriends } = useFriends();
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [conversationsFromAPI, setConversationsFromAPI] = useState<
    ConversationFromAPI[]
  >([]);

  // Fetch conversations with last messages from API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversationsFromAPI(data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  // Convert friends to conversations format, use lastMessage from API if available
  const conversations: Conversation[] = friends.map((friend) => {
    const apiConversation = conversationsFromAPI.find(
      (c) => c.userId === friend.id
    );
    return {
      id: friend.id.toString(),
      username: `${friend.first_Name} ${friend.last_Name}`,
      userAvatar: friend.avatar || "",
      lastMessage: apiConversation?.lastMessage || "Bắt đầu cuộc trò chuyện",
      timestamp: apiConversation?.lastMessageTime
        ? new Date(apiConversation.lastMessageTime)
        : new Date(friend.friendsSince),
      unread: (apiConversation?.unreadCount || 0) > 0,
    };
  });

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const currentUserId = localStorage.getItem("user_id") || "";

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!currentUserId) return;
      try {
        const response = await requestApi(`/users/${currentUserId}`, "GET", []);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };

    fetchCurrentUser();
  }, [currentUserId]);

  const currentUserName = currentUser
    ? `${currentUser.first_Name} ${currentUser.last_Name}`
    : "Người dùng";

  return (
    <div className="flex h-full bg-white">
      {/* Conversations List - Hidden on mobile if chat is open */}
      <div
        className={`w-full lg:w-[350px] border-r border-gray-200 flex flex-col bg-white ${
          selectedConversation ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="h-16 px-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {currentUserName} <span className="text-xs">▼</span>
          </h2>
          <Send className="w-6 h-6 stroke-[1.5]" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingFriends ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="font-semibold">Chưa có tin nhắn</p>
              <p className="text-sm mt-1">Gửi tin nhắn cho bạn bè ngay!</p>
            </div>
          ) : (
            <div className="py-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-gray-50"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={conversation.userAvatar}
                      alt={conversation.username}
                      className="w-14 h-14 rounded-full object-cover border border-gray-100"
                    />
                    {/* Online indicator mock */}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-sm text-gray-900">
                      {conversation.username}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span
                        className={`truncate max-w-[140px] ${
                          conversation.unread
                            ? "font-bold text-gray-900"
                            : "font-normal"
                        }`}
                      >
                        {conversation.lastMessage}
                      </span>
                      <span>·</span>
                      <span className="text-xs">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                  </div>

                  {conversation.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col w-full h-full relative z-10 bg-white overflow-hidden">
          <MessagingPanel
            currentUserId={currentUserId}
            recipientUserId={selectedConversation.id}
            recipientName={selectedConversation.username}
            recipientAvatar={selectedConversation.userAvatar}
            onBack={() => setSelectedConversation(null)}
          />
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-white">
          <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-4">
            <Send className="w-10 h-10 text-black ml-1 mt-1" />
          </div>
          <h3 className="text-xl font-medium mb-2">Tin nhắn của bạn</h3>
          <p className="text-gray-500 text-sm mb-6">
            Gửi ảnh và tin nhắn riêng tư cho bạn bè
          </p>
          <button className="px-5 py-2 bg-[#0095f6] text-white rounded-lg font-semibold text-sm hover:bg-[#1877f2] transition-colors">
            Gửi tin nhắn
          </button>
        </div>
      )}
    </div>
  );
}
