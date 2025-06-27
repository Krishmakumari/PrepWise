import { initializeApp ,getApp,getApps} from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};



const app =!getApps.length ? initializeApp(firebaseConfig):getApp();

export const auth=getAuth(app);
export const db=getFirestore(app);
