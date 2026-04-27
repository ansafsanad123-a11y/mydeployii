import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('repo');
githubProvider.addScope('read:user');
export const googleProvider = new GoogleAuthProvider();

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firebase Connection: Success");
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
    console.error("Firebase Connection Error:", error);
  }
}

export const loginWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result;
  } catch (error) {
    console.error("Login with GitHub failed:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Login with Google failed:", error);
    throw error;
  }
};
