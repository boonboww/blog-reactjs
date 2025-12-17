import { X, Heart, MessageCircle, Check } from "lucide-react";
import { useNotificationContext } from "../../../contexts/NotificationContext";
import { ImageWithFallback } from "../../shared/ImageWithFallback";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * NotificationPanel - Full panel showing notification list
 * Displays like/comment notifications with mark as read features
 */
export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    unreadCount,
  } = useNotificationContext();

  if (!isOpen) return null;

  const handleNotificationClick = async (notification: {
    id: number;
    is_read: boolean;
    post: { id: number };
  }) => {
    // Mark as read if not already
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    // Navigate to post
    navigate(`/post/${notification.post.id}`);
    onClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getNotificationText = (type: string) => {
    switch (type) {
      case "like":
        return "đã thích bài viết của bạn";
      case "comment":
        return "đã bình luận bài viết của bạn";
      default:
        return "đã tương tác với bạn";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Thông báo</h2>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Đánh dấu đã đọc
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 text-left transition-colors ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <ImageWithFallback
                      src={notification.sender?.avatar}
                      alt={`${notification.sender?.first_Name || ""} ${
                        notification.sender?.last_Name || ""
                      }`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {/* Icon overlay */}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {notification.sender?.first_Name}{" "}
                        {notification.sender?.last_Name}
                      </span>{" "}
                      {getNotificationText(notification.type)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {notification.post?.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(
                        new Date(
                          new Date(notification.created_at).getTime() +
                            7 * 60 * 60 * 1000
                        ),
                        {
                          addSuffix: true,
                          locale: vi,
                        }
                      )}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
