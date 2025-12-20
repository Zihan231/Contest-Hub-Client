import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
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
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/axios/useAxios";
import { IoGameController } from "react-icons/io5";
import { TbSpeakerphone } from "react-icons/tb";
import Loading from "../../components/Loading/Loading";

const AllContests = () => {
  const axiosPublic = useAxios();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("popular");
  const [loading, setLoading] = useState(false);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- TABS CONFIG ---
  const tabs = [
    { id: "all", label: "All", icon: <FaLayerGroup /> },
    { id: "Design", label: "Design", icon: <FaPaintBrush /> },
    { id: "Writing", label: "Writing", icon: <FaPenNib /> },
    { id: "Coding", label: "Coding", icon: <FaCode /> },
    { id: "Business", label: "Business", icon: <FaBusinessTime /> },
    { id: "Gaming", label: "Gaming", icon: <IoGameController /> },
    { id: "Marketing", label: "Marketing", icon: <TbSpeakerphone /> },
  ];

  // ✅ URL -> state sync (THIS IS THE FIX)
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // supports: ?tab=Design OR ?category=Design OR ?q=Design
    const tabParam = (params.get("tab") || params.get("category") || "").trim();
    const qParam = (params.get("q") || "").trim();

    const TAB_IDS = tabs.map((t) => t.id);
    const findTabCaseInsensitive = (value) =>
      TAB_IDS.find((t) => t.toLowerCase() === String(value).toLowerCase());

    // If user clicked badge -> /all-contests?tab=Design
    if (tabParam) {
      const validTab = findTabCaseInsensitive(tabParam) || "all";
      setActiveTab(validTab);
      setSearchQuery("");
      setCurrentPage(1);
      return;
    }

    // If user searched -> /all-contests?q=something
    if (qParam) {
      const matchedTab = findTabCaseInsensitive(qParam);

      if (matchedTab) {
        // If search term exactly matches a tab name, open that tab
        setActiveTab(matchedTab);
        setSearchQuery("");
      } else {
        setActiveTab("all");
        setSearchQuery(qParam);
      }
      setCurrentPage(1);
    }
  }, [location.search]); // run when URL changes

  // --- FETCH DATA ---
  const { data: ContestData, isLoading } = useQuery({
    queryKey: ["allContest"],
    queryFn: async () => {
      setLoading(true);
      const res = await axiosPublic.get("public/contests");
      setLoading(false);
      return res.data;
    },
  });

  // Handle data structure safely
  const allContests = ContestData?.data || [];

  // --- FILTER & SORT LOGIC ---
  const filteredContests = allContests.filter((contest) => {
    const active = activeTab.toLowerCase();

    const type = String(contest.contestType || contest.type || "").toLowerCase();
    const tagList = Array.isArray(contest.tags)
      ? contest.tags.map((t) => String(t).toLowerCase())
      : [];

    // Tab filter: match contestType OR tags
    const typeMatch = active === "all" || type === active || tagList.includes(active);

    // Search filter
    const search = searchQuery.trim().toLowerCase();
    const name = String(contest.contestName || "").toLowerCase();
    const desc = String(contest.description || "").toLowerCase();
    const tagsText = tagList.join(" ");

    const searchMatch =
      !search || name.includes(search) || desc.includes(search) || tagsText.includes(search);

    return typeMatch && searchMatch;
  });

  // Sort Logic
  const sortedContests = [...filteredContests].sort((a, b) => {
    if (sortOrder === "popular") return (b.participationCount || 0) - (a.participationCount || 0);
    if (sortOrder === "prize-high") return (b.prizeMoney || 0) - (a.prizeMoney || 0);
    if (sortOrder === "prize-low") return (a.prizeMoney || 0) - (b.prizeMoney || 0);
    return 0;
  });

  // --- PAGINATION CALCULATION ---
  const totalPages = Math.ceil(sortedContests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContests = sortedContests.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      {loading ? (
        <Loading></Loading>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-base-content">
              Explore <span className="text-primary">Contests</span>
            </h1>
            <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
              Discover the perfect challenge to showcase your skills. From coding to design, we have it all.
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
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`group relative flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all duration-300 ${
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-base-content/60 hover:text-base-content"
                    }`}
                  >
                    <span
                      className={`text-lg ${
                        activeTab === tab.id ? "scale-110" : "group-hover:scale-110"
                      } transition-transform`}
                    >
                      {tab.icon}
                    </span>
                    <span className="tracking-wide uppercase text-xs">{tab.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-full bg-primary transform transition-transform duration-300 origin-center z-10 ${
                        activeTab === tab.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                      }`}
                    ></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-xs" />
                <input
                  type="text"
                  placeholder="Search contests or tags..."
                  className="input input-sm input-bordered w-full pl-9 rounded-lg focus:input-primary bg-base-100"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <select
                className="select select-sm select-bordered w-full md:w-40 pl-3 pr-8 rounded-lg focus:select-primary bg-base-100 font-medium text-xs"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="popular">Popular</option>
                <option value="prize-high">High Prize</option>
                <option value="prize-low">Low Prize</option>
              </select>
            </div>
          </div>

          {/* --- CONTESTS GRID --- */}
          {paginatedContests.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedContests.map((contest, index) => (
                  <motion.div
                    key={contest._id}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-base-300 group overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <figure className="relative h-48 overflow-hidden bg-base-200">
                      <img
                        src={contest.image || "https://placehold.co/600x400?text=Contest"}
                        alt={contest.contestName}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => (e.target.src = "https://placehold.co/600x400?text=No+Image")}
                      />
                      <div className="absolute top-4 right-4 bg-base-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                        <FaUsers className="text-primary" /> {contest.participationCount || 0}
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
                        <span className="text-primary">Prize: ${contest.prizeMoney || 0}</span>
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
              <div className="flex justify-center items-center gap-2">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                <div className="join hidden sm:flex">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`join-item btn btn-sm ${currentPage === i + 1 ? "btn-active btn-primary" : ""}`}
                      onClick={() => handlePageChange(i + 1)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 opacity-50">
              <FaSearch className="text-6xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold">No contests found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllContests;
