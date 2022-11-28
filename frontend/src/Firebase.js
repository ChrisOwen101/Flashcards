// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx00TB6cQ0BBEC55YK-DiBejZn-tdrO5s",
  authDomain: "sigmaflashcard.firebaseapp.com",
  projectId: "sigmaflashcard",
  storageBucket: "sigmaflashcard.appspot.com",
  messagingSenderId: "1022758431442",
  appId: "1:1022758431442:web:a2cc7f49ae15b1eb2bdb0b",
  measurementId: "G-MW4EXPYBFT",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export const signIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    return user;
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    // const errorMessage = error.message;
    // // The email of the user's account used.
    // const email = error.customData.email;
    // // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);

    console.log(errorCode);
  }
};

export const isSignedIn = () => {
  const user = auth.currentUser;
  return user !== undefined;
};
