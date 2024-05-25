// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAmEbIBGFvTPjEv67tQ_jVtIOtF4sJHRpY',
    authDomain: 'auth-zalo.firebaseapp.com',
    projectId: 'auth-zalo',
    storageBucket: 'auth-zalo.appspot.com',
    messagingSenderId: '478619326138',
    appId: '1:478619326138:web:7f4ea6df62e1a787ccd483',
    measurementId: 'G-LQKFKLPHD6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
