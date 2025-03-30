# Internet Addiction Assessment Tool

This project is a web-based application that helps users assess their internet addiction levels using a machine learning model. It provides personalized suggestions based on user responses using **Gemini 2.0 Flash**.

## Features
- 🔒 **Firebase Authentication** (Google & Email/Password sign-in)
- 🧠 **Machine Learning Model** for analyzing user behavior
- 📊 **Personalized Insights & Suggestions** using Gemini 2.0 Flash
- 📁 **User Data Storage** in Firestore for logged-in users
- 📉 **Graphical Representation** of results on user profiles
- ⚡ **Built with Flask (Backend) & React (Frontend)**

## Installation

### Backend (Flask)
```sh
I prefer you using Python 3.11.0
cd server
pip install -r requirements.txt
python backendServer.py
```

### Frontend (React)
```sh
cd frontend
npm install
npm run dev
```

## Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Google & Email/Password).
3. Set up **Firestore Database** to store user data.
4. Add your **Firebase config** to `firebase.js` in the React app.

## Usage
- Sign up or log in using email/password or Google.
- Take the internet addiction assessment.
- View personalized insights and suggestions.
- Track progress through graphical data on your profile.

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Flask, Python
- **Database:** Firebase Firestore
- **ML Model:** Gemini 2.0 Flash

## Data Model
The data model is given inside the server/health_model_20_features.pkl