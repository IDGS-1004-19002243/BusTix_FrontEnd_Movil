import { useState } from 'react';

export const useSignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastNameP, setLastNameP] = useState('');
  const [lastNameM, setLastNameM] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [lastNamePInvalid, setLastNamePInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [signUpPasswordInvalid, setSignUpPasswordInvalid] = useState(false);
  const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false);

  const handleSignUp = () => {
    const isFirstNameInvalid = firstName.trim() === '';
    const isLastNamePInvalid = lastNameP.trim() === '';
    const isEmailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isSignUpPasswordInvalid = password.length < 6;
    const isConfirmPasswordInvalid = confirmPassword !== password;
    setFirstNameInvalid(isFirstNameInvalid);
    setLastNamePInvalid(isLastNamePInvalid);
    setEmailInvalid(isEmailInvalid);
    setSignUpPasswordInvalid(isSignUpPasswordInvalid);
    setConfirmPasswordInvalid(isConfirmPasswordInvalid);
    if (!isFirstNameInvalid && !isLastNamePInvalid && !isEmailInvalid && !isSignUpPasswordInvalid && !isConfirmPasswordInvalid) {
      // Proceed with sign up
      console.log('Registro exitoso');
    }
  };

  return {
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastNameP,
    setLastNameP,
    lastNameM,
    setLastNameM,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstNameInvalid,
    setFirstNameInvalid,
    lastNamePInvalid,
    setLastNamePInvalid,
    emailInvalid,
    setEmailInvalid,
    signUpPasswordInvalid,
    setSignUpPasswordInvalid,
    confirmPasswordInvalid,
    setConfirmPasswordInvalid,
    handleSignUp,
  };
};