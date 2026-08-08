import React, { useState, useEffect } from 'react';
import { Invitation } from '../../types';
import { AdminLogin } from './AdminLogin';
import {
  adminAuthHeaders,
  botStartUrl,
  clearAdminToken,
  getAdminToken,
  guestShareUrl,
  isTelegramLinked,
  setAdminToken,
} from '../../lib/adminAuth';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle,
  Clock,
  Users,
  Send,
  ExternalLink,
  RefreshCw,
  Copy,
  Search,
  LogOut,
  Zap,
  Link2,
  Link2Off,
  Pencil,
} from 'lucide-react';
import { AdminInvitationEditor } from './AdminInvitationEditor';

const ADMIN_UI = {
  emerald: '#0F5132',
  gold: '#D4AF37',
  cream: '#FDFBF7',
  ivory: '#FAFAFA',
  charcoal: '#1A1A1A',
  muted: '#64748B',
  border: 'rgba(212, 175, 55, 0.35)',
} as const;

interface AdminDashboardProps {
  onSelectInvitation: (id: string) => void;
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectInvitation,
  onBackToHome,
}) => {
  const [token, setToken] = useState<string | null>(() => getAdminToken());
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState({
    totalInvitations: 0,
    pendingInvitations: 0,
    activeInvitations: 0,
    totalRsvps: 0,
    telegramLinked: 0,
  });
  const [botUsername, setBotUsername] = useState('OnlaynTaklifnomaBot');
  const [telegramConfigured, setTelegramConfigured] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE'>('ALL');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [commandInput, setCommandInput] = useState('/activate OT-84920');
  const [commandResult, setCommandResult] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingInvitation, setEditingInvitation] = useState<Invitation | null>(null);

  const fetchData = async () => {
    if (!getAdminToken()) return;
    setIsLoading(true);
    try {
      const headers = adminAuthHeaders();
      const [invRes, statsRes] = await Promise.all([
        fetch('/api/invitations', { headers }),
        fetch('/api/admin/stats', { headers }),
      ]);

      if (invRes.status === 401 || statsRes.status === 401) {
        clearAdminToken();
        setToken(null);
        return;
      }

      const invData = await invRes.json();
      const statsData = await statsRes.json();
      if (invData.success) setInvitations(invData.data);
      if (statsData.success) {
        setStats({
          totalInvitations: statsData.stats.totalInvitations ?? 0,
          pendingInvitations: statsData.stats.pendingInvitations ?? 0,
          activeInvitations: statsData.stats.activeInvitations ?? 0,
          totalRsvps: statsData.stats.totalRsvps ?? 0,
          telegramLinked: statsData.stats.telegramLinked ?? 0,
        });
        if (typeof statsData.botUsername === 'string') {
          setBotUsername(statsData.botUsername);
        }
        setTelegramConfigured(Boolean(statsData.telegramConfigured));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/me', { headers: adminAuthHeaders() })
      .then(async (res) => {
        if (!res.ok) {
          clearAdminToken();
          setToken(null);
          return;
        }
        const me = await res.json();
        if (typeof me.botUsername === 'string') setBotUsername(me.botUsername);
        setTelegramConfigured(Boolean(me.telegramConfigured));
        fetchData();
      })
      .catch(() => {
        clearAdminToken();
        setToken(null);
      });
  }, [token]);

  const handleLoginSuccess = (newToken: string) => {
    setAdminToken(newToken);
    setToken(newToken);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: adminAuthHeaders(),
      });
    } catch {
      /* ignore */
    }
    clearAdminToken();
    setToken(null);
  };

  const handleActivate = async (id: string) => {
    setActivatingId(id);
    try {
      const res = await fetch('/api/admin/activate', {
        method: 'POST',
        headers: {
          ...adminAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invitationId: id }),
      });
      const data = await res.json();
      if (res.status === 401) {
        clearAdminToken();
        setToken(null);
        return;
      }
      if (data.success) {
        const tgNote =
          data.telegram?.ok
            ? 'Telegram admin xabari yuborildi.'
            : data.telegram?.skipped
              ? `Telegram: ${data.telegram.reason || 'o‘tkazib yuborildi'}`
              : `Telegram: ${data.telegram?.description || data.telegram?.reason || 'xato'}`;
        setCommandResult(
          `✅ #${id} faollashtirildi.\n` +
            `Mehmon: ${guestShareUrl(id)}\n` +
            `Bot: ${data.botLink || botStartUrl(id, botUsername)}\n` +
            tgNote
        );
        fetchData();
      } else {
        setCommandResult(`❌ ${data.message || 'Faollashtirish muvaffaqiyatsiz'}`);
      }
    } catch (err) {
      console.error(err);
      setCommandResult('❌ Tarmoq xatosi');
    } finally {
      setActivatingId(null);
    }
  };

  const handleRunBotCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const parts = commandInput.trim().split(/\s+/);
    if (parts[0].toLowerCase() === '/activate' && parts[1]) {
      await handleActivate(parts[1].replace('#', '').toUpperCase());
    } else {
      setCommandResult('❌ Buyruq xato. Misol: /activate OT-84920');
    }
  };

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCommandResult('❌ Nusxa olish muvaffaqiyatsiz');
    }
  };

  if (!token) {
    return <AdminLogin onSuccess={handleLoginSuccess} onBackToHome={onBackToHome} />;
  }

  const filtered = invitations
    .filter((inv) => {
      const matchesFilter =
        filter === 'ALL'
          ? true
          : filter === 'PENDING'
            ? inv.status === 'PENDING'
            : inv.status === 'ACTIVE';
      const q = search.toLowerCase();
      const matchesSearch =
        inv.id.toLowerCase().includes(q) ||
        inv.hostName.toLowerCase().includes(q) ||
        inv.eventTitle.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div
      className="min-h-screen p-4 sm:p-8"
      style={{
        backgroundColor: ADMIN_UI.cream,
        color: ADMIN_UI.charcoal,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#D4AF37]/10 blur-[100px]" />
        <div className="absolute bottom-0 -left-10 w-80 h-80 rounded-full bg-[#0F5132]/10 blur-[110px]" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-8">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6"
          style={{ borderColor: ADMIN_UI.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: ADMIN_UI.ivory,
                borderColor: ADMIN_UI.border,
                color: ADMIN_UI.gold,
              }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div
                className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em]"
                style={{ color: ADMIN_UI.gold }}
              >
                <Sparkles className="w-3 h-3" />
                <span>/admin/dashboard</span>
              </div>
              <h1
                className="text-2xl sm:text-3xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Admin Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border"
              style={{
                borderColor: telegramConfigured ? `${ADMIN_UI.emerald}55` : ADMIN_UI.border,
                color: telegramConfigured ? ADMIN_UI.emerald : ADMIN_UI.muted,
                backgroundColor: ADMIN_UI.ivory,
              }}
            >
              {telegramConfigured ? 'Telegram ulangan' : 'Telegram sozlanmagan'}
            </span>
            <button
              type="button"
              onClick={fetchData}
              className="p-2.5 rounded-xl border cursor-pointer"
              style={{
                borderColor: ADMIN_UI.border,
                backgroundColor: ADMIN_UI.ivory,
                color: ADMIN_UI.gold,
              }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              style={{
                borderColor: ADMIN_UI.border,
                color: ADMIN_UI.muted,
                backgroundColor: ADMIN_UI.ivory,
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Chiqish
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="px-4 py-2.5 rounded-xl font-medium text-xs uppercase tracking-wider cursor-pointer"
              style={{ backgroundColor: ADMIN_UI.emerald, color: ADMIN_UI.ivory }}
            >
              Bosh Sahifa
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Jami taklifnomalar', value: stats.totalInvitations, icon: null },
            { label: 'Kutilmoqda', value: stats.pendingInvitations, icon: Clock },
            { label: 'Faol', value: stats.activeInvitations, icon: CheckCircle },
            { label: 'Telegram ulangan', value: stats.telegramLinked, icon: Users },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-2xl border space-y-1"
              style={{
                borderColor: ADMIN_UI.border,
                backgroundColor: 'rgba(255,255,255,0.82)',
                boxShadow: '0 12px 28px rgba(26,26,26,0.04)',
              }}
            >
              <span
                className="text-[10px] uppercase tracking-wider flex items-center gap-1"
                style={{ color: ADMIN_UI.muted }}
              >
                {s.icon && <s.icon className="w-3.5 h-3.5" style={{ color: ADMIN_UI.gold }} />}
                {s.label}
              </span>
              <span
                className="block text-2xl sm:text-3xl"
                style={{ fontFamily: "'Playfair Display', serif", color: ADMIN_UI.charcoal }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Command box */}
        <div
          className="p-5 rounded-2xl border space-y-3"
          style={{
            borderColor: ADMIN_UI.border,
            backgroundColor: 'rgba(255,255,255,0.85)',
          }}
        >
          <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: ADMIN_UI.charcoal }}>
            <Send className="w-4 h-4" style={{ color: ADMIN_UI.gold }} />
            Tezkor aktivlash (`/activate OT-XXXXX`)
          </h3>
          <form onSubmit={handleRunBotCommand} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none"
              style={{
                borderColor: ADMIN_UI.border,
                color: ADMIN_UI.charcoal,
                backgroundColor: ADMIN_UI.cream,
              }}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-medium text-xs uppercase tracking-wider cursor-pointer"
              style={{ backgroundColor: ADMIN_UI.gold, color: ADMIN_UI.charcoal }}
            >
              Bajarish
            </button>
          </form>
          {commandResult && (
            <pre
              className="p-3 rounded-xl border text-xs font-mono whitespace-pre-wrap break-all"
              style={{
                borderColor: ADMIN_UI.border,
                backgroundColor: ADMIN_UI.cream,
                color: ADMIN_UI.muted,
              }}
            >
              {commandResult}
            </pre>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div
            className="flex items-center gap-1 p-1 rounded-xl border"
            style={{ borderColor: ADMIN_UI.border, backgroundColor: ADMIN_UI.ivory }}
          >
            {(['ALL', 'PENDING', 'ACTIVE'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
                style={{
                  backgroundColor: filter === f ? ADMIN_UI.emerald : 'transparent',
                  color: filter === f ? ADMIN_UI.ivory : ADMIN_UI.muted,
                }}
              >
                {f === 'ALL' ? 'Barchasi' : f === 'PENDING' ? 'PENDING' : 'ACTIVE'}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: ADMIN_UI.muted }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ID, mezbon yoki tadbir..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs focus:outline-none"
              style={{
                borderColor: ADMIN_UI.border,
                color: ADMIN_UI.charcoal,
                backgroundColor: ADMIN_UI.ivory,
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: ADMIN_UI.border,
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 16px 40px rgba(26,26,26,0.05)',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-215 text-left text-sm">
              <thead>
                <tr
                  className="text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: ADMIN_UI.muted, borderBottom: `1px solid ${ADMIN_UI.border}` }}
                >
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Mezbon</th>
                  <th className="px-4 py-3 font-medium">Tadbir</th>
                  <th className="px-4 py-3 font-medium">Holat</th>
                  <th className="px-4 py-3 font-medium">Telegram</th>
                  <th className="px-4 py-3 font-medium">Yaratilgan</th>
                  <th className="px-4 py-3 font-medium text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center" style={{ color: ADMIN_UI.muted }}>
                      Taklifnomalar topilmadi.
                    </td>
                  </tr>
                ) : (
                  filtered.map((inv) => {
                    const linked = isTelegramLinked(inv.telegramChatId);
                    const botLink = botStartUrl(inv.id, botUsername);
                    return (
                      <tr
                        key={inv.id}
                        style={{ borderTop: `1px solid ${ADMIN_UI.border}` }}
                      >
                        <td className="px-4 py-3.5 font-mono text-xs font-medium" style={{ color: ADMIN_UI.gold }}>
                          #{inv.id}
                        </td>
                        <td className="px-4 py-3.5">{inv.hostName}</td>
                        <td className="px-4 py-3.5 max-w-45">
                          <span className="line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {inv.eventTitle}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                            style={{
                              backgroundColor:
                                inv.status === 'ACTIVE' ? `${ADMIN_UI.emerald}18` : `${ADMIN_UI.gold}18`,
                              color: inv.status === 'ACTIVE' ? ADMIN_UI.emerald : ADMIN_UI.gold,
                              border: `1px solid ${inv.status === 'ACTIVE' ? `${ADMIN_UI.emerald}40` : ADMIN_UI.border}`,
                            }}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="inline-flex items-center gap-1 text-[11px]"
                            style={{ color: linked ? ADMIN_UI.emerald : ADMIN_UI.muted }}
                          >
                            {linked ? (
                              <>
                                <Link2 className="w-3.5 h-3.5" /> Ulangan
                              </>
                            ) : (
                              <>
                                <Link2Off className="w-3.5 h-3.5" /> Ulanmagan
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs" style={{ color: ADMIN_UI.muted }}>
                          {new Date(inv.createdAt).toLocaleDateString('uz-UZ')}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setEditingInvitation(inv)}
                              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                              style={{ borderColor: `${ADMIN_UI.emerald}55`, color: ADMIN_UI.emerald }}
                              title="Tahrirlash"
                            >
                              <Pencil className="w-3 h-3" />
                              Tahrirlash
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectInvitation(inv.id)}
                              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                              style={{ borderColor: ADMIN_UI.border, color: ADMIN_UI.charcoal }}
                              title="Preview"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Ko‘rish
                            </button>
                            <button
                              type="button"
                              onClick={() => copyText(`bot-${inv.id}`, botLink)}
                              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                              style={{ borderColor: ADMIN_UI.border, color: ADMIN_UI.gold }}
                              title="Bot ulanish havolasini nusxalash"
                            >
                              <Copy className="w-3 h-3" />
                              {copiedKey === `bot-${inv.id}` ? 'Nusxa' : 'Bot link'}
                            </button>
                            {inv.status === 'PENDING' ? (
                              <button
                                type="button"
                                disabled={activatingId === inv.id}
                                onClick={() => handleActivate(inv.id)}
                                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-60"
                                style={{
                                  backgroundColor: ADMIN_UI.emerald,
                                  color: ADMIN_UI.ivory,
                                }}
                              >
                                <Zap className="w-3 h-3" />
                                {activatingId === inv.id ? '…' : '1-Click Activate'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => copyText(`guest-${inv.id}`, guestShareUrl(inv.id))}
                                className="px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                                style={{ borderColor: `${ADMIN_UI.emerald}55`, color: ADMIN_UI.emerald }}
                              >
                                <Copy className="w-3 h-3" />
                                {copiedKey === `guest-${inv.id}` ? 'Nusxa' : 'Mehmon'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingInvitation && (
        <AdminInvitationEditor
          invitation={editingInvitation}
          onClose={() => setEditingInvitation(null)}
          onSaved={(next) => {
            setInvitations((prev) => prev.map((inv) => (inv.id === next.id ? next : inv)));
            setEditingInvitation(null);
            setCommandResult(`✅ ${next.id} saqlandi`);
          }}
        />
      )}
    </div>
  );
};
