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
import { useRouteAccess } from '@/hooks/useRouteAccess';
import NotFoundScreen from '../+not-found';

export default function PagesLayout() {
  const {isLoading} = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Usar hook centralizado que lee `config/routeRoles.ts`.
  const { allowed, requiresRole } = useRouteAccess(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);


  // Calcular "blocked" de forma síncrona para que el componente pueda mostrar
  // la pantalla de NotFound en el mismo lugar sin que aparezca brevemente la
  // sidebar o la cabecera. "blocked" es true cuando la ruta requiere roles y
  // el rol del usuario no coincide (o el usuario no está autenticado).
  const blocked = !isLoading && requiresRole && !allowed;

  // "loadingOrMounting" es true mientras la sesión está cargando o
  // el layout no se ha montado todavía. Durante ese tiempo evitamos dibujar
  // la sidebar/navbar para que no aparezcan y desaparezcan (evitar parpadeos).
  const loadingOrMounting = isLoading || !mounted;


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
     Este <Slot /> renderiza la página específica dentro del grupo (pages), como home o eventos, completando la cadena de layouts. */

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
      {loadingOrMounting ? (
        // Explicación :
        // - Si todavía estamos cargando la sesión o el layout no está listo,
        //   no mostramos la sidebar ni la cabecera. Esto evita que se vea
        //   brevemente la interfaz antes de decidir si se muestra NotFound.
        // - Aquí podríamos mostrar un "skeleton" (menú mínimo) si quieres.
        null
      ) : blocked ? (
        // Explicación :
        // - Si "blocked" es true significa que la ruta existe pero el usuario
        //   no tiene permiso. En vez de navegar a otra URL, mostramos la pantalla
        //   de "Not Found" dentro del layout actual. De esta forma la URL
        //   permanece igual (por ejemplo: /users) y no se ve la sidebar/navbar.
        <NotFoundScreen />
      ) : (
        <>
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
        </>
      )}
    </View>
    </>
  );
}
