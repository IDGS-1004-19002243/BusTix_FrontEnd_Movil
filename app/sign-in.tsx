import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import Seo from '@/components/helpers/Seo';
import AuthScreen from '../components/auth/screens/AuthScreen';

export default function SignIn() {
  const Web = Platform.OS === 'web';

  return (
    <>
      {/* 1. Stack Screen Options: Oculta el encabezado en la web y establece el título por defecto */}
      <Stack.Screen options={{ headerShown: !Web, title: 'Iniciar Sesión' }} />

      {/* SEO */}
      <Seo title="Iniciar Sesión" description="Inicia sesión en BusTix para gestionar tus viajes." />

      {/* 3. El contenido principal de la pantalla */}
      <AuthScreen />
    </>
  );
}