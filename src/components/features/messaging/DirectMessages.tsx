import { useState } from "react";
import type { Conversation, ChatMessage } from "../../../types";
import { Send, Phone, Video, Info } from "lucide-react";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

interface DirectMessagesProps {
  conversations: Conversation[];
}

export function DirectMessages({ conversations }: DirectMessagesProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(conversations[0] || null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "nguyen_vana",
      text: "Chào bạn! Bức ảnh của bạn đẹp quá!",
      timestamp: new Date("2024-12-03T11:00:00"),
    },
    {
      id: "2",
      senderId: "me",
      text: "Cảm ơn bạn nhiều nhé! 😊",
      timestamp: new Date("2024-12-03T11:15:00"),
    },
    {
      id: "3",
      senderId: "nguyen_vana",
      text: "Bạn chụp ở đâu vậy?",
      timestamp: new Date("2024-12-03T11:20:00"),
    },
    {
      id: "4",
      senderId: "me",
      text: "Mình chụp ở Đà Lạt đấy",
      timestamp: new Date("2024-12-03T11:25:00"),
    },
    {
      id: "5",
      senderId: "nguyen_vana",
      text: "Cảm ơn bạn nhé!",
      timestamp: new Date("2024-12-03T11:30:00"),
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: "me",
      text: messageText,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="h-screen flex lg:ml-0">
      {/* Conversations List */}
      <div className="w-full lg:w-96 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl">Tin nhắn</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id ? "bg-gray-50" : ""
              }`}
            >
              <div className="relative">
                <ImageWithFallback
                  src={conversation.userAvatar}
                  alt={conversation.username}
                  className="w-14 h-14 rounded-full object-cover"
                />
                {conversation.unread && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                    1
                  </div>
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="font-semibold text-sm">
                  {conversation.username}
                </div>
                <div
                  className={`text-sm truncate ${
                    conversation.unread
                      ? "text-black font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {conversation.lastMessage}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                {formatTime(conversation.timestamp)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="hidden lg:flex flex-1 flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={selectedConversation.userAvatar}
                alt={selectedConversation.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">
                {selectedConversation.username}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[60%] px-4 py-2 rounded-3xl ${
                    message.senderId === "me"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Nhắn tin..."
                className="flex-1 px-4 py-2 border rounded-full outline-none focus:border-gray-400"
              />
              {messageText.trim() && (
                <button
                  type="submit"
                  className="text-blue-500 font-semibold hover:text-blue-700"
                >
                  Gửi
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-white">
          <div className="text-center">
            <Send className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">Tin nhắn của bạn</h3>
            <p className="text-gray-500">
              Gửi ảnh và tin nhắn riêng tư cho bạn bè
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
