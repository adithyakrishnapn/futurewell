import React, { useState, useContext } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const questions = [
    { question: "How often does your child find themselves unable to control their internet usage?", type: "radio", key: "PCIAT_01", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child spend more time online than originally intended?", type: "radio", key: "PCIAT_02", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Do others complain about the amount of time your child spends online?", type: "radio", key: "PCIAT_03", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child neglect their personal responsibilities due to internet use?", type: "radio", key: "PCIAT_04", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "How often does your child feel anxious or restless when unable to use the internet?", type: "radio", key: "PCIAT_05", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child try to reduce their internet usage but fail?", type: "radio", key: "PCIAT_06", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child feel depressed or moody when offline?", type: "radio", key: "PCIAT_07", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child feel guilty about the amount of time they spend online?", type: "radio", key: "PCIAT_09", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Has your child's internet usage negatively impacted their sleep quality?", type: "radio", key: "PCIAT_10", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child avoid social activities because of internet use?", type: "radio", key: "PCIAT_11", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child use the internet to escape from negative feelings or problems?", type: "radio", key: "PCIAT_13", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child experience stress or anxiety when thinking about reducing internet use?", type: "radio", key: "PCIAT_14", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child frequently think about when they'll go online next?", type: "radio", key: "PCIAT_15", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child find themselves lying to others about their internet use?", type: "radio", key: "PCIAT_16", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child lose track of time while browsing the internet?", type: "radio", key: "PCIAT_17", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child prioritize internet activities over other important tasks?", type: "radio", key: "PCIAT_18", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child feel withdrawal symptoms when unable to access the internet?", type: "radio", key: "PCIAT_19", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Does your child experience physical discomfort (e.g., eye strain, headaches) from excessive internet use?", type: "radio", key: "PCIAT_20", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { question: "Overall, how would you rate your child's internet dependency?", type: "radio", key: "PCIAT_Total", options: ["Low", "Moderate", "High"] },
    { question: "How many hours per day does your child spend on the internet?", type: "number", key: "PCIAT_22" }
];

// Updated category mapping with more appropriate values for the model
const categoryMapping = {
    "Never": 0,
    "Rarely": 1,
    "Sometimes": 2,
    "Often": 3,
    "Always": 4,
    "Low": 0,
    "Moderate": 2,
    "High": 4
};

// Display mapping for chart visualization
const displayMapping = {
    "Never": 0,
    "Rarely": 25,
    "Sometimes": 50,
    "Often": 75,
    "Always": 100,
    "Low": 0,
    "Moderate": 50,
    "High": 100
};

// Calculate risk level locally as a backup
const calculateLocalRiskLevel = (formattedAnswers) => {
    // Extract numeric values and calculate average
    const values = Object.values(formattedAnswers).filter(val => !isNaN(val));
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;

    // Map average to risk level
    if (average <= 1) return "Low Risk";
    if (average <= 2) return "Low to Moderate Risk";
    if (average <= 3) return "Moderate Risk";
    if (average <= 3.5) return "High Risk";
    return "Severe Risk";
};

const CheckHealth = () => {
    const { user } = useContext(AuthContext);
    const [section, setSection] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null); // Added for debugging

    const handleAnswerChange = (key, value) => {
        setAnswers({ ...answers, [key]: value });
    };

    const handleNext = () => {
        setSection((prev) => Math.min(prev + 1, questions.length - 1));
    };

    const handleBack = () => {
        setSection((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        setLoading(true);
        setError(null);

        // Transform answers for model input (using more appropriate values for machine learning)
        let formattedAnswers = {};
        for (let key in answers) {
            if (answers[key] !== undefined) {
                if (isNaN(answers[key])) {
                    // For radio button answers, use the categoryMapping
                    formattedAnswers[key] = categoryMapping[answers[key]] !== undefined ?
                        categoryMapping[answers[key]] : 0;
                } else {
                    // For numeric answers like hours, normalize between 0-4 scale
                    // If more than 8 hours, consider it high risk (4)
                    const hours = parseFloat(answers[key]);
                    formattedAnswers[key] = hours <= 2 ? 0 :
                        hours <= 4 ? 1 :
                            hours <= 6 ? 2 :
                                hours <= 8 ? 3 : 4;
                }
            } else {
                formattedAnswers[key] = 0;
            }
        }

        // Create display formatted answers for the chart (using percentages for better visualization)
        let displayFormattedAnswers = {};
        for (let key in answers) {
            if (answers[key] !== undefined) {
                if (isNaN(answers[key])) {
                    // For categorical answers
                    displayFormattedAnswers[key] = displayMapping[answers[key]] || 0;
                } else {
                    // For hours, convert to percentage (assume max is 12 hours)
                    const hours = parseFloat(answers[key]);
                    displayFormattedAnswers[key] = Math.min(100, (hours / 12) * 100);
                }
            } else {
                displayFormattedAnswers[key] = 0;
            }
        }

        // Save debug info for troubleshooting
        const debugData = {
            rawAnswers: answers,
            formattedForModel: formattedAnswers,
            formattedForDisplay: displayFormattedAnswers,
            localRiskCalculation: calculateLocalRiskLevel(formattedAnswers)
        };
        setDebugInfo(debugData);

        try {
            // 1. Get health assessment from backend
            const response = await axios.post("http://127.0.0.1:5000/check_health", {
                features: Object.values(formattedAnswers)
            });

            const healthResult = response.data;
            console.log("Health result:", healthResult);

            // If backend returns "Low Risk" but our local calculation says otherwise,
            // use the local calculation as a fallback
            const finalHealthStatus = healthResult.health_status === "Low Risk" &&
                debugData.localRiskCalculation !== "Low Risk" ?
                debugData.localRiskCalculation :
                healthResult.health_status;

            // 2. Get Gemini insights
            let geminiResponse;
            try {
                geminiResponse = await axios.post("http://127.0.0.1:5000/get_gemini_insights", {
                    answers: formattedAnswers,
                    healthStatus: finalHealthStatus
                });
            } catch (err) {
                console.log("Gemini API error:", err);
                // Fallback if endpoint fails
                geminiResponse = {
                    data: {
                        insights: `Based on the assessment, your child shows ${finalHealthStatus.toLowerCase()} signs of internet dependency. We recommend establishing healthy online boundaries and screen-free times.`
                    }
                };
            }

            // 3. Prepare chart data with display values (percentages)
            const validLabels = Object.keys(displayFormattedAnswers)
                .filter(key => displayFormattedAnswers[key] !== undefined)
                .map(key => key.replace('PCIAT_', 'Q'));

            const validData = Object.entries(displayFormattedAnswers)
                .filter(([_, val]) => val !== undefined)
                .map(([_, val]) => val);

            const userData = {
                healthTest: {
                    status: finalHealthStatus,
                    suggestions: healthResult.suggestions || "We recommend establishing healthy online boundaries.",
                    timestamp: new Date().toISOString()
                },
                geminiData: {
                    insights: geminiResponse.data.insights || "Based on the assessment, we recommend monitoring internet usage patterns.",
                    timestamp: new Date().toISOString()
                },
                graphData: {
                    labels: validLabels,
                    datasets: [{
                        label: "Internet Usage Intensity (%)",
                        data: validData,
                        backgroundColor: "rgba(54, 162, 235, 0.6)"
                    }]
                },
                rawAnswers: Object.fromEntries(
                    Object.entries(answers).filter(([_, val]) => val !== undefined)
                ),
                debugInfo: debugData, // Include debug info for troubleshooting
                lastUpdated: new Date().toISOString()
            };

            setResult(userData);

            // 4. Save to Firebase if user is logged in
            if (user) {
                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, userData, { merge: true });
                console.log("✅ Data saved successfully to Firebase for user:", user.uid);
            } else {
                console.log("⚠️ User not logged in, data not saved to Firebase");
            }
        } catch (error) {
            console.error("🔥 Error processing data:", error);
            setError("An error occurred while checking health. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Prepare chart data for display with percentage values for better visualization
    const chartData = {
        labels: Object.keys(answers)
            .filter(key => answers[key] !== undefined)
            .map(key => key.replace('PCIAT_', 'Q')),
        datasets: [{
            label: "Internet Usage Intensity (%)",
            data: Object.entries(answers)
                .filter(([_, val]) => val !== undefined)
                .map(([_, val]) => {
                    if (isNaN(val)) {
                        return displayMapping[val] || 0;
                    } else {
                        // Convert hours to percentage (assuming max 12 hours)
                        return Math.min(100, (parseFloat(val) / 12) * 100);
                    }
                }),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
        }]
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-400 py-16">
            <div className="p-6 max-w-xl bg-white rounded-lg shadow-lg w-full text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Internet Addiction Assessment</h2>

                {!result ? (
                    <>
                        <p className="mb-2 font-semibold">Question {section + 1} of {questions.length}</p>
                        <p className="mb-2 font-semibold">{questions[section].question}</p>

                        {questions[section].type === "radio" ? (
                            <div className="flex flex-col gap-2">
                                {questions[section].options.map((option, idx) => (
                                    <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={questions[section].key}
                                            value={option}
                                            onChange={() => handleAnswerChange(questions[section].key, option)}
                                            checked={answers[questions[section].key] === option}
                                            className="accent-blue-500"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <input
                                type="number"
                                className="border p-2 w-full rounded"
                                value={answers[questions[section].key] || ""}
                                onChange={(e) => handleAnswerChange(questions[section].key, e.target.value)}
                                min="0"
                            />
                        )}

                        <div className="mt-4 flex justify-between">
                            <button
                                className={`px-4 py-2 rounded ${section === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 text-white"}`}
                                onClick={handleBack}
                                disabled={section === 0}
                            >
                                Back
                            </button>
                            {section < questions.length - 1 ? (
                                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleNext}>
                                    Next
                                </button>
                            ) : (
                                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit} disabled={loading}>
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="mt-4 p-4 bg-gray-100 border rounded w-full">
                        <h3 className="text-xl font-semibold mb-2">Assessment Result</h3>
                        <div className="p-3 bg-white rounded shadow-sm mb-4">
                            <h4 className="font-bold">Status:
                                <span className={`ml-2 ${result.healthTest.status.includes("Low") ? "text-green-500" :
                                        result.healthTest.status.includes("Moderate") ? "text-yellow-500" :
                                            "text-red-500"
                                    }`}>
                                    {result.healthTest.status}
                                </span>
                            </h4>
                            <p className="mt-2 text-left">{result.healthTest.suggestions}</p>
                        </div>

                        <div className="p-3 bg-white rounded shadow-sm mb-4">
                            <h4 className="font-bold mb-2">Gemini AI Insights</h4>
                            <div className="text-left whitespace-pre-line">
                                {result.geminiData.insights.replace(/\*\*/g, "").replace(/\*/g, "\n• ")}
                            </div>
                        </div>

                        <h4 className="font-bold mb-2">Response Summary</h4>
                        <Bar data={chartData} className="mt-4" />

                        {/* Debug information section - can be removed in production */}
                        {debugInfo && (
                            <div className="p-3 bg-white rounded shadow-sm mb-4 mt-4 text-left">
                                <h4 className="font-bold mb-2">Diagnostic Information</h4>
                                <p>Local Risk Assessment: <strong>{debugInfo.localRiskCalculation}</strong></p>
                                <p>Backend Response Status: <strong>{result.healthTest.status}</strong></p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Note: If answers indicate higher risk but system shows "Low Risk",
                                    a local risk calculation is being used as a fallback.
                                </p>
                            </div>
                        )}

                        {user ? (
                            <p className="text-green-600 mt-4">✅ Data saved to your profile</p>
                        ) : (
                            <p className="text-orange-500 mt-4">⚠️ Log in to save your results</p>
                        )}

                        <button
                            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => setResult(null)}
                        >
                            Start New Assessment
                        </button>
                    </div>
                )}

                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default CheckHealth;