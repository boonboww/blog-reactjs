import { ImageWithFallback } from "../shared/ImageWithFallback";

interface Suggestion {
  username: string;
  avatar: string;
  subtitle: string;
}

export function RightPanel() {
  const suggestions: Suggestion[] = [
    {
      username: "travel_explorer",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
      subtitle: "Được đề xuất cho bạn",
    },
    {
      username: "photo_artist",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      subtitle: "Được đề xuất cho bạn",
    },
    {
      username: "fitness_life",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
      subtitle: "Được đề xuất cho bạn",
    },
    {
      username: "music_beats",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
      subtitle: "Được đề xuất cho bạn",
    },
    {
      username: "fashion_style",
      avatar:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&q=80",
      subtitle: "Được đề xuất cho bạn",
    },
  ];

  return (
    <div className="sticky top-8 pt-8">
      {/* User Profile */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80"
            alt="Your profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-sm">your_username</div>
            <div className="text-gray-500 text-sm">Tên của bạn</div>
          </div>
        </div>
        <button className="text-blue-500 text-xs font-semibold hover:text-blue-700">
          Chuyển
        </button>
      </div>

      {/* Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 text-sm font-semibold">
            Gợi ý cho bạn
          </span>
          <button className="text-xs hover:text-gray-500">Xem tất cả</button>
        </div>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={suggestion.avatar}
                  alt={suggestion.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-sm">
                    {suggestion.username}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {suggestion.subtitle}
                  </div>
                </div>
              </div>
              <button className="text-blue-500 text-xs font-semibold hover:text-blue-700">
                Theo dõi
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-400 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">
            Giới thiệu
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Trợ giúp
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Báo chí
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            API
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Việc làm
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Quyền riêng tư
          </a>
        </div>
        <div>© 2024 INSTAGRAM FROM META</div>
      </div>
    </div>
  );
}
