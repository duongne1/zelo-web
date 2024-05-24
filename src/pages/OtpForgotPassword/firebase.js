// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyC1ay9uzkUucQuG30SSJ7G8vKD95NshBJE',
    authDomain: 'demo1-dc3bd.firebaseapp.com',
    projectId: 'demo1-dc3bd',
    storageBucket: 'demo1-dc3bd.appspot.com',
    messagingSenderId: '612673001732',
    appId: '1:612673001732:web:3bf93f62dd85c66c9f9851',
    measurementId: 'G-32L7NQ7YDG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
