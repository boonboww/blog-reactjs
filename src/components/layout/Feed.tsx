import type { Post, Story } from "../../types";
import { StoryCarousel } from "../features/stories/StoryCarousel";
import { PostCard } from "../features/posts/PostCard";

interface FeedProps {
  posts: Post[];
  stories: Story[];
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export function Feed({
  posts,
  stories,
  onLikePost,
  onSavePost,
  onAddComment,
}: FeedProps) {
  return (
    <div className="pb-20 lg:pb-8">
      {/* Stories */}
      <div className="mb-6">
        <StoryCarousel stories={stories} />
      </div>

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
