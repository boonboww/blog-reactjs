import { useRef, useEffect, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { usePrivateChat } from "../../../hooks/usePrivateChat";
import { useFriendshipStatus } from "../../../hooks/useFriendshipStatus";
import { ChatBubble } from "./ChatBubble";
import { EmojiButton } from "./EmojiPicker";
import {
  Phone,
  Video,
  Info,
  ChevronLeft,
  Image as ImageIcon,
  Heart,
  UserPlus,
} from "lucide-react";
import { friendService } from "../../../services/friend.service";
import { ImageWithFallback } from "../../shared/ImageWithFallback";
import { toast } from "react-toastify";

interface MessagingPanelProps {
  currentUserId: string;
  recipientUserId: string;
  recipientName?: string;
  recipientAvatar?: string;
  onBack?: () => void;
}

export function MessagingPanel({
  currentUserId,
  recipientUserId,
  recipientName,
  recipientAvatar,
  onBack,
}: MessagingPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Connect to socket
  const { isConnected } = useSocket(currentUserId);

  // Check friendship status
  const {
    isFriend,
    isPending,
    loading: friendLoading,
  } = useFriendshipStatus(Number(recipientUserId));

  // Private chat hook
  const { messages, sendMessage } = usePrivateChat(
    currentUserId,
    recipientUserId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasText = messageText.trim().length > 0;
    const hasImages = selectedImages.length > 0;

    if (!hasText && !hasImages) return;

    try {
      // Upload images first if any
      let imageUrl: string | undefined;
      if (hasImages) {
        // Upload first image (can extend to multiple later)
        const { chatService } = await import("../../../services/chat.service");
        imageUrl = await chatService.uploadChatImage(selectedImages[0]);
      }

      // Send message with text and/or image
      sendMessage(messageText.trim(), imageUrl);

      // Clear inputs
      setMessageText("");
      setSelectedImages([]);
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.", {
        position: "top-center",
      });
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  // Handle image selection - support multiple images
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB`, {
            position: "top-center",
          });
          continue;
        }
        newImages.push(file);
      }
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
    // Reset input để có thể chọn lại cùng file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove selected image
  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle sending heart
  const handleSendHeart = () => {
    sendMessage("❤️");
  };

  const handleSendFriendRequest = async () => {
    setSendingRequest(true);
    try {
      await friendService.sendFriendRequest(Number(recipientUserId));
      alert("Đã gửi lời mời kết bạn!");
    } catch {
      alert("Không thể gửi lời mời kết bạn");
    } finally {
      setSendingRequest(false);
    }
  };

  // Show loading state
  if (friendLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show "not friends" message if not friends
  if (!isFriend) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-xs">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <ImageWithFallback
              src={recipientAvatar || ""}
              alt={recipientName || ""}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {recipientName || "Người dùng Instaz"}
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            {isPending
              ? "Lời mời kết bạn đang chờ xét duyệt"
              : "Bạn cần là bạn bè để nhắn tin cho nhau."}
          </p>
          {!isPending && (
            <button
              onClick={handleSendFriendRequest}
              disabled={sendingRequest}
              className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-[#0095f6] text-white rounded-lg font-semibold text-sm hover:bg-[#1877f2] transition-colors disabled:opacity-70"
            >
              {sendingRequest ? (
                "Đang gửi..."
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Gửi lời mời kết bạn
                </>
              )}
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 text-sm font-semibold text-[#0095f6]"
            >
              Quay lại
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="lg:hidden -ml-2 p-2">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="relative">
              <ImageWithFallback
                src={recipientAvatar || ""}
                alt={recipientName || ""}
                className="w-8 h-8 rounded-full object-cover border border-gray-100"
              />
              {isConnected && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">
                {recipientName || recipientUserId}
              </h3>
              <p className="text-xs text-gray-500">
                {isConnected ? "Đang hoạt động" : "Offline 5 phút trước"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-900">
          <Phone className="w-6 h-6 stroke-[1.5] cursor-pointer" />
          <Video className="w-6 h-6 stroke-[1.5] cursor-pointer" />
          <Info className="w-6 h-6 stroke-[1.5] cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
              <ImageWithFallback
                src={recipientAvatar || ""}
                alt={recipientName || ""}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">
              {recipientName || recipientUserId}
            </h3>
            <p className="text-gray-500 text-sm mb-4">Instagram</p>
            <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50">
              Xem trang cá nhân
            </button>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              // Check if next message is from same user to group them
              const nextMessage = messages[index + 1];
              const isLastInGroup =
                !nextMessage ||
                nextMessage.isCurrentUser !== message.isCurrentUser;

              return (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isOwn={message.isCurrentUser}
                  showAvatar={!message.isCurrentUser && isLastInGroup}
                  recipientAvatar={recipientAvatar}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Image Preview - Multiple images */}
      {selectedImages.length > 0 && (
        <div className="px-4 pb-2 shrink-0">
          <div className="flex flex-wrap gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative inline-block">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 text-white rounded-full text-xs flex items-center justify-center hover:bg-gray-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Extra padding on mobile for bottom nav */}
      <div className="p-4 pb-20 lg:pb-4 shrink-0">
        <div className="flex items-center bg-white rounded-full border border-gray-300 px-2 py-1.5">
          <EmojiButton onEmojiSelect={handleEmojiSelect} />
          <form onSubmit={handleSubmit} className="flex-1 flex mx-2">
            <input
              ref={inputRef}
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Nhắn tin..."
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-500 text-sm py-2"
            />
            {(messageText.length > 0 || selectedImages.length > 0) && (
              <button
                type="submit"
                className="text-[#0095f6] font-semibold text-sm px-2"
              >
                Gửi
              </button>
            )}
          </form>
          {messageText.length === 0 && selectedImages.length === 0 && (
            <>
              <label className="p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => handleSendHeart()}
                className="p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart className="w-6 h-6 stroke-[1.5]" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
