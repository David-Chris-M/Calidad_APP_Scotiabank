import React, { useState } from 'react';
import { ViewState } from '../../types/index.ts';

interface ChangePasswordViewProps {
  currentKey: string;
  previousKeys: string[];
  lastModifiedDate: string;
  onNavigate: (view: ViewState) => void;
  onPasswordChangeSuccess: (newKey: string) => void;
  onQuickNotify: (msg: string) => void;
}

export const ChangePasswordView: React.FC<ChangePasswordViewProps> = ({
  currentKey,
  previousKeys,
  lastModifiedDate,
  onNavigate,
  onPasswordChangeSuccess,
  onQuickNotify
}) => {
  const [currentInput, setCurrentInput] = useState('');
  const [newInput, setNewInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Errors state
  const [currentError, setCurrentError] = useState('');
  const [newError, setNewError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  // Active focus target for numeric keypad
  const [activeField, setActiveField] = useState<'current' | 'new' | 'confirm'>('current');

  // Success modal state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Validation function for consecutive or repeated digits
  const hasConsecutiveOrRepeated = (key: string): boolean => {
    if (key.length !== 6) return false;
    // Repeated (e.g., 111111)
    if (/^(\d)\1{5}$/.test(key)) return true;
    // Ascending (e.g., 123456)
    const isAscending = key.split('').every((digit, i, arr) => i === 0 || Number(digit) === (Number(arr[i - 1]) + 1) % 10);
    if (isAscending) return true;
    // Descending (e.g., 654321)
    const isDescending = key.split('').every((digit, i, arr) => i === 0 || Number(digit) === (Number(arr[i - 1]) - 1 + 10) % 10);
    if (isDescending) return true;
    return false;
  };

  const handleKeyPress = (digit: string) => {
    if (activeField === 'current') {
      if (currentInput.length < 6) {
        const val = currentInput + digit;
        setCurrentInput(val);
        if (currentError) setCurrentError('');
      }
    } else if (activeField === 'new') {
      if (newInput.length < 6) {
        const val = newInput + digit;
        setNewInput(val);
        if (newError) setNewError('');
      }
    } else if (activeField === 'confirm') {
      if (confirmInput.length < 6) {
        const val = confirmInput + digit;
        setConfirmInput(val);
        if (confirmError) setConfirmError('');
      }
    }
  };

  const handleDelete = () => {
    if (activeField === 'current') {
      setCurrentInput((prev) => prev.slice(0, -1));
      if (currentError) setCurrentError('');
    } else if (activeField === 'new') {
      setNewInput((prev) => prev.slice(0, -1));
      if (newError) setNewError('');
    } else if (activeField === 'confirm') {
      setConfirmInput((prev) => prev.slice(0, -1));
      if (confirmError) setConfirmError('');
    }
  };

  const handleUpdatePassword = () => {
    let hasError = false;

    // 1. Validate Current Key
    if (currentInput.length !== 6) {
      setCurrentError('Digita tu clave actual completa de 6 dígitos');
      hasError = true;
    } else if (currentInput !== currentKey) {
      setCurrentError('La clave actual ingresada no coincide');
      hasError = true;
    } else {
      setCurrentError('');
    }

    // 2. Validate New Key
    if (newInput.length !== 6) {
      setNewError('La nueva clave debe tener 6 dígitos numéricos');
      hasError = true;
    } else if (hasConsecutiveOrRepeated(newInput)) {
      setNewError('La clave no debe contener números consecutivos ni repetidos');
      hasError = true;
    } else if (previousKeys.includes(newInput) || newInput === currentKey) {
      // HU006 Criterio 02: Exact textual error requirement
      setNewError('No puedes utilizar una clave registrada recientemente. Por favor ingresa una clave distinta');
      hasError = true;
    } else {
      setNewError('');
    }

    // 3. Validate Confirm Key
    if (confirmInput.length !== 6) {
      setConfirmError('Confirma tu nueva clave de 6 dígitos');
      hasError = true;
    } else if (confirmInput !== newInput) {
      setConfirmError('Las claves no coinciden. Verifica los dígitos');
      hasError = true;
    } else {
      setConfirmError('');
    }

    if (hasError) return;

    // HU006 Criterio 01: Successful key update
    setIsSuccessModalOpen(true);
  };

  const handleFinishSuccess = () => {
    setIsSuccessModalOpen(false);
    onPasswordChangeSuccess(newInput);
    onQuickNotify('Clave Digital actualizada con éxito. Inicia sesión con tu nueva clave.');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fcf9f8] p-4 space-y-4 overflow-y-auto no-scrollbar pb-24 animate-in fade-in duration-200">
      {/* Security Policy & Modification Date Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#e5e7eb] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#006b54] bg-[#006b54]/10 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006b54] animate-pulse" />
              Cifrado SHA-256 Activo
            </span>
            <span className="text-[11px] text-[#5b5e66]">
              Último cambio: <strong className="text-[#1b1b1c]">{lastModifiedDate}</strong>
            </span>
          </div>
          <p className="text-[12px] text-[#5b5e66] leading-relaxed">
            Actualizar tu clave periódicamente protege tus transacciones. Por tu seguridad, no podrás reutilizar ninguna de tus <strong>últimas 3 claves</strong> registradas.
          </p>
        </div>

        {/* Input Fields Container */}
        <div className="bg-white rounded-2xl p-4.5 border border-[#e5e7eb] shadow-xs space-y-4">
          {/* Field 1: Clave Actual */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[13px] font-bold text-[#1b1b1c]">
                1. Digita tu Clave Actual (6 dígitos)
              </label>
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="text-[11px] text-[#5b5e66] hover:text-[#1b1b1c] flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {showCurrent ? 'visibility_off' : 'visibility'}
                </span>
                <span>{showCurrent ? 'Ocultar' : 'Ver'}</span>
              </button>
            </div>

            <div
              onClick={() => setActiveField('current')}
              className={`w-full h-13 rounded-xl border flex items-center justify-between px-4 cursor-pointer transition-all ${
                activeField === 'current'
                  ? 'border-[#ec111a] ring-2 ring-[#ec111a]/20 bg-white'
                  : 'border-[#d1d5db] bg-[#fcf9f8]'
              }`}
            >
              <div className="flex items-center gap-2">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono font-bold text-[14px] ${
                      i < currentInput.length
                        ? showCurrent
                          ? 'text-[#1b1b1c]'
                          : 'bg-[#1b1b1c]'
                        : 'bg-[#e5e2e1]'
                    }`}
                  >
                    {showCurrent && i < currentInput.length ? currentInput[i] : ''}
                  </span>
                ))}
              </div>
              <span className="text-[11px] font-mono text-[#5b5e66]">
                {currentInput.length}/6
              </span>
            </div>

            {currentError && (
              <p className="text-[#ba1a1a] text-[11px] font-bold mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                <span>{currentError}</span>
              </p>
            )}

            <div className="mt-1 flex items-center justify-between text-[11px] text-[#5b5e66]">
              <span>Clave actual registrada: <strong className="font-mono text-[#1b1b1c]">{currentKey}</strong></span>
              <button
                type="button"
                onClick={() => {
                  setCurrentInput(currentKey);
                  setCurrentError('');
                  setActiveField('new');
                }}
                className="text-[#ec111a] font-bold hover:underline"
              >
                Autocompletar
              </button>
            </div>
          </div>

          {/* Field 2: Nueva Clave */}
          <div className="pt-2 border-t border-[#f0eded]">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[13px] font-bold text-[#1b1b1c]">
                2. Nueva Clave Digital (6 dígitos)
              </label>
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="text-[11px] text-[#5b5e66] hover:text-[#1b1b1c] flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {showNew ? 'visibility_off' : 'visibility'}
                </span>
                <span>{showNew ? 'Ocultar' : 'Ver'}</span>
              </button>
            </div>

            <div
              onClick={() => setActiveField('new')}
              className={`w-full h-13 rounded-xl border flex items-center justify-between px-4 cursor-pointer transition-all ${
                activeField === 'new'
                  ? 'border-[#ec111a] ring-2 ring-[#ec111a]/20 bg-white'
                  : 'border-[#d1d5db] bg-[#fcf9f8]'
              }`}
            >
              <div className="flex items-center gap-2">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono font-bold text-[14px] ${
                      i < newInput.length
                        ? showNew
                          ? 'text-[#1b1b1c]'
                          : 'bg-[#1b1b1c]'
                        : 'bg-[#e5e2e1]'
                    }`}
                  >
                    {showNew && i < newInput.length ? newInput[i] : ''}
                  </span>
                ))}
              </div>
              <span className="text-[11px] font-mono text-[#5b5e66]">
                {newInput.length}/6
              </span>
            </div>

            {/* Error box highlighting HU006 Criterio 02 rejection */}
            {newError && (
              <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-[#ba1a1a] text-[12px] font-bold flex items-start gap-1.5 leading-snug">
                  <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
                  <span>{newError}</span>
                </p>
              </div>
            )}
          </div>

          {/* Field 3: Confirmar Nueva Clave */}
          <div className="pt-2 border-t border-[#f0eded]">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[13px] font-bold text-[#1b1b1c]">
                3. Confirma tu Nueva Clave Digital
              </label>
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-[11px] text-[#5b5e66] hover:text-[#1b1b1c] flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {showConfirm ? 'visibility_off' : 'visibility'}
                </span>
                <span>{showConfirm ? 'Ocultar' : 'Ver'}</span>
              </button>
            </div>

            <div
              onClick={() => setActiveField('confirm')}
              className={`w-full h-13 rounded-xl border flex items-center justify-between px-4 cursor-pointer transition-all ${
                activeField === 'confirm'
                  ? 'border-[#ec111a] ring-2 ring-[#ec111a]/20 bg-white'
                  : 'border-[#d1d5db] bg-[#fcf9f8]'
              }`}
            >
              <div className="flex items-center gap-2">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono font-bold text-[14px] ${
                      i < confirmInput.length
                        ? showConfirm
                          ? 'text-[#1b1b1c]'
                          : 'bg-[#1b1b1c]'
                        : 'bg-[#e5e2e1]'
                    }`}
                  >
                    {showConfirm && i < confirmInput.length ? confirmInput[i] : ''}
                  </span>
                ))}
              </div>
              <span className="text-[11px] font-mono text-[#5b5e66]">
                {confirmInput.length}/6
              </span>
            </div>

            {confirmError && (
              <p className="text-[#ba1a1a] text-[11px] font-bold mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                <span>{confirmError}</span>
              </p>
            )}
          </div>
        </div>

        {/* Previous Keys Tester / Transparency Card */}
        <div className="bg-[#f6f3f2] rounded-2xl p-3.5 border border-[#e5e2e1]">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#5b5e66] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#ec111a]">history</span>
              Historial de Claves Recientes (Bloqueadas por CA02)
            </h4>
          </div>
          <p className="text-[11px] text-[#5b5e66] mb-2">
            El sistema protege contra reutilización de tus últimas 3 combinaciones registradas:
          </p>
          <div className="flex flex-wrap gap-2">
            {previousKeys.map((k, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setNewInput(k);
                  setConfirmInput(k);
                  setActiveField('new');
                }}
                className="px-2.5 py-1 bg-white border border-[#d1d5db] rounded-lg text-[12px] font-mono font-bold text-[#ba1a1a] hover:border-[#ba1a1a] flex items-center gap-1 transition-all"
                title="Probar reutilizar esta clave reciente (para verificar rechazo CA02)"
              >
                <span className="text-[10px] text-[#8a8d94] font-sans">Historial #{idx + 1}:</span>
                <span>{k}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button: Actualizar Clave */}
        <button
          type="button"
          onClick={handleUpdatePassword}
          className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">lock_reset</span>
          <span>Actualizar Clave</span>
        </button>

        {/* Numeric Keypad for authentic mobile banking feel */}
        <div className="bg-white rounded-2xl p-3 border border-[#e5e7eb] shadow-xs">
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="h-12 rounded-xl bg-[#fcf9f8] hover:bg-[#f0eded] text-[#1b1b1c] text-[18px] font-bold font-mono flex items-center justify-center active:scale-95 transition-all shadow-2xs border border-[#f0eded]"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                // Quick switch to next field
                if (activeField === 'current') setActiveField('new');
                else if (activeField === 'new') setActiveField('confirm');
                else setActiveField('current');
              }}
              className="h-12 rounded-xl bg-[#f0eded] hover:bg-[#e5e2e1] text-[#5b5e66] text-[12px] font-bold flex items-center justify-center active:scale-95 transition-all"
            >
              Cambiar campo
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-12 rounded-xl bg-[#fcf9f8] hover:bg-[#f0eded] text-[#1b1b1c] text-[18px] font-bold font-mono flex items-center justify-center active:scale-95 transition-all shadow-2xs border border-[#f0eded]"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="h-12 rounded-xl bg-[#ffdad6]/50 hover:bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">backspace</span>
            </button>
          </div>
        </div>

      {/* ========================================================== */}
      {/* HU006 Criterio 01: Modal de Éxito y Solicitud de Re-login  */}
      {/* ========================================================== */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-[#303030]/65 backdrop-blur-xs transition-opacity" />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center border border-[#e5e7eb]">
            <div className="w-16 h-16 rounded-2xl bg-[#006b54]/15 text-[#006b54] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <h3 className="text-[18px] font-extrabold text-[#1b1b1c] tracking-tight mb-2">
              ¡Clave Digital Actualizada!
            </h3>

            <p className="text-[13px] text-[#5b5e66] leading-relaxed mb-4">
              Tu Clave Digital de 6 dígitos ha sido modificada con éxito. La fecha de actualización ha sido renovada en los servidores seguros.
            </p>

            <div className="bg-[#f6f3f2] rounded-xl p-3 text-left text-[11px] text-[#5b5e66] space-y-1.5 mb-5 border border-[#e5e2e1]">
              <p>✓ Nueva fecha de modificación: <strong>Hoy ({new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })})</strong></p>
              <p>✓ Clave anterior guardada en historial de protección</p>
              <p>✓ Sesión activa cerrada por seguridad preventiva</p>
            </div>

            <button
              type="button"
              onClick={handleFinishSuccess}
              className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
            >
              <span className="material-symbols-outlined text-[19px]">login</span>
              <span>Iniciar Sesión con mi Nueva Clave</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
