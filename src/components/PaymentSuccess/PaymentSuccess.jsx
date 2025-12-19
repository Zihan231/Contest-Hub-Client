import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../hooks/axiosSecure/useAxiosSecure';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`user/contest/payment/check?session_id=${sessionId}`).then(res => {
                console.log(res.data);
            })
        }
        else {
            console.log("bal")
        }
    },[axiosSecure, sessionId])
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">
            
            {/* Subtle Background Blobs for "Premium" feel */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Main Card */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="card w-full max-w-sm bg-base-100 shadow-2xl border border-base-200 relative z-10 mx-4"
            >
                <div className="card-body items-center text-center p-8">
                    
                    {/* Animated Success Icon Circle */}
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20, 
                            delay: 0.1 
                        }}
                        className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner"
                    >
                        <FaCheck className="text-4xl" />
                    </motion.div>

                    {/* Text Content */}
                    <h2 className="text-2xl font-black text-base-content mb-2">Payment Confirmed</h2>
                    <p className="text-base-content/60 text-sm mb-8 leading-relaxed">
                        Your transaction was successful. You are now officially registered for the contest.
                    </p>

                    {/* Action Buttons */}
                    <div className="w-full space-y-3">
                        <Link 
                            to="/dashboard/user/contest/participation" 
                            className="btn btn-primary w-full shadow-lg shadow-primary/20"
                        >
                            View My Contests <FaArrowRight />
                        </Link>
                        
                        <Link 
                            to="/" 
                            className="btn btn-ghost w-full text-base-content/70 hover:bg-base-200"
                        >
                            Back to Home
                        </Link>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;