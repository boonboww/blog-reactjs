import { useState, useEffect } from "react";
import { X, Search, UserCircle2 } from "lucide-react";
import { friendService } from "../../../services/friend.service";
import type { Friend } from "../../../types";

interface FriendsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export function FriendsListModal({
  isOpen,
  onClose,
  userId,
}: FriendsListModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Helper to encode URL path segments (handles spaces and special characters in filenames)
  const encodeImageUrl = (url: string): string => {
    try {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        const urlObj = new URL(url);
        const encodedPath = urlObj.pathname
          .split("/")
          .map((segment) => encodeURIComponent(segment))
          .join("/");
        return `${urlObj.origin}${encodedPath}${urlObj.search}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchFriends();
    }
  }, [isOpen, userId, search]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await friendService.getFriendsByUserId(userId, {
        limit: 50,
        search: search || undefined,
      });
      setFriends(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="w-8" />
          <h2 className="text-base font-semibold">Bạn bè</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {search ? "Không tìm thấy bạn bè" : "Chưa có bạn bè nào"}
            </div>
          ) : (
            <div className="py-2">
              <p className="px-4 py-2 text-sm text-gray-500">{total} bạn bè</p>
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {friend.avatar ? (
                    <img
                      src={encodeImageUrl(`${API_URL}/${friend.avatar}`)}
                      alt={friend.first_Name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="w-12 h-12 text-gray-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">
                      {friend.first_Name} {friend.last_Name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {friend.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
