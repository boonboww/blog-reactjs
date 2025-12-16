import { useState } from "react";
import { FriendsList } from "../components/features/user/FriendsList";
import { FriendRequestsList } from "../components/features/user/FriendRequestsList";
import { UserSearch } from "../components/features/user/UserSearch";
import { FriendSuggestions } from "../components/features/user/FriendSuggestions";
import { Sidebar } from "../components/layout/Sidebar";
import { Users, UserPlus, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

type TabType = "friends" | "requests" | "search" | "suggestions";

/**
 * Instagram-style Friends Page
 * Includes Sidebar and tabs for: My Friends, Friend Requests, Find Users, Suggestions (mobile)
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

      {/* Main Content - Fixed to viewport */}
      <div className="fixed inset-0 lg:left-64 bg-white flex flex-col">
        {/* Tabs - Instagram Style */}
        <div className="flex border-b border-gray-200 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap ${
              activeTab === "friends"
                ? "text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Users className="w-4 h-4" />
            BẠN BÈ
            {activeTab === "friends" && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-black" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap ${
              activeTab === "requests"
                ? "text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            LỜI MỜI
            {activeTab === "requests" && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-black" />
            )}
          </button>

          {/* Suggestions tab - Only visible on mobile (xl:hidden) */}
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`xl:hidden flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap ${
              activeTab === "suggestions"
                ? "text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            GỢI Ý
            {activeTab === "suggestions" && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-black" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap ${
              activeTab === "search"
                ? "text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Search className="w-4 h-4" />
            TÌM KIẾM
            {activeTab === "search" && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-black" />
            )}
          </button>
        </div>

        {/* Tab Content - Scrollable with padding for mobile bottom nav */}
        <div className="flex-1 overflow-y-auto px-4 py-6 pb-20 lg:pb-6">
          <div className="max-w-4xl mx-auto">
            {activeTab === "friends" && <FriendsList />}
            {activeTab === "requests" && <FriendRequestsList />}
            {activeTab === "suggestions" && <FriendSuggestions />}
            {activeTab === "search" && <UserSearch />}
          </div>
        </div>
      </div>
    </div>
  );
}
