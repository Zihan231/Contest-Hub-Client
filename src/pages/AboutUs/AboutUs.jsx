import { FaLightbulb, FaUsers, FaGlobeAmericas, FaRocket, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router";

const AboutUs = () => {
  // Mock Team Data
  const team = [
    { name: "Alex Carter", role: "Founder & CEO", img: "https://i.pravatar.cc/150?img=11" },
    { name: "Sophia Martinez", role: "Head of Design", img: "https://i.pravatar.cc/150?img=5" },
    { name: "Daniel Kim", role: "Lead Developer", img: "https://i.pravatar.cc/150?img=3" },
    { name: "Olivia Johnson", role: "Community Manager", img: "https://i.pravatar.cc/150?img=9" },
  ];

  return (
    <div className="min-h-screen bg-base-200 font-sans text-base-content">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Team working" 
                className="w-full h-full object-cover"
            />
            {/* Darkened overlay to ensure text pops */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-base-200"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
            <div className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                Our Story
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Empowering the World's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Creativity</span>
            </h1>
            
            {/* UPDATED TEXT COLOR HERE */}
            <p className="text-lg md:text-xl text-white opacity-90 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                ContestHub is where talent meets opportunity. We built this platform to give creators a stage, businesses a solution, and communities a place to thrive.
            </p>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* 2. MISSION & VISION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
            <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                <img 
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
                    className="rounded-3xl shadow-2xl border-4 border-base-100 relative z-10" 
                    alt="Mission" 
                />
                {/* Floating Stat Card */}
                {/* <div className="absolute -bottom-10 -right-5 bg-base-100 p-6 rounded-2xl shadow-xl border border-base-300 z-20 hidden md:block">
                    <div className="text-4xl font-black text-primary">50k+</div>
                    <div className="text-sm font-bold opacity-60 uppercase">Creators Joined</div>
                </div> */}
            </div>
            
            <div className="space-y-8">
                <h2 className="text-4xl font-bold">
                    More Than Just a <span className="text-primary">Platform</span>
                </h2>
                <p className="opacity-70 text-lg leading-relaxed">
                    We believe that everyone has a hidden talent waiting to be discovered. Whether you are a graphic designer, a writer, or a coder, ContestHub provides the arena for you to test your skills against the best.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-4 bg-base-100 rounded-xl border border-base-300 hover:border-primary/50 transition-colors">
                        <FaLightbulb className="text-3xl text-yellow-500 mb-3" />
                        <h3 className="font-bold text-lg">Innovation</h3>
                        <p className="text-sm opacity-60">Pushing boundaries with every challenge.</p>
                    </div>
                    <div className="p-4 bg-base-100 rounded-xl border border-base-300 hover:border-primary/50 transition-colors">
                        <FaUsers className="text-3xl text-blue-500 mb-3" />
                        <h3 className="font-bold text-lg">Community</h3>
                        <p className="text-sm opacity-60">Growing together through competition.</p>
                    </div>
                    <div className="p-4 bg-base-100 rounded-xl border border-base-300 hover:border-primary/50 transition-colors">
                        <FaGlobeAmericas className="text-3xl text-green-500 mb-3" />
                        <h3 className="font-bold text-lg">Global Reach</h3>
                        <p className="text-sm opacity-60">Connecting talent from 100+ countries.</p>
                    </div>
                    <div className="p-4 bg-base-100 rounded-xl border border-base-300 hover:border-primary/50 transition-colors">
                        <FaRocket className="text-3xl text-red-500 mb-3" />
                        <h3 className="font-bold text-lg">Growth</h3>
                        <p className="text-sm opacity-60">Accelerating careers and portfolios.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* 3. TEAM SECTION */}
        <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Meet the <span className="text-primary">Minds</span></h2>
            <p className="opacity-60 max-w-2xl mx-auto">
                The passionate group of developers, designers, and dreamers behind ContestHub.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
                <div key={index} className="card bg-base-100 shadow-xl border border-base-300 hover:-translate-y-2 transition-transform duration-300 group">
                    <figure className="px-6 pt-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                            <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                    </figure>
                    <div className="card-body items-center text-center">
                        <h3 className="card-title text-lg">{member.name}</h3>
                        <p className="text-sm opacity-60 uppercase font-bold tracking-wide">{member.role}</p>
                        <div className="card-actions mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="btn btn-sm btn-circle btn-ghost"><FaLinkedin /></button>
                            <button className="btn btn-sm btn-circle btn-ghost"><FaTwitter /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* 4. BOTTOM CTA */}
        <div className="mt-32 p-12 rounded-3xl bg-gradient-to-r from-primary to-secondary text-primary-content text-center relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to Join the Revolution?</h2>
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                    Start your journey today. Create a contest or join one to showcase your skills to the world.
                </p>
                <Link to={'/register'} className="btn btn-lg bg-white text-primary border-none hover:bg-gray-100 shadow-2xl">
                    Get Started Now
                </Link>
            </div>
            
            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;