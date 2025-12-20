import { Link, useNavigate, useParams } from "react-router";
import {
  FaUsers, FaTrophy, FaClock, FaCheckCircle, FaCrown, FaDollarSign
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/axiosSecure/useAxiosSecure";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";

const ContestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext) 
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // contest details fetch (key must include id)
  const { data: contestData } = useQuery({
    queryKey: ["contestDetails", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`user/contest/${id}`);
      return res.data;
    },
  });

  const contest = contestData?.data || {};

  const isDeadlinePassed = contest?.deadline
    ? new Date(contest.deadline) < new Date()
    : false;

  // ✅ Helper to call your Payment API
  const initiatePayment = async () => {
    const paymentInfo = {
      contestId: id,
      cost: Number(contest.entryFee),
      contestName: contest.contestName,
      userEmail: user?.email,
    };
    const res = await axiosSecure.post("user/contest/payment", paymentInfo);
    return res.data.url;
  };

  // ✅ Join Contest Mutation
  const joinMutation = useMutation({
    mutationFn: async () => {
      // 1. Create the Registration Record (Pending)
      const payload = { contestID: id };
      const res = await axiosSecure.post(`user/contest/join`, payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["contestDetails", id] });

      // 2. Try to Redirect to Payment Immediately
      try {
        Swal.fire({
          title: 'Processing Registration...',
          text: 'Redirecting to payment gateway.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const stripeUrl = await initiatePayment();
        window.location.assign(stripeUrl); // 🚀 Redirect to Stripe

      } catch (error) {
        // 3. Fallback: If redirect fails, show the original Dashboard link
        console.error("Payment redirect failed:", error);
        Swal.close();
        
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "We couldn't redirect you to payment automatically. Please go to your Dashboard to pay.",
          showCancelButton: true,
          confirmButtonText: "Go to My Contests",
          cancelButtonText: "Stay here",
        }).then((result) => {
          if (result.isConfirmed) navigate("/dashboard/user/contest/participation");
        });
      }
    },
    onError: (err) => {
      const status = err?.response?.status;
      const apiMsg = err?.response?.data?.message;
      const paymentStatus = err?.response?.data?.paymentStatus;

      if (status === 409) {
        // Already registered logic
        if (String(paymentStatus || "").toLowerCase() === "paid") {
          Swal.fire({
            icon: "info",
            title: "Already registered",
            text: "You have already joined and paid for this contest.",
          });
          return;
        }

        // If registered but UNPAID, offer to pay now
        Swal.fire({
          icon: "warning",
          title: "Payment Pending",
          text: "You are already registered but haven't paid yet. Would you like to pay now?",
          showCancelButton: true,
          confirmButtonText: "Pay Now",
          cancelButtonText: "Later",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const stripeUrl = await initiatePayment();
              window.location.assign(stripeUrl);
            } catch (e) {
              navigate("/dashboard/user/contest/participation");
            }
          }
        });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: apiMsg || "Something went wrong. Please try again.",
      });
    },
  });

  const handleRegister = () => {
    if (!id) return;
    joinMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      {/* HERO */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={contest?.image}
          alt={contest?.contestName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-base-900/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            {contest?.tags?.map((tag) => (
              <div
                key={tag}
                className="badge badge-primary badge-lg mb-4 font-bold uppercase tracking-wider mr-2"
              >
                {tag}
              </div>
            ))}

            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-2">
              {contest?.contestName}
            </h1>

            <p className="text-white/80 text-lg flex items-center gap-2">
              <FaUsers className="text-yellow-400" />
              <span className="font-bold text-primary">
                {contest?.participationCount} Participants
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {contest?.winnerEmail && (
            <div className="card bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 p-6 flex flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-yellow-400 p-1">
                  <img
                    src={contest.winnerPhoto}
                    alt="Winner"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <FaCrown className="absolute -top-3 -right-2 text-4xl text-yellow-400 drop-shadow-md animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-base-content">
                  Winner Declared!
                </h3>
                <p className="text-2xl font-black text-primary">
                  {contest.winnerName}
                </p>
                <p className="text-sm opacity-70">
                  Congratulations on winning ${contest.prizeMoney}!
                </p>
              </div>
            </div>
          )}

          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary" /> About the Contest
              </h2>
              <p className="text-base-content/80 leading-relaxed text-lg">
                {contest?.description}
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaTrophy className="text-primary" /> Task Instructions
              </h2>
              <div className="mockup-code bg-neutral text-neutral-content">
                <pre className="whitespace-pre-wrap p-6 font-sans">
                  {contest?.instruction}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <div className="card bg-base-100 shadow-2xl border border-base-300 sticky top-24">
            <div className="card-body">
              <div className="text-center mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <p className="text-sm font-bold uppercase tracking-widest text-primary mb-1">
                  Prize Money
                </p>
                <h2 className="text-5xl font-black text-yellow-400 flex items-center justify-center gap-1">
                  <FaDollarSign className="text-3xl" size={40} />
                  {contest?.prizeMoney}
                </h2>
              </div>

              <div className="flex items-center justify-between mb-2 text-sm font-bold opacity-70">
                <span>Deadline:</span>
                <span className="text-error flex items-center gap-1">
                  <FaClock />
                  {contest?.deadline
                    ? new Date(contest.deadline).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <progress className="progress progress-primary w-full mb-6" value="70" max="100" />

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <span className="flex items-center gap-2 font-medium">
                    <FaDollarSign className="text-green-500" /> Entry Fee
                  </span>
                  <span className="font-bold text-xl">${contest?.entryFee}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <span className="flex items-center gap-2 font-medium">
                    <FaUsers className="text-blue-500" /> Total Participants
                  </span>
                  <span className="font-bold text-xl">
                    {contest?.participationCount}
                  </span>
                </div>
              </div>

              {/* ✅ REGISTER BUTTON */}
              {isDeadlinePassed ? (
                <button
                  disabled
                  className="btn btn-error w-full btn-lg text-white font-bold cursor-not-allowed opacity-50"
                >
                  Contest Ended
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={joinMutation.isPending}
                  className="btn btn-primary w-full btn-lg shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform"
                >
                  {joinMutation.isPending ? "Processing..." : "Register Now"}
                </button>
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