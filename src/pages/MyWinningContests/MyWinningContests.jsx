import React, { useMemo, useState } from "react";
import {
  FaTrophy,
  FaCrown,
  FaGift,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../hooks/axiosSecure/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const CertificateModal = ({ open, onClose, item }) => {
  if (!open || !item) return null;

  const winnerName = item?.winnerName || "Winner";
  const contestName = item?.contestName || "Contest";
  const prizeMoney = item?.prizeMoney ?? 0;
  const dateText = formatDate(item?.deadline);
  const category = item?.contestType || item?.tags?.[0] || "General";
  const certId = String(item?._id || "").slice(-10).toUpperCase();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-999 flex items-center justify-center px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-200">
            <div className="flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />
              <p className="font-bold text-base-content">Certificate Preview</p>
            </div>

            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost"
              type="button"
            >
              <FaTimes />
            </button>
          </div>

          {/* Certificate Area */}
          <div className="p-4 sm:p-6">
            <div className="relative bg-base-100 rounded-2xl border-2 border-yellow-500/80 p-5 sm:p-8 overflow-hidden">
              {/* Background decorations */}
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-yellow-500/10 blur-2xl" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute top-10 right-10 opacity-[0.06] rotate-12">
                <FaTrophy className="text-[180px] text-yellow-500" />
              </div>

              {/* Double border feel */}
              <div className="absolute inset-3 border border-yellow-500/30 rounded-xl pointer-events-none" />

              {/* Header */}
              <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2">
                  <FaCrown className="text-yellow-500 text-2xl" />
                  <h2 className="text-2xl sm:text-4xl font-black text-base-content tracking-wide">
                    CERTIFICATE
                  </h2>
                  <FaCrown className="text-yellow-500 text-2xl" />
                </div>

                <p className="mt-2 text-base-content/60 uppercase tracking-[0.3em] text-xs sm:text-sm font-bold">
                  of Achievement
                </p>

                <div className="mt-5 mx-auto w-28 sm:w-40 h-0.5 bg-linear-to-r from-transparent via-yellow-500 to-transparent" />
              </div>

              {/* Body */}
              <div className="mt-8 relative z-10">
                <p className="text-center text-base-content/70 font-medium">
                  This is proudly presented to
                </p>

                <div className="mt-3 text-center">
                  <h3 className="text-2xl sm:text-4xl font-black text-base-content">
                    {winnerName}
                  </h3>
                  <p className="text-base-content/60 mt-1">
                    for winning the contest
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <p className="inline-block px-4 py-2 rounded-full border border-base-300 bg-base-200/60 font-bold text-base-content">
                    {contestName}
                  </p>
                </div>

                {/* Details */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-base-content/50">
                      Category
                    </p>
                    <p className="mt-1 font-black text-base-content">{category}</p>
                  </div>

                  <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-base-content/50">
                      Prize
                    </p>
                    <p className="mt-1 font-black text-yellow-600">${prizeMoney}</p>
                  </div>

                  <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-base-content/50">
                      Date
                    </p>
                    <p className="mt-1 font-black text-base-content">{dateText}</p>
                  </div>
                </div>

                {/* Footer row */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Signature */}
                  <div className="w-full sm:w-auto text-center sm:text-left">
                    <p className="text-base-content/60 text-sm font-medium">Authorized by</p>
                    <p className="font-black text-base-content">ContestHub Committee</p>
                    <div className="mt-2 h-0.5 w-44 bg-base-300 mx-auto sm:mx-0" />
                  </div>

                  {/* Winner photo */}
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-14 rounded-full ring ring-yellow-500 ring-offset-base-100 ring-offset-2">
                        <img
                          src={item?.winnerPhoto || "https://placehold.co/80x80?text=WIN"}
                          alt={winnerName}
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/80x80?text=WIN";
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-base-content/50 font-bold">
                        Certificate ID
                      </p>
                      <p className="font-black text-base-content">{certId || "—"}</p>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-center text-xs text-base-content/50">
                  This certificate is generated digitally by ContestHub.
                </p>
              </div>
            </div>

            {/* Bottom actions (optional) */}
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn btn-outline btn-sm" onClick={onClose} type="button">
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const MyWinningContests = () => {
  const axiosSecure = useAxiosSecure();

  // Certificate modal state
  const [certOpen, setCertOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openCertificate = (item) => {
    setSelectedItem(item);
    setCertOpen(true);
  };

  const closeCertificate = () => {
    setCertOpen(false);
    setSelectedItem(null);
  };

  // --- FETCH WINNING HISTORY ---
  const { data: winRes, isLoading, isFetching } = useQuery({
    queryKey: ["winningHistory"],
    queryFn: async () => {
      const res = await axiosSecure.get("user/contest/win/history");
      return res.data;
    },
  });

  const winningHistory = useMemo(() => winRes?.data || [], [winRes?.data]);
  const totalWins = winRes?.count ?? winningHistory.length;

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.max(1, Math.ceil(winningHistory.length / itemsPerPage));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const currentData = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    return winningHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [winningHistory, safePage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full space-y-8 min-h-screen pb-10">
      {/* Certificate Modal */}
      <CertificateModal open={certOpen} onClose={closeCertificate} item={selectedItem} />

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-base-content flex items-center gap-3">
            Winning <span className="text-yellow-500">History</span>{" "}
            <FaTrophy className="text-yellow-500" />
          </h2>
          <p className="text-base-content/60 mt-2">Your hall of fame and achievements.</p>
        </div>

        {/* Stats Widget */}
        <div className="stats shadow-lg bg-linear-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="stat place-items-center">
            <div className="stat-title text-white/80 font-bold uppercase tracking-widest text-xs">
              Total Wins
            </div>
            <div className="stat-value text-white flex items-center gap-2 text-3xl">
              <FaCrown /> {totalWins} Wins
            </div>
          </div>
        </div>
      </div>

      {/* Optional fetching overlay */}
      {isFetching ? <Loading /> : null}

      {/* --- WINNING CARDS GRID --- */}
      {winningHistory.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentData.map((item, index) => {
              const category = item?.contestType || item?.tags?.[0] || "General";
              const prize = `$${item?.prizeMoney ?? 0}`;
              const date = formatDate(item?.deadline);

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card bg-base-100 shadow-xl border-t-4 border-yellow-500 group overflow-hidden hover:shadow-2xl transition-all duration-300 relative"
                >
                  {/* Background Decoration Icon */}
                  <div className="absolute top-2 right-2 p-2 opacity-5 rotate-12 group-hover:rotate-0 group-hover:opacity-10 transition-all duration-500 z-0">
                    <FaTrophy className="text-9xl text-yellow-500" />
                  </div>

                  {/* Image Section */}
                  <figure className="h-48 overflow-hidden relative z-10">
                    <img
                      src={item.image || "https://placehold.co/600x400?text=Contest"}
                      alt={item.contestName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>

                    {/* Winner Badge */}
                    <div className="absolute top-4 left-4 badge badge-lg bg-yellow-500 text-white font-bold border-none shadow-md gap-2">
                      <FaCrown /> Winner
                    </div>

                    {/* Prize Overlay */}
                    <div className="absolute bottom-4 right-4 text-white text-right">
                      <p className="text-xs opacity-80 uppercase tracking-wide">Prize Won</p>
                      <p className="text-2xl font-black text-yellow-400 drop-shadow-sm">
                        {prize}
                      </p>
                    </div>
                  </figure>

                  {/* Card Body */}
                  <div className="card-body relative z-10 pt-4">
                    {/* Meta Info */}
                    <div className="flex justify-between items-center text-xs font-bold text-base-content/50 uppercase tracking-widest mb-1">
                      <span className="flex items-center gap-1">{category}</span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt /> {date}
                      </span>
                    </div>

                    <h3 className="card-title text-xl font-bold mb-4 line-clamp-2 min-h-14">
                      {item.contestName}
                    </h3>

                    {/* Action Button */}
                    <div className="card-actions justify-end mt-auto">
                      <button
                        onClick={() => openCertificate(item)}
                        className="btn btn-sm btn-outline border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white hover:border-yellow-500 w-full gap-2 transition-all"
                      >
                        <FaGift /> View Certificate
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* --- PAGINATION CONTROLS --- */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <button
                className="btn btn-circle btn-outline border-base-300 hover:border-primary hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-base-content"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
              >
                <FaChevronLeft />
              </button>

              <div className="join">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`join-item btn ${
                      safePage === i + 1
                        ? "btn-primary text-white"
                        : "btn-outline border-base-300"
                    }`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-circle btn-outline border-base-300 hover:border-primary hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-base-content"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        /* --- EMPTY STATE --- */
        <div className="text-center py-24 bg-base-100 rounded-box border border-dashed border-base-300">
          <div className="bg-base-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrophy className="text-4xl text-base-content/20" />
          </div>
          <h3 className="text-xl font-bold">Your Trophy Case is Empty</h3>
          <p className="text-base-content/60 max-w-md mx-auto mt-2">
            Don't worry! Participate in contests, showcase your skills, and your winnings will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyWinningContests;
