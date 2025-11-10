import React from 'react';
import { View, useWindowDimensions, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { ChevronLeftIcon } from '@/components/ui/icon';
import { Image } from 'expo-image';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { useSignUp } from '../hooks/useSignUp';
import { useSession } from '../contexts/ctx';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const signUp = useSignUp();
  const { signIn } = useSession();

  const handleSignUp = () => {
    signUp.handleSignUp();
    if (!signUp.firstNameInvalid && !signUp.lastNamePInvalid && !signUp.emailInvalid && !signUp.signUpPasswordInvalid && !signUp.confirmPasswordInvalid) {
      signIn(signUp.email);
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: isMobile ? 'column' : 'row', backgroundColor: '#ffffff' }}>
      <View style={{ flex: 1, padding: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={require('../../../assets/images/Logo_sidebar.png')}
            style={{ width: 32, height: 32 }}
            accessibilityLabel="Logo"
          />
          <Text className="text-lg ml-2 text-black">BusTix</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
          <View className="max-w-xs w-full">
            <Text className="text-xl font-bold text-center mb-1 text-black">Regístrate en BusTix</Text>
            <Text className="text-xs text-center mb-4 font-light">Ingresa tus datos para crear tu cuenta</Text>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <VStack space="sm" className="w-full">
              <FormControl isInvalid={signUp.firstNameInvalid} size="sm" isRequired>
                <Input className="my-1 h-8">
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
                <Input className="my-1 h-8">
                  <InputField
                    placeholder="Segundo nombre"
                    value={signUp.middleName}
                    onChangeText={signUp.setMiddleName}
                  />
                </Input>
              </FormControl>
              <FormControl isInvalid={signUp.lastNamePInvalid} size="sm" isRequired>
                <Input className="my-1 h-8">
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
                <Input className="my-1 h-8">
                  <InputField
                    placeholder="Apellido materno"
                    value={signUp.lastNameM}
                    onChangeText={signUp.setLastNameM}
                  />
                </Input>
              </FormControl>
              <FormControl isInvalid={signUp.emailInvalid} size="sm" isRequired>
                <Input className="my-1 h-8">
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
                <Input className="my-1 h-8">
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
                <Input className="my-1 h-8">
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
            </ScrollView>
            <Button size="sm" variant="solid" className="w-full mt-4 mb-3" onPress={handleSignUp}>
              <ButtonText className="text-white">Registrarse</ButtonText>
            </Button>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
              <Button variant="link" size="sm" onPress={onSwitchToLogin}>
                  <ChevronLeftIcon className="text-primary-500" />
                <ButtonText className="text-primary-500 hover:underline">Regresar</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </View>
      {!isMobile && (
        <View style={{ flex: 1, backgroundColor: '#ededed', justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../../../assets/images/Logo_sidebar.png')}
            style={{ width: 220, height: 220, opacity: 0.5 }}
            accessibilityLabel="Ilustración lateral de inicio de sesión"
          />
        </View>
      )}
    </View>
  );
}