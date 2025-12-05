import { useState } from "react";
import { MessagingPanel } from "./MessagingPanel";
import { GroupChatPanel } from "./GroupChatPanel";
import { MessageCircle, Users } from "lucide-react";

type ChatType = "private" | "group";

interface ChatSelectorProps {
  currentUserId: string; // Current logged-in user ID
}

export function ChatSelector({ currentUserId }: ChatSelectorProps) {
  const [activeTab, setActiveTab] = useState<ChatType>("private");

  // Demo: In real app, these would come from props or API
  const [selectedRecipient, setSelectedRecipient] = useState("user123");
  const [selectedRoom, setSelectedRoom] = useState("room-general");

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("private")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "private"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border"
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          Chat 1-1
        </button>
        <button
          onClick={() => setActiveTab("group")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "group"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border"
          }`}
        >
          <Users className="w-5 h-5" />
          Nhóm Chat
        </button>
      </div>

      {/* Demo User/Room Selector */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 font-medium mb-2">
          🔧 Demo Controls (sẽ được thay thế bằng UI thực tế)
        </p>
        {activeTab === "private" ? (
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-700">Chat với User ID:</label>
            <input
              type="text"
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
              placeholder="Nhập user ID"
            />
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-700">Room ID:</label>
            <input
              type="text"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
              placeholder="Nhập room ID"
            />
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {activeTab === "private" ? (
        <MessagingPanel
          currentUserId={currentUserId}
          recipientUserId={selectedRecipient}
          recipientName={`User ${selectedRecipient}`}
        />
      ) : (
        <GroupChatPanel
          currentUserId={currentUserId}
          roomId={selectedRoom}
          roomName={`Phòng ${selectedRoom}`}
        />
      )}
    </div>
  );
}
