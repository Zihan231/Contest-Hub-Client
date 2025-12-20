import React, { useContext, useMemo, useState } from "react";
import {
  FaCreditCard,
  FaFileUpload,
  FaCheckCircle,
  FaClock,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AuthContext from "../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/axiosSecure/useAxiosSecure";

const MyParticipatedContests = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const normalize = (v) => String(v ?? "").trim().toLowerCase();

  const {
    data: myContests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myContests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`user/contest/participated/${user?.email}`);
      return res?.data?.data || [];
    },
  });

  const [selectedContest, setSelectedContest] = useState(null);

  //  NEW: Participants modal state
  const [participantsContest, setParticipantsContest] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //  Submit Task mutation (optimistic update)
  const submitTaskMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosSecure.patch("user/contest/submit-task", payload);
      return res.data;
    },
    onMutate: async (payload) => {
      const key = ["myContests", user?.email];

      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (old) => {
        if (!Array.isArray(old)) return old;

        return old.map((item) => {
          const itemContestId = String(item?.contestId ?? "");
          const payloadContestId = String(payload?.contestID ?? "");

          if (itemContestId === payloadContestId) {
            return {
              ...item,
              taskSubmission: payload.taskLink,
              submissionDate: new Date().toISOString(),
            };
          }
          return item;
        });
      });

      return { previous };
    },
    onError: (err, _payload, ctx) => {
      const key = ["myContests", user?.email];
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);

      const msg = err?.response?.data?.message || err?.message || "Task submit failed";
      Swal.fire("Failed", msg, "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myContests", user?.email] });
    },
  });

  // ✅ Derive UI list from DB data only
  const participations = useMemo(() => {
    if (!Array.isArray(myContests)) return [];

    return myContests.map((item) => {
      const contestId = String(item?.contestId || "");
      const rowId = contestId || String(item?._id || "");

      const isPaid = normalize(item?.paymentStatus) === "paid";
      const hasSubmission = !!item?.taskSubmission;

      const deadlineDate = item?.deadline ? new Date(item.deadline) : null;

      return {
        id: rowId,
        contestID: contestId,
        _key: item?._id || rowId,

        image: item?.contestImage || "https://picsum.photos/seed/contesthub/100/100",
        title: item?.contestName || "Untitled Contest",

        deadline: deadlineDate ? deadlineDate.toISOString().slice(0, 10) : "N/A",
        deadlineTs: deadlineDate ? deadlineDate.getTime() : Number.POSITIVE_INFINITY,

        paymentStatus: isPaid ? "Paid" : "Pending",
        taskStatus: hasSubmission ? "Submitted" : "Pending",

        price:
          item?.price !== undefined && item?.price !== null
            ? String(item.price)
            : "—",
      };
    });
  }, [myContests]);

  const sortedParticipations = useMemo(() => {
    return [...participations].sort((a, b) => a.deadlineTs - b.deadlineTs);
  }, [participations]);

  // ---------------------------
  // HANDLERS
  // ---------------------------
  const handlePay = async (contestId, price, title) => {
    try {
      const paymentInfo = {
        contestId,
        cost: Number(price),
        contestName: title,
        userEmail: user?.email,
      };

      const res = await axiosSecure.post("user/contest/payment", paymentInfo);
      window.location.assign(res.data.url);
    } catch (e) {
      const msg = e?.response?.data?.message || "Payment init failed";
      Swal.fire("Failed", msg, "error");
    }
  };

  const openSubmitModal = (contest) => {
    setSelectedContest(contest);
    reset();
    document.getElementById("submit_task_modal").showModal();
  };

  const handleTaskSubmit = async (formData) => {
    try {
      if (!selectedContest?.contestID) {
        return Swal.fire("Error", "Missing contestID for submission", "error");
      }

      const payload = {
        taskLink: formData.taskLink,
        contestID: selectedContest.contestID,
      };

      await submitTaskMutation.mutateAsync(payload);

      document.getElementById("submit_task_modal").close();
      Swal.fire({
        title: "Task Submitted!",
        text: "Good luck with the contest.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (e) {
      const msg = e?.response?.data?.message || "Task submit failed";
      Swal.fire("Failed", msg, "error");
    }
  };

  // ✅ NEW: open Participants modal
  const openParticipantsModal = (contest) => {
    if (!contest?.contestID) {
      return Swal.fire("Error", "Missing contestId", "error");
    }
    setParticipantsContest(contest);
    document.getElementById("participants_modal").showModal();
  };

  const closeParticipantsModal = () => {
    document.getElementById("participants_modal")?.close();
    setParticipantsContest(null);
  };

  // ✅ NEW: fetch participants using POST (TanStack Query)
  const {
    data: participantsRes,
    isLoading: isParticipantsLoading,
    isError: isParticipantsError,
    error: participantsError,
  } = useQuery({
    queryKey: ["contestParticipants", participantsContest?.contestID],
    enabled: !!participantsContest?.contestID,
    queryFn: async () => {
      const res = await axiosSecure.post("user/contest/participants", {
        contestId: participantsContest.contestID,
      });
      return res.data; // { message, participantsData: [...] }
    },
  });

  const participantsData = participantsRes?.participantsData || [];

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

      {/* Loading / Error */}
      {isLoading && (
        <div className="card bg-base-100 border border-base-200 p-6 text-base-content/70">
          Loading your participated contests...
        </div>
      )}

      {isError && (
        <div className="alert alert-error">
          <span>Failed to load participated contests.</span>
        </div>
      )}

      {/* --- VIEW 1: DESKTOP TABLE --- */}
      {!isLoading && (
        <div className="hidden md:block card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200/50 text-base-content/60">
                <tr>
                  <th>#</th>
                  <th>Contest Info</th>
                  <th>Deadline</th>
                  <th>Payment</th>
                  <th>Task Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {sortedParticipations.map((contest, index) => (
                  <tr key={contest._key}>
                    <th>{index + 1}</th>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 bg-base-300">
                            <img src={contest.image} alt={contest.title} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{contest.title}</div>
                          <div className="text-xs text-success flex items-center gap-1">
                            <FaTrophy className="text-[10px]" /> Price: ${contest.price}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="font-mono text-xs">{contest.deadline}</td>

                    <td>
                      {contest.paymentStatus === "Paid" ? (
                        <div className="badge badge-success badge-outline gap-1 font-bold text-xs">
                          <FaCheckCircle /> Paid
                        </div>
                      ) : (
                        <div className="badge badge-warning badge-outline gap-1 font-bold text-xs">
                          Unpaid
                        </div>
                      )}
                    </td>

                    <td>
                      {contest.taskStatus === "Submitted" ? (
                        <div className="text-success text-xs font-bold flex items-center gap-1">
                          <FaCheckCircle /> Submitted
                        </div>
                      ) : (
                        <div className="text-warning text-xs font-bold">Pending</div>
                      )}
                    </td>

                    <td className="text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        {/* ✅ NEW: Participants button */}
                        <button
                          onClick={() => openParticipantsModal(contest)}
                          className="btn btn-sm btn-outline gap-2"
                        >
                          <FaUsers /> Participants
                        </button>

                        {/* Existing action logic */}
                        {contest.paymentStatus === "Pending" ? (
                          <button
                            onClick={() => handlePay(contest.contestID, contest.price, contest.title)}
                            className="btn btn-sm btn-warning text-white gap-2"
                          >
                            <FaCreditCard /> Pay
                          </button>
                        ) : contest.taskStatus === "Pending" ? (
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
                      </div>
                    </td>
                  </tr>
                ))}

                {sortedParticipations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-base-content/60">
                      No participated contests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- VIEW 2: MOBILE CARDS --- */}
      {!isLoading && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {sortedParticipations.map((contest, index) => (
            <div key={contest._key} className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="badge badge-ghost font-mono">#{index + 1}</div>
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10 bg-base-300">
                        <img src={contest.image} alt={contest.title} />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{contest.title}</h3>
                  </div>

                  <div className="badge badge-ghost text-xs font-mono whitespace-nowrap ml-2">
                    {contest.deadline}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4 border-t border-base-200 pt-3">
                  <span className="text-success font-bold flex items-center gap-1">
                    <FaTrophy /> ${contest.price}
                  </span>

                  {contest.paymentStatus === "Paid" ? (
                    <span className="text-success text-xs font-bold flex items-center gap-1">
                      <FaCheckCircle /> Paid
                    </span>
                  ) : (
                    <span className="text-warning text-xs font-bold">Payment Pending</span>
                  )}
                </div>

                <div className="w-full bg-base-200 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${contest.taskStatus === "Submitted" ? "bg-success w-full" : "bg-primary w-1/2"
                      }`}
                  ></div>
                </div>

                {/* ✅ NEW: Participants button on mobile */}
                <button
                  onClick={() => openParticipantsModal(contest)}
                  className="btn btn-sm btn-outline w-full mb-2 gap-2"
                >
                  <FaUsers /> View Participants
                </button>

                {contest.paymentStatus === "Pending" ? (
                  <button
                    onClick={() => handlePay(contest.contestID, contest.price, contest.title)}
                    className="btn btn-sm btn-warning w-full text-white"
                  >
                    <FaCreditCard /> Pay Now
                  </button>
                ) : contest.taskStatus === "Pending" ? (
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

          {sortedParticipations.length === 0 && (
            <div className="text-center py-6 text-base-content/60">
              No participated contests found.
            </div>
          )}
        </div>
      )}

      {/* --- SUBMIT TASK MODAL --- */}
      <dialog id="submit_task_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Submit Your Task</h3>
          <p className="text-sm text-base-content/60 mb-4">
            For <span className="font-bold text-primary">{selectedContest?.title}</span>
          </p>

          <form onSubmit={handleSubmit(handleTaskSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Project Link (Google Drive / GitHub / Live)</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                className="input input-bordered w-full"
                {...register("taskLink", { required: "Link is required" })}
              />
              {errors.taskLink && (
                <span className="text-error text-xs mt-1">{errors.taskLink.message}</span>
              )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("submit_task_modal").close()}
                disabled={submitTaskMutation.isPending}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary" disabled={submitTaskMutation.isPending}>
                <FaFileUpload /> {submitTaskMutation.isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* NEW: PARTICIPANTS MODAL */}
      <dialog id="participants_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FaUsers className="text-primary" /> Participants
              </h3>
              <p className="text-sm text-base-content/60 mt-1">
                Contest: <span className="font-bold">{participantsContest?.title || "—"}</span>
              </p>
            </div>
            {/*  removed header close button */}
          </div>

          <div className="mt-4">
            {isParticipantsLoading ? (
              <div className="p-6 text-center text-base-content/70">
                Loading participants...
              </div>
            ) : isParticipantsError ? (
              <div className="alert alert-error">
                <span>
                  {participantsError?.response?.data?.message ||
                    participantsError?.message ||
                    "Failed to load participants."}
                </span>
              </div>
            ) : participantsData.length === 0 ? (
              <div className="p-6 text-center text-base-content/60">
                No participants found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead className="bg-base-200/50 text-base-content/60">
                    <tr>
                      <th>#</th>
                      <th>Participant</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantsData.map((p, idx) => (
                      <tr key={`${p.participantEmail}-${idx}`}>
                        <th>{idx + 1}</th>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-10 h-10 bg-base-300">
                                <img
                                  src={p.participantPhoto || "https://placehold.co/80x80?text=U"}
                                  alt={p.participantName || "User"}
                                  onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/80x80?text=U";
                                  }}
                                />
                              </div>
                            </div>
                            <div className="font-bold">{p.participantName || "Unknown"}</div>
                          </div>
                        </td>
                        <td className="font-mono text-xs">{p.participantEmail || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="modal-action">
            {/*  Keep only this one close button */}
            <button className="btn" type="button" onClick={closeParticipantsModal}>
              Close
            </button>
          </div>
        </div>

        {/* backdrop click also closes, no visible button */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeParticipantsModal}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyParticipatedContests;
