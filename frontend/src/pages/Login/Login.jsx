import React, { useState, useContext, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { AuthContext } from "../../context/AuthContext/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful! 🎉");
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            alert("Google Sign-In successful! 🎉");
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col md:grid md:grid-cols-5 w-full min-h-screen">
            {/* Left Side (Form) */}
            <div className="md:col-span-3 flex justify-center items-center py-16 md:p-20 w-full">
                <form className="w-full max-w-sm md:max-w-md" onSubmit={handleLogin}>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">Welcome Back</h2>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email" 
                        className="w-full border rounded-md p-3 mb-4"
                        required
                    />

                    <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password" 
                        className="w-full border rounded-md p-3 mb-4"
                        required
                    />

                    <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800 transition">
                        Login
                    </button>

                    <div className="my-6 text-center text-gray-500">Or</div>

                    <div className="flex justify-center">
                        <button 
                            onClick={handleGoogleSignIn}
                            type="button"
                            className="flex items-center border px-4 py-2 rounded-md shadow-md w-full md:w-auto hover:bg-gray-100 transition"
                        >
                            <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
                            Sign in with Google
                        </button>
                    </div>

                    <div className="text-center mt-4 text-sm">
                        Don't have an account? <Link to="/signup" className="text-blue-500 font-semibold">Create one</Link>
                    </div>
                </form>
            </div>

            {/* Right Side (Image) - Hidden on Small Screens */}
            <div 
                className="hidden md:block md:col-span-2 bg-[url('/Images/login.png')] bg-no-repeat bg-cover bg-right h-full rounded-s-3xl">
            </div>
        </div>
    );
};

export default Login;
