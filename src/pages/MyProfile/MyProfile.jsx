import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../../context/AuthContext/AuthContext';
import { 
    FaUserEdit, FaSave, FaTimes, FaTrophy, FaWallet, 
    FaMedal, FaEnvelope, FaMapMarkerAlt, FaCamera 
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const MyProfile = () => {
    const { user } = useContext(AuthContext); 
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            displayName: user?.displayName || "",
            photoURL: user?.photoURL || "",
            phone: "+880 1700-000000",
            address: "Dhaka, Bangladesh",
            bio: "Passionate contestant and creative thinker."
        }
    });

    const onSubmit = (data) => {
        setLoading(true);
        console.log("Updated Data:", data);
        
        setTimeout(() => {
            Swal.fire({
                title: "Profile Updated!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            setIsEditing(false);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            
            {/* --- HEADER SECTION --- */}
            <div className="relative mb-20 md:mb-24">
                
                {/* 1. Cover Image (Cyan/Blue Gradient like screenshot) */}
                <div className="h-48 md:h-64 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 overflow-hidden shadow-lg relative">
                     {/* Subtle texture overlay */}
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                     
                     {/* 2. TOGGLE BUTTON (Matches screenshot style) */}
                     <div className="absolute top-4 right-4 z-10">
                        <label className="cursor-pointer flex items-center gap-2 bg-[#004d61]/40 hover:bg-[#004d61]/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all shadow-sm">
                            <span className="text-white font-bold text-xs uppercase tracking-wider">
                                View Mode
                            </span>
                            <input 
                                type="checkbox" 
                                className="toggle toggle-sm toggle-accent border-white/20 bg-opacity-80"
                                checked={isEditing}
                                onChange={() => setIsEditing(!isEditing)}
                            />
                        </label>
                     </div>
                </div>

                {/* Avatar Wrapper */}
                <div className="absolute -bottom-16 left-6 md:left-10 flex items-end gap-4">
                    <div className="avatar">
                        <div className="w-32 md:w-40 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-4 shadow-2xl relative bg-base-100">
                            <img src={user?.photoURL || "https://i.pravatar.cc/300"} alt="Profile" className="object-cover" />
                            
                            {/* Camera Icon (Only in Edit Mode) */}
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                                    <FaCamera className="text-white text-2xl" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Name & Role */}
                    <div className="mb-0 hidden md:block">
                        <h1 className="text-3xl font-black text-base-content">{user?.displayName || "User Name"}</h1>
                        <div className="badge badge-primary badge-outline font-bold mt-1 uppercase text-xs tracking-widest">
                            User / Creator
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
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    <FaUserEdit className="text-primary" /> Personal Information
                                </h3>
                                {isEditing && (
                                    <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                                        <button 
                                            onClick={() => setIsEditing(false)} 
                                            className="btn btn-sm btn-ghost text-error"
                                        >
                                            <FaTimes /> Cancel
                                        </button>
                                        <button 
                                            onClick={handleSubmit(onSubmit)} 
                                            className="btn btn-sm btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? <span className="loading loading-spinner loading-xs"></span> : <><FaSave /> Save</>}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* --- FORM FIELDS --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="form-control">
                                    <label className="label font-bold text-base-content/60">Full Name</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            className="input input-bordered focus:input-primary" 
                                            {...register("displayName", { required: true })}
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold">{user?.displayName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="form-control">
                                    <label className="label font-bold text-base-content/60">Email</label>
                                    <div className="flex items-center gap-2 text-lg font-semibold opacity-70 cursor-not-allowed">
                                        <FaEnvelope className="text-sm" /> {user?.email}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="form-control">
                                    <label className="label font-bold text-base-content/60">Phone</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            className="input input-bordered focus:input-primary" 
                                            {...register("phone")}
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold">+880 1700-000000</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="form-control">
                                    <label className="label font-bold text-base-content/60">Address</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            className="input input-bordered focus:input-primary" 
                                            {...register("address")}
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-error" /> Dhaka, Bangladesh
                                        </p>
                                    )}
                                </div>

                                {/* Bio */}
                                <div className="form-control md:col-span-2">
                                    <label className="label font-bold text-base-content/60 mr-2">About Me</label>
                                    {isEditing ? (
                                        <textarea 
                                            className="textarea textarea-bordered h-24 focus:textarea-primary text-base"
                                            {...register("bio")}
                                        ></textarea>
                                    ) : (
                                        <p className="text-base-content/80 leading-relaxed">
                                            "Passionate contestant and creative thinker. I love participating in UI/UX challenges and coding hackathons."
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Stats */}
                <div className="space-y-6">
                    {/* Win Rate Card */}
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body items-center text-center">
                            <h3 className="font-bold text-gray-500 mb-4 uppercase text-xs tracking-widest">Performance</h3>
                            <div className="radial-progress text-primary font-black text-2xl" style={{"--value":68, "--size": "8rem", "--thickness": "10px"}} role="progressbar">
                                68%
                                <span className="block text-xs font-normal text-base-content/50 mt-1">Win Rate</span>
                            </div>
                            <div className="divider my-2"></div>
                            <div className="w-full grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-black text-base-content">42</p>
                                    <p className="text-xs text-base-content/60 font-bold uppercase">Contests</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-yellow-500">12</p>
                                    <p className="text-xs text-base-content/60 font-bold uppercase">Wins</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats List */}
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