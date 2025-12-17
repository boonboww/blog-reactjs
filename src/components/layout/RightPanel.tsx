import { useEffect, useState } from "react";
import { ImageWithFallback } from "../shared/ImageWithFallback";
import { userService } from "../../services/user.service";
import { friendService } from "../../services/friend.service";
import type { UserEntity } from "../../types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Track request status for each user
interface RequestStatus {
  [userId: number]: "idle" | "loading" | "sent" | "error";
}

export function RightPanel() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [suggestions, setSuggestions] = useState<UserEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>({});

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
    // Supabase returns full URL, use directly
    return avatarPath || undefined;
  };

  const getFullName = (user: UserEntity) => {
    // Support both first_Name/last_Name and first_name/last_name formats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData = user as any;
    const firstName = user.first_Name || userData.first_name || "";
    const lastName = user.last_Name || userData.last_name || "";
    return `${firstName} ${lastName}`.trim();
  };

  const getUsername = (user: UserEntity) => {
    // Support both first_Name/last_Name and first_name/last_name formats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData = user as any;
    const firstName = user.first_Name || userData.first_name || "";
    const lastName = user.last_Name || userData.last_name || "";
    return `${firstName}_${lastName}`.toLowerCase();
  };

  // Handle sending friend request
  const handleSendFriendRequest = async (userId: number) => {
    // Set loading state
    setRequestStatus((prev) => ({ ...prev, [userId]: "loading" }));

    try {
      await friendService.sendFriendRequest(userId);
      // Update status to sent
      setRequestStatus((prev) => ({ ...prev, [userId]: "sent" }));
      toast.success("Đã gửi lời mời kết bạn!", { position: "top-center" });
    } catch (error: unknown) {
      console.error("Failed to send friend request:", error);
      setRequestStatus((prev) => ({ ...prev, [userId]: "error" }));

      // Show error message
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message || "Không thể gửi lời mời kết bạn";
      toast.error(message, { position: "top-center" });
    }
  };

  // Get button text and style based on request status
  const getButtonContent = (userId: number) => {
    const status = requestStatus[userId] || "idle";

    switch (status) {
      case "loading":
        return {
          text: "Đang gửi...",
          disabled: true,
          className: "text-gray-400 text-xs font-semibold cursor-not-allowed",
        };
      case "sent":
        return {
          text: "Đã gửi",
          disabled: true,
          className: "text-gray-500 text-xs font-semibold cursor-default",
        };
      case "error":
        return {
          text: "Thử lại",
          disabled: false,
          className: "text-red-500 text-xs font-semibold hover:text-red-700",
        };
      default:
        return {
          text: "Kết bạn",
          disabled: false,
          className: "text-blue-500 text-xs font-semibold hover:text-blue-700",
        };
    }
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
                <button
                  onClick={() => handleSendFriendRequest(user.id)}
                  disabled={getButtonContent(user.id).disabled}
                  className={getButtonContent(user.id).className}
                >
                  {getButtonContent(user.id).text}
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
    </div>
  );
}
