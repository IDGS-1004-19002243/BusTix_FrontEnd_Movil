import { setTokens, clearTokens } from './tokenStore';

// Mock users for testing
const mockUsers = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin', token: 'token-admin@example.com' },
  { email: 'manager@example.com', password: 'manager123', role: 'manager', token: 'token-manager@example.com' },
  { email: 'user@example.com', password: 'user123', role: 'user', token: 'token-user@example.com' },
];

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    email: string;
    role: string;
  };
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay

  let user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) {
    // For signup, add new user
    user = { email, password, role: 'user', token: `token-${email}` };
    mockUsers.push(user);
  }

  const response: LoginResponse = {
    token: user.token,
    refreshToken: `refresh-${user.token}`,
    user: {
      email: user.email,
      role: user.role,
    },
  };

  // Save tokens to storage
  await setTokens({ token: response.token, refreshToken: response.refreshToken });

  return response;
}

export async function apiLogout(): Promise<void> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Clear tokens from storage
  await clearTokens();
}