import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import {
  fetchProfile,
  syncAccount,
  updateProfile as updateProfileApi,
  API_BASE_URL
} from '../services/api.js';

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncWithBackend = useCallback(
    async (user) => {
      if (!user) {
        setAppUser(null);
        setProfile(null);
        setError(null);
        return null;
      }

      const performSync = async (forceRefresh) => {
        try {
          const token = await user.getIdToken(forceRefresh);
          const data = await syncAccount({ token });
          setAppUser(data.user ?? null);
          setProfile(data.profile ?? null);
          setError(null);
          return data;
        } catch (err) {
          if (err?.name === 'TypeError') {
            const networkError = new Error(
              `Unable to reach the EventsHub API at ${API_BASE_URL}. Please make sure the backend server is running.`
            );
            networkError.code = 'network-error';
            setError(networkError);
            throw networkError;
          }
          throw err;
        }
      };

      try {
        return await performSync(false);
      } catch (err) {
        if (err?.status === 401) {
          try {
            return await performSync(true);
          } catch (retryError) {
            console.error(
              'Failed to sync account with backend after forcing token refresh',
              retryError
            );
            setError(retryError);
            throw retryError;
          }
        }

        console.error('Failed to sync account with backend', err);
        setError(err);
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      setInitializing(true);
      setFirebaseUser(user);

      if (!user) {
        setAppUser(null);
        setProfile(null);
        setError(null);
        setInitializing(false);
        return;
      }

      try {
        await syncWithBackend(user);
      } catch (err) {
        console.error('Failed to sync account with backend', err);
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [syncWithBackend]);

  const getToken = useCallback(async (forceRefresh = false) => {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setActionLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const register = useCallback(
    async ({ name, email, password }) => {
      setActionLoading(true);
      setError(null);
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateFirebaseProfile(credential.user, { displayName: name });
        }

        await credential.user.reload();
        await credential.user.getIdToken(true);
        await syncWithBackend(credential.user);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [syncWithBackend]
  );

  const logout = useCallback(async () => {
    setActionLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    const data = await fetchProfile({ token });
    setProfile(data.profile ?? null);
    return data.profile;
  }, [getToken]);

  const updateProfile = useCallback(
    async (update) => {
      setActionLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('Not authenticated');
        }
        const data = await updateProfileApi({ token, data: update });
        setProfile(data.profile ?? null);
        return data.profile;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [getToken]
  );

  const loginWithGoogle = useCallback(async () => {
    setActionLoading(true);
    setError(null);
    try {
      try {
        await signInWithPopup(auth, googleProvider);
        return 'success';
      } catch (err) {
        if (err?.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, googleProvider);
          return 'redirect';
        }

        if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
          return 'cancelled';
        }

        throw err;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      firebaseUser,
      user: appUser,
      profile,
      initializing,
      actionLoading,
      error,
      isAuthenticated: Boolean(firebaseUser && appUser),
      login,
      register,
      logout,
      loginWithGoogle,
      refreshProfile,
      updateProfile,
      getToken
    }),
    [
      firebaseUser,
      appUser,
      profile,
      initializing,
      actionLoading,
      error,
      login,
      register,
      logout,
      loginWithGoogle,
      refreshProfile,
      updateProfile,
      getToken
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
