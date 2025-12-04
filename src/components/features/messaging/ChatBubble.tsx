import type { Message } from "../types";

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={`flex ${
        message.isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] ${
          message.isCurrentUser ? "order-2" : "order-1"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {!message.isCurrentUser && (
            <span className="text-sm text-gray-600">{message.sender}</span>
          )}
          {message.isCurrentUser && (
            <span className="text-sm text-gray-600 ml-auto">
              {message.sender}
            </span>
          )}
        </div>

        <div
          className={`rounded-2xl px-4 py-3 ${
            message.isCurrentUser
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-gray-100 text-gray-900 rounded-tl-sm"
          }`}
        >
          <p>{message.content}</p>
        </div>

        <div
          className={`text-xs text-gray-500 mt-1 ${
            message.isCurrentUser ? "text-right" : "text-left"
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
