import { useState } from 'react';
import { useSession } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export const useLogin = () => {
  const { signIn } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSignIn = async () => {
    const isUsernameInvalid = username.trim() === '';
    const isPasswordInvalid = password.length < 6;
    setUsernameInvalid(isUsernameInvalid);
    setPasswordInvalid(isPasswordInvalid);
    setLoginError('');

    if (!isUsernameInvalid && !isPasswordInvalid) {
      try {
        await signIn(username, password);
        console.log('Inicio de sesión exitoso');
        router.replace('/');
      } catch (error) {
        setLoginError('Credenciales incorrectas');
        setUsernameInvalid(true);
        setPasswordInvalid(true);
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
  };
};