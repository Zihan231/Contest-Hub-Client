import React, { useState } from 'react';
import { Link } from 'react-router';
import { FaEdit, FaTrashAlt, FaListAlt, FaCalendarAlt, FaTrophy, FaUserFriends } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useForm, Controller } from 'react-hook-form';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyCreatedContests = () => {
    // ... (State and Handlers remain the same) ...
    const [contests, setContests] = useState([
        { id: 1, title: "Modern Logo Design", deadline: "2025-12-30", prize: "200", category: "Image Design", description: "Create a minimal logo.", status: "Pending", submissionCount: 0 },
        { id: 2, title: "Gaming Blog Post", deadline: "2025-11-10", prize: "50", category: "Article Writing", description: "Write 500 words about RPGs.", status: "Confirmed", submissionCount: 12 },
        { id: 3, title: "E-commerce UI Kit", deadline: "2025-10-05", prize: "500", category: "Image Design", description: "Mobile app UI for shop.", status: "Rejected", submissionCount: 0 },
        { id: 4, title: "Social Media Banner", deadline: "2025-12-01", prize: "100", category: "Digital Advertisement", description: "Facebook banner ads.", status: "Pending", submissionCount: 0 },
        { id: 5, title: "Video Intro", deadline: "2025-12-01", prize: "100", category: "Digital Advertisement", description: "Facebook banner ads.", status: "Pending", submissionCount: 0 },
    ]);

    const [editingContest, setEditingContest] = useState(null);
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

    const openEditModal = (contest) => {
        setEditingContest(contest);
        reset({
            title: contest.title,
            category: contest.category,
            prize: contest.prize,
            deadline: new Date(contest.deadline),
            description: contest.description
        });
        document.getElementById('edit_modal').showModal();
    };

    const handleUpdate = (data) => {
        const formattedDate = data.deadline.toISOString().split('T')[0];
        const finalData = { ...data, deadline: formattedDate };
        const updatedList = contests.map(c => 
            c.id === editingContest.id ? { ...c, ...finalData } : c
        );
        setContests(updatedList);
        document.getElementById('edit_modal').close();
        Swal.fire({ position: "top-end", icon: "success", title: "Updated successfully", showConfirmButton: false, timer: 1500 });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Contest?", text: "Cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setContests(contests.filter(c => c.id !== id));
                Swal.fire("Deleted!", "Contest removed.", "success");
            }
        });
    };

    const renderStatusBadge = (status) => (
        <div className={`badge badge-sm font-bold border-none text-white p-3 ${status === 'Confirmed' ? 'badge-success' : ''} ${status === 'Pending' ? 'badge-warning' : ''} ${status === 'Rejected' ? 'badge-error' : ''}`}>
            {status === 'Confirmed' ? 'Approved' : status}
        </div>
    );

    return (
        <div className="w-full space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-base-content">My Contests</h2>
                    <p className="text-sm sm:text-base text-base-content/60">Manage your created contests.</p>
                </div>
                <Link to="/dashboard/creator/create" className="btn btn-primary w-full sm:w-auto gap-2">
                    <FaEdit /> <span className="hidden sm:inline">Create New</span><span className="sm:hidden">New</span>
                </Link>
            </div>

            {/* --- VIEW 1: DESKTOP TABLE --- */}
            {/* Added 'overflow-visible' to the card to help, but changing tooltip direction is key */}
            <div className="hidden md:block card bg-base-100 shadow-xl border border-base-200 overflow-visible">
                <div className="overflow-x-auto overflow-y-visible">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200/50 text-base-content/60">
                            <tr>
                                <th>#</th>
                                <th>Contest Title</th>
                                <th>Deadline</th>
                                <th>Prize</th>
                                <th>Status</th>
                                <th className="text-center">Submissions</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contests.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-10 opacity-50">You haven't created any contests yet.</td></tr>
                            ) : (
                                contests.map((contest, index) => (
                                    <tr key={contest.id}>
                                        <th>{index + 1}</th>
                                        <td className="font-bold">{contest.title}</td>
                                        <td className="font-mono text-xs">{contest.deadline}</td>
                                        <td className="font-bold text-success">${contest.prize}</td>
                                        <td>{renderStatusBadge(contest.status)}</td>
                                        <td className="text-center">
                                            {contest.status === 'Confirmed' ? <span className="font-bold">{contest.submissionCount}</span> : <span className="opacity-30">-</span>}
                                        </td>
                                        <td className="text-right">
                                            <div className="flex justify-end gap-2">
                                                
                                                {/* CHANGED TO TOOLTIP-LEFT */}
                                                <Link 
                                                    to={`/dashboard/contest/${contest.id}/submissions`}
                                                    className={`btn btn-sm btn-ghost text-primary tooltip tooltip-left ${contest.status !== 'Confirmed' ? 'btn-disabled opacity-20' : ''}`}
                                                    data-tip="See Submissions"
                                                >
                                                    <FaListAlt className="text-lg" />
                                                </Link>

                                                {contest.status === 'Pending' && (
                                                    <>
                                                        {/* CHANGED TO TOOLTIP-LEFT */}
                                                        <button 
                                                            onClick={() => openEditModal(contest)} 
                                                            className="btn btn-sm btn-ghost text-info tooltip tooltip-left" 
                                                            data-tip="Edit"
                                                        >
                                                            <FaEdit className="text-lg" />
                                                        </button>
                                                        
                                                        {/* CHANGED TO TOOLTIP-LEFT */}
                                                        <button 
                                                            onClick={() => handleDelete(contest.id)} 
                                                            className="btn btn-sm btn-ghost text-error tooltip tooltip-left" 
                                                            data-tip="Delete"
                                                        >
                                                            <FaTrashAlt className="text-lg" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- VIEW 2: MOBILE CARDS --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {contests.length === 0 ? (
                    <div className="text-center py-10 opacity-50">You haven't created any contests yet.</div>
                ) : (
                    contests.map((contest) => (
                        <div key={contest.id} className="card bg-base-100 shadow-md border border-base-200">
                            <div className="card-body p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg leading-tight">{contest.title}</h3>
                                    {renderStatusBadge(contest.status)}
                                </div>
                                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                                    <div className="flex items-center gap-2 opacity-70">
                                        <FaCalendarAlt className="text-primary" /> <span className="font-mono">{contest.deadline}</span>
                                    </div>
                                    <div className="flex items-center gap-2 font-bold text-success justify-end"><FaTrophy /> ${contest.prize}</div>
                                    <div className="flex items-center gap-2 opacity-70 col-span-2">
                                        <FaUserFriends className="text-info" /> {contest.status === 'Confirmed' ? `${contest.submissionCount} Submissions` : 'No submissions yet'}
                                    </div>
                                </div>
                                <div className="card-actions justify-end border-t border-base-200 pt-3">
                                    <Link to={`/dashboard/contest/${contest.id}/submissions`} className={`btn btn-sm btn-outline btn-primary ${contest.status !== 'Confirmed' ? 'btn-disabled opacity-50' : ''}`}>Submissions</Link>
                                    {contest.status === 'Pending' && (
                                        <>
                                            <button onClick={() => openEditModal(contest)} className="btn btn-sm btn-square btn-ghost text-info border border-base-200"><FaEdit /></button>
                                            <button onClick={() => handleDelete(contest.id)} className="btn btn-sm btn-square btn-ghost text-error border border-base-200"><FaTrashAlt /></button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- EDIT MODAL --- */}
            <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box overflow-visible">
                    <h3 className="font-bold text-lg mb-4">Edit Contest</h3>
                    <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Contest Title</span></label>
                            <input type="text" className="input input-bordered w-full" {...register("title", { required: true })} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Category</span></label>
                                <select className="select select-bordered" {...register("category")}>
                                    <option value="Image Design">Image Design</option>
                                    <option value="Article Writing">Article Writing</option>
                                    <option value="Digital Advertisement">Digital Advertisement</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Prize ($)</span></label>
                                <input type="number" className="input input-bordered w-full" {...register("prize", { required: true })} />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Deadline</span></label>
                            <Controller control={control} name="deadline" rules={{ required: true }} render={({ field }) => (
                                <DatePicker selected={field.value} onChange={(date) => field.onChange(date)} className="input input-bordered w-full" dateFormat="yyyy-MM-dd" minDate={new Date()} placeholderText="Select a deadline" />
                            )} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Description</span></label>
                            <textarea className="textarea textarea-bordered h-24" {...register("description", { required: true })}></textarea>
                        </div>
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => document.getElementById('edit_modal').close()}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
        </div>
    );
};

export default MyCreatedContests;