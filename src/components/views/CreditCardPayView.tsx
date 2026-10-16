import React, { useState } from 'react';
import { Account, ViewState } from '../../types/index.ts';

interface CreditCardPayViewProps {
  accounts: Account[];
  onNavigate: (view: ViewState) => void;
  onPaySuccess: (data: {
    cardName: string;
    cardNumber: string;
    amountPaid: number;
    currency: string;
    debitAccount: Account;
  }) => void;
  onQuickNotify: (msg: string) => void;
}

export const CreditCardPayView: React.FC<CreditCardPayViewProps> = ({
  accounts,
  onNavigate,
  onPaySuccess,
  onQuickNotify
}) => {
  const creditCards = accounts.filter((a) => a.type === 'credito');
  const debitAccounts = accounts.filter((a) => a.type !== 'credito' && a.type !== 'plazo');

  const [paymentTarget, setPaymentTarget] = useState<'propia' | 'terceros'>('propia');
  const [selectedCardId, setSelectedCardId] = useState<string>(creditCards[0]?.id || 'acc-visa');
  const [thirdPartyCardNumber, setThirdPartyCardNumber] = useState('4213-9481-8492-3104');
  const [thirdPartyBank, setThirdPartyBank] = useState('Scotiabank Visa Clásica');
  const [selectedDebitAccountId, setSelectedDebitAccountId] = useState<string>(debitAccounts[0]?.id || 'acc-sueldo');

  // Modalidad de pago
  const [paymentOption, setPaymentOption] = useState<'mes' | 'minimo' | 'otro'>('mes');
  const [customAmount, setCustomAmount] = useState('450.00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const selectedCard = accounts.find((a) => a.id === selectedCardId) || creditCards[0];
  const selectedDebitAccount = accounts.find((a) => a.id === selectedDebitAccountId) || debitAccounts[0];

  // Deuda del mes y mínimo
  const mesAmount = 450.00;
  const minimoAmount = 85.00;
  const cardCurrency = selectedCard?.currency || 'PEN';
  const debitCurrency = selectedDebitAccount?.currency || 'PEN';

  // HU032 Criterio 02: Detección de pago con moneda cruzada
  const isCurrencyMismatch = cardCurrency !== debitCurrency;
  const exchangeRate = 3.755; // T.C. preferencial

  const getEffectiveAmount = () => {
    if (paymentOption === 'mes') return mesAmount;
    if (paymentOption === 'minimo') return minimoAmount;
    return parseFloat(customAmount) || 0;
  };

  const effectiveAmount = getEffectiveAmount();
  const convertedDebitAmount = isCurrencyMismatch
    ? cardCurrency === 'USD'
      ? effectiveAmount * exchangeRate
      : effectiveAmount / exchangeRate
    : effectiveAmount;

  const handleConfirmPay = () => {
    if (effectiveAmount <= 0) {
      onQuickNotify('Ingresa un monto válido para pagar');
      return;
    }

    if (convertedDebitAmount > selectedDebitAccount.balance) {
      onQuickNotify('Saldo insuficiente en la cuenta de débito seleccionada');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const data = {
        cardName: paymentTarget === 'propia' ? selectedCard.name : thirdPartyBank,
        cardNumber: paymentTarget === 'propia' ? selectedCard.number : thirdPartyCardNumber.slice(-4),
        amountPaid: effectiveAmount,
        currency: cardCurrency,
        debitAccount: selectedDebitAccount
      };
      setReceiptData(data);
      onPaySuccess(data);
      setIsSuccessModalOpen(true);
      onQuickNotify(`Pago de tarjeta por ${selectedCard?.currencySymbol || 'S/'} ${effectiveAmount.toFixed(2)} procesado con éxito.`);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#ec111a] hover:text-[#c0000f] active:scale-95 transition-all py-1 px-2 -ml-2 rounded-lg hover:bg-[#ec111a]/5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Volver al Inicio</span>
        </button>
        <span className="text-[11px] font-semibold bg-[#006b54]/10 text-[#006b54] px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">credit_score</span>
          Línea Inmediata
        </span>
      </div>

      <div>
        <h2 className="text-[20px] font-bold text-[#1b1b1c]">Pagar Tarjeta de Crédito</h2>
        <p className="text-[12px] text-[#5b5e66]">
          Realiza el pago de tus tarjetas Scotiabank o de terceros sin comisiones (HU032).
        </p>
      </div>

      {/* Selector de Tarjeta Propia vs Terceros */}
      <div className="grid grid-cols-2 gap-2 bg-[#f0eded] p-1 rounded-xl text-[12px] font-semibold">
        <button
          type="button"
          onClick={() => setPaymentTarget('propia')}
          className={`py-2 rounded-lg transition-all ${
            paymentTarget === 'propia' ? 'bg-white text-[#1b1b1c] shadow-xs' : 'text-[#5b5e66]'
          }`}
        >
          Tarjeta Propia
        </button>
        <button
          type="button"
          onClick={() => setPaymentTarget('terceros')}
          className={`py-2 rounded-lg transition-all ${
            paymentTarget === 'terceros' ? 'bg-white text-[#1b1b1c] shadow-xs' : 'text-[#5b5e66]'
          }`}
        >
          Tarjeta de Terceros
        </button>
      </div>

      {/* Tarjeta a Pagar */}
      {paymentTarget === 'propia' ? (
        <div className="bg-gradient-to-br from-[#1d1f24] to-[#2a2e36] text-white p-4 rounded-2xl shadow-md border border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider text-white/70 uppercase">
              {selectedCard?.name || 'Scotia Visa Signature'}
            </span>
            <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded-full">
              •••• {selectedCard?.number || '9102'}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[10px] text-white/60 block">Deuda actual al corte:</span>
              <span className="font-mono text-[22px] font-extrabold text-white">
                {selectedCard?.currencySymbol || 'S/'} {(selectedCard?.currentDebt || 4320).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/60 block">Línea disponible:</span>
              <span className="font-mono text-[14px] font-bold text-[#95f5d4]">
                {selectedCard?.currencySymbol || 'S/'} {(selectedCard?.availableLine || 68000).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-2xl border border-[#e5e2e1] shadow-xs space-y-2">
          <label className="text-[11px] font-bold text-[#5b5e66] uppercase block">
            Número de Tarjeta de Tercero
          </label>
          <input
            type="text"
            value={thirdPartyCardNumber}
            onChange={(e) => setThirdPartyCardNumber(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-[#e5e2e1] font-mono text-[14px] focus:outline-none focus:border-[#ec111a]"
            placeholder="XXXX-XXXX-XXXX-XXXX"
          />
          <p className="text-[11px] text-[#006b54] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Destino validado: {thirdPartyBank}
          </p>
        </div>
      )}

      {/* Modalidad de Pago (HU032 Criterio 01) */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-bold text-[#1b1b1c] uppercase tracking-wider">
          Monto a Cancelar
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* Pago del Mes */}
          <button
            type="button"
            onClick={() => setPaymentOption('mes')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              paymentOption === 'mes'
                ? 'border-[#ec111a] bg-[#ec111a]/5 text-[#ec111a] font-bold ring-1 ring-[#ec111a]'
                : 'border-[#e5e2e1] bg-white text-[#1b1b1c] hover:bg-[#f6f3f2]'
            }`}
          >
            <span className="text-[11px] block text-[#5b5e66]">Pago del Mes</span>
            <span className="font-mono text-[14px] font-extrabold mt-0.5">
              S/ {mesAmount.toFixed(2)}
            </span>
          </button>

          {/* Pago Mínimo */}
          <button
            type="button"
            onClick={() => setPaymentOption('minimo')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              paymentOption === 'minimo'
                ? 'border-[#ec111a] bg-[#ec111a]/5 text-[#ec111a] font-bold ring-1 ring-[#ec111a]'
                : 'border-[#e5e2e1] bg-white text-[#1b1b1c] hover:bg-[#f6f3f2]'
            }`}
          >
            <span className="text-[11px] block text-[#5b5e66]">Pago Mínimo</span>
            <span className="font-mono text-[14px] font-extrabold mt-0.5">
              S/ {minimoAmount.toFixed(2)}
            </span>
          </button>

          {/* Otro Monto */}
          <button
            type="button"
            onClick={() => setPaymentOption('otro')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              paymentOption === 'otro'
                ? 'border-[#ec111a] bg-[#ec111a]/5 text-[#ec111a] font-bold ring-1 ring-[#ec111a]'
                : 'border-[#e5e2e1] bg-white text-[#1b1b1c] hover:bg-[#f6f3f2]'
            }`}
          >
            <span className="text-[11px] block text-[#5b5e66]">Otro Monto</span>
            <span className="font-mono text-[14px] font-extrabold mt-0.5">Digitar</span>
          </button>
        </div>

        {paymentOption === 'otro' && (
          <div className="relative mt-1">
            <span className="absolute left-3.5 top-3 text-[18px] font-bold text-[#ec111a]">
              {selectedCard?.currencySymbol || 'S/'}
            </span>
            <input
              type="number"
              step="0.01"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#e5e2e1] font-mono text-[18px] font-bold focus:outline-none focus:border-[#ec111a] bg-white"
            />
          </div>
        )}
      </div>

      {/* Cuenta de Débito de Origen */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-[#1b1b1c] uppercase tracking-wider">
          Pagar desde la Cuenta
        </label>
        <div className="space-y-2">
          {debitAccounts.map((acc) => (
            <div
              key={acc.id}
              onClick={() => setSelectedDebitAccountId(acc.id)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                acc.id === selectedDebitAccountId
                  ? 'border-[#006b54] bg-[#006b54]/5 ring-1 ring-[#006b54]'
                  : 'border-[#e5e2e1] bg-white hover:bg-[#f6f3f2]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#006b54]/10 text-[#006b54] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[13px] text-[#1b1b1c]">{acc.name}</h4>
                  <p className="font-mono text-[11px] text-[#5b5e66]">•••• {acc.number}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[13px] font-bold text-[#1b1b1c]">
                  {acc.currencySymbol} {acc.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-semibold text-[#5b5e66] block">{acc.currency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HU032 Criterio 02: Advertencia por pago con tipo de moneda diferente */}
      {isCurrencyMismatch && (
        <div className="p-3.5 bg-[#f6f3f2] rounded-xl border border-[#e5e2e1] flex items-start gap-2.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[#ec111a] text-[20px] shrink-0 mt-0.5">
            currency_exchange
          </span>
          <div className="space-y-1">
            <p className="text-[12px] font-bold text-[#1b1b1c]">Conversión de Moneda Aplicada</p>
            <p className="text-[11px] text-[#5b5e66] leading-relaxed">
              Estás pagando una tarjeta en <b>{cardCurrency}</b> utilizando una cuenta en <b>{debitCurrency}</b>.
            </p>
            <div className="mt-1 pt-1 border-t border-[#e5e2e1] flex items-center justify-between text-[11px]">
              <span className="text-[#5b5e66]">T.C. Preferencial Scotiabank:</span>
              <span className="font-mono font-bold text-[#ec111a]">S/ {exchangeRate.toFixed(3)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#5b5e66]">Monto total debitado:</span>
              <span className="font-mono font-bold text-[#1b1b1c]">
                {selectedDebitAccount.currencySymbol} {convertedDebitAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Botón de Confirmación */}
      <div className="pt-2">
        <button
          onClick={handleConfirmPay}
          disabled={isProcessing}
          className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
              <span>Procesando pago con Token Digital...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Confirmar Pago de {selectedCard?.currencySymbol || 'S/'} {effectiveAmount.toFixed(2)}</span>
            </>
          )}
        </button>
      </div>

      {/* Modal de Constancia Oficial de Pago */}
      {isSuccessModalOpen && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#303030]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl relative animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#006b54]/10 text-[#006b54] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[28px]">verified</span>
            </div>

            <h3 className="font-bold text-[18px] text-[#1b1b1c] text-center">
              ¡Pago Realizado con Éxito!
            </h3>
            <p className="text-[12px] text-[#5b5e66] text-center mt-0.5">
              La línea de crédito se ha liberado inmediatamente.
            </p>

            <div className="my-4 p-3.5 bg-[#f6f3f2] rounded-xl space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#5b5e66]">Tarjeta abonada:</span>
                <span className="font-bold text-[#1b1b1c]">{receiptData.cardName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5b5e66]">Monto acreditado:</span>
                <span className="font-mono font-bold text-[#006b54]">
                  {receiptData.currency === 'USD' ? '$' : 'S/'} {receiptData.amountPaid.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5b5e66]">Cuenta de cargo:</span>
                <span className="font-mono text-[#1b1b1c]">•••• {receiptData.debitAccount.number}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#e5e2e1]">
                <span className="text-[#5b5e66]">Nro. Operación:</span>
                <span className="font-mono font-bold text-[#1b1b1c]">#TC-{Date.now().toString().slice(-7)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                onNavigate('home');
              }}
              className="w-full h-11 bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[13px] rounded-xl active:scale-95 transition-all shadow-sm"
            >
              Listo, volver al Inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
