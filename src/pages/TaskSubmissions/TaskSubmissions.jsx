/* eslint-disable react-hooks/purity */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useMemo, useState } from "react";
import { FaTrophy, FaEye, FaClock, FaExternalLinkAlt } from "react-icons/fa";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import AuthContext from "../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/axiosSecure/useAxiosSecure";

const TaskSubmissions = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const update = { contestId: id };

  const { data: ContestInfo = [] } = useQuery({
    queryKey: ["contestData", id, user?.email],
    enabled: !!id && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.post("creator/contest/all-participants", update);
      return res?.data?.participantsData || [];
    },
  });

  // Track winner state based on API response (success OR "already declared" error)
  const [winnerState, setWinnerState] = useState({
    declared: false,
    winnerId: null, // participantId (string)
  });

  // Track deadline lock based on API response (409 before deadline)
  const [deadlineState, setDeadlineState] = useState({
    deadlineISO: null,
  });

  const deadlineTs = useMemo(() => {
    if (!deadlineState.deadlineISO) return null;
    const d = new Date(deadlineState.deadlineISO);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  }, [deadlineState.deadlineISO]);

  const isBeforeDeadline = deadlineTs ? Date.now() < deadlineTs : false;

  // ✅ Use new API fields: contestName, submissionDate
  const submissions = useMemo(() => {
    if (!Array.isArray(ContestInfo)) return [];

    return ContestInfo.map((p) => {
      const date = p?.submissionDate ? new Date(p.submissionDate) : null;
      const submittedAt =
        date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : "N/A";

      return {
        id: p?.participantId || `${p?.participantEmail}-${id}`,
        contestId: id,
        contestTitle: p?.contestName || "Contest",
        participantName: p?.participantName || "Unknown",
        email: p?.participantEmail || "N/A",
        participantPhoto: p?.participantPhoto || "",
        taskLink: p?.taskSubmission || "",
        submittedAt,
      };
    });
  }, [ContestInfo, id]);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const formatDateYYYYMMDD = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso || "");
    return d.toISOString().slice(0, 10);
  };

  // --- HANDLER: DECLARE WINNER (now handles API rules) ---
  const handleDeclareWinner = (submission) => {
    // If winner already declared (from API response), block client-side
    if (winnerState.declared) {
      Swal.fire({
        icon: "info",
        title: "Winner already declared",
        text: "This contest already has a winner. You cannot declare again.",
        confirmButtonColor: "var(--color-primary)",
      });
      return;
    }

    // If backend already told us deadline, block before deadline
    if (isBeforeDeadline) {
      Swal.fire({
        icon: "info",
        title: "Deadline not finished",
        text: `You can declare the winner after ${formatDateYYYYMMDD(deadlineState.deadlineISO)}.`,
        confirmButtonColor: "var(--color-primary)",
      });
      return;
    }

    const detailsModal = document.getElementById("details_modal");
    const swalTarget = detailsModal?.open ? detailsModal : document.body;

    Swal.fire({
      target: swalTarget, // ✅ appears above <dialog>
      title: "Declare Winner?",
      text: `Are you sure you want to make "${submission.participantName}" the winner of "${submission.contestTitle}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--color-warning, #facc15)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Declare Winner!",
      heightAuto: false,
    }).then(async (r) => {
      if (!r.isConfirmed) return;

      // Loading popup (also on top of the dialog)
      Swal.fire({
        target: swalTarget,
        title: "Declaring winner...",
        text: "Please wait",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
        heightAuto: false,
      });

      const payload = {
        winnerID: submission.id,      // participantId
        contestID: submission.contestId, // contestId from route
      };

      try {
        const apiRes = await axiosSecure.patch("creator/contest/declare/winner", payload);

        // Mark winner locally so UI updates immediately
        setWinnerState({
          declared: true,
          winnerId: submission.id,
        });

        // close details modal if open
        const modal = document.getElementById("details_modal");
        if (modal) modal.close();

        // refresh any related queries (optional but good)
        queryClient.invalidateQueries({ queryKey: ["contestData", id, user?.email] });

        Swal.fire({
          icon: "success",
          title: "Winner Declared!",
          text: apiRes?.data?.message || "Winner declared successfully.",
          confirmButtonColor: "var(--color-primary)",
        });
      } catch (e) {
        Swal.close();

        const status = e?.response?.status;
        const data = e?.response?.data;
        const msg = data?.message || "Failed to declare winner.";

        // ✅ deadline not over (backend returns 409 + deadline)
        if (status === 409 && data?.deadline) {
          setDeadlineState({ deadlineISO: data.deadline });

          Swal.fire({
            target: swalTarget,
            icon: "info",
            title: "Cannot declare winner yet",
            text: `${msg} Deadline: ${formatDateYYYYMMDD(data.deadline)}`,
            confirmButtonColor: "var(--color-primary)",
            heightAuto: false,
          });
          return;
        }

        // ✅ already declared (backend returns 409)
        if (status === 409 && /already declared/i.test(msg)) {
          setWinnerState((prev) => ({
            declared: true,
            winnerId: prev.winnerId || null, // winner id unknown unless you fetch contest winner
          }));

          Swal.fire({
            target: swalTarget,
            icon: "info",
            title: "Winner already declared",
            text: msg,
            confirmButtonColor: "var(--color-primary)",
            heightAuto: false,
          });
          return;
        }

        // other errors
        Swal.fire({
          target: swalTarget,
          icon: "error",
          title: "Declaration Failed",
          text: msg,
          confirmButtonColor: "var(--color-primary)",
          heightAuto: false,
        });
      }
    });
  };

  // --- OPEN DETAILS MODAL ---
  const openDetails = (submission) => {
    setSelectedSubmission(submission);
    document.getElementById("details_modal").showModal();
  };

  // UI disable rules
  const declareGloballyDisabled = winnerState.declared || isBeforeDeadline;

  return (
    <div className="w-full space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-base-content">Submitted Tasks</h2>
          <p className="text-base-content/60">Review submissions and select winners.</p>
        </div>
      </div>

      {/* winner/deadline info (based on API response) */}
      {winnerState.declared && (
        <div className="alert alert-info">
          <span>Winner already declared for this contest.</span>
        </div>
      )}

      {!winnerState.declared && isBeforeDeadline && (
        <div className="alert alert-warning">
          <span>
            Winner can be declared after the deadline:{" "}
            <b>{formatDateYYYYMMDD(deadlineState.deadlineISO)}</b>
          </span>
        </div>
      )}

      {/* --- VIEW 1: DESKTOP TABLE --- */}
      <div className="hidden md:block card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/50 text-base-content/60">
              <tr>
                <th>Contest Info</th>
                <th>Participant</th>
                <th>Submitted At</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub) => {
                const isWinnerRow = winnerState.winnerId && winnerState.winnerId === sub.id;
                const canDeclareThisRow = !!sub.taskLink && !declareGloballyDisabled;

                return (
                  <tr key={sub.id} className={isWinnerRow ? "bg-warning/10" : ""}>
                    <td>
                      <div className="font-bold flex items-center gap-2">
                        {sub.contestTitle}
                        {isWinnerRow && (
                          <span className="badge badge-warning gap-1 text-xs font-bold">
                            <FaTrophy /> Winner
                          </span>
                        )}
                      </div>
                      <div className="text-xs opacity-50">ID: {sub.contestId}</div>
                    </td>

                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 rounded-full bg-base-200">
                            {sub.participantPhoto ? (
                              <img src={sub.participantPhoto} alt={sub.participantName} />
                            ) : (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral text-neutral-content">
                                <span className="text-xs">{sub.participantName.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-xs">{sub.participantName}</div>
                          <div className="text-[10px] opacity-50">{sub.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="font-mono text-xs">{sub.submittedAt}</td>

                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDeclareWinner(sub)}
                          className="btn btn-sm btn-circle btn-warning text-white tooltip tooltip-left"
                          data-tip={
                            !sub.taskLink
                              ? "No submission yet"
                              : declareGloballyDisabled
                              ? winnerState.declared
                                ? "Winner already declared"
                                : "Deadline not finished"
                              : "Declare Winner"
                          }
                          disabled={!canDeclareThisRow}
                        >
                          <FaTrophy />
                        </button>

                        <button
                          onClick={() => openDetails(sub)}
                          className="btn btn-sm btn-circle btn-ghost text-primary tooltip tooltip-left"
                          data-tip="View Details"
                          disabled={!sub.taskLink}
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {submissions.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-base-content/60">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- VIEW 2: MOBILE CARDS --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {submissions.map((sub) => {
          const isWinnerRow = winnerState.winnerId && winnerState.winnerId === sub.id;
          const canDeclareThisRow = !!sub.taskLink && !declareGloballyDisabled;

          return (
            <div
              key={sub.id}
              className={`card shadow-md border border-base-200 bg-base-100 ${
                isWinnerRow ? "bg-warning/5 border-warning/30" : ""
              }`}
            >
              <div className="card-body p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                    {sub.contestTitle}
                    {isWinnerRow && (
                      <span className="badge badge-warning gap-1 text-xs font-bold">
                        <FaTrophy /> Winner
                      </span>
                    )}
                  </h3>
                </div>

                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-base-200">
                  <div className="avatar">
                    <div className="w-10 rounded-full bg-base-200">
                      {sub.participantPhoto ? (
                        <img src={sub.participantPhoto} alt={sub.participantName} />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral text-neutral-content">
                          <span>{sub.participantName.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="font-bold">{sub.participantName}</div>
                    <div className="text-xs opacity-50">{sub.email}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs opacity-70 mb-4">
                  <span className="flex items-center gap-1">
                    <FaClock /> {sub.submittedAt}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openDetails(sub)}
                    className="btn btn-sm btn-outline btn-primary flex-1"
                    disabled={!sub.taskLink}
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleDeclareWinner(sub)}
                    className="btn btn-sm btn-warning text-white flex-1 gap-1"
                    disabled={!canDeclareThisRow}
                  >
                    <FaTrophy /> Make Winner
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {submissions.length === 0 && (
          <div className="text-center py-6 text-base-content/60">No submissions found.</div>
        )}
      </div>

      {/* --- DETAILS MODAL --- */}
      <dialog id="details_modal" className="modal modal-bottom sm:modal-middle">
        {selectedSubmission && (
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-1">{selectedSubmission.contestTitle}</h3>
            <p className="text-xs text-base-content/60 uppercase tracking-wide mb-6">
              Submission Details
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-base-200/50 p-4 rounded-xl">
                <div className="avatar">
                  <div className="w-12 rounded-full bg-base-200">
                    {selectedSubmission.participantPhoto ? (
                      <img
                        src={selectedSubmission.participantPhoto}
                        alt={selectedSubmission.participantName}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral text-neutral-content">
                        <span className="text-xl">
                          {selectedSubmission.participantName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold">{selectedSubmission.participantName}</h4>
                  <p className="text-sm opacity-70">{selectedSubmission.email}</p>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Submitted Work</span>
                </label>
                <div className="mockup-code bg-base-300 text-base-content p-4 text-sm break-all">
                  <code className="flex items-center gap-2">
                    <FaExternalLinkAlt className="shrink-0 text-primary" />
                    <a
                      href={selectedSubmission.taskLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary link-hover"
                    >
                      {selectedSubmission.taskLink}
                    </a>
                  </code>
                </div>
              </div>
            </div>

            <div className="modal-action flex justify-between items-center mt-8">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>

              <button
                onClick={() => handleDeclareWinner(selectedSubmission)}
                className="btn btn-warning gap-2 text-white"
                disabled={!selectedSubmission.taskLink || declareGloballyDisabled}
                title={
                  !selectedSubmission.taskLink
                    ? "No submission yet"
                    : declareGloballyDisabled
                    ? winnerState.declared
                      ? "Winner already declared"
                      : "Deadline not finished"
                    : "Declare Winner"
                }
              >
                <FaTrophy /> Declare Winner
              </button>
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
