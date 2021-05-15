import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB1ZB5wPIjdawTuDV6hjusRoddgBIdrBJk",
    authDomain: "insta-yy.firebaseapp.com",
    projectId: "insta-yy",
    storageBucket: "insta-yy.appspot.com",
    messagingSenderId: "120196360693",
    appId: "1:120196360693:web:fa9e0f0d43bb49035cd8bc",
    measurementId: "G-G3ZPMCVW1J"
  };

const FirebaseApp = firebase.initializeApp(firebaseConfig);
const db = FirebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db ,auth, storage};
