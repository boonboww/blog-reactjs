import { useState, useEffect } from "react";
import { Sidebar } from "../layout/Sidebar";
import { MobileHeader } from "../layout/MobileHeader";
import { Feed } from "../layout/Feed";
import { RightPanel } from "../layout/RightPanel";
import { DirectMessages } from "../features/messaging/DirectMessages";
import { CreatePostModal } from "../features/posts/CreatePostModal";
import { useSocket } from "../../hooks/useSocket";
import { useNotifications } from "../../hooks/useNotifications";
import {
  getPosts,
  likePost,
  unlikePost,
  getLikes,
  checkUserLiked,
  createComment,
  getComments,
  type Post as APIPost,
  type Comment as APIComment,
} from "../../services/post.service";
import type { Post, Comment } from "../../types";

export default function Home() {
  const [activeView, setActiveView] = useState<"home" | "messages">("home");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔌 Connect socket for real-time features (friend notifications, etc.)
  const userId = localStorage.getItem("user_id") || localStorage.getItem("id");
  useSocket(userId);

  // 🔔 Enable global real-time notifications (chat messages, friend requests)
  useNotifications(userId);

  // Fetch posts with likes and comments from API
  const fetchPostsWithData = async () => {
    try {
      const response = await getPosts({ items_per_page: 20 });

      // Fetch likes and comments for each post
      const transformedPosts: Post[] = await Promise.all(
        response.data.map(async (apiPost: APIPost) => {
          // Fetch likes count and check if user liked
          let likesCount = 0;
          let isLiked = false;
          let comments: Comment[] = [];

          try {
            const [likesRes, likedRes, commentsRes] = await Promise.all([
              getLikes(apiPost.id),
              checkUserLiked(apiPost.id),
              getComments(apiPost.id),
            ]);
            // likesRes format: {data: [], total: number}
            likesCount = likesRes?.total ?? 0;
            isLiked = likedRes?.liked ?? false;
            // commentsRes format: {data: [...]} or array
            const commentsData = Array.isArray(commentsRes)
              ? commentsRes
              : commentsRes?.data || [];
            comments = commentsData.map((c: APIComment) => ({
              id: c.id.toString(),
              username: `${c.user?.first_Name || ""}_${
                c.user?.last_Name || ""
              }`.toLowerCase(),
              text: c.content,
            }));
          } catch (err) {
            console.error(`Failed to fetch data for post ${apiPost.id}:`, err);
          }

          return {
            id: apiPost.id.toString(),
            username: `${apiPost.user?.first_Name || ""}_${
              apiPost.user?.last_Name || ""
            }`.toLowerCase(),
            userAvatar:
              apiPost.user?.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
            imageUrl: apiPost.thumbnail,
            caption: apiPost.description,
            title: apiPost.title,
            likes: likesCount,
            comments,
            timestamp: new Date(apiPost.created_at),
            isLiked,
            isSaved: false,
          };
        })
      );
      setPosts(transformedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsWithData();
  }, []);

  const handleLikePost = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Optimistic update
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );

    try {
      if (post.isLiked) {
        await unlikePost(Number(postId));
      } else {
        await likePost(Number(postId));
      }
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
      // Revert on error
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                isLiked: post.isLiked,
                likes: post.likes,
              }
            : p
        )
      );
    }
  };

  const handleSavePost = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const handleAddComment = async (postId: string, text: string) => {
    // Get current user info
    const userDataStr = localStorage.getItem("user_data");
    const userData = userDataStr ? JSON.parse(userDataStr) : null;
    const username = userData
      ? `${userData.first_name || ""}_${userData.last_name || ""}`.toLowerCase()
      : "you";

    // Optimistic update
    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      username,
      text,
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, tempComment] }
          : post
      )
    );

    try {
      const newComment = await createComment(Number(postId), text);
      // Replace temp comment with real one
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((c) =>
                  c.id === tempComment.id
                    ? {
                        id: newComment.id.toString(),
                        username: `${newComment.user?.first_Name || ""}_${
                          newComment.user?.last_Name || ""
                        }`.toLowerCase(),
                        text: newComment.content,
                      }
                    : c
                ),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Remove temp comment on error
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter((c) => c.id !== tempComment.id),
              }
            : post
        )
      );
    }
  };

  const handleCreateSuccess = async () => {
    await fetchPostsWithData();
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar - Fixed on desktop */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onCreatePost={() => setShowCreateModal(true)}
      />

      {/* Main Content - Fixed to viewport */}
      <div className="fixed inset-0 lg:left-64 bg-white flex flex-col">
        {/* Mobile Header - Only on mobile, only for home view */}
        {activeView === "home" && (
          <MobileHeader onCreatePost={() => setShowCreateModal(true)} />
        )}

        {activeView === "home" ? (
          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-center gap-8 pt-4 lg:pt-8 px-4 pb-20 lg:pb-8">
              {/* Feed */}
              <div className="w-full max-w-[470px]">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                ) : (
                  <Feed
                    posts={posts}
                    onLikePost={handleLikePost}
                    onSavePost={handleSavePost}
                    onAddComment={handleAddComment}
                  />
                )}
              </div>

              {/* Right Panel - Hidden on smaller screens */}
              <div className="hidden xl:block w-80 sticky top-8 h-fit">
                <RightPanel />
              </div>
            </div>
          </div>
        ) : (
          <DirectMessages />
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
