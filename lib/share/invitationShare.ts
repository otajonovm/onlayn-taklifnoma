export type InvitationShareFields = {
  id: string;
  hostName?: string;
  brideName?: string;
  groomName?: string;
  eventTitle?: string;
  venueName?: string;
};

export function invitationPeopleLine(inv: InvitationShareFields): string {
  const couple = [inv.groomName, inv.brideName]
    .map((n) => n?.trim())
    .filter(Boolean)
    .join(' & ');
  return couple || inv.hostName?.trim() || 'Taklifnoma';
}

export function invitationShareTitle(inv: InvitationShareFields): string {
  return `${invitationPeopleLine(inv)} — Taklifnoma`;
}

export function invitationShareDescription(inv: InvitationShareFields): string {
  const event = inv.eventTitle?.trim() || 'Tadbir';
  const host = inv.hostName?.trim() || invitationPeopleLine(inv);
  const venue = inv.venueName?.trim();
  const where = venue ? ` Joy: ${venue}.` : '';
  return `${event}. ${host} tomonidan yuborilgan rasmiy onlayn taklifnoma.${where} Firibgarlik emas.`;
}

export function invitationShareMessage(params: {
  invitation: InvitationShareFields;
  openUrl: string;
}): string {
  const inv = params.invitation;
  const people = invitationPeopleLine(inv);
  const event = inv.eventTitle?.trim() || 'Tadbir';
  const lines = [
    '💌 TAKLIFNOMA',
    '',
    people,
    event,
    inv.hostName?.trim() && inv.hostName.trim() !== people ? `Mezbon: ${inv.hostName.trim()}` : '',
    '',
    'Hurmatli mehmon, sizni tadbirga taklif etamiz.',
    'Bu rasmiy onlayn taklifnoma.',
    '',
    'Ochish:',
    params.openUrl,
  ];
  return lines.filter((line, i, arr) => line !== '' || arr[i - 1] !== '').join('\n').trim();
}
