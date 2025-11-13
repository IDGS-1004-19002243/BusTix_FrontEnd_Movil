import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Stack, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "@/components/auth/contexts/ctx";
import { SplashScreenController } from "@/components/auth/screens/splash";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    OpenSans: require("../assets/fonts/OpenSans-VariableFont_wdth,wght.ttf"),
    ...FontAwesome.font,
  });

  const [styleLoaded, setStyleLoaded] = useState(false);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const pathname = usePathname();
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  // <Slot /> es un componente de Expo Router que actúa como marcador de posición (placeholder)
  // para renderizar el contenido de las rutas hijas. Su traducción sencilla es "espacio reservado" o "ranura".
  // Al ir a /home, el <Slot /> raíz renderiza el layout de (pages) (sidebar, navbar),
  // y el <Slot /> de (pages) que esta en _layout.tsx renderiza la página home. Cadena automática para modularidad.

  return (
    <SessionProvider>
      <SplashScreenController />
      <SafeAreaProvider>
        <GluestackUIProvider mode={colorMode}>
          <ThemeProvider
            value={colorMode === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack />
          </ThemeProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </SessionProvider>
  );
}
