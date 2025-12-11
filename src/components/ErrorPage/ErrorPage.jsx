import { Link } from "react-router";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">
      
      {/* Background Ambience (Static - No Animation) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 text-center p-8 max-w-2xl mx-auto">
        
        {/* Floating Icon (Animation Kept) */}
        <div className="mb-6 flex justify-center">
            <div className="p-6 bg-base-100/50 backdrop-blur-md rounded-full border border-base-content/10 shadow-2xl animate-bounce">
                <FaExclamationTriangle className="text-6xl text-warning" />
            </div>
        </div>

        {/* Massive 404 Text */}
        <h1 className="text-9xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary drop-shadow-sm select-none">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-base-content mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-base-content/70 mb-8 max-w-md mx-auto leading-relaxed">
          Oops! It seems the page you are looking for has vanished into the void. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary btn-lg px-8 shadow-lg shadow-primary/30 gap-2 hover:scale-105 transition-transform">
            <FaHome /> Back to Home
          </Link>
          
          <button onClick={() => window.history.back()} className="btn btn-outline btn-lg px-8 gap-2 hover:bg-base-content hover:text-base-100">
             Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;