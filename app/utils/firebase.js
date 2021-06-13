import firebase from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyDkqLth8qtBhQY4lIKdB5RLjPCWT6gnkFs",
    authDomain: "app-5-tenedores.firebaseapp.com",
    projectId: "app-5-tenedores",
    storageBucket: "app-5-tenedores.appspot.com",
    messagingSenderId: "651090160418",
    appId: "1:651090160418:web:296fc14bbbcb86a72ed37b"
  };
  // Initialize Firebase
  export const firebaseApp = firebase.initializeApp(firebaseConfig);