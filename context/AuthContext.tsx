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
  isSessionValid: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [role, setRole] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadSession = async () => {
      const token = await getToken();
      const storedRole = localStorage.getItem('userRole');
      const storedEmail = localStorage.getItem('userEmail');

      // Si falta el token, role o email, considera la sesión inválida y haz logout automático
      if (!token || !storedRole || !storedEmail) {
        // Resetear estado localmente (sin llamar apiLogout para evitar loop)
        setSession(null);
        setRole(null);
        setEmail(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        // Opcional: limpiar tokens si quieres forzar logout completo
        // await clearTokens();
      } else {
        // Sesión válida, cargar datos
        setSession(token);
        setRole(storedRole);
        setEmail(storedEmail);
      }
      setIsLoading(false);
    };
    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await apiLogin(email, password);
      setSession(response.token);
      setRole(response.user.role);
      setEmail(response.user.email);
      // Guardar role y email en localStorage
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userEmail', response.user.email);
    } catch (error) {
      throw error; // Re-throw to handle in component
    }
  };

  const isSessionValid = () => {
    return !!session && !!role && !!email;
  };

  const signOut = async () => {
    await apiLogout();
    setSession(null);
    setRole(null);
    setEmail(null);
    // Limpiar role y email de localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: !!session, role, email, isLoading, signIn, signOut, isSessionValid }}>
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