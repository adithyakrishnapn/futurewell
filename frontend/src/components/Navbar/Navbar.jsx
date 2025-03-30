import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Get user from context

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/"); // Redirect to homepage after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const getActiveClass = (path) =>
        location.pathname === path ? "text-black font-bold border-b-2 border-black" : "text-white";

    return (
        <nav className={`w-full py-5 px-6 md:px-16 fixed top-0 left-0 flex items-center transition-all duration-300 z-50 ${
            isScrolled ? "bg-black/60 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}>
            {/* Logo */}
            <div className="flex items-center">
                <h2 className="text-white text-xl font-bold bg-black bg-opacity-20 rounded-xl py-2 px-4">FutureWell</h2>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center ml-auto space-x-6">
                <li className={`hover:text-black cursor-pointer ${getActiveClass("/")}`}><Link to="/">Home</Link></li>
                <li className={`hover:text-black cursor-pointer ${getActiveClass("/about")}`}><Link to="/about">About</Link></li>
                <li className={`bg-gray-500 rounded-3xl px-4 py-2 hover:bg-gray-800 cursor-pointer ${getActiveClass("/check-health")}`}>
                    <Link to="/check-health">Check Health</Link>
                </li>

                {/* Show Login & Signup only if NOT logged in */}
                {!user ? (
                    <>
                        <li className={`hover:text-black cursor-pointer ${getActiveClass("/login")}`}><Link to="/login">Login</Link></li>
                        <li className={`hover:text-black cursor-pointer ${getActiveClass("/signup")}`}><Link to="/signup">Signup</Link></li>
                    </>
                ) : (
                    <>
                        <li className={`hover:text-black cursor-pointer ${getActiveClass("/profile")}`}><Link to="/profile">Profile</Link></li>
                        <li className="cursor-pointer text-red-500 hover:text-red-700" onClick={handleLogout}>Logout</li>
                    </>
                )}
            </ul>

            {/* Mobile Menu Button */}
            <button className="md:hidden ml-auto text-white text-3xl" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>

            {/* Mobile Sidebar Menu */}
            <div className={`fixed top-0 right-0 h-screen w-2/3 bg-black/90 text-white backdrop-blur-lg shadow-lg transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out flex flex-col p-6`}>
                {/* Close Button */}
                <button className="text-3xl self-end" onClick={() => setIsOpen(false)}>✕</button>

                {/* Menu Items */}
                <ul className="mt-10 w-full space-y-4">
                    <li className={`hover:text-black cursor-pointer ${getActiveClass("/")}`}><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                    <li className={`hover:text-black cursor-pointer ${getActiveClass("/about")}`}><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
                    <li className={`hover:text-black cursor-pointer ${getActiveClass("/check-health")}`}>
                        <Link to="/check-health" onClick={() => setIsOpen(false)}>Check Health</Link>
                    </li>

                    {/* Show Login & Signup only if NOT logged in */}
                    {!user ? (
                        <>
                            <li className={`hover:text-black cursor-pointer ${getActiveClass("/login")}`}><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
                            <li className={`hover:text-black cursor-pointer ${getActiveClass("/signup")}`}><Link to="/signup" onClick={() => setIsOpen(false)}>Signup</Link></li>
                        </>
                    ) : (
                        <>
                            <li className={`hover:text-black cursor-pointer ${getActiveClass("/profile")}`}><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
                            <li className="cursor-pointer text-red-500 hover:text-red-700" onClick={handleLogout}>Logout</li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
