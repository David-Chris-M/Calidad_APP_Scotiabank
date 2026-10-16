import React from 'react';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-[#303030]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center border border-[#e5e7eb]">
        {/* Timeout Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-xs border border-amber-200">
          <span className="material-symbols-outlined text-[34px]">timer_off</span>
        </div>

        {/* Textual Title strictly matching HU004 Criterio 02 */}
        <h3 className="text-[18px] font-extrabold text-[#1b1b1c] tracking-tight mb-2">
          Tu sesión ha expirado por inactividad
        </h3>
        
        <p className="text-[13px] text-[#5b5e66] leading-relaxed mb-6">
          Por tu seguridad y para proteger tu información financiera ante extravío o descuido de tu dispositivo, tu sesión se cerró automáticamente tras 3 minutos continuos sin interacción táctil.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[19px]">login</span>
          <span>Iniciar Sesión Nuevamente</span>
        </button>
      </div>
    </div>
  );
};
