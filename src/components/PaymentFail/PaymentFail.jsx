/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router';
import { FaTimes, FaRedoAlt, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PaymentFail = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">
            
            {/* Subtle Background Blobs for "Error" feel - Red tones */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-error/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Main Card */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="card w-full max-w-sm bg-base-100 shadow-2xl border border-base-200 relative z-10 mx-4"
            >
                <div className="card-body items-center text-center p-8">
                    
                    {/* Animated Failure Icon Circle - Wobble animation for error */}
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ 
                            scale: 1,
                            rotate: [0, -10, 10, -10, 10, 0] // Subtle shake effect
                        }}
                        transition={{ 
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1,
                            rotate: { duration: 0.5, delay: 0.3 } 
                        }}
                        className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mb-6 shadow-inner"
                    >
                        <FaTimes className="text-4xl" />
                    </motion.div>

                    {/* Text Content */}
                    <h2 className="text-2xl font-black text-base-content mb-2">Payment Failed</h2>
                    <p className="text-base-content/60 text-sm mb-8 leading-relaxed">
                        We couldn't process your transaction. You have not been charged. Please double-check your details and try again.
                    </p>

                    {/* Action Buttons */}
                    <div className="w-full space-y-3">
                        {/* Primary Action: Try Again. Points to a safe page to restart the flow, e.g., All Contests */}
                        <Link 
                            to="/dashboard/user/contest/participation" 
                            className="btn btn-error w-full shadow-lg shadow-error/20"
                        >
                            <FaRedoAlt /> Try Again
                        </Link>
                        
                        <Link 
                            to="/" 
                            className="btn btn-ghost w-full text-base-content/70 hover:bg-base-200 gap-2"
                        >
                            <FaHome /> Back to Home
                        </Link>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default PaymentFail;