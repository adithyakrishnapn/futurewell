import React from 'react';

const WhatWeDo = () => {
    return (
        <div className="w-full py-32 bg-gray-100">
            <div className="max-w-6xl mx-auto text-center p-20">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">What We Do ?</h2>
                <p className="text-lg text-gray-600">
                    At FutureWell, we leverage advanced machine learning models to identify and analyze patterns of Problematic Internet Use (PIU) in children.
                    By combining psychological insights with AI-driven analysis, we help parents, educators, and mental health professionals understand, prevent, and address
                    the negative impacts of excessive screen time.
                </p>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-12">
                <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">AI-Powered Detection</h3>
                    <p className="text-gray-600">Our machine learning model analyzes behavioral data to detect early signs of problematic internet use in children.</p>
                </div>
                <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Personalized Insights</h3>
                    <p className="text-gray-600">We provide personalized reports to help parents and educators take proactive steps in managing screen time and digital habits.</p>
                </div>
                <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Preventive Strategies</h3>
                    <p className="text-gray-600">Through expert recommendations, we offer guidance on fostering healthy digital habits and improving mental well-being.</p>
                </div>
            </div>
        </div>


    );
}

export default WhatWeDo;
