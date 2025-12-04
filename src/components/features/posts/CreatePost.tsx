import { useState } from "react";
import type { BlogPost } from "../../../types";
import { Send, Image as ImageIcon } from "lucide-react";

interface CreatePostProps {
  onSubmit: (post: Omit<BlogPost, "id" | "date">) => void;
}

export function CreatePost({ onSubmit }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !author.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bài viết");
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      imageUrl: imageUrl.trim() || undefined,
    });

    // Reset form
    setTitle("");
    setContent("");
    setAuthor("");
    setImageUrl("");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-8">
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 text-gray-700">
            Tiêu đề bài viết <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề hấp dẫn..."
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="author" className="block mb-2 text-gray-700">
            Tác giả <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Tên của bạn..."
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block mb-2 text-gray-700">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết nội dung bài viết của bạn..."
            rows={8}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="imageUrl"
            className="block mb-2 text-gray-700 flex items-center gap-2"
          >
            <ImageIcon className="w-5 h-5" />
            URL hình ảnh (không bắt buộc)
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imageUrl && (
            <div className="mt-4 rounded-lg overflow-hidden border">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Đăng bài
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setContent("");
              setAuthor("");
              setImageUrl("");
            }}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Xóa
          </button>
        </div>
      </form>
    </div>
  );
}
