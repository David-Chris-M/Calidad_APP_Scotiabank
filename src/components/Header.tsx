import React from 'react';
import { ViewState } from '../types/index.ts';
import { SCOTIABANK_LOGO_URL, USER_AVATAR_URL } from '../data/mockData.ts';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenNotifications,
  onOpenProfile,
  unreadNotificationsCount
}) => {
  const isHomeOrMain = currentView === 'home' || currentView === 'cuentas' || currentView === 'beneficios';

  // Sub-header title resolver
  const getSubHeaderTitle = () => {
    switch (currentView) {
      case 'transfer-step1':
        return 'Registro De Transferencia';
      case 'transfer-step2':
        return 'Confirmar Transferencia';
      case 'transfer-receipt':
        return 'Comprobante Digital';
      case 'pago-servicios':
        return 'Pago De Servicios';
      case 'servicio-receipt':
        return 'Comprobante De Pago';
      case 'seguridad-tarjetas':
        return 'Seguridad De Tarjetas';
      case 'limites-transferencia':
        return 'Configuracion Limites Transferencia';
      case 'dispositivos-autorizados':
        return 'Dispositivos Autorizados';
      case 'cambiar-clave':
        return 'Cambiar Clave Digital';
      case 'plin':
        return 'Plin Scotiabank';
      default:
        return 'Scotiabank';
    }
  };

  const handleBack = () => {
    if (currentView === 'transfer-step2') {
      onNavigate('transfer-step1');
    } else if (currentView === 'transfer-receipt' || currentView === 'servicio-receipt') {
      onNavigate('home');
    } else if (currentView === 'limites-transferencia') {
      onNavigate('seguridad-tarjetas');
    } else {
      onNavigate('home');
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-[#ffffff]/95 backdrop-blur-xl border-b border-[#e5e7eb] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {isHomeOrMain ? (
          <>
            {/* Logo de Scotiabank */}
            <div 
              className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" 
              onClick={() => onNavigate('home')}
            >
              <img 
                src={SCOTIABANK_LOGO_URL} 
                alt="Scotiabank Logo" 
                className="h-8 w-auto object-contain"
              />
            </div>

            {/* Accesos rápidos superiores */}
            <div className="flex items-center gap-1.5">
              {/* Botón de acceso directo a Ajustes / Seguridad */}
              <button
                aria-label="Ajustes y Seguridad"
                onClick={() => onNavigate('seguridad-tarjetas')}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f3f2] hover:bg-[#f0eded] text-[#1b1b1c] hover:text-[#ec111a] transition-colors relative active:scale-95"
                title="Ajustes y Seguridad de Tarjetas"
              >
                <span className="material-symbols-outlined text-[22px]">settings</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ec111a] ring-2 ring-white"></span>
              </button>

              {/* Botón de Notificaciones */}
              <button
                aria-label="Notificaciones"
                onClick={onOpenNotifications}
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#5b5e66] hover:text-[#ec111a] transition-colors relative active:scale-95"
                title="Centro de notificaciones"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-4 h-4 px-1 rounded-full bg-[#ec111a] text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Perfil de Camila Torres */}
              <button
                aria-label="Perfil y Configuración de Camila Torres"
                onClick={onOpenProfile}
                className="w-10 h-10 flex items-center justify-center rounded-full ring-2 ring-[#ec111a]/20 hover:ring-[#ec111a] transition-all ml-0.5 active:scale-95"
                title="Perfil de Camila Morales"
              >
                <img
                  src={USER_AVATAR_URL}
                  alt="Camila Morales"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Sub-Header con botón Volver y Título */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                aria-label="Volver"
                onClick={handleBack}
                className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-[#1b1b1c] hover:bg-[#f0eded] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <img
                src={SCOTIABANK_LOGO_URL}
                alt="Scotiabank"
                className="h-7 w-auto object-contain hidden sm:block shrink-0"
              />
              <h1 className="font-semibold text-[16px] sm:text-[17px] text-[#1b1b1c] truncate tracking-tight">
                {getSubHeaderTitle()}
              </h1>
            </div>

            {/* Insignia de seguridad y avatar */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#006b54]/10 text-[#006b54]">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span className="font-mono text-[10px] font-semibold tracking-wider uppercase">256-bit</span>
              </div>
              <button
                aria-label="Perfil"
                onClick={onOpenProfile}
                className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#ec111a]/30 ml-1"
              >
                <img
                  src={USER_AVATAR_URL}
                  alt="Camila Morales"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
