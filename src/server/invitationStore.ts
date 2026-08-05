import fs from 'fs';
import os from 'os';
import path from 'path';
import type { Invitation } from '../types';

const PRIMARY_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), 'data');
const FALLBACK_DIR = path.join(os.tmpdir(), 'onlayn-taklifnoma');

let resolvedDir: string | null = null;
let resolveAttempted = false;

/**
 * Pick a writable data directory once. Managed platforms often mount the app
 * directory read-only, so fall back to the temp dir instead of losing writes.
 */
function dataDir(): string | null {
  if (resolveAttempted) return resolvedDir;
  resolveAttempted = true;

  for (const dir of [PRIMARY_DIR, FALLBACK_DIR]) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.accessSync(dir, fs.constants.W_OK);
      resolvedDir = dir;
      if (dir === FALLBACK_DIR) {
        console.warn(
          `[invitationStore] ${PRIMARY_DIR} yozib bo‘lmadi, vaqtinchalik papka ishlatilmoqda: ${dir}`
        );
      }
      return resolvedDir;
    } catch {
      // try next candidate
    }
  }

  console.warn('[invitationStore] yozib bo‘ladigan papka topilmadi — faqat xotirada ishlaydi');
  return null;
}

function dataFile(): string | null {
  const dir = dataDir();
  return dir ? path.join(dir, 'invitations.json') : null;
}

export function describePersistence(): string {
  const file = dataFile();
  return file ? `disk: ${file}` : 'memory only (read-only filesystem)';
}

export function loadInvitationsFromDisk(): Map<string, Invitation> {
  const file = dataFile();
  if (!file) return new Map();

  try {
    if (!fs.existsSync(file)) return new Map();
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, Invitation>;
    if (!parsed || typeof parsed !== 'object') return new Map();
    return new Map(Object.entries(parsed));
  } catch (err) {
    console.warn('[invitationStore] load failed:', err);
    return new Map();
  }
}

export function persistInvitationsToDisk(db: Map<string, Invitation>): void {
  const file = dataFile();
  if (!file) return;

  try {
    fs.writeFileSync(file, JSON.stringify(Object.fromEntries(db.entries()), null, 2), 'utf8');
  } catch (err) {
    console.warn('[invitationStore] save failed:', err);
  }
}
