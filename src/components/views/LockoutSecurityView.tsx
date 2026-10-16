import React, { useState, useEffect } from 'react';
import { ViewState } from '../../types/index.ts';
import { SCOTIABANK_LOGO_URL } from '../../data/mockData.ts';

interface LockoutSecurityViewProps {
  onNavigate: (view: ViewState) => void;
  onResetLockout: () => void;
  onQuickNotify: (msg: string) => void;
}

export const LockoutSecurityView: React.FC<LockoutSecurityViewProps> = ({
  onNavigate,
  onResetLockout,
  onQuickNotify
}) => {
  // 15 minutos = 900 segundos (según HU002 - Criterio 02)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(900);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = Math.max(0, Math.min(100, ((900 - secondsRemaining) / 900) * 100));

  const handleCallSupport = () => {
    onQuickNotify('Conectando con Banca Telefónica Scotiabank: (01) 311-6000');
  };

  const handleResetForTesting = () => {
    onResetLockout();
    onQuickNotify('Bloqueo temporal reiniciado con éxito para pruebas.');
    onNavigate('login-clave-digital');
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] px-4 py-5 justify-between animate-in fade-in duration-200">
      {/* Top Brand & Security Tag */}
      <div className="flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] border border-[#ffb4ab] text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
            <span>Bloqueo Preventivo Temporal</span>
          </div>

          <span className="text-[10px] font-mono font-bold bg-[#f6f3f2] text-[#5b5e66] px-2.5 py-1 rounded-full border border-[#e5e7eb]">
            3 de 3 Intentos Fallidos
          </span>
        </div>

        <img
          src={SCOTIABANK_LOGO_URL}
          alt="Scotiabank"
          className="h-8 w-auto object-contain mb-3"
        />

        {/* Big Alert Icon */}
        <div className="relative my-2">
          <div className="w-20 h-20 rounded-2xl bg-[#ffdad6] border-2 border-[#ec111a] flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[46px] text-[#ec111a]">
              lock_clock
            </span>
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[#1b1b1c] text-white text-[10px] font-mono font-bold shadow-xs">
            15 min
          </span>
        </div>

        <h1 className="text-[20px] font-extrabold text-[#1b1b1c] mt-3 tracking-tight">
          Acceso Bloqueado Temporalmente
        </h1>
        <p className="text-[12px] text-[#5b5e66] max-w-xs mt-1 leading-snug">
          Ingresaste una Clave Digital incorrecta en <strong className="text-[#ec111a]">3 intentos consecutivos</strong>.
        </p>
      </div>

      {/* Countdown Timer Card */}
      <div className="my-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e7eb] flex flex-col items-center text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5b5e66] mb-1">
            Tiempo de espera para reintentar
          </span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ec111a] text-[24px]">timer</span>
            <span className="font-mono text-[34px] font-extrabold text-[#ec111a] tracking-tight">
              {timeFormatted}
            </span>
          </div>
          <p className="text-[11px] text-[#5b5e66] mt-0.5">
            El sistema se desbloqueará automáticamente al finalizar la cuenta regresiva.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-[#f6f3f2] h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#ec111a] h-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Instrucción Requerida por Criterio 02: Comunicarse con Banca por Teléfono */}
        <div className="bg-[#f6f3f2] rounded-2xl p-4 border border-[#e5e2e1] space-y-2.5 text-left">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ec111a] text-[20px]">support_agent</span>
            <h2 className="text-[13px] font-bold text-[#1b1b1c]">
              Comunícate con Banca por Teléfono
            </h2>
          </div>
          <p className="text-[11px] text-[#5b5e66] leading-relaxed">
            Para desbloquear tu acceso de inmediato o validar tus credenciales de forma segura, un asesor de Scotiabank está listo para atenderte.
          </p>
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#5b5e66] block">Línea oficial 24/7</span>
              <span className="font-mono text-[14px] font-bold text-[#1b1b1c]">(01) 311-6000</span>
            </div>
            <button
              type="button"
              onClick={handleCallSupport}
              className="px-3 py-1.5 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Llamar ahora</span>
            </button>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Enlace directo a Recuperar Clave (HU003) */}
        <button
          type="button"
          onClick={() => onNavigate('recuperar-clave')}
          className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[19px]">lock_reset</span>
          <span>¿Olvidaste tu clave? Restablécela ahora</span>
        </button>

        {/* Opción de reintento / desbloqueo seguro */}
        <button
          type="button"
          onClick={handleResetForTesting}
          className="w-full h-11 bg-white hover:bg-[#f6f3f2] text-[#1b1b1c] border border-[#e5e7eb] rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[18px] text-[#006b54]">lock_open</span>
          <span>Recordé mi clave, deseo intentar de nuevo</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login-biometric')}
          className="w-full h-9 text-[#5b5e66] hover:text-[#1b1b1c] text-[12px] font-semibold flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Volver a la pantalla de bienvenida</span>
        </button>
      </div>
    </div>
  );
};
