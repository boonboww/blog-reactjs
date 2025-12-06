import { useState, useRef, useEffect } from "react";
import type { Post } from "../../../types";
import { X, Heart, MoreHorizontal, Smile } from "lucide-react";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

interface CommentModalProps {
  post: Post;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
  onLike: (postId: string) => void;
}

export function CommentModal({
  post,
  onClose,
  onAddComment,
}: CommentModalProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus input when modal opens
    inputRef.current?.focus();
    // Scroll to bottom of comments
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [post.comments.length]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAddComment(post.id, commentText);
        setCommentText("");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}w`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-5xl h-[90vh] max-h-[600px] flex rounded-lg overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:opacity-70 transition-opacity"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side - Image */}
        <div className="w-[55%] bg-black flex items-center justify-center">
          <ImageWithFallback
            src={post.imageUrl}
            alt="Post"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side - Comments */}
        <div className="w-[45%] flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={post.userAvatar}
                alt={post.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold text-sm">{post.username}</span>
            </div>
            <button className="hover:opacity-50 transition-opacity">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Caption */}
            <div className="flex gap-3 mb-4">
              <ImageWithFallback
                src={post.userAvatar}
                alt={post.username}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div>
                <div className="text-sm">
                  <span className="font-semibold mr-2">{post.username}</span>
                  <span>{post.caption}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(post.timestamp)}
                </p>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-2xl font-bold mb-2">
                  Chưa có bình luận nào.
                </p>
                <p className="text-sm text-gray-500">Bắt đầu trò chuyện.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-gray-500">
                        {comment.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-semibold mr-2">
                          {comment.username}
                        </span>
                        <span>{comment.text}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">vừa xong</span>
                        <button className="text-xs text-gray-500 font-semibold hover:text-gray-900">
                          Thích
                        </button>
                        <button className="text-xs text-gray-500 font-semibold hover:text-gray-900">
                          Trả lời
                        </button>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-3 h-3 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t p-4">
            {/* <div className="flex items-center justify-between mb-3">
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
                  onClick={() => inputRef.current?.focus()}
                  className="hover:opacity-50 transition-opacity"
                >
                  <Send className="w-6 h-6 rotate-[-30deg]" />
                </button>
              </div>
              <button className="hover:opacity-50 transition-opacity">
                <Bookmark
                  className={`w-6 h-6 ${post.isSaved ? "fill-black" : ""}`}
                />
              </button>
            </div> */}

            {/* Likes
            <div className="mb-2">
              <span className="font-semibold text-sm">
                {post.likes.toLocaleString()} lượt thích
              </span>
            </div> */}

            {/* Add Comment Form */}
            <form
              onSubmit={handleSubmitComment}
              className="flex items-center gap-3 pt-3 border-t"
            >
              <button
                type="button"
                className="hover:opacity-50 transition-opacity"
              >
                <Smile className="w-6 h-6" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Thêm bình luận..."
                className="flex-1 outline-none text-sm"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
                className="text-blue-500 font-semibold text-sm hover:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "..." : "Đăng"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
