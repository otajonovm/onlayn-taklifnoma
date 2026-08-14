'use client';

import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  return (
    <AdminDashboard
      onSelectInvitation={(id) => router.push(`/preview/${id}`)}
      onBackToHome={() => router.push('/')}
    />
  );
}
