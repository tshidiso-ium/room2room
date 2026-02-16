'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { app } from '@/firebase'; // your firebase.js init
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);