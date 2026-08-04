import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Send, Lock } from 'lucide-react';

interface ActivationModalProps {
  invitationId: string;
  hostName: string;
  eventTitle: string;
  onActivatedSuccess?: () => void;
}

export const ActivationModal: React.FC<ActivationModalProps> = ({
  invitationId,
}) => {
  const [copied, setCopied] = useState(false);

  const telegramAdminUrl = `https://t.me/onlayntaklifnomaadmin?text=${encodeURIComponent(
    `Assalomu alaykum! Men taklifnoma yaratdim. ID: #${invitationId}. To'lov qilib aktivlashtirmoqchiman.`
  )}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(`#${invitationId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-5 border border-[rgba(212,163,115,0.25)] text-[#1E293B] relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
            ID: <span className="text-slate-900 font-bold">#{invitationId}</span>
          </div>
          <div className="px-2.5 py-0.5 bg-[#D4A373]/15 text-[#D4A373] text-[9px] font-bold rounded-full uppercase tracking-wider border border-[rgba(212,163,115,0.3)] animate-pulse flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Havola yopiq
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          <h4 className="text-sm font-serif font-bold text-slate-900">
            Aktivlash kerak
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Aktivlanmaguncha mehmonlarga yuboriladigan havola ishlamaydi va nusxa
            olinmaydi. Admin orqali to‘lovdan keyin aktivlashtiring.
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleCopyId}
            className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-mono font-semibold flex items-center justify-between text-gray-700 transition-colors cursor-pointer"
          >
            <span className="text-gray-500">
              Admin uchun ID: <strong className="text-slate-900">#{invitationId}</strong>
            </span>
            <span className="text-[11px] font-sans font-bold text-amber-600 flex items-center gap-1">
              {copied ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Nusxalandi' : 'ID'}
            </span>
          </button>

          <a
            href={telegramAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-[#0088CC] hover:bg-[#0077B5] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Telegram orqali so‘rov</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};
