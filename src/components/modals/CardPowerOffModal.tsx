import React from 'react';

interface CardPowerOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cardMasked: string;
}

export const CardPowerOffModal: React.FC<CardPowerOffModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cardMasked
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#303030]/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        {/* Grab bar for mobile */}
        <div className="w-10 h-1 bg-[#e5e2e1] rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Close Button */}
        <button
          aria-label="Cerrar modal"
          onClick={onClose}
          className="absolute right-4 top-3.5 w-8 h-8 rounded-full bg-[#f6f3f2] hover:bg-[#eae7e7] flex items-center justify-center text-[#5b5e66] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-6 pt-4 flex flex-col items-center">
          {/* Shield Power Icon */}
          <div className="relative mt-2 mb-3">
            <div className="w-16 h-16 rounded-full bg-[#ffdad5] flex items-center justify-center text-[#bf000f]">
              <span className="material-symbols-outlined text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield_lock
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#ec111a] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[13px]">power_settings_new</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-[19px] sm:text-[20px] font-bold text-[#1b1b1c] text-center leading-snug px-2">
            ¿Deseas apagar temporalmente tu Tarjeta Débito **** {cardMasked}?
          </h2>

          {/* Warning Banner */}
          <div className="w-full mt-3 px-3 py-2 rounded-lg bg-[#f6f3f2] text-center">
            <p className="text-[13px] text-[#ec111a] font-semibold">
              Se rebotarán compras y retiros hasta que la vuelvas a encender.
            </p>
          </div>

          {/* Bullet Points */}
          <div className="w-full mt-4 flex flex-col gap-2.5 text-left">
            <div className="flex items-start gap-2.5 p-2 bg-[#fcf9f8] rounded-lg border border-[#f0eded]">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-[#95f5d4] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#006b54] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-[#1b1b1c]">
                No afectará tus transferencias recibidas por Plin o abonos de nómina.
              </p>
            </div>

            <div className="flex items-start gap-2.5 p-2 bg-[#fcf9f8] rounded-lg border border-[#f0eded]">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-[#ffdad6] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[14px]">
                  sync_problem
                </span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-[#1b1b1c]">
                Las suscripciones automáticas (ej. Netflix, Spotify) podrían fallar.
              </p>
            </div>

            <div className="flex items-start gap-2.5 p-2 bg-[#fcf9f8] rounded-lg border border-[#f0eded]">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-[#dfe2ec] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#181c22] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  toggle_on
                </span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-[#1b1b1c]">
                Podrás volver a encenderla en cualquier momento desde esta misma pantalla.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-5 flex flex-col gap-2.5">
            <button
              onClick={onConfirm}
              className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] active:scale-[0.99] text-white rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">power_settings_new</span>
              <span>Sí, Apagar Tarjeta</span>
            </button>

            <button
              onClick={onClose}
              className="w-full h-11 bg-[#f0eded] hover:bg-[#eae7e7] text-[#1b1b1c] rounded-xl font-medium text-[14px] flex items-center justify-center transition-colors"
            >
              <span>Cancelar</span>
            </button>
          </div>

          {/* Security footnote */}
          <div className="flex items-center justify-center gap-1.5 mt-3 text-[#5b5e66]">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <span className="text-[11px] font-mono tracking-tight text-center">
              Operación protegida con token digital silencioso de Scotiabank
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
