import { FaShieldAlt, FaUserLock, FaCookieBite, FaServer, FaEnvelope, FaGavel } from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-base-200 relative font-sans text-base-content selection:bg-primary selection:text-primary-content">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-base-100/50 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest mb-4 border border-primary/20">
                <FaShieldAlt /> Legal Center
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
                Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Policy</span>
            </h1>
            <p className="opacity-60 max-w-2xl mx-auto text-lg">
                Your privacy is non-negotiable. Here is how we protect your data at ContestHub.
            </p>
            <p className="mt-4 text-sm font-mono opacity-50">Last Updated: October 25, 2025</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* --- LEFT COL: STICKY NAVIGATION --- */}
            <div className="hidden lg:block lg:col-span-4 sticky top-24">
                <div className="card bg-base-100/80 backdrop-blur-md shadow-xl border border-base-content/5">
                    <div className="card-body p-6">
                        <h3 className="font-bold text-lg mb-4 opacity-40 uppercase tracking-widest">Contents</h3>
                        <ul className="menu w-full p-0 gap-2">
                            <li><a href="#collection" className="active:bg-primary hover:text-primary font-medium"><FaUserLock className="text-xs" /> Data Collection</a></li>
                            <li><a href="#usage" className="hover:text-primary font-medium"><FaServer className="text-xs" /> How We Use Data</a></li>
                            <li><a href="#security" className="hover:text-primary font-medium"><FaShieldAlt className="text-xs" /> Security Measures</a></li>
                            <li><a href="#cookies" className="hover:text-primary font-medium"><FaCookieBite className="text-xs" /> Cookies & Tracking</a></li>
                            <li><a href="#contact" className="hover:text-primary font-medium"><FaEnvelope className="text-xs" /> Contact Us</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* --- RIGHT COL: CONTENT --- */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* Section 1 */}
                <div id="collection" className="card bg-base-100 shadow-sm border border-base-content/5 p-8 lg:p-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-2xl">
                            <FaUserLock />
                        </div>
                        <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                    </div>
                    <div className="space-y-4 opacity-80 leading-relaxed">
                        <p>
                            We collect information you provide directly to us when you create an account, participate in a contest, or communicate with us. This includes:
                        </p>
                        <ul className="list-disc list-outside ml-6 space-y-2">
                            <li><span className="font-bold text-base-content">Personal Identity:</span> Name, email address, and profile picture.</li>
                            <li><span className="font-bold text-base-content">Payment Data:</span> Transaction history and billing details (processed securely via Stripe).</li>
                            <li><span className="font-bold text-base-content">Contest Data:</span> Submissions, descriptions, and file uploads related to contests.</li>
                        </ul>
                    </div>
                </div>

                {/* Section 2 */}
                <div id="usage" className="card bg-base-100 shadow-sm border border-base-content/5 p-8 lg:p-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 text-2xl">
                            <FaServer />
                        </div>
                        <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
                    </div>
                    <p className="opacity-80 leading-relaxed mb-4">
                        We use the information we collect to operate, maintain, and improve our services. Specifically, we use your data to:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-base-200/50 border border-base-content/5">
                            <h4 className="font-bold mb-1">Service Delivery</h4>
                            <p className="text-sm opacity-60">Facilitating contest creation, participation, and winner selection.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-base-200/50 border border-base-content/5">
                            <h4 className="font-bold mb-1">Security</h4>
                            <p className="text-sm opacity-60">Detecting and preventing fraud, spam, and unauthorized access.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-base-200/50 border border-base-content/5">
                            <h4 className="font-bold mb-1">Communication</h4>
                            <p className="text-sm opacity-60">Sending updates, security alerts, and support messages.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-base-200/50 border border-base-content/5">
                            <h4 className="font-bold mb-1">Analytics</h4>
                            <p className="text-sm opacity-60">Analyzing usage trends to improve user experience.</p>
                        </div>
                    </div>
                </div>

                {/* Section 3 */}
                <div id="security" className="card bg-base-100 shadow-sm border border-base-content/5 p-8 lg:p-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 text-2xl">
                            <FaShieldAlt />
                        </div>
                        <h2 className="text-2xl font-bold">3. Data Security</h2>
                    </div>
                    <p className="opacity-80 leading-relaxed">
                        We implement industry-standard security measures to protect your personal information. We use <span className="font-bold text-primary">JWT (JSON Web Tokens)</span> for secure authentication and do not store sensitive payment information on our servers; all payments are handled by our secure payment gateway partners.
                    </p>
                </div>

                {/* Section 4 */}
                <div id="cookies" className="card bg-base-100 shadow-sm border border-base-content/5 p-8 lg:p-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-2xl">
                            <FaCookieBite />
                        </div>
                        <h2 className="text-2xl font-bold">4. Cookies & Tracking</h2>
                    </div>
                    <p className="opacity-80 leading-relaxed">
                        We use local storage and session cookies to maintain your login session and theme preferences. We do not sell your browsing data to third-party advertisers.
                    </p>
                </div>

                {/* Footer / Contact */}
                <div id="contact" className="card bg-primary text-primary-content shadow-xl p-8 lg:p-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-black mb-2 flex items-center gap-2"><FaGavel /> Legal Inquiries</h2>
                            <p className="opacity-80">
                                If you have any questions about this Privacy Policy, please contact us.
                            </p>
                        </div>
                        <a href="mailto:privacy@contesthub.com" className="btn btn-white text-primary hover:bg-gray-100 border-none shadow-lg px-8">
                            privacy@contesthub.com
                        </a>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;