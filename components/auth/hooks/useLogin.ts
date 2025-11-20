import { useState } from 'react';
import { useSession } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  const hasDigit = /\d/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNonAlphanumeric = /[^a-zA-Z\d]/.test(password);
  const hasMinLength = password.length >= 8;
  return hasDigit && hasLowercase && hasUppercase && hasNonAlphanumeric && hasMinLength;
};

export const useLogin = () => {
  const { signIn, setTransition } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    let isUsernameInvalid = username.trim() === '' || !validateEmail(username);
    let isPasswordInvalid = password.trim() === '';
    let errorMessage = '';

    if (username.trim() === '') {
      errorMessage = 'El correo electrónico es obligatorio.';
    } else if (!validateEmail(username)) {
      errorMessage = 'El correo electrónico no es válido.';
    } else if (password.trim() === '') {
      errorMessage = 'La contraseña es obligatoria.';
      isPasswordInvalid = true;
    }

    setUsernameInvalid(isUsernameInvalid);
    setPasswordInvalid(isPasswordInvalid);
    setLoginError(errorMessage);

    if (!isUsernameInvalid && !isPasswordInvalid && !isLoading) {
      setIsLoading(true);
      try {
        await signIn(username, password);
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