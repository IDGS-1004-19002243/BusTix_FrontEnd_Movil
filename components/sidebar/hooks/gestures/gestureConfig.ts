// Configuración y constantes para los gestos de la sidebar
export const DEFAULT_GESTURE_EDGE = 100; // px desde el borde izquierdo para iniciar gesto
export const DEFAULT_OPEN_THRESHOLD = 50; // px necesarios para considerar apertura
export const DEFAULT_VELOCITY_OPEN = 0.35; // vx para forzar apertura
export const DEFAULT_VELOCITY_DETECT = 0.6; // vx para detectar swipes rápidos
export const MIN_HORIZONTAL_MOVE = 10; // px mínimo de dx para considerar movimiento
export const MAX_VERTICAL_MOVE = 10; // px máximo de dy para ignorar vertical scroll
// factor de dominancia horizontal: dx debe ser este múltiplo de dy para considerarse horizontal
export const HORIZONTAL_DOMINANCE = 1.2; // dx debe ser 20% mayor que dy para considerarse movimiento horizontal
