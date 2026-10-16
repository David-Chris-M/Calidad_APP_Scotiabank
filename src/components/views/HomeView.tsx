import React, { useState } from 'react';
import { Account, Transaction, ViewState } from '../../types/index.ts';

interface HomeViewProps {
  accounts: Account[];
  transactions: Transaction[];
  onNavigate: (view: ViewState) => void;
  onOpenCustomize: () => void;
  onOpenQr: () => void;
  onOpenCvv: () => void;
  onQuickNotify: (msg: string) => void;
  onSelectAccount?: (accountId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  accounts,
  transactions,
  onNavigate,
  onOpenCustomize,
  onOpenQr,
  onOpenCvv,
  onQuickNotify,
  onSelectAccount
}) => {
  // HU014 Criterio 02: Persistencia de preferencia de privacidad en localStorage
  const [showBalance, setShowBalance] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('scotia_privacy_show_balance');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const togglePrivacyShowBalance = () => {
    setShowBalance((prev) => {
      const nextVal = !prev;
      try {
        localStorage.setItem('scotia_privacy_show_balance', JSON.stringify(nextVal));
      } catch {
        // Safe fallback
      }
      onQuickNotify(nextVal ? 'Saldos visibles en pantalla' : 'Saldos ocultados por privacidad (****.**)');
      return nextVal;
    });
  };

  // HU013 Criterio 01: Productos fijados (hasta un máximo de 6 productos)
  const pinnedAccounts = accounts.filter((a) => a.isPinned);

  return (
    <div className="flex flex-col w-full px-4 pb-28 gap-5 pt-3">
      {/* Saludo y Bienvenida con Tipo de Cuenta */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#1b1b1c] tracking-tight">
              Hola, Camila
            </h1>
            <span className="inline-flex items-center gap-1 bg-[#ec111a]/10 text-[#ec111a] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[13px] text-[#ec111a]" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              Scotia Plus
            </span>
          </div>
          <p className="text-[12px] text-[#5b5e66] mt-0.5">
            Bienvenida a tu banca digital segura
          </p>
        </div>

        {/* Botón Escanear QR / Plin */}
        <button
          aria-label="Escanear QR"
          onClick={onOpenQr}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#e5e7eb] flex items-center justify-center text-[#5b5e66] hover:text-[#ec111a] active:scale-95 transition-all"
          title="Escanear código QR o Plin"
        >
          <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
        </button>
      </div>

      {/* SECCIÓN PRINCIPAL: Mis Productos Fijados (HU013 & HU014) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ec111a] text-[18px]">push_pin</span>
            <h2 className="text-[12px] font-bold text-[#1b1b1c] uppercase tracking-wider">
              Mis Productos Fijados{' '}
              <span className="text-[#5b5e66] font-normal font-mono text-[11px]">
                ({pinnedAccounts.length} de 6 máx.)
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {/* HU014: Icono 'Ojo' para Ocultamiento y visibilidad de saldos */}
            <button
              id="btn-toggle-eye-balance"
              aria-label="Ocultar o mostrar saldos"
              onClick={togglePrivacyShowBalance}
              className="inline-flex items-center gap-1 text-[#5b5e66] hover:text-[#1b1b1c] text-[12px] font-medium bg-[#f0eded] hover:bg-[#e5e2e1] px-2.5 py-1 rounded-full transition-colors active:scale-95"
              title={showBalance ? "Ocultar saldos en pantalla" : "Mostrar saldos"}
            >
              <span className="material-symbols-outlined text-[16px] text-[#5b5e66]">
                {showBalance ? 'visibility' : 'visibility_off'}
              </span>
              <span className="text-[11px] font-semibold">{showBalance ? 'Ocultar' : 'Ver'}</span>
            </button>

            {/* HU013: Botón Personalizar productos del Home */}
            <button
              id="btn-editar-fijados"
              onClick={onOpenCustomize}
              className="inline-flex items-center gap-1 text-[#ec111a] hover:text-[#c0000f] text-[12px] font-semibold bg-[#ec111a]/10 hover:bg-[#ec111a]/15 px-2.5 py-1 rounded-full transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
              <span>Personalizar</span>
            </button>
          </div>
        </div>

        {/* Listado dinámico de productos fijados (hasta 6) */}
        {pinnedAccounts.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-[#e5e7eb] flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#f6f3f2] flex items-center justify-center text-[#5b5e66]">
              <span className="material-symbols-outlined text-[24px]">push_pin</span>
            </div>
            <p className="text-[14px] font-bold text-[#1b1b1c]">No tienes productos fijados</p>
            <p className="text-[12px] text-[#5b5e66] max-w-xs">
              Personaliza tu inicio fijando hasta 6 cuentas o tarjetas para acceder a ellas rápidamente.
            </p>
            <button
              onClick={onOpenCustomize}
              className="mt-2 px-4 py-2 bg-[#ec111a] text-white rounded-xl text-[12px] font-bold hover:bg-[#c0000f] active:scale-95 transition-all shadow-sm"
            >
              Fijar Productos Ahora
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pinnedAccounts.map((acc) => {
              const isCredit = acc.type === 'credito';
              const isSueldo = acc.type === 'sueldo';
              const isPlazo = acc.type === 'plazo';

              return (
                <div
                  key={acc.id}
                  className="bg-gradient-to-br from-white to-[#f6f3f2] rounded-2xl p-4 shadow-sm border border-[#e5e7eb] relative overflow-hidden transition-shadow hover:shadow-md"
                >
                  <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-[#ec111a]/5 pointer-events-none"></div>

                  {/* Header de la tarjeta */}
                  <div className="flex items-center justify-between relative z-10 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        isCredit ? 'bg-[#ec111a]' : isPlazo ? 'bg-[#5b5e66]' : 'bg-[#006b54]'
                      }`}></span>
                      <span className="text-[12px] text-[#5b5e66] font-semibold tracking-wide uppercase truncate max-w-[200px]">
                        {acc.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#ec111a]" title="Producto fijado">
                        push_pin
                      </span>
                      <span className="font-mono text-[11px] text-[#5b5e66] bg-[#f0eded] px-2 py-0.5 rounded-full">
                        •••• {acc.number}
                      </span>
                    </div>
                  </div>

                  {/* Saldo y Ocultamiento HU014 */}
                  <div className="flex items-baseline justify-between relative z-10 my-1">
                    <div>
                      <span className="font-mono text-[24px] sm:text-[26px] leading-tight font-bold text-[#1b1b1c]">
                        {showBalance ? (
                          `${acc.currencySymbol} ${(isCredit ? (acc.availableLine || 68000) : acc.balance).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                        ) : (
                          `${acc.currencySymbol} ****.**`
                        )}
                      </span>
                      <span className="font-mono text-[12px] text-[#5b5e66] ml-1.5 font-medium">
                        {acc.currency}
                      </span>
                    </div>

                    {isCredit && (
                      <span className="text-[10px] font-semibold text-[#006b54] bg-[#95f5d4]/40 px-2 py-0.5 rounded-full">
                        Línea disponible
                      </span>
                    )}
                  </div>

                  {/* Detalle complementario del saldo */}
                  <div className="relative z-10 mb-3 text-[11px] text-[#5b5e66]">
                    {isCredit ? (
                      <div className="flex items-center justify-between">
                        <span>Deuda actual al corte:</span>
                        <span className="font-mono font-semibold text-[#1b1b1c]">
                          {showBalance ? `${acc.currencySymbol} ${(acc.currentDebt || 4320).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : `${acc.currencySymbol} ****.**`}
                        </span>
                      </div>
                    ) : isSueldo ? (
                      <p>Saldo disponible al día de hoy</p>
                    ) : isPlazo ? (
                      <p>Plazo Fijo con TEA 7.25% anual garantizada</p>
                    ) : (
                      <p>Saldo en cuenta de ahorros disponible</p>
                    )}
                  </div>

                  {/* Acciones contextuales conectadas */}
                  <div className="flex items-center gap-2 pt-2.5 border-t border-[#e5e7eb] relative z-10">
                    {isCredit ? (
                      <>
                        <button
                          onClick={() => onNavigate('pago-tarjeta-credito')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#ec111a] text-white text-[12px] font-bold hover:bg-[#c0000f] active:scale-95 transition-all shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">credit_card</span>
                          <span>Pagar tarjeta</span>
                        </button>
                        <button
                          onClick={() => onSelectAccount ? onSelectAccount(acc.id) : onNavigate('cuentas')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#f6f3f2] text-[#1b1b1c] text-[12px] font-bold border border-[#e5e2e1] active:scale-95 transition-all shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px] text-[#5b5e66]">history</span>
                          <span>Movimientos</span>
                        </button>
                        <button
                          onClick={onOpenCvv}
                          className="p-2 rounded-xl bg-white hover:bg-[#f6f3f2] text-[#5b5e66] border border-[#e5e2e1] active:scale-95 transition-all shadow-xs"
                          title="Ver CVV Digital"
                        >
                          <span className="material-symbols-outlined text-[16px]">lock</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onNavigate('transfer-step1')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#f6f3f2] text-[#1b1b1c] text-[12px] font-bold border border-[#e5e2e1] active:scale-95 transition-all shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px] text-[#ec111a]">send_money</span>
                          <span>Transferir</span>
                        </button>
                        <button
                          onClick={() => onSelectAccount ? onSelectAccount(acc.id) : onNavigate('cuentas')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#f6f3f2] text-[#1b1b1c] text-[12px] font-bold border border-[#e5e2e1] active:scale-95 transition-all shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px] text-[#006b54]">history</span>
                          <span>Movimientos</span>
                        </button>
                        {(isSueldo || acc.type === 'ahorros') && (
                          <button
                            onClick={onOpenCvv}
                            className="p-2 rounded-xl bg-white hover:bg-[#f6f3f2] text-[#5b5e66] border border-[#e5e2e1] active:scale-95 transition-all shadow-xs"
                            title="Ver CVV Digital"
                          >
                            <span className="material-symbols-outlined text-[16px]">lock</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Botón para gestionar fijados si hay menos de 6 */}
        {pinnedAccounts.length < 6 && (
          <button
            onClick={onOpenCustomize}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#ec111a]/40 bg-[#ec111a]/5 hover:bg-[#ec111a]/10 text-[#ec111a] transition-all text-center group active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:rotate-45 transition-transform">
              add_circle
            </span>
            <span className="text-[12px] font-semibold">
              Fijar más productos ({pinnedAccounts.length} de 6 seleccionados)
            </span>
          </button>
        )}
      </section>

      {/* OPERACIONES FRECUENTES (HU013 Criterio 02: Limpieza visual y sin banners publicitarios invasivos) */}
      <section className="flex flex-col gap-2">
        <span className="text-[12px] font-bold text-[#1b1b1c] uppercase tracking-wider px-1">
          Operaciones frecuentes
        </span>
        <div className="grid grid-cols-4 gap-2">
          {/* Transferir */}
          <button
            onClick={() => onNavigate('transfer-step1')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#e5e7eb] shadow-xs hover:border-[#ec111a]/40 active:scale-95 transition-all group text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#ec111a]/10 text-[#ec111a] group-hover:bg-[#ec111a] group-hover:text-white transition-all flex items-center justify-center mb-1.5 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">send_money</span>
            </div>
            <span className="text-[11px] font-semibold text-[#1b1b1c] leading-tight">
              Transferir
            </span>
          </button>

          {/* Pagar Serv. */}
          <button
            onClick={() => onNavigate('pago-servicios')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#e5e7eb] shadow-xs hover:border-[#ec111a]/40 active:scale-95 transition-all group text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f6f3f2] text-[#5b5e66] group-hover:text-[#ec111a] group-hover:bg-[#ec111a]/10 transition-all flex items-center justify-center mb-1.5 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <span className="text-[11px] font-semibold text-[#1b1b1c] leading-tight">
              Pagar Serv.
            </span>
          </button>

          {/* Recargar */}
          <button
            onClick={() => {
              onNavigate('pago-servicios');
              onQuickNotify('Selecciona Telefonía e Internet para recargar tu línea.');
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#e5e7eb] shadow-xs hover:border-[#ec111a]/40 active:scale-95 transition-all group text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f6f3f2] text-[#5b5e66] group-hover:text-[#ec111a] group-hover:bg-[#ec111a]/10 transition-all flex items-center justify-center mb-1.5 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">phone_android</span>
            </div>
            <span className="text-[11px] font-semibold text-[#1b1b1c] leading-tight">
              Recargar
            </span>
          </button>

          {/* Plin */}
          <button
            onClick={() => onNavigate('plin')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#e5e7eb] shadow-xs hover:border-[#ec111a]/40 active:scale-95 transition-all group text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f6f3f2] text-[#5b5e66] group-hover:text-[#ec111a] group-hover:bg-[#ec111a]/10 transition-all flex items-center justify-center mb-1.5 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
            </div>
            <span className="text-[11px] font-semibold text-[#1b1b1c] leading-tight">
              Plin
            </span>
          </button>
        </div>
      </section>

      {/* MOVIMIENTOS RECIENTES */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[12px] font-bold text-[#1b1b1c] uppercase tracking-wider">
            Movimientos recientes
          </span>
          <button
            onClick={() => onNavigate('cuentas')}
            className="text-[12px] font-semibold text-[#ec111a] hover:underline"
          >
            Ver todos
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden flex flex-col divide-y divide-[#f0eded]">
          {transactions.slice(0, 4).map((tx) => (
            <div
              key={tx.id}
              onClick={() => onQuickNotify(`Detalle de movimiento: ${tx.title} • ${tx.currencySymbol} ${tx.amount.toFixed(2)}`)}
              className="p-3.5 flex items-center justify-between hover:bg-[#f6f3f2] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  tx.isCredit ? 'bg-[#95f5d4]/40 text-[#006b54]' : 'bg-[#f6f3f2] text-[#1b1b1c]'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">{tx.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#1b1b1c] truncate">{tx.title}</p>
                  <p className="text-[11px] text-[#5b5e66]">{tx.date}</p>
                </div>
              </div>
              <span className={`font-mono text-[14px] font-bold whitespace-nowrap ${
                tx.isCredit ? 'text-[#006b54]' : 'text-[#1b1b1c]'
              }`}>
                {tx.isCredit ? '+' : '-'}{tx.currencySymbol}{tx.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
