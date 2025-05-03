import { initializeApp, getApps, getApp } from '@react-native-firebase/app';
import { getAuth, initializeAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getReactNativePersistence } from 'firebase/auth/react-native';
import {
   FIREBASE_API_KEY,
   FIREBASE_AUTH_DOMAIN,
   FIREBASE_PROJECT_ID,
   FIREBASE_STORAGE_BUCKET,
   FIREBASE_MESSAGING_SENDER_ID,
   FIREBASE_APP_ID,
 } from '@env';
 
 const firebaseConfig = {
   apiKey: FIREBASE_API_KEY,
   authDomain: FIREBASE_AUTH_DOMAIN,
   projectId: FIREBASE_PROJECT_ID,
   storageBucket: FIREBASE_STORAGE_BUCKET,
   messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
   appId: FIREBASE_APP_ID,
 };

 const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

 let auth;
 try {
  auth!().setPersistence(auth!.Auth.Persistence.LOCAL);
   auth = getAuth(app);
 } catch (error) {
  console.log(error)
  //  auth = initializeAuth(app, {
  //    persistence: getReactNativePersistence(AsyncStorage),
  //  });
 }
 
 export { auth };