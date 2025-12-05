import React from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Main from "./layouts/Main";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Home from "./components/pages/Home";
import PrivateRoutes from "./layouts/PrivateRoutes";
import PublicRoutes from "./layouts/PublicRoutes";
import Layout from "./layouts/Layout";
import UserList from "./components/features/user/UserList";
import CreateUser from "./components/features/user/CreateUser";
import EditUser from "./components/features/user/EditUser";
import NotFound from "./components/pages/NotFound";
import AdminRoutes from "./layouts/AdminRoutes";
import UserRoutes from "./layouts/UserRoutes";
import PostList from "./components/features/posts/PostList";
import PostDetail from "./components/features/posts/PostDetail";
import { FriendsPage } from "./pages/FriendsPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* User Routes - Instagram Style Home (User role only) */}
        <Route element={<PrivateRoutes />}>
          <Route element={<UserRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/friends" element={<FriendsPage />} />
          </Route>
        </Route>

        {/* Admin Routes - Dashboard (Admin role only) */}
        <Route element={<Main />}>
          <Route element={<PrivateRoutes />}>
            <Route element={<AdminRoutes />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/create" element={<CreateUser />} />
              <Route path="/admin/users/edit/:id" element={<EditUser />} />
              <Route path="/admin/posts" element={<PostList />} />
              <Route path="/admin/posts/detail/:id" element={<PostDetail />} />
            </Route>
          </Route>
        </Route>

        {/* 404 Not Found - Catch all */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
