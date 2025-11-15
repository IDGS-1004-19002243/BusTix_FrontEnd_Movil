import { usePathname } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import { routeRoles } from '@/config/routeRoles';

export function useRouteAccess(pathname?: string) {
  const { isAuthenticated, isLoading, role } = useSession();
  const current = pathname ?? usePathname();

  // La consulta a `routeRoles` es una operación O(1) sobre un objeto estático.
  // No es necesario memorizar el resultado con `useMemo` a menos que la
  // generación del valor fuese costosa (lo cual no ocurre aquí).
  const allowedRoles = routeRoles[current] || [];
  const requiresRole = allowedRoles.length > 0;
  const hasRole = !!role && allowedRoles.includes(role);
  const allowed = !requiresRole ? true : (isAuthenticated && hasRole);

  return { allowed, isLoading, requiresRole, allowedRoles, role, isAuthenticated };
}
