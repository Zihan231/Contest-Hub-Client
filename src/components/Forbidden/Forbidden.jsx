import React from 'react';
import { Link } from 'react-router';
import { FaLock, FaHome, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Forbidden = () => {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-error/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full text-center relative z-10">
                
                {/* Animated Lock Icon */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 relative inline-block"
                >
                    <div className="w-24 h-24 bg-base-100 rounded-full flex items-center justify-center shadow-xl mx-auto border-4 border-error/20">
                        <motion.div
                            animate={{ 
                                rotate: [0, -10, 10, -10, 10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 0.6, 
                                delay: 0.5,
                                repeat: Infinity, 
                                repeatDelay: 3 
                            }}
                        >
                            <FaLock className="text-5xl text-error" />
                        </motion.div>
                    </div>
                    {/* Floating badge */}
                    <div className="absolute -top-2 -right-2 badge badge-error text-white font-bold p-3 shadow-lg">
                        403
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-base-content mb-2">
                        Access <span className="text-error">Denied</span>
                    </h1>
                    <p className="text-lg text-base-content/60 mb-8 font-medium">
                        You don't have permission to access this area. <br className="hidden md:block"/>
                        This page is restricted to authorized personnel only.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="btn btn-outline border-base-content/20 hover:bg-base-300 gap-2">
                            <FaArrowLeft /> Go Back
                        </Link>
                        
                        <Link to="/dashboard" className="btn btn-primary shadow-lg shadow-primary/30 gap-2">
                            <FaHome /> Dashboard
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Forbidden;