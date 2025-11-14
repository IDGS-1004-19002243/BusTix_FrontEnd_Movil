import React from "react";
import { View, useWindowDimensions, ScrollView } from "react-native";
// Reanimated (librería para animaciones suaves): usamos Animated.View (vista animada)
// y useAnimatedStyle (usar estilo animado) para crear animaciones fluidas.
// Lo usamos para mover un espacio al final cuando aparece el teclado
// y así evitar que los campos queden tapados.
import Animated from 'react-native-reanimated';
import { useAnimatedStyle } from 'react-native-reanimated';
// useGradualAnimation (hook): función que mide el teclado y devuelve su altura.
// - Devuelve una shared value (valor compartido) llamada `height`.
// - height (altura) = altura en píxeles del teclado + un pequeño margen.
import useGradualAnimation from '@/hooks/useGradualAnimation';
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import AuthHeader from "./AuthHeader";
import { authStyles } from "../styles";
import { AuthLayoutProps } from "../types";
import { SIZES } from "../constants";


export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < SIZES.mobileBreakpoint;
  // height (altura): valor compartido que devuelve useGradualAnimation.
  // Es la altura del teclado en px (incluye un pequeño margen).
  // Se usa para empujar el contenido y que los inputs no queden tapados.
  const { height } = useGradualAnimation();

  // keyboardPaddingStyle (estilo de relleno para el teclado): convierte la altura
  // en un estilo animado. Lo usamos en un <Animated.View (vista animada)> para
  // crear un espacio (spacer / espaciador) que empuja el contenido hacia arriba
  // cuando se abre el teclado.
  // OFFSET (desplazamiento / margen extra) es el valor fijo que suma el hook
  // a la altura del teclado para dejar separación adicional.
  const keyboardPaddingStyle = useAnimatedStyle(() => ({
    height: height.value,
  }), []);

  return (
    <View style={authStyles.container}>
      <View
        style={[
          authStyles.rowContainer,
          { flexDirection: isMobile ? "column" : "row" },
        ]}
      >
        {/* Columna izquierda */}
        <View
          style={[
            authStyles.leftColumn,
            {
              width: isMobile ? "100%" : "50%",
              padding: isMobile ? 15 : 40,
              alignItems: isMobile ? "center" : "flex-start",
              flex: 1,
            },
          ]}
        >
          <View
            style={[
              authStyles.headerWrapper,
              { alignItems: isMobile ? "center" : "flex-start" },
            ]}
          >
            <AuthHeader isMobile={isMobile} />
          </View>

          <ScrollView
            style={[authStyles.scrollView, { flex: 1 }]}
            // `contentContainerStyle`: estilos del contenedor interno del ScrollView
            // (padding del contenido: 0 en móvil, 40 en escritorio).
            // Nota: es una prop exclusiva de `ScrollView` (unique prop); no usarla en `View`.
            contentContainerStyle={[
              authStyles.scrollViewContent,
              { paddingHorizontal: isMobile ? 0 : 40 },
            ]}
            // `showsVerticalScrollIndicator`: muestra/oculta la barra de scroll vertical.
            showsVerticalScrollIndicator={true}
            // `keyboardShouldPersistTaps`: controla si los taps (toques) se procesan
            // cuando el teclado está abierto. Con "handled" los taps en botones
            // o inputs internos se manejan incluso si el teclado está activo.
            // Si el usuario pulsa "Enviar" en el teclado, la acción se ejecuta
            // inmediatamente; no hace falta cerrar el teclado y luego tocar el botón.
            keyboardShouldPersistTaps="handled"
          >
            <View style={authStyles.contentWrapper}>
              <Text className="text-xl font-bold text-center mb-1 text-black">
                {title}
              </Text>
              <Text
                className="text-xs text-center mb-4"
                style={authStyles.subtitle}
              >
                {subtitle}
                </Text>
                {children}
                {/* Espaciador animado:
                  - Es un contenedor vacío (espaciador) que cambia su altura según el teclado.
                  - Cuando el teclado aparece, sube y empuja los campos.
                  - Añade padding (relleno) al final del contenido: el espaciador
                    ocupa espacio y, como el layout usa `flex`, el contenedor se
                    adapta automáticamente al nuevo tamaño.
                */}
                <Animated.View style={keyboardPaddingStyle} />
            </View>
          </ScrollView>
        </View>

        {/* Columna derecha */}
        {!isMobile && (
          <View style={[authStyles.rightColumn, { width: "50%" }]}>
            <Image
              source={require("@/assets/images/Imagen_login.jpg")}
              style={authStyles.illustration}
              contentFit="cover"
              accessibilityLabel="Ilustración lateral de inicio de sesión"
            />
          </View>
        )}
      </View>
    </View>
  );
}
