import React, { useState } from 'react';
import LoginForm from '../forms/LoginForm';
import SignUpForm from '../forms/SignUpForm';
import { AuthLayout } from '../layouts';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);

  if (isSignUp) {
    return <AuthLayout title="Regístrate en BusTix" subtitle="Ingresa tus datos para crear tu cuenta"><SignUpForm onSwitchToLogin={() => setIsSignUp(false)} /></AuthLayout>;
  }

  return <AuthLayout title="Inicia sesión en tu cuenta" subtitle="Ingresa correo para iniciar sesión en tu cuenta"><LoginForm onSwitchToSignUp={() => setIsSignUp(true)} /></AuthLayout>;
}