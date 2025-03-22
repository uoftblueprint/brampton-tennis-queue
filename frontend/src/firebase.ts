import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJd2dKovgdgS29dqUKG3a0RKZwL_M7C1g",
  //authDomain: "brampton-tennis-queue.firebaseapp.com",
  authDomain: "brampton-tennis-queue.vercel.app",
  projectId: "brampton-tennis-queue",
  storageBucket: "brampton-tennis-queue.appspot.com",
  messagingSenderId: "578763495949",
  appId: "1:578763495949:web:5c83ba102bcf0e719a9344",
};
const app = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth, db};
