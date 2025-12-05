import { useState, useEffect, useCallback } from "react";
import { friendService } from "../services/friend.service";
import { FriendshipStatus, type FriendshipStatusResponse } from "../types";

/**
 * Custom hook to check friendship status with another user
 * Returns status, loading state, and refresh function
 */
export function useFriendshipStatus(userId: number | null) {
  const [status, setStatus] = useState<FriendshipStatus | null>(null);
  const [friendshipId, setFriendshipId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (!userId) {
      setStatus(null);
      setFriendshipId(null);
      return;
    }

    try {
      setLoading(true);
      const response: FriendshipStatusResponse =
        await friendService.checkFriendshipStatus(userId);
      setStatus(response.status);
      setFriendshipId(response.friendshipId || null);
      setError(null);
    } catch (err) {
      console.error("Error checking friendship status:", err);
      setError("Failed to check friendship status");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const isFriend = status === FriendshipStatus.ACCEPTED;
  const isPending = status === FriendshipStatus.PENDING;
  const isBlocked = status === FriendshipStatus.BLOCKED;

  return {
    status,
    friendshipId,
    isFriend,
    isPending,
    isBlocked,
    loading,
    error,
    refresh: checkStatus,
  };
}
