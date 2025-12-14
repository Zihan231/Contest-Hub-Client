import React, { useState } from 'react';
import { FaCreditCard, FaFileUpload, FaCheckCircle, FaClock, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

const MyParticipatedContests = () => {
    // --- MOCK DATA ---
    const [participations, setParticipations] = useState([
        { id: 1, title: "Mobile App UI Design", deadline: "2025-12-30", paymentStatus: "Paid", taskStatus: "Pending", prize: "$500" },
        { id: 2, title: "Python AI Chatbot", deadline: "2025-12-25", paymentStatus: "Pending", taskStatus: "Pending", prize: "$1200" },
        { id: 3, title: "Logo Design for Tech", deadline: "2025-12-28", paymentStatus: "Paid", taskStatus: "Submitted", prize: "$300" },
        { id: 4, title: "SEO Article Writing", deadline: "2026-01-05", paymentStatus: "Paid", taskStatus: "Pending", prize: "$150" },
    ]);

    const [selectedContest, setSelectedContest] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // --- SORT BY DEADLINE (Upcoming First) ---
    const sortedParticipations = [...participations].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // --- HANDLERS ---
    
    // 1. Payment Placeholder
    const handlePay = (contestId) => {
        console.log(`Redirecting to payment for contest ${contestId}`);
        // Add your payment logic here (Stripe/Gateway)
    };

    // 2. Open Submit Modal
    const openSubmitModal = (contest) => {
        setSelectedContest(contest);
        reset(); // Clear previous form
        document.getElementById('submit_task_modal').showModal();
    };

    // 3. Submit Task
    const handleTaskSubmit = (data) => {
        // API Call to submit task...
        console.log("Task Data:", data);

        // Update Local State
        const updatedList = participations.map(p => 
            p.id === selectedContest.id ? { ...p, taskStatus: "Submitted" } : p
        );
        setParticipations(updatedList);

        // UI Feedback
        document.getElementById('submit_task_modal').close();
        Swal.fire({
            title: "Task Submitted!",
            text: "Good luck with the contest.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
    };

    return (
        <div className="w-full space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-base-content">My Contests</h2>
                    <p className="text-base-content/60">Track your payments and submissions.</p>
                </div>
                <div className="badge badge-outline gap-2 p-3 font-semibold">
                    <FaClock className="text-warning" /> Sorted by Upcoming Deadline
                </div>
            </div>

            {/* --- VIEW 1: DESKTOP TABLE --- */}
            <div className="hidden md:block card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200/50 text-base-content/60">
                            <tr>
                                <th>Contest Info</th>
                                <th>Deadline</th>
                                <th>Payment</th>
                                <th>Task Status</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedParticipations.map((contest) => (
                                <tr key={contest.id}>
                                    <td>
                                        <div className="font-bold">{contest.title}</div>
                                        <div className="text-xs text-success flex items-center gap-1">
                                            <FaTrophy className="text-[10px]" /> Prize: {contest.prize}
                                        </div>
                                    </td>
                                    <td className="font-mono text-xs">{contest.deadline}</td>
                                    
                                    {/* Payment Status */}
                                    <td>
                                        {contest.paymentStatus === 'Paid' ? (
                                            <div className="badge badge-success badge-outline gap-1 font-bold text-xs">
                                                <FaCheckCircle /> Paid
                                            </div>
                                        ) : (
                                            <div className="badge badge-warning badge-outline gap-1 font-bold text-xs">
                                                Unpaid
                                            </div>
                                        )}
                                    </td>

                                    {/* Task Status */}
                                    <td>
                                        {contest.taskStatus === 'Submitted' ? (
                                            <div className="text-success text-xs font-bold flex items-center gap-1">
                                                <FaCheckCircle /> Submitted
                                            </div>
                                        ) : (
                                            <div className="text-warning text-xs font-bold">Pending</div>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="text-right">
                                        {/* Logic: If Unpaid -> Show Pay. If Paid & Pending -> Show Submit. Else -> Complete */}
                                        {contest.paymentStatus === 'Pending' ? (
                                            <button 
                                                onClick={() => handlePay(contest.id)} 
                                                className="btn btn-sm btn-warning text-white gap-2"
                                            >
                                                <FaCreditCard /> Pay
                                            </button>
                                        ) : contest.taskStatus === 'Pending' ? (
                                            <button 
                                                onClick={() => openSubmitModal(contest)} 
                                                className="btn btn-sm btn-primary gap-2"
                                            >
                                                <FaFileUpload /> Submit
                                            </button>
                                        ) : (
                                            <button className="btn btn-sm btn-disabled opacity-50">
                                                Completed
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- VIEW 2: MOBILE CARDS --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {sortedParticipations.map((contest) => (
                    <div key={contest.id} className="card bg-base-100 shadow-md border border-base-200">
                        <div className="card-body p-5">
                            
                            {/* Header */}
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg leading-tight">{contest.title}</h3>
                                <div className="badge badge-ghost text-xs font-mono">{contest.deadline}</div>
                            </div>

                            {/* Details */}
                            <div className="flex items-center justify-between text-sm mb-4">
                                <span className="text-success font-bold flex items-center gap-1">
                                    <FaTrophy /> {contest.prize}
                                </span>
                                
                                {contest.paymentStatus === 'Paid' ? (
                                    <span className="text-success text-xs font-bold flex items-center gap-1">
                                        <FaCheckCircle /> Paid
                                    </span>
                                ) : (
                                    <span className="text-warning text-xs font-bold">Payment Pending</span>
                                )}
                            </div>

                            {/* Status Bar */}
                            <div className="w-full bg-base-200 rounded-full h-2 mb-4 overflow-hidden">
                                <div 
                                    className={`h-full ${contest.taskStatus === 'Submitted' ? 'bg-success w-full' : 'bg-primary w-1/2'}`}
                                ></div>
                            </div>

                            {/* Actions */}
                            {contest.paymentStatus === 'Pending' ? (
                                <button 
                                    onClick={() => handlePay(contest.id)} 
                                    className="btn btn-sm btn-warning w-full text-white"
                                >
                                    <FaCreditCard /> Pay Now
                                </button>
                            ) : contest.taskStatus === 'Pending' ? (
                                <button 
                                    onClick={() => openSubmitModal(contest)} 
                                    className="btn btn-sm btn-primary w-full"
                                >
                                    <FaFileUpload /> Submit Task
                                </button>
                            ) : (
                                <button className="btn btn-sm btn-success btn-outline w-full cursor-default">
                                    <FaCheckCircle /> Task Submitted
                                </button>
                            )}

                        </div>
                    </div>
                ))}
            </div>

            {/* --- SUBMIT TASK MODAL --- */}
            <dialog id="submit_task_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-2">Submit Your Task</h3>
                    <p className="text-sm text-base-content/60 mb-4">
                        For <span className="font-bold text-primary">{selectedContest?.title}</span>
                    </p>
                    
                    <form onSubmit={handleSubmit(handleTaskSubmit)} className="space-y-4">
                        
                        {/* Task Link Input */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Project Link (Google Drive / GitHub / Live)</span></label>
                            <input 
                                type="url" 
                                placeholder="https://..." 
                                className="input input-bordered w-full" 
                                {...register("taskLink", { required: "Link is required" })}
                            />
                            {errors.taskLink && <span className="text-error text-xs mt-1">{errors.taskLink.message}</span>}
                        </div>

                        {/* Actions */}
                        <div className="modal-action">
                            <button 
                                type="button" 
                                className="btn" 
                                onClick={() => document.getElementById('submit_task_modal').close()}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <FaFileUpload /> Submit
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

        </div>
    );
};

export default MyParticipatedContests;