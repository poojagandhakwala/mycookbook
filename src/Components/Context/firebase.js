import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import {
  getFirestore,
  query,
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  serverTimestamp,
  limit,
  orderBy
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5RbzKyW8W5Y_dU261mS2yyoQpQWx4BAU",
  authDomain: "cookbook-755f8.firebaseapp.com",
  projectId: "cookbook-755f8",
  storageBucket: "cookbook-755f8.appspot.com",
  messagingSenderId: "606530688768",
  appId: "1:606530688768:web:20ed9ec31fb87d972405e5",
  measurementId: "G-NPXFFX5TN9",
  databaseURL: "https://cookbook-755f8-default-rtdb.firebaseio.com",
};

const Fire = initializeApp(firebaseConfig);
const auth = getAuth(Fire);
const db = getFirestore(Fire);
const database = getDatabase(Fire);
const storage = getStorage(Fire);
const googleProvider = new GoogleAuthProvider();

let myId = 1;
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "LoginData"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    myId = 101;
    if (docs.docs.length === 0) {
      const lastuserRef = query(
        collection(db, "LoginData"),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      const docSnap = await getDocs(lastuserRef);
      docSnap.forEach((doc) => {
        myId = doc.id;
      });
      myId = parseInt(myId, 10);
      if (myId !== 1) {
        myId += 1;
        // myId = myId.toString();
        const newDocRef = doc(collection(db, "LoginData"), `${myId}`);
        setDoc(newDocRef, {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          photo: user.photoURL,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const lastuserRef = query(
      collection(db, "LoginData"),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const docSnap = await getDocs(lastuserRef);
    docSnap.forEach((doc) => {
      myId = doc.id;
    });
    myId = parseInt(myId, 10);
    if (myId !== 1) {
      myId += 1;
      const newDocRef = doc(collection(db, "LoginData"), `${myId}`);
      setDoc(newDocRef, {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        profile:"Public",
        timestamp: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error(err);
    if (err.code === "auth/email-already-in-use")
      alert("User already exists! Please Login.");
    else alert(err.message);
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};
const isLoggedIn = () => {
  const user1 = auth.currentUser;
  if (user1) {
    return true;
  } else {
    return false;
  }
};

export {
  Fire,
  isLoggedIn,
  auth,
  storage,
  db,
  database,
  signInWithGoogle,
  // logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};