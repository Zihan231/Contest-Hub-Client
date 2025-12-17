import React, { useContext, useState } from "react";
import { Link } from "react-router";
import {
  FaEdit,
  FaTrashAlt,
  FaListAlt,
  FaCalendarAlt,
  FaTrophy,
  FaUserFriends,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxiosSecure from "../../hooks/axiosSecure/useAxiosSecure";
import AuthContext from "../../context/AuthContext/AuthContext";

const MyCreatedContests = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const [editingContest, setEditingContest] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updating, setUpdating] = useState(false);

  // ---------------------------
  // ✅ DATE HELPERS (fix ISO Z time)
  // ---------------------------
  const parseDeadlineToDate = (value) => {
    if (!value) return null;

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d);
    }

    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    return null;
  };

  const toLocalYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatForUI = (value) => {
    const d = parseDeadlineToDate(value);
    if (!d) return "-";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ---------------------------
  // SAFE FIELD HELPERS
  // ---------------------------
  const getId = (c) => c?._id || c?.id;
  const getTitle = (c) => c?.title ?? c?.contestName ?? "";
  const getPrize = (c) => c?.prize ?? c?.prizeMoney ?? 0;
  const getDeadline = (c) => c?.deadline ?? c?.endDate ?? "";
  const getDescription = (c) => c?.description ?? c?.details ?? "";
  const getCategory = (c) => c?.category ?? c?.contestCategory ?? "";
  const getSubmissionCount = (c) =>
    c?.submissionCount ?? c?.participationCount ?? 0;

  const normalizeStatus = (s) => String(s || "").toLowerCase();
  const isConfirmed = (s) => normalizeStatus(s) === "confirmed";
  const isPending = (s) => normalizeStatus(s) === "pending";
  const isRejected = (s) => normalizeStatus(s) === "rejected";

  const renderStatusBadge = (status) => {
    const s = normalizeStatus(status);

    const cls = isConfirmed(s)
      ? "badge-success"
      : isPending(s)
      ? "badge-warning"
      : isRejected(s)
      ? "badge-error"
      : "badge-ghost";

    const label = isConfirmed(s)
      ? "Approved"
      : s
      ? s[0].toUpperCase() + s.slice(1)
      : "Unknown";

    return (
      <div className={`badge badge-sm font-bold border-none text-white p-3 ${cls}`}>
        {label}
      </div>
    );
  };

  // ---------------------------
  // FETCH CONTESTS
  // ---------------------------
  const queryKey = ["contestData", user?.email];

  const {
    data: contestData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`creator/contest/all/${user.email}`);
      return res?.data?.data || [];
    },
  });

  const contests = Array.isArray(contestData) ? contestData : [];

  // ---------------------------
  // FORM
  // ---------------------------
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      prize: "",
      deadline: null,
      description: "",
    },
  });

  const openEditModal = (contest) => {
    setEditingContest(contest);

    reset({
      title: getTitle(contest),
      category: getCategory(contest),
      prize: getPrize(contest),
      deadline: parseDeadlineToDate(getDeadline(contest)),
      description: getDescription(contest),
    });

    document.getElementById("edit_modal")?.showModal();
  };

  // ---------------------------
  // OPTIMISTIC DELETE MUTATION
  // ---------------------------
  const deleteMutation = useMutation({
    mutationFn: (contestId) =>
      axiosSecure.delete(`creator/contest/delete/${contestId}`),

    onMutate: async (contestId) => {
      setDeletingId(contestId);

      await queryClient.cancelQueries({ queryKey });

      const prev = queryClient.getQueryData(queryKey);

      // remove instantly
      queryClient.setQueryData(queryKey, (old) => {
        if (!Array.isArray(old)) return old;
        return old.filter((c) => getId(c) !== contestId);
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Deleting...",
        showConfirmButton: false,
        timer: 900,
      });

      return { prev };
    },

    onError: (err, contestId, ctx) => {
      // rollback
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err?.response?.data?.message || err?.message || "Something went wrong",
      });
    },

    onSuccess: (res) => {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: res?.data?.message || "Contest deleted",
        showConfirmButton: false,
        timer: 1200,
      });
    },

    onSettled: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleDelete = async (contestId) => {
    const result = await Swal.fire({
      title: "Delete Contest?",
      text: "Cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    deleteMutation.mutate(contestId);
  };

  // ---------------------------
  // UPDATE (fix time + show updating state)
  // ---------------------------
  const handleUpdate = async (data) => {
    if (!editingContest) return;

    setUpdating(true);
    try {
      const contestId = getId(editingContest);
      if (!contestId) throw new Error("Invalid contest id");
      if (!data.deadline) throw new Error("Deadline is required");

      const finalData = {
        title: data.title,
        category: data.category,
        prize: Number(data.prize),
        deadline: toLocalYMD(data.deadline),
        description: data.description,
      };

      const res = await axiosSecure.patch(
        `creator/contest/update/${contestId}`,
        finalData
      );

      if (res?.status !== 200 && res?.status !== 201) {
        throw new Error(res?.data?.message || "Update failed");
      }

      document.getElementById("edit_modal")?.close();

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: res?.data?.message || "Updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      queryClient.invalidateQueries({ queryKey });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: e?.response?.data?.message || e?.message || "Something went wrong",
      });
    } finally {
      setUpdating(false);
    }
  };

  // ---------------------------
  // UI STATES
  // ---------------------------
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body flex items-center gap-3">
            <span className="loading loading-spinner loading-md" />
            <p className="font-semibold">Loading your contests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full">
        <div className="alert alert-error">
          <span>
            {error?.response?.data?.message ||
              error?.message ||
              "Failed to load contests."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-base-content">
            My Contests
          </h2>
          <p className="text-sm sm:text-base text-base-content/60">
            Manage your created contests.
          </p>
        </div>

        <Link
          to="/dashboard/creator/create"
          className="btn btn-primary w-full sm:w-auto gap-2"
        >
          <FaEdit /> <span className="hidden sm:inline">Create New</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* --- DESKTOP TABLE --- */}
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
                <tr>
                  <td colSpan="7" className="text-center py-10 opacity-50">
                    You haven't created any contests yet.
                  </td>
                </tr>
              ) : (
                contests.map((contest, index) => {
                  const id = getId(contest);
                  const status = contest?.status;

                  return (
                    <tr key={id || index}>
                      <th>{index + 1}</th>
                      <td className="font-bold">{getTitle(contest)}</td>
                      <td className="font-mono text-xs">
                        {formatForUI(getDeadline(contest))}
                      </td>
                      <td className="font-bold text-success">
                        ${getPrize(contest)}
                      </td>
                      <td>{renderStatusBadge(status)}</td>

                      <td className="text-center">
                        {isConfirmed(status) ? (
                          <span className="font-bold">
                            {getSubmissionCount(contest)}
                          </span>
                        ) : (
                          <span className="opacity-30">-</span>
                        )}
                      </td>

                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/dashboard/contest/${id}/submissions`}
                            className={`btn btn-sm btn-ghost text-primary tooltip tooltip-left ${
                              !isConfirmed(status)
                                ? "btn-disabled opacity-20"
                                : ""
                            }`}
                            data-tip="See Submissions"
                          >
                            <FaListAlt className="text-lg" />
                          </Link>

                          {isPending(status) && (
                            <>
                              <button
                                onClick={() => openEditModal(contest)}
                                className="btn btn-sm btn-ghost text-info tooltip tooltip-left"
                                data-tip="Edit"
                              >
                                <FaEdit className="text-lg" />
                              </button>

                              <button
                                onClick={() => handleDelete(id)}
                                disabled={deletingId === id}
                                className="btn btn-sm btn-ghost text-error tooltip tooltip-left"
                                data-tip="Delete"
                              >
                                {deletingId === id ? (
                                  <span className="loading loading-spinner loading-xs" />
                                ) : (
                                  <FaTrashAlt className="text-lg" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {contests.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            You haven't created any contests yet.
          </div>
        ) : (
          contests.map((contest) => {
            const id = getId(contest);
            const status = contest?.status;

            return (
              <div
                key={id}
                className="card bg-base-100 shadow-md border border-base-200"
              >
                <div className="card-body p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight">
                      {getTitle(contest)}
                    </h3>
                    {renderStatusBadge(status)}
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 opacity-70">
                      <FaCalendarAlt className="text-primary" />
                      <span className="font-mono">
                        {formatForUI(getDeadline(contest))}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-bold text-success justify-end">
                      <FaTrophy /> ${getPrize(contest)}
                    </div>

                    <div className="flex items-center gap-2 opacity-70 col-span-2">
                      <FaUserFriends className="text-info" />
                      {isConfirmed(status)
                        ? `${getSubmissionCount(contest)} Submissions`
                        : "No submissions yet"}
                    </div>
                  </div>

                  <div className="card-actions justify-end border-t border-base-200 pt-3">
                    <Link
                      to={`/dashboard/contest/${id}/submissions`}
                      className={`btn btn-sm btn-outline btn-primary ${
                        !isConfirmed(status) ? "btn-disabled opacity-50" : ""
                      }`}
                    >
                      Submissions
                    </Link>

                    {isPending(status) && (
                      <>
                        <button
                          onClick={() => openEditModal(contest)}
                          className="btn btn-sm btn-square btn-ghost text-info border border-base-200"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={deletingId === id}
                          className="btn btn-sm btn-square btn-ghost text-error border border-base-200"
                        >
                          {deletingId === id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            <FaTrashAlt />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box overflow-visible">
          <h3 className="font-bold text-lg mb-4">Edit Contest</h3>

          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Contest Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register("title", { required: "Title is required" })}
              />
              {errors?.title && (
                <p className="text-error text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select className="select select-bordered" {...register("category")}>
                  <option value="Image Design">Image Design</option>
                  <option value="Article Writing">Article Writing</option>
                  <option value="Digital Advertisement">Digital Advertisement</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Prize ($)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  {...register("prize", {
                    required: "Prize is required",
                    valueAsNumber: true,
                  })}
                />
                {errors?.prize && (
                  <p className="text-error text-sm mt-1">{errors.prize.message}</p>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Deadline</span>
              </label>

              <Controller
                control={control}
                name="deadline"
                rules={{ required: "Deadline is required" }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    className="input input-bordered w-full"
                    dateFormat="dd MMM yyyy"
                    minDate={new Date()}
                    placeholderText="Select a deadline"
                  />
                )}
              />

              {errors?.deadline && (
                <p className="text-error text-sm mt-1">{errors.deadline.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                {...register("description", { required: "Description is required" })}
              />
              {errors?.description && (
                <p className="text-error text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("edit_modal")?.close()}
                disabled={updating}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Update"
                )}
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

export default MyCreatedContests;
