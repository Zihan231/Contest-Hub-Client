import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaUser, FaCloudUploadAlt, FaCheckCircle, FaIdBadge } from "react-icons/fa";
import Swal from "sweetalert2";
import AuthContext from "../../context/AuthContext/AuthContext";
import Loading from "../../components/Loading/Loading";
import { deleteUser, updateProfile } from "firebase/auth";
import useAxios from "../../hooks/axios/useAxios";

const Register = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const reDirectTo = location.state?.from || '/';
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithGoogle, SetUser, createUser, user } = useContext(AuthContext);
  console.log(user);
  const [loading, setLoading] = useState(false);
  // 1. Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  // Watch the image field to get the file name dynamically
  const imageFile = watch("image");

  // 2. Form Submission Handler
  const onSubmit = async (data) => {
    setLoading(true);

    const fileToUpload = data.image?.[0];
    const { name, email, password, role } = data;

    if (!fileToUpload) {
      setLoading(false);
      return Swal.fire({
        title: "Image required",
        text: "Please select a profile image.",
        icon: "warning",
      });
    }

    const imgURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

    let createdUser = null;

    try {
      //  1) Create user account FIRST (Firebase)
      const result = await createUser(email, password);
      createdUser = result.user;

      //  2) Upload image AFTER account created (ImgBB)
      const formData = new FormData();
      formData.append("image", fileToUpload);

      const imgRes = await axios.post(imgURL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const photoURL = imgRes?.data?.data?.display_url;
      if (!photoURL) throw new Error("Image upload failed. No URL returned.");

      //  3) Update firebase profile (name + photo)
      await updateProfile(createdUser, {
        displayName: name,
        photoURL,
      });

      //  4) Update UI state
      SetUser({ ...createdUser, displayName: name, photoURL });

      //  5) Save user to your backend DB
      const payload = { name, email, photoURL, role };
      const apiRes = await axios.post("/public/signUp", payload);

      if (apiRes?.status !== 200 && apiRes?.status !== 201) {
        throw new Error("Server responded with an unexpected status.");
      }

      //  Success
      Swal.fire({
        title: "Account created successfully!",
        text: "Welcome to ContestHub",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(reDirectTo, { replace: true });
    } catch (error) {
      console.error("Registration Error:", error);

      //  Rollback: if account created but image/db step failed, delete the firebase user
      if (createdUser) {
        try {
          await deleteUser(createdUser);
        } catch (rollbackErr) {
          console.error("Rollback failed (could not delete user):", rollbackErr);
        }
      }

      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      Swal.fire({
        title: "Registration Failed",
        text: msg,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleRegister = async () => {
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

    // 3) Save to backend DB (wait for it)
    const apiRes = await axios.post("/public/signUp", payload);

    // (optional) check status
    if (apiRes?.status !== 200 && apiRes?.status !== 201) {
      throw new Error("Server responded with an unexpected status.");
    }

    // 4) Update UI state
    SetUser?.(user);

    // 5) Success popup then redirect
    await Swal.fire({
      title: "Account created successfully!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    navigate(reDirectTo, { replace: true });
  } catch (err) {
    console.error("Google Sign Up Error:", err);

    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong";

    Swal.fire({
      title: "Sign Up Failed !!!",
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
              <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] opacity-40 animate-pulse delay-1000"></div>
            </div>

            <div className="card w-full max-w-5xl bg-base-100/80 backdrop-blur-xl shadow-2xl overflow-hidden md:flex-row z-10 border border-white/20">

              {/* ============================================================
            LEFT SIDE: PREMIUM VISUALS
           ============================================================ */}
              <div className="hidden md:flex w-1/2 relative flex-col justify-center items-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary via-blue-900 to-secondary opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="relative mb-10 group">
                    <div className="w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
                      <div className="w-20 h-20 mx-auto rounded-full border-4 border-yellow-400 shadow-lg overflow-hidden mb-4">
                        <img src="https://i.pravatar.cc/150?img=33" alt="Winner" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-white font-bold text-xl">Alex Johnson</h3>
                      <p className="text-white/70 text-sm">UI/UX Design Champion</p>
                      <div className="mt-4 bg-white/20 rounded-lg py-2 px-4 flex justify-between items-center">
                        <span className="text-yellow-300 font-bold text-sm">Earned</span>
                        <span className="text-white font-bold">$1,250</span>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                    Join the <span className="text-yellow-300">Elite</span>
                  </h2>
                  <p className="text-blue-100 text-lg max-w-xs leading-relaxed">
                    Showcase your skills, compete with the best, and claim your place on the global leaderboard.
                  </p>
                </div>
              </div>

              {/* ============================================================
            RIGHT SIDE: FORM
           ============================================================ */}
              <div className="w-full md:w-1/2 p-8 md:p-12 bg-base-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-primary">Create Account</h2>
                  <p className="text-base-content/60 mt-1">Start your journey today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                  {/* Name */}
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Full Name</span></label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3.5 text-base-content/40" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className={`input input-bordered w-full pl-10 focus:input-primary ${errors.name ? 'input-error' : ''}`}
                        {...register("name", { required: "Name is required" })}
                      />
                    </div>
                    {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
                  </div>

                  {/* Email */}
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

                  {/* --- NEW ROLE DROPDOWN --- */}
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">I want to join as</span></label>
                    <div className="relative">
                      <FaIdBadge className="absolute left-3 top-3.5 text-base-content/40 z-10" />
                      <select
                        defaultValue=""
                        className={`select select-bordered w-full pl-10 focus:select-primary text-base-content ${errors.role ? 'select-error' : ''}`}
                        {...register("role", { required: "Please select a role" })}
                      >
                        <option value="" disabled>Select your role</option>
                        <option value="user">Participant</option>
                        <option value="creator">Contest Creator</option>
                      </select>
                    </div>
                    {errors.role && <span className="text-error text-xs mt-1">{errors.role.message}</span>}
                  </div>

                  {/* Image Upload */}
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Profile Picture</span></label>
                    <div
                      className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
                ${errors.image ? 'border-error bg-error/5' :
                          (imageFile && imageFile.length > 0) ? 'border-primary bg-primary/5' : 'border-base-300 hover:bg-base-200'}`}
                    >
                      <input
                        type="file"
                        id="imageUpload"
                        className="hidden"
                        accept="image/*"
                        {...register("image", { required: "Profile picture is required" })}
                      />
                      <label htmlFor="imageUpload" className="w-full h-full flex flex-col items-center justify-center py-4 cursor-pointer">
                        {imageFile && imageFile.length > 0 ? (
                          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            <FaCheckCircle className="text-3xl text-primary mb-1" />
                            <p className="text-sm font-bold text-primary max-w-[200px] truncate">
                              {imageFile[0].name}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <FaCloudUploadAlt className="text-3xl text-base-content/30 mb-1" />
                            <p className="text-xs text-base-content/60">Upload Photo</p>
                          </div>
                        )}
                      </label>
                    </div>
                    {errors.image && <span className="text-error text-xs mt-1">{errors.image.message}</span>}
                  </div>

                  {/* Password */}
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Password</span></label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3.5 text-base-content/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`input input-bordered w-full pl-10 focus:input-primary ${errors.password ? 'input-error' : ''}`}
                        {...register("password", {
                          required: "Required",
                          minLength: { value: 6, message: "Min 6 chars" },
                          pattern: { value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/, message: "Must include uppercase & lowercase" }
                        })}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-base-content/40 hover:text-primary">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
                  </div>

                  <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary w-full shadow-lg shadow-primary/30">Register</button>
                  </div>
                </form>

                <div className="divider text-sm text-base-content/50 my-6">OR</div>

                <button onClick={handleGoogleRegister} className="btn btn-outline w-full gap-2 hover:bg-base-content hover:text-base-100">
                  <FaGoogle /> Google
                </button>

                <p className="text-center mt-6 text-sm text-base-content/70">
                  Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Register;