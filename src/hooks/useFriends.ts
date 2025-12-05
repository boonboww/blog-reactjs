import { useState, useEffect, useCallback } from "react";
import { friendService } from "../services/friend.service";
import { socketService } from "../services/socket.service";
import type { Friend, GetFriendsDto, UnfriendedEvent } from "../types";

/**
 * Custom hook for managing friends list
 * Provides friends, pagination, search, unfriend action, and real-time updates
 */
export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch friends
  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      console.log("📋 [useFriends] Fetching friends...");
      const query: GetFriendsDto = {
        page,
        limit,
        search: search || undefined,
      };
      const response = await friendService.getFriends(query);
      console.log("📋 [useFriends] Got response:", response);
      console.log("📋 [useFriends] Friends data:", response.data);
      console.log("📋 [useFriends] Total:", response.total);
      setFriends(response.data);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      setError("Failed to fetch friends");
      console.error("❌ [useFriends] Error fetching friends:", err);
      console.error(
        "❌ [useFriends] Error details:",
        JSON.stringify(err, null, 2)
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  // Unfriend action
  const unfriend = useCallback(async (friendId: number) => {
    try {
      await friendService.unfriend(friendId);
      // Remove from list
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
      setTotal((prev) => prev - 1);
      return true;
    } catch (err) {
      console.error("Error unfriending user:", err);
      setError("Failed to unfriend user");
      return false;
    }
  }, []);

  // Setup real-time listener for unfriend events
  useEffect(() => {
    const cleanup = socketService.onUnfriended((data: UnfriendedEvent) => {
      console.log("💔 Unfriended by user:", data);
      // Remove from friends list
      setFriends((prev) => prev.filter((friend) => friend.id !== data.userId));
      setTotal((prev) => prev - 1);
    });

    return cleanup;
  }, []);

  // Setup real-time listener for accepted requests (new friends)
  useEffect(() => {
    const cleanup = socketService.onFriendRequestAccepted((data) => {
      console.log("✅ Friend request accepted:", data);
      // Refresh friends list to include new friend
      fetchFriends();
    });

    return cleanup;
  }, [fetchFriends]);

  // Fetch on mount or when dependencies change
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return {
    friends,
    total,
    page,
    limit,
    search,
    loading,
    error,
    setPage,
    setSearch,
    unfriend,
    refresh: fetchFriends,
  };
}
