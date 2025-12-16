import axios, { type AxiosResponse } from "axios";
import type {
  SendFriendRequestDto,
  RespondFriendRequestDto,
  GetFriendsDto,
  GetFriendsResponse,
  FriendRequest,
  FriendshipStatusResponse,
  UserEntity,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * FriendService - Service for managing friend-related API calls
 * Handles friend requests, friendships, blocking, and status checks
 */
class FriendService {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token"); // FIX: Changed from 'token' to 'access_token'
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Send a friend request to another user
   * @param addresseeId - The ID of the user to send request to
   */
  async sendFriendRequest(addresseeId: number): Promise<AxiosResponse> {
    const dto: SendFriendRequestDto = { addresseeId };
    return await axios.post(
      `${API_URL}/friend/request`,
      dto,
      this.getAuthHeaders()
    );
  }

  /**
   * Respond to a friend request (accept or reject)
   * @param friendshipId - The friendship ID
   * @param action - 'accept' or 'reject'
   */
  async respondToFriendRequest(
    friendshipId: number,
    action: "accept" | "reject"
  ): Promise<AxiosResponse> {
    const dto: RespondFriendRequestDto = { friendshipId, action };
    return await axios.post(
      `${API_URL}/friend/respond`,
      dto,
      this.getAuthHeaders()
    );
  }

  /**
   * Get list of friends with pagination and search
   * @param query - Query parameters (page, limit, search)
   */
  async getFriends(query: GetFriendsDto = {}): Promise<GetFriendsResponse> {
    console.log(
      "🔍 [Friend Service] Calling GET /friend/list with query:",
      query
    );
    console.log(
      "🔑 [Friend Service] Token:",
      localStorage.getItem("token") ? "EXISTS" : "MISSING!"
    );
    console.log(
      "🔑 [Friend Service] access_token:",
      localStorage.getItem("access_token") ? "EXISTS" : "MISSING"
    );

    const response = await axios.get<GetFriendsResponse>(
      `${API_URL}/friend/list`,
      {
        params: query,
        ...this.getAuthHeaders(),
      }
    );

    console.log("✅ [Friend Service] Response:", response.data);
    return response.data;
  }

  /**
   * Get list of pending friend requests (incoming)
   */
  async getPendingRequests(): Promise<FriendRequest[]> {
    const response = await axios.get<FriendRequest[]>(
      `${API_URL}/friend/pending`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Check friendship status with another user
   * @param userId - The ID of the user to check status with
   */
  async checkFriendshipStatus(
    userId: number
  ): Promise<FriendshipStatusResponse> {
    const response = await axios.get<FriendshipStatusResponse>(
      `${API_URL}/friend/status/${userId}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  /**
   * Unfriend a user
   * @param friendId - The ID of the friend to remove
   */
  async unfriend(friendId: number): Promise<AxiosResponse> {
    return await axios.delete(
      `${API_URL}/friend/${friendId}`,
      this.getAuthHeaders()
    );
  }

  /**
   * Block a user
   * @param userId - The ID of the user to block
   */
  async blockUser(userId: number): Promise<AxiosResponse> {
    return await axios.post(
      `${API_URL}/friend/block/${userId}`,
      {},
      this.getAuthHeaders()
    );
  }

  /**
   * Get friends by user ID with pagination and search
   * @param userId - The ID of the user to get friends for
   * @param query - Query parameters (page, limit, search)
   */
  async getFriendsByUserId(
    userId: number,
    query: GetFriendsDto = {}
  ): Promise<GetFriendsResponse> {
    const response = await axios.get<GetFriendsResponse>(
      `${API_URL}/friend/user/${userId}`,
      {
        params: query,
        ...this.getAuthHeaders(),
      }
    );
    return response.data;
  }
  /**
   * Get suggested friends (users not yet friends)
   */
  async getSuggestedFriends(): Promise<UserEntity[]> {
    const response = await axios.get(
      `${API_URL}/friend/suggested`,
      this.getAuthHeaders()
    );
    return response.data;
  }
}

// Export singleton instance
export const friendService = new FriendService();
