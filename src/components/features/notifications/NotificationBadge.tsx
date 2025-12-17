import { useNotificationContext } from "../../../contexts/NotificationContext";

interface NotificationBadgeProps {
  onClick?: () => void;
}

/**
 * NotificationBadge - Shows unread notification count
 * Used in Sidebar for the "Thông báo" (Notifications) menu item
 */
export function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const { unreadCount } = useNotificationContext();

  if (unreadCount === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="relative"
      title={`${unreadCount} thông báo chưa đọc`}
    >
      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    </button>
  );
}
