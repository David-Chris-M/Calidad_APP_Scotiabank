import React, { useState } from 'react';
import { AuthorizedDevice, ViewState } from '../../types/index.ts';
import { SCOTIABANK_LOGO_URL } from '../../data/mockData.ts';

interface NewDeviceLoginViewProps {
  devices: AuthorizedDevice[];
  onNavigate: (view: ViewState) => void;
  onAuthorizeDevice: (device: AuthorizedDevice) => void;
  onQuickNotify: (msg: string) => void;
}

export const NewDeviceLoginView: React.FC<NewDeviceLoginViewProps> = ({
  devices,
  onNavigate,
  onAuthorizeDevice,
  onQuickNotify
}) => {
  const isLimitReached = devices.length >= 3;

  // Flow steps: 1 = OTP validation, 2 = Alias assignment and authorization
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [alias, setAlias] = useState('Mi Samsung S23');
  const [imei] = useState('359182049281034');
  const [uuid] = useState('UUID-77A2-19E4-B902');

  const handleValidateOtp = () => {
    if (otp.length < 6) {
      setOtpError('Ingresa el código OTP de 6 dígitos enviado por SMS');
      return;
    }
    setOtpError('');
    setStep(2);
  };

  const handleAuthorize = () => {
    if (!alias.trim()) return;

    const newDevice: AuthorizedDevice = {
      id: `dev-${Date.now()}`,
      alias: alias.trim(),
      model: 'Samsung Galaxy S23 (SM-S911B)',
      imei: imei,
      uuid: uuid,
      linkedDate: 'Hoy • Recién autorizado',
      isCurrent: true,
      os: 'Android'
    };

    onAuthorizeDevice(newDevice);
    onQuickNotify('Dispositivo autorizado. Notificación de seguridad enviada a tu correo.');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#fcf9f8] animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => onNavigate('login-biometric')}
            className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#5b5e66] hover:bg-[#f6f3f2] transition-colors border border-[#e5e7eb]"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <img src={SCOTIABANK_LOGO_URL} alt="Scotiabank" className="h-6 object-contain" />
          <div className="w-10" />
        </div>

        {/* ========================================================== */}
        {/* HU005 Criterio 02: Caso de Restricción (> 3 dispositivos)  */}
        {/* ========================================================== */}
        {isLimitReached ? (
          <div className="bg-white rounded-3xl p-6 border border-[#e5e7eb] shadow-md text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[36px]">phonelink_lock</span>
            </div>

            <h3 className="text-[18px] font-extrabold text-[#1b1b1c] tracking-tight mb-2">
              Límite de Dispositivos Superado
            </h3>

            {/* Exact required text for HU005 Criterio 02 */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl mb-4">
              <p className="text-[14px] font-bold text-[#ba1a1a] leading-snug">
                Has alcanzado el límite máximo de 3 dispositivos. Desvincula un equipo anterior para continuar
              </p>
            </div>

            <p className="text-[13px] text-[#5b5e66] leading-relaxed mb-6">
              Por medidas de seguridad de Scotiabank, una cuenta solo puede tener 3 teléfonos o tablets autorizados activos. Inicia sesión en tu dispositivo habitual para revocar el acceso a un equipo antiguo.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onNavigate('login-biometric')}
                className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">login</span>
                <span>Ingresar en mi dispositivo habitual</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#5b5e66] pt-1">
                <span className="material-symbols-outlined text-[15px] text-[#ec111a]">call</span>
                <span>Banca Telefónica 24/7: (01) 311-6000</span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* HU005 Criterio 01: Vinculación Exitosa (Camino Feliz)      */
          /* ========================================================== */
          <div className="bg-white rounded-3xl p-6 border border-[#e5e7eb] shadow-md animate-in zoom-in-95 duration-200">
            {step === 1 ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#ec111a]/10 text-[#ec111a] flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[32px]">phonelink_ring</span>
                </div>

                <h3 className="text-[18px] font-extrabold text-[#1b1b1c] tracking-tight mb-1">
                  Nuevo Dispositivo Detectado
                </h3>
                <p className="text-[13px] text-[#5b5e66] mb-5">
                  Para autorizar el ingreso desde este teléfono, valida el código dinámico enviado por SMS a tu número <strong>+51 984 ••• 201</strong>.
                </p>

                <div className="mb-4">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ''));
                      if (otpError) setOtpError('');
                    }}
                    placeholder="••••••"
                    className="w-full text-center text-[26px] font-mono tracking-[12px] h-14 rounded-xl border border-[#d1d5db] focus:border-[#ec111a] focus:ring-2 focus:ring-[#ec111a]/20 outline-hidden font-bold"
                  />
                  {otpError && (
                    <p className="text-red-600 text-[11px] font-bold mt-1.5">{otpError}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOtp('482910');
                    setOtpError('');
                  }}
                  className="text-[12px] text-[#ec111a] font-bold hover:underline inline-flex items-center gap-1 mb-5"
                >
                  <span className="material-symbols-outlined text-[15px]">auto_fix_high</span>
                  <span>Ingresar código recibido (482910)</span>
                </button>

                <button
                  type="button"
                  onClick={handleValidateOtp}
                  className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Validar Código OTP</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="text-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#006b54]/10 text-[#006b54] flex items-center justify-center mx-auto mb-2">
                    <span className="material-symbols-outlined text-[32px]">devices_other</span>
                  </div>
                  <h3 className="text-[18px] font-extrabold text-[#1b1b1c] tracking-tight">
                    Asigna un Alias a tu Smartphone
                  </h3>
                  <p className="text-[12px] text-[#5b5e66]">
                    Nombra este equipo para reconocerlo en tu lista de dispositivos autorizados.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1b1b1c] mb-1.5">
                      Alias del Dispositivo (ej. 'Mi Samsung S23')
                    </label>
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="ej. Mi Samsung S23"
                      className="w-full h-12 px-3.5 rounded-xl border border-[#d1d5db] focus:border-[#ec111a] focus:ring-2 focus:ring-[#ec111a]/20 outline-hidden text-[14px] font-semibold"
                    />
                  </div>

                  {/* Registered IMEI and UUID (Criterio 01) */}
                  <div className="bg-[#f6f3f2] p-3.5 rounded-2xl border border-[#e5e2e1] space-y-2 text-[11px] font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[#5b5e66] font-sans">Modelo:</span>
                      <span className="font-bold text-[#1b1b1c]">Samsung Galaxy S23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5b5e66] font-sans">Código IMEI:</span>
                      <span className="font-bold text-[#1b1b1c]">{imei}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5b5e66] font-sans">UUID Seguro:</span>
                      <span className="font-bold text-[#1b1b1c]">{uuid}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#5b5e66] leading-relaxed">
                    Al confirmar, el sistema registrará los códigos del equipo y enviará una notificación de seguridad a tu correo <strong>c•••••@gmail.com</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAuthorize}
                  className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[19px]">verified_user</span>
                  <span>Autorizar Dispositivo</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Security Seal */}
      <div className="text-center pt-4">
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#006b54] bg-[#006b54]/10 px-3 py-1 rounded-full font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#006b54] animate-pulse" />
          Protección de Identidad Scotiabank TLS 1.3
        </span>
      </div>
    </div>
  );
};
