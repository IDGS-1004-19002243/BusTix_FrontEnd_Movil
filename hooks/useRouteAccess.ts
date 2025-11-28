import { usePathname } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import { routeRoles } from '@/config/routeRoles';

/**
 * Hook personalizado para verificar el acceso a rutas basado en roles de usuario.
 *
 * Este hook centraliza la lógica de autorización de rutas, leyendo la configuración
 * desde routeRoles.ts y verificando si el usuario actual tiene permisos para acceder
 * a la ruta especificada.
 *
 * @param pathname - Ruta opcional a verificar. Si no se proporciona, usa la ruta actual.
 * @returns Objeto con información de acceso y estado de autenticación
 */
export function useRouteAccess(pathname?: string) {
  // Obtener estado de autenticación y usuario desde el contexto
  const { isAuthenticated, isLoading, user } = useSession();
  const role = user?.roles?.[0] || null;

  // Determinar la ruta actual (parámetro opcional o ruta del router)
  const current = pathname ?? usePathname();

  // Obtener los roles permitidos para esta ruta desde la configuración
  // Si no hay configuración, devuelve array vacío (sin restricciones)
  const allowedRoles = routeRoles[current] || [];

  // Verificar si esta ruta requiere algún rol específico
  const requiresRole = allowedRoles.length > 0;

  // Verificar si el usuario tiene un rol válido
  // - 'role' es el primer rol del usuario (ej. 'admin', 'user')
  // - El if (role) verifica si el rol existe y no es falsy (no null, undefined o vacío)
  // - Luego verificamos si ese rol está en la lista de roles permitidos para la ruta
  // - Asignamos true solo si ambas condiciones se cumplen
  let hasRole = false;
  if (role) {
    hasRole = allowedRoles.includes(role);
  }

  //  Determinar si el acceso está permitido
  // - Si la ruta NO requiere roles específicos (requiresRole = false), entonces:
  //   - Permitir acceso a todos (público o semi-público).
  // - Si la ruta SÍ requiere roles (requiresRole = true), entonces:
  //   - El usuario debe estar autenticado (isAuthenticated = true) Y tener un rol permitido (hasRole = true),
  //     O la ruta permite acceso a no autenticados si incluye '' en allowedRoles.
  let allowed: boolean;

  if (!requiresRole) { // No requires roles
    //:acceso permitido para todos
    allowed = true;
  } else {
    //:acceso restringido a usuarios autenticados con rol correcto, o a no autenticados si '' está incluido
    allowed = (isAuthenticated && hasRole) || allowedRoles.includes('');
  }

  // Retornar objeto con toda la información necesaria para el componente que usa el hook
  return {
    allowed,           // Boolean: ¿Puede acceder el usuario?
    requiresRole,      // Boolean: ¿Esta ruta requiere roles específicos?
  };
}
