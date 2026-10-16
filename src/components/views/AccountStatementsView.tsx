import React, { useState } from 'react';
import { Account, ViewState } from '../../types/index.ts';

interface AccountStatementsViewProps {
  accounts: Account[];
  onNavigate: (view: ViewState) => void;
  onQuickNotify: (msg: string) => void;
}

interface StatementMonth {
  id: string;
  name: string;
  year: string;
  period: string;
  closingDate: string;
  totalCredits: number;
  totalDebits: number;
  finalBalance: number;
  currency: string;
  currencySymbol: string;
}

export const AccountStatementsView: React.FC<AccountStatementsViewProps> = ({
  accounts,
  onNavigate,
  onQuickNotify
}) => {
  const eligibleAccounts = accounts.filter((a) => a.type !== 'plazo');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(eligibleAccounts[0]?.id || accounts[0]?.id);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [inputDni, setInputDni] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const availableMonths: StatementMonth[] = [
    {
      id: '2026-09',
      name: 'Septiembre 2026',
      year: '2026',
      period: '01/09/2026 al 30/09/2026',
      closingDate: '30 Sep 2026',
      totalCredits: selectedAccount.currency === 'USD' ? 1200.00 : 25000.00,
      totalDebits: selectedAccount.currency === 'USD' ? 54.99 : 1800.50,
      finalBalance: selectedAccount.balance,
      currency: selectedAccount.currency,
      currencySymbol: selectedAccount.currencySymbol
    },
    {
      id: '2026-08',
      name: 'Agosto 2026',
      year: '2026',
      period: '01/08/2026 al 31/08/2026',
      closingDate: '31 Ago 2026',
      totalCredits: selectedAccount.currency === 'USD' ? 850.00 : 24500.00,
      totalDebits: selectedAccount.currency === 'USD' ? 120.00 : 3150.20,
      finalBalance: selectedAccount.balance * 0.92,
      currency: selectedAccount.currency,
      currencySymbol: selectedAccount.currencySymbol
    },
    {
      id: '2026-07',
      name: 'Julio 2026',
      year: '2026',
      period: '01/07/2026 al 31/07/2026',
      closingDate: '31 Jul 2026',
      totalCredits: selectedAccount.currency === 'USD' ? 2000.00 : 27800.00,
      totalDebits: selectedAccount.currency === 'USD' ? 450.00 : 4200.00,
      finalBalance: selectedAccount.balance * 0.85,
      currency: selectedAccount.currency,
      currencySymbol: selectedAccount.currencySymbol
    }
  ];

  const currentStatement = availableMonths.find((m) => m.id === selectedMonth) || availableMonths[0];
  const userValidDni = '72189402';

  const handleStartDownload = () => {
    setInputDni('');
    setPasswordError(null);
    setIsPasswordModalOpen(true);
  };

  const handleValidatePassword = () => {
    if (inputDni.trim() === userValidDni) {
      setIsPasswordModalOpen(false);
      setIsViewerOpen(true);
      onQuickNotify(`Estado de cuenta de ${currentStatement.name} desencriptado con éxito.`);
    } else {
      setPasswordError('Contraseña incorrecta. Ingresa tu número de DNI de 8 dígitos para desbloquear el estado de cuenta.');
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3 gap-4">
      {/* Barra superior de navegación */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('cuentas')}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#ec111a] hover:text-[#c0000f] active:scale-95 transition-all py-1 px-2 -ml-2 rounded-lg hover:bg-[#ec111a]/5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Volver a Cuentas</span>
        </button>
        <span className="text-[11px] font-semibold bg-[#ec111a]/10 text-[#ec111a] px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">picture_as_pdf</span>
          Oficial SBS
        </span>
      </div>

      <div>
        <h2 className="text-[20px] font-bold text-[#1b1b1c]">Estados de Cuenta Oficiales</h2>
        <p className="text-[12px] text-[#5b5e66]">
          Descarga tus estados de cuenta mensuales en PDF protegidos y firmados digitalmente (HU019).
        </p>
      </div>

      {/* Selector de Cuenta */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-[#1b1b1c] uppercase tracking-wider">
          Selecciona la Cuenta
        </label>
        <div className="space-y-2">
          {eligibleAccounts.map((acc) => (
            <div
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                acc.id === selectedAccountId
                  ? 'border-[#ec111a] bg-[#ec111a]/5 shadow-xs'
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
                  <h4 className="font-semibold text-[14px] text-[#1b1b1c]">{acc.name}</h4>
                  <p className="font-mono text-[11px] text-[#5b5e66]">•••• {acc.number}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[13px] font-bold text-[#1b1b1c] block">
                  {acc.currencySymbol} {acc.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-semibold text-[#5b5e66]">{acc.currency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selector de Mes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-[#1b1b1c] uppercase tracking-wider">
          Mes de Liquidación
        </label>
        <div className="grid grid-cols-3 gap-2">
          {availableMonths.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMonth(m.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedMonth === m.id
                  ? 'border-[#ec111a] bg-[#ec111a] text-white font-bold shadow-sm'
                  : 'border-[#e5e2e1] bg-white text-[#1b1b1c] hover:bg-[#f6f3f2]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] block mb-1">
                calendar_month
              </span>
              <span className="text-[12px] block font-semibold">{m.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-80 block">{m.year}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tarjeta de Resumen del Extracto */}
      <div className="bg-white rounded-2xl p-4 border border-[#e5e2e1] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#f0eded]">
          <div>
            <span className="text-[11px] text-[#5b5e66] block">Período facturado:</span>
            <span className="font-semibold text-[13px] text-[#1b1b1c]">{currentStatement.period}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006b54] bg-[#95f5d4]/40 px-2.5 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            Sello Digital
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div>
            <span className="text-[#5b5e66] block">Total Abonos:</span>
            <span className="font-mono font-bold text-[#006b54]">
              +{currentStatement.currencySymbol} {currentStatement.totalCredits.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-[#5b5e66] block">Total Cargos:</span>
            <span className="font-mono font-bold text-[#ec111a]">
              -{currentStatement.currencySymbol} {currentStatement.totalDebits.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#f0eded] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#5b5e66] block">Saldo de Cierre:</span>
            <span className="font-mono text-[16px] font-extrabold text-[#1b1b1c]">
              {currentStatement.currencySymbol} {currentStatement.finalBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-right text-[11px] text-[#5b5e66]">
            <span>Fecha de corte:</span>
            <p className="font-semibold text-[#1b1b1c]">{currentStatement.closingDate}</p>
          </div>
        </div>

        <div className="mt-2 bg-[#f6f3f2] p-2.5 rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006b54] text-[18px]">lock</span>
          <p className="text-[11px] text-[#5b5e66]">
            Documento protegido bajo estándar AES-256. Tu contraseña de apertura es tu número de DNI.
          </p>
        </div>

        {/* Botón de Descarga HU019 */}
        <button
          onClick={handleStartDownload}
          className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          <span>Descargar PDF Estado de Cuenta</span>
        </button>
      </div>

      {/* Modal de Validación de DNI (HU019 Criterio 02) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#303030]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#ec111a]/10 text-[#ec111a] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[26px]">key</span>
            </div>

            <h3 className="font-bold text-[17px] text-[#1b1b1c] text-center">
              Desbloquear Estado de Cuenta
            </h3>
            <p className="text-[12px] text-[#5b5e66] text-center mt-1">
              Por normativa de seguridad bancaria, ingresa tu número de <b>DNI/CE</b> para abrir el documento protegido.
            </p>

            <div className="mt-4">
              <label className="text-[11px] font-bold text-[#5b5e66] uppercase block mb-1">
                Número de DNI / Contraseña
              </label>
              <input
                type="password"
                maxLength={8}
                value={inputDni}
                onChange={(e) => setInputDni(e.target.value.replace(/\D/g, ''))}
                placeholder="Ingresa tu DNI (ej. 72189402)"
                className="w-full h-12 px-3 text-center tracking-widest font-mono text-[18px] font-bold rounded-xl border border-[#e5e2e1] focus:outline-none focus:border-[#ec111a] bg-[#fcf9f8]"
                autoFocus
              />
              <p className="text-[11px] text-[#5b5e66] mt-1 text-center">
                DNI registrado: <span className="font-mono font-bold text-[#1b1b1c]">{userValidDni}</span>
              </p>
            </div>

            {passwordError && (
              <div className="mt-2.5 p-2 bg-[#ec111a]/10 border border-[#ec111a]/30 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                <span className="material-symbols-outlined text-[#ec111a] text-[16px]">error</span>
                <p className="text-[11px] font-semibold text-[#ec111a]">{passwordError}</p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={handleValidatePassword}
                disabled={inputDni.length === 0}
                className="w-full h-11 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] disabled:bg-[#f0eded] disabled:text-[#5b5e66] text-white font-bold text-[13px] active:scale-95 transition-all shadow-sm"
              >
                Desbloquear y Ver PDF
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-full h-9 rounded-xl text-[#5b5e66] hover:bg-[#f0eded] font-medium text-[12px] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visor Oficial de Estado de Cuenta PDF (HU019 Criterio 01) */}
      {isViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#1b1b1c]/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Header del visor */}
            <div className="p-4 bg-[#1b1b1c] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ec111a] text-[22px]">picture_as_pdf</span>
                <div>
                  <h4 className="font-bold text-[14px]">Estado_Cuenta_{currentStatement.id}.pdf</h4>
                  <p className="text-[10px] text-gray-300">Firmado digitalmente • Scotiabank Perú</p>
                </div>
              </div>
              <button
                onClick={() => setIsViewerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Hoja digital del Estado de Cuenta */}
            <div className="p-5 overflow-y-auto space-y-4 text-[#1b1b1c] text-[12px] bg-[#fdfdfd]">
              {/* Membrete Scotiabank */}
              <div className="flex items-center justify-between border-b pb-3 border-[#e5e2e1]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#ec111a] flex items-center justify-center text-white font-black text-[16px]">
                    S
                  </div>
                  <div>
                    <h5 className="font-bold text-[14px] text-[#ec111a] tracking-tight">Scotiabank</h5>
                    <p className="text-[10px] text-[#5b5e66]">R.U.C. 20100187050</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[11px] block uppercase">Estado de Cuenta</span>
                  <span className="font-mono text-[10px] text-[#5b5e66]">{currentStatement.name}</span>
                </div>
              </div>

              {/* Datos del Cliente y Cuenta */}
              <div className="bg-[#f6f3f2] p-3 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#5b5e66]">Titular:</span>
                  <span className="font-bold text-[#1b1b1c]">CAMILA MORALES SILVA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5b5e66]">Documento de Identidad:</span>
                  <span className="font-mono font-bold text-[#1b1b1c]">DNI {userValidDni}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5b5e66]">Producto:</span>
                  <span className="font-semibold text-[#1b1b1c]">{selectedAccount.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5b5e66]">Número de Cuenta:</span>
                  <span className="font-mono font-bold text-[#1b1b1c]">0001-9482-••••-{selectedAccount.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5b5e66]">Código Interbancario (CCI):</span>
                  <span className="font-mono text-[#1b1b1c]">009-170-000000{selectedAccount.number}-22</span>
                </div>
              </div>

              {/* Resumen de Movimientos en el PDF */}
              <div>
                <h6 className="font-bold text-[12px] uppercase tracking-wider text-[#5b5e66] mb-1.5">
                  Resumen de Saldos al Cierre
                </h6>
                <div className="border border-[#e5e2e1] rounded-xl overflow-hidden divide-y divide-[#e5e2e1]">
                  <div className="p-2.5 flex justify-between bg-white">
                    <span>Saldo Anterior:</span>
                    <span className="font-mono font-semibold">
                      {currentStatement.currencySymbol} {(currentStatement.finalBalance * 0.95).toFixed(2)}
                    </span>
                  </div>
                  <div className="p-2.5 flex justify-between bg-white text-[#006b54]">
                    <span>Total Abonos / Depósitos (+):</span>
                    <span className="font-mono font-bold">
                      +{currentStatement.currencySymbol} {currentStatement.totalCredits.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-2.5 flex justify-between bg-white text-[#ec111a]">
                    <span>Total Cargos / Compras (-):</span>
                    <span className="font-mono font-bold">
                      -{currentStatement.currencySymbol} {currentStatement.totalDebits.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-2.5 flex justify-between bg-[#ec111a]/5 font-bold text-[#1b1b1c]">
                    <span>Saldo Disponible Final:</span>
                    <span className="font-mono text-[#ec111a] text-[13px]">
                      {currentStatement.currencySymbol} {currentStatement.finalBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sello y Certificación Digital */}
              <div className="border border-dashed border-[#006b54]/40 bg-[#006b54]/5 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006b54] text-[26px]">verified_user</span>
                  <div>
                    <p className="font-bold text-[11px] text-[#006b54]">Documento con Firma Digital Válida</p>
                    <p className="text-[10px] text-[#5b5e66]">Certificado emitido por Reniec / SBS Perú</p>
                  </div>
                </div>
                <div className="w-10 h-10 border border-[#006b54]/30 rounded bg-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px] text-[#006b54]">qr_code_2</span>
                </div>
              </div>
            </div>

            {/* Acciones de descarga y compartir */}
            <div className="p-4 bg-[#f6f3f2] border-t border-[#e5e2e1] flex items-center gap-2">
              <button
                onClick={() => {
                  onQuickNotify(`Estado_Cuenta_${currentStatement.id}.pdf guardado en descargas del dispositivo.`);
                  setIsViewerOpen(false);
                }}
                className="flex-1 h-11 bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[12px] rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                <span>Guardar PDF</span>
              </button>
              <button
                onClick={() => {
                  onQuickNotify('Enlace seguro del Estado de Cuenta copiado para compartir.');
                }}
                className="h-11 px-3 bg-white hover:bg-[#e5e2e1] text-[#1b1b1c] font-bold text-[12px] rounded-xl border border-[#e5e2e1] flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
                title="Compartir"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                <span>Compartir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
