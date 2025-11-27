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
import { PurchaseProvider } from "@/context/PurchaseContext";
import { SplashScreenController } from "@/components/auth/screens/splash";
import '@/services/auth/interceptors'; // Importar para configurar axios interceptores
import LoadingTransition from "@/components/transition/LoadingTransition";
import TransactionOverlay from "@/components/transition/TransactionOverlay";
import { useSession } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";

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

  /*
   * ESTRUCTURA DE PROVEEDORES (de afuera hacia adentro):
   * 1. GluestackUIProvider → Sistema de UI y temas (light/dark)
   * 2. SessionProvider → Autenticación (login/logout, persiste datos)
   * 3. PurchaseProvider → Datos temporales de compra (10 min, no persiste)
   */

  return (
    <GluestackUIProvider mode={colorMode}> 
      <SessionProvider> 
        <PurchaseProvider>
          <AppContent colorMode={colorMode} />
        </PurchaseProvider>
      </SessionProvider>
    </GluestackUIProvider>
  );
}

function AppContent({ colorMode }: { colorMode: "light" | "dark" }) {
  const { isTransitioning, setTransition } = useSession();
  const { isTransactionOverlayVisible, setTransactionOverlayVisible } = usePurchase();

  return (
    <>
      <SplashScreenController />
      {isTransitioning && (
        <View style={{
          position: 'absolute', 
          top: 0,
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 999 
        }}>
          <LoadingTransition duration={2000} onComplete={() => setTransition(false)} />
        </View>
      )}
      {isTransactionOverlayVisible && (
        <View style={{
          position: 'absolute', 
          top: 0,
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 999 
        }}>
          <TransactionOverlay />
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
