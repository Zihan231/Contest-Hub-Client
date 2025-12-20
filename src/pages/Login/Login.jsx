import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaTrophy } from "react-icons/fa";
import Swal from "sweetalert2";
import AuthContext from "../../context/AuthContext/AuthContext";
import Loading from "../../components/Loading/Loading";
import useAxios from "../../hooks/axios/useAxios";

const Login = () => {
  const axios = useAxios();
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithGoogle, SetUser, signInWithEmailPass } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const reDirectTo = location.state?.from || '/';
  const [loading, setLoading] = useState(false);
  // 1. Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // 2. Form Submission Handler
  const onSubmit = (data) => {
    Swal.fire({
      title: "Signing In...",
      text: "Verifying your credentials",
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
      background: "var(--color-base-100)",
      color: "var(--color-base-content)"
    })
    setLoading(true);
    const { email, password } = data;

    signInWithEmailPass(email, password)
      .then(() => {

        Swal.fire({
          title: "Welcome Back!",
          text: "Login successful",
          icon: "success",
          background: "var(--color-base-100)",
          color: "var(--color-base-content)"
        }).then(() => {
          navigate(reDirectTo, { replace: true })
        });
      })
      .catch(() => {
        // --- UPDATED ERROR ALERT ---
        Swal.fire({
          title: "Login Failed",
          text: "Invalid email or password.", // Clean error message
          icon: "error",
          confirmButtonColor: "var(--color-error)", // Matches theme error color
          background: "var(--color-base-100)",      // Matches other alerts
          color: "var(--color-base-content)"        // Matches other alerts
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleLogin = async () => {
  try {
    // 1) Google sign-in
    const result = await signInWithGoogle();
    const user = result?.user;

    if (!user?.email) {
      return Swal.fire({
        title: "Sign Up Failed",
        text: "Google account email not found.",
        icon: "error",
      });
    }

    // 2) Prepare payload for DB
    const payload = {
      name: user.displayName || "Unnamed User",
      email: user.email,
      photoURL: user.photoURL || "",
    };

    // 3) Save to backend DB with specific handling for 409
    try {
      // Attempt to create new user
      await axios.post("/public/signUp", payload);

      // --- SCENARIO A: NEW ACCOUNT CREATED (200/201) ---
      SetUser?.(user);

      await Swal.fire({
        title: "Account created successfully!",
        text: "Welcome to the platform.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect after success
      navigate(reDirectTo, { replace: true });

    } catch (apiError) {
      // --- SCENARIO B: ACCOUNT ALREADY EXISTS (409) ---
      if (apiError.response && apiError.response.status === 409) {
        
        // Since Google Auth passed, we simply log them in
        SetUser?.(user); 

        await Swal.fire({
          title: "Welcome Back!",
          text: "You have successfully logged in.",
          icon: "success", // Success icon because the login worked
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirect after success
        navigate(reDirectTo, { replace: true });
        return; // Stop execution to prevent falling into the outer catch
      }

      // If it's a different error (e.g., 500 Server Error), throw it to the main catch
      throw apiError;
    }

  } catch (err) {
    // --- SCENARIO C: REAL ERRORS (Google failed or Server crashed) ---
    console.error("Google Login Error:", err);

    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong";

    Swal.fire({
      title: "Login Failed !!!",
      text: msg,
      icon: "error",
    });
  }
};
  return (
    <div>
      {
        loading ? (<Loading></Loading>) : (
          <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden py-10 px-4">

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] opacity-40 animate-pulse delay-1000"></div>
            </div>

            <div className="card w-full max-w-4xl bg-base-100/80 backdrop-blur-xl shadow-2xl overflow-hidden md:flex-row z-10 border border-white/20">

              {/* ============================================================
            LEFT SIDE: WELCOME BACK VISUALS
           ============================================================ */}
              <div className="hidden md:flex w-1/2 relative flex-col justify-center items-center p-12 overflow-hidden">

                {/* Deep Mesh Gradient Background */}
                <div className="absolute inset-0 bg-linear-to-tr from-secondary via-blue-900 to-primary opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col items-center text-center">

                  {/* Floating Trophy Logo (Brand Identity) */}
                  <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl animate-float">
                    <FaTrophy className="text-6xl text-yellow-400 drop-shadow-lg" />
                  </div>

                  {/* Typography */}
                  <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                    Welcome <span className="text-yellow-300">Back</span>
                  </h2>
                  <p className="text-blue-100 text-lg max-w-xs leading-relaxed">
                    Access your dashboard, manage your contests, and track your victories.
                  </p>
                </div>
              </div>

              {/* ============================================================
            RIGHT SIDE: LOGIN FORM
           ============================================================ */}
              <div className="w-full md:w-1/2 p-8 md:p-12 bg-base-100">
                <div className="text-center mb-8">
                  {/* UPDATED: Changed text color to primary (Brand Color) */}
                  <h2 className="text-3xl font-bold text-primary">Login</h2>
                  <p className="text-base-content/60 mt-1">Access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                  {/* Email Input */}
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Email Address</span></label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3.5 text-base-content/40" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        className={`input input-bordered w-full pl-10 focus:input-primary ${errors.email ? 'input-error' : ''}`}
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                      />
                    </div>
                    {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
                  </div>

                  {/* Password Input */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Password</span>
                      <a href="#" className="label-text-alt link link-hover text-primary font-semibold">Forgot password?</a>
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3.5 text-base-content/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`input input-bordered w-full pl-10 focus:input-primary ${errors.password ? 'input-error' : ''}`}
                        {...register("password", { required: "Password is required" })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-base-content/40 hover:text-primary transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
                  </div>

                  {/* Login Button */}
                  <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary w-full shadow-lg shadow-primary/30 text-lg">
                      Login
                    </button>
                  </div>
                </form>

                <div className="divider text-sm text-base-content/50 my-6">OR CONTINUE WITH</div>

                {/* Social Login */}
                <button
                  onClick={handleGoogleLogin}
                  className="btn btn-outline w-full gap-2 hover:bg-base-content hover:text-base-100 transition-all"
                >
                  <FaGoogle /> Google
                </button>

                {/* Register Link */}
                <p className="text-center mt-8 text-sm text-base-content/70">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary font-bold hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Login;