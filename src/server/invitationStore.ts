import fs from 'fs';
import path from 'path';
import type { Invitation } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'invitations.json');

function canPersistToDisk(): boolean {
  // Vercel serverless filesystem is ephemeral / often read-only outside /tmp
  if (process.env.VERCEL) return false;
  return true;
}

export function loadInvitationsFromDisk(): Map<string, Invitation> {
  if (!canPersistToDisk()) return new Map();
  try {
    if (!fs.existsSync(DATA_FILE)) return new Map();
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, Invitation>;
    if (!parsed || typeof parsed !== 'object') return new Map();
    return new Map(Object.entries(parsed));
  } catch (err) {
    console.warn('[invitationStore] load failed:', err);
    return new Map();
  }
}

export function persistInvitationsToDisk(db: Map<string, Invitation>): void {
  if (!canPersistToDisk()) return;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const payload = Object.fromEntries(db.entries());
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf8');
  } catch (err) {
    console.warn('[invitationStore] save failed:', err);
  }
}
