import { useState, useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { userService } from "../../../services/user.service";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  onUpdate: () => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdate,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(currentUser.first_name || "");
  const [lastName, setLastName] = useState(currentUser.last_name || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (isOpen) {
      setFirstName(currentUser.first_name || "");
      setLastName(currentUser.last_name || "");
      setAvatarPreview(null);
      setAvatarFile(null);
      setError(null);
    }
  }, [isOpen, currentUser]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        setError("Chỉ chấp nhận file JPG, JPEG hoặc PNG");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước file tối đa là 5MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Vui lòng nhập đầy đủ họ và tên");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload avatar if changed
      if (avatarFile) {
        await userService.uploadAvatar(avatarFile);
      }

      // Update user info
      await userService.updateUser(currentUser.id, {
        first_Name: firstName.trim(),
        last_Name: lastName.trim(),
      });

      // Fetch updated user data from backend to get new avatar path
      const updatedUser = await userService.getUserById(currentUser.id);

      // Update local storage with new data
      const userDataStr = localStorage.getItem("user_data");
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userData.first_name = firstName.trim();
        userData.last_name = lastName.trim();
        // Update avatar if backend returned new path
        if (updatedUser?.avatar) {
          userData.avatar = updatedUser.avatar;
        }
        localStorage.setItem("user_data", JSON.stringify(userData));
      }

      onUpdate();
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Encode URL for img src - handle spaces in filename
  const encodeUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const encodedPath = urlObj.pathname
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
      return `${urlObj.origin}${encodedPath}`;
    } catch {
      return url;
    }
  };

  const currentAvatarUrl = currentUser.avatar
    ? encodeUrl(`${API_URL}/${currentUser.avatar}`)
    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button
            onClick={onClose}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Hủy
          </button>
          <h2 className="text-base font-semibold">Chỉnh sửa trang cá nhân</h2>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="text-sm font-semibold text-blue-500 hover:text-blue-600 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Xong"}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <img
                src={avatarPreview || currentAvatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-semibold text-blue-500 hover:text-blue-600"
            >
              Thay đổi ảnh đại diện
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nhập họ của bạn"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-sm text-gray-600">Đang cập nhật...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
