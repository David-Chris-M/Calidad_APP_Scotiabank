import React from 'react';

interface HelpCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCodeModal: React.FC<HelpCodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-[#303030]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl z-10 animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e2e1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ec111a] text-[22px]">info</span>
            <h3 className="font-bold text-[16px] text-[#1b1b1c]">Ubicación del Código</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0eded] flex items-center justify-center text-[#5b5e66] hover:bg-[#e5e2e1]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3 text-[13px] text-[#5b5e66]">
          <p className="leading-snug">
            En tu recibo físico o recibo digital PDF, busca en la esquina superior derecha:
          </p>

          <div className="p-3 bg-[#f6f3f2] rounded-xl flex flex-col gap-2 font-mono text-[12px] text-[#1b1b1c]">
            <div className="flex items-start gap-1.5">
              <span className="text-[#ec111a] font-bold">•</span>
              <span><strong>Luz del Sur / Enel:</strong> 'N° de Suministro' (7 u 8 dígitos).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-[#006b54] font-bold">•</span>
              <span><strong>Sedapal:</strong> 'N° de Suministro' (7 dígitos).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-[#5b5e66] font-bold">•</span>
              <span><strong>Telefonía / Internet:</strong> Número de celular o teléfono con código de ciudad.</span>
            </div>
          </div>

          <p className="text-[12px] text-[#5b5e66] leading-tight">
            También puedes escanear el código de barras o QR de tu recibo con el botón de la cámara.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-semibold text-[14px] transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
