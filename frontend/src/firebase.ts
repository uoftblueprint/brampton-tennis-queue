import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.CONFIG_API_KEY,
  authDomain: "brampton-tennis-queue.firebaseapp.com",
  projectId: "brampton-tennis-queue",
  storageBucket: "brampton-tennis-queue.appspot.com",
  messagingSenderId: process.env.CONFIG_SENDER_ID,
  appId: process.env.CONFIG_APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth, db};
