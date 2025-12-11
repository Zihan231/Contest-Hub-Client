import { useForm } from "react-hook-form";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaTwitter, FaLinkedin, FaGithub, FaPaperPlane } from "react-icons/fa";
import Swal from "sweetalert2";

const ContactUs = () => {
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm();

  const onSubmit = (data) => {
    // console.log("Message Data:", data);
    
    // Success Feedback
    Swal.fire({
        title: "Message Sent!",
        text: "We have received your message and will get back to you shortly.",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
        background: "var(--color-base-100)", 
        color: "var(--color-base-content)"
    });
    
    reset();
  };

  return (
    <div className="min-h-screen bg-base-200 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full border border-base-content/10 bg-base-100/50 text-primary text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
                Support & Inquiries
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-base-content mb-4">
                Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Touch</span>
            </h1>
            <p className="text-lg opacity-60 max-w-2xl mx-auto">
                Have a question about a contest? Need help with your account? Our team is ready to assist you.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* --- LEFT COL: CONTACT INFO --- */}
            <div className="space-y-8">
                
                {/* Info Cards */}
                <div className="grid gap-6">
                    <div className="card bg-base-100/80 backdrop-blur-md shadow-lg border border-base-content/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="card-body flex-row items-center gap-6">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <FaEnvelope />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Email Us</h3>
                                <p className="opacity-60 text-sm">support@contesthub.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100/80 backdrop-blur-md shadow-lg border border-base-content/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="card-body flex-row items-center gap-6">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <FaPhoneAlt />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Call Us</h3>
                                <p className="opacity-60 text-sm">+880 17143-76529</p>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100/80 backdrop-blur-md shadow-lg border border-base-content/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="card-body flex-row items-center gap-6">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Visit HQ</h3>
                                <p className="opacity-60 text-sm">Dhaka, Bangladesh</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Socials */}
                <div className="pt-8 border-t border-base-content/10">
                    <h4 className="font-bold mb-4 opacity-80">Follow our updates</h4>
                    <div className="flex gap-4">
                        <button className="btn btn-circle btn-outline hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all"><FaTwitter /></button>
                        <button className="btn btn-circle btn-outline hover:bg-blue-700 hover:border-blue-700 hover:text-white transition-all"><FaLinkedin /></button>
                        <button className="btn btn-circle btn-outline hover:bg-gray-800 hover:border-gray-800 hover:text-white transition-all"><FaGithub /></button>
                    </div>
                </div>
            </div>

            {/* --- RIGHT COL: FORM (Fixed & Styled) --- */}
            <div className="card bg-base-100/90 backdrop-blur-xl shadow-2xl border border-white/20">
                <div className="card-body p-8 lg:p-10">
                    <h2 className="card-title text-3xl mb-2 font-black">Send a Message</h2>
                    <p className="text-sm opacity-60 mb-8">We usually reply within 24 hours.</p>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        
                        {/* Name Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">First Name</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="John" 
                                    className={`input input-bordered w-full bg-base-200/50 focus:bg-base-100 focus:input-primary transition-all ${errors.firstName ? 'input-error' : ''}`}
                                    {...register("firstName", { required: "First name is required" })}
                                />
                                {errors.firstName && <span className="text-error text-xs mt-1">{errors.firstName.message}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Last Name</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Doe" 
                                    className={`input input-bordered w-full bg-base-200/50 focus:bg-base-100 focus:input-primary transition-all ${errors.lastName ? 'input-error' : ''}`}
                                    {...register("lastName", { required: "Last name is required" })}
                                />
                                {errors.lastName && <span className="text-error text-xs mt-1">{errors.lastName.message}</span>}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email Address</span>
                            </label>
                            <input 
                                type="email" 
                                placeholder="john@example.com" 
                                className={`input input-bordered w-full bg-base-200/50 focus:bg-base-100 focus:input-primary transition-all ${errors.email ? 'input-error' : ''}`}
                                {...register("email", { 
                                    required: "Email is required", 
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                })}
                            />
                            {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
                        </div>

                        {/* Message */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Message</span>
                            </label>
                            <textarea 
                                className={`textarea textarea-bordered h-32 w-full bg-base-200/50 focus:bg-base-100 focus:textarea-primary transition-all ${errors.message ? 'textarea-error' : ''}`}
                                placeholder="How can we help you?"
                                {...register("message", { required: "Message cannot be empty" })}
                            ></textarea>
                            {errors.message && <span className="text-error text-xs mt-1">{errors.message.message}</span>}
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary w-full shadow-xl shadow-primary/20 text-lg hover:scale-[1.02] transition-transform">
                                Send Message <FaPaperPlane className="text-sm ml-2" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;