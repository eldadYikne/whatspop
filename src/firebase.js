import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-523InV3oW8f2ZfLTSu6kIzXcEO3J_gY",
  authDomain: "whatsapp-ey.firebaseapp.com",
  projectId: "whatsapp-ey",
  storageBucket: "whatsapp-ey.appspot.com",
  messagingSenderId: "998574232557",
  appId: "1:998574232557:web:ee1b0b1d3e9ca536b18de4",
  measurementId: "G-EW9QVQDEMX"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db