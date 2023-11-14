// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApp} from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import { database } from './firebase';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoQJwviGMAmo_RMilL90KUnKSjIG7Y4Qc",
  authDomain: "chatapp-e2874.firebaseapp.com",
  projectId: "chatapp-e2874",
  storageBucket: "chatapp-e2874.appspot.com",
  messagingSenderId: "1016916221534",
  appId: "1:1016916221534:web:13ef0fb820ad60aad7decf",
  measurementId: "G-HT527QRNDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
export const auth =initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// export const auth = getAuth();
export const database = getFirestore(app);

