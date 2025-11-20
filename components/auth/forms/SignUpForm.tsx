import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { ChevronLeftIcon } from '@/components/ui/icon';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { useSignUp } from '../hooks/useSignUp';
import { apiRegister } from '@/services/auth/auth.service';
import { RegisterDto } from '@/services/auth/auth.types';
import { useToastManager } from '@/components/toast';
import { categorizeError } from '@/services/api-errors';

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

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const platform = Platform.OS;
  const isWeb = platform === 'web';
  const inputHeightClass = isWeb ? 'h-8' : 'h-8';
  const signUp = useSignUp();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastManager();

  const handleSignUp = async () => {
    const isFirstNameInvalid = signUp.firstName.trim() === '';
    const isLastNamePInvalid = signUp.lastNameP.trim() === '';
    const isEmailInvalid = !validateEmail(signUp.email);
    const isSignUpPasswordInvalid = !validatePassword(signUp.password);
    const isConfirmPasswordInvalid = signUp.confirmPassword !== signUp.password;

    signUp.setFirstNameInvalid(isFirstNameInvalid);
    signUp.setLastNamePInvalid(isLastNamePInvalid);
    signUp.setEmailInvalid(isEmailInvalid);
    signUp.setSignUpPasswordInvalid(isSignUpPasswordInvalid);
    signUp.setConfirmPasswordInvalid(isConfirmPasswordInvalid);

    if (!isFirstNameInvalid && !isLastNamePInvalid && !isEmailInvalid && !isSignUpPasswordInvalid && !isConfirmPasswordInvalid) {
      setLoading(true);
      try {
        const registerDto: RegisterDto = {
          EmailAddress: signUp.email,
          Password: signUp.password,
          NombreCompleto: signUp.fullName,
          TipoDocumento: 'DNI', // Default
          NumeroDocumento: '', // Not in form
          Roles: ['User']
        };
        const response = await apiRegister(registerDto);
        if (response.isSuccess) {
          showToast({
            type: "success",
            title: "Éxito",
            description: response.message,
            closable: false,
            duration: 3000,
          });
          onSwitchToLogin();
        } else {
          showToast({
            type: "error",
            title: "Error",
            description: response.message || 'Error en el registro',
            closable: false,
            duration: 3000,
          });
        }
      } catch (error: any) {
        const apiError = categorizeError(error);
        if (apiError.type !== 'NETWORK_ERROR') {
          showToast({
            type: "error",
            title: "Error",
            description: apiError.message,
            closable: false,
            duration: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <View className="w-full max-w-sm px-6">
        <VStack space="sm" className="w-full">
              <FormControl isInvalid={signUp.firstNameInvalid} size="sm" isRequired>
                <Input className={`${inputHeightClass}`}>
                  <InputField
                    placeholder="Nombre"
                    value={signUp.firstName}
                    onChangeText={(text) => {
                      signUp.setFirstName(text);
                      if (signUp.firstNameInvalid) signUp.setFirstNameInvalid(false);
                    }}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                  <FormControlErrorText className="text-red-500">
                    El nombre es obligatorio.
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl size="sm">
                <Input className={`${inputHeightClass}`}>
                  <InputField
                    placeholder="Segundo nombre"
                    value={signUp.middleName}
                    onChangeText={signUp.setMiddleName}
                  />
                </Input>
              </FormControl>
              <FormControl isInvalid={signUp.lastNamePInvalid} size="sm" isRequired>
                <Input className={`${inputHeightClass}`}>
                  <InputField
                    placeholder="Apellido paterno"
                    value={signUp.lastNameP}
                    onChangeText={(text) => {
                      signUp.setLastNameP(text);
                      if (signUp.lastNamePInvalid) signUp.setLastNamePInvalid(false);
                    }}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                  <FormControlErrorText className="text-red-500">
                    El apellido paterno es obligatorio.
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl size="sm">
                <Input className={`${inputHeightClass}`}>
                  <InputField
                    placeholder="Apellido materno"
                    value={signUp.lastNameM}
                    onChangeText={signUp.setLastNameM}
                  />
                </Input>
              </FormControl>
              <FormControl isInvalid={signUp.emailInvalid} size="sm" isRequired>
                <Input className={`${inputHeightClass}`}>
                  <InputField
                    placeholder="Email"
                    value={signUp.email}
                    onChangeText={(text) => {
                      signUp.setEmail(text);
                      if (signUp.emailInvalid) signUp.setEmailInvalid(false);
                    }}
                    keyboardType="email-address"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                  <FormControlErrorText className="text-red-500">
                    Ingresa un email válido.
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl isInvalid={signUp.signUpPasswordInvalid} size="sm" isRequired>
                <Input className={`${inputHeightClass}`}>
                  <InputField
                    placeholder="Contraseña"
                    value={signUp.password}
                    // Flujo de envío y recepción de datos:
                    // 1. Usuario escribe en el input -> onChangeText recibe el texto
                    // 2. setPassword(text) actualiza el estado en useSignUp
                    // 3. Si estaba inválido, setSignUpPasswordInvalid(false) resetea el error
                    // 4. Al enviar formulario, handleSignUp llama validatePassword(signUp.password) para validar
                    onChangeText={(text) => {
                      signUp.setPassword(text);
                      if (signUp.signUpPasswordInvalid) signUp.setSignUpPasswordInvalid(false);
                    }}
                    secureTextEntry
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                  <FormControlErrorText className="text-red-500">
                    La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo.
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl isInvalid={signUp.confirmPasswordInvalid} size="sm" isRequired>
                <Input className={`${inputHeightClass}`}>
                  <InputField
                    placeholder="Confirmar contraseña"
                    value={signUp.confirmPassword}
                    onChangeText={(text) => {
                      signUp.setConfirmPassword(text);
                      if (signUp.confirmPasswordInvalid) signUp.setConfirmPasswordInvalid(false);
                    }}
                    secureTextEntry
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                  <FormControlErrorText className="text-red-500">
                    Las contraseñas no coinciden.
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
            <Button
              size="sm"
              variant="solid"
              className="w-full mt-4 mb-3"
              onPress={handleSignUp}
              isDisabled={loading}
            >
              {loading ? (
                <ButtonSpinner color="white" />
              ) : (
                <ButtonText className="text-white">Registrarse</ButtonText>
              )}
            </Button>
            <View >
              <Button variant="link" size="md" onPress={onSwitchToLogin} style={{marginRight:22}}>
                  <ButtonIcon as={ChevronLeftIcon} className="text-primary-500" />
                  <ButtonText className="text-black text-sm" style={{ marginBottom: 3 }}>Regresar</ButtonText>
              </Button>
            </View>
      </View>
    </>
  );
}