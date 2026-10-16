import React, { useState } from 'react';
import { Account, Transaction, ViewState } from '../../types/index.ts';

interface AccountsViewProps {
  accounts: Account[];
  transactions: Transaction[];
  onNavigate: (view: ViewState) => void;
  onOpenCvv: () => void;
  onQuickNotify: (msg: string) => void;
  selectedAccountId?: string | null;
  onSelectAccount?: (accountId: string | null) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  transactions,
  onNavigate,
  onOpenCvv,
  onQuickNotify,
  selectedAccountId,
  onSelectAccount
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(selectedAccountId || null);
  const [filterType, setFilterType] = useState<'all' | 'cuentas' | 'tarjetas' | 'inversiones'>('all');
  const [movementFilter, setMovementFilter] = useState<'all' | 'in' | 'out'>('all');

  const activeAccountId = selectedAccountId !== undefined ? selectedAccountId : internalSelectedId;

  const setActiveAccountId = (id: string | null) => {
    setInternalSelectedId(id);
    if (onSelectAccount) {
      onSelectAccount(id);
    }
  };

  const selectedAccount = accounts.find((a) => a.id === activeAccountId);

  // Totales consolidados por moneda
  const totalSoles = accounts
    .filter((a) => a.currency === 'PEN' && a.type !== 'credito')
    .reduce((acc, curr) => acc + curr.balance, 0);

  const totalDolares = accounts
    .filter((a) => a.currency === 'USD')
    .reduce((acc, curr) => acc + curr.balance, 0);

  const filteredAccounts = accounts.filter((a) => {
    if (filterType === 'cuentas') return a.type === 'sueldo' || a.type === 'ahorros';
    if (filterType === 'tarjetas') return a.type === 'credito';
    if (filterType === 'inversiones') return a.type === 'plazo';
    return true;
  });

