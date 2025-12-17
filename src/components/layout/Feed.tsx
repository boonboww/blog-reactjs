import type { Post } from "../../types";
import { PostCard } from "../features/posts/PostCard";

interface FeedProps {
  posts: Post[];
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export function Feed({
  posts,
  onLikePost,
  onSavePost,
  onAddComment,
}: FeedProps) {
  return (
    <div className="pb-20 lg:pb-8">
      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={onLikePost}
            onSave={onSavePost}
            onAddComment={onAddComment}
          />
        ))}
      </div>
    </div>
  );
}
