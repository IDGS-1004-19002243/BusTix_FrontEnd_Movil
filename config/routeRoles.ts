export const routeRoles: Record<string, string[]> = {
  '/home': [],
  '/eventos': ['User', ''],
  '/mis-boletos': ['User'],
  '/user-profile': ['User','Admin', 'Manager', 'Staff', 'Operator'],
  '/chat': ['User', ''],
  '/mis-viajes': ['Operator'],
};
