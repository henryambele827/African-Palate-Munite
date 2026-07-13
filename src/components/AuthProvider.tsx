import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signIn: () => Promise<void>;
  signInStaff: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bootstrapping: this email is auto-promoted to 'superadmin' the first time
// it signs in. Everyone else who signs in for the first time becomes a
// plain 'customer'. Brand admin accounts are never created this way — they
// are provisioned by the superadmin's brand-approval flow (see
// lib/organizations.ts), which writes their users/{uid} doc directly with
// role 'brand_admin' before they ever log in.
const SUPERADMIN_EMAILS = ['YOUR_SUPERADMIN_EMAIL@example.com'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Handle redirect result on page load
    getRedirectResult(auth)
      .catch((error: any) => {
        console.error('Redirect result error:', error);
        if (error.code === 'auth/network-request-failed' || error.code === 'auth/internal-error') {
          setAuthError('NETWORK_ERROR');
        } else if (error.code === 'auth/no-auth-event') {
          // Ignore - not a redirect result
        } else {
          setAuthError('SIGN_IN_FAILED');
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const path = `users/${user.uid}`;
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const currentProfile = docSnap.data() as UserProfile;
            const isBootstrapSuperadmin = SUPERADMIN_EMAILS.includes(user.email || '');
            
            // Auto-promote if they should be superadmin but aren't yet
            if (isBootstrapSuperadmin && currentProfile.role !== 'superadmin') {
              const updatedProfile = { ...currentProfile, role: 'superadmin' as const };
              await setDoc(docRef, updatedProfile, { merge: true });
              setProfile(updatedProfile);
            } else {
              setProfile(currentProfile);
            }
          } else {
            const isBootstrapSuperadmin = SUPERADMIN_EMAILS.includes(user.email || '');
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Customer',
              role: isBootstrapSuperadmin ? 'superadmin' : 'customer',
              createdAt: new Date().toISOString(),
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error: any) {
          console.error('Error fetching/creating profile:', error);
          if (error.message?.includes('offline')) {
            setAuthError('OFFLINE');
          } else {
            // Log but don't necessarily crash the whole app for first-time users
            try {
              handleFirestoreError(error, OperationType.GET, path);
            } catch (swallowed) {
              // The error is already logged by handleFirestoreError
            }
          }
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isSigningIn = React.useRef(false);

  const clearAuthError = () => setAuthError(null);

  const signIn = async () => {
    if (isSigningIn.current) return;
    isSigningIn.current = true;
    setAuthError(null);

    const provider = new GoogleAuthProvider();

    // Try popup first
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.log('Popup failed, trying redirect:', error.code);
      // Fall back to redirect if popup is blocked or fails
      if (error.code === 'auth/popup-blocked' ||
          error.code === 'auth/popup-closed-by-user' ||
          error.code === 'auth/cancelled-popup-request' ||
          error.code.includes('storage') ||
          error.code.includes('state')) {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          isSigningIn.current = false;
          console.error('Redirect error:', redirectError);
          if (redirectError.code === 'auth/network-request-failed') {
            setAuthError('NETWORK_ERROR');
          } else {
            setAuthError('SIGN_IN_FAILED');
          }
        }
      } else if (error.code === 'auth/network-request-failed' || error.code === 'auth/internal-error') {
        isSigningIn.current = false;
        setAuthError('NETWORK_ERROR');
      } else {
        isSigningIn.current = false;
        setAuthError('SIGN_IN_FAILED');
      }
    }
  };

  // Email/password sign-in, used by superadmin and brand_admin accounts
  // (accounts that are provisioned ahead of time rather than self-signed-up).
  const signInStaff = async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Staff sign-in error:', error.code);
      if (error.code === 'auth/network-request-failed') {
        setAuthError('NETWORK_ERROR');
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setAuthError('INVALID_CREDENTIALS');
      } else {
        setAuthError('SIGN_IN_FAILED');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, authError, signIn, signInStaff, signOut, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
