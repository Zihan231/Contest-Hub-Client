import { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router"; 
import { FaBars, FaSun, FaMoon, FaTrophy } from "react-icons/fa"; 
import Swal from "sweetalert2"; 
import AuthContext from "../../context/AuthContext/AuthContext";

const NavBar = () => {
    const navigate = useNavigate();
    const { user,logout } = useContext(AuthContext);
    // ---------------------------------------------------------------------------
    // 1. Theme Management 
    // ---------------------------------------------------------------------------
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "contesthubLight"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) =>
            prev === "contesthubLight" ? "contesthubDark" : "contesthubLight"
        );
    };

    // // ---------------------------------------------------------------------------
    // // 2. Authentication Mock
    // // ---------------------------------------------------------------------------
    // // ⚠️ TOGGLE THIS TO 'null' TO SEE THE LOGIN/REGISTER BUTTONS
    // // const user = {
    // //     displayName: "Zihan Islam",
    // //     photoURL: "https://i.pravatar.cc/150?img=12",
    // // };
    // const user = null; // <--- Uncomment this line to test the "Logged Out" view

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of ContestHub.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-error)",
            cancelButtonColor: "var(--color-neutral)",
            confirmButtonText: "Yes, logout!"
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate("/");
                Swal.fire("Logged Out!", "See you soon.", "success");
            }
        });
    };

    
    // ---------------------------------------------------------------------------
    // 3. Navigation Links 
    // ---------------------------------------------------------------------------
    const navLinks = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-primary active" : "font-medium hover:text-primary"
                    }
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/all-contests"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-primary active" : "font-medium hover:text-primary"
                    }
                >
                    All Contests
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/leaderboard"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-primary active" : "font-medium hover:text-primary"
                    }
                >
                    Leaderboard
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-primary active" : "font-medium hover:text-primary"
                    }
                >
                    Contact Us
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-primary active" : "font-medium hover:text-primary"
                    }
                >
                    About Us
                </NavLink>
            </li>
        </>
    );

    return (
        <div className="navbar bg-base-100/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-base-200">

            {/* --- NAVBAR START --- */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <FaBars className="text-xl" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
                    >
                        {navLinks}
                    </ul>
                </div>

                <Link to="/" className="btn btn-ghost text-xl gap-2 px-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content">
                        <FaTrophy />
                    </div>
                    <span className="font-bold tracking-tight hidden sm:inline">
                        Contest<span className="text-primary">Hub</span>
                    </span>
                </Link>
            </div>

            {/* --- NAVBAR CENTER --- */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {navLinks}
                </ul>
            </div>

            {/* --- NAVBAR END (Updated) --- */}
            <div className="navbar-end gap-3">

                {/* Theme Toggle */}
                <label className="swap swap-rotate btn btn-ghost btn-circle btn-sm text-base-content/80">
                    <input
                        type="checkbox"
                        onChange={toggleTheme}
                        checked={theme === "contesthubDark"}
                    />
                    <FaSun className="swap-off h-5 w-5 fill-current" />
                    <FaMoon className="swap-on h-5 w-5 fill-current" />
                </label>

                {/* Auth Logic: If user exists, show Profile. [cite_start]If NOT, show Login/Register [cite: 153, 155, 156] */}
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                            title={user.displayName}
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Profile"
                                    src={user.photoURL || "https://i.pravatar.cc/150"}
                                />
                            </div>
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
                        >
                            <li className="menu-title px-4 py-2">
                                <span className="block truncate text-base-content font-bold">
                                    {user.displayName}
                                </span>
                            </li>
                            <li>
                                <Link to="/dashboard" className="justify-between">
                                    Dashboard
                                    <span className="badge badge-primary badge-sm">New</span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="text-error hover:bg-error/10"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                    
                ) : (
                    // --- UPDATED SECTION: Login & Register Buttons ---
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-ghost btn-sm">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary btn-sm px-5">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavBar;