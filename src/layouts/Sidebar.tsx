import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  FileText,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      title: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Posts",
      icon: FileText,
      path: "/admin/posts",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`flex flex-col border-r border-gray-200 bg-white text-gray-900 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } min-h-screen`}
    >
      {/* Header with Logo & Toggle */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </div>
        )}
        <button
          className="rounded-lg bg-gray-100 p-2 transition-all hover:bg-gray-200"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-700" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
                active
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={collapsed ? item.title : ""}
            >
              <IconComponent
                className={`h-5 w-5 ${
                  active
                    ? "text-blue-600"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}
              />
              {!collapsed && (
                <span
                  className={
                    active ? "text-blue-600" : "group-hover:text-gray-900"
                  }
                >
                  {item.title}
                </span>
              )}
              {active && !collapsed && (
                <div className="ml-auto h-2 w-2 rounded-full bg-blue-600"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-200 p-4">
        {!collapsed ? (
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-3 border border-blue-100">
            <div className="mb-1 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-xs font-semibold text-gray-700">
                Logged in as:
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900">Admin User</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
