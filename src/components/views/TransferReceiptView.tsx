import React, { useState } from 'react';
import { ViewState } from '../../types/index.ts';

interface TransferReceiptViewProps {
  amount: number;
  recipientName: string;
  destAccount: string;
  concept: string;
  originAccountName: string;
  originAccountNumber: string;
  onNavigate: (view: ViewState) => void;
  onOpenShareModal: () => void;
  onQuickNotify: (msg: string) => void;
}

export const TransferReceiptView: React.FC<TransferReceiptViewProps> = ({
  amount,
  recipientName,
  destAccount,
  concept,
  originAccountName,
  originAccountNumber,
  onNavigate,
  onOpenShareModal,
  onQuickNotify
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasStoragePermission, setHasStoragePermission] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const opNumber = '#OP-9841284';

  const handleCopyOpCode = () => {
    navigator.clipboard?.writeText(opNumber);
    setIsCopied(true);
    onQuickNotify('N° de operación copiado al portapapeles');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // HU036: Descarga y validación de permisos de almacenamiento
  const handleDownload = () => {
    if (!hasStoragePermission) {
      // HU036 Criterio 02: Error por denegación de permisos de almacenamiento
      const errorMsg = 'No se pudo guardar el archivo. Otorga permisos o elige la opción Enviar por Correo';
      setPermissionError(errorMsg);
      onQuickNotify(errorMsg);
      return;
    }

    setPermissionError(null);
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      onQuickNotify('Comprobante digital descargado en formato PDF');
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3">
      {/* Documento Oficial Banner */}
      <div className="flex items-center justify-between bg-[#f6f3f2] px-4 py-2 rounded-full border border-[#e5e2e1] mb-3">
        <div className="flex items-center space-x-1.5 min-w-0">
          <span className="material-symbols-outlined text-[#ec111a] text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span className="text-[10px] font-mono text-[#1b1b1c] uppercase tracking-wider truncate">
            Documento Oficial • Validez SBS
          </span>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0 bg-white px-2 py-0.5 rounded-full border border-[#e5e2e1]">
          <span className="w-2 h-2 rounded-full bg-[#006b54] animate-pulse"></span>
          <span className="text-[10px] font-mono text-[#006b54] font-bold uppercase">Certificado Activo</span>
        </div>
      </div>

      {/* Official Voucher Card */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-[#e5e2e1] overflow-hidden mb-4">
        {/* Top red header stripe */}
        <div className="h-1.5 w-full bg-[#ec111a]"></div>

        <div className="p-5 flex flex-col space-y-4">
          {/* Bank Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-[#ec111a] flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0">
                S
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[17px] text-[#ec111a] tracking-tight font-extrabold leading-tight">
                  Scotiabank
                </span>
                <span className="text-[12px] text-[#5b5e66] leading-tight">Scotiabank Perú S.A.A.</span>
                <span className="text-[10px] font-mono text-[#5b5e66]">RUC 20100043140</span>
              </div>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="bg-[#f0eded] px-2 py-0.5 rounded text-[9px] font-mono text-[#5b5e66] uppercase tracking-wider font-semibold">
                Banca Móvil
              </span>
              <span className="text-[10px] font-mono text-[#5b5e66] mt-0.5">Constancia Oficial</span>
            </div>
          </div>

          {/* Transfer Success Block */}
          <div className="flex flex-col items-center justify-center pt-2 pb-1 text-center bg-[#f6f3f2] rounded-xl p-4 border border-[#e5e2e1]">
            <div className="w-12 h-12 rounded-full bg-[#95f5d4] flex items-center justify-center text-[#002117] mb-2 shadow-sm">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <span className="text-[12px] font-mono text-[#006b54] uppercase tracking-wider font-bold">
              Transferencia Exitosa
            </span>
            <div className="flex items-baseline justify-center space-x-1 mt-1">
              <span className="text-[18px] font-bold text-[#1b1b1c]">S/</span>
              <span className="font-mono text-[28px] font-extrabold text-[#1b1b1c] tracking-tight">
                {amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="mt-2 inline-flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-[#e5e2e1] shadow-xs">
              <span className="material-symbols-outlined text-[#006b54] text-[14px]">price_check</span>
              <span className="text-[11px] text-[#5b5e66]">Comisión regular:</span>
              <span className="text-[11px] text-[#006b54] font-bold font-mono">S/ 0.00</span>
            </div>
          </div>

          {/* Ledger Details */}
          <div className="flex flex-col space-y-2">
            {/* Origin */}
            <div className="bg-[#f6f3f2] p-3 rounded-xl flex items-start space-x-3 border border-[#f0eded]">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#ec111a] shrink-0 mt-0.5 border border-[#e5e2e1]">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-mono text-[#5b5e66] uppercase tracking-wider">
                  Cuenta de Origen
                </span>
                <span className="text-[13px] text-[#1b1b1c] font-semibold truncate">
                  {originAccountName}
                </span>
                <span className="text-[11px] text-[#5b5e66] font-mono">
                  •••• {originAccountNumber} • Camila Morales Silva
                </span>
              </div>
            </div>

            {/* Destination */}
            <div className="bg-[#f6f3f2] p-3 rounded-xl flex items-start space-x-3 border border-[#f0eded]">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#006b54] shrink-0 mt-0.5 border border-[#e5e2e1]">
                <span className="material-symbols-outlined text-[18px]">domain</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-mono text-[#5b5e66] uppercase tracking-wider">
                  Cuenta de Destino
                </span>
                <span className="text-[13px] text-[#1b1b1c] font-semibold truncate">
                  {recipientName}
                </span>
                <span className="text-[11px] text-[#5b5e66] font-mono truncate">
                  {destAccount}
                </span>
              </div>
            </div>

            {/* Date and Concept */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#f6f3f2] p-2.5 rounded-xl border border-[#f0eded] flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#5b5e66] uppercase tracking-wider">
                  Fecha y Hora
                </span>
                <div className="flex flex-col mt-0.5">
                  <span className="text-[12px] text-[#1b1b1c] font-semibold">Hoy, 24 Oct 2023</span>
                  <span className="text-[10px] text-[#5b5e66] font-mono">11:42:15 hrs</span>
                </div>
              </div>
              <div className="bg-[#f6f3f2] p-2.5 rounded-xl border border-[#f0eded] flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#5b5e66] uppercase tracking-wider">
                  Concepto
                </span>
                <span className="text-[12px] text-[#1b1b1c] font-semibold truncate mt-0.5">
                  {concept || 'Alquiler oficina'}
                </span>
              </div>
            </div>

            {/* Authorization */}
            <div className="bg-[#f6f3f2] p-2.5 rounded-xl border border-[#f0eded] flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="material-symbols-outlined text-[#5b5e66] text-[18px]">phonelink_lock</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-mono text-[#5b5e66] uppercase">Autorización</span>
                  <span className="text-[12px] text-[#1b1b1c] font-semibold truncate">
                    Token Digital Silencioso
                  </span>
                </div>
              </div>
              <span className="bg-white border border-[#e5e2e1] text-[#5b5e66] text-[10px] font-mono px-2 py-0.5 rounded-full font-medium">
                App Móvil
              </span>
            </div>
          </div>

          {/* Operation Code with Copy */}
          <div className="flex items-center justify-between bg-[#ffdad5]/40 p-3 rounded-xl border border-[#ffdad5]">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[#930008] uppercase tracking-wider font-semibold">
                N° de Operación Único
              </span>
              <span className="font-mono text-[15px] text-[#410001] font-bold tracking-tight">
                {opNumber}
              </span>
            </div>
            <button
              onClick={handleCopyOpCode}
              className="flex items-center space-x-1 bg-white px-3 py-1.5 rounded-lg shadow-xs text-[#ec111a] hover:bg-[#f6f3f2] active:scale-95 transition-transform border border-[#e5e2e1]"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isCopied ? 'check' : 'content_copy'}
              </span>
              <span className="text-[11px] font-semibold font-mono">
                {isCopied ? '¡Copiado!' : 'Copiar'}
              </span>
            </button>
          </div>

          {/* QR Code Validation Box */}
          <div className="flex flex-col items-center bg-[#f6f3f2] p-3.5 rounded-xl border border-[#e5e2e1] space-y-2">
            <div className="bg-white p-2 rounded-xl shadow-xs border border-[#e5e2e1] flex items-center justify-center">
              <svg className="w-28 h-28" fill="currentColor" viewBox="0 0 100 100">
                <rect fill="#ffffff" height="100" width="100" x="0" y="0"></rect>
                <path d="M10,10 h24 v24 h-24 z M14,14 v16 h16 v-16 z M18,18 h8 v8 h-8 z" fill="#1b1b1c"></path>
                <path d="M66,10 h24 v24 h-24 z M70,14 v16 h16 v-16 z M74,18 h8 v8 h-8 z" fill="#1b1b1c"></path>
                <path d="M10,66 h24 v24 h-24 z M14,70 v16 h16 v-16 z M18,74 h8 v8 h-8 z" fill="#1b1b1c"></path>
                <rect fill="#1b1b1c" height="8" width="4" x="38" y="10"></rect>
                <rect fill="#1b1b1c" height="4" width="6" x="46" y="10"></rect>
                <rect fill="#1b1b1c" height="12" width="4" x="56" y="10"></rect>
                <rect fill="#1b1b1c" height="4" width="10" x="38" y="22"></rect>
                <rect fill="#1b1b1c" height="8" width="6" x="52" y="26"></rect>
                <rect fill="#1b1b1c" height="6" width="6" x="10" y="38"></rect>
                <rect fill="#1b1b1c" height="4" width="8" x="20" y="42"></rect>
                <rect fill="#1b1b1c" height="14" width="4" x="32" y="38"></rect>
                <rect fill="#ec111a" height="20" rx="4" width="20" x="40" y="40"></rect>
                <text fill="#ffffff" fontFamily="Manrope, sans-serif" fontSize="14" fontWeight="900" textAnchor="middle" x="50" y="55">S</text>
                <rect fill="#1b1b1c" height="4" width="10" x="64" y="38"></rect>
                <rect fill="#1b1b1c" height="6" width="12" x="78" y="42"></rect>
                <rect fill="#1b1b1c" height="12" width="4" x="64" y="48"></rect>
                <rect fill="#1b1b1c" height="4" width="16" x="72" y="52"></rect>
                <rect fill="#1b1b1c" height="8" width="6" x="38" y="66"></rect>
                <rect fill="#1b1b1c" height="4" width="8" x="48" y="66"></rect>
                <rect fill="#1b1b1c" height="14" width="4" x="60" y="66"></rect>
                <rect fill="#1b1b1c" height="4" width="8" x="70" y="70"></rect>
                <rect fill="#1b1b1c" height="8" width="8" x="82" y="66"></rect>
                <rect fill="#1b1b1c" height="4" width="14" x="38" y="78"></rect>
                <rect fill="#1b1b1c" height="6" width="12" x="56" y="84"></rect>
                <rect fill="#1b1b1c" height="10" width="6" x="74" y="80"></rect>
                <rect fill="#1b1b1c" height="8" width="6" x="84" y="82"></rect>
              </svg>
            </div>
            <div className="flex flex-col items-center text-center space-y-0.5">
              <span className="text-[11px] font-bold text-[#1b1b1c]">
                Escanea para verificar autenticidad
              </span>
              <span className="text-[10px] text-[#5b5e66]">
                Portal oficial de validación Scotiabank Perú
              </span>
            </div>
          </div>

          {/* Cryptographic hash footnote */}
          <div className="flex flex-col items-center text-center space-y-0.5 bg-[#f6f3f2] p-2.5 rounded-lg border border-[#e5e2e1]">
            <div className="flex items-center space-x-1 text-[#5b5e66]">
              <span className="material-symbols-outlined text-[13px] text-[#006b54]">lock</span>
              <span className="text-[10px] font-mono truncate">SHA-256: e8b49a21...91c2fa80</span>
            </div>
            <span className="text-[9px] text-[#5b5e66]">
              Conforme a Circular SBS N° G-140-2009 y normativas fiscales
            </span>
          </div>
        </div>
      </div>

      {/* HU036 Criterio 02: Alerta por error de permisos de almacenamiento */}
      {permissionError && (
        <div className="mb-3 p-3 bg-[#ec111a]/10 border border-[#ec111a]/30 rounded-xl flex items-start gap-2.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[#ec111a] text-[20px] shrink-0 mt-0.5">
            folder_off
          </span>
          <div className="flex-1">
            <p className="text-[12px] font-bold text-[#ec111a]">Error de Almacenamiento</p>
            <p className="text-[11px] font-semibold text-[#1b1b1c] mt-0.5">{permissionError}</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onQuickNotify('Comprobante digital enviado a tu correo registrado (c.morales@gmail.com)');
                  setPermissionError(null);
                }}
                className="px-3 py-1 bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[11px] rounded-lg active:scale-95 transition-all shadow-xs"
              >
                Enviar por Correo
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasStoragePermission(true);
                  setPermissionError(null);
                  onQuickNotify('Permisos de almacenamiento otorgados.');
                }}
                className="px-2.5 py-1 bg-white border border-[#e5e2e1] text-[#1b1b1c] font-semibold text-[11px] rounded-lg"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control de prueba de permisos de almacenamiento */}
      <div className="flex items-center justify-between text-[11px] text-[#5b5e66] px-1 mb-2">
        <span>Permisos de almacenamiento:</span>
        <button
          type="button"
          onClick={() => {
            setHasStoragePermission(!hasStoragePermission);
            setPermissionError(null);
            onQuickNotify(!hasStoragePermission ? 'Permisos de almacenamiento concedidos' : 'Simulación: Permisos de almacenamiento denegados (HU036)');
          }}
          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
            hasStoragePermission ? 'bg-[#95f5d4] text-[#002117]' : 'bg-[#ec111a] text-white'
          }`}
          title="Permite simular denegación de permisos para probar HU036 Criterio 02"
        >
          {hasStoragePermission ? 'Permiso: Concedido' : 'Permiso: Denegado (HU036)'}
        </button>
      </div>

      {/* Buttons */}
      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="col-span-4 h-12 bg-[#ec111a] hover:bg-[#c0000f] text-white rounded-xl font-bold text-[14px] flex items-center justify-center space-x-2 shadow-md active:scale-[0.99] transition-all"
          >
            {isDownloading ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>Generando PDF...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span>Descargar PDF</span>
              </>
            )}
          </button>
          <button
            onClick={onOpenShareModal}
            className="col-span-1 h-12 bg-white hover:bg-[#f6f3f2] border border-[#e5e2e1] text-[#1b1b1c] rounded-xl flex items-center justify-center shadow-xs active:scale-95 transition-all"
            title="Compartir constancia"
          >
            <span className="material-symbols-outlined text-[22px] text-[#ec111a]">share</span>
          </button>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="w-full py-2.5 flex items-center justify-center space-x-1 text-[#5b5e66] hover:text-[#1b1b1c] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="text-[13px] font-semibold">Volver a Mis Cuentas</span>
        </button>
      </div>
    </div>
  );
};
