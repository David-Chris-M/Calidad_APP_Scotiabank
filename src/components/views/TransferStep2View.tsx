import React, { useState, useEffect } from 'react';
import { Account, ViewState } from '../../types/index.ts';
import { RECIPIENT_AVATAR_URL } from '../../data/mockData.ts';

interface TransferStep2ViewProps {
  transferData: {
    originAccount: Account;
    transferType: 'propias' | 'terceros' | 'otros';
    destAccount: string;
    recipientName: string;
    amount: number;
    concept: string;
    isDeferred?: boolean;
    deferredNotice?: string;
  };
  onNavigate: (view: ViewState) => void;
  onConfirmSuccess: () => void;
  onQuickNotify: (msg: string) => void;
}

export const TransferStep2View: React.FC<TransferStep2ViewProps> = ({
  transferData,
  onNavigate,
  onConfirmSuccess,
  onQuickNotify
}) => {
  const [pinDigits, setPinDigits] = useState(['7', '4', '2', '9', '1', '8']);
  const [timeLeft, setTimeLeft] = useState(36);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newDigits = [...pinDigits];
    newDigits[index] = val;
    setPinDigits(newDigits);
  };

  const handleRenewToken = () => {
    const randomDigits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10).toString());
    setPinDigits(randomDigits);
    setTimeLeft(60);
    onQuickNotify('Nuevo Token Digital generado y sincronizado');
  };

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(transferData.destAccount);
    onQuickNotify('Número de cuenta copiado al portapapeles');
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmSuccess();
      onNavigate('transfer-receipt');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3">
      {/* Progress Header */}
      <div className="flex flex-col gap-1.5 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#5b5e66] tracking-wider uppercase font-semibold">
            Paso 2 de 2
          </span>
          <span className="text-[11px] text-[#006b54] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006b54] animate-pulse"></span>
            Validación Segura
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden flex">
          <div className="h-full bg-[#ec111a] w-full rounded-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Trust & Encryption Banner */}
      <div className="bg-[#f6f3f2] rounded-2xl p-3 flex items-center justify-between mb-3 border border-[#e5e2e1]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#006b54]/10 text-[#006b54] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-[13px] text-[#1b1b1c] truncate">
              Confirmación y Autorización
            </span>
            <span className="text-[11px] text-[#5b5e66] truncate">Canal seguro TLS 1.3 bancario</span>
          </div>
        </div>
        <div className="bg-white px-2.5 py-1 rounded-full text-[#5b5e66] flex items-center gap-1 shrink-0 border border-[#e5e2e1]">
          <span className="material-symbols-outlined text-[13px] text-[#006b54]">lock</span>
          <span className="text-[10px] font-mono text-[#1b1b1c] font-semibold">Activo</span>
        </div>
      </div>

      {/* Transaction Details Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e7eb] flex flex-col gap-3 mb-3">
        {/* Amount Display */}
        <div className="flex flex-col items-center justify-center pt-1 pb-2 text-center">
          <span className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-widest mb-1">
            Monto a Transferir
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-bold text-[#1b1b1c]">
              {transferData.originAccount.currencySymbol}
            </span>
            <span className="font-mono text-[30px] font-extrabold text-[#1b1b1c] tracking-tight">
              {transferData.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-0.5 rounded-full bg-[#006b54]/10 text-[#006b54]">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span className="text-[11px] font-bold">Comisión: S/ 0.00 (Gratis)</span>
          </div>
        </div>

        {/* Ledger Block */}
        <div className="flex flex-col gap-2.5 bg-[#f6f3f2] p-3 rounded-xl border border-[#e5e2e1]">
          {/* Source Account */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e5e2e1]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#ec111a] shrink-0 border border-[#e5e2e1]">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#5b5e66]">Cuenta de Origen</span>
                <span className="font-semibold text-[13px] text-[#1b1b1c] truncate">
                  {transferData.originAccount.name}
                </span>
                <span className="font-mono text-[10px] text-[#5b5e66]">
                  •••• {transferData.originAccount.number}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-[#5b5e66] block">Saldo disponible</span>
              <span className="font-mono text-[13px] font-bold text-[#1b1b1c]">
                {transferData.originAccount.currencySymbol} {transferData.originAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Recipient */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e5e2e1]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={RECIPIENT_AVATAR_URL}
                  alt={transferData.recipientName}
                  className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-[#006b54]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#006b54] text-white rounded-full flex items-center justify-center text-[10px]">
                  ✓
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#5b5e66]">Destinatario registrado</span>
                <span className="font-semibold text-[13px] text-[#1b1b1c] truncate">
                  {transferData.recipientName}
                </span>
                <span className="text-[10px] text-[#5b5e66] truncate font-mono">
                  DNI •••• 9214 • Verificado SBS
                </span>
              </div>
            </div>
            <div className="shrink-0 bg-white border border-[#e5e2e1] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-amber-500">star</span>
              <span className="text-[10px] font-semibold text-[#5b5e66]">Frecuente</span>
            </div>
          </div>

          {/* Account number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-[#ec111a]">domain</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#5b5e66]">Entidad y número</span>
                <span className="font-mono text-[12px] font-bold text-[#1b1b1c] truncate">
                  {transferData.destAccount}
                </span>
              </div>
            </div>
            <button
              onClick={handleCopyAccount}
              className="p-1.5 rounded-lg bg-white border border-[#e5e2e1] text-[#ec111a] hover:bg-[#f6f3f2] active:scale-95"
              title="Copiar número"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
          </div>

          {/* Note / Concept */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#5b5e66]">edit_note</span>
              <span className="text-[11px] text-[#5b5e66]">Motivo o concepto</span>
            </div>
            <span className="font-semibold text-[13px] text-[#1b1b1c]">{transferData.concept}</span>
          </div>
        </div>
      </div>

      {/* Security Token Module */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e2e1] flex flex-col gap-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ec111a]/10 text-[#ec111a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">vpn_key</span>
            </div>
            <div>
              <h2 className="font-bold text-[14px] text-[#1b1b1c]">Token Digital</h2>
              <p className="text-[11px] text-[#5b5e66]">Confirmación criptográfica automática</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#006b54]/10 text-[#006b54]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006b54] animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold uppercase">Auto-Sinc</span>
          </div>
        </div>

        {/* 6-PIN OTP Inputs */}
        <div className="grid grid-cols-6 gap-2 w-full max-w-xs mx-auto">
          {pinDigits.map((digit, idx) => (
            <input
              key={idx}
              aria-label={`Dígito ${idx + 1}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              className="h-12 text-center rounded-xl bg-[#f6f3f2] font-mono text-[20px] font-bold text-[#1b1b1c] focus:bg-white focus:outline-none border-b-2 border-[#ec111a] shadow-inner"
            />
          ))}
        </div>

        {/* Countdown & Sync Line */}
        <div className="flex items-center justify-between text-[#5b5e66] text-[12px] pt-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#ec111a]">schedule</span>
            <span>Expira en <strong className="font-mono text-[#1b1b1c]">00:{timeLeft.toString().padStart(2, '0')}</strong> s</span>
          </div>
          <button
            onClick={handleRenewToken}
            className="text-[#ec111a] hover:underline font-semibold text-[12px] flex items-center gap-0.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">refresh</span>
            Renovar
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="flex items-start gap-2 p-3 bg-[#f6f3f2] rounded-xl border border-[#e5e2e1] mb-4">
        <span className="material-symbols-outlined text-[18px] text-[#ec111a] shrink-0 mt-0.5">info</span>
        <p className="text-[11px] text-[#5b5e66] leading-snug">
          Verifica minuciosamente los datos. Una vez confirmada, esta transferencia interbancaria o a terceros se procesará de forma inmediata e irrevocable.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleConfirm}
          disabled={isProcessing}
          className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] active:scale-[0.99] text-white rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-md transition-all"
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
              <span>Procesando transferencia...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
              <span>Confirmar Transferencia</span>
            </>
          )}
        </button>

        <button
          onClick={() => onNavigate('transfer-step1')}
          className="w-full h-11 bg-[#f0eded] hover:bg-[#eae7e7] text-[#1b1b1c] rounded-xl font-semibold text-[14px] flex items-center justify-center transition-colors"
        >
          Regresar y Modificar
        </button>
      </div>
    </div>
  );
};
