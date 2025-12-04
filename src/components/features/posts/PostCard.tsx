import { useState } from "react";
import type { Post } from "../../../types";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
} from "lucide-react";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

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
  const [showAllComments, setShowAllComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText("");
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} giây trước`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    return `${Math.floor(seconds / 86400)} ngày trước`;
  };

  return (
    <article className="bg-white border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={post.userAvatar}
            alt={post.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-sm">{post.username}</span>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

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
            <button className="hover:opacity-50 transition-opacity">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="hover:opacity-50 transition-opacity">
              <Send className="w-6 h-6" />
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

        {/* Likes */}
        <div className="mb-2">
          <span className="font-semibold text-sm">
            {post.likes.toLocaleString()} lượt thích
          </span>
        </div>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-sm mr-2">{post.username}</span>
          <span className="text-sm">{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="mb-2">
            {!showAllComments && post.comments.length > 2 && (
              <button
                onClick={() => setShowAllComments(true)}
                className="text-gray-500 text-sm mb-2"
              >
                Xem tất cả {post.comments.length} bình luận
              </button>
            )}
            <div className="space-y-1">
              {(showAllComments
                ? post.comments
                : post.comments.slice(0, 2)
              ).map((comment) => (
                <div key={comment.id}>
                  <span className="font-semibold text-sm mr-2">
                    {comment.username}
                  </span>
                  <span className="text-sm">{comment.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-gray-500 text-xs mb-3">
          {formatTimeAgo(post.timestamp)}
        </div>

        {/* Add Comment */}
        <form
          onSubmit={handleSubmitComment}
          className="flex items-center gap-2 pt-3 border-t"
        >
          <button type="button" className="hover:opacity-50 transition-opacity">
            <Smile className="w-6 h-6" />
          </button>
          <input
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
    </article>
  );
}
