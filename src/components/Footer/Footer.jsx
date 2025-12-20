import { FaFacebook, FaLinkedin, FaTwitter, FaGithub, FaTrophy } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content border-t border-base-300">
      {/* Main Container: 3 Columns on Large Screens */}
      <div className="max-w-7xl mx-auto px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        
        {/* Column 1: Brand & Socials */}
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content shadow-lg">
                    <FaTrophy className="text-lg" />
                </div>
                <span className="font-bold text-2xl tracking-tight">
                    Contest<span className="text-primary">Hub</span>
                </span>
            </div>
            <p className="opacity-70 leading-relaxed max-w-sm">
               The ultimate platform to showcase your skills, compete with top talent, and win recognition on a global stage.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-2">
                <a href="https://www.facebook.com/Zihan231/" target="_blank" className="btn btn-sm btn-circle btn-ghost text-xl hover:text-primary transition-colors"><FaFacebook /></a>
                <a href="https://www.linkedin.com/in/zihan231/" target="_blank" className="btn btn-sm btn-circle btn-ghost text-xl hover:text-primary transition-colors"><FaLinkedin /></a>
                <a href="https://x.com/Zihan_231" target="_blank" className="btn btn-sm btn-circle btn-ghost text-xl hover:text-primary transition-colors"><BsTwitterX /></a>
                <a href="https://github.com/Zihan231" target="_blank" className="btn btn-sm btn-circle btn-ghost text-xl hover:text-primary transition-colors"><FaGithub /></a>
            </div>
        </div>

        {/* Column 2: Quick Links (Split into 2 sub-columns) */}
        <div className="grid grid-cols-2 gap-4">
            <nav className="flex flex-col gap-2">
                <h6 className="footer-title opacity-100 text-primary text-lg mb-2">Platform</h6>
                <Link to="/all-contests" className="link link-hover hover:text-primary transition-colors">Browse Contests</Link>
                <Link to="/leaderboard" className="link link-hover hover:text-primary transition-colors">Leaderboard</Link>
                {/* <Link to="/pricing" className="link link-hover hover:text-primary transition-colors">Pricing</Link>
                <Link to="/winners" className="link link-hover hover:text-primary transition-colors">Winners</Link> */}
            </nav>
            <nav className="flex flex-col gap-2">
                <h6 className="footer-title opacity-100 text-primary text-lg mb-2">Company</h6>
                <Link to="/about" className="link link-hover hover:text-primary transition-colors">About Us</Link>
                <Link to="/contact" className="link link-hover hover:text-primary transition-colors">Contact</Link>
                <Link to="/privacy" className="link link-hover hover:text-primary transition-colors">Privacy Policy</Link>
                {/* <Link to="/terms" className="link link-hover hover:text-primary transition-colors">Terms of Service</Link> */}
            </nav>
        </div>

        {/* Column 3: Newsletter */}
        <div className="flex flex-col gap-4">
            <h6 className="footer-title opacity-100 text-primary text-lg">Stay Updated</h6>
            <p className="opacity-70">Subscribe to our newsletter for the latest contest updates and winner announcements.</p>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="join w-full shadow-sm">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="input input-bordered join-item w-full focus:input-primary bg-base-100" 
                    />
                    <button className="btn btn-primary join-item px-6">Join</button>
                </div>
            </form>
        </div>

      </div>

      {/* Bottom Bar: Copyright */}
      <div className="bg-base-300/50 py-6 text-center border-t border-base-300">
        <p className="text-sm opacity-70">
            Copyright © 2025 <span className="font-bold text-primary">ContestHub</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;