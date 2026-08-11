import { createFileRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Navigate, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
});

function AuthLayout() {
  const status = useAuthStore((s) => s.status);

  if (status === 'loading') return null;
  if (status === 'authenticated') return <Navigate to="/app/dashboard" />;

  return <Outlet />;
}
