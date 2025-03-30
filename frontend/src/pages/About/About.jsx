import React from "react";
import { FaBrain, FaHeartbeat, FaLightbulb, FaUsers } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-400 px-6 py-32">
      {/* Hero Section */}
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">About Us</h1>
        <p className="text-lg text-white leading-relaxed">
          Welcome to <span className="font-semibold text-blue-600">Internet Health Checker</span>.  
          Our goal is to help users assess and manage their internet usage habits  
          with AI-powered insights and personalized recommendations.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-5xl">
        {/* Feature 1 */}
        <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col items-center text-center">
          <FaBrain className="text-blue-500 text-6xl mb-4" />
          <h3 className="text-2xl font-semibold">AI-Powered Analysis</h3>
          <p className="text-gray-600 mt-2">
            Our AI model evaluates your internet habits and provides actionable insights.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col items-center text-center">
          <FaHeartbeat className="text-red-500 text-6xl mb-4" />
          <h3 className="text-2xl font-semibold">Health Tracking</h3>
          <p className="text-gray-600 mt-2">
            Track your digital well-being and get recommendations for healthier usage.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col items-center text-center">
          <FaLightbulb className="text-yellow-500 text-6xl mb-4" />
          <h3 className="text-2xl font-semibold">Personalized Tips</h3>
          <p className="text-gray-600 mt-2">
            Get custom advice based on your unique browsing patterns and screen time.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col items-center text-center">
          <FaUsers className="text-green-500 text-6xl mb-4" />
          <h3 className="text-2xl font-semibold">Community Support</h3>
          <p className="text-gray-600 mt-2">
            Join a community of mindful internet users and share experiences.
          </p>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="mt-12">
        <a href="/check-health">
          <button className="bg-blue-600 text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105">
            Take the Free Test 🚀
          </button>
        </a>
      </div>
    </div>
  );
};

export default About;
