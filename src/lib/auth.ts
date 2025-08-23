'use server';

import {cookies} from 'next/headers';
import {getApps, getApp, initializeApp} from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import type {User} from './types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const SESSION_COOKIE_NAME = 'session';

export async function getSession() {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    const user = JSON.parse(session) as User;
    // In a real app, you'd want to verify the token with Firebase Admin SDK on the server
    return {user};
  } catch {
    return null;
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {error: 'Email and password are required.'};
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const {user} = userCredential;

    const userData: User = {
      id: user.uid,
      name: user.displayName,
      email: user.email!,
    };

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000 * 7); // 7 days
    cookies().set(SESSION_COOKIE_NAME, JSON.stringify(userData), {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return {success: true};
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      return {error: 'Invalid email or password. Please try again.'};
    }
    return {error: 'An unknown error occurred. Please try again.'};
  }
}

export async function signup(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return {error: 'All fields are required.'};
  }

  if (password.length < 6) {
    return {error: 'Password must be at least 6 characters long.'};
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const {user} = userCredential;

    await updateProfile(user, {displayName: name});

    const userData: User = {
      id: user.uid,
      name: user.displayName,
      email: user.email!,
    };

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000 * 7); // 7 days
    cookies().set(SESSION_COOKIE_NAME, JSON.stringify(userData), {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return {success: true};
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      return {error: 'An account with this email already exists.'};
    }
    return {error: error.message};
  }
}

export async function logout() {
  cookies().set(SESSION_COOKIE_NAME, '', {expires: new Date(0)});
}
