import { Link } from "react-router";
import { FaUsers, FaArrowRight } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useAxios from "../../hooks/axios/useAxios";
import { useQuery } from "@tanstack/react-query";
const PopularContests = () => {
  const axios = useAxios();
  const { data: ContestsData } = useQuery({
    queryKey: ['PopularContest'],
    queryFn: async () => {
      const res = await axios.get("public/contests/popular");
      return res.data;
    }
  });
  console.log(ContestsData?.data);
  const popularContests = ContestsData?.data;
  return (
    <section className="py-20 px-4 bg-base-200">
      <div className="max-w-7xl mx-auto">

        {/* Header Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-base-content">
            Popular <span className="text-primary">Contests</span>
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Join the most trending challenges on our platform. Compete with hundreds of creators and claim your victory.
          </p>
        </motion.div>

        {/* Contests Grid with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularContests?.map((contest, index) => (
            <motion.div
              key={contest._id}

              // 2. Add Animation Props
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1, 
                ease: "easeOut"
              }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}

              className="card bg-base-100 shadow-xl border border-base-300 group overflow-hidden"
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
                <h3 className="card-title text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                  {contest.contestName}
                </h3>

                <p className="text-base-content/70 text-sm mb-4">
                  {contest.description.length > 80
                    ? contest.description.slice(0, 120) + "..."
                    : contest.description}
                </p>
                <div className="card-actions justify-end mt-auto">
                  <Link to={`/contest/details/${contest?._id}`} className="btn btn-primary btn-sm w-full gap-2">
                    View Details <FaArrowRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Button Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/all-contests" className="btn btn-outline btn-sm px-10 gap-2 hover:bg-primary hover:text-white transition-all">
            Show All Contests
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default PopularContests;