import React from 'react';
import { ViewState } from '../../types/index.ts';
import { SCOTIABANK_LOGO_URL } from '../../data/mockData.ts';

interface BioErrorContingencyViewProps {
  onNavigate: (view: ViewState) => void;
  onQuickNotify: (msg: string) => void;
}

export const BioErrorContingencyView: React.FC<BioErrorContingencyViewProps> = ({
  onNavigate,
  onQuickNotify
}) => {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] px-4 py-5 justify-between animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => onNavigate('login-biometric')}
            className="w-9 h-9 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#5b5e66] hover:text-[#1b1b1c] active:scale-95"
            title="Volver"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[15px] text-amber-600">warning</span>
            <span>Contingencia • Error BIO-04</span>
          </div>

          <div className="w-9 h-9"></div> {/* Spacer */}
        </div>

        <img
          src={SCOTIABANK_LOGO_URL}
          alt="Scotiabank"
          className="h-8 w-auto object-contain mb-3"
        />

        {/* Warning Badge & Icon */}
        <div className="relative my-2">
          <div className="w-20 h-20 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[44px] text-amber-600">
              fingerprint_off
            </span>
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[#ec111a] text-white text-[10px] font-mono font-bold shadow-xs">
            BIO-04
          </span>
        </div>

        <h1 className="text-[19px] font-extrabold text-[#1b1b1c] mt-3 tracking-tight">
          No pudimos validar tu biometría
        </h1>
        <p className="text-[12px] text-[#5b5e66] max-w-xs mt-1">
          El sensor del dispositivo reportó una falla de lectura o el código <strong className="font-mono text-[#ec111a]">Error BIO-04</strong>.
        </p>
      </div>

      {/* Main Contingency Card: Pasos Recomendados */}
      <div className="my-4 space-y-3">
        {/* Banner de protección */}
        <div className="p-3 bg-[#006b54]/10 rounded-xl border border-[#006b54]/20 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-[#006b54] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <div className="text-left">
            <p className="text-[12px] font-bold text-[#006b54]">Tu cuenta no ha sido bloqueada</p>
            <p className="text-[11px] text-[#5b5e66] leading-snug">
              Puedes continuar operando de forma inmediata utilizando tu Clave Digital de respaldo.
            </p>
          </div>
        </div>

        {/* Lista de pasos recomendados de limpieza y permisos (HU001 - CA01) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e7eb] text-left">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#1b1b1c] mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-[#ec111a]">build</span>
            <span>Pasos recomendados para solucionar:</span>
          </h2>

          <div className="space-y-3">
            {/* Paso 1: Limpieza */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#f6f3f2] flex items-center justify-center font-bold text-[12px] text-[#1b1b1c] shrink-0">
                1
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[#1b1b1c]">Limpieza del sensor</p>
                <p className="text-[11px] text-[#5b5e66] leading-snug mt-0.5">
                  Limpia la pantalla o la cámara frontal con un paño suave y seco para remover grasa o polvo.
                </p>
              </div>
            </div>

            {/* Paso 2: Permisos */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#f6f3f2] flex items-center justify-center font-bold text-[12px] text-[#1b1b1c] shrink-0">
                2
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[#1b1b1c]">Permisos de la app</p>
                <p className="text-[11px] text-[#5b5e66] leading-snug mt-0.5">
                  Verifica en Ajustes de tu dispositivo que Scotiabank tenga activado el permiso de Biometría.
                </p>
              </div>
            </div>

            {/* Paso 3: Posición e iluminación */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#f6f3f2] flex items-center justify-center font-bold text-[12px] text-[#1b1b1c] shrink-0">
                3
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[#1b1b1c]">Posición e iluminación</p>
                <p className="text-[11px] text-[#5b5e66] leading-snug mt-0.5">
                  Coloca tu rostro en un lugar bien iluminado o apoya firmemente el dedo sobre el lector.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-col gap-2.5 pt-1">
        {/* BOTÓN DE ACCIÓN RÁPIDA: 'Usar Clave Digital' (Estricto Criterio 01 de HU001) */}
        <button
          type="button"
          onClick={() => onNavigate('login-clave-digital')}
          className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] active:scale-[0.99] text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">dialpad</span>
          <span>Usar Clave Digital</span>
        </button>

        {/* Botón secundario: Reintentar lectura biométrica */}
        <button
          type="button"
          onClick={() => onNavigate('login-biometric')}
          className="w-full h-11 bg-white hover:bg-[#f6f3f2] active:scale-[0.99] text-[#1b1b1c] rounded-xl font-semibold text-[13px] border border-[#e5e7eb] flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px] text-[#5b5e66]">refresh</span>
          <span>Reintentar lectura biométrica</span>
        </button>

        {/* Help footer */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onQuickNotify('Banca Telefónica Scotiabank: (01) 311-6000')}
            className="text-[11px] text-[#5b5e66] hover:underline"
          >
            ¿Necesitas ayuda con tu sensor? Llámanos al (01) 311-6000
          </button>
        </div>
      </div>
    </div>
  );
};