  // HU017: Si hay una cuenta seleccionada, mostramos la pantalla de Detalle de Cuenta
  if (selectedAccount) {
    const isCredit = selectedAccount.type === 'credito';
    const isPlazo = selectedAccount.type === 'plazo';
    const accountCci = `009-170-000000${selectedAccount.number}-22`;

    // Filtrar movimientos específicos de esta cuenta
    const accountTransactions = transactions
      .filter((t) => t.account === selectedAccount.name)
      .filter((t) => {
        if (movementFilter === 'in') return t.isCredit;
        if (movementFilter === 'out') return !t.isCredit;
        return true;
      });

    return (
      <div className="flex flex-col w-full pb-24 px-4 pt-3 gap-4 animate-in fade-in duration-200">
        {/* Barra superior de retorno */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveAccountId(null)}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#ec111a] hover:text-[#c0000f] active:scale-95 transition-all py-1 px-2 -ml-2 rounded-lg hover:bg-[#ec111a]/5"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Volver a Mis Cuentas</span>
          </button>
          <span className="text-[11px] font-mono bg-[#f0eded] text-[#5b5e66] px-2 py-0.5 rounded-full font-semibold">
            {selectedAccount.currency}
          </span>
        </div>

        {/* Tarjeta Principal de Detalle de Cuenta (HU017 Criterio 01) */}
        <div className="bg-gradient-to-br from-white to-[#f6f3f2] rounded-2xl p-5 shadow-sm border border-[#e5e2e1] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isCredit 
                  ? 'bg-[#ec111a]/10 text-[#ec111a]' 
                  : isPlazo 
                  ? 'bg-[#dfe2ec] text-[#181c22]' 
                  : 'bg-[#006b54]/10 text-[#006b54]'
              }`}>
                <span className="material-symbols-outlined text-[22px]">
                  {isCredit ? 'credit_card' : isPlazo ? 'trending_up' : 'account_balance_wallet'}
                </span>
              </div>
              <div>
                <h2 className="font-bold text-[16px] text-[#1b1b1c]">{selectedAccount.name}</h2>
                <p className="font-mono text-[12px] text-[#5b5e66]">•••• {selectedAccount.number}</p>
              </div>
            </div>
            {selectedAccount.isPinned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ec111a] bg-[#ec111a]/10 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[13px]">push_pin</span>
                Fijado
              </span>
            )}
          </div>

          {/* Saldo disponible en su moneda correspondiente */}
          <div className="my-3 py-2 border-y border-[#f0eded]">
            <span className="text-[12px] text-[#5b5e66] block font-medium">
              {isCredit ? 'Línea de crédito disponible:' : 'Saldo disponible:'}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-[28px] sm:text-[30px] font-extrabold text-[#1b1b1c] tracking-tight">
                {selectedAccount.currencySymbol} {selectedAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
              <span className="font-mono text-[13px] font-semibold text-[#5b5e66]">
                {selectedAccount.currency}
              </span>
            </div>

            {isCredit && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-[#e5e2e1] text-[12px]">
                <span className="text-[#5b5e66]">Deuda al corte:</span>
                <span className="font-mono font-bold text-[#ec111a]">
                  {selectedAccount.currencySymbol} {(selectedAccount.currentDebt || 4320).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          {/* CCI de la cuenta */}
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#e5e2e1] mb-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5b5e66] block">
                Código Interbancario (CCI)
              </span>
              <span className="font-mono text-[12px] font-bold text-[#1b1b1c]">
                {accountCci}
              </span>
            </div>
            <button
              onClick={() => onQuickNotify(`CCI de ${selectedAccount.name} copiado al portapapeles`)}
              className="text-[#ec111a] hover:text-[#c0000f] text-[11px] font-bold inline-flex items-center gap-1 bg-[#ec111a]/10 px-2 py-1 rounded-lg active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Copiar</span>
            </button>
          </div>

          {/* Botones de acción rápida */}
          <div className="flex items-center gap-2">
            {!isPlazo && (
              <button
                onClick={() => onNavigate('transfer-step1')}
                className="flex-1 py-2 px-3 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">send_money</span>
                <span>Transferir</span>
              </button>
            )}
            {(isCredit || selectedAccount.type === 'sueldo' || selectedAccount.type === 'ahorros') && (
              <button
                onClick={onOpenCvv}
                className="py-2 px-3 rounded-xl bg-white hover:bg-[#f6f3f2] text-[#1b1b1c] font-bold text-[12px] border border-[#e5e2e1] flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-[#5b5e66]">lock</span>
                <span>Ver CVV</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('estados-cuenta')}
              className="py-2 px-3 rounded-xl bg-white hover:bg-[#f6f3f2] text-[#ec111a] font-bold text-[12px] border border-[#e5e2e1] flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
              title="Descargar Estado de Cuenta PDF Oficial (HU019)"
            >
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
              <span>Estado PDF</span>
            </button>
            <button
              onClick={() => onQuickNotify(`Datos de cuenta ${selectedAccount.name} compartidos`)}
              className="py-2 px-3 rounded-xl bg-white hover:bg-[#f6f3f2] text-[#5b5e66] hover:text-[#1b1b1c] font-bold text-[12px] border border-[#e5e2e1] flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
              title="Compartir datos"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>Compartir</span>
            </button>
          </div>
        </div>

        {/* Sección: Últimos Movimientos de la Cuenta */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[14px] text-[#1b1b1c]">
              Últimos Movimientos
            </h3>
            {/* Filtros de movimientos */}
            <div className="flex gap-1 bg-[#f0eded] p-0.5 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => setMovementFilter('all')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  movementFilter === 'all' ? 'bg-white text-[#1b1b1c] shadow-xs' : 'text-[#5b5e66]'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setMovementFilter('in')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  movementFilter === 'in' ? 'bg-white text-[#006b54] shadow-xs' : 'text-[#5b5e66]'
                }`}
              >
                Ingresos
              </button>
              <button
                onClick={() => setMovementFilter('out')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  movementFilter === 'out' ? 'bg-white text-[#ec111a] shadow-xs' : 'text-[#5b5e66]'
                }`}
              >
                Salidas
              </button>
            </div>
          </div>

          {/* HU017 Criterio 02: Control de interfaz ante cuenta sin movimientos */}
          {accountTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#e5e2e1] text-center flex flex-col items-center justify-center gap-2.5 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-[#f6f3f2] text-[#5b5e66] flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[28px]">history_edu</span>
              </div>
              <h4 className="font-bold text-[15px] text-[#1b1b1c]">
                Aún no registras movimientos en esta cuenta
              </h4>
              <p className="text-[12px] text-[#5b5e66] max-w-xs leading-relaxed">
                Cuando realices pagos, transferencias o recibas depósitos con esta cuenta, tus transacciones aparecerán reflejadas aquí en tiempo real.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('transfer-step1')}
                  className="px-4 py-2 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white text-[12px] font-bold active:scale-95 transition-all shadow-sm"
                >
                  Hacer un depósito
                </button>
                <button
                  onClick={() => onQuickNotify(`Número de CCI copiado: ${accountCci}`)}
                  className="px-3 py-2 rounded-xl bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1b1c] text-[12px] font-semibold active:scale-95 transition-all"
                >
                  Copiar CCI
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-[#e5e2e1] divide-y divide-[#f0eded] overflow-hidden">
              {accountTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => onQuickNotify(`Movimiento: ${tx.title} • ${tx.currencySymbol} ${tx.amount.toFixed(2)}`)}
                  className="p-3.5 flex items-center justify-between hover:bg-[#f6f3f2] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      tx.isCredit ? 'bg-[#95f5d4]/40 text-[#006b54]' : 'bg-[#f6f3f2] text-[#1b1b1c]'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">{tx.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#1b1b1c] truncate">{tx.title}</p>
                      <p className="text-[11px] text-[#5b5e66] truncate">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-mono text-[14px] font-bold ${
                    tx.isCredit ? 'text-[#006b54]' : 'text-[#1b1b1c]'
                  }`}>
                    {tx.isCredit ? '+' : '-'}{tx.currencySymbol}{tx.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista Global Consolidada (cuando no hay cuenta seleccionada)
  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3 gap-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#1b1b1c]">Mis Cuentas y Tarjetas</h2>
          <p className="text-[12px] text-[#5b5e66]">Gestión integral de tus saldos y productos</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigate('estados-cuenta')}
            className="inline-flex items-center gap-1 bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1b1c] text-[12px] font-bold px-2.5 py-1.5 rounded-full transition-colors active:scale-95"
            title="Descargar Estados de Cuenta Oficiales en PDF (HU019)"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ec111a]">picture_as_pdf</span>
            <span className="hidden sm:inline">Estados de Cuenta</span>
          </button>
          <button
            onClick={() => onQuickNotify('Solicitud de apertura de nueva cuenta en línea iniciada')}
            className="inline-flex items-center gap-1 bg-[#ec111a]/10 hover:bg-[#ec111a]/20 text-[#ec111a] text-[12px] font-bold px-3 py-1.5 rounded-full transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Abrir Cuenta</span>
          </button>
        </div>
      </div>

      {/* Resumen Consolidado */}
      <div className="grid grid-cols-2 gap-2.5 bg-gradient-to-br from-white to-[#f6f3f2] p-3.5 rounded-2xl border border-[#e5e2e1] shadow-xs">
        <div>
          <span className="text-[11px] font-semibold text-[#5b5e66] block">Total en Soles:</span>
          <span className="font-mono text-[18px] font-bold text-[#1b1b1c]">
            S/ {totalSoles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="border-l border-[#e5e2e1] pl-3.5">
          <span className="text-[11px] font-semibold text-[#5b5e66] block">Total en Dólares:</span>
          <span className="font-mono text-[18px] font-bold text-[#1b1b1c]">
            $ {totalDolares.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1 bg-[#f0eded] rounded-xl text-[12px] font-semibold">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            filterType === 'all' ? 'bg-white text-[#1b1b1c] shadow-xs' : 'text-[#5b5e66] hover:text-[#1b1b1c]'
          }`}
        >
          Todas ({accounts.length})
        </button>
        <button
          onClick={() => setFilterType('cuentas')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            filterType === 'cuentas' ? 'bg-white text-[#1b1b1c] shadow-xs' : 'text-[#5b5e66] hover:text-[#1b1b1c]'
          }`}
        >
          Cuentas
        </button>
        <button
          onClick={() => setFilterType('tarjetas')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            filterType === 'tarjetas' ? 'bg-white text-[#1b1b1c] shadow-xs' : 'text-[#5b5e66] hover:text-[#1b1b1c]'
          }`}
        >
          Tarjetas
        </button>
        <button
          onClick={() => setFilterType('inversiones')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            filterType === 'inversiones' ? 'bg-white text-[#1b1b1c] shadow-xs' : 'text-[#5b5e66] hover:text-[#1b1b1c]'
          }`}
        >
          Plazo Fijo
        </button>
      </div>

      {/* Account Cards (Clickeables para HU017) */}
      <div className="space-y-3">
        {filteredAccounts.map((acc) => (
          <div
            key={acc.id}
            onClick={() => setActiveAccountId(acc.id)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e2e1] flex flex-col gap-3 transition-all hover:shadow-md hover:border-[#ec111a]/30 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  acc.type === 'credito' 
                    ? 'bg-[#ec111a]/10 text-[#ec111a]' 
                    : acc.type === 'plazo'
                    ? 'bg-[#dfe2ec] text-[#181c22]'
                    : 'bg-[#006b54]/10 text-[#006b54]'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {acc.type === 'credito' ? 'credit_card' : acc.type === 'plazo' ? 'trending_up' : 'account_balance_wallet'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-[14px] text-[#1b1b1c] group-hover:text-[#ec111a] transition-colors">
                      {acc.name}
                    </h3>
                    {acc.balance === 0 && (
                      <span className="text-[10px] font-semibold bg-[#f0eded] text-[#5b5e66] px-1.5 py-0.2 rounded">
                        Nueva
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-[#5b5e66]">•••• {acc.number}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {acc.isPinned && (
                  <span className="material-symbols-outlined text-[15px] text-[#ec111a]" title="Producto fijado en Home">
                    push_pin
                  </span>
                )}
                <span className="text-[10px] font-mono bg-[#f6f3f2] px-2 py-0.5 rounded text-[#5b5e66] font-bold">
                  {acc.currency}
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[11px] text-[#5b5e66] block">
                  {acc.type === 'credito' ? 'Línea disponible:' : 'Saldo disponible:'}
                </span>
                <span className="font-mono text-[22px] font-extrabold text-[#1b1b1c]">
                  {acc.currencySymbol} {acc.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {acc.type === 'credito' && (
                <div className="text-right">
                  <span className="text-[11px] text-[#5b5e66] block">Deuda actual:</span>
                  <span className="font-mono text-[13px] font-bold text-[#ec111a]">
                    {acc.currencySymbol} {(acc.currentDebt || 4320).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#f0eded]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveAccountId(acc.id);
                }}
                className="flex-1 py-1.5 px-3 rounded-lg bg-[#f6f3f2] hover:bg-[#e5e2e1] text-[#1b1b1c] font-semibold text-[12px] flex items-center justify-center gap-1 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-[#006b54]">visibility</span>
                <span>Ver Movimientos</span>
              </button>
              {acc.type !== 'plazo' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('transfer-step1');
                  }}
                  className="py-1.5 px-3 rounded-lg bg-[#f6f3f2] hover:bg-[#e5e2e1] text-[#1b1b1c] font-semibold text-[12px] flex items-center justify-center gap-1 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#ec111a]">send_money</span>
                  <span>Transferir</span>
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickNotify(`Número de CCI copiado para ${acc.name}`);
                }}
                className="py-1.5 px-3 rounded-lg bg-[#f6f3f2] hover:bg-[#e5e2e1] text-[#5b5e66] hover:text-[#1b1b1c] font-semibold text-[12px] flex items-center justify-center gap-1 active:scale-95 transition-all"
                title="Copiar CCI"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                <span>CCI</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Historial Consolidado */}
      <div className="mt-2 flex flex-col gap-2">
        <h3 className="font-bold text-[14px] text-[#1b1b1c]">Todos los Movimientos</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e2e1] divide-y divide-[#f0eded] overflow-hidden">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => onQuickNotify(`Movimiento: ${tx.title} • ${tx.account}`)}
              className="p-3.5 flex items-center justify-between hover:bg-[#f6f3f2] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  tx.isCredit ? 'bg-[#95f5d4]/40 text-[#006b54]' : 'bg-[#f6f3f2] text-[#1b1b1c]'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">{tx.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#1b1b1c] truncate">{tx.title}</p>
                  <p className="text-[11px] text-[#5b5e66] truncate">{tx.account} • {tx.date}</p>
                </div>
              </div>
              <span className={`font-mono text-[14px] font-bold ${
                tx.isCredit ? 'text-[#006b54]' : 'text-[#1b1b1c]'
              }`}>
                {tx.isCredit ? '+' : '-'}{tx.currencySymbol}{tx.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
