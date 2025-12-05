import { useFriendRequests } from "../../../hooks/useFriendRequests";
import { Bell } from "lucide-react";

interface FriendRequestNotificationProps {
  onClick?: () => void;
}

/**
 * Notification badge for friend requests
 * Shows count of pending requests with real-time updates
 */
export function FriendRequestNotification({
  onClick,
}: FriendRequestNotificationProps) {
  const { pendingCount } = useFriendRequests();

  if (pendingCount === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title={`${pendingCount} lời mời kết bạn`}
    >
      <Bell className="w-5 h-5 text-gray-700" />
      {/* Badge */}
      <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
        {pendingCount > 9 ? "9+" : pendingCount}
      </span>
    </button>
  );
}
