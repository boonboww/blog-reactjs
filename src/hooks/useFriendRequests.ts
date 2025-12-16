import { useState, useEffect, useCallback } from "react";
import { friendService } from "../services/friend.service";
import { socketService } from "../services/socket.service";
import type { FriendRequest, FriendRequestReceivedEvent } from "../types";

/**
 * Custom hook for managing friend requests
 * Provides pending requests, accept/reject actions, and real-time updates
 */
export function useFriendRequests() {
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending requests
  const fetchPendingRequests = useCallback(async () => {
    try {
      setLoading(true);
      const requests = await friendService.getPendingRequests();
      setPendingRequests(requests);
      setError(null);
    } catch (err) {
      setError("Failed to fetch friend requests");
      console.error("Error fetching friend requests:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Accept friend request
  const acceptRequest = useCallback(async (friendshipId: number) => {
    try {
      await friendService.respondToFriendRequest(friendshipId, "accept");
      // Remove from pending list
      setPendingRequests((prev) =>
        prev.filter((req) => req.friendshipId !== friendshipId)
      );
      return true;
    } catch (err) {
      console.error("Error accepting friend request:", err);
      setError("Failed to accept friend request");
      return false;
    }
  }, []);

  // Reject friend request
  const rejectRequest = useCallback(async (friendshipId: number) => {
    try {
      await friendService.respondToFriendRequest(friendshipId, "reject");
      // Remove from pending list
      setPendingRequests((prev) =>
        prev.filter((req) => req.friendshipId !== friendshipId)
      );
      return true;
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      setError("Failed to reject friend request");
      return false;
    }
  }, []);

  // Setup real-time listener for new friend requests
  useEffect(() => {
    const cleanup = socketService.onFriendRequestReceived(
      (data: FriendRequestReceivedEvent) => {
        console.log("📬 New friend request received:", data);
        // Add new request to list
        const newRequest: FriendRequest = {
          friendshipId: data.friendshipId,
          requester: data.from,
          createdAt: new Date(),
        };
        setPendingRequests((prev) => [newRequest, ...prev]);
        // Note: Toast notification is handled by useNotifications hook globally
      }
    );

    return cleanup;
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  return {
    pendingRequests,
    pendingCount: pendingRequests.length,
    loading,
    error,
    acceptRequest,
    rejectRequest,
    refresh: fetchPendingRequests,
  };
}
