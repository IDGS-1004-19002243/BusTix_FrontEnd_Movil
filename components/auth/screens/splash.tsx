import { SplashScreen } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();
  const [fontsLoaded, fontsError] = useFonts({
    OpenSans: require('../../../assets/fonts/OpenSans-VariableFont_wdth,wght.ttf'),
    ...FontAwesome.font,
  });

  // If fonts had an error, hide splash to show error boundary / UI
  if (fontsError) {
    SplashScreen.hide();
    return null;
  }

  // Wait for BOTH the session load and fonts to finish before hiding splash.
  if (!isLoading && fontsLoaded) {
    SplashScreen.hide();
  }

  return null;
}