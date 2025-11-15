import React from 'react';
import { View, useWindowDimensions, Platform, Pressable } from 'react-native';
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

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

export default function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  // platform-aware sizing only — do not depend on viewport width
  const platform = Platform.OS;
  const isWeb = platform === 'web';
  const checkboxSize = isWeb ? 'md' : 'lg';
  const linkButtonSize = isWeb ? 'md' : 'lg';
  const inputHeightClass = isWeb ?'h-8' : 'h-8';
  const linkTextClass = 'text-sm';
  const labelTextClass = isWeb ? 'text-sm' : '';
  const login = useLogin();

  const handleSignIn = () => {
    login.handleSignIn();
    if (!login.usernameInvalid && !login.passwordInvalid) {
    }
  };

  return (
    <>
      <View className="w-full max-w-sm px-6">
        <VStack space="sm" className="w-full">
          <FormControl isInvalid={login.usernameInvalid} size="sm" isRequired>
            <FormControlLabel>
              <Text className={labelTextClass} style={{ color: '#000000E0' }}>Usuario</Text>
            </FormControlLabel>
            <Input className={`my-1 ${inputHeightClass}`}>
              <InputField
                placeholder="Nombre de usuario"
                value={login.username}
                onChangeText={(text) => {
                  login.setUsername(text);
                  if (login.usernameInvalid) login.setUsernameInvalid(false);
                }}
              />
            </Input>
              {/* adjust input height on mobile */}
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
              <FormControlErrorText className="text-red-500">
                El nombre de usuario es obligatorio.
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          <FormControl isInvalid={login.passwordInvalid} size="sm" isRequired>
            <FormControlLabel>
              <Text className={labelTextClass} style={{ color: '#000000E0' }}>Contraseña</Text>
            </FormControlLabel>
           <Input className={`my-1 ${inputHeightClass}`}>
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
        {login.loginError && (
          <Text className="text-red-500 text-center">{login.loginError}</Text>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8, width: '100%' }}>
          <Checkbox value="remember" isChecked={login.remember} onChange={login.setRemember} size={checkboxSize}>
            <CheckboxIndicator style={{ borderWidth: 1 }}>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel className={`${linkTextClass} text-black`}>Recuérdame</CheckboxLabel>
          </Checkbox>
          <Button variant="link" size={linkButtonSize}>
            <ButtonText className="text-black text-xs">Olvidaste tu contraseña?</ButtonText>
          </Button>
        </View>
        <Button size="sm" variant="solid" className="w-full mb-2" onPress={handleSignIn}>
          <Text className="text-white">Iniciar sesión</Text>
        </Button>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
          <Text style={{ color: '#000000E0' }}>¿No tienes una cuenta?</Text>
          <Button variant="link" size="md" onPress={onSwitchToSignUp}>
            <ButtonText className="text-black text-sm ">Registrate</ButtonText>
          </Button>
        </View>
      </View>
    </>
  );
}