import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext/AuthContext";
import {
  FaUserEdit,
  FaSave,
  FaTimes,
  FaWallet,
  FaMedal,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useRole from "../../hooks/role/useRole";
import axios from "axios";
import useAxiosSecure from "../../hooks/axiosSecure/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const MyProfile = () => {
  const { role } = useRole();
  const { user, Update } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Keep preview in sync with firebase user
  const [previewImage, setPreviewImage] = useState("");

  // ✅ Fetch user data from DB
  const {
    data: userData,
    isLoading: dbLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("user/profile");
      return res?.data?.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // ✅ initial empty, then we set real values using reset() after async load
    defaultValues: {
      displayName: "",
      address: "",
      bio: "",
    },
  });

  // ✅ When firebase user / db userData loads, push values into form
  useEffect(() => {
    reset({
      displayName: user?.displayName || "",
      address: userData?.address || "",
      bio: userData?.bio || "",
    });
  }, [user?.displayName, userData?.address, userData?.bio, reset]);

  // ✅ When user photo changes, sync preview
  useEffect(() => {
    setPreviewImage(user?.photoURL || userData?.photoURL || "");
  }, [user?.photoURL, userData?.photoURL]);

  // Handle Image Change (preview only)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // reset to latest values
    reset({
      displayName: user?.displayName || "",
      address: userData?.address || "",
      bio: userData?.bio || "",
    });
    setPreviewImage(user?.photoURL || userData?.photoURL || "");
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // 1) Optional image upload (only if user selected a new file)
      const fileToUpload = data.photo?.[0];
      let uploadedPhotoURL = null;

      if (fileToUpload) {
        const imgURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

        const formData = new FormData();
        formData.append("image", fileToUpload);

        const imgRes = await axios.post(imgURL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedPhotoURL = imgRes?.data?.data?.display_url;
        if (!uploadedPhotoURL) {
          throw new Error("Image upload failed. No URL returned from image host.");
        }
      }

      // 2) Update Firebase Auth user profile
      const firebasePayload = {
        displayName: data.displayName,
        ...(uploadedPhotoURL ? { photoURL: uploadedPhotoURL } : {}),
      };

      await Update(firebasePayload);

      if (uploadedPhotoURL) setPreviewImage(uploadedPhotoURL);

      // 3) Update DB (your API)
      const dbPayload = {
        name: data?.displayName,
        photoURL: uploadedPhotoURL ?? user?.photoURL ?? userData?.photoURL ?? null,
        bio: data?.bio,
        address: data?.address,
      };

      try {
        const res = await axiosSecure.patch("user/profile/update", dbPayload);

        if (res?.status === 200 || res?.status === 201) {
          await refetch(); // ✅ refresh DB view data

          Swal.fire({
            title: "Profile Updated!",
            text: res?.data?.message || "Profile updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            confirmButtonColor: "var(--color-primary)",
          });

          setIsEditing(false);
          return;
        }

        throw new Error(res?.data?.message || "Profile update failed on server.");
      } catch (dbErr) {
        const serverMsg =
          dbErr?.response?.data?.message ||
          dbErr?.message ||
          "Database update failed.";

        Swal.fire({
          title: "Partially Updated",
          text: `Firebase profile updated, but server update failed: ${serverMsg}`,
          icon: "warning",
          confirmButtonColor: "var(--color-primary)",
        });

        setIsEditing(true);
        return;
      }
    } catch (e) {
      const errMsg =
        e?.response?.data?.message ||
        e?.message ||
        "Something went wrong.";

      Swal.fire({
        title: "Update Failed!",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    } finally {
      setLoading(false);
    }
  };

  if (dbLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <span className="loading loading-spinner loading-md"></span>
              <p className="font-semibold">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // register helpers (so we can call onChange safely)
  const photoRegister = register("photo");
  const displayNameRegister = register("displayName", { required: true });
  const addressRegister = register("address");
  const bioRegister = register("bio");

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="relative mb-24 md:mb-28">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 overflow-hidden shadow-lg relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

          {/* Edit Mode Toggle */}
          <div className="absolute top-4 right-4 z-10">
            <label className="cursor-pointer flex items-center gap-2 bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all shadow-sm">
              <span className="text-white font-bold text-xs uppercase tracking-wider">
                {isEditing ? "Editing Mode" : "View Mode"}
              </span>
              <input
                type="checkbox"
                className="toggle toggle-sm toggle-accent border-white/20 bg-opacity-80"
                checked={isEditing}
                onChange={() => setIsEditing((p) => !p)}
              />
            </label>
          </div>
        </div>

        {/* Avatar Wrapper */}
        <div className="absolute -bottom-16 left-6 md:left-10 flex items-end gap-6">
          <div className="avatar">
            <div className="w-32 md:w-40 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-4 shadow-2xl bg-base-100 overflow-hidden">
              <img
                src={previewImage || "https://i.pravatar.cc/300"}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Name & Role */}
          <div className="mb-2 hidden md:block">
            <h1 className="text-3xl font-black text-base-content">
              {user?.displayName || "User Name"}
            </h1>
            <div className="badge badge-primary badge-outline font-bold mt-1 uppercase text-xs tracking-widest">
              {role}
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6 border-b border-base-200 pb-4">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <FaUserEdit className="text-primary" /> Personal Information
                </h3>

                {isEditing && (
                  <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                    <button
                      onClick={handleCancel}
                      className="btn btn-sm btn-ghost text-error"
                      disabled={loading}
                    >
                      <FaTimes /> Cancel
                    </button>

                    <button
                      onClick={handleSubmit(onSubmit)}
                      className="btn btn-sm btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
                          <FaSave /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* --- FORM FIELDS --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Profile Photo Upload */}
                {isEditing && (
                  <div className="form-control md:col-span-2">
                    <label className="label font-bold text-base-content/60">
                      Profile Photo
                    </label>

                    <input
                      type="file"
                      className="file-input file-input-bordered file-input-primary w-full"
                      accept="image/*"
                      {...photoRegister}
                      onChange={(e) => {
                        photoRegister.onChange(e);
                        handleImageChange(e);
                      }}
                    />

                    <label className="label">
                      <span className="label-text-alt text-base-content/50">
                        Recommended: Square JPG, PNG. Max 2MB.
                      </span>
                    </label>
                  </div>
                )}

                {/* Name */}
                <div className="form-control">
                  <label className="label font-bold text-base-content/60">
                    Full Name
                  </label>

                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        className="input input-bordered focus:input-primary w-full"
                        {...displayNameRegister}
                      />
                      {errors?.displayName && (
                        <span className="text-error text-sm mt-1">
                          Name is required
                        </span>
                      )}
                    </>
                  ) : (
                    <p className="text-lg font-semibold">{user?.displayName}</p>
                  )}
                </div>

                {/* Email (Read Only) */}
                <div className="form-control">
                  <label className="label font-bold text-base-content/60">
                    Email
                  </label>
                  <div className="flex items-center gap-2 text-lg font-semibold opacity-70 cursor-not-allowed select-none">
                    <FaEnvelope className="text-sm" /> {user?.email}
                  </div>
                </div>

                {/* Address */}
                <div className="form-control md:col-span-2">
                  <label className="label font-bold text-base-content/60">
                    Address
                  </label>

                  {isEditing ? (
                    <input
                      type="text"
                      className="input input-bordered focus:input-primary w-full"
                      {...addressRegister}
                    />
                  ) : (
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <FaMapMarkerAlt className="text-error" />{" "}
                      {userData?.address || "No Address Found"}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="form-control md:col-span-2">
                  <label className="label font-bold text-base-content/60 mr-2">
                    About Me
                  </label>

                  {isEditing ? (
                    <textarea
                      className="textarea textarea-bordered h-24 focus:textarea-primary text-base w-full"
                      {...bioRegister}
                    />
                  ) : (
                    <p className="text-base-content/80 leading-relaxed bg-base-200/50 p-4 rounded-lg">
                      "{userData?.bio || "No Bio Found"}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Stats */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body items-center text-center">
              <h3 className="font-bold text-gray-500 mb-4 uppercase text-xs tracking-widest">
                Performance
              </h3>
              <div
                className="radial-progress text-primary font-black text-2xl"
                style={{ "--value": 68, "--size": "8rem", "--thickness": "10px" }}
                role="progressbar"
              >
                68%
                <span className="block text-xs font-normal text-base-content/50 mt-1">
                  Win Rate
                </span>
              </div>

              <div className="divider my-2"></div>

              <div className="w-full grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-black text-base-content">42</p>
                  <p className="text-xs text-base-content/60 font-bold uppercase">
                    Contests
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-black text-yellow-500">12</p>
                  <p className="text-xs text-base-content/60 font-bold uppercase">
                    Wins
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="stats stats-vertical shadow-xl w-full border border-base-200 bg-base-100">
            <div className="stat">
              <div className="stat-figure text-green-500">
                <FaWallet className="text-3xl" />
              </div>
              <div className="stat-title font-bold">Total Earnings</div>
              <div className="stat-value text-green-500">$2,450</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-yellow-500">
                <FaMedal className="text-3xl" />
              </div>
              <div className="stat-title font-bold">Global Rank</div>
              <div className="stat-value text-yellow-500">#428</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
