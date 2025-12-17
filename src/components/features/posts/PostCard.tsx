import { useState, useRef } from "react";
import type { Post } from "../../../types";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { ImageWithFallback } from "../../shared/ImageWithFallback";
import { CommentModal } from "./CommentModal";
import { EmojiButton } from "../messaging/EmojiPicker";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export function PostCard({
  post,
  onLike,
  onSave,
  onAddComment,
}: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
    commentInputRef.current?.focus();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText("");
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    // Add 7 hours to compensate for backend timezone offset
    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const seconds = Math.floor((now.getTime() - adjustedDate.getTime()) / 1000);

    if (seconds < 0) return "now";
    if (seconds < 3600) return "now"; // Under 1 hour = show "now"
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    return `${Math.floor(seconds / 86400)} ngày trước`;
  };

  return (
    <article className="bg-white border rounded-lg overflow-hidden">
      {/* Header - Username + Time */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={post.userAvatar}
            alt={post.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{post.username}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 text-sm">
              {formatTimeAgo(post.timestamp)}
            </span>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Title */}
      {post.title && (
        <div className="px-3 pb-2 text-left">
          <h3 className="text-sm font-medium">{post.title}</h3>
        </div>
      )}

      {/* Image */}
      <div className="aspect-square bg-gray-100">
        <ImageWithFallback
          src={post.imageUrl}
          alt="Post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(post.id)}
              className="hover:opacity-50 transition-opacity"
            >
              <Heart
                className={`w-6 h-6 ${
                  post.isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
            <button
              onClick={() => setShowCommentModal(true)}
              className="hover:opacity-50 transition-opacity"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => onSave(post.id)}
            className="hover:opacity-50 transition-opacity"
          >
            <Bookmark
              className={`w-6 h-6 ${post.isSaved ? "fill-black" : ""}`}
            />
          </button>
        </div>

        {/* Likes - Left aligned */}
        <div className="mb-2 text-left">
          <span className="font-semibold text-sm">
            {post.likes.toLocaleString()} lượt thích
          </span>
        </div>

        {/* Caption - Left aligned */}
        <div className="mb-2 text-left">
          <span className="text-sm">{post.caption}</span>
        </div>

        {/* Comments Count - Click to open modal */}
        {post.comments.length > 0 ? (
          <button
            onClick={() => setShowCommentModal(true)}
            className="text-gray-500 text-sm mb-2 hover:text-gray-700"
          >
            Xem tất cả {post.comments.length} bình luận
          </button>
        ) : (
          <button
            onClick={() => setShowCommentModal(true)}
            className="text-gray-500 text-sm mb-2 hover:text-gray-700"
          >
            Thêm bình luận đầu tiên...
          </button>
        )}

        {/* Add Comment */}
        <form
          onSubmit={handleSubmitComment}
          className="flex items-center gap-2 pt-3 border-t"
        >
          <EmojiButton onEmojiSelect={handleEmojiSelect} />
          <input
            ref={commentInputRef}
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Thêm bình luận..."
            className="flex-1 outline-none text-sm"
          />
          {commentText.trim() && (
            <button
              type="submit"
              className="text-blue-500 font-semibold text-sm hover:text-blue-700"
            >
              Đăng
            </button>
          )}
        </form>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <CommentModal
          post={post}
          onClose={() => setShowCommentModal(false)}
          onAddComment={onAddComment}
          onLike={onLike}
        />
      )}
    </article>
  );
}
