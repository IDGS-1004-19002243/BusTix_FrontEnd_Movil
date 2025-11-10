import React, { createContext, useContext, useEffect, useState } from 'react';

interface Session {
  user: string | null;
}

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  signIn: (user: string) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

    
  useEffect(() => {

    /* 
  
    // Simulate loading session from storage
    const loadSession = async () => {
      // For demo, check if user is stored
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setSession({ user: storedUser });
      }
      setIsLoading(false);
    };
    loadSession();
    */
  }, []);

   
  const signIn = (user: string) => {
    // setSession({ user });
    //localStorage.setItem('user', user);
  };

  const signOut = () => {
   // setSession(null);
    //localStorage.removeItem('user');
  };

  return (
    <SessionContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}