import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { WEDDING_TEMPLATES } from '@/config/weddingTemplates';
import { CATEGORY_TEMPLATES } from '@/config/categoryTemplates';

export async function GET() {
  const dbTemplates = await prisma.template.findMany({ orderBy: { id: 'asc' } }).catch(() => []);
  const wedding = Object.values(WEDDING_TEMPLATES);
  const categories = Object.values(CATEGORY_TEMPLATES);

  if (dbTemplates.length === 0) {
    return NextResponse.json({ success: true, data: [...wedding, ...categories] });
  }

  return NextResponse.json({
    success: true,
    data: dbTemplates.map((t) => ({
      id: t.id,
      name: t.title,
      category: t.category.toLowerCase(),
      thumbnail: t.thumbnail,
      isPremium: t.isPremium,
      threeDModel: t.threeDModel,
    })),
  });
}
