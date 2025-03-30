import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAC3qOT6O4gDayv5WvPOFSA2vqtc3FJTJk",
  authDomain: "iitm-c71fd.firebaseapp.com",
  projectId: "iitm-c71fd",
  storageBucket: "iitm-c71fd.appspot.com",
  messagingSenderId: "637622353291",
  appId: "1:637622353291:web:d357882264402337d7c38e",
  measurementId: "G-03NHTF9HEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Function to Sign-In with Google using Redirect (fixes COOP issue)
const signInWithGoogle = () => {
    signInWithRedirect(auth, provider);
};

// Function to Save User to Firestore
const saveUserToDB = async (user) => {
    if (!user) return;
    try {
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName || "Anonymous",
            email: user.email,
            createdAt: new Date(),
        });
        console.log("User saved to Firestore ✅");
    } catch (error) {
        console.error("Error saving user:", error);
    }
};

export { auth, provider, signInWithGoogle, createUserWithEmailAndPassword, saveUserToDB, db };
