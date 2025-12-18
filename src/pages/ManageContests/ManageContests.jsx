import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    FaTrashAlt,
    FaCheck,
    FaTimes,
    FaCalendarAlt,
    FaUsers,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/axiosSecure/useAxiosSecure";

const ManageContests = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const getId = (c) => c?._id || c?.id;

    // Normalize status to lowercase so comparisons always work
    const normalizeStatus = (status) => String(status || "").trim().toLowerCase();

    // Status label for UI
    const statusLabel = (status) => {
        const s = normalizeStatus(status);
        if (s === "confirmed") return "Approved";
        if (s === "rejected") return "Rejected";
        return "Pending";
    };

    // Map backend fields to UI fields (safe if your fields differ)
    const mapContest = (c) => {
        const id = getId(c);
        const title = c?.contestName || c?.title || "Untitled Contest";
        const creator = c?.creatorName || c?.creator || "Unknown";
        const email = c?.creatorEmail || c?.email || "N/A";

        const deadlineRaw = c?.deadline || c?.contestDeadline || "";
        const deadline = String(deadlineRaw).includes("T")
            ? String(deadlineRaw).slice(0, 10)
            : String(deadlineRaw || "N/A");

        const prizeRaw = c?.prizeMoney ?? c?.prize ?? c?.reward ?? "";
        const prize =
            typeof prizeRaw === "number"
                ? `$${prizeRaw}`
                : prizeRaw
                    ? String(prizeRaw)
                    : "N/A";

        const status = normalizeStatus(c?.status);

        return { ...c, id, title, creator, email, deadline, prize, status };
    };

    //  FETCH contests
    const {
        data: contests = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["contests"],
        queryFn: async () => {
            const res = await axiosSecure.get("admin/contest/pending");
            const payload = res?.data?.data ?? res?.data;
            const arr = Array.isArray(payload) ? payload : [];
            return arr.map(mapContest);
        },
        initialData: [],
    });

    // STATS
    const pendingCount = contests.filter(
        (c) => normalizeStatus(c.status) === "pending"
    ).length;

    //  UI badge
    const renderStatusBadge = (status) => {
        const s = normalizeStatus(status);
        return (
            <div
                className={`badge badge-sm font-bold border-none text-white
          ${s === "confirmed" ? "badge-success" : ""}
          ${s === "pending" ? "badge-warning" : ""}
          ${s === "rejected" ? "badge-error" : ""}
        `}
            >
                {statusLabel(s)}
            </div>
        );
    };

    //  optimistic remove (because you're listing pending items)
    const optimisticRemove = (id) => {
        queryClient.setQueryData(["contests"], (old = []) =>
            old.filter((c) => getId(c) !== id)
        );
    };

    // APPROVE (PATCH) - OPTIMISTIC UI
    const handleApprove = async (contest) => {
        const id = getId(contest);
        if (!id) return;

        const result = await Swal.fire({
            title: "Approve Contest?",
            text: `You are about to approve "${contest.title}".`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "var(--color-success, #22c55e)",
            confirmButtonText: "Yes, Approve it!",
        });

        if (!result.isConfirmed) return;

        const prev = queryClient.getQueryData(["contests"]);

        try {
            setUpdatingId(id);

            //  instant UI update
            optimisticRemove(id);

            //  YOUR ENDPOINT
            await axiosSecure.patch(`admin/contest/status/${id}`, {
                status: "confirmed",
            });

            //  keep data in sync
            queryClient.invalidateQueries({ queryKey: ["contests"] });

            Swal.fire("Approved!", "The contest is now live.", "success");
        } catch (e) {
            // rollback
            queryClient.setQueryData(["contests"], prev || []);
            Swal.fire("Failed!", "Could not approve contest. Try again.", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    //   REJECT (PATCH) - OPTIMISTIC UI
    const handleReject = async (contest) => {
        const id = getId(contest);
        if (!id) return;

        const result = await Swal.fire({
            title: "Reject Contest?",
            text: `This will mark "${contest.title}" as rejected.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-warning, #facc15)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Reject it!",
        });

        if (!result.isConfirmed) return;

        const prev = queryClient.getQueryData(["contests"]);

        try {
            setUpdatingId(id);

            //   instant UI update
            optimisticRemove(id);

            //   YOUR ENDPOINT
            await axiosSecure.patch(`admin/contest/status/${id}`, {
                status: "rejected",
            });

            queryClient.invalidateQueries({ queryKey: ["contests"] });

            Swal.fire("Rejected", "The contest has been rejected.", "info");
        } catch (e) {
            // rollback
            queryClient.setQueryData(["contests"], prev || []);
            Swal.fire("Failed!", "Could not reject contest. Try again.", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    //   DELETE - OPTIMISTIC UI
    const handleDelete = async (contest) => {
        const id = getId(contest);
        if (!id) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "var(--color-neutral, #3d4451)",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        const prev = queryClient.getQueryData(["contests"]);

        try {
            setDeletingId(id);

            //   instant UI update
            optimisticRemove(id);

            //   YOUR ENDPOINT
            await axiosSecure.delete(`creator/contest/delete/${id}`);

            queryClient.invalidateQueries({ queryKey: ["contests"] });

            Swal.fire("Deleted!", "The contest has been deleted.", "success");
        } catch (e) {
            // rollback
            queryClient.setQueryData(["contests"], prev || []);
            Swal.fire("Failed!", "Could not delete contest. Try again.", "error");
        } finally {
            setDeletingId(null);
        }
    };

    //   Loading / Error
    if (isLoading) {
        return (
            <div className="w-full p-6">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full p-6">
                <div className="alert alert-error">
                    <span>{error?.message || "Failed to load contests"}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            {/* --- HEADER & STATS --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-base-content">
                        Manage Contests
                    </h2>
                    <p className="text-base-content/60">
                        Review and manage all user-submitted contests.
                    </p>
                </div>

                <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 border border-base-200 w-full xl:w-auto">
                    <div className="stat place-items-center px-6 py-3 lg:py-2">
                        <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60">
                            Total
                        </div>
                        <div className="stat-value text-primary text-2xl">
                            {contests.length}
                        </div>
                    </div>
                    <div className="stat place-items-center px-6 py-3 lg:py-2 lg:border-l border-base-200">
                        <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60">
                            Pending
                        </div>
                        <div className="stat-value text-warning text-2xl">{pendingCount}</div>
                    </div>
                </div>
            </div>

            {/* --- DESKTOP VIEW --- */}
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
                                <tr>
                                    <td colSpan="7" className="text-center py-10 opacity-50">
                                        <FaUsers className="inline mr-2" /> No contests found.
                                    </td>
                                </tr>
                            ) : (
                                contests.map((contest, index) => {
                                    const id = getId(contest);
                                    const status = normalizeStatus(contest.status);
                                    const busy = updatingId === id || deletingId === id;

                                    return (
                                        <tr key={id || index}>
                                            <th>{index + 1}</th>

                                            <td>
                                                <div className="font-bold">{contest.title}</div>
                                                <div className="text-xs opacity-50">
                                                    ID: {id || "N/A"}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="font-bold text-xs">{contest.creator}</div>
                                                <div className="text-[10px] opacity-50">{contest.email}</div>
                                            </td>

                                            <td className="text-xs font-mono">{contest.deadline}</td>
                                            <td className="font-bold text-success">{contest.prize}</td>
                                            <td>{renderStatusBadge(status)}</td>

                                            <td className="text-right space-x-2">
                                                {/* Approve */}
                                                {status !== "confirmed" && (
                                                    <button
                                                        onClick={() => handleApprove(contest)}
                                                        disabled={busy}
                                                        className="btn btn-sm btn-success btn-circle text-white tooltip tooltip-left disabled:opacity-60"
                                                        data-tip="Approve"
                                                    >
                                                        {updatingId === id ? (
                                                            <span className="loading loading-spinner loading-xs" />
                                                        ) : (
                                                            <FaCheck />
                                                        )}
                                                    </button>
                                                )}

                                                {/* Reject only if pending */}
                                                {status === "pending" && (
                                                    <button
                                                        onClick={() => handleReject(contest)}
                                                        disabled={busy}
                                                        className="btn btn-sm btn-warning btn-circle text-white tooltip tooltip-left disabled:opacity-60"
                                                        data-tip="Reject"
                                                    >
                                                        {updatingId === id ? (
                                                            <span className="loading loading-spinner loading-xs" />
                                                        ) : (
                                                            <FaTimes />
                                                        )}
                                                    </button>
                                                )}

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(contest)}
                                                    disabled={busy}
                                                    className="btn btn-sm btn-error btn-outline btn-circle tooltip tooltip-left disabled:opacity-60"
                                                    data-tip="Delete"
                                                >
                                                    {deletingId === id ? (
                                                        <span className="loading loading-spinner loading-xs" />
                                                    ) : (
                                                        <FaTrashAlt />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MOBILE VIEW --- */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {contests.map((contest, index) => {
                    const id = getId(contest);
                    const status = normalizeStatus(contest.status);
                    const busy = updatingId === id || deletingId === id;

                    return (
                        <div
                            key={id || index}
                            className="card bg-base-100 shadow-md border border-base-200"
                        >
                            <div className="card-body p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg leading-tight">{contest.title}</h3>
                                    {renderStatusBadge(status)}
                                </div>

                                <div className="text-sm opacity-80 mb-2">
                                    <div className="font-bold">{contest.creator}</div>
                                    <div className="text-xs opacity-60">{contest.email}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                                    <div className="flex items-center gap-2 opacity-70">
                                        <FaCalendarAlt className="text-primary" />
                                        <span className="font-mono">{contest.deadline}</span>
                                    </div>
                                    <div className="flex items-center gap-2 font-bold text-success justify-end">
                                        Prize: {contest.prize}
                                    </div>
                                </div>

                                <div className="card-actions justify-end border-t border-base-200 pt-3 gap-2">
                                    {status !== "confirmed" && (
                                        <button
                                            onClick={() => handleApprove(contest)}
                                            disabled={busy}
                                            className="btn btn-sm btn-success text-white gap-2 disabled:opacity-60"
                                        >
                                            {updatingId === id ? (
                                                <span className="loading loading-spinner loading-xs" />
                                            ) : (
                                                <FaCheck />
                                            )}
                                            Approve
                                        </button>
                                    )}

                                    {status === "pending" && (
                                        <button
                                            onClick={() => handleReject(contest)}
                                            disabled={busy}
                                            className="btn btn-sm btn-warning text-white gap-2 disabled:opacity-60"
                                        >
                                            {updatingId === id ? (
                                                <span className="loading loading-spinner loading-xs" />
                                            ) : (
                                                <FaTimes />
                                            )}
                                            Reject
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(contest)}
                                        disabled={busy}
                                        className="btn btn-sm btn-error btn-outline btn-square disabled:opacity-60"
                                    >
                                        {deletingId === id ? (
                                            <span className="loading loading-spinner loading-xs" />
                                        ) : (
                                            <FaTrashAlt />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {contests.length === 0 && (
                    <div className="p-6 text-center opacity-60">
                        <FaUsers className="inline mr-2" /> No contests found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageContests;
