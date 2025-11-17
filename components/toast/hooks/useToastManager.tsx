import { useToast } from '@/components/ui/toast';
import { SuccessToast } from '../SuccessToast';
import { ErrorToast } from '../ErrorToast';
// ToastOptions: interface con propiedades para configurar cualquier toast
// ToastType: tipo union ('success' | 'error' | 'warning' | 'info')
import { ToastOptions, ToastType } from '../types';

export const useToastManager = () => {
  const toast = useToast();

  // Función principal que maneja cualquier tipo de toast
  // options: objeto con todas las propiedades necesarias (type, title, description, etc.)
  // ToastOptions es una interface que define: type, title, description?, duration?, placement?, closable?
  const showToast = (options: ToastOptions) => {
    // Extrae las propiedades del objeto options con valores por defecto
    // duration: 2000ms para success, 3000ms para otros tipos
    // placement: 'top' por defecto
    // closable: true por defecto (permite cerrar el toast)
    const { type, title, description, duration = type === 'success' ? 2000 : 3000, placement = 'top', closable = true } = options;

    toast.show({
      placement,
      duration,
      render: ({ id }) => {
        const config = { id, title, description, closable };

        switch (type) {
          case 'success':
            return <SuccessToast {...config} />;
          case 'error':
            return <ErrorToast {...config} />;
          default:
            return <SuccessToast {...config} />;
        }
      },
    });
  };

  return {
    showToast,
  };
};