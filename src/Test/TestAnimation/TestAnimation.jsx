import React from "react";
import { motion } from "framer-motion";

const TestAnimation = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      
      {/* Replace 'div' with 'motion.div' to enable animations */}
      <motion.div
        
        // 1. Initial State (Hidden & Moved down)
        initial={{ opacity: 0, y: 50 }}
        
        // 2. Animate to (Visible & Original position)
        animate={{ opacity: 1, y: 0 }}
        
        // 3. Transition Settings (Smoothness, Duration)
        transition={{ duration: 0.8, ease: "easeOut" }}
        
        // 4. Interactive Animations (Hover & Click)
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        
        className="card w-96 bg-base-100 shadow-xl cursor-pointer"
      >
        <div className="card-body">
          <h2 className="card-title text-primary">Hello Animation! 🚀</h2>
          <p>I faded in from the bottom. Hover over me to see me grow!</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Click Me</button>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default TestAnimation;