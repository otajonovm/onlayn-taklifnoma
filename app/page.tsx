'use client';

import { LandingPage } from '@/components/home/LandingPage';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <LandingPage
      onCreateClick={() => router.push('/builder')}
      onSelectSample={(id) => router.push(`/preview/${id}`)}
      onSelectTemplate={(templateId) =>
        router.push(`/builder?template=${encodeURIComponent(templateId)}`)
      }
      onAdminClick={() => router.push('/admin/dashboard')}
    />
  );
}
