import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Layout: React.FC = () => {
  const statusLoading = useSelector(
    (state: RootState) => state.globalLoading.status
  );

  return (
    <div className="relative min-h-screen">
      {/* Loader Overlay */}
      {statusLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <ScaleLoader color="#36d7b7" />
        </div>
      )}

      {/* Page content */}
      <Outlet />

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Layout;
