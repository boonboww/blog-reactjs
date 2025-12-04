import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import requestApi from "../../helpers/api";
import { Users, FileText } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch users count
        const usersResponse = await requestApi("/users", "GET", []);
        const totalUsers = usersResponse.data.total || 0;

        // Fetch posts count
        const postsResponse = await requestApi("/posts", "GET", []);
        const totalPosts = postsResponse.data.total || 0;

        setStats({ totalUsers, totalPosts });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      link: "/admin/users",
      description: "Manage all registered users",
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
      link: "/admin/posts",
      description: "View and manage all posts",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(stat.link)}
              className={`group relative overflow-hidden rounded-2xl border ${stat.borderColor} ${stat.bgColor} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="mb-2 text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  {loading ? (
                    <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
                  ) : (
                    <h3 className="text-4xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </h3>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br ${stat.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <IconComponent className="h-8 w-8 text-black" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 max-w-4xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/admin/users/create")}
              className="flex w-full items-center gap-4 rounded-xl bg-blue-50 border border-blue-200 p-4 text-left transition-all hover:bg-blue-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add New User</p>
                <p className="text-sm text-gray-600">
                  Create a new user account
                </p>
              </div>
            </button>
            <button
              onClick={() => navigate("/admin/posts/create")}
              className="flex w-full items-center gap-4 rounded-xl bg-purple-50 border border-purple-200 p-4 text-left transition-all hover:bg-purple-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Create New Post</p>
                <p className="text-sm text-gray-600">
                  Write and publish a new post
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
