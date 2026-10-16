import React, { useState } from 'react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessTransfer: (recipientName: string, amount: number) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onSuccessTransfer
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'my-qr' | 'plin-num'>('scan');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('25.00');

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    onSuccessTransfer('Carlos Mendoza Ruiz', 50.00);
    onClose();
  };

  const handleSendPlin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    onSuccessTransfer(`Contacto Plin (${phoneNumber})`, parseFloat(amount) || 20);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-[#303030]/65 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#f6f3f2] flex items-center justify-between border-b border-[#e5e2e1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ec111a] text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <h3 className="font-bold text-[16px] text-[#1b1b1c]">Plin & Escaneo QR</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#5b5e66] hover:bg-[#e5e2e1]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e5e2e1] bg-white text-[13px] font-semibold">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'scan'
                ? 'border-[#ec111a] text-[#ec111a]'
                : 'border-transparent text-[#5b5e66] hover:text-[#1b1b1c]'
            }`}
          >
            Escanear QR
          </button>
          <button
            onClick={() => setActiveTab('my-qr')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'my-qr'
                ? 'border-[#ec111a] text-[#ec111a]'
                : 'border-transparent text-[#5b5e66] hover:text-[#1b1b1c]'
            }`}
          >
            Mi QR Plin
          </button>
          <button
            onClick={() => setActiveTab('plin-num')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'plin-num'
                ? 'border-[#ec111a] text-[#ec111a]'
                : 'border-transparent text-[#5b5e66] hover:text-[#1b1b1c]'
            }`}
          >
            Por Celular
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col items-center">
          {activeTab === 'scan' && (
            <div className="flex flex-col items-center text-center w-full">
              {/* Camera Scanner Viewport */}
              <div className="relative w-56 h-56 bg-neutral-900 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-[#ec111a] shadow-inner mb-4">
                <div className="absolute inset-4 border border-dashed border-white/50 rounded-xl pointer-events-none"></div>
                <div className="w-full h-0.5 bg-[#ec111a] absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_12px_#ec111a]"></div>
                <span className="material-symbols-outlined text-white/40 text-[64px]">
                  qr_code_scanner
                </span>
                <span className="absolute bottom-3 text-white text-[11px] bg-black/60 px-3 py-1 rounded-full">
                  Apunta al código QR Plin
                </span>
              </div>

              <p className="text-[12px] text-[#5b5e66] mb-4">
                Escanea códigos QR de Plin, Yape o POS de comercios afiliados.
              </p>

              <button
                onClick={handleSimulateScan}
                className="w-full h-11 bg-[#ec111a] hover:bg-[#c0000f] text-white font-semibold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Simular Escaneo (Carlos Mendoza S/ 50)
              </button>
            </div>
          )}

          {activeTab === 'my-qr' && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="p-3 bg-white border border-[#e5e2e1] rounded-2xl shadow-sm mb-3">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 100 100">
                  <rect fill="#ffffff" height="100" width="100" x="0" y="0"></rect>
                  <path d="M10,10 h24 v24 h-24 z M14,14 v16 h16 v-16 z M18,18 h8 v8 h-8 z" fill="#1b1b1c"></path>
                  <path d="M66,10 h24 v24 h-24 z M70,14 v16 h16 v-16 z M74,18 h8 v8 h-8 z" fill="#1b1b1c"></path>
                  <path d="M10,66 h24 v24 h-24 z M14,70 v16 h16 v-16 z M18,74 h8 v8 h-8 z" fill="#1b1b1c"></path>
                  <rect fill="#1b1b1c" height="8" width="4" x="38" y="10"></rect>
                  <rect fill="#1b1b1c" height="4" width="6" x="46" y="10"></rect>
                  <rect fill="#1b1b1c" height="12" width="4" x="56" y="10"></rect>
                  <rect fill="#1b1b1c" height="4" width="10" x="38" y="22"></rect>
                  <rect fill="#1b1b1c" height="8" width="6" x="52" y="26"></rect>
                  <rect fill="#ec111a" height="20" rx="4" width="20" x="40" y="40"></rect>
                  <text fill="#ffffff" fontFamily="Manrope, sans-serif" fontSize="14" fontWeight="900" textAnchor="middle" x="50" y="55">S</text>
                  <rect fill="#1b1b1c" height="4" width="10" x="64" y="38"></rect>
                  <rect fill="#1b1b1c" height="6" width="12" x="78" y="42"></rect>
                  <rect fill="#1b1b1c" height="12" width="4" x="64" y="48"></rect>
                  <rect fill="#1b1b1c" height="14" width="4" x="60" y="66"></rect>
                  <rect fill="#1b1b1c" height="8" width="8" x="82" y="66"></rect>
                  <rect fill="#1b1b1c" height="4" width="14" x="38" y="78"></rect>
                </svg>
              </div>
              <p className="font-semibold text-[14px] text-[#1b1b1c]">Camila Morales Silva</p>
              <p className="font-mono text-[12px] text-[#5b5e66]">Plin Scotiabank • 984 *** 210</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006b54]/10 text-[#006b54] text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Abono inmediato en Cuenta Sueldo
              </div>
            </div>
          )}

          {activeTab === 'plin-num' && (
            <form onSubmit={handleSendPlin} className="w-full flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-semibold text-[#5b5e66] block mb-1">
                  Número de Celular
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#5b5e66] text-[18px]">
                    phone_android
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Ej. 987 654 321"
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#f6f3f2] font-mono text-[14px] focus:outline-none focus:bg-white border border-transparent focus:border-[#ec111a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#5b5e66] block mb-1">
                  Monto en Soles (S/)
                </label>
                <div className="relative flex items-center">
                  <span className="font-bold text-[16px] text-[#ec111a] absolute left-3">S/</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#f6f3f2] font-mono text-[15px] font-bold focus:outline-none focus:bg-white border border-transparent focus:border-[#ec111a]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 mt-2 bg-[#ec111a] hover:bg-[#c0000f] text-white font-semibold text-[14px] rounded-xl flex items-center justify-center gap-2"
              >
                <span>Transferir con Plin</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
