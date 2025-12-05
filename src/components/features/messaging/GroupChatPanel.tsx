import { useRef, useEffect, useMemo } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { useGroupChat } from "../../../hooks/useGroupChat";
import { ChatBubble } from "./ChatBubble";
import { Send, Users, Wifi, WifiOff } from "lucide-react";

interface GroupChatPanelProps {
  currentUserId: string; // Current logged-in user ID
  roomId: string; // Group room ID
  roomName?: string; // Optional display name for room
}

export function GroupChatPanel({
  currentUserId,
  roomId,
  roomName,
}: GroupChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Connect to socket
  const { status, isConnected } = useSocket(currentUserId);

  // Group chat hook
  const { messages, joinRoom, leaveRoom, sendMessage, joinedRooms, roomInfo } =
    useGroupChat(currentUserId);

  const currentMessages = useMemo(
    () => messages[roomId] || [],
    [messages, roomId]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Auto-join room when connected
  useEffect(() => {
    if (isConnected && !joinedRooms.includes(roomId)) {
      joinRoom(roomId);
    }
  }, [isConnected, roomId, joinRoom, joinedRooms]);

  // Leave room on unmount
  useEffect(() => {
    return () => {
      if (joinedRooms.includes(roomId)) {
        leaveRoom(roomId);
      }
    };
  }, [roomId, leaveRoom, joinedRooms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get("message") as string;

    if (!content?.trim()) return;

    sendMessage(roomId, content.trim());

    // Reset form
    (e.target as HTMLFormElement).reset();
    inputRef.current?.focus();
  };

  const isInRoom = joinedRooms.includes(roomId);

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="bg-white rounded-xl border overflow-hidden flex flex-col"
        style={{ height: "calc(100vh - 250px)" }}
      >
        {/* Header with room info */}
        <div className="border-b bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {roomName || roomId}
                </h3>
                <p className="text-xs text-gray-500">
                  {isInRoom ? "Đã tham gia" : "Chưa tham gia"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-gray-400" />
              )}
              <span
                className={`text-xs font-medium ${
                  isConnected ? "text-green-600" : "text-gray-500"
                }`}
              >
                {status === "connecting" && "Đang kết nối..."}
                {status === "connected" && "Đã kết nối"}
                {status === "disconnected" && "Ngắt kết nối"}
                {status === "error" && "Lỗi kết nối"}
              </span>
            </div>
          </div>

          {/* Room notifications */}
          {roomInfo.length > 0 && (
            <div className="text-xs text-gray-500 space-y-1 max-h-12 overflow-y-auto">
              {roomInfo.slice(-3).map((info, idx) => (
                <p key={idx}>• {info}</p>
              ))}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!isInRoom ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Đang tham gia phòng...</p>
            </div>
          ) : currentMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Chưa có tin nhắn nào trong phòng</p>
              <p className="text-sm mt-2">Gửi tin nhắn đầu tiên!</p>
            </div>
          ) : (
            <>
              {currentMessages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-gray-50 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              name="message"
              placeholder={
                isConnected && isInRoom
                  ? "Gửi tin nhắn đến phòng..."
                  : "Chờ kết nối..."
              }
              disabled={!isConnected || !isInRoom}
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!isConnected || !isInRoom}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
