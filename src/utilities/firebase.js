// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getDatabase,  onValue, ref, update, get,} from "firebase/database"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useCallback, useState, useEffect } from "react";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCDFN8LNDMB7JPxDaWrV5Ab6VOMMad0ZeU",
    authDomain: "h-525b1.firebaseapp.com",
    databaseURL: "https://h-525b1-default-rtdb.firebaseio.com",
    projectId: "h-525b1",
    storageBucket: "h-525b1.firebasestorage.app",
    messagingSenderId: "991953611317",
    appId: "1:991953611317:web:a86ea7b4a859340a9e9f7c",
    measurementId: "G-4FYT59QD5R"
};
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

const database = getDatabase(firebase);
const auth = getAuth(firebase);
const storage = getStorage(firebase);

export { firebase, database, auth };

export const signInWithGoogle = async() => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    return result;
};

export const signOut = () => firebaseSignOut(auth);

///admin sign in function
export const AdminSignIn = async (email, password) => {
    try {
        // Authenticate the user using email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if the user is an admin in the Realtime Database
        const adminRef = ref(database, `admin/${user.uid}`);
        const adminSnapshot = await get(adminRef);

        if (!adminSnapshot.exists()) {
            console.error('User is not an admin');
            throw new Error('User is not an admin');
        }

        console.log('Admin signed in successfully:', user);
        return { user, isAdmin: true };

    } catch (error) {
        console.error('Error during admin sign-in:', error.message);
        throw error;
    }
};

export const useAuthState = () => {
    const [user, setUser] = useState();
    useEffect(() => (
        onAuthStateChanged(auth, setUser)
    ), []);

    return [user];
};

export const useDbData = (path) => {
    const [data, setData] = useState();
    const [error, setError] = useState(null);

    useEffect(() => (
        onValue(ref(database, path), (snapshot) => {
            setData(snapshot.val());
        }, (error) => {
            setError(error);
        })
    ), [path]);

    return [data, error];
};

const makeResult = (error) => {
    const timestamp = Date.now();
    const message = error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
    return { timestamp, error, message };
};

export const useDbUpdate = (path) => {
    const [result, setResult] = useState();
    const updateData = useCallback(async (value) => {
        console.log('Updating path:', path);
        console.log('Value before update:', value);

        if (!value || typeof value !== 'object') {
            console.error("Invalid value passed to updateData:", value);
            return;
        }

        const dbRef = ref(database, path);
        update(dbRef, value)
            .then(() => setResult(makeResult()))
            .catch((error) => {
                console.error("Error during Firebase update:", error);
                setResult(makeResult(error));
            });
    }, [path]);

    return [updateData, result];
};

// Upload image to Firebase Storage and return the image URL
export const uploadImage = async (imageFile) => {
    try {
      const imageRef = storageRef(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Update the submission data in the Firebase Realtime Database
export const submitDataToDatabase = async (data) => {
    try {
      const dbRef = ref(database, 'submissions'); // Reference to your Firebase path
      const newSubmissionRef = ref(database, 'submissions/' + Date.now()); // Use timestamp as unique ID
      await update(newSubmissionRef, data);
      console.log("Data submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting data:", error);
      throw error;
    }
  };