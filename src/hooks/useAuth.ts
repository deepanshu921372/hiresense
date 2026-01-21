'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithGoogle,
  signOut as firebaseSignOut,
  onAuthChange,
  type FirebaseUser,
} from '@/lib/firebase';
import type { User, AuthState } from '@/types';

const AUTH_STORAGE_KEY = 'hiresense_auth';

interface StoredAuth {
  firebaseUser: AuthState['firebaseUser'];
  user: User | null;
}

function getStoredAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveAuth(data: StoredAuth): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

interface UseAuthReturn extends AuthState {
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();

  const [state, setState] = useState<AuthState>(() => {
    const stored = getStoredAuth();
    if (stored?.firebaseUser) {
      return {
        user: stored.user,
        firebaseUser: stored.firebaseUser,
        loading: true,
        error: null,
      };
    }
    return {
      user: null,
      firebaseUser: null,
      loading: true,
      error: null,
    };
  });

  const fetchUserData = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user as User;
      }

      if (response.status === 404) {
        const createResponse = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'User',
            photoURL: firebaseUser.photoURL,
          }),
        });

        if (createResponse.ok) {
          const data = await createResponse.json();
          return data.user as User;
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const user = await fetchUserData(firebaseUser);
        const firebaseUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        };

        saveAuth({ firebaseUser: firebaseUserData, user });

        setState({
          firebaseUser: firebaseUserData,
          user,
          loading: false,
          error: null,
        });
      } else {
        clearAuth();
        setState({
          firebaseUser: null,
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const signInGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithGoogle();
      router.push('/jobs');
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
      throw error;
    }
  }, [router]);

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await firebaseSignOut();
      router.push('/');
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
      throw error;
    }
  }, [router]);

  return {
    ...state,
    signInGoogle,
    signOut,
  };
}
