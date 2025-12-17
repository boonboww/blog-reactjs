import { useChatUnreadCount } from "../../../hooks/useChatUnreadCount";

/**
 * Badge component showing unread chat message count
 * Displays on the Messages nav item in sidebar
 */
export function ChatUnreadBadge() {
  const { totalUnreadCount } = useChatUnreadCount();

  if (totalUnreadCount === 0) {
    return null;
  }

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
      {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
    </span>
  );
}
