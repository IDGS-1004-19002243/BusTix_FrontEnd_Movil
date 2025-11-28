import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { apiGetCountNoLeidas } from '@/services/notificaciones/notificaciones.service';

interface UseNotificationsPollingOptions {
  interval?: number; // Intervalo en milisegundos (default: 30000 = 30 segundos)
  enabled?: boolean; // Habilitar/deshabilitar polling (default: true)
  onUnreadCountChange?: (count: number) => void; // Callback cuando cambia el contador
}

export const useNotificationsPolling = ({
  interval = 30000,
  enabled = true,
  onUnreadCountChange
}: UseNotificationsPollingOptions = {}) => {
  const intervalRef = useRef<number | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await apiGetCountNoLeidas();
      if (response.success && onUnreadCountChange) {
        onUnreadCountChange(response.count);
      }
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  }, [onUnreadCountChange]);

  const startPolling = useCallback(() => {
    if (!enabled) return;

    // Hacer una petición inmediata
    fetchUnreadCount();

    // Configurar polling periódico
    intervalRef.current = setInterval(fetchUnreadCount, interval);
  }, [enabled, fetchUnreadCount, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    const previousAppState = appStateRef.current;
    appStateRef.current = nextAppState;

    if (previousAppState === 'background' && nextAppState === 'active') {
      // App vuelve a foreground - iniciar polling
      startPolling();
    } else if (nextAppState === 'background') {
      // App va a background - detener polling
      stopPolling();
    }
  }, [startPolling, stopPolling]);

  useEffect(() => {
    // Suscribirse a cambios de AppState
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Iniciar polling si la app está activa
    if (AppState.currentState === 'active') {
      startPolling();
    }

    // Cleanup
    return () => {
      subscription.remove();
      stopPolling();
    };
  }, [handleAppStateChange, startPolling, stopPolling]);

  // Efecto para manejar cambios en enabled
  useEffect(() => {
    if (enabled && AppState.currentState === 'active') {
      startPolling();
    } else {
      stopPolling();
    }
  }, [enabled, startPolling, stopPolling]);

  // Función para forzar una actualización manual
  const refreshNow = useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    refreshNow,
    isPolling: intervalRef.current !== null
  };
};