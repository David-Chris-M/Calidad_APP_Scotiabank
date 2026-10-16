import React from 'react';
import { NotificationItem } from '../../types/index.ts';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClear: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClear
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-[#303030]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#e5e2e1] flex items-center justify-between bg-[#fcf9f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ec111a] text-[22px]">notifications</span>
            <h3 className="font-bold text-[16px] text-[#1b1b1c]">Notificaciones</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0eded] flex items-center justify-center text-[#5b5e66] hover:bg-[#e5e2e1]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 bg-[#f6f3f2] flex items-center justify-between text-[12px] border-b border-[#e5e2e1]">
          <button
            onClick={onMarkAllAsRead}
            className="text-[#ec111a] font-semibold hover:underline"
          >
            Marcar todas como leídas
          </button>
          <button
            onClick={onClear}
            className="text-[#5b5e66] hover:text-[#1b1b1c]"
          >
            Limpiar lista
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f0eded]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-[#5b5e66]">
              <span className="material-symbols-outlined text-[40px] text-[#c3c6cf] mb-2">notifications_off</span>
              <p className="text-[14px] font-medium">No tienes notificaciones pendientes</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex items-start gap-3 transition-colors ${
                  item.isRead ? 'bg-white' : 'bg-[#ec111a]/5'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  item.type === 'transaction' 
                    ? 'bg-[#006b54]/10 text-[#006b54]' 
                    : item.type === 'security'
                    ? 'bg-[#ec111a]/10 text-[#ec111a]'
                    : 'bg-[#ffdad5] text-[#ec111a]'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {item.type === 'transaction' ? 'paid' : item.type === 'security' ? 'shield' : 'loyalty'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-semibold text-[13px] text-[#1b1b1c] truncate">{item.title}</h4>
                    <span className="text-[10px] text-[#5b5e66] shrink-0 font-mono">{item.time}</span>
                  </div>
                  <p className="text-[12px] text-[#5b5e66] mt-0.5 leading-snug">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Security badge footer */}
        <div className="p-4 bg-[#fcf9f8] border-t border-[#e5e2e1] text-center">
          <p className="text-[11px] text-[#5b5e66]">
            Canal de alertas y avisos oficiales Scotiabank Perú
          </p>
        </div>
      </div>
    </div>
  );
};
