import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon } from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
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
import { useLogin } from '../hooks/useLogin';
import { useSession } from '../contexts/ctx';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

export default function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const login = useLogin();
  const { signIn } = useSession();

  const handleSignIn = () => {
    login.handleSignIn();
    if (!login.usernameInvalid && !login.passwordInvalid) {
      signIn(login.username);
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View className="max-w-xs w-full">
            <Text className="text-xl font-bold text-center mb-1 text-black">Inicia sesión en tu cuenta</Text>
            <Text className="text-xs text-center mb-4 font-light">Ingresa correo para iniciar sesión en tu cuenta</Text>
            <VStack space="sm" className="w-full">
              <FormControl isInvalid={login.usernameInvalid} size="sm" isRequired>
                <FormControlLabel>
                  <Text>Nombre de usuario</Text>
                </FormControlLabel>
                <Input className="my-1 h-8">
                  <InputField
                    placeholder="Nombre de usuario"
                    value={login.username}
                    onChangeText={(text) => {
                      login.setUsername(text);
                      if (login.usernameInvalid) login.setUsernameInvalid(false);
                    }}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                  <FormControlErrorText className="text-red-500">
                    El nombre de usuario es obligatorio.
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl isInvalid={login.passwordInvalid} size="sm" isRequired>
                <FormControlLabel>
                  <Text>Contraseña</Text>
                </FormControlLabel>
                <Input className="my-1 h-8">
                  <InputField
                    placeholder="Contraseña"
                    value={login.password}
                    onChangeText={(text) => {
                      login.setPassword(text);
                      if (login.passwordInvalid) login.setPasswordInvalid(false);
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
            </VStack>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, width: '100%' }}>
              <Checkbox value="remember" isChecked={login.remember} onChange={login.setRemember} size="sm">
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>Recuérdame</CheckboxLabel>
              </Checkbox>
              <Button variant="link" size="sm">
                <ButtonText className="text-primary-500 hover:underline">Olvidaste tu contraseña?</ButtonText>
              </Button>
            </View>
            <Button size="sm" variant="solid" className="w-full mb-2" onPress={handleSignIn}>
              <Text className="text-white">Iniciar sesión</Text>
            </Button>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
              <Text className="text-gray-500">¿No tienes una cuenta?</Text>
              <Button variant="link" size="sm" onPress={onSwitchToSignUp}>
                <ButtonText className="text-primary-500 hover:underline">Registrate</ButtonText>
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