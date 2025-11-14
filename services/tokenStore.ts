// tokenStore.ts
// Wrapper simple para leer/escribir tokens de autenticación (access + refresh).
// - En iOS/Android usamos `expo-secure-store` (almacenamiento seguro, recomendado).
// - En web NO guardamos el `refreshToken` en localStorage: se asume que el
//   backend emitirá una cookie `HttpOnly` para el refresh token (más seguro).
// Nota de seguridad: el refresh token debe almacenarse en cookie `HttpOnly`
// (en web) y en SecureStore (en móvil). El cliente web debe usar
// `withCredentials: true` (axios) o `credentials: 'include'` (fetch) para enviar la cookie.
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Llaves usadas para guardar los tokens.
const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'auth_refresh';

// Interfaz simple para devolver ambos tokens.
export interface Tokens {
  token: string | null;
  refreshToken: string | null;
}

// Helper (no usado aquí pero útil si quieres comprobar la plataforma).
async function isWeb(): Promise<boolean> {
  return Platform.OS === 'web';
}

export async function setTokens(tokens: Tokens): Promise<void> {
  // Guarda el access token y (en móvil) el refresh token.
  // Web: no guardamos el refreshToken en localStorage — asumimos cookie HttpOnly.
  if (Platform.OS === 'web') {
    try {
      // Guardar o limpiar solo el access token en localStorage (si el backend lo devuelve).
      if (tokens.token == null) {
        localStorage.removeItem(TOKEN_KEY);
      } else {
        localStorage.setItem(TOKEN_KEY, tokens.token);
      }
      // NOTA: el refreshToken web debe venir como cookie HttpOnly desde el servidor.
    } catch (e) {
      // localStorage puede fallar (modo privado o bloqueado). Registramos pero no rompemos.
      // eslint-disable-next-line no-console
      console.error('tokenStore: localStorage not available', e);
    }
    return;
  }

  // Native (iOS/Android): usar SecureStore para mayor seguridad.
  if (tokens.token == null) {
    await SecureStore.deleteItemAsync(TOKEN_KEY); // borrar si viene null
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, tokens.token); // guardar token
  }

  if (tokens.refreshToken == null) {
    await SecureStore.deleteItemAsync(REFRESH_KEY); // borrar refresh
  } else {
    await SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken); // guardar refresh
  }
}

export async function getTokens(): Promise<Tokens> {
  // Lee ambos tokens según la plataforma y los devuelve.
  // Devuelve { token: null, refreshToken: null } si no hay tokens.
  if (Platform.OS === 'web') {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      // refreshToken no se guarda en web (cookie HttpOnly). Devolvemos null.
      return { token: token ?? null, refreshToken: null };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('tokenStore: failed to read localStorage', e);
      return { token: null, refreshToken: null };
    }
  }

  // Native: leer desde SecureStore
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
  return { token: token ?? null, refreshToken: refreshToken ?? null };
}

export async function clearTokens(): Promise<void> {
  // Borra ambos tokens de la plataforma correspondiente.
  if (Platform.OS === 'web') {
    try {
      // Borrar solo el access token. El refresh token en web es una cookie HttpOnly
      // que el servidor debe invalidar al hacer logout.
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('tokenStore: failed to clear localStorage', e);
    }
    return;
  }

  // Native: borrar SecureStore
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

export async function getToken(): Promise<string | null> {
  // Helper: obtener solo el access token (llama a getTokens internamente).
  const { token } = await getTokens();
  return token;
}

export async function getRefreshToken(): Promise<string | null> {
  // Helper: obtener solo el refresh token.
  // En web devolvemos null porque se espera que el refresh token sea una cookie HttpOnly.
  const { refreshToken } = await getTokens();
  return refreshToken;
}

export default {
  setTokens,
  getTokens,
  clearTokens,
  getToken,
  getRefreshToken,
};
