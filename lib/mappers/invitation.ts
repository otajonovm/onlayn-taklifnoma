import type { Invitation, Rsvp, RsvpStatus as PrismaRsvpStatus } from '@prisma/client';
import type {
  AgendaItem,
  DressCodeConfig,
  InvitationDTO,
  RsvpDTO,
  RsvpStatus,
} from '@app-types/invitation';

type InvitationWithRsvps = Invitation & { rsvps?: Rsvp[] };

export function mapRsvpToDTO(r: Rsvp): RsvpDTO {
  return {
    id: r.id,
    invitationId: r.invitationId,
    guestName: r.guestName,
    role: r.role ?? undefined,
    status: r.status as RsvpStatus,
    plusOne: r.plusOne,
    wishes: r.wishes ?? undefined,
    createdAt: r.createdAt.toISOString(),
  };
}

export function mapInvitationToDTO(row: InvitationWithRsvps): InvitationDTO {
  return {
    id: row.id,
    templateId: row.templateId,
    status: row.status,
    telegramChatId: row.telegramChatId ?? undefined,
    telegramUserId: row.telegramUserId ?? undefined,
    hostName: row.hostName,
    brideName: row.brideName ?? undefined,
    groomName: row.groomName ?? undefined,
    eventTitle: row.eventTitle,
    eventType: row.eventType,
    eventDate: row.eventDate.toISOString(),
    eventShowTime: row.eventShowTime,
    venueName: row.venueName,
    locationAddress: row.locationAddress,
    qizBazmiTitle: row.qizBazmiTitle ?? undefined,
    qizBazmiDate: row.qizBazmiDate?.toISOString(),
    qizBazmiShowTime: row.qizBazmiShowTime ?? undefined,
    qizBazmiVenue: row.qizBazmiVenue ?? undefined,
    qizBazmiAddress: row.qizBazmiAddress ?? undefined,
    yandexUrl: row.yandexUrl ?? undefined,
    googleUrl: row.googleUrl ?? undefined,
    twoGisUrl: row.twoGisUrl ?? undefined,
    audioUrl: row.audioUrl ?? undefined,
    audioTitle: row.audioTitle ?? undefined,
    agenda: (row.agenda as unknown as AgendaItem[]) ?? [],
    dressCode: (row.dressCode as unknown as DressCodeConfig | null) ?? undefined,
    customStyles: (row.customStyles as unknown as Record<string, unknown> | null) ?? undefined,
    coverImage: row.coverImage ?? undefined,
    venueImage: row.venueImage ?? undefined,
    rsvps: row.rsvps?.map(mapRsvpToDTO),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toPrismaRsvpStatus(status: string): PrismaRsvpStatus {
  return status === 'DECLINED' ? 'DECLINED' : 'ATTENDING';
}
