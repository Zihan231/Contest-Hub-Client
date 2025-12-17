import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    FaTrophy, FaImage, FaDollarSign, FaCalendarAlt,
    FaAlignLeft, FaTags, FaLightbulb, FaCheck, FaListOl
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthContext from '../../context/AuthContext/AuthContext';
import axios from 'axios';
import useAxiosSecure from "../../hooks/axiosSecure/useAxiosSecure";

const CreateContest = () => {
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    // Custom state for multi-select tags
    const [selectedTags, setSelectedTags] = useState([]);
    const availableTags = ["Design", "Writing", "Marketing", "Gaming", "Business", "Coding"];

    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue, // Needed to register tags manually
        formState: { errors }
    } = useForm();

    const imageFile = watch("image");

    // Toggle Tag Selection
    const toggleTag = (tag) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];

        setSelectedTags(newTags);
        setValue("tags", newTags, { shouldValidate: true }); // Update RHF value
    };

    const onSubmit = async (data) => {
        if (selectedTags.length === 0) {
            // setTagError("Select at least 1 tag"); // if you have error state
            return;
        }

        const fileToUpload = data.image?.[0];
        if (!fileToUpload) {
            Swal.fire({
                title: "Image required",
                text: "Please select an image before submitting.",
                icon: "warning",
                confirmButtonColor: "var(--color-primary)",
            });
            return;
        }

        setLoading(true);

        try {
            // 1) Upload image to imgbb
            const imgURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

            const formData = new FormData();
            formData.append("image", fileToUpload);

            // (Don't force Content-Type; axios will set proper boundary)
            const imgRes = await axios.post(imgURL, formData);

            const image = imgRes?.data?.data?.display_url;
            if (!image) throw new Error("Image upload failed. No URL returned.");

            // 2) Prepare payload
            const payload = {
                ...data,
                entryFee: Number(data.entryFee),
                prizeMoney: Number(data.prizeMoney),
                image,
                tags: selectedTags,
                creatorName: user?.displayName || "",
                creatorEmail: user?.email || "",
            };

            // 3) Create contest (YOU MISSED await here)
            const apiRes = await axiosSecure.post("/creator/contest/create", payload);
            if (![200, 201].includes(apiRes.status)) {
                throw new Error("Server responded with an unexpected status.");
            }

            Swal.fire({
                title: "Contest Created!",
                text: "Your contest has been submitted for approval.",
                icon: "success",
                confirmButtonColor: "var(--color-primary)",
            });

            // reset(); // if using react-hook-form
            // setSelectedTags([]); // if needed
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Failed!",
                text: err?.response?.data?.message || err?.message || "Something went wrong",
                icon: "error",
                confirmButtonColor: "var(--color-primary)",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-full max-w-4xl mx-auto">

            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-base-content">Create Contest</h2>
                    <p className="text-base-content/60 mt-1">Launch a new challenge for the community.</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
                    <FaLightbulb />
                </div>
            </div>

            {/* Form Card */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body p-6 md:p-8">

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* --- ROW 1: Name & Type --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contest Name */}
                            <div className="form-control">
                                <label className="label font-bold text-base-content/70">Contest Name</label>
                                <div className="relative">
                                    <FaTrophy className="absolute left-3 top-3.5 text-base-content/30" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Mobile App UI Design"
                                        className={`input input-bordered w-full pl-10 focus:input-primary ${errors.contestName ? 'input-error' : ''}`}
                                        {...register("contestName", { required: "Contest name is required" })}
                                    />
                                </div>
                                {errors.contestName && <span className="text-error text-xs mt-1">{errors.contestName.message}</span>}
                            </div>

                            {/* Contest Type (Multi-Select) */}
                            <div className="form-control">
                                <label className="label font-bold text-base-content/70">Contest Type (Select Multiple)</label>
                                <div className="flex flex-wrap gap-2 p-2 border border-base-300 rounded-lg bg-base-100">
                                    {availableTags.map(tag => (
                                        <button
                                            type="button"
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`badge badge-lg cursor-pointer transition-all gap-1 select-none
                                                ${selectedTags.includes(tag)
                                                    ? 'badge-primary text-white scale-105'
                                                    : 'badge-ghost text-base-content/60 hover:bg-base-200'}`}
                                        >
                                            {selectedTags.includes(tag) && <FaCheck className="text-xs" />}
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                {/* Hidden input for React Hook Form Validation */}
                                <input
                                    type="hidden"
                                    {...register("tags", {
                                        validate: (value) => value && value.length > 0 || "Select at least one type"
                                    })}
                                />
                                {errors.tags && <span className="text-error text-xs mt-1">{errors.tags.message}</span>}
                            </div>
                        </div>

                        {/* --- ROW 2: Price, Prize & Deadline --- */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Entry Fee */}
                            <div className="form-control">
                                <label className="label font-bold text-base-content/70">Entry Fee ($)</label>
                                <div className="relative">
                                    <FaDollarSign className="absolute left-3 top-3.5 text-base-content/30" />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="input input-bordered w-full pl-10 focus:input-primary"
                                        {...register("entryFee", { required: "Price is required", min: 0 })}
                                    />
                                </div>
                            </div>

                            {/* Prize Money */}
                            <div className="form-control">
                                <label className="label font-bold text-base-content/70">Prize Money ($)</label>
                                <div className="relative">
                                    <FaTrophy className="absolute left-3 top-3.5 text-base-content/30" />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="input input-bordered w-full pl-10 focus:input-primary"
                                        {...register("prizeMoney", { required: "Prize is required", min: 0 })}
                                    />
                                </div>
                            </div>

                            {/* DatePicker */}
                            <div className="form-control">
                                <label className="label font-bold text-base-content/70">Deadline</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-3.5 text-base-content/30 z-10 pointer-events-none" />
                                    <Controller
                                        control={control}
                                        name="deadline"
                                        rules={{ required: "Deadline is required" }}
                                        render={({ field }) => (
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date) => field.onChange(date)}
                                                className="input input-bordered w-full pl-10 focus:input-primary cursor-pointer"
                                                placeholderText="Select deadline"
                                                dateFormat="MMMM d, yyyy"
                                                minDate={new Date()}
                                            />
                                        )}
                                    />
                                </div>
                                {errors.deadline && <span className="text-error text-xs mt-1">{errors.deadline.message}</span>}
                            </div>
                        </div>

                        {/* --- ROW 3: Image Upload --- */}
                        <div className="form-control">
                            <label className="label font-bold text-base-content/70">Contest Banner Image</label>
                            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all 
                                ${imageFile && imageFile.length > 0 ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'}`}>

                                <input
                                    type="file"
                                    id="contestImage"
                                    className="hidden"
                                    accept="image/*"
                                    {...register("image", { required: "Image is required" })}
                                />

                                <label htmlFor="contestImage" className="cursor-pointer flex flex-col items-center gap-2">
                                    {imageFile && imageFile.length > 0 ? (
                                        <>
                                            <div className="badge badge-primary badge-lg gap-2">
                                                <FaImage /> Image Selected
                                            </div>
                                            <p className="text-sm opacity-70">{imageFile[0].name}</p>
                                        </>
                                    ) : (
                                        <>
                                            <FaImage className="text-4xl text-base-content/20" />
                                            <span className="text-base-content/60 font-medium">Click to upload banner</span>
                                            <span className="text-xs text-base-content/40">JPG, PNG up to 5MB</span>
                                        </>
                                    )}
                                </label>
                            </div>
                            {errors.image && <span className="text-error text-xs mt-1">{errors.image.message}</span>}
                        </div>

                        {/* --- ROW 4: Description (TextArea 1) --- */}
                        <div className="form-control">
                            <label className="label font-bold text-base-content/70">Description</label>
                            <div className="relative">
                                <FaAlignLeft className="absolute left-3 top-4 text-base-content/30" />
                                <textarea
                                    className="textarea textarea-bordered w-full h-32 pl-10 focus:textarea-primary text-base"
                                    placeholder="Describe the contest overview and goals..."
                                    {...register("description", { required: "Description is required", minLength: 20 })}
                                ></textarea>
                            </div>
                            {errors.description && <span className="text-error text-xs mt-1">Please provide a detailed description.</span>}
                        </div>

                        {/* --- ROW 5: Instructions (TextArea 2) --- */}
                        <div className="form-control">
                            <label className="label font-bold text-base-content/70">Submission Instructions</label>
                            <div className="relative">
                                <FaListOl className="absolute left-3 top-4 text-base-content/30" />
                                <textarea
                                    className="textarea textarea-bordered w-full h-32 pl-10 focus:textarea-primary text-base"
                                    placeholder="Step 1: Create a design...&#10;Step 2: Submit files in PDF format...&#10;Step 3: Ensure resolution is 1920x1080..."
                                    {...register("instruction", { required: "Instructions are required" })}
                                ></textarea>
                            </div>
                            <label className="label">
                                <span className="label-text-alt text-base-content/50">Provide step-by-step guidance for participants.</span>
                            </label>
                            {errors.instruction && <span className="text-error text-xs mt-1">{errors.instruction.message}</span>}
                        </div>

                        {/* --- Submit Button --- */}
                        <div className="form-control mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full md:w-auto md:self-end text-lg px-12"
                            >
                                {loading ? <span className="loading loading-spinner"></span> : "Create Contest"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateContest;