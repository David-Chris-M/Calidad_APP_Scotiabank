import React, { useState } from 'react';
import { CardSecuritySettings, ViewState } from '../../types/index.ts';

interface CardSecurityViewProps {
  cardSettings: CardSecuritySettings;
  onUpdateCardSettings: (newSettings: Partial<CardSecuritySettings>) => void;
  onNavigate: (view: ViewState) => void;
  onOpenCvv: () => void;
  onRequestPowerOff: () => void;
  onQuickNotify: (msg: string) => void;
}

export const CardSecurityView: React.FC<CardSecurityViewProps> = ({
  cardSettings,
  onUpdateCardSettings,
  onNavigate,
  onOpenCvv,
  onRequestPowerOff,
  onQuickNotify
}) => {
  // HU030 Criterio 02: Flag para simular retención de seguridad/bloqueo administrativo previo
  const [hasAdminLock, setHasAdminLock] = useState(false);
  const [adminLockError, setAdminLockError] = useState<string | null>(null);

  const handleMasterToggle = () => {
    setAdminLockError(null);
    if (cardSettings.masterActive) {
      // Apagar temporalmente (HU030 Criterio 01)
      onRequestPowerOff();
    } else {
      // Intentar encender
      if (hasAdminLock) {
        // HU030 Criterio 02: Restricción por bloqueo administrativo
        const msg = 'La tarjeta registra un bloqueo administrativo. Comunícate con Banca por Teléfono';
        setAdminLockError(msg);
        onQuickNotify(msg);
        return;
      }
      onUpdateCardSettings({ masterActive: true });
      onQuickNotify('Tarjeta Débito encendida y habilitada en tiempo real.');
    }
  };

  const handleToggleChannel = (key: keyof CardSecuritySettings, label: string) => {
    const nextVal = !cardSettings[key];
    onUpdateCardSettings({ [key]: nextVal });
    onQuickNotify(nextVal ? `${label} habilitado` : `${label} bloqueado preventivamente`);
  };

  // HU031 Criterio 02: Simular compra por internet para probar autorización o rechazo
  const handleSimulateOnlinePurchase = () => {
    if (!cardSettings.masterActive || !cardSettings.onlinePurchases) {
      const rejectMsg = 'Compra rechazada: opción Compras por Internet desactivada';
      onQuickNotify(rejectMsg);
    } else {
      onQuickNotify('Compra en comercio electrónico autorizada con Token 3D-Secure (S/ 89.90)');
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3">
      {/* Breadcrumb & Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-[#5b5e66]">
          <span className="material-symbols-outlined text-[15px]">shield_person</span>
          <span className="text-[11px] font-mono uppercase tracking-wider">
            Seguridad y Canales • Tarjeta Débito
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${
            cardSettings.masterActive
              ? 'bg-[#006b54]/10 text-[#006b54] border-[#006b54]/20'
              : 'bg-[#ec111a]/10 text-[#ec111a] border-[#ec111a]/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${cardSettings.masterActive ? 'bg-[#006b54] animate-pulse' : 'bg-[#ec111a]'}`}></span>
            <span className="text-[11px] font-bold">
              {cardSettings.masterActive ? 'Tarjeta Activa' : 'Tarjeta Apagada'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#5b5e66] bg-[#f0eded] px-2 py-0.5 rounded">
            En vivo
          </span>
        </div>
      </div>

      {/* Alerta de Bloqueo Administrativo (HU030 Criterio 02) */}
      {adminLockError && (
        <div className="mb-3 p-3 bg-[#ec111a]/10 border border-[#ec111a]/30 rounded-xl flex items-start gap-2.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[#ec111a] text-[20px] shrink-0 mt-0.5">
            gpp_maybe
          </span>
          <div>
            <p className="text-[12px] font-bold text-[#ec111a]">Bloqueo Administrativo</p>
            <p className="text-[11px] font-semibold text-[#1b1b1c] mt-0.5">{adminLockError}</p>
          </div>
        </div>
      )}

      {/* Virtual Card Graphic */}
      <div className={`relative w-full rounded-2xl p-5 shadow-xl overflow-hidden transition-all text-white mb-3 border ${
        cardSettings.masterActive
          ? 'bg-gradient-to-br from-[#1d1f24] via-[#2a2e36] to-[#121316] border-white/10'
          : 'bg-gradient-to-br from-[#3d181a] via-[#2a1a1b] to-[#1a1213] border-[#ec111a]/30'
      }`}>
        <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-[#ec111a]/20 blur-2xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-36 h-36 rounded-full bg-[#ec111a]/15 blur-xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ec111a] flex items-center justify-center font-black text-white tracking-tighter text-sm shadow-sm">
              S
            </div>
            <span className="text-[15px] font-extrabold tracking-tight text-white">Scotiabank</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white/90 border border-white/10">
            <span className="material-symbols-outlined text-[16px]">contactless</span>
            <span className="text-[10px] font-mono tracking-wider font-semibold">
              {cardSettings.masterActive ? 'VISA CONTACTLESS' : 'INACTIVA'}
            </span>
          </div>
        </div>

        {/* Chip EMV */}
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-[#d4af37] via-[#f7e49a] to-[#c59c27] shadow-inner flex items-center justify-center border border-yellow-200/40">
            <div className="w-8 h-5 border-y border-black/20 flex flex-col justify-between py-1">
              <span className="w-full h-px bg-black/25"></span>
              <span className="w-full h-px bg-black/25"></span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-white/60 tracking-wider">CHIP EMV 3D-SECURE</span>
        </div>

        {/* Masked Card Number */}
        <div className="relative z-10 mb-4">
          <div className="font-mono text-[20px] text-white tracking-[0.2em] font-medium flex items-center gap-2">
            <span>••••</span>
            <span>••••</span>
            <span>••••</span>
            <span className="text-white font-bold tracking-normal">{cardSettings.cardMasked}</span>
          </div>
        </div>

        {/* Cardholder & Expiry */}
        <div className="relative z-10 flex items-end justify-between text-white/90">
          <div>
            <span className="block text-[9px] font-mono uppercase tracking-wider text-white/50 mb-0.5">
              Titular
            </span>
            <p className="text-[13px] font-bold tracking-wide uppercase text-white">
              {cardSettings.holderName}
            </p>
          </div>
          <div className="text-right">
            <span className="block text-[9px] font-mono uppercase tracking-wider text-white/50 mb-0.5">
              Expira
            </span>
            <p className="font-mono text-[13px] font-bold text-white">{cardSettings.expiryDate}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons for Card */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={onOpenCvv}
          className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#f6f3f2] border border-[#e5e2e1] transition-all flex items-center justify-center gap-2 text-[#1b1b1c] active:scale-95 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px] text-[#ec111a]">visibility</span>
          <span className="text-[13px] font-bold">Ver Datos / CVV</span>
        </button>

        <button
          onClick={() => onNavigate('limites-transferencia')}
          className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#f6f3f2] border border-[#e5e2e1] transition-all flex items-center justify-center gap-2 text-[#1b1b1c] active:scale-95 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px] text-[#5b5e66]">tune</span>
          <span className="text-[13px] font-bold">Límites diarios</span>
        </button>
      </div>

      {/* Canales y Operatividad */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e2e1] mb-4">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="font-bold text-[16px] text-[#1b1b1c]">Canales y Operatividad</h2>
            <p className="text-[12px] text-[#5b5e66]">Control selectivo en tiempo real con efecto inmediato</p>
          </div>
          {/* Toggle de simulación de bloqueo administrativo */}
          <button
            type="button"
            onClick={() => {
              setHasAdminLock(!hasAdminLock);
              setAdminLockError(null);
              onQuickNotify(!hasAdminLock ? 'Simulación: Retención administrativa activada' : 'Simulación: Retención administrativa desactivada');
            }}
            className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all ${
              hasAdminLock ? 'bg-[#ec111a] text-white' : 'bg-[#f0eded] text-[#5b5e66]'
            }`}
            title="Simular bloqueo administrativo SBS/banco para probar HU030 Criterio 02"
          >
            {hasAdminLock ? 'Retención Admin: ON' : 'Retención: OFF'}
          </button>
        </div>

        <div className="space-y-3">
          {/* Master Switch (HU030) */}
          <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e5e2e1] transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  cardSettings.masterActive ? 'bg-[#ec111a]/10 text-[#ec111a]' : 'bg-[#ec111a] text-white'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">power_settings_new</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[13px] text-[#1b1b1c]">Encendido General de Tarjeta</p>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      cardSettings.masterActive ? 'bg-[#95f5d4] text-[#002117]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}>
                      {cardSettings.masterActive ? 'Tarjeta Encendida' : 'Tarjeta Apagada'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5b5e66] leading-snug mt-1">
                    Apaga de inmediato compras presenciales, cobros automáticos e internet temporalmente.
                  </p>
                </div>
              </div>

              {/* Master toggle button */}
              <button
                type="button"
                role="switch"
                aria-checked={cardSettings.masterActive}
                onClick={handleMasterToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                  cardSettings.masterActive ? 'bg-[#ec111a]' : 'bg-[#c3c6cf]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    cardSettings.masterActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Compras por Internet (HU031) */}
          <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e5e2e1] transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white text-[#1b1b1c] flex items-center justify-center shrink-0 mt-0.5 border border-[#e5e2e1]">
                  <span className="material-symbols-outlined text-[20px]">language</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[13px] text-[#1b1b1c]">Compras por Internet</p>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      cardSettings.onlinePurchases ? 'bg-[#95f5d4] text-[#002117]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}>
                      {cardSettings.onlinePurchases ? 'Permitido' : 'Bloqueado'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5b5e66] leading-snug mt-1">
                    Comercios web nacionales y globales, apps de delivery y servicios digitales (HU031).
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={cardSettings.onlinePurchases}
                onClick={() => handleToggleChannel('onlinePurchases', 'Compras por Internet')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                  cardSettings.onlinePurchases ? 'bg-[#ec111a]' : 'bg-[#c3c6cf]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    cardSettings.onlinePurchases ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Uso en el Extranjero */}
          <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e5e2e1] transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white text-[#1b1b1c] flex items-center justify-center shrink-0 mt-0.5 border border-[#e5e2e1]">
                  <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[13px] text-[#1b1b1c]">Uso en el Extranjero</p>
                  <p className="text-[11px] text-[#5b5e66] leading-snug mt-1">
                    Autoriza compras físicas y retiros en cajeros fuera de Perú (HU031 Criterio 01).
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={cardSettings.foreignUsage}
                onClick={() => handleToggleChannel('foreignUsage', 'Uso en el Extranjero')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                  cardSettings.foreignUsage ? 'bg-[#ec111a]' : 'bg-[#c3c6cf]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    cardSettings.foreignUsage ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* POS Físicos y Cajeros */}
          <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e5e2e1] transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white text-[#1b1b1c] flex items-center justify-center shrink-0 mt-0.5 border border-[#e5e2e1]">
                  <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[13px] text-[#1b1b1c]">POS Físicos y Cajeros</p>
                  <p className="text-[11px] text-[#5b5e66] leading-snug mt-1">
                    Pagos con chip / sin contacto y retiros en cajeros automáticos a nivel nacional.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={cardSettings.posAtm}
                onClick={() => handleToggleChannel('posAtm', 'POS y Cajeros')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                  cardSettings.posAtm ? 'bg-[#ec111a]' : 'bg-[#c3c6cf]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    cardSettings.posAtm ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Botón de prueba para HU031 Criterio 02: Simular compra por internet */}
        <div className="mt-3 pt-3 border-t border-[#f0eded]">
          <button
            type="button"
            onClick={handleSimulateOnlinePurchase}
            className="w-full py-2 px-3 rounded-xl bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1b1c] text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ec111a]">shopping_cart</span>
            <span>Simular intento de compra por Internet</span>
          </button>
        </div>
      </div>

      {/* Botón Reportar por Robo o Extravío (HU042) */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onNavigate('bloqueo-tarjeta-emergencia')}
          className="w-full h-12 rounded-xl bg-white hover:bg-[#ffdad6] text-[#ba1a1a] font-bold text-[14px] flex items-center justify-center gap-2 shadow-xs border border-[#ffdad6] active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">gpp_bad</span>
          <span>Bloquear Tarjeta por Robo o Extravío (HU042)</span>
        </button>
        <p className="text-center text-[10px] font-mono text-[#5b5e66]">
          Atención de emergencia 24/7 sin costo al (01) 311-6000
        </p>
      </div>
    </div>
  );
};
