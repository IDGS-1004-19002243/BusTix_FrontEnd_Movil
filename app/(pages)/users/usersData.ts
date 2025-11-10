export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const initialUsers: User[] = [
  {
    id: '1',
    name: 'Alexis Duran',
    email: 'duranalexis209@gmail.com',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'Usuario',
  },
  {
    id: '3',
    name: 'María García',
    email: 'maria.garcia@example.com',
    role: 'Staff',
  },
  {
    id: '4',
    name: 'Carlos López',
    email: 'carlos.lopez@example.com',
    role: 'Usuario',
  },
];