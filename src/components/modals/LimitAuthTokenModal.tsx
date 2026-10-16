import React, { useState, useEffect } from 'react';

interface LimitAuthTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newLimit: number;
  oldLimit: number;
}

export const LimitAuthTokenModal: React.FC<LimitAuthTokenModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  newLimit,
  oldLimit
}) => {
  const [tokenDigits, setTokenDigits] = useState(['8', '3', '2', '9', '1', '4']);
  const [timeLeft, setTimeLeft] = useState(42);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(42);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateNewToken();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const generateNewToken = () => {
    const newDigits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10).toString());
    setTokenDigits(newDigits);
    setTimeLeft(60);
  };

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      onConfirm();
    }, 1000);
  };

  const diff = oldLimit - newLimit;
  const isReduction = diff >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#303030]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header with radiant halo */}
        <div className="p-6 pb-2 flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center mb-2">
            <div className="absolute w-14 h-14 rounded-full bg-[#ffdad5] animate-ping opacity-30"></div>
            <div className="relative w-12 h-12 rounded-full bg-[#ffdad5] flex items-center justify-center text-[#ec111a] shadow-sm">
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                encrypted
              </span>
            </div>
          </div>
          <h2 className="text-[18px] font-bold text-[#1b1b1c]">
            Autorizar Cambio de Límite
          </h2>
          <p className="text-[13px] text-[#5b5e66] mt-1 px-2">
            Verifica los nuevos parámetros operativos para tu cuenta antes de confirmar con tu clave dinámica.
          </p>
        </div>

        {/* Resumen comparativo */}
        <div className="px-5 py-2">
          <div className="bg-[#f6f3f2] rounded-xl p-3.5 flex flex-col gap-2.5">
            {/* Tag de transición */}
            <div className="bg-white p-2.5 rounded-lg flex items-center justify-between shadow-xs border border-[#e5e2e1]">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[#5b5e66] uppercase tracking-wider">Límite Anterior</span>
                <span className="font-mono text-[14px] text-[#5b5e66] line-through">
                  S/ {oldLimit.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#f0eded] flex items-center justify-center text-[#ec111a]">
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-mono text-[#006b54] uppercase tracking-wider font-semibold">Nuevo Límite</span>
                <span className="font-mono text-[15px] text-[#ec111a] font-bold">
                  S/ {newLimit.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Metadatos */}
            <div className="flex flex-col gap-1.5 text-[12px] pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[#5b5e66] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">credit_card</span>
                  Cuenta
                </span>
                <span className="font-semibold text-[#1b1b1c]">Sueldo Soles (•••• 4821)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5b5e66] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#006b54]">trending_down</span>
                  {isReduction ? 'Reducción' : 'Incremento'}
                </span>
                <span className={`font-mono font-semibold ${isReduction ? 'text-[#006b54]' : 'text-[#ec111a]'}`}>
                  {isReduction ? '-' : '+'} S/ {Math.abs(diff).toLocaleString('es-PE', { minimumFractionDigits: 2 })} / día
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5b5e66] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  Vigencia
                </span>
                <span className="text-[#1b1b1c] font-semibold">Inmediata (App y Web)</span>
              </div>
            </div>

            <div className="bg-white/80 p-2 rounded-lg flex items-center gap-1.5 border border-[#e5e2e1]">
              <span className="material-symbols-outlined text-[16px] text-[#ec111a]">info</span>
              <span className="text-[11px] text-[#5b5e66]">
                Token requerido en transferencias &gt; S/ 1,000.00
              </span>
            </div>
          </div>
        </div>

        {/* Token Digital Dinámico */}
        <div className="p-5 flex flex-col items-center">
          <div className="flex items-center gap-1.5 bg-[#95f5d4]/40 text-[#00513f] px-3 py-1 rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-[#006b54] animate-pulse"></span>
            <span className="text-[11px] font-semibold">Auto-sincronizado • Clave Segura</span>
          </div>

          {/* 6 Casillas Numéricas */}
          <div className="flex items-center justify-center gap-2 w-full mb-2.5">
            {tokenDigits.map((digit, idx) => (
              <div
                key={idx}
                className="w-10 h-12 rounded-lg bg-[#f6f3f2] shadow-inner flex items-center justify-center font-mono text-[20px] font-bold text-[#1b1b1c] border-b-2 border-[#ec111a]"
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Countdown & Renovar */}
          <div className="flex items-center justify-between w-full px-1 text-[12px]">
            <div className="flex items-center gap-1 text-[#5b5e66]">
              <span className="material-symbols-outlined text-[15px]">timer</span>
              <span>Expira en <strong className="font-mono text-[#1b1b1c]">{timeLeft.toString().padStart(2, '0')}</strong> seg</span>
            </div>
            <button
              onClick={generateNewToken}
              className="text-[#ec111a] font-semibold hover:underline flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              Renovar código
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 pt-0 flex flex-col gap-2">
          <button
            onClick={handleConfirm}
            disabled={isAuthorizing}
            className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] active:scale-[0.98] transition-all rounded-xl text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-sm"
          >
            {isAuthorizing ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                <span>Validando Token...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <span>Confirmar Cambio</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full h-11 bg-[#f0eded] hover:bg-[#eae7e7] rounded-xl text-[#5b5e66] font-medium text-[14px] flex items-center justify-center"
          >
            Cancelar / Modificar
          </button>
        </div>

        {/* Footer */}
        <div className="bg-[#f6f3f2] px-4 py-2 flex items-center gap-1.5 justify-center text-center">
          <span className="material-symbols-outlined text-[13px] text-[#006b54]">lock</span>
          <p className="text-[10px] font-mono text-[#5b5e66] leading-tight">
            Cifrado TLS 1.3 • Certificación Scotiabank Perú S.A.A. conforme a SBS
          </p>
        </div>
      </div>
    </div>
  );
};
