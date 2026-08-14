import { Prisma } from '@prisma/client';
import { prisma } from '@lib/prisma';
import { mapInvitationToDTO } from '@lib/mappers/invitation';
import { normalizeInvitationId } from '@lib/telegram/notify';
import { WEDDING_TEMPLATES } from '@/config/weddingTemplates';
import type { CreateInvitationInput, InvitationDTO } from '@app-types/invitation';

function normalizeId(raw: string): string {
  return normalizeInvitationId(raw);
}

export async function findInvitationById(rawId: string) {
  const id = normalizeId(rawId);
  return prisma.invitation.findUnique({
    where: { id },
    include: { rsvps: { orderBy: { createdAt: 'desc' } } },
  });
}

export async function getInvitationDTO(rawId: string): Promise<InvitationDTO | null> {
  const row = await findInvitationById(rawId);
  return row ? mapInvitationToDTO(row) : null;
}

export async function listInvitations(): Promise<InvitationDTO[]> {
  const rows = await prisma.invitation.findMany({
    include: { rsvps: true },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(mapInvitationToDTO);
}

export async function createInvitation(body: CreateInvitationInput): Promise<InvitationDTO> {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const newId = `OT-${randomNum}`;
  const safeTemplateId = WEDDING_TEMPLATES[body.templateId] ? body.templateId : 'WD-101';
  const template = WEDDING_TEMPLATES[safeTemplateId];

  await prisma.template.upsert({
    where: { id: safeTemplateId },
    create: {
      id: safeTemplateId,
      title: template.name,
      category: 'WEDDING',
      thumbnail: template.content.hero.coverImage || '',
      defaultTheme: template.styles as unknown as Prisma.InputJsonValue,
      particleType: 'gold_dust',
      threeDModel: 'wedding_rings.glb',
    },
    update: {},
  });

  const eventDateIso =
    body.eventDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  let qizBazmiTitle: string | undefined;
  let qizBazmiDate: Date | undefined;
  let qizBazmiVenue: string | undefined;
  let qizBazmiAddress: string | undefined;
  let qizBazmiShowTime: boolean | undefined;

  if (safeTemplateId === 'WD-101') {
    qizBazmiTitle = body.qizBazmiTitle?.trim() || 'Qiz bazmi';
    if (body.qizBazmiDate?.trim()) {
      qizBazmiDate = new Date(body.qizBazmiDate);
    } else {
      const nikoh = new Date(eventDateIso);
      qizBazmiDate = new Date(nikoh.getTime() - 24 * 60 * 60 * 1000);
    }
    qizBazmiVenue = body.qizBazmiVenue || '';
    qizBazmiAddress = body.qizBazmiAddress || '';
    qizBazmiShowTime = body.qizBazmiShowTime ?? true;
  }

  const row = await prisma.invitation.create({
    data: {
      id: newId,
      templateId: safeTemplateId,
      status: 'PENDING',
      hostName: body.hostName || 'Mezbonlar',
      brideName: body.brideName || '',
      groomName: body.groomName || '',
      eventTitle: body.eventTitle || "Nikoh To'yi Marosimi",
      eventType: body.eventType || "Nikoh To'yi",
      eventDate: new Date(eventDateIso),
      eventShowTime: body.eventShowTime ?? true,
      venueName: body.venueName || 'Tantanalar Saroyi',
      locationAddress: body.locationAddress || 'Toshkent shahri',
      qizBazmiTitle,
      qizBazmiDate,
      qizBazmiShowTime,
      qizBazmiVenue,
      qizBazmiAddress,
      yandexUrl: body.yandexUrl || 'https://yandex.uz/maps',
      googleUrl: body.googleUrl || 'https://maps.google.com',
      twoGisUrl: body.twoGisUrl || '',
      audioUrl: body.audioUrl || template.media.audioUrl,
      audioTitle: body.audioTitle || template.media.audioTitle,
      telegramChatId: body.telegramChatId || '@onlayntaklifnomaadmin',
      telegramUserId: body.telegramUserId,
      agenda: (body.agenda || []) as unknown as Prisma.InputJsonValue,
      dressCode: body.dressCode as unknown as Prisma.InputJsonValue | undefined,
      customStyles: body.customStyles as unknown as Prisma.InputJsonValue | undefined,
      coverImage: body.coverImage,
      venueImage: body.venueImage,
    },
    include: { rsvps: true },
  });

  return mapInvitationToDTO(row);
}

export async function updateInvitation(
  rawId: string,
  body: Partial<CreateInvitationInput> & { templateId?: string },
  isAdmin: boolean
): Promise<{ ok: true; data: InvitationDTO } | { ok: false; status: number; message: string }> {
  const id = normalizeId(rawId);
  const existing = await findInvitationById(id);
  if (!existing) {
    return { ok: false, status: 404, message: 'Taklifnoma topilmadi' };
  }
  if (existing.status !== 'PENDING' && !isAdmin) {
    return {
      ok: false,
      status: 403,
      message: 'Faollashtirilgan taklifnomani faqat admin tahrirlashi mumkin',
    };
  }

  const safeTemplateId =
    body.templateId && WEDDING_TEMPLATES[body.templateId]
      ? body.templateId
      : existing.templateId;

  const row = await prisma.invitation.update({
    where: { id },
    data: {
      templateId: safeTemplateId,
      hostName: body.hostName ?? existing.hostName,
      brideName: body.brideName ?? existing.brideName,
      groomName: body.groomName ?? existing.groomName,
      eventTitle: body.eventTitle ?? existing.eventTitle,
      eventType: body.eventType ?? existing.eventType,
      eventDate: body.eventDate ? new Date(body.eventDate) : existing.eventDate,
      eventShowTime: body.eventShowTime ?? existing.eventShowTime,
      venueName: body.venueName ?? existing.venueName,
      locationAddress: body.locationAddress ?? existing.locationAddress,
      qizBazmiTitle:
        typeof body.qizBazmiTitle === 'string'
          ? body.qizBazmiTitle.trim() || 'Qiz bazmi'
          : existing.qizBazmiTitle,
      qizBazmiDate:
        typeof body.qizBazmiDate === 'string'
          ? body.qizBazmiDate.trim()
            ? new Date(body.qizBazmiDate)
            : null
          : existing.qizBazmiDate,
      qizBazmiShowTime: body.qizBazmiShowTime ?? existing.qizBazmiShowTime,
      qizBazmiVenue: body.qizBazmiVenue ?? existing.qizBazmiVenue,
      qizBazmiAddress: body.qizBazmiAddress ?? existing.qizBazmiAddress,
      yandexUrl: body.yandexUrl ?? existing.yandexUrl,
      googleUrl: body.googleUrl ?? existing.googleUrl,
      twoGisUrl: body.twoGisUrl ?? existing.twoGisUrl,
      audioUrl: body.audioUrl ?? existing.audioUrl,
      audioTitle: body.audioTitle ?? existing.audioTitle,
      telegramChatId: body.telegramChatId ?? existing.telegramChatId,
      telegramUserId: body.telegramUserId ?? existing.telegramUserId,
      agenda: (body.agenda ?? existing.agenda) as unknown as Prisma.InputJsonValue,
      dressCode: (body.dressCode ?? existing.dressCode) as unknown as Prisma.InputJsonValue | undefined,
      customStyles: (body.customStyles ?? existing.customStyles) as unknown as Prisma.InputJsonValue | undefined,
      coverImage: body.coverImage ?? existing.coverImage,
      venueImage: body.venueImage ?? existing.venueImage,
    },
    include: { rsvps: true },
  });

  return { ok: true, data: mapInvitationToDTO(row) };
}

export async function activateInvitation(rawId: string) {
  const invitation = await findInvitationById(rawId);
  if (!invitation) {
    return { ok: false as const, status: 404, message: 'Taklifnoma topilmadi' };
  }

  const row = await prisma.invitation.update({
    where: { id: invitation.id },
    data: { status: 'ACTIVE' },
    include: { rsvps: true },
  });

  return { ok: true as const, invitation: mapInvitationToDTO(row) };
}

export async function linkTelegramChat(rawId: string, chatId: string) {
  const invitation = await findInvitationById(rawId);
  if (!invitation) return null;
  const row = await prisma.invitation.update({
    where: { id: invitation.id },
    data: { telegramChatId: chatId },
    include: { rsvps: true },
  });
  return mapInvitationToDTO(row);
}

export async function getAdminStats() {
  const items = await prisma.invitation.findMany({ include: { rsvps: true } });
  const pending = items.filter((i) => i.status === 'PENDING').length;
  const active = items.filter((i) => i.status === 'ACTIVE').length;
  const totalRsvps = items.reduce((acc, i) => acc + i.rsvps.length, 0);
  const telegramLinked = items.filter((i) => /^-?\d+$/.test(i.telegramChatId || '')).length;
  return { totalInvitations: items.length, pendingInvitations: pending, activeInvitations: active, totalRsvps, telegramLinked };
}
