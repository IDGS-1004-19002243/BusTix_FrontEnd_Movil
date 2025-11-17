import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  estatus: string;
  emailVerified: string;
  aud: string;
  iss: string;
  jti: string;
  iat: string;
  exp: number;
  // El backend puede enviar role/permission como string o array
  role?: string;
  roles?: string[];
  permission?: string;
  permissions?: string[];
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Verificar si el token ha expirado
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('Token has expired');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  return expiration.getTime() < Date.now();
}