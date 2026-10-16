import React, { useState, useEffect } from 'react';

interface CvvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvv: string;
}

export const CvvModal: React.FC<CvvModalProps> = ({ isOpen, onClose, cvv }) => {
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(180);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 180));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-[#303030]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl z-10 animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ec111a] text-[22px]">security</span>
            <h3 className="font-bold text-[17px] text-[#1b1b1c]">Datos de Seguridad</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0eded] flex items-center justify-center text-[#5b5e66] hover:bg-[#e5e2e1]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="bg-[#f6f3f2] rounded-xl p-4 space-y-3 mb-4">
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[#5b5e66]">Número completo</span>
            <span className="font-mono font-semibold text-[#1b1b1c]">4551 •••• •••• 5678</span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[#5b5e66]">Fecha Vencimiento</span>
            <span className="font-mono font-semibold text-[#1b1b1c]">09 / 2028</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#e5e2e1]">
            <div>
              <span className="font-bold text-[13px] text-[#ec111a] block">CVV Dinámico</span>
              <span className="text-[11px] text-[#5b5e66]">Expira en {formattedTime}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#ec111a]/10 px-3 py-1 rounded-md">
              <span className="font-mono text-[20px] font-bold text-[#ec111a] tracking-widest">{cvv}</span>
              <span className="material-symbols-outlined text-[#ec111a] text-[16px] animate-spin">sync</span>
            </div>
          </div>
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
