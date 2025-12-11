import { FaCrown, FaTrophy, FaMedal } from "react-icons/fa";

const Leaderboard = () => {
  // --- MOCK DATA ---
  const leaderboardData = [
    { id: 1, name: "Sarah Jenkins", photo: "https://i.pravatar.cc/150?img=1", wins: 42, prizeMoney: 12500 },
    { id: 2, name: "Michael Chen", photo: "https://i.pravatar.cc/150?img=11", wins: 38, prizeMoney: 9800 },
    { id: 3, name: "Jessica Wong", photo: "https://i.pravatar.cc/150?img=5", wins: 31, prizeMoney: 7500 },
    { id: 4, name: "David Miller", photo: "https://i.pravatar.cc/150?img=3", wins: 28, prizeMoney: 5200 },
    { id: 5, name: "Emma Wilson", photo: "https://i.pravatar.cc/150?img=9", wins: 25, prizeMoney: 4100 },
    { id: 6, name: "James Anderson", photo: "https://i.pravatar.cc/150?img=12", wins: 22, prizeMoney: 3800 },
    { id: 7, name: "Robert Taylor", photo: "https://i.pravatar.cc/150?img=68", wins: 19, prizeMoney: 2500 },
    { id: 8, name: "Olivia Brown", photo: "https://i.pravatar.cc/150?img=49", wins: 15, prizeMoney: 1800 },
    { id: 9, name: "William Davis", photo: "https://i.pravatar.cc/150?img=33", wins: 12, prizeMoney: 1200 },
    { id: 10, name: "Sophia Evans", photo: "https://i.pravatar.cc/150?img=24", wins: 10, prizeMoney: 900 },
  ];

  const topThree = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-base-content">
                Global <span className="text-primary">Leaderboard</span>
            </h1>
            <p className="text-base-content/70 text-lg">
                Celebrating the top creators dominating the arena.
            </p>
        </div>

        {/* --- TOP 3 PODIUM SECTION (Updated Colors) --- */}
        <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16">
            
            {/* 2nd Place (Silver - Metallic Slate) */}
            <div className="order-2 md:order-1 flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-400 overflow-hidden shadow-xl ring-4 ring-slate-400/20">
                        <img src={topThree[1].photo} alt={topThree[1].name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 badge badge-lg bg-slate-400 text-white font-bold border-none shadow-md">
                        2nd
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <h3 className="font-bold text-lg">{topThree[1].name}</h3>
                    <p className="text-slate-500 font-bold text-xl">{topThree[1].wins} Wins</p>
                </div>
                {/* Pedestal */}
                <div className="h-24 w-32 bg-gradient-to-t from-slate-400/30 to-transparent mt-4 rounded-t-lg backdrop-blur-sm border-t border-slate-400/30"></div>
            </div>

            {/* 1st Place (Gold - Rich Amber) */}
            <div className="order-1 md:order-2 flex flex-col items-center -mt-10 md:-mt-0 z-10 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="relative mb-2">
                    <FaCrown className="text-5xl text-amber-500 absolute -top-12 left-1/2 -translate-x-1/2 drop-shadow-lg animate-bounce" />
                    <div className="w-32 h-32 rounded-full border-4 border-amber-500 overflow-hidden shadow-2xl ring-4 ring-amber-500/30">
                        <img src={topThree[0].photo} alt={topThree[0].name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 badge badge-lg bg-amber-500 text-white font-black border-none shadow-lg px-4 py-3">
                        1st
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <h3 className="font-bold text-2xl">{topThree[0].name}</h3>
                    <p className="text-amber-600 font-black text-2xl">{topThree[0].wins} Wins</p>
                    <p className="text-sm opacity-60 font-bold text-amber-700/60">${topThree[0].prizeMoney}</p>
                </div>
                {/* Pedestal */}
                <div className="h-32 w-40 bg-gradient-to-t from-amber-500/30 to-transparent mt-4 rounded-t-xl backdrop-blur-sm border-t border-amber-500/40"></div>
            </div>

            {/* 3rd Place (Bronze - Deep Orange) */}
            <div className="order-3 flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-orange-600 overflow-hidden shadow-xl ring-4 ring-orange-600/20">
                        <img src={topThree[2].photo} alt={topThree[2].name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 badge badge-lg bg-orange-600 text-white font-bold border-none shadow-md">
                        3rd
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <h3 className="font-bold text-lg">{topThree[2].name}</h3>
                    <p className="text-orange-700 font-bold text-xl">{topThree[2].wins} Wins</p>
                </div>
                {/* Pedestal */}
                <div className="h-20 w-32 bg-gradient-to-t from-orange-600/30 to-transparent mt-4 rounded-t-lg backdrop-blur-sm border-t border-orange-600/30"></div>
            </div>

        </div>

        {/* --- RANKINGS TABLE --- */}
        <div className="card bg-base-100/80 backdrop-blur-md shadow-2xl border border-base-300 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="table table-lg">
                    {/* Head */}
                    <thead className="bg-base-200/50 text-base-content/70">
                        <tr>
                            <th className="text-center w-20">Rank</th>
                            <th>User</th>
                            <th className="text-center">Contests Won</th>
                            <th className="text-right">Total Earnings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {others.map((user, index) => (
                            <tr key={user.id} className="hover:bg-base-200/50 transition-colors">
                                <td className="text-center font-bold opacity-50 text-xl">
                                    #{index + 4}
                                </td>
                                <td>
                                    <div className="flex items-center gap-4">
                                        <div className="avatar">
                                            <div className="w-12 rounded-full border border-base-content/10">
                                                <img src={user.photo} alt={user.name} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{user.name}</div>
                                            <div className="text-xs opacity-50">Grandmaster</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="badge badge-primary badge-outline font-bold p-3">
                                        {user.wins} Wins
                                    </div>
                                </td>
                                <td className="text-right font-mono font-bold opacity-80">
                                    ${user.prizeMoney.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;