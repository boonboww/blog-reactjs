import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { friendService } from "../../../services/friend.service";
import type { UserEntity } from "../../../types";
import { toast } from "react-toastify";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

// Status for each user's friend request action
type RequestStatus = "idle" | "loading" | "sent" | "error";

/**
 * FriendSuggestions - Component for displaying friend suggestions
 * Shows on mobile in FriendsPage, on desktop shows in RightPanel
 */
export function FriendSuggestions() {
  const [suggestions, setSuggestions] = useState<UserEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<
    Record<number, RequestStatus>
  >({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await friendService.getSuggestedFriends();
        setSuggestions(data.slice(0, 10)); // Limit to 10 suggestions
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Handle sending friend request
  const handleSendRequest = async (userId: number) => {
    setRequestStatus((prev) => ({ ...prev, [userId]: "loading" }));

    try {
      await friendService.sendFriendRequest(userId);
      setRequestStatus((prev) => ({ ...prev, [userId]: "sent" }));
      toast.success("Đã gửi lời mời kết bạn!", { position: "top-center" });
    } catch (error: unknown) {
      console.error("Failed to send friend request:", error);
      setRequestStatus((prev) => ({ ...prev, [userId]: "error" }));
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message || "Không thể gửi lời mời kết bạn";
      toast.error(message, { position: "top-center" });
    }
  };

  // Get button content based on status
  const getButtonContent = (status: RequestStatus) => {
    switch (status) {
      case "loading":
        return {
          text: "Đang gửi...",
          className: "bg-gray-200 text-gray-500",
          disabled: true,
        };
      case "sent":
        return {
          text: "Đã gửi",
          className: "bg-gray-100 text-gray-500",
          disabled: true,
        };
      case "error":
        return {
          text: "Thử lại",
          className: "bg-red-100 text-red-600 hover:bg-red-200",
          disabled: false,
        };
      default:
        return {
          text: "Kết bạn",
          className: "bg-[#0095f6] text-white hover:bg-[#1877f2]",
          disabled: false,
        };
    }
  };

  // Get display name
  const getDisplayName = (user: UserEntity) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData = user as any;
    const firstName = user.first_Name || userData.first_name || "";
    const lastName = user.last_Name || userData.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Người dùng";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-black flex items-center justify-center">
          <UserPlus className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium mb-1">Không có gợi ý</h3>
        <p className="text-gray-500 text-sm">Hãy thử tìm kiếm bạn bè</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {suggestions.length} gợi ý cho bạn
      </p>

      <div className="space-y-2">
        {suggestions.map((user) => {
          const status = requestStatus[user.id] || "idle";
          const buttonContent = getButtonContent(status);

          return (
            <div
              key={user.id}
              className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={user.avatar || ""}
                  alt={getDisplayName(user)}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <h3 className="font-semibold text-sm text-gray-900">
                  {getDisplayName(user)}
                </h3>
              </div>

              <button
                onClick={() => handleSendRequest(user.id)}
                disabled={buttonContent.disabled}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${buttonContent.className}`}
              >
                {buttonContent.text}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
