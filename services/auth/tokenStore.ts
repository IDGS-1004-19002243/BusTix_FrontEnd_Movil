// tokenStore.ts
// Wrapper simple para leer/escribir tokens de autenticación (access + refresh).
// - En iOS/Android usamos `expo-secure-store` (almacenamiento seguro, recomendado).
// - En web guardamos ambos tokens en localStorage, ya que el backend no usa cookies HttpOnly.
// Nota de seguridad: idealmente, el refresh token debería almacenarse en cookie `HttpOnly`
// (en web) y en SecureStore (en móvil). Dado que el backend no usa cookies, se guarda en localStorage,
// pero esto es menos seguro. El cliente debe manejar la renovación de tokens cuidadosamente.
import { setStorageItemAsync, getStorageItemAsync } from '@/hooks/useStorageState';

// Llaves usadas para guardar los tokens.
const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'auth_refresh';

// Interfaz simple para devolver ambos tokens.
export interface Tokens {
  token: string | null;
  refreshToken: string | null;
}

export async function setTokens(tokens: Tokens): Promise<void> {
  console.log('TokenStore: Setting tokens - Access:', tokens.token ? 'Present' : 'Null', 'Refresh:', tokens.refreshToken ? 'Present' : 'Null');
  // Guarda el access token y el refresh token usando setStorageItemAsync.
  await setStorageItemAsync(TOKEN_KEY, tokens.token);
  await setStorageItemAsync(REFRESH_KEY, tokens.refreshToken);
  console.log('TokenStore: Tokens saved successfully');
}

export async function getTokens(): Promise<Tokens> {
  // Lee ambos tokens usando getStorageItemAsync.
  // Devuelve { token: null, refreshToken: null } si no hay tokens.
  const token = await getStorageItemAsync(TOKEN_KEY);
  const refreshToken = await getStorageItemAsync(REFRESH_KEY);
  console.log('TokenStore: Retrieved tokens - Access:', token ? 'Present' : 'Null', 'Refresh:', refreshToken ? 'Present' : 'Null');
  return { token: token ?? null, refreshToken: refreshToken ?? null };
}

export async function clearTokens(): Promise<void> {
  await setStorageItemAsync(TOKEN_KEY, null);
  await setStorageItemAsync(REFRESH_KEY, null);
}

export async function getToken(): Promise<string | null> {
  // Helper: obtener solo el access token (llama a getTokens internamente).
  const { token } = await getTokens();
  return token;
}

export async function getRefreshToken(): Promise<string | null> {
  // Helper: obtener solo el refresh token.
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
