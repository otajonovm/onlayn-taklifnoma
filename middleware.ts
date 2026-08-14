import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Edge-safe guard: PENDING invitations redirect to preview (no Prisma on edge). */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith('/v/')) {
    return NextResponse.next();
  }

  const id = path.replace('/v/', '').split('/')[0];
  if (!id) return NextResponse.next();

  try {
    const apiUrl = new URL(`/api/invitations/${encodeURIComponent(id)}`, request.url);
    apiUrl.searchParams.set('preview', '1');
    const res = await fetch(apiUrl.toString(), { headers: { Accept: 'application/json' } });
    if (!res.ok) return NextResponse.next();

    const payload = (await res.json()) as { success?: boolean; data?: { id: string; status: string } };
    if (payload.success && payload.data?.status === 'PENDING') {
      const url = request.nextUrl.clone();
      url.pathname = `/preview/${payload.data.id}`;
      return NextResponse.redirect(url);
    }
  } catch {
    /* API unavailable — page component will handle */
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/v/:path*'],
};
