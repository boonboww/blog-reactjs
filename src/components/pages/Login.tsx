import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import requestApi from "../../helpers/api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/globalLoadingSlice";
import type { RootState } from "../../redux/store";
import igImage from "../../assets/ig.png";

interface LoginData {
  email?: string;
  password?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.globalLoading.status);

  const [loginData, setLoginData] = useState<LoginData>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = useCallback(() => {
    const errors: FormErrors = {};
    let valid = true;

    if (!loginData.email) {
      errors.email = "Please enter email";
    } else {
      const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        loginData.email
      );
      if (!validEmail) {
        errors.email = "Email is not valid";
      }
    }

    if (!loginData.password) {
      errors.password = "Please enter password";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      valid = false;
    } else {
      setFormErrors({});
    }

    return valid;
  }, [loginData]);

  useEffect(() => {
    if (isSubmitted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      validateForm();
    }
  }, [loginData, isSubmitted, validateForm]);

  const onSubmit = () => {
    const valid = validateForm();
    if (!valid) {
      setIsSubmitted(true);
      return;
    }

    dispatch(setLoading(true));
    requestApi("/auth/login", "POST", loginData)
      .then((res) => {
        // Debug: Log the entire response
        console.log("Login response:", res.data);

        // Store tokens
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);

        // Store user data for socket connection and profile
        if (res.data.user) {
          localStorage.setItem("user_id", res.data.user.id?.toString() || "");
          localStorage.setItem("user_email", res.data.user.email || "");
          localStorage.setItem(
            "user_name",
            `${res.data.user.first_Name || ""} ${
              res.data.user.last_Name || ""
            }`.trim()
          );
        }

        // Store full user data as JSON for profile page
        if (res.data.user) {
          localStorage.setItem("user_data", JSON.stringify(res.data.user));
        }

        // Store user role - adjust this based on your API response structure
        const userRole = res.data.user?.role || res.data.role || "user";
        console.log("Detected user role:", userRole);
        localStorage.setItem("user_role", userRole);

        dispatch(setLoading(false));

        // Redirect based on role
        if (userRole === "admin") {
          console.log("Redirecting to /admin");
          navigate("/admin");
        } else {
          console.log("Redirecting to /");
          navigate("/");
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => {
        dispatch(setLoading(false));
        if (err.response) {
          toast.error(err.response.data.message, { position: "top-center" });
        } else {
          toast.error("Server is down. Please try again!", {
            position: "top-center",
          });
        }
      });

    setIsSubmitted(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex items-center gap-12 max-w-[1100px] w-full px-4">
        {/* Left Side - Instagram style image */}
        <div className="flex-1 hidden md:flex justify-center">
          <img
            src={igImage}
            alt="instagram mockup"
            className="max-w-[420px] object-contain"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 w-full max-w-[350px]">
          <div className="bg-white px-6 sm:px-10 pt-8 sm:pt-12 pb-6 mb-2.5 relative">
            <div className="flex justify-center mb-10">
              <h1
                className="text-4xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Lobster Two', cursive",
                  background: "black",

                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                GoBlog
              </h1>
            </div>

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10 rounded-sm">
                <div className="w-7 h-7 border-[3px] border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
              </div>
            )}

            <div className="space-y-2">
              <input
                className={`w-full px-2 py-[9px] text-xs border ${
                  formErrors.email ? "border-red-400" : "border-gray-300"
                } rounded-[3px] bg-gray-50 focus:outline-none focus:border-gray-400 transition-all placeholder-gray-400`}
                type="text"
                name="email"
                placeholder="email"
                onChange={onChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="username"
              />
              <div className="relative">
                <input
                  className={`w-full px-2 py-[9px] text-xs border ${
                    formErrors.password ? "border-red-400" : "border-gray-300"
                  } rounded-[3px] bg-gray-50 focus:outline-none focus:border-gray-400 transition-all placeholder-gray-400 pr-14`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  autoComplete="current-password"
                />
                {loginData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-900 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}
              </div>

              {(formErrors.email || formErrors.password) && (
                <div className="bg-red-50 border border-red-200 rounded-sm px-3 py-2 mt-2">
                  <p className="text-red-600 text-xs text-center">
                    {formErrors.email || formErrors.password}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={onSubmit}
                className={`w-full text-white text-sm font-semibold py-[7px] rounded-lg transition-all mt-3 ${
                  loginData.email && loginData.password && !loading
                    ? "bg-[#0095f6] hover:bg-[#1877f2] active:opacity-70"
                    : "bg-[#4db5f9] cursor-not-allowed opacity-70"
                }`}
                disabled={loading || !loginData.email || !loginData.password}
              >
                Log in
              </button>
            </div>

            <div className="text-center mt-5">
              <Link
                to="/forgot-password"
                className="text-xs text-[#00376b] hover:opacity-60 transition-opacity"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="bg-whitep-6 text-center mt-4">
            <p className="text-sm text-gray-900">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#0095f6] font-semibold hover:text-[#00376b] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Lobster+Two:wght@700&display=swap');
        `}
      </style>
    </div>
  );
};

export default Login;
