import React, { useState } from 'react';
import { ViewState } from '../../types/index.ts';
import { SCOTIABANK_LOGO_URL } from '../../data/mockData.ts';

interface PasswordRecoveryViewProps {
  onNavigate: (view: ViewState) => void;
  onPasswordResetSuccess: (newKey: string) => void;
  onQuickNotify: (msg: string) => void;
}

export const PasswordRecoveryView: React.FC<PasswordRecoveryViewProps> = ({
  onNavigate,
  onPasswordResetSuccess,
  onQuickNotify
}) => {
  // Pasos: 1 = Documento, 2 = Token/SMS, 3 = Nueva Clave, 4 = Éxito
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Paso 1: Datos del documento
  const [docType, setDocType] = useState<'DNI' | 'CE' | 'Pasaporte'>('DNI');
  const [docNumber, setDocNumber] = useState('48291024');
  const [cardLastDigits, setCardLastDigits] = useState('4821');

  // Paso 2: Token Dinámico / SMS
  const [smsCode, setSmsCode] = useState(['5', '8', '2', '1', '9', '4']);
  const [timeLeft, setTimeLeft] = useState(48);

  // Paso 3: Nueva Clave y Confirmación
  const [newKey, setNewKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comprobación de números consecutivos y dígitos repetidos (Criterio 02 de HU003)
  const isWeakKey = (key: string): boolean => {
    if (key.length !== 6) return false;

    // 1. Dígitos repetidos: ej. 111111, 222222, o más de dos iguales seguidos
    const allSame = new Set(key.split('')).size === 1;
    const hasThreeSame = /(.)\1\1/.test(key);
    if (allSame || hasThreeSame) return true;

    // 2. Secuencia numérica ascendente o descendente: ej. 123456, 654321, 234567, 765432
    const digits = key.split('').map(Number);
    let isAsc = true;
    let isDesc = true;
    for (let i = 0; i < digits.length - 1; i++) {
      if (digits[i + 1] !== (digits[i] + 1) % 10) isAsc = false;
      if (digits[i + 1] !== (digits[i] - 1 + 10) % 10) isDesc = false;
    }

    return isAsc || isDesc;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber || docNumber.length < 8) {
      onQuickNotify('Ingresa un número de documento válido');
      return;
    }
    setStep(2);
    onQuickNotify('Código dinámico de seguridad enviado a tu celular por SMS');
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (smsCode.some((d) => !d)) {
      onQuickNotify('Ingresa el código dinámico completo de 6 dígitos');
      return;
    }
    setStep(3);
    onQuickNotify('Identidad verificada exitosamente. Ahora crea tu nueva clave.');
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (newKey.length !== 6 || confirmKey.length !== 6) {
      setValidationError('La Clave Digital debe tener exactamente 6 dígitos numéricos');
      return;
    }

    if (newKey !== confirmKey) {
      setValidationError('Las claves ingresadas no coinciden. Por favor verifícalas.');
      return;
    }

    // • Criterio de Aceptación 02: Rechazo por clave débil o secuencia numérica
    if (isWeakKey(newKey)) {
      setValidationError('La clave no debe contener números consecutivos ni repetidos');
      return;
    }

    // • Criterio de Aceptación 01: Restablecimiento exitoso
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onPasswordResetSuccess(newKey);
      setStep(4);
      onQuickNotify('Correo de confirmación enviado a c***@gmail.com');
    }, 900);
  };

  const handleBack = () => {
    if (step === 1) {
      onNavigate('login-clave-digital');
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else {
      onNavigate('login-clave-digital');
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] px-4 py-5 justify-between animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <div className="w-full flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#5b5e66] hover:text-[#1b1b1c] active:scale-95 transition-colors"
            title="Volver"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <span className="text-[11px] font-mono font-bold bg-[#006b54]/10 text-[#006b54] px-2.5 py-1 rounded-full border border-[#006b54]/20 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Canal Seguro Scotiabank</span>
          </span>

          <div className="w-9 h-9"></div>
        </div>

        <div className="flex flex-col items-center text-center">
          <img
            src={SCOTIABANK_LOGO_URL}
            alt="Scotiabank"
            className="h-8 w-auto object-contain mb-2"
          />
          <h1 className="text-[19px] font-extrabold text-[#1b1b1c] tracking-tight">
            {step === 4 ? '¡Restablecimiento Exitoso!' : 'Recuperar Clave Digital'}
          </h1>
          <p className="text-[12px] text-[#5b5e66] mt-0.5 max-w-xs">
            {step === 1 && 'Paso 1 de 3: Identificación de identidad'}
            {step === 2 && 'Paso 2 de 3: Validación por Token Digital / SMS'}
            {step === 3 && 'Paso 3 de 3: Creación de nueva Clave Digital'}
            {step === 4 && 'Tu nueva clave ha sido registrada'}
          </p>

          {/* Stepper progress bar */}
          {step < 4 && (
            <div className="w-full max-w-xs flex gap-1.5 h-1.5 rounded-full overflow-hidden bg-[#e5e7eb] my-3">
              <div
                className={`h-full bg-[#ec111a] rounded-full transition-all duration-300 ${
                  step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
                }`}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Main Form by Step */}
      <div className="my-auto py-2">
        {/* PASO 1: Documento de Identidad y Tarjeta */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4 max-w-sm mx-auto">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e7eb] space-y-3.5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#5b5e66] block mb-1.5">
                  Tipo de Documento
                </label>
                <div className="flex gap-2">
                  {(['DNI', 'CE', 'Pasaporte'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDocType(type)}
                      className={`flex-1 py-2 text-[12px] font-bold rounded-xl border transition-all ${
                        docType === type
                          ? 'bg-[#1b1b1c] text-white border-[#1b1b1c]'
                          : 'bg-[#f6f3f2] text-[#5b5e66] border-[#e5e2e1] hover:bg-[#eae7e7]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#5b5e66] block mb-1.5" htmlFor="doc-number-input">
                  Número de {docType}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-[18px] text-[#5b5e66] absolute left-3">
                    badge
                  </span>
                  <input
                    id="doc-number-input"
                    type="text"
                    maxLength={12}
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ej. 48291024"
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#f6f3f2] font-mono text-[14px] font-bold text-[#1b1b1c] border border-transparent focus:border-[#ec111a] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#5b5e66] block mb-1.5" htmlFor="card-digits-input">
                  Tarjeta de Débito asociada (últimos 4 dígitos)
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-[18px] text-[#5b5e66] absolute left-3">
                    credit_card
                  </span>
                  <input
                    id="card-digits-input"
                    type="text"
                    maxLength={4}
                    value={cardLastDigits}
                    onChange={(e) => setCardLastDigits(e.target.value)}
                    placeholder="4821"
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#f6f3f2] font-mono text-[14px] font-bold text-[#1b1b1c] border border-transparent focus:border-[#ec111a] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#f6f3f2] rounded-xl border border-[#e5e2e1] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#006b54] shrink-0 mt-0.5">
                verified_user
              </span>
              <p className="text-[11px] text-[#5b5e66] leading-snug">
                Validaremos tus datos con RENIEC y el servidor bancario antes de enviar el código de seguridad.
              </p>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <span>Continuar con Token / SMS</span>
              <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
            </button>
          </form>
        )}

        {/* PASO 2: Token Digital / SMS */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4 max-w-sm mx-auto text-center">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7eb] space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#ec111a]/10 text-[#ec111a] flex items-center justify-center mx-auto shadow-2xs">
                <span className="material-symbols-outlined text-[32px]">sms</span>
              </div>

              <div>
                <h2 className="text-[15px] font-bold text-[#1b1b1c]">
                  Clave dinámica enviada
                </h2>
                <p className="text-[12px] text-[#5b5e66] mt-0.5">
                  Ingresa el código de 6 dígitos enviado por SMS a tu número registrado: <strong className="font-mono text-[#1b1b1c]">984 ••• 210</strong>
                </p>
              </div>

              {/* 6 Dígitos OTP */}
              <div className="grid grid-cols-6 gap-2">
                {smsCode.map((digit, idx) => (
                  <input
                    key={idx}
                    aria-label={`Dígito ${idx + 1}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const next = [...smsCode];
                      next[idx] = e.target.value.slice(-1);
                      setSmsCode(next);
                    }}
                    className="h-12 text-center rounded-xl bg-[#f6f3f2] font-mono text-[20px] font-bold text-[#1b1b1c] border-b-2 border-[#ec111a] focus:bg-white focus:outline-none shadow-inner"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5b5e66] pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[14px] text-[#ec111a]">schedule</span>
                  <span>Expira en 00:{timeLeft.toString().padStart(2, '0')}s</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTimeLeft(60);
                    onQuickNotify('Nuevo código dinámico reenviado por SMS');
                  }}
                  className="text-[#ec111a] font-bold hover:underline"
                >
                  Reenviar código
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <span>Verificar Token</span>
              <span className="material-symbols-outlined text-[19px]">verified</span>
            </button>
          </form>
        )}

        {/* PASO 3: Creación y Confirmación de Nueva Clave (HU003 Criterios 01 y 02) */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-4 max-w-sm mx-auto">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7eb] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#1b1b1c]">
                  Crea tu nueva Clave Digital
                </span>
                <button
                  type="button"
                  onClick={() => setShowKeys(!showKeys)}
                  className="text-[11px] text-[#ec111a] font-bold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {showKeys ? 'visibility_off' : 'visibility'}
                  </span>
                  <span>{showKeys ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>

              {/* Input 1: Nueva Clave */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#5b5e66] block mb-1" htmlFor="new-key-input">
                  Nueva Clave Digital (6 dígitos)
                </label>
                <input
                  id="new-key-input"
                  type={showKeys ? 'text' : 'password'}
                  maxLength={6}
                  value={newKey}
                  onChange={(e) => {
                    setNewKey(e.target.value.replace(/\D/g, ''));
                    setValidationError(null);
                  }}
                  placeholder="••••••"
                  className="w-full h-12 px-4 rounded-xl bg-[#f6f3f2] font-mono text-[20px] font-bold text-[#1b1b1c] tracking-widest border border-transparent focus:border-[#ec111a] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              {/* Input 2: Confirmar Nueva Clave */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#5b5e66] block mb-1" htmlFor="confirm-key-input">
                  Confirma tu Nueva Clave Digital
                </label>
                <input
                  id="confirm-key-input"
                  type={showKeys ? 'text' : 'password'}
                  maxLength={6}
                  value={confirmKey}
                  onChange={(e) => {
                    setConfirmKey(e.target.value.replace(/\D/g, ''));
                    setValidationError(null);
                  }}
                  placeholder="••••••"
                  className="w-full h-12 px-4 rounded-xl bg-[#f6f3f2] font-mono text-[20px] font-bold text-[#1b1b1c] tracking-widest border border-transparent focus:border-[#ec111a] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              {/* Requisitos de Seguridad */}
              <div className="pt-2 text-[11px] text-[#5b5e66] space-y-1 bg-[#f6f3f2] p-3 rounded-xl border border-[#e5e2e1]">
                <p className="font-bold text-[#1b1b1c] mb-1">Requisitos de seguridad:</p>
                <div className="flex items-center gap-1.5">
                  <span className={`material-symbols-outlined text-[14px] ${newKey.length === 6 ? 'text-[#006b54]' : 'text-[#5b5e66]'}`}>
                    {newKey.length === 6 ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Exactamente 6 dígitos numéricos.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`material-symbols-outlined text-[14px] ${newKey && !isWeakKey(newKey) ? 'text-[#006b54]' : 'text-[#5b5e66]'}`}>
                    {newKey && !isWeakKey(newKey) ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Sin números consecutivos (ej. 123456) ni repetidos (ej. 111111).</span>
                </div>
              </div>

              {/* MENSAJE DE ERROR EN ROJO (Estricto Criterio de Aceptación 02) */}
              {validationError && (
                <div className="p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[12px] font-bold flex items-start gap-2 border border-[#ffb4ab] animate-in fade-in">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* BOTÓN TEXTUALMENTE REQUERIDO POR CRITERIO 02: 'Confirmar Nueva Clave' */}
            <button
              type="submit"
              disabled={isSubmitting || newKey.length !== 6 || confirmKey.length !== 6}
              className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                  <span>Guardando nueva clave...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Nueva Clave</span>
                  <span className="material-symbols-outlined text-[19px]">lock</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* PASO 4: Confirmación y Envío de Correo (HU003 Criterio 01 Exitoso) */}
        {step === 4 && (
          <div className="space-y-4 max-w-sm mx-auto text-center">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e2e1] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#006b54]/10 text-[#006b54] flex items-center justify-center mx-auto shadow-xs">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>

              <div>
                <h2 className="text-[17px] font-extrabold text-[#1b1b1c]">
                  ¡Clave Digital Actualizada!
                </h2>
                <p className="text-[12px] text-[#5b5e66] mt-1 leading-relaxed">
                  Registramos con éxito tu nueva Clave Digital en nuestros servidores protegidos.
                </p>
              </div>

              {/* Notificación de correo enviado según Criterio 01 */}
              <div className="p-3.5 bg-[#f6f3f2] rounded-xl border border-[#e5e2e1] text-left flex items-start gap-3">
                <span className="material-symbols-outlined text-[#ec111a] text-[20px] shrink-0 mt-0.5">
                  mark_email_read
                </span>
                <div className="text-[11px] text-[#5b5e66]">
                  <p className="font-bold text-[#1b1b1c]">Correo de confirmación enviado</p>
                  <p className="mt-0.5">
                    Hemos enviado un aviso de seguridad a tu correo electrónico registrado: <strong className="font-mono text-[#1b1b1c]">c***@gmail.com</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Iniciar sesión inmediatamente (Criterio 01) */}
            <button
              type="button"
              onClick={() => onNavigate('login-clave-digital')}
              className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <span>Iniciar Sesión con mi Nueva Clave</span>
              <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Support */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => onQuickNotify('Banca por Teléfono 24/7: (01) 311-6000')}
          className="text-[11px] text-[#5b5e66] hover:underline"
        >
          ¿Dificultades para recuperar tu clave? Llámanos al (01) 311-6000
        </button>
      </div>
    </div>
  );
};
