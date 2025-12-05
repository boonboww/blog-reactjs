import { useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { Feed } from "../layout/Feed";
import { RightPanel } from "../layout/RightPanel";
import { DirectMessages } from "../features/messaging/DirectMessages";
import { CreatePostModal } from "../features/posts/CreatePostModal";
import { useSocket } from "../../hooks/useSocket";
import type { Post, Story, Conversation } from "../../types";

export default function Home() {
  const [activeView, setActiveView] = useState<"home" | "messages">("home");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 🔌 Connect socket for real-time features (friend notifications, etc.)
  const userId = localStorage.getItem("user_id") || localStorage.getItem("id");
  useSocket(userId);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      username: "nguyen_vana",
      userAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      imageUrl:
        "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80",
      caption: "Một ngày đẹp trời ở Đà Lạt 🌸 #travel #dalat #vietnam",
      likes: 234,
      comments: [
        {
          id: "1",
          username: "tran_thib",
          text: "Đẹp quá! 😍",
        },
      ],
      timestamp: new Date("2024-12-03T10:00:00"),
      isLiked: false,
      isSaved: false,
    },
    {
      id: "2",
      username: "food_lover",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      caption: "Bữa sáng ngon miệng 🍳☕ #breakfast #foodie",
      likes: 187,
      comments: [
        {
          id: "2",
          username: "le_vanc",
          text: "Nhìn ngon ghê!",
        },
      ],
      timestamp: new Date("2024-12-02T08:30:00"),
      isLiked: true,
      isSaved: false,
    },
    {
      id: "3",
      username: "techie_dev",
      userAvatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80",
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      caption: "Coding life 💻 #developer #programming #javascript",
      likes: 312,
      comments: [],
      timestamp: new Date("2024-12-01T14:20:00"),
      isLiked: false,
      isSaved: true,
    },
  ]);

  const [stories] = useState<Story[]>([
    {
      id: "1",
      username: "Câu chuyện của bạn",
      userAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      isViewed: false,
    },
    {
      id: "2",
      username: "nguyen_vana",
      userAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      isViewed: false,
    },
    {
      id: "3",
      username: "food_lover",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      isViewed: true,
    },
    {
      id: "4",
      username: "techie_dev",
      userAvatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80",
      isViewed: false,
    },
    {
      id: "5",
      username: "travel_explorer",
      userAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
      isViewed: true,
    },
  ]);

  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      username: "nguyen_vana",
      userAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      lastMessage: "Cảm ơn bạn nhé!",
      timestamp: new Date("2024-12-03T11:30:00"),
      unread: true,
    },
    {
      id: "2",
      username: "food_lover",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      lastMessage: "Hẹn gặp lại nhé",
      timestamp: new Date("2024-12-02T16:45:00"),
      unread: false,
    },
    {
      id: "3",
      username: "techie_dev",
      userAvatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80",
      lastMessage: "Code review xong chưa?",
      timestamp: new Date("2024-12-01T09:20:00"),
      unread: true,
    },
  ]);

  const handleCreatePost = (imageUrl: string, caption: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      username: "your_username",
      userAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      imageUrl,
      caption,
      likes: 0,
      comments: [],
      timestamp: new Date(),
      isLiked: false,
      isSaved: false,
    };
    setPosts([newPost, ...posts]);
    setShowCreateModal(false);
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSavePost = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now().toString(),
                  username: "your_username",
                  text,
                },
              ],
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar - Fixed on desktop */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onCreatePost={() => setShowCreateModal(true)}
      />

      {/* Main Content - Offset by sidebar width on desktop */}
      <main className="lg:ml-64 min-h-screen bg-white">
        {activeView === "home" ? (
          <div className="flex justify-center gap-8 pt-8 px-4 pb-20 lg:pb-8">
            {/* Feed */}
            <div className="w-full max-w-[470px]">
              <Feed
                posts={posts}
                stories={stories}
                onLikePost={handleLikePost}
                onSavePost={handleSavePost}
                onAddComment={handleAddComment}
              />
            </div>

            {/* Right Panel - Hidden on smaller screens */}
            <div className="hidden xl:block w-80 sticky top-8 h-fit">
              <RightPanel />
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 lg:left-64 bg-white">
            <DirectMessages />
          </div>
        )}
      </main>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
}
