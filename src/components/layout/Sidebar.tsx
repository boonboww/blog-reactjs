import {
  Home,
  Search,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
  LogOut,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FriendRequestNotification } from "../features/user/FriendRequestNotification";

interface SidebarProps {
  activeView: "home" | "messages";
  onNavigate: (view: "home" | "messages") => void;
  onCreatePost: () => void;
}

export function Sidebar({
  activeView,
  onNavigate,
  onCreatePost,
}: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  const navItems = [
    {
      icon: Home,
      label: "Trang chủ",
      view: "home" as const,
      onClick: () => onNavigate("home"),
    },
    { icon: Search, label: "Tìm kiếm", view: null, onClick: () => {} },

    {
      icon: MessageCircle,
      label: "Tin nhắn",
      view: "messages" as const,
      onClick: () => navigate("/messages"),
    },
    {
      icon: Users,
      label: "Bạn bè",
      view: null,
      onClick: () => navigate("/friends"),
      badge: true, // Show notification badge
    },
    { icon: Heart, label: "Thông báo", view: null, onClick: () => {} },
    { icon: PlusSquare, label: "Tạo", view: null, onClick: onCreatePost },
    {
      icon: User,
      label: "Trang cá nhân",
      view: null,
      onClick: () => navigate("/profile"),
    },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around py-2">
          {[
            navItems[0], // Home
            navItems[1], // Search
            navItems[4], // Create
            navItems[2], // Messages
            navItems[5], // Profile
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`p-3 ${
                item.view === activeView ? "text-black" : "text-gray-600"
              }`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 w-64 h-screen bg-white border-r z-40 flex-col">
        <div className="flex flex-col h-full py-8 px-3">
          {/* Logo */}
          <div className="px-3 mb-10">
            <h1 className="text-2xl font-bold ">Gooblog</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-colors relative ${
                  item.view === activeView ? "font-bold" : "hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className="w-6 h-6"
                  strokeWidth={item.view === activeView ? 2.5 : 2}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <div className="absolute right-3">
                    <FriendRequestNotification />
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
    flex items-center gap-4 px-3 py-3
    rounded-xl
    text-black font-medium
    transition-all duration-200

    hover:bg-red-50 hover:text-black
    active:scale-95
  "
          >
            <LogOut className="w-6 h-6 stroke-black" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
