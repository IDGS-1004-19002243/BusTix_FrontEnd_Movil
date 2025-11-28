// Hook: useGradualAnimation
// Propósito: medir la altura del teclado y devolverla para usar en animaciones.
// Devuelve: { height } donde `height` (altura) es una shared value (valor compartido)
// de Reanimated que cambia cuando el teclado aparece o se oculta.
// Parámetro opcional: offset (margen extra en px), por defecto 42.

import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';

// Hook
export const useGradualAnimation = (offset: number = 42) => {
  // `height` es la shared value (valor compartido) que usará el layout.
  const height = useSharedValue<number>(0);

  // Escucha los movimientos del teclado y actualiza `height`.
  // El callback corre como worklet (worklet: función que corre en el hilo de animación).
  useKeyboardHandler(
    {
      onMove: (e) => {
        'worklet';
        // Si el teclado está abierto e.height > 0, usamos teclado + offset.
        // Si está cerrado, no hay espacio extra.
        height.value = e.height > 0 ? e.height + offset : 0;
      },
    },
    [],
  );

  return { height };
};

export default useGradualAnimation;
