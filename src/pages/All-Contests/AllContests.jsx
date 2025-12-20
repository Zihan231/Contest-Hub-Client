import { useMemo, useState, useEffect } from "react"; // Added useEffect
import { Link, useSearchParams } from "react-router";
import {
  FaUsers,
  FaArrowRight,
  FaSearch,
  FaPenNib,
  FaCode,
  FaBusinessTime,
  FaLayerGroup,
  FaPaintBrush,
} from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useAxios from "../../hooks/axios/useAxios";
import { IoGameController } from "react-icons/io5";
import { TbSpeakerphone } from "react-icons/tb";

const AllContests = () => {
  const axiosPublic = useAxios();
  const [params, setParams] = useSearchParams();

  const [sortOrder, setSortOrder] = useState("popular");
  const itemsPerPage = 10;

  // -----------------------------
  // 1. Setup Local State for Input
  // -----------------------------
  // We initialize this from the URL, but we manage it locally while typing
  const initialQ = params.get("q") || "";
  const [localSearch, setLocalSearch] = useState(initialQ);

  // --- TABS CONFIG ---
  const tabs = useMemo(
    () => [
      { id: "all", label: "All", icon: <FaLayerGroup /> },
      { id: "Design", label: "Design", icon: <FaPaintBrush /> },
      { id: "Writing", label: "Writing", icon: <FaPenNib /> },
      { id: "Coding", label: "Coding", icon: <FaCode /> },
      { id: "Business", label: "Business", icon: <FaBusinessTime /> },
      { id: "Gaming", label: "Gaming", icon: <IoGameController /> },
      { id: "Marketing", label: "Marketing", icon: <TbSpeakerphone /> },
    ],
    []
  );

  // -----------------------------
  // 2. Debounce Logic (The Fix)
  // -----------------------------
  // This useEffect waits 500ms after the last keystroke to update the URL
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update URL if the value is actually different
      const currentUrlQ = params.get("q") || "";
      if (localSearch !== currentUrlQ) {
        const next = new URLSearchParams(params);
        next.set("page", "1"); // Reset to page 1 on new search
        next.delete("tab"); // clear tab
        
        if (!localSearch.trim()) next.delete("q");
        else next.set("q", localSearch);
        
        setParams(next);
      }
    }, 500); // 500ms delay

    // Cleanup function cancels the timer if you type again before 500ms
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]); // Only re-run when localSearch changes

  // -----------------------------
  // URL Params parsing
  // -----------------------------
  const normalize = (s) => String(s || "").trim().toLowerCase();
  const TAB_IDS = tabs.map((t) => t.id);

  const tabParamRaw = (params.get("tab") || params.get("category") || "").trim();
  const qParamRaw = (params.get("q") || "").trim();

  const findTabCaseInsensitive = (value) =>
    TAB_IDS.find((t) => normalize(t) === normalize(value));

  const tabFromQ = qParamRaw ? findTabCaseInsensitive(qParamRaw) : null;

  const activeTab = tabParamRaw
    ? findTabCaseInsensitive(tabParamRaw) || "all"
    : tabFromQ || "all";

  const searchQuery = tabParamRaw || tabFromQ ? "" : qParamRaw;

  const pageParam = Number(params.get("page") || 1);
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  // -----------------------------
  // Data Fetching
  // -----------------------------
  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["allContest", activeTab, searchQuery, sortOrder, currentPage],
    queryFn: async () => {
      const res = await axiosPublic.get("public/contests/find", {
        params: {
          tab: activeTab !== "all" ? activeTab : undefined,
          q: searchQuery || undefined,
          sort: sortOrder,
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const contests = apiResponse?.data || [];
  const meta = apiResponse?.meta || {};
  const totalPages = meta.totalPages || 1;

  // -----------------------------
  // Handlers
  // -----------------------------
  const setTabInUrl = (tabId) => {
    setLocalSearch(""); // Clear the search bar visually
    const next = new URLSearchParams(params);
    next.set("page", "1");
    next.delete("q");

    if (tabId === "all") next.delete("tab");
    else next.set("tab", tabId);

    setParams(next);
  };

  const setPageInUrl = (newPage) => {
    const next = new URLSearchParams(params);
    next.set("page", String(newPage));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      {isFetching && !isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary/20 z-50">
          <div className="h-full bg-primary animate-progress"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-base-content">
            Explore <span className="text-primary">Contests</span>
          </h1>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
            Discover the perfect challenge to showcase your skills. From coding
            to design, we have it all.
          </p>
        </div>

        {/* --- CONTROL BAR --- */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 border-b border-base-300 pb-2">
          {/* Tabs */}
          <div className="overflow-x-auto no-scrollbar w-full lg:w-auto">
            <div className="flex justify-start min-w-max gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTabInUrl(tab.id)}
                  className={`group relative flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  <span
                    className={`text-lg ${
                      activeTab === tab.id
                        ? "scale-110"
                        : "group-hover:scale-110"
                    } transition-transform`}
                  >
                    {tab.icon}
                  </span>
                  <span className="tracking-wide uppercase text-xs">
                    {tab.label}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full bg-primary transform transition-transform duration-300 origin-center z-10 ${
                      activeTab === tab.id
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-50"
                    }`}
                  ></span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative grow lg:grow-0 lg:w-64">
              {/* Show small spinner inside input if debouncing/fetching */}
              {isFetching ? (
                <span className="loading loading-spinner loading-xs absolute left-3 top-1/2 -translate-y-1/2 text-primary"></span>
              ) : (
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-xs" />
              )}
              
              <input
                type="text"
                placeholder="Search contests..."
                className="input input-sm input-bordered w-full pl-9 rounded-lg focus:input-primary bg-base-100"
                // 3. Bind to LOCAL state, not URL state
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>

            <select
              className="select select-sm select-bordered w-full md:w-40 pl-3 pr-8 rounded-lg focus:select-primary bg-base-100 font-medium text-xs"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPageInUrl(1);
              }}
            >
              <option value="popular">Popular</option>
              <option value="prize-high">High Prize</option>
              <option value="prize-low">Low Prize</option>
            </select>
          </div>
        </div>

        {/* --- CONTESTS GRID --- */}
        {contests.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {contests.map((contest, index) => (
                <motion.div
                  key={contest._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-base-300 group overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <figure className="relative h-48 overflow-hidden bg-base-200">
                    <img
                      src={
                        contest.image ||
                        "https://placehold.co/600x400?text=Contest"
                      }
                      alt={contest.contestName}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) =>
                        (e.target.src =
                          "https://placehold.co/600x400?text=No+Image")
                      }
                    />
                    <div className="absolute top-4 right-4 bg-base-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                      <FaUsers className="text-primary" />{" "}
                      {contest.participationCount || 0}
                    </div>
                  </figure>

                  <div className="card-body p-6">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="card-title text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                        {contest.contestName}
                      </h3>

                      {contest.contestType && (
                        <div className="badge badge-outline text-xs opacity-70 uppercase tracking-wide shrink-0">
                          {contest.contestType}
                        </div>
                      )}
                    </div>

                    <p className="text-base-content/70 text-sm mb-3">
                      {contest.description?.length > 80
                        ? contest.description.slice(0, 80) + "..."
                        : contest.description || "No description available."}
                    </p>

                    {Array.isArray(contest.tags) && contest.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {contest.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="badge badge-ghost badge-xs text-[10px] text-base-content/60"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm font-semibold mb-4 text-base-content/80 mt-auto pt-3 border-t border-base-200">
                      <span>Entry: ${contest.entryFee || 0}</span>
                      <span className="text-primary">
                        Prize: ${contest.prizeMoney || 0}
                      </span>
                    </div>

                    <div className="card-actions justify-end">
                      <Link
                        to={`/contest/details/${contest?._id}`}
                        className="btn btn-primary btn-sm w-full gap-2 shadow-md shadow-primary/20"
                      >
                        View Details <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setPageInUrl(currentPage - 1)}
                  disabled={currentPage === 1 || isFetching}
                >
                  Prev
                </button>

                <div className="join hidden sm:flex">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`join-item btn btn-sm ${
                        currentPage === i + 1 ? "btn-active btn-primary" : ""
                      }`}
                      onClick={() => setPageInUrl(i + 1)}
                      disabled={isFetching}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <span className="sm:hidden font-bold text-sm px-2">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setPageInUrl(currentPage + 1)}
                  disabled={currentPage === totalPages || isFetching}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 opacity-50">
            <FaSearch className="text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold">No contests found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllContests;