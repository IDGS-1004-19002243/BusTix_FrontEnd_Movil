import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useState } from "react";
import { Stack, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SessionProvider } from "@/context/AuthContext";
import { SplashScreenController } from "@/components/auth/screens/splash";
import '@/services/auth/interceptors'; // Importar para configurar axios interceptores

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const [styleLoaded, setStyleLoaded] = useState(false);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const pathname = usePathname();
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  // <Slot /> es un componente de Expo Router que actúa como marcador de posición (placeholder)
  // para renderizar el contenido de las rutas hijas. Su traducción sencilla es "espacio reservado" o "ranura".
  // Al ir a /home, el <Slot /> raíz renderiza el layout de (pages) (sidebar, navbar),
  // y el <Slot /> de (pages) que esta en _layout.tsx renderiza la página home. Cadena automática para modularidad.

  /*
          KeyboardProvider (react-native-keyboard-controller):
          - Proporciona un contexto de eventos del teclado (apertura, cierre,
            movimiento) a los hooks y componentes nativos/JS.
          - Envolvemos la app para que hooks como `useGradualAnimation` reciban
            actualizaciones del teclado y podamos animar el layout sin depender
            de offsets (desplazamientos) fijos.
          - `preload={false}` desactiva la precarga del teclado al iniciar la
            aplicación (evita que el teclado aparezca brevemente al arrancar).
            Si necesitas precargar manualmente más tarde, usa la API de
            KeyboardController.
        */

  return (
    <SessionProvider>
      <SplashScreenController />
      <SafeAreaProvider>
        <KeyboardProvider preload={false}>
          <GluestackUIProvider mode={colorMode}>
            <ThemeProvider
              value={colorMode === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
          </GluestackUIProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </SessionProvider>
  );
}
