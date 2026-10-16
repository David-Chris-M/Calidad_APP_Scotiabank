import React from 'react';
import { USER_AVATAR_URL } from '../../data/mockData.ts';
import { ViewState } from '../../types/index.ts';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewState) => void;
  onNotify: (msg: string) => void;
  onRequestLogout: () => void;
  devicesCount?: number;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onNotify,
  onRequestLogout,
  devicesCount = 3
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-[#303030]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Profile Card Header */}
        <div className="p-5 bg-gradient-to-b from-[#f6f3f2] to-white border-b border-[#e5e2e1]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#006b54] bg-[#006b54]/10 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006b54] animate-pulse"></span>
              Sesión Segura TLS 1.3
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#5b5e66] hover:bg-[#e5e2e1]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={USER_AVATAR_URL}
                alt="Camila Morales Silva"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#ec111a]"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#006b54] ring-2 ring-white flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
            </div>
            <div>
              <h3 className="font-bold text-[17px] text-[#1b1b1c] leading-tight">Camila Morales Silva</h3>
              <p className="font-mono text-[11px] text-[#5b5e66] mt-0.5">DNI •••• 8492</p>
              <span className="inline-flex items-center gap-1 bg-[#ec111a]/10 text-[#ec111a] text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1">
                Cliente Scotia Plus
              </span>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {/* Security & Token Group */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#5b5e66] px-2 mb-1.5">
              Seguridad y Accesos
            </h4>
            <div className="bg-[#f6f3f2] rounded-xl overflow-hidden divide-y divide-[#e5e2e1]">
              <button
                onClick={() => {
                  onClose();
                  onNavigate('seguridad-tarjetas');
                }}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-[#eae7e7] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ec111a] text-[20px]">credit_card</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1b1b1c]">Seguridad de Tarjetas</p>
                    <p className="text-[11px] text-[#5b5e66]">Encendido, compras web, cajeros</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#5b5e66] text-[18px]">chevron_right</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate('limites-transferencia');
                }}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-[#eae7e7] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#006b54] text-[20px]">speed</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1b1b1c]">Límites de Transferencia</p>
                    <p className="text-[11px] text-[#5b5e66]">Configura tus topes diarios</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#5b5e66] text-[18px]">chevron_right</span>
              </button>

              {/* HU005 Dispositivos Autorizados */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('dispositivos-autorizados');
                }}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-[#eae7e7] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ec111a] text-[20px]">devices</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1b1b1c]">Dispositivos Autorizados</p>
                    <p className="text-[11px] text-[#5b5e66]">Gestiona tus teléfonos personales</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono font-bold bg-[#f0eded] text-[#5b5e66] px-2 py-0.5 rounded-full">
                    {devicesCount}/3
                  </span>
                  <span className="material-symbols-outlined text-[#5b5e66] text-[18px]">chevron_right</span>
                </div>
              </button>

              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#1b1b1c] text-[20px]">fingerprint</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1b1b1c]">Ingreso con Biometría</p>
                    <p className="text-[11px] text-[#5b5e66]">Face ID / Huella digital activa</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#006b54]/10 text-[#006b54] px-2 py-0.5 rounded">
                  ACTIVADO
                </span>
              </div>

              {/* HU004 Inactivity status row */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#1b1b1c] text-[20px]">timer</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1b1b1c]">Cierre por Inactividad</p>
                    <p className="text-[11px] text-[#5b5e66]">Desconexión segura tras 3 min continuos</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#006b54]/10 text-[#006b54] px-2 py-0.5 rounded">
                  3 MIN ACTIVO
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigate('cambiar-clave');
                }}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-[#eae7e7] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ec111a] text-[20px]">password</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1b1b1c]">Cambiar Clave Digital</p>
                    <p className="text-[11px] text-[#5b5e66]">Actualiza tu clave de 6 dígitos</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#5b5e66] text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Preferences Group */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#5b5e66] px-2 mb-1.5">
              Preferencias
            </h4>
            <div className="bg-[#f6f3f2] rounded-xl overflow-hidden divide-y divide-[#e5e2e1]">
              <button
                onClick={() => onNotify('Tus datos de contacto están actualizados.')}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-[#eae7e7] transition-colors"
              >
                <span className="text-[13px] text-[#1b1b1c]">Datos Personales y Correo</span>
                <span className="material-symbols-outlined text-[#5b5e66] text-[18px]">chevron_right</span>
              </button>
              <button
                onClick={() => onNotify('Tus comprobantes se guardan de forma permanente.')}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-[#eae7e7] transition-colors"
              >
                <span className="text-[13px] text-[#1b1b1c]">Historial de Comprobantes</span>
                <span className="material-symbols-outlined text-[#5b5e66] text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#5b5e66] px-2 mb-1.5">
              Soporte Scotiabank
            </h4>
            <div className="bg-[#f6f3f2] rounded-xl overflow-hidden divide-y divide-[#e5e2e1]">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[#1b1b1c]">Banca Telefónica 24/7</p>
                  <p className="text-[12px] font-mono text-[#5b5e66]">(01) 311-6000</p>
                </div>
                <span className="material-symbols-outlined text-[#ec111a]">call</span>
              </div>
            </div>
          </div>
        </div>

        {/* HU004 Criterio 01: Logout button prompts confirmation modal */}
        <div className="p-4 border-t border-[#e5e2e1]">
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestLogout();
            }}
            className="w-full h-11 rounded-xl bg-[#f0eded] hover:bg-[#ffdad6] text-[#ba1a1a] font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
