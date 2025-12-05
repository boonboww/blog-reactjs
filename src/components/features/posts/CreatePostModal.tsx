import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../../shared/ImageWithFallback";
import type { CategoryEntity } from "../../../types";

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (postData: {
    title: string;
    description: string;
    thumbnail: string;
    status: number;
    category: CategoryEntity;
  }) => void;
  categories: CategoryEntity[];
}

export function CreatePostModal({
  onClose,
  onSubmit,
  categories,
}: CreatePostModalProps) {
  const [step, setStep] = useState<"select" | "create">("select");
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryEntity | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    thumbnail?: string;
    category?: string;
  }>({});

  const handleImageUrlChange = (url: string) => {
    setThumbnail(url);
    setErrors({ ...errors, thumbnail: "" });
  };

  const handleNext = () => {
    if (!thumbnail.trim()) {
      setErrors({ thumbnail: "Vui lòng nhập URL hình ảnh" });
      return;
    }
    setStep("create");
  };

  const validateAndSubmit = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    }

    if (!description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    if (!selectedCategory) {
      newErrors.category = "Vui lòng chọn danh mục";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && selectedCategory) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        thumbnail: thumbnail.trim(),
        status,
        category: selectedCategory,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button
            onClick={step === "create" ? () => setStep("select") : onClose}
            className="p-2 -ml-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h2 className="font-semibold">
            {step === "select" ? "Tạo bài viết mới" : "Tạo bài viết mới"}
          </h2>

          {step === "select" ? (
            <button
              onClick={handleNext}
              className="text-blue-500 font-semibold hover:text-blue-700"
            >
              Tiếp
            </button>
          ) : (
            <button
              onClick={validateAndSubmit}
              className="text-blue-500 font-semibold hover:text-blue-700"
            >
              Chia sẻ
            </button>
          )}
        </div>

        {/* Content */}
        {step === "select" ? (
          // Select Image Step
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="text-center max-w-md">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <svg
                    aria-label="Icon to represent media such as images or videos"
                    className="w-24 h-24"
                    fill="currentColor"
                    height="77"
                    role="img"
                    viewBox="0 0 97.6 77.3"
                    width="96"
                  >
                    <path
                      d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                      fill="currentColor"
                    />
                    <path
                      d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                      fill="currentColor"
                    />
                    <path
                      d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="text-xl mb-3">Kéo ảnh vào đây</h3>
              </div>

              <div className="space-y-4">
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="Hoặc dán URL hình ảnh"
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:border-gray-400 text-sm ${
                    errors.thumbnail ? "border-red-500" : ""
                  }`}
                />
                {errors.thumbnail && (
                  <p className="text-red-500 text-sm">{errors.thumbnail}</p>
                )}

                {thumbnail && (
                  <div className="mt-4 rounded-lg overflow-hidden border max-h-64">
                    <ImageWithFallback
                      src={thumbnail}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Create Post Step - Instagram Style
          <div className="flex flex-1 overflow-hidden">
            {/* Left Side - Image Preview */}
            <div className="w-3/5 bg-black flex items-center justify-center">
              <ImageWithFallback
                src={thumbnail}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Right Side - Form */}
            <div className="w-2/5 flex flex-col">
              {/* User Info */}
              <div className="flex items-center gap-3 p-4 border-b">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80"
                  alt="Your profile"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="font-semibold text-sm">your_username</span>
              </div>

              {/* Form Fields */}
              <div className="flex-1 overflow-y-auto">
                {/* Title */}
                <div className="px-4 py-3 border-b">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrors({ ...errors, title: "" });
                    }}
                    placeholder="Tiêu đề *"
                    className="w-full outline-none text-sm"
                    maxLength={200}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div className="px-4 py-3 border-b">
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors({ ...errors, description: "" });
                    }}
                    placeholder="Viết chú thích *"
                    className="w-full outline-none resize-none text-sm"
                    rows={6}
                    maxLength={2200}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description && (
                      <p className="text-red-500 text-xs">
                        {errors.description}
                      </p>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {description.length}/2,200
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div className="px-4 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Danh mục *</span>
                    <select
                      value={selectedCategory?.id || ""}
                      onChange={(e) => {
                        const category = categories.find(
                          (c) => c.id === Number(e.target.value)
                        );
                        setSelectedCategory(category || null);
                        setErrors({ ...errors, category: "" });
                      }}
                      className="text-sm text-gray-600 outline-none bg-transparent cursor-pointer"
                    >
                      <option value="">Chọn</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="px-4 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trạng thái</span>
                    <select
                      value={status}
                      onChange={(e) => setStatus(Number(e.target.value))}
                      className="text-sm text-gray-600 outline-none bg-transparent cursor-pointer"
                    >
                      <option value={0}>Nháp</option>
                      <option value={1}>Công khai</option>
                      <option value={2}>Riêng tư</option>
                    </select>
                  </div>
                </div>

                {/* Additional Instagram-style options placeholders */}
                <button className="w-full px-4 py-3 border-b flex items-center justify-between text-sm hover:bg-gray-50">
                  <span>Thêm vị trí</span>
                  <svg
                    aria-label="Chevron"
                    className="w-3 h-3"
                    fill="currentColor"
                    height="16"
                    role="img"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" />
                  </svg>
                </button>

                <button className="w-full px-4 py-3 border-b flex items-center justify-between text-sm hover:bg-gray-50">
                  <span>Cài đặt nâng cao</span>
                  <svg
                    aria-label="Chevron"
                    className="w-3 h-3"
                    fill="currentColor"
                    height="16"
                    role="img"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
