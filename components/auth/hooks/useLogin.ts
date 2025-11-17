import { useState } from 'react';
import { useSession } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useToastManager } from '@/components/toast';
import { ApiError, ErrorType } from '@/services/api-errors';

export const useLogin = () => {
  const { signIn } = useSession();
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToastManager();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    const isUsernameInvalid = username.trim() === '';
    const isPasswordInvalid = password.length < 6;
    setUsernameInvalid(isUsernameInvalid);
    setPasswordInvalid(isPasswordInvalid);
    setLoginError('');

    if (!isUsernameInvalid && !isPasswordInvalid && !isLoading) {
      setIsLoading(true);
      try {
        await signIn(username, password);
        console.log('Inicio de sesión exitoso');
        showSuccessToast('¡Bienvenido!', 'Inicio de sesión exitoso', { closable: false });
        // Navigation removed here to avoid duplicate redirects. The SignIn page
        // already listens to `isAuthenticated` and performs the redirect.
      } catch (error) {
        // Manejar errores categorizados
        if (error && typeof error === 'object' && 'type' in error) {
          const apiError = error as ApiError;
          setLoginError(apiError.message);
          showErrorToast('Error de inicio de sesión', apiError.message, { closable: false });
        } else {
          // Error no categorizado (fallback)
          const message = error instanceof Error ? error.message : String(error);
          setLoginError(message);
          showErrorToast('Error de inicio de sesión', message, { closable: false });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    remember,
    setRemember,
    usernameInvalid,
    setUsernameInvalid,
    passwordInvalid,
    setPasswordInvalid,
    loginError,
    handleSignIn,
    isLoading,
  };
};