import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '@/context/AuthContext';

export function useRoleGuard(allowedRoles: string[]) {
  const { role } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
      router.replace('/404' as any);
    }
  }, [role, router, allowedRoles, mounted]);

  return role && (allowedRoles.length === 0 || allowedRoles.includes(role));
}