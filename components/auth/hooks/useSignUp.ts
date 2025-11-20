import { useState } from 'react';

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
  const [signUpError, setSignUpError] = useState('');

  const fullName = `${firstName} ${middleName} ${lastNameP} ${lastNameM}`.trim().replace(/\s+/g, ' ');

  const handleSignUp = () => {
    let isFirstNameInvalid = firstName.trim() === '';
    let isLastNamePInvalid = lastNameP.trim() === '';
    let isEmailInvalid = !validateEmail(email);
    let isSignUpPasswordInvalid = !validatePassword(password);
    let isConfirmPasswordInvalid = confirmPassword !== password;
    let errorMessage = '';

    if (firstName.trim() === '') {
      errorMessage = 'El nombre es obligatorio.';
    } else if (lastNameP.trim() === '') {
      errorMessage = 'El apellido paterno es obligatorio.';
    } else if (!validateEmail(email)) {
      errorMessage = 'El correo electrónico no es válido.';
    } else if (!validatePassword(password)) {
      errorMessage = 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo.';
    } else if (confirmPassword !== password) {
      errorMessage = 'Las contraseñas no coinciden.';
    }

    setFirstNameInvalid(isFirstNameInvalid);
    setLastNamePInvalid(isLastNamePInvalid);
    setEmailInvalid(isEmailInvalid);
    setSignUpPasswordInvalid(isSignUpPasswordInvalid);
    setConfirmPasswordInvalid(isConfirmPasswordInvalid);
    setSignUpError(errorMessage);
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
    fullName,
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
    signUpError,
    handleSignUp,
  };
};