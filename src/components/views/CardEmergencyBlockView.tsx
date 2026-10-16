import React, { useState } from 'react';
import { Account, ViewState } from '../../types/index.ts';

interface CardEmergencyBlockViewProps {
  accounts: Account[];
  onNavigate: (view: ViewState) => void;
  onBlockSuccess: (data: {
    cardId: string;
    cardName: string;
    reason: string;
    blockCode: string;
  }) => void;
  onQuickNotify: (msg: string) => void;
}

export const CardEmergencyBlockView: React.FC<CardEmergencyBlockViewProps> = ({
  accounts,
  onNavigate,
  onBlockSuccess,
  onQuickNotify
}) => {
  const cards = accounts.filter((a) => a.type === 'credito' || a.type === 'sueldo');
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || 'acc-sueldo');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blockedCode, setBlockedCode] = useState<string | null>(null);

  const selectedCard = accounts.find((a) => a.id === selectedCardId) || cards[0];

  const reasons = [
    { id: 'robo', title: 'Robo de tarjeta o dispositivo', icon: 'security' },
    { id: 'extravio', title: 'Extravío o pérdida del plástico', icon: 'search_off' },
    { id: 'fraude', title: 'Sospecha de clonación o fraude digital', icon: 'gpp_bad' },
    { id: 'retenida', title: 'Tarjeta retenida en cajero automático', icon: 'atm' }
  ];

  // HU042 Criterio 02: Validación por falta de motivo o aceptación de términos
  const isFormValid = selectedReason !== '' && acceptTerms;

  const handleOpenConfirmation = () => {
    if (!isFormValid) {
      onQuickNotify('Selecciona un motivo y acepta los términos para proceder');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleExecuteBlock = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmModalOpen(false);
      const generatedCode = `#BLQ-${Math.floor(1000000 + Math.random() * 9000000)}`;
      setBlockedCode(generatedCode);
      onBlockSuccess({
        cardId: selectedCard.id,
        cardName: selectedCard.name,
        reason: reasons.find((r) => r.id === selectedReason)?.title || 'Bloqueo definitivo',
        blockCode: generatedCode
      });
      onQuickNotify(`Tarjeta bloqueada permanentemente. Código de atención: ${generatedCode}`);
    }, 1100);
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('seguridad-tarjetas')}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#ec111a] hover:text-[#c0000f] active:scale-95 transition-all py-1 px-2 -ml-2 rounded-lg hover:bg-[#ec111a]/5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Volver a Seguridad</span>
        </button>
        <span className="text-[11px] font-semibold bg-[#ba1a1a]/10 text-[#ba1a1a] px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">emergency</span>
          Canal de Emergencia
        </span>
      </div>

      <div>
        <h2 className="text-[20px] font-bold text-[#ba1a1a] flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px]">gpp_bad</span>
          Bloqueo Definitivo de Tarjeta
        </h2>
        <p className="text-[12px] text-[#5b5e66]">
          Cancela tu tarjeta permanentemente ante robo, pérdida o sospecha de fraude (HU042).
        </p>
      </div>

      {/* Pantalla de Confirmación Exitosa de Bloqueo */}
      {blockedCode ? (
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#e5e2e1] flex flex-col items-center text-center gap-3 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">block</span>
          </div>

          <h3 className="font-extrabold text-[18px] text-[#1b1b1c]">
            Tarjeta Bloqueada Permanentemente
          </h3>
          <p className="text-[12px] text-[#5b5e66] max-w-xs">
            Tu tarjeta ha sido inhabilitada de forma irreversible en todos los comercios físicos, cajeros y pasarelas de internet.
          </p>

          {/* Código de atención oficial SBS */}
          <div className="w-full bg-[#f6f3f2] p-3.5 rounded-xl border border-[#e5e2e1] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5b5e66] block">
              Código de Atención y Constancia SBS
            </span>
            <span className="font-mono text-[20px] font-extrabold text-[#ba1a1a] tracking-wider block">
              {blockedCode}
            </span>
            <p className="text-[10px] text-[#5b5e66]">
              Fecha y hora: {new Date().toLocaleDateString('es-PE')} • {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Reposición */}
          <div className="w-full bg-[#006b54]/5 p-3 rounded-xl border border-[#006b54]/20 flex items-start gap-2.5 text-left">
            <span className="material-symbols-outlined text-[#006b54] text-[20px] shrink-0 mt-0.5">
              local_shipping
            </span>
            <div>
              <p className="text-[12px] font-bold text-[#006b54]">¿Deseas solicitar tu reposición?</p>
              <p className="text-[11px] text-[#5b5e66]">
                Recibe tu nuevo plástico con tecnología Contactless a domicilio en 24 a 48 hrs o recógelo gratis en cualquier agencia Scotiabank.
              </p>
            </div>
          </div>

          <div className="w-full pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onQuickNotify('Solicitud de reposición de tarjeta registrada con entrega prioritaria.');
                onNavigate('home');
              }}
              className="w-full h-11 bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[13px] rounded-xl active:scale-95 transition-all shadow-sm"
            >
              Solicitar Reposición a Domicilio
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full h-10 bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1b1c] font-semibold text-[12px] rounded-xl transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 1. Seleccionar Tarjeta */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#1b1b1c] uppercase tracking-wider">
              1. Selecciona la Tarjeta Afectada
            </label>
            <div className="space-y-2">
              {cards.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCardId(c.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    c.id === selectedCardId
                      ? 'border-[#ba1a1a] bg-[#ba1a1a]/5 ring-1 ring-[#ba1a1a]'
                      : 'border-[#e5e2e1] bg-white hover:bg-[#f6f3f2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">credit_card</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[13px] text-[#1b1b1c]">{c.name}</h4>
                      <p className="font-mono text-[11px] text-[#5b5e66]">•••• {c.number}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#ba1a1a] uppercase bg-[#ba1a1a]/10 px-2 py-0.5 rounded">
                    {c.type === 'credito' ? 'Crédito' : 'Débito'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Seleccionar Motivo (HU042 Criterio 01 & 02) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#1b1b1c] uppercase tracking-wider">
              2. Indica el Motivo del Bloqueo <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="space-y-2">
              {reasons.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedReason(r.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedReason === r.id
                      ? 'border-[#ba1a1a] bg-[#ba1a1a]/5 ring-1 ring-[#ba1a1a]'
                      : 'border-[#e5e2e1] bg-white hover:bg-[#f6f3f2]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-[20px] ${
                      selectedReason === r.id ? 'text-[#ba1a1a]' : 'text-[#5b5e66]'
                    }`}>
                      {r.icon}
                    </span>
                    <span className="text-[13px] font-semibold text-[#1b1b1c]">{r.title}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedReason === r.id ? 'border-[#ba1a1a] bg-[#ba1a1a]' : 'border-[#5b5e66]/40'
                  }`}>
                    {selectedReason === r.id && (
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Aceptación de Términos (HU042 Criterio 02) */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#e5e2e1] shadow-xs">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                acceptTerms ? 'bg-[#ba1a1a] text-white' : 'border border-[#5b5e66]/50 bg-white'
              }`}>
                {acceptTerms && (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                )}
              </div>
              <div className="text-[11px] text-[#5b5e66] leading-snug">
                <span className="font-bold text-[#1b1b1c] block mb-0.5">
                  Confirmación de Bloqueo Permanente
                </span>
                Declaro bajo juramento la pérdida o afectación de mi plástico. Entiendo que esta acción es inmediata e irreversible por disposición SBS.
              </div>
            </label>
          </div>

          {/* Aviso informativo si falta motivo o términos (HU042 Criterio 02) */}
          {!isFormValid && (
            <div className="p-3 bg-[#f6f3f2] rounded-xl border border-[#e5e2e1] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5b5e66] text-[18px]">info</span>
              <p className="text-[11px] font-semibold text-[#5b5e66]">
                Selecciona un motivo y acepta los términos para proceder.
              </p>
            </div>
          )}

          {/* Botón de Bloqueo */}
          <button
            onClick={handleOpenConfirmation}
            disabled={!isFormValid}
            className="w-full h-12 bg-[#ba1a1a] hover:bg-[#930008] disabled:bg-[#f0eded] disabled:text-[#5b5e66] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]">lock_clock</span>
            <span>Bloquear Tarjeta Definitivamente</span>
          </button>
        </>
      )}

      {/* Modal de Advertencia Crítica */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#303030]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl relative animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>

            <h3 className="font-bold text-[17px] text-[#1b1b1c] text-center">
              ¿Estás seguro de bloquear esta tarjeta?
            </h3>
            <p className="text-[12px] text-[#5b5e66] text-center mt-1">
              Esta acción <b>no se puede deshacer</b>. La tarjeta <b>{selectedCard.name} (•••• {selectedCard.number})</b> quedará inhabilitada para siempre.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={handleExecuteBlock}
                disabled={isProcessing}
                className="w-full h-11 bg-[#ba1a1a] hover:bg-[#930008] text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Cancelando plástico en el core bancario...</span>
                  </>
                ) : (
                  <span>Sí, Bloquear Definitivamente</span>
                )}
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-full h-9 rounded-xl text-[#5b5e66] hover:bg-[#f0eded] font-medium text-[12px] transition-colors"
              >
                Cancelar y Regresar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
