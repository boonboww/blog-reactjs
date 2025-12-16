import axios from "axios";
import type { UserEntity } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface UpdateUserDto {
  first_Name?: string;
  last_Name?: string;
  status?: number;
}

/**
 * UserService - Service for managing user-related API calls
 */
class UserService {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Update user profile (name only, status defaults to 1)
   * @param userId - The ID of the user to update
   * @param data - The data to update (first_Name, last_Name)
   */
  async updateUser(userId: number, data: UpdateUserDto): Promise<void> {
    await axios.put(
      `${API_URL}/users/${userId}`,
      {
        ...data,
        status: 1, // Always set status to 1
      },
      this.getAuthHeaders()
    );
  }

  /**
   * Upload user avatar
   * @param file - The avatar file to upload
   */
  async uploadAvatar(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}/users/upload-avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      // Try to parse error message if available
      try {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload avatar");
      } catch {
        throw new Error("Failed to upload avatar");
      }
    }

    // Backend doesn't return JSON body, just success status
  }

  /**
   * Get user by ID
   * @param userId - The ID of the user to fetch
   */
  async getUserById(userId: number): Promise<UserEntity> {
    const response = await axios.get(
      `${API_URL}/users/${userId}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Get all users
   */
  async getUsers(
    params: { page?: number; items_per_page?: number; search?: string } = {}
  ): Promise<UserEntity[]> {
    const response = await axios.get(`${API_URL}/users`, {
      ...this.getAuthHeaders(),
      params,
    });
    return response.data;
  }
}

// Export singleton instance
export const userService = new UserService();
