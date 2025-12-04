import React, { useEffect, useState, type ChangeEvent } from "react";

interface LiveSearchProps {
  onKeySearch: (keyword: string) => void;
}

const LiveSearch: React.FC<LiveSearchProps> = ({ onKeySearch }) => {
  const [keyword, setKeyword] = useState<string>("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      console.log("call func onKeySearch");
      onKeySearch(keyword);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [keyword, onKeySearch]);

  const onTyping = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log("keyword typing=> ", value);
    setKeyword(value);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        onChange={onTyping}
        value={keyword}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        placeholder="Search by email or name..."
      />
    </div>
  );
};

export default LiveSearch;
