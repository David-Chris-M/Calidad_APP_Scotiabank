import React, { useState } from 'react';
import { Account, ViewState } from '../../types/index.ts';

interface TransferStep1ViewProps {
  accounts: Account[];
  onNavigate: (view: ViewState) => void;
  onSetTransferData: (data: {
    originAccount: Account;
    transferType: 'propias' | 'terceros' | 'otros';
    destAccount: string;
    recipientName: string;
    amount: number;
    concept: string;
    isDeferred?: boolean;
    deferredNotice?: string;
  }) => void;
}

export const TransferStep1View: React.FC<TransferStep1ViewProps> = ({
  accounts,
  onNavigate,
  onSetTransferData
}) => {
  const eligibleAccounts = accounts.filter((a) => a.type !== 'credito');
  const [selectedAccount, setSelectedAccount] = useState<Account>(
    eligibleAccounts.find((a) => a.type === 'sueldo') || eligibleAccounts[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [transferType, setTransferType] = useState<'propias' | 'terceros' | 'otros'>('terceros');
  const [destAccount, setDestAccount] = useState('00012398471');
  const [recipientName, setRecipientName] = useState('Carlos Mendoza Ruiz');
  const [destBank, setDestBank] = useState('Scotiabank Perú');
  const [amount, setAmount] = useState('450.00');
  const [concept, setConcept] = useState('Alquiler oficina');
  const [isValidating, setIsValidating] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);

  // HU023 Criterio 02: Horario diferido CCE
  const [isDeferred, setIsDeferred] = useState(false);
  const deferredMessage = 'La transferencia se acreditará el siguiente día útil a partir de las 08:30 a.m.';

  const handleQuickAdd = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toFixed(2));
    setAmountError(null);
  };

  const handleTransferTypeChange = (type: 'propias' | 'terceros' | 'otros') => {
    setTransferType(type);
    if (type === 'propias') {
      const ownTarget = accounts.find((a) => a.id !== selectedAccount.id && a.type !== 'credito') || accounts[1];
      setDestAccount(`0001-9482-••••-${ownTarget.number}`);
      setRecipientName(`Mi ${ownTarget.name}`);
      setDestBank('Scotiabank Perú');
    } else if (type === 'terceros') {
      setDestAccount('0001-2398-4710');
      setRecipientName('Carlos Mendoza Ruiz');
      setDestBank('Scotiabank Perú');
    } else {
      // HU023 Criterio 01: CCI de 20 dígitos y consulta CCE
      setDestAccount('002-194-001928374829-10');
      setRecipientName('Roberto Carlos Gómez Bolaños');
      setDestBank('Banco de Crédito del Perú (BCP)');
    }
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    const num = parseFloat(val);
    if (num > selectedAccount.balance) {
      setAmountError('Saldo insuficiente para realizar la operación');
    } else {
      setAmountError(null);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (!numAmount || numAmount <= 0) {
      setAmountError('Ingresa un monto válido para transferir');
      return;
    }

    // HU022 Criterio 02: Restricción por saldo insuficiente
    if (numAmount > selectedAccount.balance) {
      setAmountError('Saldo insuficiente para realizar la operación');
      return;
    }

    setAmountError(null);
    setIsValidating(true);

    setTimeout(() => {
      setIsValidating(false);
      onSetTransferData({
        originAccount: selectedAccount,
        transferType,
        destAccount,
        recipientName,
        amount: numAmount,
        concept: concept || 'Transferencia de fondos',
        isDeferred: transferType === 'otros' && isDeferred,
        deferredNotice: transferType === 'otros' && isDeferred ? deferredMessage : undefined
      });
      onNavigate('transfer-step2');
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Stepper de Progreso y Contexto */}
      <section className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#ec111a] text-white font-mono text-[11px] font-bold">
              1
            </span>
            <span className="text-[15px] font-bold text-[#1b1b1c]">
              Datos de la transferencia
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#5b5e66] uppercase tracking-wider font-semibold">
            Paso 1 de 2
          </span>
        </div>
        {/* Barra de progreso */}
        <div className="w-full flex gap-1.5 h-1.5 rounded-full overflow-hidden bg-[#e5e7eb]">
          <div className="w-1/2 bg-[#ec111a] rounded-full transition-all duration-300"></div>
          <div className="w-1/2 bg-[#e5e7eb] rounded-full"></div>
        </div>
      </section>

      {/* Formulario */}
      <form onSubmit={handleContinue} className="flex flex-col gap-4 px-4 mt-2">
        {/* 1. Selector de Cuenta de Origen */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center px-0.5">
            <label className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-wider">
              Cuenta de Origen
            </label>
            <span className="text-[11px] font-semibold text-[#006b54] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006b54] animate-pulse"></span> Activa
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full text-left bg-white p-3.5 rounded-2xl shadow-sm border border-[#e5e7eb] hover:border-[#ec111a]/40 transition-all flex items-center justify-between active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#ec111a]/10 flex items-center justify-center text-[#ec111a] shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-[15px] text-[#1b1b1c] truncate">
                    {selectedAccount.name}
                  </span>
                  <span className="font-mono text-[12px] text-[#5b5e66]">
                    •••• {selectedAccount.number}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-[#5b5e66]">Saldo disp:</span>
                    <span className="font-mono text-[14px] text-[#ec111a] font-bold">
                      {selectedAccount.currencySymbol} {selectedAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#f6f3f2] flex items-center justify-center text-[#5b5e66]">
                <span className={`material-symbols-outlined text-[20px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>
            </button>

            {/* Dropdown de cuentas */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-[#e5e7eb] z-30 p-2 flex flex-col gap-1.5 animate-in fade-in duration-150">
                {eligibleAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccount(acc);
                      setIsDropdownOpen(false);
                      setAmountError(null);
                    }}
                    className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                      acc.id === selectedAccount.id ? 'bg-[#ec111a]/5 border border-[#ec111a]/30' : 'hover:bg-[#f6f3f2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f0eded] text-[#1b1b1c] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">credit_card</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[13px] text-[#1b1b1c]">{acc.name}</p>
                        <p className="font-mono text-[11px] text-[#5b5e66]">•••• {acc.number}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[13px] font-bold text-[#1b1b1c]">
                      {acc.currencySymbol} {acc.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. Tipo de Transferencia (HU022 & HU023) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-wider">
              Destino de la Transferencia
            </label>
            <span className="inline-flex items-center gap-1 text-[#006b54] text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">bolt</span> Red CCE
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleTransferTypeChange('propias')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all shadow-xs ${
                transferType === 'propias'
                  ? 'bg-[#1b1b1c] text-white border-[#1b1b1c]'
                  : 'bg-white text-[#5b5e66] border-[#e5e7eb] hover:bg-[#f6f3f2]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] mb-1">sync_alt</span>
              <span className="text-[12px] font-semibold leading-tight">A Propias</span>
            </button>

            <button
              type="button"
              onClick={() => handleTransferTypeChange('terceros')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all shadow-xs ${
                transferType === 'terceros'
                  ? 'bg-[#ec111a] text-white border-[#ec111a]'
                  : 'bg-white text-[#5b5e66] border-[#e5e7eb] hover:bg-[#f6f3f2]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] mb-1">groups</span>
              <span className="text-[12px] font-semibold leading-tight">Terceros Scotia</span>
            </button>

            <button
              type="button"
              onClick={() => handleTransferTypeChange('otros')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all shadow-xs ${
                transferType === 'otros'
                  ? 'bg-[#ec111a] text-white border-[#ec111a]'
                  : 'bg-white text-[#5b5e66] border-[#e5e7eb] hover:bg-[#f6f3f2]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] mb-1">account_balance</span>
              <span className="text-[12px] font-semibold leading-tight">Otros Bancos CCI</span>
            </button>
          </div>
        </div>

        {/* 3. Número de Cuenta / CCI Destino */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-wider" htmlFor="dest-account-input">
            {transferType === 'otros' ? 'Código de Cuenta Interbancario (CCI - 20 dígitos)' : 'Número de Cuenta Destino'}
          </label>
          <div className="relative flex items-center">
            <input
              id="dest-account-input"
              type="text"
              value={destAccount}
              onChange={(e) => setDestAccount(e.target.value)}
              placeholder={transferType === 'otros' ? 'Ingresa los 20 dígitos CCI' : 'Ingresa número de cuenta'}
              className="w-full h-12 pl-4 pr-12 rounded-xl bg-white border border-[#e5e7eb] text-[#1b1b1c] font-mono text-[14px] shadow-sm focus:outline-none focus:border-[#ec111a] transition-all"
            />
            <button
              type="button"
              title="Contactos frecuentes"
              className="absolute right-2 w-8 h-8 rounded-lg bg-[#f6f3f2] flex items-center justify-center text-[#ec111a] hover:bg-[#ec111a]/10"
            >
              <span className="material-symbols-outlined text-[18px]">contacts</span>
            </button>
          </div>

          {/* HU023 Criterio 01: Tarjeta de Titular y Banco Destino Verificado por CCE */}
          <div className="mt-1 p-3 rounded-xl bg-[#006b54]/10 border border-[#006b54]/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#006b54] shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[14px] text-[#1b1b1c] truncate">{recipientName}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#006b54] text-white text-[10px] font-bold">
                  CCE Verificado
                </span>
              </div>
              <span className="text-[11px] text-[#006b54] font-medium">
                {destBank} • {transferType === 'otros' ? 'CCI Válido (20 dígitos)' : 'Cuenta Simple'}
              </span>
            </div>
          </div>
        </div>

        {/* HU023 Criterio 02: Selector de modalidad Inmediata vs Diferida CCE */}
        {transferType === 'otros' && (
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white border border-[#e5e2e1] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#1b1b1c]">Modalidad de Horario CCE</span>
              <button
                type="button"
                onClick={() => setIsDeferred(!isDeferred)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  isDeferred ? 'bg-[#ec111a] text-white' : 'bg-[#f0eded] text-[#5b5e66]'
                }`}
              >
                {isDeferred ? 'Transferencia Diferida (ON)' : 'Inmediata (Horario regular)'}
              </button>
            </div>

            {/* HU023 Criterio 02: Notificación oficial de acreditación diferida */}
            {isDeferred && (
              <div className="mt-2 p-2.5 bg-[#ec111a]/10 border border-[#ec111a]/30 rounded-xl flex items-start gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[#ec111a] text-[18px] shrink-0 mt-0.5">
                  schedule
                </span>
                <div>
                  <p className="text-[12px] font-bold text-[#ec111a]">Operación fuera del horario inmediato:</p>
                  <p className="text-[11px] font-semibold text-[#1b1b1c] mt-0.5">{deferredMessage}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Monto a Transferir (HU022 Criterio 02) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-wider" htmlFor="transfer-amt-input">
              Monto a Transferir
            </label>
            <span className="text-[11px] font-mono text-[#5b5e66]">
              Disponible: {selectedAccount.currencySymbol} {selectedAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Campo de Monto Principal con resalte rojo en saldo insuficiente */}
          <div className={`relative bg-white rounded-2xl p-3.5 shadow-sm border transition-all flex items-center gap-2 ${
            amountError ? 'border-[#ec111a] bg-[#ec111a]/5 ring-2 ring-[#ec111a]/20' : 'border-[#e5e7eb]'
          }`}>
            <span className={`text-[26px] font-bold select-none pl-1 ${amountError ? 'text-[#ec111a]' : 'text-[#ec111a]'}`}>
              {selectedAccount.currencySymbol}
            </span>
            <input
              id="transfer-amt-input"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent font-mono text-[26px] text-[#1b1b1c] font-bold focus:outline-none tracking-tight"
            />
            {amount && (
              <button
                type="button"
                onClick={() => {
                  setAmount('');
                  setAmountError(null);
                }}
                className="w-7 h-7 rounded-full bg-[#f6f3f2] flex items-center justify-center text-[#5b5e66] hover:text-[#1b1b1c]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Mensaje de error HU022 Criterio 02 */}
          {amountError && (
            <div className="p-2 bg-[#ec111a]/10 border border-[#ec111a]/30 rounded-xl flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[#ec111a] text-[18px]">error</span>
              <p className="text-[12px] font-bold text-[#ec111a]">{amountError}</p>
            </div>
          )}

          {/* Chips de atajos sugeridos */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            {[50, 100, 200, 500].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAdd(val)}
                className="px-3.5 py-1.5 rounded-xl bg-white text-[#1b1b1c] font-mono text-[13px] font-semibold border border-[#e5e7eb] hover:border-[#ec111a] hover:text-[#ec111a] shadow-xs active:scale-95 transition-all shrink-0"
              >
                + {selectedAccount.currencySymbol} {val}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Concepto o Motivo */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-wider" htmlFor="transfer-concept">
              Concepto (Opcional)
            </label>
            <span className="text-[11px] font-mono text-[#5b5e66]">{concept.length}/40</span>
          </div>
          <input
            id="transfer-concept"
            type="text"
            maxLength={40}
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Ej. Alquiler, pago de compras, cuota, etc."
            className="w-full h-12 px-4 rounded-xl bg-white border border-[#e5e7eb] text-[#1b1b1c] text-[14px] shadow-sm focus:outline-none focus:border-[#ec111a] transition-all"
          />
        </div>

        {/* 6. Botón de Acción Principal */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isValidating}
            className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] active:scale-[0.99] text-white rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md transition-all"
          >
            {isValidating ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                <span>Validando titularidad...</span>
              </>
            ) : (
              <>
                <span>Continuar</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
