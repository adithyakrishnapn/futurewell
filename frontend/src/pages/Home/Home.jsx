import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import WhatWeDo from '../../components/WhatWeDo/WhatWeDo';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <div className="relative w-full h-[50vh] flex justify-center items-center bg-[url('/Images/lander.png')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                <div className="relative flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl font-bold text-white">
                        Welcome to FutureWell
                    </h1>
                    <p className='text-lg py-4 text-white'>FutureWell: Empowering young minds with care, support, and a brighter tomorrow!</p>
                </div>
            </div>

            <div className='w-full bg-white py-28'>
                <div className='max-w-6xl mx-auto text-center'>
                    <h2 className='text-4xl font-bold text-gray-800 mb-6'>Why FutureWell ?</h2>
                    <p className='text-lg text-gray-600 mb-10'>
                        At FutureWell, we leverage advanced machine learning models to identify and analyze patterns of Problematic Internet Use (PIU) in children.
                        By combining psychological insights with AI-driven analysis, we help parents, educators, and mental health professionals understand, prevent, and address the negative impacts of excessive screen time.
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 w-full px-28 py-16">
                {/* Left Section - Title */}
                <div className="from-gray-500 flex flex-col justify-center items-center p-16 text-black">
                    <h1 className="text-4xl md:text-5xl font-bold text-center leading-tight">
                        Take a Free Test 🚀
                    </h1>
                    <p className="text-lg md:text-xl mt-4 text-center opacity-90">
                        Check your internet usage health in just a few minutes!
                    </p>
                </div>

                {/* Right Section - Button */}
                <div className="bg-white flex justify-center items-center p-16 rounded-r-3xl shadow-lg">
                    <Link to="/check-health">
                        <button className="bg-red-500 text-white text-xl font-semibold py-4 px-12 rounded-full shadow-md hover:bg-red-600 transition-transform transform hover:scale-105 duration-300">
                            Click Here 🚀
                        </button>
                    </Link>
                </div>
            </div>


            <WhatWeDo />
        </>

    );
}

export default Home;
