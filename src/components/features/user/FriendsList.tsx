import { useFriends } from "../../../hooks/useFriends";
import { MoreHorizontal, Search, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

/**
 * Instagram-style Friends List Component
 */
export function FriendsList() {
  const {
    friends,
    total,
    page,
    search,
    loading,
    error,
    setPage,
    setSearch,
    unfriend,
  } = useFriends();

  const [searchInput, setSearchInput] = useState(search);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setTimeout(() => setSearch(value), 500);
  };

  const handleUnfriend = async (friendId: number, friendName: string) => {
    if (window.confirm(`Bạn có chắc muốn hủy kết bạn với ${friendName}?`)) {
      await unfriend(friendId);
    }
    setMenuOpen(null);
  };

  const handleMessage = (friendId: number) => {
    navigate(`/messaging?userId=${friendId}`);
  };

  if (loading && friends.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500 text-sm">{error}</div>;
  }

  return (
    <div>
      {/* Search Bar - Instagram Style */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-lg text-sm placeholder-gray-500 focus:ring-0 focus:bg-gray-200 transition-colors"
          />
        </div>
      </div>

      {/* Stats */}
      <p className="text-sm text-gray-500 mb-4">{total} bạn bè</p>

      {/* Empty State */}
      {friends.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-black flex items-center justify-center">
            <Users className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-medium mb-2">
            {search ? "Không tìm thấy" : "Chưa có bạn bè"}
          </h3>
          <p className="text-gray-500 text-sm">
            {search
              ? "Thử tìm kiếm với từ khóa khác"
              : "Hãy gửi lời mời kết bạn để bắt đầu"}
          </p>
        </div>
      )}

      {/* Friends List - Instagram Style */}
      <div className="space-y-2">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors"
          >
            {/* Avatar & Info */}
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={friend.avatar || ""}
                alt={`${friend.first_Name} ${friend.last_Name}`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">
                  {friend.first_Name} {friend.last_Name}
                </h3>
                <p className="text-sm text-gray-500">{friend.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMessage(friend.id)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors"
              >
                Nhắn tin
              </button>
              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpen(menuOpen === friend.id ? null : friend.id)
                  }
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {menuOpen === friend.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                    <button
                      onClick={() =>
                        handleUnfriend(
                          friend.id,
                          `${friend.first_Name} ${friend.last_Name}`
                        )
                      }
                      className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-50"
                    >
                      Hủy kết bạn
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > 10 && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="text-sm font-semibold text-[#0095f6] disabled:text-gray-300"
          >
            Trước
          </button>
          <span className="text-sm text-gray-500">
            {page} / {Math.ceil(total / 10)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil(total / 10)}
            className="text-sm font-semibold text-[#0095f6] disabled:text-gray-300"
          >
            Tiếp
          </button>
        </div>
      )}
    </div>
  );
}
