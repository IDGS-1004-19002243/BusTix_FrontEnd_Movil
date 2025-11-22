export const routeRoles: Record<string, string[]> = {
  '/home': [],
  '/eventos': [],
  '/settings': ['Admin'],
  // Rutas para Staff
  '/staff/scan': ['Staff'],
  '/staff/manifiesto': ['Staff'],
  '/staff/incidencias': ['Staff'],
  '/staff/comienzo': ['Staff'],
  '/staff/viajes': ['Staff'],
  // Ruta específica de incidencia con id (si se accede directamente)
  '/staff/travel/[id]/incidencia': ['Staff'],
};
