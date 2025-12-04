import React, {
  useState,
  useCallback,
  useEffect,
  type ChangeEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import requestApi from "../../helpers/api";
import { toast } from "react-toastify";

interface RegisterData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState<RegisterData>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRegisterData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};
    let valid = true;

    if (!registerData.firstName) {
      errors.firstName = "Please enter first name";
    }

    if (!registerData.lastName) {
      errors.lastName = "Please enter last name";
    }

    if (!registerData.email) {
      errors.email = "Please enter email";
    } else {
      const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        registerData.email
      );
      if (!validEmail) {
        errors.email = "Email is not valid";
      }
    }

    if (!registerData.password) {
      errors.password = "Please enter password";
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = "Please confirm password";
    } else if (registerData.confirmPassword !== registerData.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      valid = false;
    } else {
      setFormErrors({});
    }

    return valid;
  }, [registerData]);

  useEffect(() => {
    if (isSubmitted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      validateForm();
    }
  }, [registerData, isSubmitted, validateForm]);

  const onSubmit = () => {
    const valid = validateForm();
    if (valid) {
      setLoading(true);
      requestApi("/auth/register", "POST", registerData)
        .then(() => {
          toast.success("Register successfully!", { position: "top-center" });
          setLoading(false);
          navigate("/login");
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
          setLoading(false);
          if (err.response) {
            toast.error(err.response.data.message, { position: "top-center" });
          } else {
            toast.error("Server error!", { position: "top-center" });
          }
        });
    }

    setIsSubmitted(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const isFormValid =
    registerData.firstName &&
    registerData.lastName &&
    registerData.email &&
    registerData.password &&
    registerData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-[350px]">
        {/* Main Card */}
        <div className="bg-white border border-gray-300 rounded-sm px-10 pt-10 pb-6 mb-2.5 relative">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <h1
              className="text-5xl font-bold tracking-tight"
              style={{
                fontFamily: "'Lobster Two', cursive",
                background:
                  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              YourBrand
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-center text-gray-500 font-semibold text-base mb-6 px-6">
            Sign up to see photos and videos from your friends.
          </p>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10 rounded-sm">
              <div className="w-7 h-7 border-[3px] border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
            </div>
          )}

          <div className="space-y-1.5">
            {/* Facebook Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-semibold py-2 rounded-lg transition-colors mb-4"
              disabled={loading}
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Log in with Facebook
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-[13px] text-gray-500 font-semibold">
                OR
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                className={`w-full px-2 py-[9px] text-xs border ${
                  formErrors.email ? "border-red-400" : "border-gray-300"
                } rounded-[3px] bg-gray-50 focus:outline-none focus:border-gray-400 transition-all placeholder-gray-400`}
                type="text"
                name="email"
                placeholder="Mobile Number or Email"
                onChange={onChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="email"
                style={{ fontSize: "12px" }}
              />
            </div>

            {/* First Name Input */}
            <div className="relative">
              <input
                className={`w-full px-2 py-[9px] text-xs border ${
                  formErrors.firstName ? "border-red-400" : "border-gray-300"
                } rounded-[3px] bg-gray-50 focus:outline-none focus:border-gray-400 transition-all placeholder-gray-400`}
                type="text"
                name="firstName"
                placeholder="First Name"
                onChange={onChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="given-name"
                style={{ fontSize: "12px" }}
              />
            </div>

            {/* Last Name Input */}
            <div className="relative">
              <input
                className={`w-full px-2 py-[9px] text-xs border ${
                  formErrors.lastName ? "border-red-400" : "border-gray-300"
                } rounded-[3px] bg-gray-50 focus:outline-none focus:border-gray-400 transition-all placeholder-gray-400`}
                type="text"
                name="lastName"
                placeholder="Last Name"
                onChange={onChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="family-name"
                style={{ fontSize: "12px" }}
              />
            </div>

            {/* Password Input */}
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
                autoComplete="new-password"
                style={{ fontSize: "12px" }}
              />
              {registerData.password && (
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

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                className={`w-full px-2 py-[9px] text-xs border ${
                  formErrors.confirmPassword
                    ? "border-red-400"
                    : "border-gray-300"
                } rounded-[3px] bg-gray-50 focus:outline-none focus:border-gray-400 transition-all placeholder-gray-400 pr-14`}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={onChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="new-password"
                style={{ fontSize: "12px" }}
              />
              {registerData.confirmPassword && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-900 hover:text-gray-700"
                  disabled={loading}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>

            {/* Error Messages */}
            {Object.keys(formErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-sm px-3 py-2 mt-2">
                <p className="text-red-600 text-xs text-center">
                  {Object.values(formErrors)[0]}
                </p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="button"
              onClick={onSubmit}
              className={`w-full text-white text-sm font-semibold py-[7px] rounded-lg transition-all ${
                isFormValid && !loading
                  ? "bg-[#0095f6] hover:bg-[#1877f2] active:opacity-70"
                  : "bg-[#4db5f9] cursor-not-allowed opacity-70"
              }`}
              disabled={loading || !isFormValid}
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Login Link Card */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 text-center mb-5">
          <p className="text-sm text-gray-900">
            Have an account?{" "}
            <Link
              to="/login"
              className="text-[#0095f6] font-semibold hover:text-[#00376b] transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Get App Section */}
        <div className="text-center">
          <p className="text-sm mb-5 text-gray-900">Get the app.</p>
          <div className="flex justify-center gap-2">
            <a
              href="#"
              className="inline-block hover:opacity-90 transition-opacity"
            >
              <div className="h-10 px-4 bg-black rounded-lg flex items-center justify-center text-white text-xs font-medium">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Google Play
              </div>
            </a>
            <a
              href="#"
              className="inline-block hover:opacity-90 transition-opacity"
            >
              <div className="h-10 px-4 bg-black rounded-lg flex items-center justify-center text-white text-xs font-medium">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                App Store
              </div>
            </a>
          </div>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Lobster+Two:wght@700&display=swap');
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
