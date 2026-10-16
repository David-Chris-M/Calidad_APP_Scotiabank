import React, { useState, useEffect } from 'react';
import { ViewState } from '../../types/index.ts';
import { SCOTIABANK_LOGO_URL, USER_AVATAR_URL } from '../../data/mockData.ts';

interface DigitalKeyLoginViewProps {
  onNavigate: (view: ViewState) => void;
  onLoginSuccess: (method: 'biometric' | 'digital-key') => void;
  onQuickNotify: (msg: string) => void;
  failedAttempts: number;
  onFailedAttempt: () => void;
  onResetAttempts: () => void;
  onLockout: () => void;
  currentValidKey?: string;
}

export const DigitalKeyLoginView: React.FC<DigitalKeyLoginViewProps> = ({
  onNavigate,
  onLoginSuccess,
  onQuickNotify,
  failedAttempts,
  onFailedAttempt,
  onResetAttempts,
  onLockout,
  currentValidKey = '123456'
}) => {
  const [pin, setPin] = useState<string>('');
  const [showDigits, setShowDigits] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState<boolean>(false);

  // Clave Digital válida para la banca móvil en este prototipo (HU002)
  const VALID_DIGITAL_KEY = '123456';

  // Soporte para escribir con el teclado físico de la computadora
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        if (pin.length < 6) {
          setPin((prev) => prev + e.key);
          setErrorMessage(null);
        }
      } else if (e.key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
        setErrorMessage(null);
      } else if (e.key === 'Enter' && pin.length === 6) {
        handleExecuteLogin(pin);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, failedAttempts]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMessage(null);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage(null);
  };

  // Validación según HU002 (Criterio 01 y Criterio 02)
  const handleExecuteLogin = (codeToVerify: string) => {
    if (codeToVerify.length !== 6) {
      setErrorMessage('La Clave Digital debe tener exactamente 6 dígitos');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsVerifying(false);

      if (codeToVerify === currentValidKey) {
        // • Criterio de Aceptación 01: Autenticación exitosa con Clave Digital (Camino Feliz)
        onResetAttempts();
        onLoginSuccess('digital-key');
        onQuickNotify('¡Bienvenida, Camila! Credenciales validadas con el servidor.');
      } else {
        // Clave incorrecta: gestionar intentos
        const newAttempts = failedAttempts + 1;
        onFailedAttempt();
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setPin('');

        if (newAttempts >= 3) {
          // • Criterio de Aceptación 02: Bloqueo preventivo por 3 intentos fallidos (Caso de Restricción)
          onLockout();
          onNavigate('login-lockout');
        } else {
          const remaining = 3 - newAttempts;
          setErrorMessage(`Clave Digital incorrecta. Te queda${remaining === 1 ? '' : 'n'} ${remaining} intento${remaining === 1 ? '' : 's'} antes del bloqueo preventivo.`);
          onQuickNotify(`Intento fallido ${newAttempts}/3`);
        }
      }
    }, 700);
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] px-4 py-5 justify-between animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => onNavigate('login-biometric')}
            className="w-9 h-9 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#5b5e66] hover:text-[#1b1b1c] active:scale-95"
            title="Volver a Biometría"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#5b5e66] px-2.5 py-1 rounded-full bg-[#f6f3f2] border border-[#e5e7eb] font-semibold">
              Teclado Seguro
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              failedAttempts === 0
                ? 'bg-[#006b54]/10 text-[#006b54]'
                : failedAttempts === 1
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800 animate-pulse'
            }`}>
              Intentos: {failedAttempts}/3
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowDigits(!showDigits)}
            className="w-9 h-9 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#5b5e66] hover:text-[#ec111a] active:scale-95"
            title={showDigits ? "Ocultar dígitos" : "Mostrar dígitos"}
          >
            <span className="material-symbols-outlined text-[19px]">
              {showDigits ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>

        <img
          src={SCOTIABANK_LOGO_URL}
          alt="Scotiabank"
          className="h-8 w-auto object-contain mb-2"
        />

        {/* User Card */}
        <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-full border border-[#e5e7eb] shadow-xs mb-3">
          <img
            src={USER_AVATAR_URL}
            alt="Camila Morales"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="font-semibold text-[13px] text-[#1b1b1c]">Camila Morales Silva</span>
          <span className="text-[11px] font-mono text-[#5b5e66]">•••• 8492</span>
        </div>

        <h1 className="text-[19px] font-extrabold text-[#1b1b1c] tracking-tight">
          Ingresa tu Clave Digital
        </h1>
        <p className="text-[12px] text-[#5b5e66] mt-0.5">
          Ingreso directo a tu banca móvil mediante clave numérica
        </p>

        {/* 6-PIN Slots Indicator with Shake animation */}
        <div className={`flex items-center justify-center gap-2.5 my-3.5 transition-transform ${shake ? 'animate-bounce text-[#ec111a]' : ''}`}>
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const hasVal = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-11 h-12 rounded-xl flex items-center justify-center font-mono text-[20px] font-bold transition-all ${
                  hasVal
                    ? 'border-2 border-[#ec111a] bg-white text-[#ec111a] shadow-xs scale-105'
                    : idx === pin.length
                    ? 'border-2 border-[#ec111a]/40 bg-[#ec111a]/5 animate-pulse'
                    : 'border border-[#e5e7eb] bg-[#f6f3f2] text-transparent'
                }`}
              >
                {hasVal ? (showDigits ? pin[idx] : '●') : ''}
              </div>
            );
          })}
        </div>

        {errorMessage && (
          <div className="mb-2 p-2 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-[12px] font-semibold flex items-center gap-2 max-w-xs text-left animate-in fade-in">
            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Numeric Keypad */}
      <div className="my-1.5 bg-white rounded-2xl p-3 shadow-sm border border-[#e5e7eb]">
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={isVerifying}
              onClick={() => handleKeyPress(digit)}
              className="h-12 rounded-xl bg-[#f6f3f2] hover:bg-[#ece9e8] text-[#1b1b1c] font-mono text-[20px] font-bold flex items-center justify-center active:scale-95 active:bg-[#ec111a] active:text-white transition-all shadow-2xs"
            >
              {digit}
            </button>
          ))}

          {/* Botón Limpiar */}
          <button
            type="button"
            disabled={isVerifying || pin.length === 0}
            onClick={handleClear}
            className="h-12 rounded-xl bg-[#f6f3f2] hover:bg-[#ece9e8] text-[#5b5e66] text-[12px] font-semibold flex items-center justify-center active:scale-95 transition-all disabled:opacity-40"
          >
            Limpiar
          </button>

          {/* Dígito 0 */}
          <button
            type="button"
            disabled={isVerifying}
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-xl bg-[#f6f3f2] hover:bg-[#ece9e8] text-[#1b1b1c] font-mono text-[20px] font-bold flex items-center justify-center active:scale-95 active:bg-[#ec111a] active:text-white transition-all shadow-2xs"
          >
            0
          </button>

          {/* Botón Borrar */}
          <button
            type="button"
            disabled={isVerifying || pin.length === 0}
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-[#f6f3f2] hover:bg-[#ece9e8] text-[#5b5e66] flex items-center justify-center active:scale-95 transition-all disabled:opacity-40"
            title="Borrar dígito"
          >
            <span className="material-symbols-outlined text-[20px]">backspace</span>
          </button>
        </div>
      </div>

      {/* Action and Back Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        {/* BOTÓN REQUERIDO POR CRITERIOS 01 Y 02: 'Ingresar' */}
        <button
          type="button"
          disabled={pin.length < 6 || isVerifying}
          onClick={() => handleExecuteLogin(pin)}
          className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] active:scale-[0.99] text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isVerifying ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
              <span>Validando credenciales...</span>
            </>
          ) : (
            <>
              <span>Ingresar</span>
              <span className="material-symbols-outlined text-[19px]">login</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login-biometric')}
          className="w-full h-11 bg-white hover:bg-[#f6f3f2] text-[#1b1b1c] rounded-xl font-semibold text-[13px] border border-[#e5e7eb] flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[17px] text-[#ec111a]">fingerprint</span>
          <span>Volver a Autenticación Biométrica</span>
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => onNavigate('recuperar-clave')}
            className="text-[12px] text-[#ec111a] hover:underline font-bold"
          >
            ¿Olvidaste tu Clave Digital?
          </button>
        </div>
      </div>
    </div>
  );
};
