import React from 'react';
import { View, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
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
import { useSession } from '@/context/AuthContext';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const platform = Platform.OS;
  const isWeb = platform === 'web';
  const inputHeightClass = isWeb ? 'h-8' : 'h-8';
  const signUp = useSignUp();
  const { signIn } = useSession();

  const handleSignUp = () => {
    signUp.handleSignUp();
    if (!signUp.firstNameInvalid && !signUp.lastNamePInvalid && !signUp.emailInvalid && !signUp.signUpPasswordInvalid && !signUp.confirmPasswordInvalid) {
      signIn(signUp.email, signUp.password);
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
                    Se requieren al menos 6 caracteres.
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
            <Button size="sm" variant="solid" className="w-full mt-4 mb-3" onPress={handleSignUp}>
              <ButtonText className="text-white">Registrarse</ButtonText>
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