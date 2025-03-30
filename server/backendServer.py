from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import traceback
import logging
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # More permissive CORS policy

# Load the model, imputer, and scaler
model_path = "health_model_20_features.pkl"
EXPECTED_FEATURE_COUNT = 20

def load_model(path):
    if not os.path.exists(path):
        logger.error(f"Model file {path} not found.")
        return None, None, None, None
    try:
        logger.info("Loading model...")
        model_data = joblib.load(path)
        if isinstance(model_data, tuple) and len(model_data) == 4:
            model, imputer, scaler, valid_columns = model_data
            logger.info("Model loaded successfully.")
            return model, imputer, scaler, valid_columns
        else:
            logger.error("Unexpected model file format.")
            return None, None, None, None
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        logger.error(traceback.format_exc())
        return None, None, None, None

model, imputer, scaler, valid_columns = load_model(model_path)

# Score explanations
def get_score_explanation(score):
    explanations = {
        0: "Excellent digital well-being. No signs of internet overuse.",
        1: "Minor internet dependency. Mostly healthy usage.",
        2: "Slight concerns over internet use. Some areas need improvement.",
        3: "Moderate internet dependency. Certain areas of life could be impacted.",
        4: "High internet dependency. Likely affecting daily activities.",
        5: "Severe internet dependency. Strongly affecting daily life and well-being."
    }
    return explanations.get(score, "Unknown dependency level.")

def get_health_status_text(score):
    status_map = {
        0: "Low Risk",
        1: "Low Risk",
        2: "Low to Moderate Risk",
        3: "Moderate Risk",
        4: "High Risk",
        5: "Severe Risk"
    }
    return status_map.get(score, "Unknown Risk Level")

def get_health_suggestions(health_score, user_responses):
    genai.configure(api_key=GOOGLE_API_KEY)
    score_explanation = get_score_explanation(health_score)
    health_status = get_health_status_text(health_score)
    
    prompt = f"""
    User answered the following questions about their internet usage:
    {user_responses}
    
    Their predicted internet dependency level is: {health_score} ({score_explanation}).
    Provide specific feedback tailored to these responses. 
    Suggest ways to manage and improve their digital habits.
    """
    try:
        ai_model = genai.GenerativeModel("gemini-2.0-flash")
        response = ai_model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Error generating suggestions: {str(e)}")
        return f"Based on the assessment, we recommend monitoring internet usage patterns and setting healthy boundaries."

@app.route("/check_health", methods=["POST"])
def check_health():
    if model is None:
        return jsonify({"error": "Model not loaded properly"}), 500
    try:
        data = request.get_json()
        features = data.get("features", [])
        
        if len(features) != EXPECTED_FEATURE_COUNT:
            return jsonify({"error": f"Expected {EXPECTED_FEATURE_COUNT} features, got {len(features)}"}), 400
        
        features_array = np.array(features, dtype=float).reshape(1, -1)
        if imputer: features_array = imputer.transform(features_array)
        if scaler: features_array = scaler.transform(features_array)
        
        prediction = int(model.predict(features_array)[0])
        score_explanation = get_score_explanation(prediction)
        health_status = get_health_status_text(prediction)
        health_suggestions = "To improve digital wellbeing, establish screen-free times, use apps to monitor usage, take regular breaks, and engage in offline activities."
        
        return jsonify({
            "health_score": prediction,
            "health_status": health_status,
            "score_explanation": score_explanation,
            "suggestions": health_suggestions
        })
    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route("/get_gemini_insights", methods=["POST"])
def get_gemini_insights():
    try:
        data = request.get_json()
        answers = data.get("answers", {})
        health_status = data.get("healthStatus", "Moderate Risk")
        
        # Convert answers to a readable format for Gemini
        formatted_answers = "\n".join([f"Q{key.replace('PCIAT_', '')}: {value}" for key, value in answers.items()])
        
        insights = get_health_suggestions(3, formatted_answers)  # Default to moderate risk (3) if no score provided
        
        return jsonify({
            "insights": insights
        })
    except Exception as e:
        logger.error(f"Error in Gemini insights: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "insights": "Based on the assessment, we recommend monitoring internet usage patterns and establishing healthy online habits. Consider setting screen-free times and encouraging offline activities."
        })

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"status": "API is working"})

if __name__ == "__main__":
    app.run(debug=True)