'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { actions } = useAuthStore();

  useEffect(() => {
    actions.initialize();
  }, []);

  return <>{children}</>;
}
