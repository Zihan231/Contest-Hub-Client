import React, { useState } from 'react';
import { FaTrophy, FaCrown, FaArrowRight, FaGift, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const MyWinningContests = () => {
    // --- MOCK DATA ---
    const winningHistory = [
        { id: 1, contestName: "Ultimate UI/UX Challenge", category: "Design", prize: "$500", image: "https://images.unsplash.com/photo-1561089489-f13d5e730d72?q=80&w=1000&auto=format&fit=crop", date: "Dec 20, 2025" },
        { id: 2, contestName: "Python AI Optimization", category: "Coding", prize: "$300", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop", date: "Nov 15, 2025" },
        { id: 3, contestName: "Creative Blog Writing", category: "Writing", prize: "$150", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000&auto=format&fit=crop", date: "Oct 05, 2025" },
        { id: 4, contestName: "Logo Design Master", category: "Design", prize: "$200", image: "https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=1000&auto=format&fit=crop", date: "Sep 20, 2025" },
        { id: 5, contestName: "React Performance", category: "Coding", prize: "$450", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop", date: "Aug 12, 2025" },
        { id: 6, contestName: "Marketing Strategy", category: "Business", prize: "$100", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop", date: "Jul 01, 2025" },
        { id: 7, contestName: "Mobile Game Art", category: "Design", prize: "$300", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop", date: "Jun 15, 2025" },
        { id: 8, contestName: "SEO Article Writing", category: "Writing", prize: "$50", image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1000&auto=format&fit=crop", date: "May 10, 2025" },
    ];

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(winningHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = winningHistory.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Optional: Scroll to top of grid
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

    return (
        <div className="w-full space-y-8 min-h-screen pb-10">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-base-content flex items-center gap-3">
                        Winning <span className="text-yellow-500">History</span> <FaTrophy className="text-yellow-500" />
                    </h2>
                    <p className="text-base-content/60 mt-2">Your hall of fame and achievements.</p>
                </div>

                {/* Stats Widget */}
                <div className="stats shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                    <div className="stat place-items-center">
                        <div className="stat-title text-white/80 font-bold uppercase tracking-widest text-xs">Total Wins</div>
                        <div className="stat-value text-white flex items-center gap-2 text-3xl">
                            <FaCrown /> {winningHistory.length} Wins
                        </div>
                    </div>
                </div>
            </div>

            {/* --- WINNING CARDS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentData.map((item, index) => (
                    <motion.div 
                        key={item.id}
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
                                src={item.image} 
                                alt={item.contestName} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
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
                                <p className="text-2xl font-black text-yellow-400 drop-shadow-sm">{item.prize}</p>
                            </div>
                        </figure>

                        {/* Card Body */}
                        <div className="card-body relative z-10 pt-4">
                            
                            {/* Meta Info */}
                            <div className="flex justify-between items-center text-xs font-bold text-base-content/50 uppercase tracking-widest mb-1">
                                <span className="flex items-center gap-1">{item.category}</span>
                                <span className="flex items-center gap-1"><FaCalendarAlt /> {item.date}</span>
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
                ))}
            </div>

            {/* --- PAGINATION CONTROLS (Only visible if > 6 items) --- */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2">
                    <button 
                        className="btn btn-circle btn-outline border-base-300 hover:border-primary hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-base-content"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft />
                    </button>

                    <div className="join">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`join-item btn ${currentPage === i + 1 ? "btn-primary text-white" : "btn-outline border-base-300"}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                        className="btn btn-circle btn-outline border-base-300 hover:border-primary hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-base-content"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}

            {/* --- EMPTY STATE (If no wins) --- */}
            {winningHistory.length === 0 && (
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