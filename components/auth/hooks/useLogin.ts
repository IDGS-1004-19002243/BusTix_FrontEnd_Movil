import { useState } from 'react';

export const useLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  const handleSignIn = () => {
    const isUsernameInvalid = username.trim() === '';
    const isPasswordInvalid = password.length < 6;
    setUsernameInvalid(isUsernameInvalid);
    setPasswordInvalid(isPasswordInvalid);
    if (!isUsernameInvalid && !isPasswordInvalid) {
      console.log('Inicio de sesión exitoso');
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
    handleSignIn,
  };
};