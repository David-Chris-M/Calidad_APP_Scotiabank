import React, { useState } from 'react';
import { AuthorizedDevice, ViewState } from '../../types/index.ts';

interface AuthorizedDevicesViewProps {
  devices: AuthorizedDevice[];
  onNavigate: (view: ViewState) => void;
  onAddDevice: (newDevice: AuthorizedDevice) => void;
  onRemoveDevice: (deviceId: string) => void;
  onQuickNotify: (msg: string) => void;
}

export const AuthorizedDevicesView: React.FC<AuthorizedDevicesViewProps> = ({
  devices,
  onNavigate,
  onAddDevice,
  onRemoveDevice,
  onQuickNotify
}) => {
  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLimitAlertOpen, setIsLimitAlertOpen] = useState(false);
  const [deviceToUnlink, setDeviceToUnlink] = useState<AuthorizedDevice | null>(null);

  // In-app device registration modal step state
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [otpCode, setOtpCode] = useState('');
  const [deviceAlias, setDeviceAlias] = useState('Mi Samsung S23');
  const [generatedImei] = useState(() => `35${Math.floor(1000000000000 + Math.random() * 9000000000000)}`);
  const [generatedUuid] = useState(() => `UUID-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
  const [otpError, setOtpError] = useState('');

  // Limit check
  const isLimitReached = devices.length >= 3;

  const handleStartLinking = () => {
    if (isLimitReached) {
      // HU005 Criterio 02: Exact alert
      setIsLimitAlertOpen(true);
      return;
    }
    setRegStep(1);
    setOtpCode('');
    setOtpError('');
    setIsRegisterModalOpen(true);
  };

  const handleValidateOtp = () => {
    if (otpCode.length < 6) {
      setOtpError('Ingresa el código numérico de 6 dígitos enviado por SMS');
      return;
    }
    setOtpError('');
    setRegStep(2);
  };

  const handleConfirmAuthorizeDevice = () => {
    if (!deviceAlias.trim()) {
      return;
    }

    const newDev: AuthorizedDevice = {
      id: `dev-${Date.now()}`,
      alias: deviceAlias.trim(),
      model: 'Samsung Galaxy S23 (SM-S911B)',
      imei: generatedImei,
      uuid: generatedUuid,
      linkedDate: 'Hoy • Recién vinculado',
      isCurrent: false,
      os: 'Android'
    };

    onAddDevice(newDev);
    setRegStep(3);
    onQuickNotify('Notificación de seguridad enviada a tu correo registrado');
  };

  const handleConfirmUnlink = () => {
    if (deviceToUnlink) {
      onRemoveDevice(deviceToUnlink.id);
      onQuickNotify(`Dispositivo "${deviceToUnlink.alias}" desvinculado con éxito.`);
      setDeviceToUnlink(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fcf9f8] p-4 space-y-4 overflow-y-auto no-scrollbar pb-24 animate-in fade-in duration-200">
      {/* Quota & Policy Card */}
        <div className="bg-white rounded-2xl p-4.5 border border-[#e5e7eb] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#ec111a]/10 text-[#ec111a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">devices</span>
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#1b1b1c]">Límite de Dispositivos</h3>
                <p className="text-[11px] text-[#5b5e66]">Máximo permitido: 3 equipos</p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-[12px] font-mono font-extrabold px-2.5 py-1 rounded-full ${
                  isLimitReached
                    ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/20'
                    : 'bg-[#006b54]/10 text-[#006b54] border border-[#006b54]/20'
                }`}
              >
                {devices.length} / 3 vinculados
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-[#f0eded] h-2.5 rounded-full overflow-hidden flex gap-1 p-0.5">
            {[1, 2, 3].map((slot) => {
              const filled = slot <= devices.length;
              return (
                <div
                  key={slot}
                  className={`flex-1 h-full rounded-full transition-all duration-300 ${
                    filled
                      ? isLimitReached
                        ? 'bg-[#ec111a]'
                        : 'bg-[#006b54]'
                      : 'bg-[#e5e2e1]'
                  }`}
                />
              );
            })}
          </div>

          <p className="text-[12px] text-[#5b5e66] mt-3 leading-relaxed">
            Por tu seguridad financiera, solo puedes autorizar hasta <strong>3 teléfonos o tablets</strong> personales. Para agregar un equipo nuevo si ya alcanzaste el tope, debes desvincular uno previo.
          </p>
        </div>

        {/* Action Button: Add Device */}
        <button
          type="button"
          onClick={handleStartLinking}
          className={`w-full h-12 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] ${
            isLimitReached
              ? 'bg-white border-2 border-dashed border-[#ba1a1a]/40 text-[#ba1a1a] hover:bg-[#ffdad6]/20'
              : 'bg-[#ec111a] hover:bg-[#c0000f] text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isLimitReached ? 'lock' : 'add_circle'}
          </span>
          <span>{isLimitReached ? 'Límite Máximo Alcanzado (3/3)' : 'Vincular Nuevo Dispositivo'}</span>
        </button>

        {/* List of Registered Devices */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#5b5e66]">
              Equipos Activos ({devices.length})
            </h4>
            <span className="text-[11px] text-[#5b5e66] flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#006b54]">verified</span>
              TLS 1.3 Seguro
            </span>
          </div>

          <div className="space-y-3">
            {devices.map((dev) => (
              <div
                key={dev.id}
                className="bg-white rounded-2xl p-4 border border-[#e5e7eb] shadow-xs hover:border-[#d1d5db] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        dev.isCurrent
                          ? 'bg-[#006b54]/10 text-[#006b54]'
                          : 'bg-[#f6f3f2] text-[#5b5e66]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {dev.os === 'iOS' ? 'phone_iphone' : 'smartphone'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-[14px] text-[#1b1b1c]">{dev.alias}</h5>
                        {dev.isCurrent && (
                          <span className="bg-[#006b54]/10 text-[#006b54] text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">check</span>
                            Este dispositivo
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#5b5e66] mt-0.5">{dev.model}</p>
                    </div>
                  </div>

                  {/* Unlink Action button */}
                  {!dev.isCurrent && (
                    <button
                      type="button"
                      onClick={() => setDeviceToUnlink(dev)}
                      className="px-2.5 py-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] text-[12px] font-bold flex items-center gap-1 transition-colors"
                      title="Desvincular este dispositivo"
                    >
                      <span className="material-symbols-outlined text-[16px]">link_off</span>
                      <span>Desvincular</span>
                    </button>
                  )}
                </div>

                {/* Device identifiers required by HU005 Criterio 01 */}
                <div className="mt-3 pt-3 border-t border-[#f0eded] grid grid-cols-2 gap-2 text-[11px] font-mono text-[#5b5e66] bg-[#fcf9f8] p-2.5 rounded-xl">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#8a8d94] block font-sans font-semibold">
                      Identificador IMEI
                    </span>
                    <span className="text-[#1b1b1c] font-semibold">{dev.imei}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#8a8d94] block font-sans font-semibold">
                      UUID de Seguridad
                    </span>
                    <span className="text-[#1b1b1c] font-semibold">{dev.uuid}</span>
                  </div>
                  <div className="col-span-2 text-[10px] text-[#8a8d94] pt-1 font-sans flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                    <span>{dev.linkedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* ========================================================== */}
      {/* HU005 Criterio 02: Restricción por superar límite de 3     */}
      {/* ========================================================== */}
      {isLimitAlertOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-[#303030]/65 backdrop-blur-xs transition-opacity"
            onClick={() => setIsLimitAlertOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center border border-[#e5e7eb]">
            <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[34px]">phonelink_lock</span>
            </div>

            {/* Exact textual requirement of HU005 Criterio 02 */}
            <h3 className="text-[17px] font-extrabold text-[#1b1b1c] tracking-tight mb-2">
              Límite Máximo de Dispositivos
            </h3>
            
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl mb-5">
              <p className="text-[13px] font-bold text-[#ba1a1a] leading-snug">
                Has alcanzado el límite máximo de 3 dispositivos. Desvincula un equipo anterior para continuar
              </p>
            </div>

            <p className="text-[12px] text-[#5b5e66] leading-relaxed mb-6">
              Para garantizar que solo tus teléfonos de uso personal tengan acceso a tus cuentas bancarias, debes eliminar un dispositivo que ya no utilices.
            </p>

            <button
              type="button"
              onClick={() => setIsLimitAlertOpen(false)}
              className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <span>Entendido, desvincular un equipo</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* Modal: Desvincular Dispositivo                             */}
      {/* ========================================================== */}
      {deviceToUnlink && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-[#303030]/65 backdrop-blur-xs transition-opacity"
            onClick={() => setDeviceToUnlink(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center border border-[#e5e7eb]">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[34px]">phonelink_erase</span>
            </div>

            <h3 className="text-[18px] font-extrabold text-[#1b1b1c] tracking-tight mb-2">
              ¿Desvincular este dispositivo?
            </h3>
            <p className="text-[13px] text-[#5b5e66] leading-relaxed mb-4">
              Se revocará el acceso bancario al equipo <strong className="text-[#1b1b1c]">"{deviceToUnlink.alias}"</strong> ({deviceToUnlink.model}). No podrá volver a ingresar sin un nuevo código OTP.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleConfirmUnlink}
                className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                <span>Confirmar Desvinculación</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceToUnlink(null)}
                className="w-full h-11 rounded-xl bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1b1c] font-semibold text-[13px] flex items-center justify-center transition-colors"
              >
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* HU005 Criterio 01: Flujo de Vinculación de Nuevo Equipo   */}
      {/* ========================================================== */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-[#303030]/65 backdrop-blur-xs transition-opacity"
            onClick={() => setIsRegisterModalOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 border border-[#e5e7eb] max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#e5e2e1]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ec111a]/10 text-[#ec111a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">add_to_home_screen</span>
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-[#1b1b1c]">Vincular Nuevo Equipo</h3>
                  <p className="text-[11px] text-[#5b5e66]">Paso {regStep} de 3</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f6f3f2] flex items-center justify-center text-[#5b5e66] hover:bg-[#e5e2e1]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Step 1: Validar código OTP */}
            {regStep === 1 && (
              <div className="p-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#ec111a]/10 text-[#ec111a] flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[30px]">sms</span>
                </div>
                <h4 className="text-[16px] font-extrabold text-[#1b1b1c] mb-1">
                  Validación de Seguridad
                </h4>
                <p className="text-[12px] text-[#5b5e66] mb-4">
                  Hemos enviado un código SMS de 6 dígitos a tu número registrado <strong>+51 984 ••• 201</strong>
                </p>

                <div className="mb-4">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setOtpCode(val);
                      if (otpError) setOtpError('');
                    }}
                    placeholder="••••••"
                    className="w-full text-center text-[24px] font-mono tracking-[10px] h-13 rounded-xl border border-[#d1d5db] focus:border-[#ec111a] focus:ring-2 focus:ring-[#ec111a]/20 outline-hidden font-bold"
                  />
                  {otpError && (
                    <p className="text-red-600 text-[11px] font-bold mt-1.5">{otpError}</p>
                  )}
                </div>

                <div className="mb-5 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode('482910');
                      setOtpError('');
                    }}
                    className="text-[11px] text-[#ec111a] font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                    <span>Ingresar código recibido (482910)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleValidateOtp}
                  className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Continuar</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            )}

            {/* Step 2: Asignar alias y autorizar dispositivo */}
            {regStep === 2 && (
              <div className="p-5">
                <div className="text-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#006b54]/10 text-[#006b54] flex items-center justify-center mx-auto mb-2">
                    <span className="material-symbols-outlined text-[30px]">phonelink_setup</span>
                  </div>
                  <h4 className="text-[16px] font-extrabold text-[#1b1b1c]">
                    Asignar Alias al Dispositivo
                  </h4>
                  <p className="text-[12px] text-[#5b5e66]">
                    Nombra este equipo para reconocerlo fácilmente en tu lista de accesos.
                  </p>
                </div>

                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1b1b1c] mb-1">
                      Alias del Dispositivo (ej. 'Mi Samsung S23')
                    </label>
                    <input
                      type="text"
                      value={deviceAlias}
                      onChange={(e) => setDeviceAlias(e.target.value)}
                      placeholder="ej. Mi Samsung S23"
                      className="w-full h-11 px-3 rounded-xl border border-[#d1d5db] focus:border-[#ec111a] focus:ring-2 focus:ring-[#ec111a]/20 outline-hidden text-[14px] font-medium"
                    />
                  </div>

                  {/* Registered IMEI and UUID (Criterio 01) */}
                  <div className="bg-[#f6f3f2] p-3 rounded-xl border border-[#e5e2e1] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#5b5e66]">Modelo detectado:</span>
                      <span className="font-bold text-[#1b1b1c]">Samsung Galaxy S23</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#5b5e66]">Código IMEI:</span>
                      <span className="font-bold text-[#1b1b1c]">{generatedImei}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#5b5e66]">Código UUID:</span>
                      <span className="font-bold text-[#1b1b1c]">{generatedUuid}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#5b5e66] leading-relaxed">
                    Al presionar <strong>"Autorizar Dispositivo"</strong>, se registrará el equipo en los servidores seguros y se enviará una notificación por correo electrónico a tu dirección registrada.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmAuthorizeDevice}
                  className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[19px]">verified_user</span>
                  <span>Autorizar Dispositivo</span>
                </button>
              </div>
            )}

            {/* Step 3: Confirmación exitosa */}
            {regStep === 3 && (
              <div className="p-5 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#006b54]/15 text-[#006b54] flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[36px]">check_circle</span>
                </div>
                <h4 className="text-[17px] font-extrabold text-[#1b1b1c] mb-1">
                  ¡Dispositivo Autorizado!
                </h4>
                <p className="text-[13px] text-[#006b54] font-bold mb-3">
                  "{deviceAlias}" registrado con éxito
                </p>

                <div className="bg-[#f6f3f2] rounded-xl p-3 text-left text-[11px] text-[#5b5e66] space-y-1.5 mb-5 border border-[#e5e2e1]">
                  <p>✓ Código IMEI/UUID registrado en la red segura TLS 1.3</p>
                  <p>✓ Notificación de seguridad enviada a: <strong>c•••••@gmail.com</strong></p>
                  <p>✓ Acceso habilitado para operar en Scotiabank Mobile App</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Ver Mis Dispositivos</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
