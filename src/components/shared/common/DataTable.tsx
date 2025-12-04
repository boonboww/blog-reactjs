import React, { useEffect, useState, type ChangeEvent } from "react";
import LiveSearch from "./LiveSearch";

interface Column<T> {
  name: string;
  element: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  name: string;
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  numOfPage: number;
  onPageChange: (page: number | null) => void;
  onChangeItemsPerPage: (value: number) => void;
  onKeySearch: (value: string) => void;
  onSelectedRows: (rows: string[]) => void;
}

function DataTable<T extends { id: string | number }>({
  name,
  data,
  columns,
  currentPage,
  numOfPage,
  onPageChange,
  onChangeItemsPerPage,
  onKeySearch,
  onSelectedRows,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    onSelectedRows(selectedRows);
  }, [selectedRows, onSelectedRows]);

  const renderHeaders = () =>
    columns.map((col, index) => (
      <th
        key={index}
        className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
      >
        {col.name}
      </th>
    ));

  const onClickCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    if (checked) {
      if (!selectedRows.includes(value)) {
        setSelectedRows([...selectedRows, value]);
      }
    } else {
      setSelectedRows(selectedRows.filter((row) => row !== value));
    }
  };

  const onSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = data.map((element) => String(element.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const renderData = () =>
    data.map((item, index) => (
      <tr
        key={index}
        className="border-b border-gray-200 transition-colors hover:bg-gray-50"
      >
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selectedRows.includes(String(item.id))}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500/20"
            value={item.id}
            onChange={onClickCheckbox}
          />
        </td>
        {columns.map((col, ind) => (
          <td key={ind} className="px-6 py-4 text-sm text-gray-900">
            {col.element(item)}
          </td>
        ))}
      </tr>
    ));

  const renderPagination = () => {
    const pagination = [];
    const nextPage = currentPage + 1 > numOfPage ? null : currentPage + 1;
    const prevPage = currentPage - 1 < 1 ? null : currentPage - 1;

    pagination.push(
      <button
        key="prev"
        onClick={() => onPageChange(prevPage)}
        disabled={!prevPage}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
          prevPage
            ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    );

    for (let i = 1; i <= numOfPage; i++) {
      pagination.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border px-0 text-sm font-medium transition-all ${
            currentPage === i
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    pagination.push(
      <button
        key="next"
        onClick={() => onPageChange(nextPage)}
        disabled={!nextPage}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
          nextPage
            ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    );

    return pagination;
  };

  const onChangeOption = (event: ChangeEvent<HTMLSelectElement>) => {
    onChangeItemsPerPage(Number(event.target.value));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm w-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 border-b border-gray-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            name="example_length"
            className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            onChange={onChangeOption}
          >
            {[1, 2, 3, 5, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>

        <div className="w-full sm:w-64">
          <LiveSearch onKeySearch={onKeySearch} />
        </div>
      </div>

      {/* Table với scroll lớn */}
      <div
        className="overflow-auto border border-gray-200"
        style={{ maxHeight: "600px", minWidth: "100%", scrollbarWidth: "auto" }}
      >
        <table className="min-w-[1400px] table-auto border-collapse w-full">
          <thead>
            <tr className="bg-gray-50 sticky top-0 z-10">
              <th className="border-b border-gray-200 px-6 py-3 w-12 bg-gray-50">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.length === data.length && data.length > 0
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500/20"
                  onChange={onSelectAll}
                />
              </th>
              {renderHeaders()}
            </tr>
          </thead>
          <tbody>{renderData()}</tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="border-t border-gray-200 px-6 py-3"></td>
              {renderHeaders()}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      {numOfPage > 1 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {numOfPage}
            </p>
            <div className="flex items-center gap-1">{renderPagination()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
