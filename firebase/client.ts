import { initializeApp ,getApp,getApps} from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyALfHm0ylf6V-4g0XDCNeiFAu2jLEYyYPY",
  authDomain: "prepwise-f0501.firebaseapp.com",
  projectId: "prepwise-f0501",
  storageBucket: "prepwise-f0501.firebasestorage.app",
  messagingSenderId: "665787680717",
  appId: "1:665787680717:web:765441f05ce4cc8dae2684",
  measurementId: "G-373ECNHVR1"
};



const app =!getApps.length ? initializeApp(firebaseConfig):getApp();

export const auth=getAuth(app);
export const db=getFirestore(app);