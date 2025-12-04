import type { BlogPost } from "../../../types";
import { Calendar, User, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

interface BlogPostProps {
  post: BlogPost;
  onDelete: (postId: string) => void;
}

export function BlogPost({ post, onDelete }: BlogPostProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <article className="bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-shadow group">
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <ImageWithFallback
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl mb-3 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.date)}</span>
            </div>
          </div>

          <button
            onClick={() => onDelete(post.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Xóa bài viết"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
