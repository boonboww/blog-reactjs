import requestApi from "../helpers/api";

export interface CreatePostPayload {
  title: string;
  description: string;
  thumbnail: File;
  status: number;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  status: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_Name: string;
    last_Name: string;
    email: string;
    avatar?: string;
  };
}

export interface PostListResponse {
  data: Post[];
  total: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

/**
 * Create a new post with file upload
 */
export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("thumbnail", payload.thumbnail);
  formData.append("status", payload.status.toString());

  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/posts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create post");
  }

  return response.json();
}

/**
 * Get all posts with pagination
 */
export async function getPosts(params?: {
  page?: number;
  items_per_page?: number;
  search?: string;
  category?: number;
}): Promise<PostListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.items_per_page)
    queryParams.append("items_per_page", params.items_per_page.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.category)
    queryParams.append("category", params.category.toString());

  const response = await requestApi(
    `/posts?${queryParams.toString()}`,
    "GET",
    []
  );
  return response.data;
}

/**
 * Get a single post by ID
 */
export async function getPostById(id: number): Promise<Post> {
  const response = await requestApi(`/posts/${id}`, "GET", []);
  return response.data;
}

/**
 * Delete a post
 */
export async function deletePost(id: number): Promise<void> {
  await requestApi(`/posts/${id}`, "DELETE", []);
}

/**
 * Get posts by user ID with pagination and search
 */
export async function getPostsByUserId(
  userId: number,
  params?: {
    page?: number;
    items_per_page?: number;
    search?: string;
  }
): Promise<PostListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.items_per_page)
    queryParams.append("items_per_page", params.items_per_page.toString());
  if (params?.search) queryParams.append("search", params.search);

  const queryString = queryParams.toString();
  const url = queryString
    ? `/posts/user/${userId}?${queryString}`
    : `/posts/user/${userId}`;

  const response = await requestApi(url, "GET", []);
  return response.data;
}

// ============ LIKE APIs ============

/**
 * Like a post
 */
export async function likePost(postId: number): Promise<void> {
  await requestApi(`/posts/${postId}/like`, "POST", {});
}

/**
 * Unlike a post
 */
export async function unlikePost(postId: number): Promise<void> {
  await requestApi(`/posts/${postId}/like`, "DELETE", {});
}

/**
 * Get likes count for a post
 */
export async function getLikes(
  postId: number
): Promise<{ data: unknown[]; total: number }> {
  const response = await requestApi(`/posts/${postId}/likes`, "GET", []);
  return response.data;
}

/**
 * Check if current user liked a post
 */
export async function checkUserLiked(
  postId: number
): Promise<{ liked: boolean }> {
  const response = await requestApi(`/posts/${postId}/liked`, "GET", []);
  return response.data;
}

// ============ COMMENT APIs ============

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    first_Name: string;
    last_Name: string;
    avatar?: string;
  };
}

/**
 * Create a comment on a post
 */
export async function createComment(
  postId: number,
  content: string
): Promise<Comment> {
  const response = await requestApi(`/posts/${postId}/comments`, "POST", {
    content,
  });
  return response.data;
}

/**
 * Get comments for a post
 */
export async function getComments(
  postId: number
): Promise<{ data: Comment[] } | Comment[]> {
  const response = await requestApi(`/posts/${postId}/comments`, "GET", []);
  return response.data;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: number): Promise<void> {
  await requestApi(`/posts/comments/${commentId}`, "DELETE", {});
}
