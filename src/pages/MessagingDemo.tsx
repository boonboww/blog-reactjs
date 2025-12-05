import { ChatSelector } from "../components/features/messaging/ChatSelector";

/**
 * Demo page for Socket.IO real-time messaging
 * This page demonstrates private chat, group chat, and broadcast features
 */
export default function MessagingDemo() {
  // TODO: Get from Redux auth state or localStorage
  const currentUserId = localStorage.getItem("userId") || "demo-user-1";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            💬 Socket.IO Real-time Messaging
          </h1>
          <p className="text-gray-600 mt-2">
            Demo tính năng chat real-time với Socket.IO
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Đang đăng nhập với User ID:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {currentUserId}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            📋 Hướng dẫn test:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>
              <strong>Private Chat (1-1):</strong> Mở 2 tab browser, dùng userId
              khác nhau, nhắn tin cho nhau
            </li>
            <li>
              <strong>Group Chat:</strong> Nhiều tab cùng join 1 room ID, mọi
              người sẽ thấy tin nhắn
            </li>
            <li>
              <strong>Backend:</strong> Đảm bảo NestJS WebSocket server đang
              chạy ở port 3002
            </li>
            <li>
              <strong>Thay đổi User ID:</strong> Vào Console và chạy{" "}
              <code className="bg-blue-100 px-1 rounded">
                localStorage.setItem('userId', 'user-moi')
              </code>{" "}
              rồi refresh
            </li>
          </ul>
        </div>

        {/* Chat Interface */}
        <ChatSelector currentUserId={currentUserId} />
      </div>
    </div>
  );
}
