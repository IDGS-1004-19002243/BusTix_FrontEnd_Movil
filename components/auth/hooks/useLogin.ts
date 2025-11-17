import { useState } from 'react';
import { useSession } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useToastManager } from '@/components/toast';
import { ApiError, ErrorType } from '@/services/api-errors';

export const useLogin = () => {
  const { signIn, setTransition } = useSession();
  const router = useRouter();
  const { showToast } = useToastManager();
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
        const response = await signIn(username, password);
        if (response.isSuccess) {
          showToast({ type: 'success', title: '', description: 'Inicio de sesión exitoso', closable: false, duration: 3500 });
        } else {
          const message = typeof response.message === 'string' ? response.message : (response.message as any)?.message || 'Error desconocido';
          showToast({ type: 'error', title: 'Error de inicio de sesión', description: message, closable: false, duration: 3000 });
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