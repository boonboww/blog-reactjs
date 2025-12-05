import { useState } from "react";
import { FriendsList } from "../components/features/user/FriendsList";
import { FriendRequestsList } from "../components/features/user/FriendRequestsList";
import { Sidebar } from "../components/layout/Sidebar";
import { Users, UserPlus, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type TabType = "friends" | "requests" | "search";

/**
 * Instagram-style Friends Page
 * Includes Sidebar and tabs for: My Friends, Friend Requests, Find Users
 */
export function FriendsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("friends");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        activeView="home"
        onNavigate={() => navigate("/")}
        onCreatePost={() => {}}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Bạn bè</h1>
              <p className="text-gray-500 text-sm">
                Quản lý bạn bè và lời mời kết bạn
              </p>
            </div>
          </div>

          {/* Tabs - Instagram Style */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("friends")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === "friends"
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Users className="w-4 h-4" />
              BẠN BÈ
              {activeTab === "friends" && (
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === "requests"
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              LỜI MỜI
              {activeTab === "requests" && (
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === "search"
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Search className="w-4 h-4" />
              TÌM KIẾM
              {activeTab === "search" && (
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "friends" && <FriendsList />}
            {activeTab === "requests" && <FriendRequestsList />}
            {activeTab === "search" && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-black flex items-center justify-center">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Tìm kiếm người dùng
                </h3>
                <p className="text-gray-500 text-sm">
                  Chức năng này đang được phát triển
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
