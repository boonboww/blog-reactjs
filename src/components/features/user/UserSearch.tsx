import { useState, useEffect, useCallback } from "react";
import { Search, Users } from "lucide-react";
import { userService } from "../../../services/user.service";
import { friendService } from "../../../services/friend.service";
import type { UserEntity, FriendshipStatus } from "../../../types";
import { toast } from "react-toastify";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

// Status for each user's friend request action
type RequestStatus =
  | "idle"
  | "loading"
  | "sent"
  | "friend"
  | "pending"
  | "error";

interface UserWithStatus extends UserEntity {
  requestStatus: RequestStatus;
}

/**
 * UserSearch - Component for searching and adding friends
 * Allows users to search for other users and send friend requests
 */
export function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Get current user ID
  const currentUserId = Number(
    localStorage.getItem("user_id") || localStorage.getItem("id") || "0"
  );

  // Debounced search
  const searchUsers = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setUsers([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      setSearched(true);

      try {
        // Get users matching search query
        const response = await userService.getUsers({
          search: query,
          items_per_page: 20,
        });

        // Filter out current user and check friendship status for each
        const usersData = Array.isArray(response)
          ? response
          : (response as { data?: UserEntity[] }).data || [];

        const filteredUsers = usersData.filter(
          (u: UserEntity) => u.id !== currentUserId
        );

        // Check friendship status for each user
        const usersWithStatus: UserWithStatus[] = await Promise.all(
          filteredUsers.map(async (user: UserEntity) => {
            try {
              const statusResponse = await friendService.checkFriendshipStatus(
                user.id
              );
              let requestStatus: RequestStatus = "idle";

              if (statusResponse.status === ("accepted" as FriendshipStatus)) {
                requestStatus = "friend";
              } else if (
                statusResponse.status === ("pending" as FriendshipStatus)
              ) {
                requestStatus = "pending";
              }

              return { ...user, requestStatus };
            } catch {
              return { ...user, requestStatus: "idle" as RequestStatus };
            }
          })
        );

        setUsers(usersWithStatus);
      } catch (error) {
        console.error("Failed to search users:", error);
        toast.error("Không thể tìm kiếm người dùng", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    },
    [currentUserId]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  // Handle send friend request
  const handleSendRequest = async (userId: number) => {
    // Update status to loading
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, requestStatus: "loading" as RequestStatus }
          : u
      )
    );

    try {
      await friendService.sendFriendRequest(userId);

      // Update status to sent
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, requestStatus: "sent" as RequestStatus } : u
        )
      );

      toast.success("Đã gửi lời mời kết bạn!", { position: "top-center" });
    } catch (error: unknown) {
      console.error("Failed to send friend request:", error);

      // Update status to error
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, requestStatus: "error" as RequestStatus }
            : u
        )
      );

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
          className: "bg-gray-200 text-gray-500 cursor-not-allowed",
          disabled: true,
        };
      case "sent":
      case "pending":
        return {
          text: "Đã gửi",
          className: "bg-gray-100 text-gray-500 cursor-default",
          disabled: true,
        };
      case "friend":
        return {
          text: "Bạn bè",
          className: "bg-gray-100 text-gray-500 cursor-default",
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

  // Get user display name
  const getDisplayName = (user: UserEntity) => {
    // Support both naming conventions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData = user as any;
    const firstName = user.first_Name || userData.first_name || "";
    const lastName = user.last_Name || userData.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Người dùng";
  };

  return (
    <div>
      {/* Search Bar - Instagram Style (matching FriendsList) */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-lg text-sm placeholder-gray-500 focus:ring-0 focus:bg-gray-200 transition-colors"
          />
        </div>
      </div>

      {/* Stats */}
      {searched && (
        <p className="text-sm text-gray-500 mb-4">{users.length} kết quả</p>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}

      {/* Results - Instagram Style (matching FriendsList) */}
      {!loading && (
        <div className="space-y-2">
          {users.map((user) => {
            const buttonContent = getButtonContent(user.requestStatus);
            return (
              <div
                key={user.id}
                className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors"
              >
                {/* Avatar & Info */}
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

                {/* Action Button */}
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

          {/* Empty state after search */}
          {searched && users.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-black flex items-center justify-center">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-medium mb-2">Không tìm thấy</h3>
              <p className="text-gray-500 text-sm">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          )}

          {/* Initial state */}
          {!searched && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-black flex items-center justify-center">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-medium mb-2">Tìm bạn bè mới</h3>
              <p className="text-gray-500 text-sm">
                Nhập tên để tìm kiếm và gửi lời mời kết bạn
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
