import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <footer className="bg-black text-white py-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                    {/* Logo & Intro */}
                    <div className='justify-center flex-col'>
                        <h2 className="text-2xl font-bold text-blue-400">FutureWell</h2>
                        <p className="text-gray-400 mt-2">
                            Empowering young minds by identifying and addressing problematic internet use.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className='justify-center items-center flex flex-col'>
                        <h3 className="text-xl font-semibold text-blue-300">Quick Links</h3>
                        <ul className="mt-2">
                            <Link to='/'><li><a href="#" className="text-gray-400 hover:text-blue-400">Home</a></li></Link>
                            <Link to='/about'><li><a href="#" className="text-gray-400 hover:text-blue-400">About</a></li></Link>
                            <Link to='/check-health'><li><a href="#" className="text-gray-400 hover:text-blue-400">Resources</a></li></Link>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className='items-center flex flex-col'>
                        <h3 className="text-xl font-semibold text-blue-300">Follow Us</h3>
                        <div className="flex justify-center md:justify-start space-x-4 mt-3">
                            <a href="#" className="text-gray-400 hover:text-blue-400">
                                <i className="fab fa-facebook text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400">
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400">
                                <i className="fab fa-instagram text-xl"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-500 mt-8 text-sm">
                    &copy; {new Date().getFullYear()} FutureWell. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
