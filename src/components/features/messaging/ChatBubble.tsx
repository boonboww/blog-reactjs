import type { Message } from "../../../types";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

interface ChatBubbleProps {
  message: Message;
  isOwn?: boolean;
  showAvatar?: boolean;
  recipientAvatar?: string;
}

export function ChatBubble({
  message,
  isOwn,
  showAvatar,
  recipientAvatar,
}: ChatBubbleProps) {
  // Use props or fallback to message properties
  const isCurrentUser = isOwn ?? message.isCurrentUser;

  return (
    <div
      className={`flex w-full mb-1 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[70%] ${
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar for recipient */}
        {!isCurrentUser && (
          <div className="shrink-0 w-7 h-7 mr-2 flex flex-col justify-end">
            {showAvatar ? (
              <ImageWithFallback
                src={recipientAvatar || ""}
                alt={message.sender}
                className="w-7 h-7 rounded-full object-cover border border-gray-100"
              />
            ) : (
              <div className="w-7"></div>
            )}
          </div>
        )}

        <div className="flex flex-col">
          <div
            className={`px-4 py-2 text-[15px] leading-snug wrap-break-word ${
              isCurrentUser
                ? "bg-[#3797f0] text-white rounded-[22px]"
                : "bg-[#efefef] text-black rounded-[22px]"
            }`}
          >
            {message.content}
          </div>
        </div>

        {/* Timestamp tooltip or side display (optional, can be hidden) */}
      </div>
    </div>
  );
}
