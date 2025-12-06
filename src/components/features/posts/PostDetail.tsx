// PostDetail.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import requestApi from "../../../helpers/api";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/globalLoadingSlice";
import type { AppDispatch } from "../../../redux/store";
import type { PostEntity } from "../../../types";
import { ArrowLeft, User, Calendar, FileText } from "lucide-react";

const PostDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<PostEntity | null>(null);

  useEffect(() => {
    if (!id) return;

    dispatch(setLoading(true));
    requestApi(`/posts/${id}`, "GET", [])
      .then((response) => {
        setPost(response.data);
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        dispatch(setLoading(false));
        navigate("/admin/posts");
      });
  }, [id, dispatch, navigate]);

  if (!post) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading post details...</div>
      </div>
    );
  }

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
          Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
        Draft
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/posts")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Posts</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Details</h1>
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a
                href="/admin"
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </a>
            </li>
            <li>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li>
              <a
                href="/admin/posts"
                className="hover:text-blue-600 transition-colors"
              >
                Posts
              </a>
            </li>
            <li>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li className="font-medium text-gray-900">Post #{post.id}</li>
          </ol>
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-4xl">
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Title and Status */}
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
              {getStatusBadge(post.status)}
            </div>
          </div>

          {/* Post Details */}
          <div className="px-8 py-6 space-y-6">
            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Description</h3>
              </div>
              <p className="text-gray-700 leading-relaxed pl-7">
                {post.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              {/* Author */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Author</h3>
                </div>
                <div className="flex items-center gap-3 pl-7">
                  {post.user.avatar ? (
                    <img
                      src={post.user.avatar}
                      alt={`${post.user.first_Name} ${post.user.last_Name}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-white shadow-md">
                      <span className="text-sm font-bold text-white">
                        {post.user.first_Name[0]}
                        {post.user.last_Name[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {post.user.first_Name} {post.user.last_Name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {post.user.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Created At */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Created At</h3>
                </div>
                <div className="pl-7 text-gray-700">
                  {new Date(post.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Updated At */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Last Updated</h3>
                </div>
                <div className="pl-7 text-gray-700">
                  {new Date(post.updated_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/posts")}
              className="flex items-center justify-center gap-2 px-6 h-10 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
