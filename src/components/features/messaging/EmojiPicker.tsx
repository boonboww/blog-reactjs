import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";

// Common emoji categories
const EMOJI_CATEGORIES = {
  "Mặt cười": [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "🤣",
    "😂",
    "🙂",
    "😊",
    "😇",
    "🥰",
    "😍",
    "🤩",
    "😘",
    "😗",
    "😚",
    "😙",
    "🥲",
    "😋",
  ],
  "Cảm xúc": [
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
  ],
  "Yêu thích": [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "♥️",
  ],
  "Cử chỉ": [
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👋",
    "🤚",
    "🖐️",
    "✋",
    "🖖",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🙏",
    "✍️",
    "💪",
  ],
  "Hoạt động": [
    "🎉",
    "🎊",
    "🎁",
    "🎈",
    "🎄",
    "🎃",
    "🔥",
    "⭐",
    "🌟",
    "💫",
    "✨",
    "💥",
    "💯",
    "🎯",
    "🏆",
    "🥇",
    "🏅",
    "🎖️",
    "🌈",
    "☀️",
  ],
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

/**
 * Simple Emoji Picker Component
 */
export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Mặt cười");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 w-72 overflow-hidden z-50"
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-semibold text-gray-600">Chọn emoji</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === category
                ? "text-blue-500 border-b-2 border-blue-500 bg-blue-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="p-2 max-h-48 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {EMOJI_CATEGORIES[
            activeCategory as keyof typeof EMOJI_CATEGORIES
          ].map((emoji, index) => (
            <button
              key={index}
              onClick={() => {
                onEmojiSelect(emoji);
              }}
              className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface EmojiButtonProps {
  onEmojiSelect: (emoji: string) => void;
}

/**
 * Emoji Button with Picker
 */
export function EmojiButton({ onEmojiSelect }: EmojiButtonProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Smile className="w-6 h-6 stroke-[1.5]" />
      </button>

      {showPicker && (
        <EmojiPicker
          onEmojiSelect={(emoji) => {
            onEmojiSelect(emoji);
            // Không đóng picker - người dùng có thể chọn nhiều emoji
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
