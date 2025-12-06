import { useState, useEffect } from "react";
import {
  Settings,
  Grid,
  Bookmark,
  UserSquare2,
  Heart,
  MessageCircle,
} from "lucide-react";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { Sidebar } from "../components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { getPostsByUserId, type Post } from "../services/post.service";
import { friendService } from "../services/friend.service";
import { FriendsListModal } from "../components/features/user/FriendsListModal";
import { EditProfileModal } from "../components/features/user/EditProfileModal";

interface UserFromLogin {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">(
    "posts"
  );
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<UserFromLogin | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendsCount, setFriendsCount] = useState(0);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchData = async () => {
    try {
      const userDataStr = localStorage.getItem("user_data");
      if (userDataStr) {
        const userData = JSON.parse(userDataStr) as UserFromLogin;
        setCurrentUser(userData);

        // Fetch posts by user ID
        const postsResponse = await getPostsByUserId(userData.id, {
          items_per_page: 50,
        });
        setUserPosts(postsResponse.data);

        // Fetch friends count
        try {
          const friendsResponse = await friendService.getFriendsByUserId(
            userData.id,
            {
              limit: 1,
            }
          );
          setFriendsCount(friendsResponse.total);
        } catch (error) {
          console.error("Failed to fetch friends count:", error);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileUpdate = () => {
    // Refresh user data from localStorage
    const userDataStr = localStorage.getItem("user_data");
    if (userDataStr) {
      const userData = JSON.parse(userDataStr) as UserFromLogin;
      setCurrentUser(userData);
    }
    // Refetch all data
    fetchData();
  };

  const username = currentUser
    ? `${currentUser.first_name?.toLowerCase() || ""}_${
        currentUser.last_name?.toLowerCase() || ""
      }`
    : "your_username";

  const displayName = currentUser
    ? `${currentUser.first_name || ""} ${currentUser.last_name || ""}`
    : "Tên của bạn";

  // Don't encode here - ImageWithFallback handles encoding
  const avatarUrl = currentUser?.avatar
    ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${
        currentUser.avatar
      }`
    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80";

  // DEBUG: Log avatar URL
  console.log("DEBUG Avatar:", {
    rawAvatar: currentUser?.avatar,
    avatarUrl,
    user: currentUser,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        activeView="home"
        onNavigate={() => navigate("/")}
        onCreatePost={() => {}}
      />

      {/* Main Content */}
      <div className="fixed inset-0 lg:left-64 bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 pb-20 lg:pb-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="mb-8">
                <div className="flex gap-8 md:gap-20 items-start">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <ImageWithFallback
                      src={avatarUrl}
                      alt="Profile"
                      className="w-20 h-20 md:w-36 md:h-36 rounded-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {/* Username and Actions */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <h1 className="text-xl">{username}</h1>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors"
                      >
                        Chỉnh sửa trang cá nhân
                      </button>
                      <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors hidden md:block">
                        Xem kho lưu trữ
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 mb-5">
                      <div>
                        <span className="font-semibold">
                          {userPosts.length}
                        </span>
                        <span className="ml-1 text-gray-600">bài viết</span>
                      </div>
                      <button
                        onClick={() => setShowFriendsModal(true)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        <span className="font-semibold">{friendsCount}</span>
                        <span className="ml-1 text-gray-600">bạn bè</span>
                      </button>
                    </div>

                    {/* Bio */}
                    <div className="text-sm">
                      <p className="font-semibold mb-1">{displayName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-t">
                <div className="flex justify-center gap-12 md:gap-16">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`flex items-center gap-2 py-4 border-t transition-colors ${
                      activeTab === "posts"
                        ? "border-black -mt-px"
                        : "border-transparent text-gray-400"
                    }`}
                  >
                    <Grid className="w-3 h-3" />
                    <span className="text-xs font-semibold tracking-wider">
                      BÀI VIẾT
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`flex items-center gap-2 py-4 border-t transition-colors ${
                      activeTab === "saved"
                        ? "border-black -mt-px"
                        : "border-transparent text-gray-400"
                    }`}
                  >
                    <Bookmark className="w-3 h-3" />
                    <span className="text-xs font-semibold tracking-wider">
                      ĐÃ LƯU
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("tagged")}
                    className={`flex items-center gap-2 py-4 border-t transition-colors ${
                      activeTab === "tagged"
                        ? "border-black -mt-px"
                        : "border-transparent text-gray-400"
                    }`}
                  >
                    <UserSquare2 className="w-3 h-3" />
                    <span className="text-xs font-semibold tracking-wider">
                      ĐƯỢC GẮN THẺ
                    </span>
                  </button>
                </div>
              </div>

              {/* Posts Grid */}
              <div className="mt-1">
                {activeTab === "posts" && (
                  <>
                    {userPosts.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 border-2 border-black rounded-full flex items-center justify-center">
                          <Grid className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-light mb-2">
                          Chia sẻ ảnh
                        </h3>
                        <p className="text-sm text-gray-500">
                          Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá
                          nhân của bạn.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1 md:gap-1">
                        {userPosts.map((post) => (
                          <div
                            key={post.id}
                            className="aspect-square group cursor-pointer relative"
                          >
                            <ImageWithFallback
                              src={`${
                                import.meta.env.VITE_API_URL ||
                                "http://localhost:3000"
                              }/${post.thumbnail}`}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
                              <div className="flex items-center gap-2">
                                <Heart className="w-6 h-6 fill-white" />
                                <span className="font-semibold">0</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MessageCircle className="w-6 h-6 fill-white" />
                                <span className="font-semibold">0</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === "saved" && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-black rounded-full flex items-center justify-center">
                      <Bookmark className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-light mb-2">Lưu</h3>
                    <p className="text-sm text-gray-500">
                      Lưu ảnh và video mà bạn muốn xem lại.
                    </p>
                  </div>
                )}

                {activeTab === "tagged" && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-black rounded-full flex items-center justify-center">
                      <UserSquare2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-light mb-2">Ảnh có mặt bạn</h3>
                    <p className="text-sm text-gray-500">
                      Khi có người gắn thẻ bạn trong ảnh, ảnh đó sẽ xuất hiện ở
                      đây.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Friends List Modal */}
      {currentUser && (
        <FriendsListModal
          isOpen={showFriendsModal}
          onClose={() => setShowFriendsModal(false)}
          userId={currentUser.id}
        />
      )}

      {/* Edit Profile Modal */}
      {currentUser && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentUser={currentUser}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}
