'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { app } from '../app/lib/firebaseClient';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAgentProfile } from '../app/lib/agentProfile';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [agentProfile, setAgentProfile] = useState(undefined);
  const auth = getAuth(app);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;

      setUser(currentUser || null);

      if (!currentUser) {
        setAgentProfile(null);
        return;
      }

      setAgentProfile(undefined);

      try {
        const profile = await getAgentProfile(currentUser.uid);
        if (active) {
          setAgentProfile(profile);
        }
      } catch (error) {
        console.error('Failed to load agent profile:', error);
        if (active) {
          setAgentProfile(null);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, agentProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
