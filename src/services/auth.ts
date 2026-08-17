// Funciones de autenticación
// Registro, login, logout y login con Google

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export const registerWithEmail = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () =>
    signInWithPopup(auth, googleProvider);

export const logoutUser = () => signOut(auth);