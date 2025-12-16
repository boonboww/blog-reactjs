import { PlusSquare, Heart } from "lucide-react";
import { FriendRequestNotification } from "../features/user/FriendRequestNotification";

interface MobileHeaderProps {
  onCreatePost: () => void;
  onNotifications?: () => void;
}

/**
 * Mobile Header Component
 * Shows app name on left, create post and notifications icons on right
 * Only visible on mobile screens (hidden on lg and above)
 */
export function MobileHeader({
  onCreatePost,
  onNotifications,
}: MobileHeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-14">
        {/* App Name - Left */}
        <h1 className="text-xl font-bold">Gooblog</h1>

        {/* Action Icons - Right */}
        <div className="flex items-center gap-2">
          {/* Create Post */}
          <button
            onClick={onCreatePost}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Tạo bài viết"
          >
            <PlusSquare className="w-6 h-6" />
          </button>

          {/* Notifications */}
          <button
            onClick={onNotifications}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            title="Thông báo"
          >
            <Heart className="w-6 h-6" />
          </button>

          {/* Friend Requests */}
          <FriendRequestNotification />
        </div>
      </div>
    </header>
  );
}
