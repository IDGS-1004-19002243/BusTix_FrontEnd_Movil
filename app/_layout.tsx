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
    <SessionProvider>
      <AppContent colorMode={colorMode} />
    </SessionProvider>
  );
}

function AppContent({ colorMode }: { colorMode: "light" | "dark" }) {
  const { isTransitioning, setTransition } = useSession();

  return (
    <>
      <SplashScreenController />
      {isTransitioning && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}>
          <LoadingTransition duration={2000} onComplete={() => setTransition(false)} />
        </View>
      )}
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
    </>
  );
}
