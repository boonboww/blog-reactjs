import { useState } from "react";
import { X, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../../shared/ImageWithFallback";

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (imageUrl: string, caption: string) => void;
}

export function CreatePostModal({ onClose, onSubmit }: CreatePostModalProps) {
  const [step, setStep] = useState<"upload" | "caption">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewImage(url);
  };

  const handleNext = () => {
    if (imageUrl.trim()) {
      setStep("caption");
    }
  };

  const handleSubmit = () => {
    if (imageUrl.trim()) {
      onSubmit(imageUrl, caption);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {step === "caption" && (
            <button
              onClick={() => setStep("upload")}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h2
            className={`text-lg flex-1 text-center ${
              step === "upload" ? "" : "-ml-8"
            }`}
          >
            Tạo bài viết mới
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === "upload" ? (
            <div className="p-8">
              <div className="text-center mb-8">
                <ImageIcon className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl mb-2">Chọn ảnh để đăng</h3>
                <p className="text-gray-500">Nhập URL hình ảnh của bạn</p>
              </div>

              <div className="space-y-4">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:border-gray-400"
                />

                {previewImage && (
                  <div className="aspect-square rounded-lg overflow-hidden border">
                    <ImageWithFallback
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <button
                  onClick={handleNext}
                  disabled={!imageUrl.trim()}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              {/* Image Preview */}
              <div className="md:w-1/2 aspect-square bg-black">
                <ImageWithFallback
                  src={imageUrl}
                  alt="Post preview"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Caption */}
              <div className="md:w-1/2 p-4 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80"
                    alt="Your profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-semibold">your_username</span>
                </div>

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Viết chú thích..."
                  className="flex-1 outline-none resize-none text-sm"
                  maxLength={2200}
                />

                <div className="text-xs text-gray-500 mb-4">
                  {caption.length}/2,200
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Chia sẻ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
