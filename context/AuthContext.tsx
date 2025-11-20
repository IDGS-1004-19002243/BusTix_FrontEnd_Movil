import React, { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiLogout, apiRegister } from "@/services/auth/auth.service";
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from "@/services/auth/auth.types";
import { setTokens, clearTokens, getToken } from "@/services/auth/tokenStore";
import { decodeToken, DecodedToken } from "@/services/auth/jwtUtils";
import { useToastManager } from "@/components/toast";
import { categorizeError, ApiError } from "@/services/api-errors";

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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (registerDto: RegisterDto) => Promise<AuthResponseDto>;
  signOut: () => Promise<void>;
  isSessionValid: () => boolean;
  setTransition: (transitioning: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<
    string | null
  >(null);
  const [logoutErrorMessage, setLogoutErrorMessage] = useState<
    string | null
  >(null);
  const { showToast } = useToastManager();

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
          : decodedToken.role
          ? [decodedToken.role]
          : [],
        permissions: Array.isArray(decodedToken.permissions)
          ? decodedToken.permissions
          : decodedToken.permission
          ? [decodedToken.permission]
          : [],
        estatus: decodedToken.estatus,
        emailVerified: decodedToken.emailVerified === "True",
      };

      setSession(token);
      setUser(userData);

      setIsLoading(false);
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (!isTransitioning && loginSuccess) {
      showToast({
        type: "success",
        title: "Bienvenido",
        description: "Inicio de sesión exitoso",
        closable: false,
        duration: 3000,
      });
      setLoginSuccess(false);
    }
    if (!isTransitioning && logoutSuccess) {
      showToast({
        type: "success",
        title: "Adiós",
        description: "Sesión cerrada exitosamente",
        closable: false,
        duration: 3000,
      });
      setLogoutSuccess(false);
    }
    if (loginErrorMessage) {
      showToast({
        type: "error",
        title: "Error de inicio de sesión",
        description: loginErrorMessage,
        closable: false,
        duration: 3000,
      });
      setLoginErrorMessage(null);
    }
    if (!isTransitioning && logoutErrorMessage) {
      showToast({
        type: "error",
        title: "Error al cerrar sesión",
        description: logoutErrorMessage,
        closable: false,
        duration: 3000,
      });
      setLogoutErrorMessage(null);
    }
  }, [isTransitioning, loginSuccess, logoutSuccess, loginErrorMessage]);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const response: AuthResponseDto = await apiLogin({
        Email: email,
        Password: password,
      });
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
              : decodedToken.role
              ? [decodedToken.role]
              : [],
            permissions: Array.isArray(decodedToken.permissions)
              ? decodedToken.permissions
              : decodedToken.permission
              ? [decodedToken.permission]
              : [],
            estatus: decodedToken.estatus,
            emailVerified: decodedToken.emailVerified === "True",
          };
          setSession(response.token);
          setUser(userData);
          setLoginSuccess(true);
          setIsTransitioning(true);
        } else {
          setLoginErrorMessage("Token inválido recibido");
        }
      } else {
        setLoginErrorMessage(response.message || "Error");
      }
    } catch (error) {
      const apiError: ApiError =
        error && typeof error === "object" && "type" in error
          ? (error as ApiError)
          : categorizeError(error);
      setLoginErrorMessage(apiError.message);
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



  const signOut = async (): Promise<void> => {
    try {
      setIsTransitioning(true);
      const response: AuthResponseDto = await apiLogout();
      if (response.isSuccess) {
        setLogoutSuccess(true);
      } else {
        setLogoutErrorMessage(response.message || "Error desconocido");
      }
    } catch (error) {
      const apiError = categorizeError(error);
      setLogoutErrorMessage(apiError.message);
      throw error;
    } finally {
      // Limpiar estado local aunque el logout falle
      setSession(null);
      setUser(null);
      await clearTokens();
    }
  };

  const isSessionValid = () => {
    return !!session && !!user?.email;
  };

  const setTransition = (transitioning: boolean) => {
    setIsTransitioning(transitioning);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        user,
        isLoading,
        isTransitioning,
        signIn,
        signUp,
        signOut,
        isSessionValid,
        setTransition,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
