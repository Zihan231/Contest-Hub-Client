import { Link, useParams } from "react-router";
import { FaUsers, FaTrophy, FaCalendarAlt, FaDollarSign, FaClock, FaCheckCircle, FaCrown } from "react-icons/fa";

const ContestDetails = () => {
  const { id } = useParams();

  // --- MOCK DATA (Replace with API Call) ---
  const contest = {
    name: "Business Logo Redesign",
    // FIXED: Using a direct image URL that works
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    participationCount: 42,
    description: "We are looking for a complete rebrand of our fintech startup. The logo needs to be modern, trust-inducing, and versatile for both mobile apps and billboards. Think 'Stripe meets Apple'.",
    taskInstruction: "Submit your design in high-resolution PNG and SVG formats. Include a brief explanation of your color theory choices.",
    prizeMoney: 500,
    entryFee: 15,
    deadline: "2025-12-31T23:59:59", // Future Date
    // winner: null 
    winner: { name: "Sarah Jenkins", photo: "https://i.pravatar.cc/150?img=5" } 
  };

  const isDeadlinePassed = new Date(contest.deadline) < new Date();

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      
      {/* 1. HERO BANNER SECTION */}
      <div className="relative h-[400px] w-full overflow-hidden">
        {/* Background Image */}
        <img 
            src={contest.image} 
            alt={contest.name} 
            className="w-full h-full object-cover"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-base-900/60 to-transparent"></div>
        
        {/* Title Container */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="badge badge-primary badge-lg mb-4 font-bold uppercase tracking-wider">Design Contest</div>
                <h1 className="text-4xl md:text-6xl font-black text-Black drop-shadow-lg mb-2">
                    {contest.name} 
                </h1>
                <p className="text-white/80 text-lg flex items-center gap-2">
                    <FaUsers className="text-yellow-400" /> 
                    <span className="font-bold text-primary">{contest.participationCount} Participants</span>  
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. LEFT COLUMN: MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Winner Section (Conditional) */}
            {contest.winner && (
                <div className="card bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 p-6 flex flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-yellow-400 p-1">
                            <img src={contest.winner.photo} alt="Winner" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <FaCrown className="absolute -top-3 -right-2 text-4xl text-yellow-400 drop-shadow-md animate-bounce" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-base-content">Winner Declared!</h3>
                        <p className="text-2xl font-black text-primary">{contest.winner.name}</p>
                        <p className="text-sm opacity-70">Congratulations on winning ${contest.prizeMoney}!</p>
                    </div>
                </div>
            )}

            {/* Description Card */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <FaCheckCircle className="text-primary" /> About the Contest
                    </h2>
                    <p className="text-base-content/80 leading-relaxed text-lg">
                        {contest.description} 
                    </p>
                </div>
            </div>

            {/* Task Instructions Card */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <FaTrophy className="text-primary" /> Task Instructions
                    </h2>
                    <div className="mockup-code bg-neutral text-neutral-content">
                        <pre className="whitespace-pre-wrap p-6 font-sans">
                            {contest.taskInstruction} 
                        </pre>
                    </div>
                </div>
            </div>
        </div>

        {/* 3. RIGHT COLUMN: SIDEBAR STATS & ACTION */}
        <div className="relative">
            <div className="card bg-base-100 shadow-2xl border border-base-300 sticky top-24">
                <div className="card-body">
                    
                    {/* Prize Money Block */}
                    <div className="text-center mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <p className="text-sm font-bold uppercase tracking-widest text-primary mb-1">Prize Money</p>
                        <h2 className="text-5xl font-black text-yellow-400 flex items-center justify-center gap-1">
                            <FaDollarSign className="text-3xl" size={40}/>{contest.prizeMoney}
                        </h2>
                    </div>

                    {/* Deadline Timer Mock */}
                    <div className="flex items-center justify-between mb-2 text-sm font-bold opacity-70">
                        <span>Deadline:</span>
                        <span className="text-error flex items-center gap-1">
                            <FaClock /> {new Date(contest.deadline).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Progress Bar for Deadline (Visual Touch) */}
                    <progress className="progress progress-primary w-full mb-6" value="70" max="100"></progress>

                    {/* Key Details List */}
                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                            <span className="flex items-center gap-2 font-medium"><FaDollarSign className="text-green-500"/> Entry Fee</span>
                            <span className="font-bold text-xl">${contest.entryFee}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                            <span className="flex items-center gap-2 font-medium"><FaUsers className="text-blue-500"/> Total Participants</span>
                            <span className="font-bold text-xl">{contest.participationCount}</span>
                        </div>
                    </div>

                    {/* Register Action Button */}
                    {isDeadlinePassed ? (
                        <button disabled className="btn btn-error w-full btn-lg text-white font-bold cursor-not-allowed opacity-50">
                            Contest Ended
                        </button>
                    ) : (
                        <Link 
                            to={`/payment/${id}`} 
                            className="btn btn-primary w-full btn-lg shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform"
                        >
                            Register Now
                        </Link>
                    )}
                    
                    <p className="text-xs text-center mt-4 opacity-50">
                        Secure payment powered by Stripe.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ContestDetails;