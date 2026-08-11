import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { status } = useAuthStore.getState();
    throw redirect({ to: status === 'authenticated' ? '/app/dashboard' : '/login' });
  },
});
