import { FaTrophy, FaCrown, FaDollarSign } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/axios/useAxios";

const WinnerSection = () => {
  // Demo Data for Recent Winners
  // const winners = [
  //   {
  //     id: 1,
  //     name: "Sarah Jenkins",
  //     contest: "UI/UX Dashboard Design",
  //     prize: "$2,000",
  //     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
  //     badge: "Gold"
  //   },
  //   {
  //     id: 2,
  //     name: "Michael Chen",
  //     contest: "Python AI Optimizer",
  //     prize: "$1,500",
  //     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
  //     badge: "Silver"
  //   },
  //   {
  //     id: 3,
  //     name: "Emma Wilson",
  //     contest: "Eco-Friendly Logo",
  //     prize: "$800",
  //     image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
  //     badge: "Bronze"
  //   }
  // ];
  const axios = useAxios();
  const { data: winnersData } = useQuery({
    queryKey: ["winners"],
    queryFn: async () => {
      const res = await axios.get("public/leaderboard?limit=3");
      return res.data;
    }
  })
  const winners = winnersData?.data;
  return (
    <section className="py-20 bg-linear-to-b from-base-100 to-base-200 relative overflow-hidden">

      {/* Background Decor: Abstract Gold Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[-100px] w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[-100px] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* 1. Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4 animate-bounce">
            <FaCrown className="text-5xl text-yellow-400 drop-shadow-lg" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4">
            Meet Our <span className="text-primary">Champions</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            These creators turned their skills into success. Join the leaderboard and write your own victory story.
          </p>
        </div>

        {/* 2. Winner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {(() => {
            // UI order: [left, middle, right] = [2nd, 1st, 3rd]
            const orderedWinners = winners ? [winners[1], winners[0], winners[2]].filter(Boolean) : [];

            return orderedWinners.map((winner, pos) => {
              // pos: 0=left, 1=middle, 2=right
              const isMiddle = pos === 1;
              const isFirstWinner = winner?._id === winners?.[0]?._id; // actual rank #1

              return (
                <div
                  key={winner?._id}
                  className={`card bg-base-100 shadow-xl border border-base-300 transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl
            ${isMiddle ? "md:-mt-8 md:mb-8 border-primary/50 shadow-primary/20" : ""}`}
                >
                  <div className="card-body items-center text-center">
                    {/* Image Ring */}
                    <div
                      className={`w-24 h-24 rounded-full p-1 border-4 mb-4
                ${isFirstWinner
                          ? "border-yellow-400"
                          : pos === 0
                            ? "border-gray-300"
                            : "border-orange-400"
                        }`}
                    >
                      <img
                        src={winner?.photoURL}
                        alt={winner?.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Name & Title */}
                    <h3 className="text-xl font-bold text-base-content">{winner?.name}</h3>
                    <p className="text-sm text-base-content/60 font-medium mb-4">
                      Total Wins: {winner?.winCount ?? 0}
                    </p>

                    {/* Prize Tag */}
                    <div className="badge badge-lg py-4 px-6 gap-2 bg-base-200 border-none text-base-content shadow-inner">
                      <FaTrophy
                        className={
                          isFirstWinner
                            ? "text-yellow-500"
                            : pos === 0
                              ? "text-gray-400"
                              : "text-orange-500"
                        }
                      />
                      <span className="font-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(Number(winner?.totalEarnings ?? 0))}{" "}
                        Won
                      </span>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>


        {/* 3. Global Stats Strip */}
        <div className="bg-primary text-primary-content rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.01] transition-transform">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-primary-content/20">

            {/* Stat 1 */}
            <div className="flex flex-col items-center p-4">
              <FaTrophy className="text-5xl mb-4 opacity-90" />
              <h4 className="text-4xl font-extrabold mb-1">150+</h4>
              <p className="font-medium opacity-80 uppercase tracking-wider text-sm">Contests Held</p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center p-4">
              <FaDollarSign className="text-5xl mb-4 opacity-90" />
              <h4 className="text-4xl font-extrabold mb-1">$50,000+</h4>
              <p className="font-medium opacity-80 uppercase tracking-wider text-sm">Prize Money Paid</p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center p-4">
              <div className="text-5xl mb-4 opacity-90 font-bold">12k</div>
              <h4 className="text-4xl font-extrabold mb-1">Users</h4>
              <p className="font-medium opacity-80 uppercase tracking-wider text-sm">Global Community</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WinnerSection;