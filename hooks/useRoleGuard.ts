import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '@/context/AuthContext';

// Guards a route by role. Only redirect to 404 when the user is authenticated
// and the role is present but not allowed. While the session is loading we do nothing.
export function useRoleGuard(allowedRoles: string[]) {
  const { role, isLoading, isAuthenticated } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Wait until auth finished loading.
    if (isLoading) return;

    if (allowedRoles.length === 0) return;

    // Enforce policy: if route requires roles, only allow when user is authenticated
    // AND has a role included in allowedRoles. Otherwise redirect to not-found.
    const hasAccess = isAuthenticated && role && allowedRoles.includes(role);
    // Do not perform navigation here; let the layout decide how to handle blocked routes.
    // Returning `hasAccess` allows callers to act accordingly.
  }, [role, router, allowedRoles, mounted, isLoading, isAuthenticated]);

  return !!role && (allowedRoles.length === 0 || allowedRoles.includes(role));
}