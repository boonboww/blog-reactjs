import { useFriendRequests } from "../../../hooks/useFriendRequests";
import { UserPlus } from "lucide-react";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

/**
 * Instagram-style Friend Requests List Component
 */
export function FriendRequestsList() {
  const { pendingRequests, loading, error, acceptRequest, rejectRequest } =
    useFriendRequests();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500 text-sm">{error}</div>;
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-black flex items-center justify-center">
          <UserPlus className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-medium mb-2">Không có lời mời</h3>
        <p className="text-gray-500 text-sm">
          Khi có người gửi lời mời kết bạn, bạn sẽ thấy ở đây
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <p className="text-sm text-gray-500 mb-4">
        {pendingRequests.length} lời mời đang chờ
      </p>

      {/* Requests List */}
      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <div
            key={request.friendshipId}
            className="flex items-center gap-3 py-2"
          >
            {/* Avatar */}
            <ImageWithFallback
              src={request.requester.avatar || ""}
              alt={`${request.requester.first_Name} ${request.requester.last_Name}`}
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900">
                {request.requester.first_Name} {request.requester.last_Name}
              </h3>
              <p className="text-xs text-gray-400">
                {new Date(request.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>

            {/* Actions - Instagram Style Buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => acceptRequest(request.friendshipId)}
                className="px-6 py-1.5 bg-[#0095f6] text-white rounded-lg text-sm font-semibold hover:bg-[#1877f2] transition-colors"
              >
                Xác nhận
              </button>
              <button
                onClick={() => rejectRequest(request.friendshipId)}
                className="px-6 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
