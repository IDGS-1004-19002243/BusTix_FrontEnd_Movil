import React, { createContext, useContext,useEffect } from 'react';
import { apiLogin, apiLogout, apiRegister } from '@/services/auth/auth.service';
import { AuthResponseDto, LoginDto, RegisterDto } from '@/services/auth/auth.types';
import { setTokens, clearTokens, getToken } from '@/services/auth/tokenStore';
import { decodeToken, DecodedToken } from '@/services/auth/jwtUtils';
import { useToastManager } from '@/components/toast';
import { categorizeError } from '@/services/api-errors';

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
  isTransitioning: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponseDto>;
  signUp: (registerDto: RegisterDto) => Promise<AuthResponseDto>;
  signOut: () => Promise<AuthResponseDto>;
  isSessionValid: () => boolean;
  setTransition: (transitioning: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

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

  const signIn = async (email: string, password: string): Promise<AuthResponseDto> => {
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
          setIsTransitioning(true);

        } else {
          return { isSuccess: false, message: 'Token invalido recibido' } as AuthResponseDto;
        }
      }
      return response;
    } catch (error) {
      if (error && typeof error === 'object' && 'type' in error) {
        // Ya es un ApiError categorizado
        return { isSuccess: false, message: (error as any).message } as AuthResponseDto;
      } else {
        const apiError = categorizeError(error);
        return { isSuccess: false, message: apiError.message } as AuthResponseDto;
      }
    }
  };

  // signUp: Función asíncrona para registrar un nuevo usuario
  // Parámetros:
  // - registerDto: Objeto de tipo RegisterDto que contiene los datos de registro (ej: email, password, nombre, etc.)
  // Retorna: Promise<AuthResponseDto> - Respuesta de la API con el resultado del registro (isSuccess, message, token, etc.)
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
      isTransitioning,
      signIn,
      signUp,
      signOut,
      isSessionValid,
      setTransition: setIsTransitioning
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