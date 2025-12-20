import React, { useMemo, useState } from "react";
import {
  FaTrophy,
  FaCrown,
  FaGift,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
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

const MyWinningContests = () => {
  const axiosSecure = useAxiosSecure();

  // --- FETCH WINNING HISTORY ---
  const { data: winRes, isLoading, isFetching } = useQuery({
    queryKey: ["winningHistory"],
    queryFn: async () => {
      const res = await axiosSecure.get("user/contest/win/history");
      return res.data; // { message, count, data: [...] }
    },
  });
    console.log(winRes);
  const winningHistory = winRes?.data || [];
  const totalWins = winRes?.count ?? winningHistory.length;

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- PAGINATION LOGIC (safe page without setState) ---
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

  const handleCelebrate = () => {
    Swal.fire({
      title: "Congratulations! 🎉",
      text: "You are doing amazing! Keep winning.",
      imageUrl: "https://media.giphy.com/media/26tOZ42Mg6pbTUPVS/giphy.gif",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Celebration",
      confirmButtonText: "Awesome!",
      confirmButtonColor: "#eab308",
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full space-y-8 min-h-screen pb-10">
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
        <div className="stats shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
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

      {/* Optional: show fetching overlay using your component */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

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

                    <h3 className="card-title text-xl font-bold mb-4 line-clamp-2 min-h-[3.5rem]">
                      {item.contestName}
                    </h3>

                    {/* Action Button */}
                    <div className="card-actions justify-end mt-auto">
                      <button
                        onClick={handleCelebrate}
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

          {/* --- PAGINATION CONTROLS (Only visible if > 6 items) --- */}
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
                      safePage === i + 1 ? "btn-primary text-white" : "btn-outline border-base-300"
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
        /* --- EMPTY STATE (If no wins) --- */
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
