import { useState } from "react";
import { FaSearch, FaLightbulb, FaPenNib, FaCode, FaGamepad } from "react-icons/fa";

const Banner = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search logic (redirect to All Contests with query param)
    console.log("Searching for:", searchTerm);
  };

  return (
    <div 
      className="hero min-h-[600px] relative overflow-hidden" 
      style={{
        backgroundImage: "url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop)",
        backgroundAttachment: "fixed" // Parallax effect for premium feel
      }}
    >
      {/* Overlay: Uses theme colors (Primary + Secondary) with opacity */}
      <div className="hero-overlay bg-gradient-to-r from-base-100/90 via-base-100/70 to-primary/20"></div>

      {/* Decorative Blobs (Abstract shapes for "Unique" look) */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="hero-content text-center text-neutral-content relative z-10">
        <div className="max-w-3xl">
          
          {/* Main Headline */}
          <h1 className="mb-5 text-5xl md:text-7xl font-bold text-base-content tracking-tight">
            Showcase Skills. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Compete & Create.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mb-8 text-lg md:text-xl text-base-content/70 font-medium">
            Join the ultimate platform for creators. Participate in premier contests, 
            win prizes, and build your portfolio today.
          </p>

          {/* Search Bar Container - Glassmorphism */}
          <div className="p-2 bg-base-100/30 backdrop-blur-md rounded-full border border-base-content/10 shadow-2xl max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              
              {/* Search Icon */}
              <div className="pl-4 text-base-content/50">
                <FaSearch />
              </div>

              {/* Input Field */}
              <input
                type="text"
                placeholder="Search by contest type (e.g., Coding, Design, Gaming)..."
                className="input input-ghost w-full focus:outline-none placeholder:text-base-content/50 text-base-content"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Action Button */}
              <button type="submit" className="btn btn-primary rounded-full px-8 text-white shadow-lg shadow-primary/30">
                Search
              </button>
            </form>
          </div>

          {/* Quick Tags / Categories */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 opacity-90">
            <span className="badge badge-lg badge-outline border-base-content/20 text-base-content/70 gap-2 p-4 cursor-pointer hover:bg-base-content/5 transition-colors">
              <FaLightbulb className="text-yellow-500" /> Business
            </span>
            <span className="badge badge-lg badge-outline border-base-content/20 text-base-content/70 gap-2 p-4 cursor-pointer hover:bg-base-content/5 transition-colors">
              <FaPenNib className="text-secondary" /> Writing
            </span>
            <span className="badge badge-lg badge-outline border-base-content/20 text-base-content/70 gap-2 p-4 cursor-pointer hover:bg-base-content/5 transition-colors">
              <FaCode className="text-blue-500" /> Development
            </span>
            <span className="badge badge-lg badge-outline border-base-content/20 text-base-content/70 gap-2 p-4 cursor-pointer hover:bg-base-content/5 transition-colors">
              <FaGamepad className="text-purple-500" /> Gaming
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Banner;