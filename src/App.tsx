import React, { useState, useEffect } from 'react';
import { Invitation } from './types';
import { LandingPage } from './components/home/LandingPage';
import { LiveBuilder } from './components/builder/LiveBuilder';
import { InvitationCard } from './components/invitation/InvitationCard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ThemeProvider } from './config/ThemeContext';
import { adminAuthHeaders } from './lib/adminAuth';
import { Loader2, ArrowLeft, Lock } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'builder' | 'invitation' | 'admin'>('home');
  const [activeInvitationId, setActiveInvitationId] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<Invitation | null>(null);
  const [loadingInvitation, setLoadingInvitation] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [accessMode, setAccessMode] = useState<'preview' | 'guest'>('preview');

  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const idParam = searchParams.get('id');

      if (path === '/admin' || searchParams.get('view') === 'admin') {
        setCurrentView('admin');
        return;
      }

      if (
        path === '/builder' ||
        path === '/create' ||
        path === '/dashboard/events/new' ||
        searchParams.get('view') === 'builder'
      ) {
        setCurrentView('builder');
        return;
      }

      let targetId: string | null = idParam;
      let mode: 'preview' | 'guest' = 'preview';

      if (path.startsWith('/v/')) {
        targetId = path.replace('/v/', '').split('?')[0];
        mode = 'guest';
      } else if (path.startsWith('/preview/')) {
        targetId = path.replace('/preview/', '').split('?')[0];
        mode = 'preview';
      }

      if (targetId) {
        setActiveInvitationId(targetId);
        setAccessMode(mode);
        setCurrentView('invitation');
        fetchInvitationDetails(targetId, mode);
      }
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, []);

  const fetchInvitationDetails = async (
    id: string,
    mode: 'preview' | 'guest' = accessMode
  ) => {
    setLoadingInvitation(true);
    setErrorMsg(null);
    setErrorCode(null);
    try {
      const qs = mode === 'preview' ? '?preview=1' : '';
      const headers = mode === 'preview' ? adminAuthHeaders() : {};
      const res = await fetch(`/api/invitations/${id}${qs}`, { headers });
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setInvitationData(data.data);
      } else {
        setErrorCode(data.code || null);
        setErrorMsg(
          data.message ||
            "Taklifnoma topilmadi yoki doimiy ravishda o'chirilgan."
        );
        setInvitationData(null);
      }
    } catch {
      setErrorMsg("Tarmoqda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
      setInvitationData(null);
    } finally {
      setLoadingInvitation(false);
    }
  };

  const navigateTo = (
    view: 'home' | 'builder' | 'admin' | 'invitation',
    id?: string
  ) => {
    setCurrentView(view);
    if (id) {
      setActiveInvitationId(id);
      setAccessMode('preview');
      window.history.pushState({}, '', `/preview/${id}`);
      fetchInvitationDetails(id, 'preview');
    } else if (view === 'home') {
      window.history.pushState({}, '', '/');
    } else if (view === 'builder') {
      window.history.pushState({}, '', '/builder');
    } else if (view === 'admin') {
      window.history.pushState({}, '', '/admin');
    }
  };

  if (currentView === 'builder') {
    return (
      <LiveBuilder
        onInvitationCreated={(newId) => navigateTo('invitation', newId)}
        onCancel={() => navigateTo('home')}
      />
    );
  }

  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onSelectInvitation={(id) => navigateTo('invitation', id)}
        onBackToHome={() => navigateTo('home')}
      />
    );
  }

  if (currentView === 'invitation') {
    if (loadingInvitation) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#D4A373]" />
          <p className="font-serif text-lg">Taklifnoma yuklanmoqda...</p>
        </div>
      );
    }

    if (errorMsg || !invitationData) {
      const locked = errorCode === 'NOT_ACTIVATED';
      return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] text-[#1E293B] max-w-md space-y-3">
            {locked && (
              <div className="mx-auto w-12 h-12 rounded-full bg-[#D4A373]/15 flex items-center justify-center text-[#D4A373]">
                <Lock className="w-5 h-5" />
              </div>
            )}
            <p className="text-base font-serif">
              {errorMsg || 'Taklifnoma topilmadi.'}
            </p>
            {locked && (
              <p className="text-xs text-[#64748B]">
                Mehmon havolasi faqat aktivlashdan keyin ishlaydi.
              </p>
            )}
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-3 rounded-xl bg-[#D4A373] text-white font-medium text-sm flex items-center gap-2 cursor-pointer hover:opacity-90"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bosh Sahifaga Qaytish</span>
          </button>
        </div>
      );
    }

    return (
      <InvitationCard
        invitation={invitationData}
        accessMode={accessMode}
        onStatusUpdated={() => {
          if (activeInvitationId) {
            fetchInvitationDetails(activeInvitationId, accessMode);
          }
        }}
      />
    );
  }

  return (
    <LandingPage
      onCreateClick={() => navigateTo('builder')}
      onSelectSample={(id) => navigateTo('invitation', id)}
      onAdminClick={() => navigateTo('admin')}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
