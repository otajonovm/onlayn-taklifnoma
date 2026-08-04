import React, { useState, useEffect } from 'react';
import { Invitation } from '../../types';
import { BRAND } from '../../config/themes';
import { AdminLogin } from './AdminLogin';
import {
  adminAuthHeaders,
  clearAdminToken,
  getAdminToken,
  guestShareUrl,
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
  Lock,
} from 'lucide-react';

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
  });
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE'>('ALL');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testGuestName] = useState('Sardor Azimov');
  const [commandInput, setCommandInput] = useState('/activate OT-84920');
  const [commandResult, setCommandResult] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    // Validate session
    fetch('/api/admin/me', { headers: adminAuthHeaders() })
      .then(async (res) => {
        if (!res.ok) {
          clearAdminToken();
          setToken(null);
          return;
        }
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
    try {
      const res = await fetch(`/api/invitations/${id}/activate`, {
        method: 'POST',
        headers: adminAuthHeaders(),
      });
      const data = await res.json();
      if (res.status === 401) {
        clearAdminToken();
        setToken(null);
        return;
      }
      if (data.success) {
        setCommandResult(
          `✅ #${id} aktiv. Mehmon havolasi: ${guestShareUrl(id)}`
        );
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunBotCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const parts = commandInput.trim().split(' ');
    if (parts[0].toLowerCase() === '/activate' && parts[1]) {
      const idToActivate = parts[1].replace('#', '').toUpperCase();
      await handleActivate(idToActivate);
    } else {
      setCommandResult('❌ Buyruq xato. Misol: /activate OT-84920');
    }
  };

  const copyGuestLink = (id: string) => {
    const url = guestShareUrl(id);
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!token) {
    return <AdminLogin onSuccess={handleLoginSuccess} onBackToHome={onBackToHome} />;
  }

  const filtered = invitations.filter((inv) => {
    const matchesFilter =
      filter === 'ALL' ? true : filter === 'PENDING' ? inv.status === 'PENDING' : inv.status === 'ACTIVE';
    const matchesSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.hostName.toLowerCase().includes(search.toLowerCase()) ||
      inv.eventTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: BRAND.bg, color: BRAND.text }}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6"
          style={{ borderColor: BRAND.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
              style={{ backgroundColor: BRAND.white, borderColor: BRAND.borderAccent, color: BRAND.accent }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-xs uppercase tracking-wider" style={{ color: BRAND.accent }}>
                <Sparkles className="w-3 h-3" />
                <span>Boshqaruv</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif">Admin Panel</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl border cursor-pointer bg-white"
              style={{ borderColor: BRAND.border, color: BRAND.accent }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer bg-white"
              style={{ borderColor: BRAND.border, color: BRAND.muted }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Chiqish
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-2.5 rounded-xl font-medium text-xs uppercase tracking-wider cursor-pointer"
              style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
            >
              Bosh Sahifa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Jami', value: stats.totalInvitations, icon: null },
            { label: 'Kutilmoqda', value: stats.pendingInvitations, icon: Clock },
            { label: 'Faol', value: stats.activeInvitations, icon: CheckCircle },
            { label: 'RSVP', value: stats.totalRsvps, icon: Users },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-xl border bg-white space-y-1"
              style={{ borderColor: BRAND.borderAccent }}
            >
              <span className="text-xs uppercase tracking-wider flex items-center gap-1" style={{ color: BRAND.muted }}>
                {s.icon && <s.icon className="w-3.5 h-3.5" />}
                {s.label}
              </span>
              <span className="block text-2xl font-serif" style={{ color: BRAND.text }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl border bg-white space-y-3" style={{ borderColor: BRAND.borderAccent }}>
          <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: BRAND.text }}>
            <Send className="w-4 h-4" style={{ color: BRAND.accent }} />
            Aktivlash buyrug‘i (`/activate OT-XXXXX`)
          </h3>
          <form onSubmit={handleRunBotCommand} className="flex gap-2">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none"
              style={{ borderColor: BRAND.border, color: BRAND.text, backgroundColor: BRAND.bg }}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-medium text-xs uppercase tracking-wider cursor-pointer"
              style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
            >
              Bajarish
            </button>
          </form>
          {commandResult && (
            <div
              className="p-3 rounded-xl border text-xs font-mono break-all"
              style={{ borderColor: BRAND.border, backgroundColor: BRAND.bg, color: BRAND.muted }}
            >
              {commandResult}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 p-1 rounded-xl border bg-white" style={{ borderColor: BRAND.border }}>
              {(['ALL', 'PENDING', 'ACTIVE'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
                  style={{
                    backgroundColor: filter === f ? BRAND.accent : 'transparent',
                    color: filter === f ? BRAND.white : BRAND.muted,
                  }}
                >
                  {f === 'ALL' ? 'Barchasi' : f === 'PENDING' ? 'Kutilmoqda' : 'Faol'}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: BRAND.muted }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ID yoki sarlavha..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs bg-white focus:outline-none"
                style={{ borderColor: BRAND.border, color: BRAND.text }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm" style={{ color: BRAND.muted }}>
                Taklifnomalar topilmadi.
              </div>
            ) : (
              filtered.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-xl border bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                  style={{ borderColor: BRAND.borderAccent }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-medium" style={{ color: BRAND.accent }}>
                        #{inv.id}
                      </span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase"
                        style={{
                          backgroundColor: inv.status === 'ACTIVE' ? `${BRAND.accent}18` : `${BRAND.accent}10`,
                          color: BRAND.accent,
                          border: `1px solid ${BRAND.borderAccent}`,
                        }}
                      >
                        {inv.status}
                      </span>
                      <span className="text-xs" style={{ color: BRAND.muted }}>
                        RSVP: {inv.rsvps?.length || 0}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif">
                      {inv.eventTitle} ({inv.hostName})
                    </h3>
                    <p className="text-xs" style={{ color: BRAND.muted }}>
                      {inv.venueName} · {new Date(inv.eventDate).toLocaleDateString()}
                    </p>
                    {inv.status === 'PENDING' && (
                      <p className="text-[11px] flex items-center gap-1" style={{ color: BRAND.muted }}>
                        <Lock className="w-3 h-3" />
                        Mehmon havolasi yopiq — avval aktivlashtiring
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onSelectInvitation(inv.id)}
                      className="px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                      style={{ borderColor: BRAND.border, color: BRAND.text }}
                      title="Preview (ichki ko‘rish)"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    {inv.status === 'ACTIVE' ? (
                      <>
                        <button
                          onClick={() => copyGuestLink(inv.id)}
                          className="px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1 cursor-pointer"
                          style={{ borderColor: BRAND.border, color: BRAND.accent }}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copiedId === inv.id ? 'Nusxalandi' : 'Havola'}
                        </button>
                        <button
                          onClick={() => {
                            const encoded = encodeURIComponent(testGuestName);
                            window.open(`/v/${inv.id}?guest=${encoded}`, '_blank');
                          }}
                          className="px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1 cursor-pointer"
                          style={{ borderColor: BRAND.border, color: BRAND.muted }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Mehmon
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleActivate(inv.id)}
                        className="px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
                        style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
                      >
                        Aktivlashtirish
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
