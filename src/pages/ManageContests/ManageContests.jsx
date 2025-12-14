import React, { useState } from 'react';
import { FaTrashAlt, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageContests = () => {
    // --- MOCK DATA (Replace with useQuery / axios.get) ---
    const [contests, setContests] = useState([
        { id: 1, title: "Mobile App UI Design", creator: "John Doe", email: "john@example.com", deadline: "2025-12-30", prize: "$500", status: "Pending" },
        { id: 2, title: "Python AI Chatbot", creator: "Jane Smith", email: "jane@test.com", deadline: "2025-11-15", prize: "$1200", status: "Approved" },
        { id: 3, title: "Logo Design for Tech", creator: "Mike Ross", email: "mike@corp.com", deadline: "2025-10-20", prize: "$300", status: "Pending" },
        { id: 4, title: "SEO Article Writing", creator: "Sarah Lee", email: "sarah@writer.com", deadline: "2025-12-05", prize: "$150", status: "Rejected" },
    ]);

    // --- CALCULATE STATS ---
    const pendingCount = contests.filter(c => c.status === "Pending").length;
    const runningCount = contests.filter(c => c.status === "Approved").length;

    // --- HANDLERS ---

    // 1. Handle Approve
    const handleApprove = (contest) => {
        Swal.fire({
            title: "Approve Contest?",
            text: `You are about to approve "${contest.title}".`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "var(--color-success, #22c55e)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Approve it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // API Call would go here
                
                const updatedContests = contests.map(c => 
                    c.id === contest.id ? { ...c, status: "Approved" } : c
                );
                setContests(updatedContests);

                Swal.fire("Approved!", "The contest is now live.", "success");
            }
        });
    };

    // 2. Handle Reject
    const handleReject = (contest) => {
        Swal.fire({
            title: "Reject Contest?",
            text: `This will mark "${contest.title}" as rejected.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-warning, #facc15)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Reject it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // API Call would go here
                
                const updatedContests = contests.map(c => 
                    c.id === contest.id ? { ...c, status: "Rejected" } : c
                );
                setContests(updatedContests);
                
                Swal.fire("Rejected", "The contest has been rejected.", "info");
            }
        });
    };

    // 3. Handle Delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "var(--color-neutral, #3d4451)",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // API Call would go here
                
                const remainingContests = contests.filter(c => c.id !== id);
                setContests(remainingContests);

                Swal.fire("Deleted!", "The contest has been deleted.", "success");
            }
        });
    };

    return (
        <div className="w-full space-y-8">
            
            {/* --- IMPROVED HEADER (Stats Widget) --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-base-content">Manage Contests</h2>
                    <p className="text-base-content/60">Review and manage all user-submitted contests.</p>
                </div>

                <div className="stats shadow bg-base-100 border border-base-200">
                    {/* Total */}
                    <div className="stat place-items-center px-6 py-2">
                        <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60">Total</div>
                        <div className="stat-value text-primary text-2xl">{contests.length}</div>
                    </div>
                    
                    {/* Pending */}
                    <div className="stat place-items-center px-6 py-2 border-l border-base-200">
                        <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60">Pending</div>
                        <div className="stat-value text-warning text-2xl">{pendingCount}</div>
                    </div>

                    {/* Live */}
                    <div className="stat place-items-center px-6 py-2 border-l border-base-200">
                        <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60">Live</div>
                        <div className="stat-value text-success text-2xl">{runningCount}</div>
                    </div>
                </div>
            </div>

            {/* --- TABLE CARD --- */}
            <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        
                        {/* Table Head */}
                        <thead className="bg-base-200/50 text-base-content/60">
                            <tr>
                                <th>#</th>
                                <th>Contest Details</th>
                                <th>Creator</th>
                                <th>Deadline</th>
                                <th>Price/Prize</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {contests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 opacity-50">No contests found.</td>
                                </tr>
                            ) : (
                                contests.map((contest, index) => (
                                    <tr key={contest.id}>
                                        <th>{index + 1}</th>
                                        
                                        {/* Title Column */}
                                        <td>
                                            <div className="font-bold">{contest.title}</div>
                                            <div className="text-xs opacity-50">ID: {contest.id}</div>
                                        </td>

                                        {/* Creator Info */}
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                                                        <span className="text-xs">{contest.creator.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-xs">{contest.creator}</div>
                                                    <div className="text-[10px] opacity-50">{contest.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Deadline */}
                                        <td className="text-xs font-mono">{contest.deadline}</td>

                                        {/* Prize */}
                                        <td className="font-bold text-success">{contest.prize}</td>

                                        {/* Status Badge */}
                                        <td>
                                            <div className={`badge badge-sm font-bold border-none text-white
                                                ${contest.status === 'Approved' ? 'badge-success' : ''}
                                                ${contest.status === 'Pending' ? 'badge-warning' : ''}
                                                ${contest.status === 'Rejected' ? 'badge-error' : ''}
                                            `}>
                                                {contest.status}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="text-right space-x-2">
                                            
                                            {/* Confirm Button */}
                                            {contest.status !== 'Approved' && (
                                                <button 
                                                    onClick={() => handleApprove(contest)}
                                                    className="btn btn-sm btn-success btn-circle text-white tooltip tooltip-left"
                                                    data-tip="Confirm"
                                                >
                                                    <FaCheck />
                                                </button>
                                            )}

                                            {/* Reject Button */}
                                            {contest.status === 'Pending' && (
                                                <button 
                                                    onClick={() => handleReject(contest)}
                                                    className="btn btn-sm btn-warning btn-circle text-white tooltip tooltip-left"
                                                    data-tip="Reject"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}

                                            {/* Delete Button */}
                                            <button 
                                                onClick={() => handleDelete(contest.id)}
                                                className="btn btn-sm btn-error btn-outline btn-circle tooltip tooltip-left"
                                                data-tip="Delete"
                                            >
                                                <FaTrashAlt />
                                            </button>

                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageContests;