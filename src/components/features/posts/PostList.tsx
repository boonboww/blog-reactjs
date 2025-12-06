// PostList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../shared/common/DataTable";
import requestApi from "../../../helpers/api";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/globalLoadingSlice";
import type { AppDispatch } from "../../../redux/store";
import type { PostEntity } from "../../../types";

const PostList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostEntity[]>([]);
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleteItem, setDeleteItem] = useState<string | number | null>(null);
  const [deleteType, setDeleteType] = useState<"single" | "multi">("single");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(() => Date.now());

  const handleDelete = (id: string | number) => {
    setShowModal(true);
    setDeleteItem(id);
    setDeleteType("single");
  };

  const handleMultiDelete = () => {
    setShowModal(true);
    setDeleteType("multi");
  };

  const requestDeleteApi = () => {
    dispatch(setLoading(true));

    if (deleteType === "single" && deleteItem !== null) {
      requestApi(`/posts/${deleteItem}`, "DELETE", [])
        .then(() => {
          setShowModal(false);
          setRefresh(Date.now());
          dispatch(setLoading(false));
        })
        .catch(() => {
          setShowModal(false);
          dispatch(setLoading(false));
        });
    } else if (deleteType === "multi") {
      requestApi(`/posts/multiple?ids=${selectedRows.toString()}`, "DELETE", [])
        .then(() => {
          setShowModal(false);
          setRefresh(Date.now());
          setSelectedRows([]);
          dispatch(setLoading(false));
        })
        .catch(() => {
          setShowModal(false);
          dispatch(setLoading(false));
        });
    }
  };

  const handlePageChange = (page: number | null) => {
    if (page !== null) setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(setLoading(true));
    const query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}`;
    requestApi(`/posts${query}`, "GET", [])
      .then((response) => {
        setPosts(response.data.data);
        setNumOfPage(response.data.lastPage || 1);
        dispatch(setLoading(false));
      })
      .catch(() => dispatch(setLoading(false)));
  }, [currentPage, itemsPerPage, searchString, refresh, dispatch]);

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
        Draft
      </span>
    );
  };

  const columns = [
    { name: "ID", element: (row: PostEntity) => row.id },
    {
      name: "Title",
      element: (row: PostEntity) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 truncate">{row.title}</div>
        </div>
      ),
    },
    {
      name: "Description",
      element: (row: PostEntity) => (
        <div className="max-w-md">
          <div className="text-sm text-gray-600 truncate">
            {row.description}
          </div>
        </div>
      ),
    },
    {
      name: "Author",
      element: (row: PostEntity) => (
        <div className="flex items-center gap-2">
          {row.user.avatar ? (
            <img
              src={row.user.avatar}
              alt={`${row.user.first_Name} ${row.user.last_Name}`}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
              <span className="text-xs font-medium text-gray-600">
                {row.user.first_Name[0]}
                {row.user.last_Name[0]}
              </span>
            </div>
          )}
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {row.user.first_Name} {row.user.last_Name}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      element: (row: PostEntity) => getStatusBadge(row.status),
    },
    {
      name: "Created At",
      element: (row: PostEntity) =>
        new Date(row.created_at).toLocaleDateString(),
    },
    {
      name: "Actions",
      element: (row: PostEntity) => (
        <div className="flex gap-2 whitespace-nowrap">
          <button
            onClick={() => navigate(`/admin/posts/detail/${row.id}`)}
            className="flex items-center justify-center gap-1 px-3 h-8 rounded-lg bg-blue-100 text-sm font-medium text-blue-700 border border-blue-200 hover:bg-blue-200 transition-all"
          >
            View
          </button>
          <button
            className="flex items-center justify-center gap-1 px-3 h-8 rounded-lg bg-red-100 text-sm font-medium text-red-700 border border-red-200 hover:bg-red-200 transition-all"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Post Management
        </h1>
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
            <li className="font-medium text-gray-900">Posts</li>
          </ol>
        </nav>
      </div>

      {/* Filters and Action Buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {selectedRows.length > 0 && (
          <button
            className="flex items-center justify-center gap-2 w-56 h-10 rounded-lg bg-red-600 text-sm font-medium text-white shadow-sm hover:bg-red-700 hover:shadow-md transition-all"
            onClick={handleMultiDelete}
          >
            Delete Selected ({selectedRows.length})
          </button>
        )}
      </div>

      {/* DataTable */}
      <DataTable<PostEntity>
        name="List Posts"
        data={posts}
        columns={columns}
        numOfPage={numOfPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onChangeItemsPerPage={setItemsPerPage}
        onKeySearch={(keyword) => setSearchString(keyword)}
        onSelectedRows={(rows) => setSelectedRows(rows)}
      />

      {/* Delete Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Deletion
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  X
                </button>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete{" "}
                  {deleteType === "multi"
                    ? `${selectedRows.length} selected post(s)`
                    : "this post"}
                  ?
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-24 h-10 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={requestDeleteApi}
                  className="w-24 h-10 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;
