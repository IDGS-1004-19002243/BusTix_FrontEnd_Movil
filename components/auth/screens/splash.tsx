import { SplashScreen } from 'expo-router';
import { useSession } from '@/components/auth/contexts/ctx';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}