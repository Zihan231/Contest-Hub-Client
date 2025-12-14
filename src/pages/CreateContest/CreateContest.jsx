import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form'; // 1. Import Controller
import { 
    FaTrophy, FaImage, FaDollarSign, FaCalendarAlt, 
    FaAlignLeft, FaTags, FaLightbulb 
} from 'react-icons/fa';
import Swal from 'sweetalert2';

// 2. Import React Datepicker & CSS
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateContest = () => {
    const [loading, setLoading] = useState(false);
    
    const { 
        register, 
        handleSubmit, 
        watch,
        control, // 3. Get 'control' for the DatePicker
        formState: { errors } 
    } = useForm();

    const imageFile = watch("image");

    const onSubmit = async (data) => {
        setLoading(true);
        // Note: data.deadline will now be a proper Date object
        console.log("Contest Data:", data);

        setTimeout(() => {
            Swal.fire({
                title: "Contest Created!",
                text: "Your contest has been submitted for approval.",
                icon: "success",
                confirmButtonColor: "var(--color-primary)"
            });
            setLoading(false);
        }, 1500);
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
                                        className={`input input-bordered w-full pl-10 focus:input-primary ${errors.name ? 'input-error' : ''}`}
                                        {...register("name", { required: "Contest name is required" })}
                                    />
                                </div>
                                {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
                            </div>

                            {/* Contest Type */}
                            <div className="form-control">
                                <label className="label font-bold text-base-content/70">Contest Type</label>
                                <div className="relative">
                                    <FaTags className="absolute left-3 top-3.5 text-base-content/30 z-10" />
                                    <select 
                                        className="select select-bordered w-full pl-10 focus:select-primary"
                                        defaultValue=""
                                        {...register("type", { required: "Please select a type" })}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        <option value="Image Design">Image Design</option>
                                        <option value="Article Writing">Article Writing</option>
                                        <option value="Marketing Strategy">Marketing Strategy</option>
                                        <option value="Digital Advertisement">Digital Advertisement</option>
                                        <option value="Gaming Review">Gaming Review</option>
                                        <option value="Business Idea">Business Idea</option>
                                    </select>
                                </div>
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
                                        {...register("price", { required: "Price is required", min: 0 })}
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
                                        {...register("prize", { required: "Prize is required", min: 0 })}
                                    />
                                </div>
                            </div>

                            {/* --- React DatePicker Implementation --- */}
                            <div className="form-control">
                                <label className="label font-bold text-base-content/70">Deadline</label>
                                <div className="relative">
                                    {/* Icon is absolutely positioned over the input */}
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
                                                minDate={new Date()} // Disable past dates
                                                showTimeSelect={false} // Change to true if you want time
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

                        {/* --- ROW 4: Description --- */}
                        <div className="form-control">
                            <label className="label font-bold text-base-content/70">Description & Instructions</label>
                            <div className="relative">
                                <FaAlignLeft className="absolute left-3 top-4 text-base-content/30" />
                                <textarea 
                                    className="textarea textarea-bordered w-full h-32 pl-10 focus:textarea-primary text-base" 
                                    placeholder="Describe the contest task, rules, and requirements in detail..."
                                    {...register("description", { required: "Description is required", minLength: 20 })}
                                ></textarea>
                            </div>
                            {errors.description && <span className="text-error text-xs mt-1">Please provide a detailed description (min 20 chars).</span>}
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