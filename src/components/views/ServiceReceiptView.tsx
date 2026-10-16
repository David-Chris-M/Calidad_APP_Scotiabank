import React, { useState } from 'react';
import { ViewState } from '../../types/index.ts';

interface ServiceReceiptViewProps {
  serviceName: string;
  supplyCode: string;
  amount: number;
  onNavigate: (view: ViewState) => void;
  onOpenShareModal: () => void;
  onQuickNotify: (msg: string) => void;
}

export const ServiceReceiptView: React.FC<ServiceReceiptViewProps> = ({
  serviceName,
  supplyCode,
  amount,
  onNavigate,
  onOpenShareModal,
  onQuickNotify
}) => {
  const [isSavedFrequent, setIsSavedFrequent] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const opNumber = '#OP-9841284';

  const handleToggleFrequent = () => {
    setIsSavedFrequent(!isSavedFrequent);
    onQuickNotify(!isSavedFrequent ? 'Servicio guardado en tus Frecuentes de Scotia' : 'Servicio retirado de frecuentes');
  };

  const handleCopyOpCode = () => {
    navigator.clipboard?.writeText(opNumber);
    setIsCopied(true);
    onQuickNotify('N° de operación copiado');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3">
      {/* Status Badge */}
      <div className="flex justify-center items-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#006b54]/10 text-[#006b54] shadow-xs border border-[#006b54]/20">
          <span className="w-2 h-2 rounded-full bg-[#006b54] animate-pulse"></span>
          <span className="text-[11px] font-mono uppercase font-bold tracking-wider">
            Operación Exitosa • Pago Aplicado en Línea
          </span>
        </div>
      </div>

      {/* Hero Confirmation */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="relative flex items-center justify-center mb-3">
          <div className="absolute w-20 h-20 rounded-full bg-[#006b54]/15 animate-ping opacity-50"></div>
          <div className="relative w-16 h-16 rounded-full bg-[#006b54] flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
        </div>
        <h2 className="text-[24px] font-extrabold text-[#1b1b1c] mb-1 tracking-tight">
          ¡Pago Exitoso!
        </h2>
        <p className="text-[13px] text-[#5b5e66] max-w-xs leading-snug">
          Tu servicio ha sido pagado y acreditado inmediatamente
        </p>
      </div>

      {/* Amount Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-[#e5e2e1] mb-4 text-center">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#ec111a]/5 rounded-full pointer-events-none"></div>
        <span className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-wider block mb-1">
          Monto Debitado
        </span>
        <div className="font-mono text-[32px] font-extrabold text-[#1b1b1c] mb-1">
          <span className="text-[22px] font-semibold text-[#ec111a] mr-1">S/</span>
          {amount.toFixed(2)}
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#f6f3f2] text-[#006b54] text-[11px] font-semibold border border-[#e5e2e1]">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          Total Pagado • Sin comisión Scotia
        </div>
      </div>

      {/* Detailed Voucher Card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e5e2e1] mb-4 space-y-4">
        {/* Merchant Header */}
        <div className="flex items-center gap-3 bg-[#f6f3f2] p-3 rounded-xl border border-[#e5e2e1]">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#ec111a] shadow-xs shrink-0 border border-[#e5e2e1]">
            <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[14px] text-[#1b1b1c] truncate">{serviceName}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#5b5e66] font-semibold border border-[#e5e2e1]">
                Oficial
              </span>
            </div>
            <p className="text-[11px] text-[#5b5e66] truncate mt-0.5">Electricidad Residencial - Recibo Mes Octubre</p>
          </div>
        </div>

        {/* Attributes */}
        <div className="space-y-2.5 text-[13px] pt-1">
          <div className="flex justify-between items-start gap-2">
            <span className="text-[#5b5e66]">Suministro / Contrato</span>
            <span className="font-mono font-bold text-[#1b1b1c] text-right">{supplyCode}</span>
          </div>

          <div className="flex justify-between items-start gap-2">
            <span className="text-[#5b5e66]">Titular del servicio</span>
            <div className="text-right">
              <span className="font-semibold text-[#1b1b1c] block">Camila Morales Silva</span>
              <span className="text-[11px] font-mono text-[#5b5e66]">DNI •••• 8492</span>
            </div>
          </div>

          <div className="flex justify-between items-start gap-2">
            <span className="text-[#5b5e66]">Cuenta de cargo</span>
            <div className="text-right">
              <span className="font-semibold text-[#1b1b1c] block">Cuenta Sueldo Scotia Soles</span>
              <span className="text-[11px] font-mono text-[#5b5e66]">•••• 4821</span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 pt-1 border-t border-[#f0eded]">
            <span className="text-[#5b5e66]">N° de Operación</span>
            <div className="flex items-center gap-1.5 bg-[#f6f3f2] px-2.5 py-1 rounded-lg border border-[#e5e2e1]">
              <span className="font-mono text-[13px] text-[#1b1b1c] font-bold">{opNumber}</span>
              <button
                onClick={handleCopyOpCode}
                className="text-[#ec111a] hover:text-[#c0000f] active:scale-95"
                title="Copiar código"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isCopied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-start gap-2">
            <span className="text-[#5b5e66]">Fecha y hora</span>
            <span className="text-[12px] text-[#1b1b1c] font-medium text-right font-mono">
              Hoy, 24 de Octubre 2023 • 11:42:15 hrs
            </span>
          </div>
        </div>

        {/* Security Stamp */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f6f3f2] border border-[#e5e2e1]">
          <span className="material-symbols-outlined text-[18px] text-[#006b54]">verified_user</span>
          <span className="text-[10px] font-mono text-[#5b5e66] leading-tight">
            Certificado bancario TLS 1.3 • ID: SCOTIA-SRV-2023
          </span>
        </div>
      </div>

      {/* Save to Frequent Card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e5e2e1] mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffdad5] flex items-center justify-center text-[#ec111a] shrink-0">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </div>
          <div>
            <h4 className="font-bold text-[14px] text-[#1b1b1c]">¿Pagas este servicio seguido?</h4>
            <p className="text-[12px] text-[#5b5e66]">Guárdalo en tus frecuentes y recuérdalo para pagar en un solo clic.</p>
          </div>
        </div>
        <button
          onClick={handleToggleFrequent}
          className={`w-full h-11 flex items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-all ${
            isSavedFrequent
              ? 'bg-[#006b54] text-white shadow-sm'
              : 'bg-[#f6f3f2] hover:bg-[#e5e2e1] text-[#1b1b1c] border border-[#e5e2e1]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isSavedFrequent ? 'check' : 'bookmark_add'}
          </span>
          <span>{isSavedFrequent ? 'Guardado en Frecuentes' : 'Guardar Servicio como Frecuente'}</span>
        </button>
      </div>

      {/* Core CTAs */}
      <div className="flex flex-col gap-2 mb-4">
        <button
          onClick={onOpenShareModal}
          className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] active:scale-[0.99] text-white flex items-center justify-center gap-2 font-bold text-[14px] shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
          Compartir Comprobante PDF
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="w-full h-12 rounded-xl bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#1b1b1c] font-semibold text-[14px] flex items-center justify-center gap-1.5 transition-all border border-[#e5e2e1]"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          Volver al Inicio
        </button>
      </div>

      {/* Regulatory Footer */}
      <p className="text-center text-[10px] font-mono text-[#5b5e66] leading-tight">
        Scotiabank Perú S.A.A. • RUC 20100043140<br />
        Comprobante electrónico válido como constancia de pago conforme a la normativa SBS.
      </p>
    </div>
  );
};
