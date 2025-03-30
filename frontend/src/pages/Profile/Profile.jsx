import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        healthTest: null,
        geminiData: null,
        graphData: null
    });
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState("health");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData({
                            healthTest: data.healthTest || null,
                            geminiData: data.geminiData || null,
                            graphData: data.graphData || null,
                            lastUpdated: data.lastUpdated || null
                        });
                        console.log("✅ User data retrieved successfully", data);
                    } else {
                        setError("No assessment data found. Please complete the Internet Addiction Assessment first.");
                        console.log("⚠️ No data found for this user");
                    }
                } catch (err) {
                    console.error("🔥 Error fetching user data:", err);
                    setError("Failed to load profile data. Please try again later.");
                }
            } else {
                console.log("⚠️ No user logged in, showing demo data");
                // Show demo data for users not logged in
                setUserData({
                    healthTest: {
                        status: "Moderate Risk (Demo)",
                        suggestions: "This is sample data. Log in and complete the assessment to see your actual results.",
                        timestamp: new Date().toISOString()
                    },
                    geminiData: {
                        insights: "Sample insights would appear here after completing the assessment when logged in.",
                        timestamp: new Date().toISOString()
                    },
                    graphData: {
                        labels: ["Q1", "Q2", "Q3", "Q4", "Q5"],
                        datasets: [{
                            label: "Sample Data",
                            data: [40, 60, 30, 50, 75],
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                        }]
                    },
                    lastUpdated: new Date().toISOString(),
                    isDemo: true
                });
            }
            
            setLoading(false);
        };

        fetchData();
    }, [user]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-400 py-28">
            <div className="p-6 max-w-3xl w-full bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>
                
                {/* Navigation Tabs */}
                <div className="flex justify-around border-b pb-2 mb-4">
                    <button 
                        className={`px-4 py-2 ${selectedSection === "health" ? "border-b-2 border-blue-500 font-bold" : ""}`}
                        onClick={() => setSelectedSection("health")}
                    >
                        Health Assessment
                    </button>
                    <button 
                        className={`px-4 py-2 ${selectedSection === "gemini" ? "border-b-2 border-blue-500 font-bold" : ""}`}
                        onClick={() => setSelectedSection("gemini")}
                    >
                        AI Insights
                    </button>
                    <button 
                        className={`px-4 py-2 ${selectedSection === "graph" ? "border-b-2 border-blue-500 font-bold" : ""}`}
                        onClick={() => setSelectedSection("graph")}
                    >
                        Response Analysis
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Loading your profile data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <div>
                        {userData.isDemo && (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                                <p className="text-yellow-700">
                                    <span className="font-bold">Demo Mode:</span> You're viewing sample data. Log in and complete an assessment to see your actual results.
                                </p>
                            </div>
                        )}
                        
                        {userData.lastUpdated && !userData.isDemo && (
                            <p className="text-sm text-gray-500 mb-4 text-center">
                                Last updated: {formatDate(userData.lastUpdated)}
                            </p>
                        )}
                        
                        {/* Health Test Results Section */}
                        {selectedSection === "health" && userData.healthTest && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-xl font-semibold text-center mb-4">Health Assessment Results</h3>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="mb-4">
                                        <p className="text-lg font-bold">Status: 
                                            <span className={`ml-2 ${userData.healthTest.status.includes("Low") ? "text-green-500" : 
                                                userData.healthTest.status.includes("Moderate") ? "text-yellow-500" : "text-red-500"}`}>
                                                {userData.healthTest.status}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Recommendations:</h4>
                                        <p className="text-gray-700">{userData.healthTest.suggestions}</p>
                                    </div>
                                    {userData.healthTest.timestamp && !userData.isDemo && (
                                        <p className="text-xs text-gray-500 mt-4">
                                            Assessment date: {formatDate(userData.healthTest.timestamp)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Gemini AI Data Section */}
                        {selectedSection === "gemini" && userData.geminiData && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-xl font-semibold text-center mb-4">AI-Powered Insights</h3>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-white font-bold">AI</span>
                                        </div>
                                        <h4 className="font-semibold">Personalized Analysis</h4>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-line">{userData.geminiData.insights}</p>
                                    {userData.geminiData.timestamp && !userData.isDemo && (
                                        <p className="text-xs text-gray-500 mt-4">
                                            Generated on: {formatDate(userData.geminiData.timestamp)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Graph Data Section */}
                        {selectedSection === "graph" && userData.graphData && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-xl font-semibold text-center mb-4">Response Analysis</h3>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <Bar 
                                        data={userData.graphData} 
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                                title: {
                                                    display: true,
                                                    text: 'Internet Usage Pattern Analysis'
                                                }
                                            }
                                        }}
                                    />
                                    <p className="text-sm text-gray-500 mt-4 text-center">
                                        This graph shows the intensity of internet usage patterns based on your assessment responses.
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {!user && (
                            <div className="mt-8 text-center">
                                <p className="mb-2">Log in to save your assessment results and track progress over time.</p>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Sign In / Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;