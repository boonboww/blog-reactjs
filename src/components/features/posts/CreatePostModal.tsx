import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { createPost } from "../../../services/post.service";
import { toast } from "react-toastify";

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    thumbnail?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setErrors({
          ...errors,
          thumbnail: "Chỉ chấp nhận file JPG, JPEG, PNG",
        });
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, thumbnail: "File không được lớn hơn 5MB" });
        return;
      }

      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors({ ...errors, thumbnail: "" });
    }
  };

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    if (!thumbnail) {
      newErrors.thumbnail = "Vui lòng chọn hình ảnh";
    }
    if (!title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    }
    if (!description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && thumbnail) {
      setLoading(true);
      try {
        await createPost({
          title: title.trim(),
          description: description.trim(),
          thumbnail,
          status,
        });
        toast.success("Đăng bài thành công!");
        onSuccess?.();
        onClose();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || "Đăng bài thất bại");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-base font-semibold">Tạo bài viết mới</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Image Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
              thumbnailPreview
                ? "border-transparent"
                : errors.thumbnail
                ? "border-red-300 bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => !thumbnailPreview && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />

            {thumbnailPreview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setThumbnail(null);
                    setThumbnailPreview("");
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Nhấp để chọn ảnh
                </p>
                <p className="text-xs text-gray-400">
                  JPG, JPEG, PNG (tối đa 5MB)
                </p>
                {errors.thumbnail && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.thumbnail}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: "" });
              }}
              placeholder="Tiêu đề *"
              className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                errors.title
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-blue-400"
              }`}
              maxLength={200}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: "" });
              }}
              placeholder="Viết mô tả cho bài viết... *"
              className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none resize-none transition-colors ${
                errors.description
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-blue-400"
              }`}
              rows={3}
              maxLength={2200}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              {errors.description ? (
                <p className="text-red-500">{errors.description}</p>
              ) : (
                <span />
              )}
              <span>{description.length}/2,200</span>
            </div>
          </div>

          {/* Status Select */}
          <div className="flex gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none bg-white cursor-pointer hover:border-gray-300"
            >
              <option value={1}>Công khai</option>
              <option value={0}>Nháp</option>
              <option value={2}>Riêng tư</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 bg-[#0095f6] hover:bg-[#1877f2] disabled:bg-blue-300 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang đăng...
              </>
            ) : (
              "Chia sẻ"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
