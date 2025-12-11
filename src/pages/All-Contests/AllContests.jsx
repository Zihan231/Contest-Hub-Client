import { useState } from "react";
import { Link } from "react-router";
import { FaUsers, FaArrowRight, FaSearch, FaPenNib, FaCode, FaBusinessTime, FaLayerGroup, FaPaintBrush } from "react-icons/fa";

const AllContests = () => {
  const [activeTab, setActiveTab] = useState("all");

  // --- MOCK DATA ---
  const allContests = [
    {
      id: 1,
      contestName: "React Optimization Master",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
      description: "Optimize a heavy React application to achieve a 90+ Lighthouse score.",
      participationCount: 125,
      type: "coding",
      entryFee: 20,
    },
    {
      id: 2,
      contestName: "UI/UX Dark Mode Challenge",
      image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2070&auto=format&fit=crop",
      description: "Design a visually stunning dark mode interface for a fintech dashboard.",
      participationCount: 340,
      type: "design",
      entryFee: 15,
    },
    {
      id: 3,
      contestName: "Future Tech Article",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1942&auto=format&fit=crop",
      description: "Write a 1500-word article predicting technology trends for 2030.",
      participationCount: 56,
      type: "writing",
      entryFee: 5,
    },
    {
      id: 4,
      contestName: "Mobile Gaming Logos",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
      description: "Create a vector logo for a new Battle Royale mobile game.",
      participationCount: 210,
      type: "design",
      entryFee: 10,
    },
    {
      id: 5,
      contestName: "Python AI Chatbot",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
      description: "Build a context-aware chatbot using Python and OpenAI API.",
      participationCount: 89,
      type: "coding",
      entryFee: 25,
    },
    {
      id: 6,
      contestName: "Digital Marketing Plan",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      description: "Create a comprehensive marketing strategy for a new SaaS product.",
      participationCount: 45,
      type: "business",
      entryFee: 50,
    },
  ];

  // Tabs Configuration
  const tabs = [
    { id: "all", label: "All", icon: <FaLayerGroup /> },
    { id: "design", label: "Design", icon: <FaPaintBrush /> },
    { id: "writing", label: "Writing", icon: <FaPenNib /> },
    { id: "coding", label: "Dev", icon: <FaCode /> },
    { id: "business", label: "Business", icon: <FaBusinessTime /> },
  ];

  // Filter Logic
  const filteredContests = activeTab === "all" 
    ? allContests 
    : allContests.filter(contest => contest.type === activeTab);

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-base-content">
                Explore <span className="text-primary">Contests</span>
            </h1>
            <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
                Discover the perfect challenge to showcase your skills. From coding to design, we have it all.
            </p>
        </div>

        {/* --- NEW TAB DESIGN: Minimalist Underline --- */}
        <div className="border-b border-base-300 mb-12 overflow-x-auto">
            <div className="flex justify-start md:justify-center min-w-max px-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            group relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all duration-300
                            ${activeTab === tab.id 
                                ? "text-primary" 
                                : "text-base-content/60 hover:text-base-content"
                            }
                        `}
                    >
                        {/* Icon with hover bounce */}
                        <span className={`text-lg ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                            {tab.icon}
                        </span>
                        
                        {/* Label */}
                        <span className="tracking-wide">{tab.label}</span>

                        {/* Animated Bottom Border Indicator */}
                        <span 
                            className={`
                                absolute bottom-0 left-0 h-0.5 w-full bg-primary transform transition-transform duration-300 origin-center
                                ${activeTab === tab.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"}
                            `}
                        ></span>
                    </button>
                ))}
            </div>
        </div>

        {/* Contests Grid */}
        {filteredContests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredContests.map((contest) => (
                    <div 
                        key={contest.id} 
                        className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-base-300 group overflow-hidden"
                    >
                        {/* Card Image */}
                        <figure className="relative h-48 overflow-hidden">
                            <img 
                                src={contest.image} 
                                alt={contest.contestName} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 bg-base-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                <FaUsers className="text-primary" /> {contest.participationCount} People
                            </div>
                        </figure>

                        {/* Card Body */}
                        <div className="card-body p-6">
                            <div className="flex justify-between items-start">
                                <h3 className="card-title text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                                    {contest.contestName}
                                </h3>
                                <div className="badge badge-outline text-xs opacity-70 uppercase tracking-wide">{contest.type}</div>
                            </div>
                            
                            <p className="text-base-content/70 text-sm mb-4">
                                {contest.description.length > 80 
                                    ? contest.description.slice(0, 80) + "..." 
                                    : contest.description}
                            </p>

                            <div className="card-actions justify-end mt-auto">
                                <Link to={`/contest/details/${contest.id}`} className="btn btn-primary btn-sm w-full gap-2 shadow-md shadow-primary/20">
                                    View Details <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            // Empty State
            <div className="text-center py-20 opacity-50">
                <FaSearch className="text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold">No contests found</h3>
                <p>Try selecting a different category.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AllContests;