// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5ONbSDIiG-3jsFaioRuXQH5WVkcWrYPc",
  authDomain: "chumbucket-app.firebaseapp.com",
  projectId: "chumbucket-app",
  storageBucket: "chumbucket-app.firebasestorage.app",
  messagingSenderId: "1047626472061",
  appId: "1:1047626472061:web:515ded15cc028ffd7d6f14",
  measurementId: "G-V9DQXD06K8",
};

const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
let auth: Auth;

if (Platform.OS === "web") {
  // веб
  auth = getAuth(app);
} else {
  // мобилка
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
