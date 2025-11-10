import React, { useState } from 'react';
import LoginForm from '../forms/LoginForm';
import SignUpForm from '../forms/SignUpForm';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);

  if (isSignUp) {
    return <SignUpForm onSwitchToLogin={() => setIsSignUp(false)} />;
  }

  return <LoginForm onSwitchToSignUp={() => setIsSignUp(true)} />;
}