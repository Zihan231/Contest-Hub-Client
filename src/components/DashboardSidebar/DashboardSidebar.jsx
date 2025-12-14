import { NavLink, Link, useNavigate } from "react-router";
import {
  FaHome, FaGamepad, FaTrophy, FaUser, FaCog, FaSignOutAlt, FaBolt,
  FaPlusCircle, FaListAlt, FaClipboardCheck, FaUsersCog, FaTasks
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";

const DashboardSidebar = () => {
  const { logout, user } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();


  // Function to close the drawer on mobile when a link is clicked
  const closeDrawer = () => {
    const drawerCheckbox = document.getElementById("dashboard-drawer");
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  };

  const handleLogout = () => {
    closeDrawer(); // Close drawer first if on mobile
    Swal.fire({
      title: "Log out?",
      text: "You will be returned to the home screen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "var(--color-neutral)",
      confirmButtonText: "Yes, log out"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
        Swal.fire("Logged Out!", "See you soon.", "success");
      }
    });
  };

  const navItems = [
    { label: "Overview", path: "/dashboard", icon: <FaHome /> },
    { label: "My Registered Contests", path: "/dashboard/my-contests", icon: <FaGamepad /> },
    { label: "Winning History", path: "/dashboard/wins", icon: <FaTrophy /> },
    { label: "My Profile", path: "/dashboard/profile", icon: <FaUser /> },
    { label: "Add Contest", path: "/dashboard/add-contest", icon: <FaPlusCircle /> },
    { label: "My Created Contests", path: "/dashboard/my-created-contests", icon: <FaListAlt /> },
    { label: "Contest Submitted", path: "/dashboard/contest-submissions", icon: <FaClipboardCheck /> },
    { label: "Manage Users", path: "/dashboard/manage-users", icon: <FaUsersCog /> },
    { label: "Manage Contests", path: "/dashboard/manage-contests", icon: <FaTasks /> },
  ];

  return (
    // Fixed width w-64 ensures it doesn't take 80% of screen unless screen is very small
    <aside className="w-64 min-h-screen bg-base-100 border-r border-base-200 flex flex-col transition-all duration-300">

      {/* 1. BRAND LOGO */}
      <div className="h-20 flex items-center px-8 border-b border-base-200 shrink-0">
        <Link to="/" onClick={closeDrawer} className="flex items-center gap-2 font-black text-2xl tracking-tight">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content">
            <FaBolt className="text-sm" />
          </div>
          <span>Contest<span className="text-primary">Hub</span></span>
        </Link>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav className="grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-bold text-base-content/40 uppercase tracking-widest mb-2 mt-4">Menu</p>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            onClick={closeDrawer} // <--- THIS FIXES THE MOBILE ISSUE
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive
                ? "bg-primary text-primary-content shadow-lg shadow-primary/30 font-bold"
                : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`text-lg ${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 3. USER PROFILE & LOGOUT */}
      <div className="p-4 border-t border-base-200 bg-base-100/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="avatar online">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user ? user?.photoURL : "https://i.pravatar.cc/150?img=11"} alt="User" />
            </div>
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm truncate">{user ? user?.displayName : "No Name Found"}</h4>
            <p className="text-xs opacity-50 truncate">User Role</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline btn-error btn-sm w-full gap-2 hover:shadow-red-500/20"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

    </aside>
  );
};

export default DashboardSidebar;