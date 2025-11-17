import React, { createContext, useContext,useEffect } from 'react';
import { apiLogin, apiLogout, apiRegister } from '@/services/auth/auth.service';
import { AuthResponseDto, LoginDto, RegisterDto } from '@/services/auth/auth.types';
import { setTokens, clearTokens, getToken } from '@/services/auth/tokenStore';
import { decodeToken, DecodedToken } from '@/services/auth/jwtUtils';

interface User {
  id: string | null;
  email: string | null;
  name: string | null;
  roles: string[];
  permissions: string[];
  estatus: string | null;
  emailVerified: boolean;
}

interface AuthContextType {
  session: string | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (registerDto: RegisterDto) => Promise<AuthResponseDto>;
  signOut: () => Promise<AuthResponseDto>;
  isSessionValid: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const token = await getToken();

      if (!token) {
        setSession(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Decodificar el token para obtener información
      const decodedToken = decodeToken(token);

      if (!decodedToken) {
        setSession(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Token válido, crear objeto user
      const userData: User = {
        id: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.name,
        roles: Array.isArray(decodedToken.roles) 
          ? decodedToken.roles 
          : (decodedToken.role ? [decodedToken.role] : []),
        permissions: Array.isArray(decodedToken.permissions) 
          ? decodedToken.permissions 
          : (decodedToken.permission ? [decodedToken.permission] : []),
        estatus: decodedToken.estatus,
        emailVerified: decodedToken.emailVerified === 'True'
      };

      setSession(token);
      setUser(userData);

      setIsLoading(false);
    };
    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {

      const response: AuthResponseDto = await apiLogin({ Email: email, Password: password });
      if (response.isSuccess) {
        // Decodificar el token para obtener información del usuario
        const decodedToken = decodeToken(response.token);
    
        if (decodedToken) {
          const userData: User = {
            id: decodedToken.sub,
            email: decodedToken.email,
            name: decodedToken.name,
            roles: Array.isArray(decodedToken.roles) 
              ? decodedToken.roles 
              : (decodedToken.role ? [decodedToken.role] : []),
            permissions: Array.isArray(decodedToken.permissions) 
              ? decodedToken.permissions 
              : (decodedToken.permission ? [decodedToken.permission] : []),
            estatus: decodedToken.estatus,
            emailVerified: decodedToken.emailVerified === 'True'
          };
          setSession(response.token);
          setUser(userData);

        } else {
          throw new Error('Invalid token received');
        }
      }
    } catch (error) {
      throw error; 
    }
  };

  const signUp = async (registerDto: RegisterDto): Promise<AuthResponseDto> => {
    try {
      const response = await apiRegister(registerDto);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async (): Promise<AuthResponseDto> => {
    const response = await apiLogout();
    setSession(null);
    setUser(null);
    return response;
  };

  const isSessionValid = () => {
    return !!session && !!user?.email;
  };

  return (
    <AuthContext.Provider value={{
      session,
      isAuthenticated: !!session,
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      isSessionValid
    }}>
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