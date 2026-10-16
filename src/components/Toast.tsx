import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'warning' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#1e1e1e] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between border border-white/10">
        <div className="flex items-center gap-2.5">
          <span 
            className={`material-symbols-outlined text-[20px] ${
              type === 'warning' ? 'text-amber-400' : 'text-[#78d8b8]'
            }`}
          >
            {type === 'warning' ? 'warning' : 'check_circle'}
          </span>
          <span className="text-[13px] font-medium leading-tight">{message}</span>
        </div>
        <span className="text-[10px] font-mono tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded">
          EN LÍNEA
        </span>
      </div>
    </div>
  );
};
