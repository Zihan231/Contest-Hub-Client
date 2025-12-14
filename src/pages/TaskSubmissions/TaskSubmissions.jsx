import React, { useState } from 'react';
import { FaTrophy, FaEye, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const TaskSubmissions = () => {
    // --- MOCK DATA ---
    const [submissions, setSubmissions] = useState([
        { id: 1, contestId: 101, contestTitle: "Modern Logo Design", participantName: "Alice Green", email: "alice@test.com", taskLink: "https://dribbble.com/shots/example1", submittedAt: "2025-12-28", status: "Pending" },
        { id: 2, contestId: 101, contestTitle: "Modern Logo Design", participantName: "Bob Brown", email: "bob@test.com", taskLink: "https://dribbble.com/shots/example2", submittedAt: "2025-12-29", status: "Pending" },
        { id: 3, contestId: 102, contestTitle: "Gaming Blog Post", participantName: "Charlie Day", email: "charlie@writer.com", taskLink: "https://medium.com/example-post", submittedAt: "2025-11-08", status: "Winner" },
        { id: 4, contestId: 102, contestTitle: "Gaming Blog Post", participantName: "Dave Wilson", email: "dave@writer.com", taskLink: "https://medium.com/example-post-2", submittedAt: "2025-11-09", status: "Pending" }, 
        { id: 5, contestId: 103, contestTitle: "Social Media Banner", participantName: "Eve Polastri", email: "eve@design.com", taskLink: "https://behance.net/example3", submittedAt: "2025-12-01", status: "Pending" },
    ]);

    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // --- HELPER: CHECK IF CONTEST ALREADY HAS A WINNER ---
    const hasContestWinner = (contestId) => {
        return submissions.some(sub => sub.contestId === contestId && sub.status === 'Winner');
    };

    // --- HANDLER: DECLARE WINNER ---
    const handleDeclareWinner = (submission) => {
        // Double check in case UI didn't catch it
        if (hasContestWinner(submission.contestId)) {
            Swal.fire("Error", "This contest already has a winner.", "error");
            return;
        }

        Swal.fire({
            title: "Declare Winner?",
            text: `Are you sure you want to make ${submission.participantName} the winner of "${submission.contestTitle}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "var(--color-warning, #facc15)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Declare Winner!"
        }).then((result) => {
            if (result.isConfirmed) {
                // API Call would go here...

                // Update Local State
                const updatedList = submissions.map(sub => {
                    if (sub.id === submission.id) {
                        return { ...sub, status: 'Winner' };
                    }
                    return sub;
                });
                setSubmissions(updatedList);
                
                // Close modal if open
                const modal = document.getElementById('details_modal');
                if (modal) modal.close();

                Swal.fire({
                    title: "Winner Declared!",
                    text: "The participant has been notified.",
                    icon: "success",
                    confirmButtonColor: "var(--color-primary)"
                });
            }
        });
    };

    // --- OPEN DETAILS MODAL ---
    const openDetails = (submission) => {
        setSelectedSubmission(submission);
        document.getElementById('details_modal').showModal();
    };

    return (
        <div className="w-full space-y-6">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-base-content">Submitted Tasks</h2>
                    <p className="text-base-content/60">Review submissions and select winners.</p>
                </div>
            </div>

            {/* --- VIEW 1: DESKTOP TABLE --- */}
            <div className="hidden md:block card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200/50 text-base-content/60">
                            <tr>
                                <th>Contest Info</th>
                                <th>Participant</th>
                                <th>Submitted At</th>
                                <th>Status</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub) => {
                                // Check if this specific contest is closed (has a winner)
                                const isContestClosed = hasContestWinner(sub.contestId);
                                
                                return (
                                    <tr key={sub.id} className={sub.status === 'Winner' ? 'bg-warning/10' : ''}>
                                        <td>
                                            <div className="font-bold">{sub.contestTitle}</div>
                                            <div className="text-xs opacity-50">ID: {sub.contestId}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                                                        <span className="text-xs">{sub.participantName.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-xs">{sub.participantName}</div>
                                                    <div className="text-[10px] opacity-50">{sub.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="font-mono text-xs">{sub.submittedAt}</td>
                                        <td>
                                            {sub.status === 'Winner' ? (
                                                <div className="badge badge-warning gap-1 font-bold text-xs">
                                                    <FaTrophy /> Winner
                                                </div>
                                            ) : (
                                                <div className="badge badge-ghost text-xs">Pending</div>
                                            )}
                                        </td>
                                        <td className="text-right">
                                            <div className="flex justify-end gap-2">
                                                
                                                {/* 1. DECLARE WINNER BUTTON (NEW) */}
                                                {/* Only show if contest doesn't have a winner yet */}
                                                {!isContestClosed && (
                                                    <button 
                                                        onClick={() => handleDeclareWinner(sub)} 
                                                        className="btn btn-sm btn-circle btn-warning text-white tooltip tooltip-left"
                                                        data-tip="Declare Winner"
                                                    >
                                                        <FaTrophy />
                                                    </button>
                                                )}

                                                {/* 2. VIEW DETAILS BUTTON */}
                                                <button 
                                                    onClick={() => openDetails(sub)} 
                                                    className="btn btn-sm btn-circle btn-ghost text-primary tooltip tooltip-left"
                                                    data-tip="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- VIEW 2: MOBILE CARDS --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {submissions.map((sub) => {
                    const isContestClosed = hasContestWinner(sub.contestId);
                    
                    return (
                        <div key={sub.id} className={`card shadow-md border border-base-200 ${sub.status === 'Winner' ? 'bg-warning/5 border-warning/30' : 'bg-base-100'}`}>
                            <div className="card-body p-5">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-sm text-primary">{sub.contestTitle}</h3>
                                    {sub.status === 'Winner' ? (
                                        <div className="badge badge-warning gap-1 font-bold text-xs"><FaTrophy /> Winner</div>
                                    ) : (
                                        <div className="badge badge-ghost text-xs">Pending</div>
                                    )}
                                </div>
                                
                                {/* Participant */}
                                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-base-200">
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                            <span>{sub.participantName.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold">{sub.participantName}</div>
                                        <div className="text-xs opacity-50">{sub.email}</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs opacity-70 mb-4">
                                    <span className="flex items-center gap-1"><FaClock /> {sub.submittedAt}</span>
                                </div>

                                {/* Actions Footer */}
                                <div className="flex gap-2">
                                    {/* View Button */}
                                    <button 
                                        onClick={() => openDetails(sub)} 
                                        className="btn btn-sm btn-outline btn-primary flex-1"
                                    >
                                        View Details
                                    </button>

                                    {/* Declare Winner Button (NEW) */}
                                    {!isContestClosed && (
                                        <button 
                                            onClick={() => handleDeclareWinner(sub)} 
                                            className="btn btn-sm btn-warning text-white flex-1 gap-1"
                                        >
                                            <FaTrophy /> Make Winner
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- DETAILS MODAL --- */}
            <dialog id="details_modal" className="modal modal-bottom sm:modal-middle">
                {selectedSubmission && (
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-1">{selectedSubmission.contestTitle}</h3>
                        <p className="text-xs text-base-content/60 uppercase tracking-wide mb-6">Submission Details</p>

                        <div className="space-y-4">
                            {/* Participant Card */}
                            <div className="flex items-center gap-4 bg-base-200/50 p-4 rounded-xl">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                                        <span className="text-xl">{selectedSubmission.participantName.charAt(0)}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold">{selectedSubmission.participantName}</h4>
                                    <p className="text-sm opacity-70">{selectedSubmission.email}</p>
                                </div>
                            </div>

                            {/* Task Link/Info */}
                            <div className="form-control">
                                <label className="label"><span className="label-text font-bold">Submitted Work</span></label>
                                <div className="mockup-code bg-base-300 text-base-content p-4 text-sm break-all">
                                    <code className="flex items-center gap-2">
                                        <FaExternalLinkAlt className="shrink-0 text-primary" />
                                        <a href={selectedSubmission.taskLink} target="_blank" rel="noopener noreferrer" className="link link-primary link-hover">
                                            {selectedSubmission.taskLink}
                                        </a>
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="modal-action flex justify-between items-center mt-8">
                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                            
                            {/* Duplicate Logic for Modal Button */}
                            {selectedSubmission.status === 'Winner' ? (
                                <button className="btn btn-warning btn-disabled gap-2 cursor-not-allowed opacity-100 text-white">
                                    <FaTrophy /> Winner Declared
                                </button>
                            ) : hasContestWinner(selectedSubmission.contestId) ? (
                                <button className="btn btn-disabled tooltip" data-tip="Winner already exists for this contest">
                                    Contest Closed
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleDeclareWinner(selectedSubmission)} 
                                    className="btn btn-warning gap-2 text-white"
                                >
                                    <FaTrophy /> Declare Winner
                                </button>
                            )}
                        </div>
                    </div>
                )}
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

        </div>
    );
};

export default TaskSubmissions;