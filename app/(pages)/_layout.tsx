import { Slot, Stack } from "expo-router";
import { View, useWindowDimensions, Animated, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname } from "expo-router";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { useSidebarGestures } from "../../components/sidebar/hooks/useSidebarGestures";
import { useSession } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useRoleGuard } from '@/hooks/useRoleGuard';

export default function PagesLayout() {
    const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Definir roles requeridos por ruta
  const routeRoles: Record<string, string[]> = {
    '/users': ['admin', 'manager'],
    '/settings': ['admin'],
  };

  const allowedRoles = routeRoles[pathname] || [];
  useRoleGuard(allowedRoles);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;

    // If the current route has role restrictions, require authentication first.
    if (allowedRoles.length > 0) {
      if (!isAuthenticated) {
        router.replace('/sign-in');
      }
      // If authenticated but role is incorrect, `useRoleGuard` will redirect to /404.
      return;
    }

      // For non-role routes: still allow public pages (/home, /eventos and event details).
      // Allow `/eventos` and any `/eventos/:id` path as public.
      if (!isAuthenticated && pathname !== '/home' && !pathname.startsWith('/eventos')) {
        router.replace('/not-found' as any);
    }
  }, [mounted, isLoading, isAuthenticated, pathname, allowedRoles]);

  // Este layout maneja la sidebar, navbar y gestos de paneo para las páginas en (pages).
  // <Slot /> renderiza la página específica (ej. home, settings) dentro del grupo (pages).
  // Los gestos permiten abrir/cerrar la sidebar en móviles con PanResponder.

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const insets = useSafeAreaInsets();
  const sidebarWidth = 230;
  const slideAnim = useRef(
    new Animated.Value(isMobile ? (isSidebarOpen ? 0 : -sidebarWidth) : 0)
  ).current;

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (isMobile) {
      Animated.timing(slideAnim, {
        toValue: isSidebarOpen ? 0 : -sidebarWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [isSidebarOpen, isMobile, slideAnim]);

  const { contentPanHandlers, sidebarPanHandlers, indicatorAnim } = useSidebarGestures(
    isSidebarOpen,
    setIsSidebarOpen,
    slideAnim,
    sidebarWidth
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  /* <Slot /> es un componente de Expo Router que actúa como un marcador de posición (placeholder) 
     para renderizar el contenido de las rutas hijas. Su traducción sencilla es "espacio reservado" o "ranura". 
     Este <Slot /> renderiza la página específica dentro del grupo (pages), como home o settings, completando la cadena de layouts. */

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
      <Sidebar 
        isOpen={isMobile ? isSidebarOpen : true} 
        onClose={closeSidebar}
        isCollapsed={!isMobile && isSidebarCollapsed}
        onToggleCollapse={toggleCollapse}
        slideAnim={slideAnim}
        panHandlers={isMobile && Platform.OS !== 'web' ? sidebarPanHandlers : {}}
      />
      <View style={{ flex: 1 }}>
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <View
          style={{ flex: 1, backgroundColor: "#ffffff" }}
          {...(isMobile && Platform.OS !== 'web' ? contentPanHandlers : {})}
        >
          {isLoading ? null : <Slot />}
          <Animated.View
            style={{
              position: 'absolute',
              left: -22,
              top: '50%',
              marginTop: '-20%',
              width: '10%',
              height: '40%',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              opacity: indicatorAnim,
            }}
          />
        </View>
      </View>
    </View>
    </>
  );
}
