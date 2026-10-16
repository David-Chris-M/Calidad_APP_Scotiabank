import React from 'react';
import { ViewState } from '../types/index.ts';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  // Navigation tabs definition
  const tabs = [
    {
      id: 'home' as ViewState,
      label: 'Inicio',
      icon: 'home',
      activeViews: ['home']
    },
    {
      id: 'cuentas' as ViewState,
      label: 'Cuentas',
      icon: 'account_balance_wallet',
      activeViews: ['cuentas']
    },
    {
      id: 'transfer-step1' as ViewState,
      label: 'Transferir',
      icon: 'sync_alt',
      activeViews: ['transfer-step1', 'transfer-step2', 'transfer-receipt']
    },
    {
      id: 'beneficios' as ViewState,
      label: 'Beneficios',
      icon: 'loyalty',
      activeViews: ['beneficios']
    },
    {
      id: 'seguridad-tarjetas' as ViewState,
      label: 'Ajustes',
      icon: 'settings',
      activeViews: ['seguridad-tarjetas', 'limites-transferencia'],
      hasBadge: true
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#e5e7eb] shadow-[0_-1px_12px_rgba(0,0,0,0.05)] pb-safe">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = tab.activeViews.includes(currentView);
          return (
            <button
              key={tab.label}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center w-14 h-12 transition-all relative ${
                isActive ? 'text-[#ec111a] font-bold' : 'text-[#5b5e66] hover:text-[#ec111a]'
              } active:scale-95`}
              aria-label={tab.label}
            >
              <span 
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
              {tab.hasBadge && (
                <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-[#ec111a] ring-2 ring-white"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
