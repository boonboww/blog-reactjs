import React, { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import requestApi from "../../../helpers/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/globalLoadingSlice";
import type { AppDispatch } from "../../../redux/store";

interface UpdateUserData {
  first_Name?: string;
  last_Name?: string;
  status?: number;
}

interface UserData {
  id: number;
  first_Name: string;
  last_Name: string;
  email: string;
  status: number;
}

const EditUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<UpdateUserData>({
    first_Name: "",
    last_Name: "",
    status: 1,
  });

  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<Partial<UpdateUserData>>({});
  const [loading, setLoadingState] = useState<boolean>(true);

  // Load user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        const response = await requestApi(`/users/${id}`, "GET", []);
        const userData: UserData = response.data;

        setFormData({
          first_Name: userData.first_Name,
          last_Name: userData.last_Name,
          status: userData.status,
        });
        setEmail(userData.email);
        setLoadingState(false);
      } catch (error) {
        console.error("Fetch user error:", error);
        toast.error("Failed to load user data");
        navigate("/admin/users");
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, navigate, dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateUserData> = {};

    if (!formData.first_Name?.trim()) {
      newErrors.first_Name = "First name is required";
    }

    if (!formData.last_Name?.trim()) {
      newErrors.last_Name = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
    // Clear error when user types
    if (errors[name as keyof UpdateUserData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(setLoading(true));
      await requestApi(`/users/${id}`, "PUT", formData);
      toast.success("User updated successfully!");
      navigate("/admin/users");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Update user error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update user. Please try again."
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCancel = () => {
    navigate("/admin/users");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600 mt-1">
            Update user information by modifying the form below.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* First Name */}
            <div>
              <label
                htmlFor="first_Name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="first_Name"
                name="first_Name"
                value={formData.first_Name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.first_Name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter first name"
              />
              {errors.first_Name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_Name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="last_Name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="last_Name"
                name="last_Name"
                value={formData.last_Name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.last_Name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter last name"
              />
              {errors.last_Name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_Name}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Update User
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
