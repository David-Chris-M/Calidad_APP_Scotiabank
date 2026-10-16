import React, { useState } from 'react';
import { TransferLimitSettings } from '../../types/index.ts';

interface TransferLimitsViewProps {
  limits: TransferLimitSettings;
  onRequestAuthToken: (newLimit: number) => void;
  onQuickNotify: (msg: string) => void;
}

export const TransferLimitsView: React.FC<TransferLimitsViewProps> = ({
  limits,
  onRequestAuthToken,
  onQuickNotify
}) => {
  const [sliderVal, setSliderVal] = useState<number>(limits.maxLimit);
  const [requireToken, setRequireToken] = useState(limits.requireTokenAbove1000);
  const [limitError, setLimitError] = useState<string | null>(null);

  const presets = [1000, 3000, 5000, 10000];

  const handlePresetClick = (val: number) => {
    setSliderVal(val);
    setLimitError(null);
  };

  const handleAmountInputChange = (val: number) => {
    setSliderVal(val);
    if (val > 10000) {
      setLimitError('El monto excede el límite máximo permitido para la app (S/ 10,000.00)');
    } else {
      setLimitError(null);
    }
  };

  // HU039: Modificación de límites y restricción al superar S/ 10,000
  const handleSave = () => {
    if (sliderVal > 10000) {
      setLimitError('El monto excede el límite máximo permitido para la app (S/ 10,000.00)');
      onQuickNotify('El monto excede el límite máximo permitido para la app (S/ 10,000.00)');
      return;
    }
    setLimitError(null);
    onRequestAuthToken(sliderVal);
  };

  const handleReset = () => {
    setSliderVal(5000);
    setLimitError(null);
    onQuickNotify('Límite reajustado a parámetro recomendado (S/ 5,000.00)');
  };

  const percentUsed = Math.min(Math.round((limits.dailyConsumed / sliderVal) * 100), 100);
  const availableToday = Math.max(sliderVal - limits.dailyConsumed, 0);

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3">
      {/* Breadcrumb & Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-[#5b5e66]">
          <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
          <span className="text-[11px] font-mono uppercase tracking-wider">
            Seguridad y Control • Límites
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#006b54]/10 text-[#006b54] border border-[#006b54]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#006b54] animate-pulse"></span>
          <span className="text-[11px] font-mono font-bold">En vivo • Activo</span>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e2e1] flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ec111a]/10 flex items-center justify-center text-[#ec111a]">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
          </div>
          <div>
            <p className="text-[11px] text-[#5b5e66] font-medium">Cuenta configurada</p>
            <p className="font-bold text-[14px] text-[#1b1b1c]">Sueldo Scotia Soles •••• 4821</p>
            <p className="font-mono text-[11px] text-[#5b5e66] mt-0.5">Saldo disp: S/ 32,450.00</p>
          </div>
        </div>
        <button
          onClick={() => onQuickNotify('Esta cuenta es la principal para transferencias y cargos')}
          className="w-8 h-8 rounded-lg bg-[#f6f3f2] flex items-center justify-center text-[#5b5e66] hover:text-[#ec111a] active:scale-95"
          title="Ver detalles"
        >
          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
        </button>
      </div>

      {/* Real-time Consumption Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e2e1] space-y-3 mb-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono text-[#5b5e66] uppercase tracking-wider">
              Monitoreo en tiempo real
            </span>
            <h2 className="font-bold text-[15px] text-[#1b1b1c] mt-0.5">Límite Consumido Hoy</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad5] text-[#930008] font-mono text-[11px] font-bold">
            {percentUsed}% usado
          </span>
        </div>

        {/* Metrics */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="font-mono text-[22px] font-extrabold text-[#ec111a]">
              S/ {limits.dailyConsumed.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-[#5b5e66] ml-1.5 font-mono">
              de S/ {sliderVal.toLocaleString('es-PE', { minimumFractionDigits: 2 })} max
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#5b5e66] block font-mono">Disponible hoy</span>
            <span className="font-mono text-[14px] font-bold text-[#006b54]">
              S/ {availableToday.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#f0eded] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#ec111a] h-full rounded-full transition-all duration-300"
            style={{ width: `${percentUsed}%` }}
          ></div>
        </div>

        <div className="flex items-center gap-1.5 pt-0.5 text-[#5b5e66]">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span className="text-[11px]">El cupo se restablece automáticamente a las 00:00 hrs.</span>
        </div>
      </div>

      {/* Modification Settings Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e2e1] space-y-4 mb-3">
        <div>
          <h2 className="font-bold text-[15px] text-[#1b1b1c]">Modificar Límite Máximo Diario</h2>
          <p className="text-[12px] text-[#5b5e66] mt-0.5">
            Ajusta el tope máximo para transferencias a terceros e interbancarias.
          </p>
        </div>

        {/* Bank TextInput Display */}
        <div className={`bg-[#f6f3f2] rounded-xl p-3.5 space-y-1 border transition-all ${
          limitError ? 'border-[#ec111a] bg-[#ec111a]/5 ring-1 ring-[#ec111a]' : 'border-[#e5e2e1]'
        }`}>
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono text-[#5b5e66] block uppercase tracking-wider">
              Nuevo Límite Máximo Diario en Soles (S/)
            </label>
            <button
              type="button"
              onClick={() => handleAmountInputChange(12000)}
              className="text-[#ec111a] text-[10px] font-mono font-bold hover:underline"
            >
              Probar &gt; S/ 10,000 (HU039)
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline w-full">
              <span className="font-bold text-[20px] text-[#ec111a] mr-2">S/</span>
              <input
                type="number"
                step="100"
                value={sliderVal}
                onChange={(e) => handleAmountInputChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent font-mono text-[24px] font-extrabold text-[#1b1b1c] focus:outline-none"
              />
            </div>
            <span className="material-symbols-outlined text-[#5b5e66] text-[20px]">tune</span>
          </div>
        </div>

        {/* HU039 Criterio 02: Mensaje en rojo al superar límite máximo de banca móvil */}
        {limitError && (
          <div className="p-3 bg-[#ec111a]/10 border border-[#ec111a]/30 rounded-xl flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[#ec111a] text-[18px] shrink-0">error</span>
            <p className="text-[12px] font-bold text-[#ec111a]">{limitError}</p>
          </div>
        )}

        {/* Preset Pills */}
        <div>
          <p className="text-[11px] font-mono text-[#5b5e66] mb-2 font-medium">
            Montos habituales recomendados:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((val) => {
              const isSelected = sliderVal === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePresetClick(val)}
                  className={`py-2 rounded-xl font-mono text-[12px] font-bold text-center transition-all shadow-xs active:scale-95 border ${
                    isSelected
                      ? 'bg-[#1b1b1c] text-white border-[#1b1b1c]'
                      : 'bg-white hover:bg-[#f6f3f2] text-[#1b1b1c] border-[#e5e2e1]'
                  }`}
                >
                  S/ {val >= 1000 ? `${val / 1000},000` : val}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="pt-2 space-y-2">
          <div className="flex justify-between items-center px-1 text-[11px] font-mono text-[#5b5e66]">
            <span>Mín: S/ 500</span>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdad5] text-[#930008] font-bold">
              S/ {sliderVal.toLocaleString('es-PE', { minimumFractionDigits: 2 })} sel.
            </span>
            <span>Máx: S/ 10,000</span>
          </div>

          <div className="relative flex items-center py-1">
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={sliderVal}
              onChange={(e) => setSliderVal(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-[#e5e2e1] rounded-lg appearance-none cursor-pointer accent-[#ec111a]"
            />
          </div>

          <div className="flex justify-between text-[#5b5e66] text-[10px] font-mono px-0.5">
            <span>S/ 500.00</span>
            <span>S/ 5,000.00 (Normal)</span>
            <span>S/ 10,000.00</span>
          </div>
        </div>
      </div>

      {/* Security Checkbox & Policy */}
      <div className="space-y-3 mb-4">
        {/* Checkbox Rule */}
        <label className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#e5e2e1] flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={requireToken}
            onChange={(e) => setRequireToken(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            requireToken ? 'bg-[#ec111a] text-white' : 'bg-[#f0eded] text-transparent'
          }`}>
            <span className="material-symbols-outlined text-[16px]">check</span>
          </div>
          <div>
            <span className="text-[13px] font-bold text-[#1b1b1c] block">
              Requerir Token Digital para transacciones &gt; S/ 1,000.00
            </span>
            <span className="text-[11px] text-[#5b5e66] mt-0.5 block leading-snug">
              Protección preventiva ante fraudes cibernéticos y operaciones no habituales en cajeros o app.
            </span>
          </div>
        </label>

        {/* Policy notice */}
        <div className="bg-[#f6f3f2] rounded-2xl p-3.5 flex items-start gap-3 border border-[#e5e2e1]">
          <div className="w-8 h-8 rounded-full bg-[#006b54]/10 flex items-center justify-center shrink-0 text-[#006b54] mt-0.5">
            <span className="material-symbols-outlined text-[18px]">shield</span>
          </div>
          <p className="text-[11px] text-[#5b5e66] leading-relaxed">
            <strong className="text-[#1b1b1c] font-semibold">Política de Efectividad:</strong> Por tu seguridad, cualquier incremento de límite tiene efecto inmediato tras validar tu identidad con Token Digital. La reducción de límite es instantánea.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={handleSave}
          className="w-full h-12 bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
        >
          <span>Guardar Límites</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <button
          onClick={handleReset}
          className="text-[13px] text-[#ec111a] font-semibold hover:underline py-1"
        >
          Restablecer límite por defecto (S/ 5,000.00)
        </button>
      </div>
    </div>
  );
};
