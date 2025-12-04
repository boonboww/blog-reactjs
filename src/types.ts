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
