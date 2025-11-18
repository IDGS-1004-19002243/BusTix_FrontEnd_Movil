import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useState } from "react";
import { View } from "react-native";
import { Stack, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SessionProvider } from "@/context/AuthContext";
import { SplashScreenController } from "@/components/auth/screens/splash";
import '@/services/auth/interceptors'; // Importar para configurar axios interceptores
import LoadingTransition from "@/components/transition/LoadingTransition";
import { useSession } from "@/context/AuthContext";

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

  return (
    <GluestackUIProvider mode={colorMode}>
      <SessionProvider>
        <AppContent colorMode={colorMode} />
      </SessionProvider>
    </GluestackUIProvider>
  );
}

function AppContent({ colorMode }: { colorMode: "light" | "dark" }) {
  const { isTransitioning, setTransition } = useSession();

  return (
    <>
      <SplashScreenController />
      {isTransitioning && (
        // View que actúa como contenedor absoluto para la transición de carga.
        // Se muestra solo cuando isTransitioning es true, cubriendo toda la pantalla para evitar flashes del contenido.
        <View style={{
          position: 'absolute', // Posiciona la vista de manera absoluta, permitiendo superponerla sobre otros elementos sin afectar el layout normal.
          top: 0, // "Borde superior" se refiere a la linea superior del view. Valor 0 lo pega al borde superior del contenedor padre (pantalla), sin separación.
          left: 0, 
          right: 0, 
          bottom: 0, 
          // Al usar 0 en los cuatro lados, la vista se estira para ocupar todo el ancho y alto disponible, cubriendo completamente la pantalla como un overlay.
          zIndex: 999 // Establece un índice Z alto para asegurar que la vista esté encima de todos los demás elementos en la pantalla.
        }}>
          <LoadingTransition duration={2000} onComplete={() => setTransition(false)} />
        </View>
      )}
      <SafeAreaProvider>
        <KeyboardProvider preload={false}>
          <ThemeProvider
            value={colorMode === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </>
  );
}
