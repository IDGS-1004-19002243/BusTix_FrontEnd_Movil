import jwtDecode from 'jwt-decode';

// Compatibilidad con distintas variantes de empaquetado de `jwt-decode`.
// En algunos entornos la importación puede venir como { default: fn } o como fn directamente.
const _jwtDecodeCandidate: any = (jwtDecode as any)?.default ?? jwtDecode;

function safeJwtDecode<T = any>(token: string): T {
  // Si la dependencia funciona como función, la usamos
  if (typeof _jwtDecodeCandidate === 'function') {
    return _jwtDecodeCandidate(token) as T;
  }

  // Fallback manual: decodificar el payload del JWT (base64url -> JSON)
  const parts = token.split('.');
  if (parts.length < 2) throw new Error('Invalid JWT token');
  const payload = parts[1];
  // base64url -> base64
  const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '='
  const pad = b64.length % 4;
  const padded = pad ? b64 + '='.repeat(4 - pad) : b64;

  let json = '';
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    json = Buffer.from(padded, 'base64').toString('utf8');
  } else if (typeof atob === 'function') {
    // atob may produce binary string; decode percent-encoding to UTF-8
    const binary = atob(padded);
    json = decodeURIComponent(Array.prototype.map.call(binary, (c: string) => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  } else {
    throw new Error('No base64 decoder available in this environment');
  }

  return JSON.parse(json) as T;
}

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
    const decoded = safeJwtDecode<DecodedToken>(token);

    // Verificar si la estructura mínima existe
    if (!decoded || typeof decoded !== 'object' || !('exp' in decoded)) {
      return null;
    }

    // Verificar si el token ha expirado
    const currentTime = Date.now() / 1000;
    if (typeof decoded.exp === 'number' && decoded.exp < currentTime) {
      console.warn('Token has expired');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = safeJwtDecode<{ exp: number }>(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  return expiration.getTime() < Date.now();
}