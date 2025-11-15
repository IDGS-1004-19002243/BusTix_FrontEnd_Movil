import React, { createContext, useContext } from 'react';
import { apiLogin, apiLogout, LoginResponse } from '@/services/auth/auth.service';
import { getToken } from '@/services/auth/tokenStore';

interface AuthContextType {
  session: string | null;
  isAuthenticated: boolean;
  role: string | null;
  email: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [role, setRole] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    getToken().then((token) => {
      setSession(token);
      setIsLoading(false);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await apiLogin(email, password);
      setSession(response.token);
      setRole(response.user.role);
      setEmail(response.user.email);
    } catch (error) {
      throw error; // Re-throw to handle in component
    }
  };

  const signOut = async () => {
    await apiLogout();
    setSession(null);
    setRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: !!session, role, email, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}