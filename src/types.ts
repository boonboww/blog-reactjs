// Shared type definitions for the blog application

// Blog Post type - used for blog-style posts with title and content
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  imageUrl?: string;
}

// Instagram-style post type - used for social media feed
export interface Post {
  id: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: Comment[];
  timestamp: Date;
}

// Comment on a post
export interface Comment {
  id: string;
  username: string;
  text: string;
}

// Story type - Instagram-style stories
export interface Story {
  id: string;
  username: string;
  userAvatar: string;
  isViewed: boolean;
}

// Conversation type - for direct messages list
export interface Conversation {
  id: string;
  username: string;
  userAvatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

// Chat message type - individual messages in a conversation
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

// Message type - for messaging panel UI
export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

// Backend API Types for Post Management

// User entity as returned from backend
export interface UserEntity {
  id: number;
  first_Name: string;
  last_Name: string;
  email: string;
  avatar?: string;
}

// Category entity for posts
export interface CategoryEntity {
  id: number;
  name: string;
}

// Post entity as returned from backend API
export interface PostEntity {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  status: number;
  created_at: string;
  updated_at: string;
  user: UserEntity;
  category: CategoryEntity | null;
}

// Filter DTO for post queries
export interface FilterPostDto {
  items_per_page?: number;
  page?: number;
  search?: string;
  category?: number;
}

// ============================================
// Socket.IO Real-time Messaging Types
// ============================================

// Socket user connection info
export interface SocketUser {
  userId: string;
  socketId: string;
}

// Private message payload (1-1 chat)
export interface PrivateMessagePayload {
  toUserId: string;
  message: string;
}

// Private message received from server
export interface PrivateMessageReceived {
  from: string;
  message: string;
  id?: number | string; // Message ID from backend
  timestamp?: Date | string; // Timestamp from backend
}

// Group message payload
export interface GroupMessagePayload {
  room: string;
  message: string;
}

// Group message received from server
export interface GroupMessageReceived {
  from: string;
  message: string;
  room?: string;
}

// Room information
export interface RoomInfo {
  room: string;
  message: string;
}

// Chat room definition
export interface ChatRoom {
  id: string;
  name: string;
  members: string[];
  lastActivity?: Date;
}

// User joined/left events
export interface UserEvent {
  userId: string;
  message: string;
}

// Socket connection status
export type SocketStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

// Extended message type with socket metadata
export interface SocketMessage extends Message {
  senderId: string;
  recipientId?: string; // For private messages
  roomId?: string; // For group messages
}

// ============================================
// Friend System Types
// ============================================

// Friendship status enum matching backend
export enum FriendshipStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  BLOCKED = "blocked",
}

// Friend entity
export interface Friend {
  id: number;
  first_Name: string;
  last_Name: string;
  email: string;
  avatar?: string;
  friendshipId: number;
  friendsSince: Date;
}

// Friend request entity
export interface FriendRequest {
  friendshipId: number;
  requester: {
    id: number;
    first_Name: string;
    last_Name: string;
    email: string;
    avatar?: string;
  };
  createdAt: Date;
}

// Friendship status response
export interface FriendshipStatusResponse {
  status: FriendshipStatus | null;
  message?: string;
  friendshipId?: number;
  requester_id?: number;
  addressee_id?: number;
}

// DTOs for API calls
export interface SendFriendRequestDto {
  addresseeId: number;
}

export interface RespondFriendRequestDto {
  friendshipId: number;
  action: "accept" | "reject";
}

export interface GetFriendsDto {
  page?: number;
  limit?: number;
  search?: string;
}

// API Response types
export interface GetFriendsResponse {
  data: Friend[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Socket.IO friend notification events
export interface FriendRequestReceivedEvent {
  friendshipId: number;
  from: {
    id: number;
    first_Name: string;
    last_Name: string;
    email: string;
    avatar?: string;
  };
}

export interface FriendRequestAcceptedEvent {
  friendshipId: number;
  friend: {
    id: number;
    first_Name: string;
    last_Name: string;
    email: string;
    avatar?: string;
  };
}

export interface FriendRequestRejectedEvent {
  friendshipId: number;
  userId: number;
}

export interface UnfriendedEvent {
  userId: number;
  message: string;
}

export interface BlockedEvent {
  userId: number;
  message: string;
}
