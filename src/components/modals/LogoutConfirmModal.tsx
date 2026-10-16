import React from 'react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-[#303030]/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center border border-[#e5e7eb]">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-4 shadow-xs">
          <span className="material-symbols-outlined text-[34px]">logout</span>
        </div>

        {/* Title & Description */}
        <h3 className="text-[18px] font-extrabold text-[#1b1b1c] tracking-tight mb-2">
          ¿Deseas cerrar tu sesión?
        </h3>
        <p className="text-[13px] text-[#5b5e66] leading-relaxed mb-6">
          Se cerrará tu sesión activa de forma segura y se limpiará la memoria temporal de tu dispositivo para proteger tu información financiera.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Confirm Logout */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirmLogout();
            }}
            className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
            <span>Cerrar Sesión</span>
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1b1c] font-semibold text-[13px] flex items-center justify-center transition-colors active:scale-[0.99]"
          >
            <span>Permanecer en mi sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
