import React, { useState } from 'react';
import { Account, FrequentService, ViewState } from '../../types/index.ts';
import { FREQUENT_SERVICES } from '../../data/mockData.ts';

interface ServicePayViewProps {
  accounts: Account[];
  onNavigate: (view: ViewState) => void;
  onOpenHelpModal: () => void;
  onCompleteServicePayment: (data: {
    serviceName: string;
    supplyCode: string;
    amount: number;
    account: Account;
  }) => void;
  onQuickNotify: (msg: string) => void;
}

export const ServicePayView: React.FC<ServicePayViewProps> = ({
  accounts,
  onNavigate,
  onOpenHelpModal,
  onCompleteServicePayment,
  onQuickNotify
}) => {
  const sueldoAcc = accounts.find((a) => a.type === 'sueldo') || accounts[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [supplyCode, setSupplyCode] = useState('1948201-9');
  const [selectedService, setSelectedService] = useState('Luz del Sur S.A.A.');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queriedDebt, setQueriedDebt] = useState<number | null>(null);
  const [noDebtNotice, setNoDebtNotice] = useState<string | null>(null);

  const handleSelectFrequent = (item: FrequentService) => {
    setSearchQuery(item.company);
    setSelectedService(item.company);
    setSupplyCode(item.code);
    setNoDebtNotice(null);
    setQueriedDebt(null);
    onQuickNotify(`Servicio seleccionado: ${item.name} (${item.code})`);
  };

  const handleCategorySelect = (catName: string) => {
    setSearchQuery(catName);
    onQuickNotify(`Filtrando categoría: ${catName}`);
  };

  const handleQueryDebt = () => {
    if (!supplyCode.trim()) {
      onQuickNotify('Ingresa un número de suministro o identificador');
      return;
    }

    setIsQuerying(true);
    setNoDebtNotice(null);

    setTimeout(() => {
      setIsQuerying(false);
      // HU026 Criterio 02: Alerta ante suministro sin deuda pendiente
      if (supplyCode.trim() === '000000' || supplyCode.trim() === '0000000' || supplyCode.trim() === '999999') {
        setQueriedDebt(null);
        setNoDebtNotice('No se encontraron recibos pendientes de pago para este código de suministro');
        onQuickNotify('No se encontraron recibos pendientes de pago para este código de suministro');
      } else {
        setNoDebtNotice(null);
        setQueriedDebt(142.80);
        onQuickNotify('Deuda consultada en línea con Luz del Sur: S/ 142.80');
      }
    }, 700);
  };

  const handlePayService = () => {
    setIsQuerying(true);
    setTimeout(() => {
      setIsQuerying(false);
      onCompleteServicePayment({
        serviceName: selectedService || 'Luz del Sur S.A.A.',
        supplyCode: supplyCode || '1948201-9',
        amount: queriedDebt || 142.80,
        account: sueldoAcc
      });
      onNavigate('servicio-receipt');
    }, 1100);
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3">
      {/* Stepper de Flujo */}
      <div className="pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono text-[#ec111a] font-bold uppercase tracking-wider">
            Paso 1 de 2 • Búsqueda y Consulta
          </span>
          <span className="text-[11px] font-mono text-[#5b5e66] font-medium">50% completado</span>
        </div>
        <div className="w-full h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden flex">
          <div className="h-full bg-[#ec111a] rounded-full w-1/2 transition-all duration-500"></div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Selector Cuenta de Cargo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-wider px-0.5">
            Cuenta de Cargo
          </label>
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#e5e7eb] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#ec111a]/10 flex items-center justify-center shrink-0 text-[#ec111a]">
                <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[14px] text-[#1b1b1c] truncate">
                    {sueldoAcc.name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#006b54]/10 text-[#006b54] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006b54] animate-pulse"></span>
                    Activa
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5b5e66] font-mono text-[12px]">
                  <span>•••• {sueldoAcc.number}</span>
                  <span>•</span>
                  <span className="text-[#1b1b1c] font-bold">
                    {sueldoAcc.currencySymbol} {sueldoAcc.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px]">disp.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buscador de Empresa */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-0.5">
            <label htmlFor="service-search-input" className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-wider">
              Buscar Empresa o Entidad
            </label>
            <button
              onClick={() => onQuickNotify('Catálogo con más de 1,200 convenios disponibles')}
              className="text-[#ec111a] text-[11px] font-semibold flex items-center gap-0.5 hover:underline"
            >
              <span>Ver catálogo completo</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#5b5e66] text-[20px] pointer-events-none">
              search
            </span>
            <input
              id="service-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar empresa (ej. Luz del Sur, Sedapal, Movistar)"
              className="w-full h-12 pl-10 pr-12 rounded-xl bg-white border border-[#e5e7eb] text-[#1b1b1c] text-[14px] placeholder:text-[#5b5e66]/60 shadow-sm focus:outline-none focus:border-[#ec111a] transition-all"
            />
            <button
              type="button"
              onClick={() => onQuickNotify('Abriendo escáner de código de barras de recibo...')}
              className="absolute right-1.5 w-9 h-9 rounded-lg bg-[#f6f3f2] flex items-center justify-center text-[#1b1b1c] hover:text-[#ec111a] active:scale-95"
              title="Escanear recibo físico"
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            </button>
          </div>
        </div>

        {/* Frecuentes en Scotia */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ec111a] text-[16px]">history</span>
              Frecuentes en Scotia
            </span>
            <span className="text-[11px] font-mono text-[#5b5e66]">3 guardados</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {FREQUENT_SERVICES.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectFrequent(item)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-[#e5e2e1] shadow-xs shrink-0 active:scale-95 hover:border-[#ec111a]/40 transition-all text-left"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.accentColor}`}>
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[12px] text-[#1b1b1c] leading-tight truncate max-w-[130px]">
                    {item.name}
                  </span>
                  <span className="font-mono text-[10px] text-[#5b5e66]">Cod: {item.code}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explorar por Categoría */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-[#5b5e66] uppercase tracking-wider px-0.5">
            Explorar por Categoría
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Luz y Agua */}
            <button
              onClick={() => handleCategorySelect('Luz y Agua')}
              className="p-3.5 rounded-2xl bg-white border border-[#e5e2e1] shadow-xs text-left hover:border-[#ec111a]/40 active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#ec111a]/10 text-[#ec111a] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#f6f3f2] text-[#5b5e66]">
                  Básico
                </span>
              </div>
              <h2 className="font-bold text-[14px] text-[#1b1b1c] leading-tight">Luz y Agua</h2>
              <p className="text-[11px] text-[#5b5e66] mt-0.5">Luz del Sur, Enel, Sedapal</p>
            </button>

            {/* Telefonía e Internet */}
            <button
              onClick={() => handleCategorySelect('Telefonía e Internet')}
              className="p-3.5 rounded-2xl bg-white border border-[#e5e2e1] shadow-xs text-left hover:border-[#ec111a]/40 active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#006b54]/10 text-[#006b54] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">devices</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#006b54]/10 text-[#006b54]">
                  Recargas
                </span>
              </div>
              <h2 className="font-bold text-[14px] text-[#1b1b1c] leading-tight">Telefonía e Internet</h2>
              <p className="text-[11px] text-[#5b5e66] mt-0.5">Movistar, Claro, Entel, Wow</p>
            </button>

            {/* Educación */}
            <button
              onClick={() => handleCategorySelect('Educación')}
              className="p-3.5 rounded-2xl bg-white border border-[#e5e2e1] shadow-xs text-left hover:border-[#ec111a]/40 active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#dfe2ec] text-[#181c22] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#f6f3f2] text-[#5b5e66]">
                  Pensiones
                </span>
              </div>
              <h2 className="font-bold text-[14px] text-[#1b1b1c] leading-tight">Educación</h2>
              <p className="text-[11px] text-[#5b5e66] mt-0.5">Colegios, PUCP, UPC, ICPNA</p>
            </button>

            {/* Clubes y Seguros */}
            <button
              onClick={() => handleCategorySelect('Clubes y Seguros')}
              className="p-3.5 rounded-2xl bg-white border border-[#e5e2e1] shadow-xs text-left hover:border-[#ec111a]/40 active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#f6f3f2] text-[#1b1b1c] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#f6f3f2] text-[#5b5e66]">
                  Pólizas
                </span>
              </div>
              <h2 className="font-bold text-[14px] text-[#1b1b1c] leading-tight">Clubes y Seguros</h2>
              <p className="text-[11px] text-[#5b5e66] mt-0.5">Club Regatas, Rímac, Pacífico</p>
            </button>
          </div>
        </div>

        {/* Código de Suministro */}
        <div className="flex flex-col gap-1.5 bg-white p-4 rounded-2xl shadow-sm border border-[#e5e2e1]">
          <div className="flex items-center justify-between">
            <label htmlFor="supply-code-input" className="text-[12px] font-bold text-[#1b1b1c] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ec111a] text-[18px]">receipt_long</span>
              Código de Suministro / Identificador
            </label>
            <button
              type="button"
              onClick={onOpenHelpModal}
              className="text-[#ec111a] text-[11px] font-semibold flex items-center gap-0.5 hover:underline"
            >
              <span className="material-symbols-outlined text-[15px]">help_outline</span>
              ¿Dónde está?
            </button>
          </div>

          <div className="relative flex items-center mt-1">
            <input
              id="supply-code-input"
              type="text"
              value={supplyCode}
              onChange={(e) => {
                setSupplyCode(e.target.value);
                setQueriedDebt(null);
              }}
              placeholder="Ej. 109283746 o DNI titular"
              className="w-full h-12 px-3.5 rounded-xl bg-[#f6f3f2] text-[#1b1b1c] font-mono text-[15px] tracking-wider placeholder:text-[#5b5e66]/50 focus:outline-none focus:bg-white border border-transparent focus:border-[#ec111a] transition-all"
            />
            {supplyCode && (
              <button
                type="button"
                onClick={() => {
                  setSupplyCode('');
                  setQueriedDebt(null);
                }}
                className="absolute right-3 text-[#5b5e66] hover:text-[#1b1b1c] p-1"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#5b5e66] mt-1">
            <span>Ingresa el código que figura en tu recibo para autoliquidar.</span>
            <button
              type="button"
              onClick={() => {
                setSupplyCode('000000');
                setQueriedDebt(null);
                setNoDebtNotice(null);
              }}
              className="text-[#ec111a] font-semibold hover:underline"
            >
              Probar sin deuda (000000)
            </button>
          </div>

          {/* Resultado de consulta de deuda si existe */}
          {queriedDebt !== null && (
            <div className="mt-3 p-3 bg-[#006b54]/10 rounded-xl border border-[#006b54]/20 flex items-center justify-between animate-in fade-in duration-200">
              <div>
                <span className="text-[11px] text-[#006b54] font-semibold block">Deuda Pendiente (Mes Octubre)</span>
                <span className="font-mono text-[18px] font-bold text-[#1b1b1c]">
                  S/ {queriedDebt.toFixed(2)}
                </span>
              </div>
              <span className="bg-[#006b54] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                Vence en 5 días
              </span>
            </div>
          )}

          {/* HU026 Criterio 02: Aviso informativo sin deuda pendiente */}
          {noDebtNotice && (
            <div className="mt-3 p-3 bg-[#ec111a]/10 rounded-xl border border-[#ec111a]/30 flex items-start gap-2.5 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[#ec111a] text-[20px] shrink-0 mt-0.5">
                info
              </span>
              <div>
                <p className="text-[12px] font-bold text-[#ec111a]">Aviso de Suministro</p>
                <p className="text-[11px] font-semibold text-[#1b1b1c] mt-0.5">{noDebtNotice}</p>
              </div>
            </div>
          )}
        </div>

        {/* Garantía Scotia */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#95f5d4]/20 border border-[#95f5d4]/40">
          <div className="w-8 h-8 rounded-lg bg-[#006b54] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">price_check</span>
          </div>
          <div>
            <span className="text-[12px] font-bold text-[#006b54] leading-tight block">
              Sin comisiones y aplicación en línea
            </span>
            <p className="text-[11px] text-[#5b5e66] mt-0.5 leading-snug">
              Tus pagos se aplican directamente en el sistema de la empresa afiliada con notificación inmediata y comprobante oficial.
            </p>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="flex flex-col gap-2 pt-1">
          {queriedDebt === null ? (
            <button
              onClick={handleQueryDebt}
              disabled={isQuerying}
              className="w-full h-12 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] active:scale-[0.99] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md transition-all"
            >
              {isQuerying ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                  <span>Conectando con la entidad...</span>
                </>
              ) : (
                <>
                  <span>Consultar Deuda</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handlePayService}
              disabled={isQuerying}
              className="w-full h-12 rounded-xl bg-[#006b54] hover:bg-[#1a866b] active:scale-[0.99] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md transition-all"
            >
              {isQuerying ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                  <span>Procesando pago de recibo...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  <span>Pagar S/ {queriedDebt.toFixed(2)} Ahora</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[#5b5e66] text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-[#006b54]">lock</span>
            <span className="font-mono">Conexión encriptada directa con la empresa de servicio</span>
          </div>
        </div>
      </div>
    </div>
  );
};
