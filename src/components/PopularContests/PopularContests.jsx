import { Link } from "react-router";
import { FaUsers, FaArrowRight } from "react-icons/fa";
// 1. Import motion
import { motion } from "framer-motion";

const PopularContests = () => {
  const contests = [
    {
      id: 1,
      contestName: "React Optimization Master",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
      description: "Optimize a heavy React application to achieve a 90+ Lighthouse score. Focus on memoization, lazy loading, and bundle size reduction.",
      participationCount: 125,
      entryFee: 20,
      prizeMoney: 750,
    },
    {
      id: 2,
      contestName: "UI/UX Dark Mode Challenge",
      image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2070&auto=format&fit=crop",
      description: "Design a visually stunning dark mode interface for a fintech dashboard. Focus on contrast ratios and accessibility.",
      participationCount: 340,
      entryFee: 15,
      prizeMoney: 500,
    },
    {
      id: 3,
      contestName: "Python AI Chatbot",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
      description: "Build a context-aware chatbot using Python and OpenAI API. Must handle conversation history efficiently.",
      participationCount: 89,
      entryFee: 25,
      prizeMoney: 1000,
    },
    {
      id: 4,
      contestName: "Mobile Gaming Logos",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
      description: "Create a vector logo for a new Battle Royale mobile game. Needs to be aggressive, colorful, and scalable.",
      participationCount: 210,
      entryFee: 10,
      prizeMoney: 300,
    },
    {
      id: 5,
      contestName: "Article Writing: Future Tech",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1942&auto=format&fit=crop",
      description: "Write a 1500-word article predicting technology trends for 2030. Must be backed by current research and data.",
      participationCount: 56,
      entryFee: 5,
      prizeMoney: 150,
    },
    {
      id: 6,
      contestName: "Fullstack E-Commerce",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
      description: "Build a complete MERN stack e-commerce app with payment gateway integration and admin dashboard.",
      participationCount: 180,
      entryFee: 50,
      prizeMoney: 2000,
    }
  ];

  const popularContests = [...contests]
    .sort((a, b) => b.participationCount - a.participationCount)
    .slice(0, 6);

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
          {popularContests.map((contest, index) => (
            <motion.div 
              key={contest.id}
              
              // 2. Add Animation Props
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1, // Stagger effect: Card 1 waits 0s, Card 2 waits 0.1s, etc.
                ease: "easeOut"
              }}
              viewport={{ once: false }}
              whileHover={{ y: -10 }} // Hover effect handled by Framer Motion now
              
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
                    ? contest.description.slice(0, 80) + "..." 
                    : contest.description}
                </p>

                <div className="card-actions justify-end mt-auto">
                  <Link to='/contest/details/id' className="btn btn-primary btn-sm w-full gap-2">
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