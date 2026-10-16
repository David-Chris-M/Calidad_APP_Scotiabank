import React from 'react';

interface BenefitsViewProps {
  onQuickNotify: (msg: string) => void;
}

export const BenefitsView: React.FC<BenefitsViewProps> = ({ onQuickNotify }) => {
  const perks = [
    {
      id: 'p-1',
      title: 'Restaurantes & Gastronomía',
      discount: 'Hasta 30% dscto.',
      desc: 'En más de 80 restaurantes seleccionados de Lima y provincias.',
      icon: 'restaurant',
      tag: 'Gastronomía'
    },
    {
      id: 'p-2',
      title: 'Apple & iShop Perú',
      discount: 'Hasta 12 Cuotas Sin Intereses',
      desc: 'En iPhone, MacBook y accesorios con tu Scotia Visa Signature.',
      icon: 'laptop_mac',
      tag: 'Tecnología'
    },
    {
      id: 'p-3',
      title: 'Cineplanet Prime',
      discount: '2x1 en Entradas y Combos',
      desc: 'De lunes a viernes pagando con tu tarjeta Débito o Crédito Scotia.',
      icon: 'movie',
      tag: 'Entretenimiento'
    },
    {
      id: 'p-4',
      title: 'Viajes & Despegar',
      discount: 'Canje de Scotia Puntos',
      desc: 'Vuela a cualquier destino canjeando tus puntos acumulados.',
      icon: 'flight',
      tag: 'Viajes'
    }
  ];

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-3 gap-4">
      {/* Puntos Card */}
      <div className="bg-gradient-to-br from-[#1b1b1c] to-[#303030] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#ec111a]/20 blur-xl"></div>
        <div className="flex items-center justify-between relative z-10 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#95f5d4] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">stars</span>
            Programa Scotia Plus
          </span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">
            Nivel Signature
          </span>
        </div>

        <div className="relative z-10 my-2">
          <p className="text-[12px] text-white/70">Tus Scotia Puntos disponibles</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-mono text-[32px] font-extrabold text-white">14,850</span>
            <span className="font-mono text-[13px] text-white/70">pts</span>
          </div>
          <p className="text-[11px] text-[#95f5d4] mt-0.5">
            Equivalente a S/ 445.50 para compras y canjes
          </p>
        </div>

        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center gap-2">
          <button
            onClick={() => onQuickNotify('Catálogo de Canje de Scotia Puntos abierto')}
            className="flex-1 py-2 rounded-xl bg-[#ec111a] hover:bg-[#c0000f] text-white font-bold text-[12px] transition-colors"
          >
            Canjear Puntos
          </button>
          <button
            onClick={() => onQuickNotify('Historial de acumulación de puntos cargado')}
            className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-[12px] transition-colors"
          >
            Ver Movimientos
          </button>
        </div>
      </div>

      {/* Promociones Exclusivas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[16px] text-[#1b1b1c]">Promociones Exclusivas</h3>
          <span className="text-[11px] text-[#ec111a] font-semibold">Semana Scotia</span>
        </div>

        <div className="space-y-2.5">
          {perks.map((perk) => (
            <div
              key={perk.id}
              onClick={() => onQuickNotify(`Beneficio activado: ${perk.title} (${perk.discount})`)}
              className="p-3.5 bg-white rounded-2xl shadow-sm border border-[#e5e2e1] hover:border-[#ec111a]/40 cursor-pointer transition-all active:scale-[0.99] flex items-start gap-3.5"
            >
              <div className="w-11 h-11 rounded-xl bg-[#ffdad5] text-[#ec111a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">{perk.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-[13px] text-[#1b1b1c] truncate">{perk.title}</h4>
                  <span className="text-[10px] font-mono text-[#5b5e66] bg-[#f6f3f2] px-2 py-0.5 rounded">
                    {perk.tag}
                  </span>
                </div>
                <p className="text-[12px] font-bold text-[#ec111a] mt-0.5">{perk.discount}</p>
                <p className="text-[11px] text-[#5b5e66] mt-0.5 leading-snug">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
