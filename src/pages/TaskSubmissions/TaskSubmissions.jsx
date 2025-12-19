import { useQuery } from "@tanstack/react-query";
import React, { useContext, useMemo, useState } from "react";
import { FaTrophy, FaEye, FaClock, FaExternalLinkAlt } from "react-icons/fa";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import AuthContext from "../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/axiosSecure/useAxiosSecure";

const TaskSubmissions = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
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

  // ✅ Use new API fields: contestName, submissionDate
  const submissions = useMemo(() => {
    if (!Array.isArray(ContestInfo)) return [];

    return ContestInfo.map((p) => {
      const date = p?.submissionDate ? new Date(p.submissionDate) : null;
      const submittedAt = date && !Number.isNaN(date.getTime())
        ? date.toISOString().slice(0, 10)
        : "N/A";

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

  // --- HANDLER: DECLARE WINNER (kept, but status removed so no contest-closed checks) ---
  const handleDeclareWinner = (submission) => {
    Swal.fire({
      title: "Declare Winner?",
      text: `Are you sure you want to make ${submission.participantName} the winner of "${submission.contestTitle}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--color-warning, #facc15)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Declare Winner!",
    }).then((result) => {
      if (result.isConfirmed) {
        // API Call would go here...

        const modal = document.getElementById("details_modal");
        if (modal) modal.close();

        Swal.fire({
          title: "Winner Declared!",
          text: "The participant has been notified.",
          icon: "success",
          confirmButtonColor: "var(--color-primary)",
        });
      }
    });
  };

  // --- OPEN DETAILS MODAL ---
  const openDetails = (submission) => {
    setSelectedSubmission(submission);
    document.getElementById("details_modal").showModal();
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
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <div className="font-bold">{sub.contestTitle}</div>
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
                      {/* Declare Winner button kept */}
                      <button
                        onClick={() => handleDeclareWinner(sub)}
                        className="btn btn-sm btn-circle btn-warning text-white tooltip tooltip-left"
                        data-tip="Declare Winner"
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
              ))}

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
        {submissions.map((sub) => (
          <div key={sub.id} className="card shadow-md border border-base-200 bg-base-100">
            <div className="card-body p-5">
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-primary">{sub.contestTitle}</h3>
              </div>

              {/* Participant */}
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

              {/* Actions Footer */}
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
                >
                  <FaTrophy /> Make Winner
                </button>
              </div>
            </div>
          </div>
        ))}

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
              {/* Participant Card */}
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

              {/* Task Link/Info */}
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

            {/* Modal Actions */}
            <div className="modal-action flex justify-between items-center mt-8">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>

              <button
                onClick={() => handleDeclareWinner(selectedSubmission)}
                className="btn btn-warning gap-2 text-white"
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
