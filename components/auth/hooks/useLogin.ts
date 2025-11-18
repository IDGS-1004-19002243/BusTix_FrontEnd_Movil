import { useState } from 'react';
import { useSession } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

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
    const isUsernameInvalid = username.trim() === '';
    const isPasswordInvalid = password.length < 6;
    setUsernameInvalid(isUsernameInvalid);
    setPasswordInvalid(isPasswordInvalid);
    setLoginError('');

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