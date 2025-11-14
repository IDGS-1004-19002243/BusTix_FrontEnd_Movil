// Hook: useGradualAnimation
// Propósito: medir la altura del teclado y devolverla para usar en animaciones.
// Devuelve: { height } donde `height` (altura) es una shared value (valor compartido)
// de Reanimated que cambia cuando el teclado aparece o se oculta.

import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';

// OFFSET (margen extra): px que siempre añadimos a la altura del teclado
// para dejar algo de separación entre el contenido y el teclado.
const OFFSET = 42;

// Hook
export const useGradualAnimation = () => {
  // Mínimo espacio que queremos mantener.
  const totalOffset = OFFSET;

  // `height` es la shared value (valor compartido) que usará el layout.
  const height = useSharedValue<number>(totalOffset);

  // Escucha los movimientos del teclado y actualiza `height`.
  // El callback corre como worklet (worklet: función que corre en el hilo de animación).
  useKeyboardHandler(
    {
      onMove: (e) => {
        'worklet';
        // Si el teclado está abierto e.height > 0, usamos teclado + OFFSET.
        // Si está cerrado, volvemos al mínimo (totalOffset).
        height.value = e.height > 0 ? Math.max(e.height + OFFSET, totalOffset) : totalOffset;
      },
    },
    [],
  );

  return { height };
};

export default useGradualAnimation;
