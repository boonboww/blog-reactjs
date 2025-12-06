import { useEffect, useState } from "react";
import { ImageWithFallback } from "../shared/ImageWithFallback";
import { userService } from "../../services/user.service";
import { friendService } from "../../services/friend.service";
import type { UserEntity } from "../../types";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function RightPanel() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [suggestions, setSuggestions] = useState<UserEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get Current User info
    const userDataStr = localStorage.getItem("user_data");
    if (userDataStr) {
      setCurrentUser(JSON.parse(userDataStr));
    } else {
      // Fallback fetch if not in storage
      const userId = localStorage.getItem("id");
      if (userId) {
        userService
          .getUserById(Number(userId))
          .then((data) => setCurrentUser(data))
          .catch((err) => console.error(err));
      }
    }

    // 2. Fetch Suggested Friends
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        // Use the new getSuggestedFriends API
        const suggestedUsers = await friendService.getSuggestedFriends();

        // Take top 5
        setSuggestions(suggestedUsers.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath) return undefined;
    if (avatarPath.startsWith("http")) return avatarPath;
    return `${API_URL}/${avatarPath}`;
  };

  const getFullName = (user: any) => {
    const firstName = user.first_Name || user.first_name || "";
    const lastName = user.last_Name || user.last_name || "";
    return `${firstName} ${lastName}`.trim();
  };

  const getUsername = (user: any) => {
    const firstName = user.first_Name || user.first_name || "";
    const lastName = user.last_Name || user.last_name || "";
    return `${firstName}_${lastName}`.toLowerCase();
  };

  if (!currentUser) return null; // Or skeleton

  return (
    <div className="sticky top-8 pt-8 ml-8 w-80">
      {/* User Profile */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/profile" className="flex items-center gap-3 group">
          <ImageWithFallback
            src={getAvatarUrl(currentUser.avatar)}
            alt={getUsername(currentUser)}
            className="w-14 h-14 rounded-full object-cover border border-gray-200"
          />
          <div>
            <div className="font-semibold text-sm group-hover:opacity-80 transition-opacity">
              {getUsername(currentUser)}
            </div>
            <div className="text-gray-500 text-sm">
              {getFullName(currentUser)}
            </div>
          </div>
        </Link>
        <button className="text-blue-500 text-xs font-semibold hover:text-blue-700">
          Chuyển
        </button>
      </div>

      {/* Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 text-sm font-semibold">
            Gợi ý cho bạn
          </span>
          <button className="text-xs font-semibold hover:text-gray-500">
            Xem tất cả
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-2 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <ImageWithFallback
                    src={getAvatarUrl(user.avatar)}
                    alt={getUsername(user)}
                    className="w-8 h-8 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <div className="font-semibold text-sm">
                      {getUsername(user)}
                    </div>
                    <div className="text-gray-500 text-xs">Gợi ý cho bạn</div>
                  </div>
                </Link>
                <button className="text-blue-500 text-xs font-semibold hover:text-blue-700">
                  Theo dõi
                </button>
              </div>
            ))}
            {suggestions.length === 0 && (
              <div className="text-sm text-gray-500 py-2">
                Không có gợi ý nào mới.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-400 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">
            Giới thiệu
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Trợ giúp
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Báo chí
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            API
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Việc làm
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Quyền riêng tư
          </a>
        </div>
        <div>© 2024 INSTAGRAM CLONE</div>
      </div>
    </div>
  );
}
