import { FaCrown } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/axios/useAxios";

const Leaderboard = () => {
  const axios = useAxios();

  const {
    data: winnersRes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["winners"],
    queryFn: async () => {
      // ✅ keep / in front (depends on your axios baseURL)
      const res = await axios.get("/public/leaderboard");
      return res.data; // expected: { message, count, data: [] }
    },
  });

  // ✅ normalize backend fields -> UI fields + safe defaults
  const leaderboardData = (winnersRes?.data ?? [])
    .map((u) => ({
      id: u?._id,
      name: u?.name ?? "Unknown",
      photo: u?.photoURL || `https://i.pravatar.cc/150?u=${u?._id || u?.email || "user"}`,
      wins: Number(u?.winCount ?? 0),
      earnings: Number(u?.totalEarnings ?? 0),
    }))
    .sort((a, b) => b.wins - a.wins || b.earnings - a.earnings);

  const topThree = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  const money = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(amount ?? 0));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="alert alert-error max-w-xl">
          <span>
            Failed to load leaderboard{error?.message ? `: ${error.message}` : "."}
          </span>
        </div>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="alert alert-info max-w-xl">
          <span>No winners yet. Win a contest to appear on the leaderboard!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-primary/10 to-transparent pointer-events-none"></div>

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

        {/* --- TOP 3 PODIUM SECTION --- */}
        <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16">
          {/* 2nd Place */}
          {second && (
            <div className="order-2 md:order-1 flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-400 overflow-hidden shadow-xl ring-4 ring-slate-400/20">
                  <img src={second.photo} alt={second.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 badge badge-lg bg-slate-400 text-white font-bold border-none shadow-md">
                  2nd
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="font-bold text-lg">{second.name}</h3>
                <p className="text-slate-500 font-bold text-xl">{second.wins} Wins</p>
                <p className="text-xs opacity-60 font-bold">{money(second.earnings)}</p>
              </div>
              <div className="h-24 w-32 bg-linear-to-t from-slate-400/30 to-transparent mt-4 rounded-t-lg backdrop-blur-sm border-t border-slate-400/30"></div>
            </div>
          )}

          {/* 1st Place */}
          {first && (
            <div className="order-1 md:order-2 flex flex-col items-center -mt-10 md:mt-0 z-10 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative mb-2">
                <FaCrown className="text-5xl text-amber-500 absolute -top-12 left-1/2 -translate-x-1/2 drop-shadow-lg animate-bounce" />
                <div className="w-32 h-32 rounded-full border-4 border-amber-500 overflow-hidden shadow-2xl ring-4 ring-amber-500/30">
                  <img src={first.photo} alt={first.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 badge badge-lg bg-amber-500 text-white font-black border-none shadow-lg px-4 py-3">
                  1st
                </div>
              </div>
              <div className="mt-8 text-center">
                <h3 className="font-bold text-2xl">{first.name}</h3>
                <p className="text-amber-600 font-black text-2xl">{first.wins} Wins</p>
                <p className="text-sm opacity-60 font-bold text-amber-700/60">
                  {money(first.earnings)}
                </p>
              </div>
              <div className="h-32 w-40 bg-linear-to-t from-amber-500/30 to-transparent mt-4 rounded-t-xl backdrop-blur-sm border-t border-amber-500/40"></div>
            </div>
          )}

          {/* 3rd Place */}
          {third && (
            <div className="order-3 flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-orange-600 overflow-hidden shadow-xl ring-4 ring-orange-600/20">
                  <img src={third.photo} alt={third.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 badge badge-lg bg-orange-600 text-white font-bold border-none shadow-md">
                  3rd
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="font-bold text-lg">{third.name}</h3>
                <p className="text-orange-700 font-bold text-xl">{third.wins} Wins</p>
                <p className="text-xs opacity-60 font-bold">{money(third.earnings)}</p>
              </div>
              <div className="h-20 w-32 bg-linear-to-t from-orange-600/30 to-transparent mt-4 rounded-t-lg backdrop-blur-sm border-t border-orange-600/30"></div>
            </div>
          )}
        </div>

        {/* --- RANKINGS TABLE --- */}
        <div className="card bg-base-100/80 backdrop-blur-md shadow-2xl border border-base-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-lg">
              <thead className="bg-base-200/50 text-base-content/70">
                <tr>
                  <th className="text-center w-20">Rank</th>
                  <th>User</th>
                  <th className="text-center">Contests Won</th>
                  <th className="text-right">Total Earnings</th>
                </tr>
              </thead>

              <tbody>
                {others.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 opacity-60">
                      Only top 3 winners available right now.
                    </td>
                  </tr>
                ) : (
                  others.map((user, index) => (
                    <tr key={user.id} className="hover:bg-base-200/50 transition-colors">
                      <td className="text-center font-bold opacity-50 text-xl">#{index + 4}</td>

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
                        {money(user.earnings)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
