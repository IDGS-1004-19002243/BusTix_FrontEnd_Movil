// Configuración para los componentes visuales de toast
// Solo incluye propiedades que usan los componentes SuccessToast y ErrorToast
export interface ToastConfig {
  id: string | number;     // ID único del toast (generado por gluestack-ui) — puede ser string o number
  title: string;           // Título principal del toast
  description?: string;    // Descripción opcional adicional
  closable?: boolean;      // Si es true, muestra botón para cerrar manualmente
}

// Tipos de toast disponibles
// Union type: solo puede ser uno de estos valores
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Configuración completa para crear cualquier tipo de toast
// Incluye propiedades para el hook useToastManager y gluestack-ui
export interface ToastOptions {
  id?: string | number;   // Optional id; if provided, will be used by the toast system. If not provided, the system generates one.
  type: ToastType;         // Tipo de toast: success, error, warning, o info
  title: string;           // Título obligatorio del toast
  description?: string;    // Descripción opcional (puede ser undefined)
  duration?: number;       // Duración en ms antes de auto-ocultarse (opcional)
  placement?: 'top' | 'top right' | 'top left' | 'bottom' | 'bottom left' | 'bottom right';  // Posición en pantalla (opcional)
  closable?: boolean;      // Si permite cerrar manualmente (opcional)
}