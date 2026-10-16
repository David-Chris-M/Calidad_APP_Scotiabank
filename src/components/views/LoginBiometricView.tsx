import React, { useState } from 'react';
import { ViewState } from '../../types/index.ts';
import { USER_AVATAR_URL, SCOTIABANK_LOGO_URL } from '../../data/mockData.ts';

interface LoginBiometricViewProps {
  onNavigate: (view: ViewState) => void;
  onLoginSuccess: (method: 'biometric' | 'digital-key') => void;
  onQuickNotify: (msg: string) => void;
}

export const LoginBiometricView: React.FC<LoginBiometricViewProps> = ({
  onNavigate,
  onLoginSuccess,
  onQuickNotify
}) => {
  const [bioMode, setBioMode] = useState<'fingerprint' | 'faceid'>('faceid');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  // Simular escaneo exitoso
  const handleScanSuccess = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('success');
      setTimeout(() => {
        onLoginSuccess('biometric');
      }, 600);
    }, 1100);
  };

  // Simular falla del sensor con retorno del Error BIO-04 (Criterio 01 de HU001)
  const handleSimulateBioError = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('failed');
      onQuickNotify('Sensor biométrico no responde: Código retornado Error BIO-04');
      setTimeout(() => {
        onNavigate('login-bio-error');
      }, 700);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] px-4 py-6 justify-between animate-in fade-in duration-200">
      {/* Top Brand & Security Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#006b54]/10 text-[#006b54] text-[11px] font-semibold border border-[#006b54]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006b54] animate-pulse"></span>
            <span>TLS 1.3 • Conexión Cifrada</span>
          </div>
          <span className="text-[11px] font-mono text-[#5b5e66]">
            Versión 4.12
          </span>
        </div>

        <img
          src={SCOTIABANK_LOGO_URL}
          alt="Scotiabank"
          className="h-10 w-auto object-contain mb-4"
        />

        {/* User Card */}
        <div className="relative mb-3">
          <div className="relative inline-block">
            <img
              src={USER_AVATAR_URL}
              alt="Camila Morales"
              className="w-20 h-20 rounded-full object-cover shadow-md ring-4 ring-[#ec111a]/15"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#006b54] ring-2 ring-white flex items-center justify-center text-white text-[12px] font-bold">
              ✓
            </span>
          </div>
        </div>

        <h1 className="text-[20px] font-extrabold text-[#1b1b1c] tracking-tight">
          ¡Hola de nuevo, Camila!
        </h1>
        <p className="text-[12px] text-[#5b5e66] font-mono mt-0.5">
          DNI •••• 8492 • Cliente Scotia Plus
        </p>
      </div>

      {/* Central Biometric Interactive Zone */}
      <div className="my-6 bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7eb] flex flex-col items-center text-center relative overflow-hidden">
        {/* Selector de tipo de biometría */}
        <div className="flex p-1 bg-[#f6f3f2] rounded-xl mb-5 w-full max-w-[240px]">
          <button
            type="button"
            onClick={() => setBioMode('faceid')}
            className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              bioMode === 'faceid'
                ? 'bg-white text-[#ec111a] shadow-xs'
                : 'text-[#5b5e66] hover:text-[#1b1b1c]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">face</span>
            <span>Face ID</span>
          </button>
          <button
            type="button"
            onClick={() => setBioMode('fingerprint')}
            className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              bioMode === 'fingerprint'
                ? 'bg-white text-[#ec111a] shadow-xs'
                : 'text-[#5b5e66] hover:text-[#1b1b1c]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">fingerprint</span>
            <span>Huella</span>
          </button>
        </div>

        {/* Biometric Animated Scanner */}
        <div className="relative mb-5 flex items-center justify-center">
          {/* Pulsing rings */}
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              scanState === 'scanning'
                ? 'bg-[#ec111a]/15 scale-110 animate-pulse'
                : scanState === 'success'
                ? 'bg-[#006b54]/15'
                : scanState === 'failed'
                ? 'bg-amber-500/20'
                : 'bg-[#f6f3f2]'
            }`}
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all ${
                scanState === 'scanning'
                  ? 'border-[#ec111a] bg-[#ec111a]/10'
                  : scanState === 'success'
                  ? 'border-[#006b54] bg-[#006b54]/20 text-[#006b54]'
                  : scanState === 'failed'
                  ? 'border-amber-500 bg-amber-50 text-amber-600'
                  : 'border-[#e5e2e1] text-[#ec111a]'
              }`}
            >
              {scanState === 'failed' ? (
                <span className="material-symbols-outlined text-[48px] animate-bounce">
                  error
                </span>
              ) : scanState === 'success' ? (
                <span className="material-symbols-outlined text-[48px]">
                  check_circle
                </span>
              ) : (
                <span
                  className={`material-symbols-outlined text-[48px] ${
                    scanState === 'scanning' ? 'animate-pulse text-[#ec111a]' : 'text-[#ec111a]'
                  }`}
                >
                  {bioMode === 'faceid' ? 'face' : 'fingerprint'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status text */}
        <div className="mb-5">
          <p className="font-semibold text-[15px] text-[#1b1b1c]">
            {scanState === 'scanning'
              ? `Leyendo ${bioMode === 'faceid' ? 'rostro' : 'huella digital'}...`
              : scanState === 'success'
              ? '¡Identidad verificada!'
              : scanState === 'failed'
              ? 'Falla de lectura del sensor (Error BIO-04)'
              : `Autenticación con ${bioMode === 'faceid' ? 'Face ID' : 'Huella Digital'}`}
          </p>
          <p className="text-[12px] text-[#5b5e66] mt-0.5">
            {scanState === 'scanning'
              ? 'Mantén tu vista fija o el dedo sobre el sensor'
              : 'Acceso biométrico rápido y seguro'}
          </p>
        </div>

        {/* Botón Principal: Acceso Biométrico */}
        <button
          type="button"
          disabled={scanState === 'scanning'}
          onClick={handleScanSuccess}
          className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all mb-2.5"
        >
          <span className="material-symbols-outlined text-[20px]">
            {bioMode === 'faceid' ? 'face' : 'fingerprint'}
          </span>
          <span>Ingresar con {bioMode === 'faceid' ? 'Face ID' : 'Huella'}</span>
        </button>

        {/* Enlace de soporte ante falla física de sensor */}
        <button
          type="button"
          disabled={scanState === 'scanning'}
          onClick={handleSimulateBioError}
          className="w-full py-1 text-[#5b5e66] hover:text-[#ec111a] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[15px]">help_outline</span>
          <span>¿El sensor biométrico no responde o falló la lectura?</span>
        </button>
      </div>

      {/* Alternative Access Options (Criterio 02 / Respaldo) */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => onNavigate('login-clave-digital')}
          className="w-full h-12 rounded-xl bg-white hover:bg-[#f6f3f2] text-[#1b1b1c] font-semibold text-[14px] border border-[#e5e7eb] flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[19px] text-[#ec111a]">
            dialpad
          </span>
          <span>Usar Clave Digital (6 dígitos)</span>
        </button>

        {/* HU005 New Smartphone Access link */}
        <button
          type="button"
          onClick={() => onNavigate('vincular-dispositivo-login')}
          className="w-full py-2 text-[#5b5e66] hover:text-[#ec111a] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">devices</span>
          <span>¿Iniciando desde un nuevo smartphone? Vincular equipo</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-[#5b5e66] px-2 pt-2">
          <button
            type="button"
            onClick={() => onQuickNotify('Para cambiar de cliente, contáctate con soporte')}
            className="hover:underline hover:text-[#1b1b1c]"
          >
            ¿No eres Camila?
          </button>
          <div className="flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[14px] text-[#ec111a]">call</span>
            <span>Banca Telefónica: 311-6000</span>
          </div>
        </div>
      </div>
    </div>
  );
};
