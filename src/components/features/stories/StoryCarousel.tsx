import type { Story } from "../../../types";
import { Plus } from "lucide-react";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

interface StoryCarouselProps {
  stories: Story[];
}

export function StoryCarousel({ stories }: StoryCarouselProps) {
  return (
    <div className="bg-white border rounded-lg p-4 overflow-x-auto">
      <div className="flex gap-4">
        {stories.map((story, index) => (
          <button
            key={story.id}
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div
              className={`relative ${index === 0 ? "w-16 h-16" : "w-16 h-16"}`}
            >
              <div
                className={`w-full h-full rounded-full ${
                  !story.isViewed && index !== 0
                    ? "bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]"
                    : "bg-gray-200 p-[2px]"
                }`}
              >
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                  <ImageWithFallback
                    src={story.userAvatar}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              {index === 0 && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs max-w-[70px] truncate">
              {story.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
