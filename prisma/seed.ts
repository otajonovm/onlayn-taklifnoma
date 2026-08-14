import { config } from 'dotenv';
import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { WEDDING_TEMPLATES } from '../src/config/weddingTemplates';
import { CATEGORY_TEMPLATES } from '../src/config/categoryTemplates';

config({ path: '.env.local' });
config({ path: '.env' });

const prisma = new PrismaClient();

const CATEGORY_MAP = {
  wedding: 'WEDDING',
  kids_sunnat: 'KIDS_SUNNAT',
  education: 'EDUCATION',
  corporate: 'CORPORATE',
} as const;

async function main() {
  for (const [id, tpl] of Object.entries(WEDDING_TEMPLATES)) {
    await prisma.template.upsert({
      where: { id },
      create: {
        id,
        title: tpl.name,
        category: 'WEDDING',
        thumbnail: tpl.content.hero.coverImage || '',
        isPremium: false,
        defaultTheme: tpl.styles as unknown as Prisma.InputJsonValue,
        particleType: 'gold_dust',
        threeDModel: 'wedding_rings.glb',
      },
      update: {
        title: tpl.name,
        defaultTheme: tpl.styles as unknown as Prisma.InputJsonValue,
      },
    });
  }

  for (const tpl of Object.values(CATEGORY_TEMPLATES)) {
    const category = CATEGORY_MAP[tpl.category];
    await prisma.template.upsert({
      where: { id: tpl.id },
      create: {
        id: tpl.id,
        title: tpl.name,
        category,
        thumbnail: tpl.thumbnail,
        isPremium: tpl.isPremium,
        defaultTheme: { accent: '#0F5132', gold: '#D4AF37' },
        particleType: tpl.particleType,
        threeDModel: tpl.threeDModel,
      },
      update: {
        title: tpl.name,
        category,
        thumbnail: tpl.thumbnail,
      },
    });
  }

  const jsonPath = path.join(process.cwd(), 'data', 'invitations.json');
  if (fs.existsSync(jsonPath)) {
    const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as Record<string, Record<string, unknown>>;
    for (const [id, inv] of Object.entries(raw)) {
      const templateId = (inv.templateId as string) || 'WD-101';
      await prisma.template.upsert({
        where: { id: templateId },
        create: {
          id: templateId,
          title: WEDDING_TEMPLATES[templateId]?.name || templateId,
          category: 'WEDDING',
          thumbnail: '',
          defaultTheme: {},
        },
        update: {},
      });

      const rsvps = (inv.rsvps as Array<Record<string, unknown>>) || [];
      await prisma.invitation.upsert({
        where: { id },
        create: {
          id,
          templateId,
          status: (inv.status as 'PENDING' | 'ACTIVE') || 'PENDING',
          telegramChatId: (inv.telegramChatId as string) || null,
          hostName: (inv.hostName as string) || 'Mezbon',
          brideName: (inv.brideName as string) || null,
          groomName: (inv.groomName as string) || null,
          eventTitle: (inv.eventTitle as string) || "Nikoh To'yi",
          eventType: (inv.eventType as string) || "Nikoh To'yi",
          eventDate: new Date((inv.eventDate as string) || Date.now()),
          eventShowTime: inv.eventShowTime !== false,
          venueName: (inv.venueName as string) || '',
          locationAddress: (inv.locationAddress as string) || '',
          qizBazmiTitle: (inv.qizBazmiTitle as string) || null,
          qizBazmiDate: inv.qizBazmiDate ? new Date(inv.qizBazmiDate as string) : null,
          qizBazmiShowTime: (inv.qizBazmiShowTime as boolean) ?? null,
          qizBazmiVenue: (inv.qizBazmiVenue as string) || null,
          qizBazmiAddress: (inv.qizBazmiAddress as string) || null,
          yandexUrl: (inv.yandexUrl as string) || null,
          googleUrl: (inv.googleUrl as string) || null,
          twoGisUrl: (inv.twoGisUrl as string) || null,
          audioUrl: (inv.audioUrl as string) || null,
          audioTitle: (inv.audioTitle as string) || null,
          agenda: (inv.agenda || []) as Prisma.InputJsonValue,
          dressCode: (inv.dressCode as Prisma.InputJsonValue) || null,
          customStyles: (inv.customStyles as Prisma.InputJsonValue) || null,
          coverImage: (inv.coverImage as string) || null,
          venueImage: (inv.venueImage as string) || null,
          createdAt: new Date((inv.createdAt as string) || Date.now()),
          updatedAt: new Date((inv.updatedAt as string) || Date.now()),
        },
        update: {},
      });

      for (const r of rsvps) {
        const rid = (r.id as string) || `r-${Date.now()}-${Math.random()}`;
        await prisma.rsvp.upsert({
          where: { id: rid },
          create: {
            id: rid,
            invitationId: id,
            guestName: (r.guestName as string) || 'Mehmon',
            role: (r.role as string) || null,
            status: (r.status as 'ATTENDING' | 'DECLINED') || 'ATTENDING',
            plusOne: Number(r.plusOne) || 0,
            wishes: (r.wishes as string) || null,
            createdAt: new Date((r.createdAt as string) || Date.now()),
          },
          update: {},
        });
      }
    }
    console.log(`Imported invitations from ${jsonPath}`);
  } else {
    console.log('No data/invitations.json — templates only seeded');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
