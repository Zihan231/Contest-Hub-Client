import React, { useState } from 'react';
import { FaTrashAlt, FaCheck, FaTimes, FaCalendarAlt, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageContests = () => {
    // --- MOCK DATA ---
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
    const handleApprove = (contest) => {
        Swal.fire({
            title: "Approve Contest?",
            text: `You are about to approve "${contest.title}".`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "var(--color-success, #22c55e)",
            confirmButtonText: "Yes, Approve it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedContests = contests.map(c =>
                    c.id === contest.id ? { ...c, status: "Approved" } : c
                );
                setContests(updatedContests);
                Swal.fire("Approved!", "The contest is now live.", "success");
            }
        });
    };

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
                const updatedContests = contests.map(c =>
                    c.id === contest.id ? { ...c, status: "Rejected" } : c
                );
                setContests(updatedContests);
                Swal.fire("Rejected", "The contest has been rejected.", "info");
            }
        });
    };

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
                const remainingContests = contests.filter(c => c.id !== id);
                setContests(remainingContests);
                Swal.fire("Deleted!", "The contest has been deleted.", "success");
            }
        });
    };

    // Helper: Render Status Badge
    const renderStatusBadge = (status) => (
        <div className={`badge badge-sm font-bold border-none text-white
            ${status === 'Approved' ? 'badge-success' : ''}
            ${status === 'Pending' ? 'badge-warning' : ''}
            ${status === 'Rejected' ? 'badge-error' : ''}
        `}>
            {status}
        </div>
    );

    return (
        <div className="w-full space-y-8">

            {/* --- RESPONSIVE HEADER & STATS --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-base-content">Manage Contests</h2>
                    <p className="text-base-content/60">Review and manage all user-submitted contests.</p>
                </div>

                <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 border border-base-200 w-full xl:w-auto">
                    <div className="stat place-items-center px-6 py-3 lg:py-2">
                        <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60">Total</div>
                        <div className="stat-value text-primary text-2xl">{contests.length}</div>
                    </div>
                    <div className="stat place-items-center px-6 py-3 lg:py-2 lg:border-l border-base-200">
                        <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60">Pending</div>
                        <div className="stat-value text-warning text-2xl">{pendingCount}</div>
                    </div>
                    <div className="stat place-items-center px-6 py-3 lg:py-2 lg:border-l border-base-200">
                        <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60">Live</div>
                        <div className="stat-value text-success text-2xl">{runningCount}</div>
                    </div>
                </div>
            </div>

            {/* --- DESKTOP VIEW: TABLE --- */}
            <div className="hidden md:block card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
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
                        <tbody>
                            {contests.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-10 opacity-50">No contests found.</td></tr>
                            ) : (
                                contests.map((contest, index) => (
                                    <tr key={contest.id}>
                                        <th>{index + 1}</th>
                                        <td>
                                            <div className="font-bold">{contest.title}</div>
                                            <div className="text-xs opacity-50">ID: {contest.id}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                                                        <img src="https://www.shutterstock.com/shutterstock/photos/695508988/display_1500/stock-vector-initial-logo-letter-bb-with-heart-shape-red-colored-logo-design-for-wedding-invitation-wedding-695508988.jpg" alt=""/>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-xs">{contest.creator}</div>
                                                    <div className="text-[10px] opacity-50">{contest.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-xs font-mono">{contest.deadline}</td>
                                        <td className="font-bold text-success">{contest.prize}</td>
                                        <td>{renderStatusBadge(contest.status)}</td>
                                        <td className="text-right space-x-2">
                                            {contest.status !== 'Approved' && (
                                                <button onClick={() => handleApprove(contest)} className="btn btn-sm btn-success btn-circle text-white tooltip tooltip-left" data-tip="Confirm">
                                                    <FaCheck />
                                                </button>
                                            )}
                                            {contest.status === 'Pending' && (
                                                <button onClick={() => handleReject(contest)} className="btn btn-sm btn-warning btn-circle text-white tooltip tooltip-left" data-tip="Reject">
                                                    <FaTimes />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(contest.id)} className="btn btn-sm btn-error btn-outline btn-circle tooltip tooltip-left" data-tip="Delete">
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

            {/* --- MOBILE VIEW: CARDS --- */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {contests.map((contest) => (
                    <div key={contest.id} className="card bg-base-100 shadow-md border border-base-200">
                        <div className="card-body p-5">
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg leading-tight">{contest.title}</h3>
                                {renderStatusBadge(contest.status)}
                            </div>

                            {/* Creator Info */}
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-base-200">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                                        <img src="https://www.shutterstock.com/shutterstock/photos/695508988/display_1500/stock-vector-initial-logo-letter-bb-with-heart-shape-red-colored-logo-design-for-wedding-invitation-wedding-695508988.jpg" alt=""/>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{contest.creator}</div>
                                    <div className="text-xs opacity-50">{contest.email}</div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2 opacity-70">
                                    <FaCalendarAlt className="text-primary" />
                                    <span className="font-mono">{contest.deadline}</span>
                                </div>
                                <div className="flex items-center gap-2 font-bold text-success justify-end">
                                    Prize: {contest.prize}
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="card-actions justify-end border-t border-base-200 pt-3 gap-2">
                                {contest.status !== 'Approved' && (
                                    <button onClick={() => handleApprove(contest)} className="btn btn-sm btn-success text-white gap-2">
                                        <FaCheck /> Approve
                                    </button>
                                )}
                                {contest.status === 'Pending' && (
                                    <button onClick={() => handleReject(contest)} className="btn btn-sm btn-warning text-white gap-2">
                                        <FaTimes /> Reject
                                    </button>
                                )}
                                <button onClick={() => handleDelete(contest.id)} className="btn btn-sm btn-error btn-outline btn-square">
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ManageContests;