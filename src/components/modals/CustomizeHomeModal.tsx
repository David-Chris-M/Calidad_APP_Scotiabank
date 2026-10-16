import React, { useState } from 'react';
import { Account } from '../../types/index.ts';

interface CustomizeHomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onTogglePin: (accountId: string) => void;
  onSave: () => void;
}

export const CustomizeHomeModal: React.FC<CustomizeHomeModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onTogglePin,
  onSave
}) => {
  if (!isOpen) return null;

  const pinnedCount = accounts.filter((a) => a.isPinned).length;
  const [limitWarning, setLimitWarning] = useState<string | null>(null);

  const handleItemClick = (acc: Account) => {
    if (!acc.isPinned && pinnedCount >= 6) {
      setLimitWarning('Solo puedes fijar un máximo de 6 productos en el Home.');
      setTimeout(() => setLimitWarning(null), 3200);
      return;
    }
    setLimitWarning(null);
    onTogglePin(acc.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-[#303030]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl z-10 animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e2e1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ec111a] text-[22px]">push_pin</span>
            <div>
              <h3 className="font-bold text-[17px] text-[#1b1b1c]">Personalizar Inicio</h3>
              <p className="text-[12px] text-[#5b5e66]">
                Selecciona tus productos fijados (<span className="font-bold text-[#ec111a]">{pinnedCount}</span> de 6 máx.)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0eded] flex items-center justify-center text-[#5b5e66] hover:bg-[#e5e2e1]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {limitWarning && (
          <div className="mt-3 p-2.5 rounded-xl bg-[#ec111a]/10 border border-[#ec111a]/30 flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[#ec111a] text-[18px]">warning</span>
            <p className="text-[12px] font-semibold text-[#ec111a]">{limitWarning}</p>
          </div>
        )}

        <div className="py-4 space-y-2.5 max-h-[55vh] overflow-y-auto no-scrollbar">
          {accounts.map((acc) => {
            return (
              <div
                key={acc.id}
                onClick={() => handleItemClick(acc)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  acc.isPinned
                    ? 'border-[#ec111a] bg-[#ec111a]/5'
                    : 'border-[#e5e2e1] bg-white hover:bg-[#f6f3f2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    acc.type === 'credito' ? 'bg-[#ec111a]/10 text-[#ec111a]' : 'bg-[#006b54]/10 text-[#006b54]'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {acc.type === 'credito' ? 'credit_card' : 'account_balance_wallet'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-[14px] text-[#1b1b1c]">{acc.name}</h4>
                      {acc.balance === 0 && (
                        <span className="text-[10px] font-semibold bg-[#f0eded] text-[#5b5e66] px-1.5 py-0.2 rounded">
                          Nueva
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[11px] text-[#5b5e66]">•••• {acc.number}</p>
                    <p className="font-mono text-[13px] font-bold text-[#1b1b1c] mt-0.5">
                      {acc.currencySymbol} {acc.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  acc.isPinned ? 'bg-[#ec111a] text-white' : 'border border-[#5b5e66]/40 text-transparent'
                }`}>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-semibold text-[14px] shadow-sm transition-all"
          >
            Guardar Configuración ({pinnedCount} productos)
          </button>
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl text-[#5b5e66] hover:bg-[#f0eded] font-medium text-[13px] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
