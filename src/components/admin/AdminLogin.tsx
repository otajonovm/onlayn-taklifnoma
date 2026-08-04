import React, { useState } from 'react';
import { BRAND } from '../../config/themes';
import { Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (token: string) => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.token) {
        setError(data.message || 'Login yoki parol noto‘g‘ri');
        return;
      }
      onSuccess(data.token);
    } catch {
      setError('Tarmoq xatosi. Qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: BRAND.bg, color: BRAND.text }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border bg-white p-6 sm:p-8 space-y-6"
        style={{ borderColor: BRAND.borderAccent, boxShadow: '0 20px 40px rgba(30,41,59,0.06)' }}
      >
        <div className="text-center space-y-2">
          <div
            className="mx-auto w-12 h-12 rounded-xl border flex items-center justify-center"
            style={{ borderColor: BRAND.borderAccent, color: BRAND.accent }}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif">Admin kirish</h1>
          <p className="text-xs" style={{ color: BRAND.muted }}>
            Faqat boshqaruv uchun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: BRAND.muted }}>
              Login
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3" style={{ color: BRAND.muted }} />
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: BRAND.border, backgroundColor: BRAND.bg }}
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: BRAND.muted }}>
              Parol
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-3 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: BRAND.border, backgroundColor: BRAND.bg }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-2.5 cursor-pointer"
                style={{ color: BRAND.muted }}
                aria-label={showPass ? 'Yashirish' : 'Ko‘rsatish'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-60"
            style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
          >
            {loading ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <button
          type="button"
          onClick={onBackToHome}
          className="w-full text-xs cursor-pointer hover:opacity-70"
          style={{ color: BRAND.muted }}
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
