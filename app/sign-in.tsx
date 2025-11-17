import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Seo from '@/components/helpers/Seo';
import AuthScreen from '../components/auth/screens/AuthScreen';
import { useSession } from '@/context/AuthContext';

// Esta página muestra el formulario de login.
// Si el usuario ya está logueado, lo manda directo a la página principal.
export default function SignIn() {
  // Verifica si estamos en web para ajustar la UI
  const Web = Platform.OS === 'web';

  // Obtiene si el usuario está autenticado del contexto de sesión
  const { isAuthenticated } = useSession();

  // Hook para navegar entre páginas
  const router = useRouter();

  // Estado para saber si estamos verificando la autenticación.
  // Inicia en 'true' por defecto para evitar mostrar flashes (parpadeos) del formulario
  // antes de confirmar si el usuario ya está logueado. Mientras es 'true', no se renderiza nada.
  const [isChecking, setIsChecking] = useState(true);

  // Efecto que se ejecuta se ejecuta una vez al montar el componente, cuando cambia 'isAuthenticated', router
  // Propósito: Verificar el estado de autenticación y decidir si mostrar el formulario o redirigir.
  // - Si 'isAuthenticated' es true (usuario logueado), redirige a '/home' sin mostrar formulario.
  // - Si es false (no logueado), cambia 'isChecking' a false para permitir renderizar el formulario.
  // Esto asegura una transición suave sin flashes.
  useEffect(() => {
    // Si ya está logueado, lo manda a home sin mostrar el formulario
    if (isAuthenticated) {
      router.replace('/home');
    } else {
      // Si no está logueado, permite mostrar el formulario cambiando isChecking a false
      setIsChecking(false);
    }
  }, [isAuthenticated, router]); // array de dependencias

  // Mientras verifica, no muestra nada para evitar parpadeos
  if (isChecking) {
    return null;
  }

  return (
    <>
      {/* Configura la barra de navegación: oculta header en web, título "Iniciar Sesión" */}
      <Stack.Screen options={{ headerShown: !Web, title: 'Iniciar Sesión' }} />

      {/* Mejora SEO: título y descripción para buscadores */}
      <Seo title="Iniciar Sesión" description="Inicia sesión en BusTix para gestionar tus viajes." />

      {/* Muestra el componente con el formulario de login */}
      <AuthScreen />
    </>
  );
}