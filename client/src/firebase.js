
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyButWgUZGKWrlUFANswyplpbyS6YQeWVS4",
  authDomain: "video-5322e.firebaseapp.com",
  projectId: "video-5322e",
  storageBucket: "video-5322e.appspot.com",
  messagingSenderId: "142403772152",
  appId: "1:142403772152:web:c874f8806cf9e70f79650d"
};

// initialize firebase
const app=initializeApp(firebaseConfig);
export const auth=getAuth()

export  const provider = new GoogleAuthProvider();

export default app;


