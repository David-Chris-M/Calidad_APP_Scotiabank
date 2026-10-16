import React, { useState, useMemo } from 'react';
import { PlinContact, ViewState, Account } from '../../types/index.ts';

interface PlinViewProps {
  contacts: PlinContact[];
  accounts: Account[];
  onNavigate: (view: ViewState) => void;
  onSendPlinSuccess: (recipientName: string, amount: number, phone: string) => void;
  onQuickNotify: (msg: string) => void;
}

export const PlinView: React.FC<PlinViewProps> = ({
  contacts,
  accounts,
  onNavigate,
  onSendPlinSuccess,
  onQuickNotify
}) => {
  // Permission state (HU010 Criterio 01: usuario otorga permisos de contactos)
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncDone, setSyncDone] = useState<boolean>(true);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'contacts' | 'scan' | 'my-qr'>('contacts');

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'plin-only' | 'no-plin'>('all');

  // HU010 Criterio 02: Modal para contacto no afiliado
  const [unregisteredContact, setUnregisteredContact] = useState<PlinContact | null>(null);

  // Modal para transferir a contacto afiliado
  const [selectedPlinContact, setSelectedPlinContact] = useState<PlinContact | null>(null);
  const [transferAmount, setTransferAmount] = useState('25.00');

  // Sincronización manual / re-contraste con el servidor
  const handleResyncWithServer = () => {
    setIsSyncing(true);
    setSyncDone(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncDone(true);
      onQuickNotify('Directorio sincronizado y contrastado con el servidor Plin');
    }, 700);
  };

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.replace(/\s/g, '').includes(searchTerm.replace(/\s/g, ''));

      if (!matchesSearch) return false;

      if (filterMode === 'plin-only') return c.isPlinUser;
      if (filterMode === 'no-plin') return !c.isPlinUser;
      return true;
    });
  }, [contacts, searchTerm, filterMode]);

  const plinCount = useMemo(() => contacts.filter((c) => c.isPlinUser).length, [contacts]);
  const noPlinCount = contacts.length - plinCount;

  const handleContactClick = (contact: PlinContact) => {
    if (!contact.isPlinUser) {
      // HU010 Criterio 02: Contacto no registrado en la red Plin
      setUnregisteredContact(contact);
    } else {
      // Contacto afiliado: abrir transferencia rápida
      setSelectedPlinContact(contact);
      setTransferAmount('25.00');
    }
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlinContact) return;
    const numAmount = parseFloat(transferAmount) || 20;
    onSendPlinSuccess(selectedPlinContact.name, numAmount, selectedPlinContact.phone);
    setSelectedPlinContact(null);
  };

  const handleSendInvite = () => {
    if (!unregisteredContact) return;
    onQuickNotify(`Invitación a Plin enviada por SMS a ${unregisteredContact.name} (${unregisteredContact.phone})`);
    setUnregisteredContact(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fcf9f8] animate-in fade-in duration-200">
      {/* Plin Brand Hero Banner */}
      <div className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#0077b6] flex items-center justify-center font-extrabold text-[18px] shadow-sm tracking-tight">
              plin
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold tracking-tight leading-tight">
                Plin Scotiabank
              </h2>
              <p className="text-[11px] text-white/80">Transfiere gratis a cualquier banco</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResyncWithServer}
            disabled={isSyncing}
            className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
            title="Sincronizar agenda con el servidor Plin"
          >
            <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isSyncing ? 'Sincronizando...' : 'Actualizar'}</span>
          </button>
        </div>

        {/* Sub-tabs: Contactos, Escanear, Mi QR */}
        <div className="grid grid-cols-3 gap-1 bg-black/15 p-1 rounded-xl text-[12px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'contacts'
                ? 'bg-white text-[#0077b6] shadow-xs'
                : 'text-white/85 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">contacts</span>
            <span>Contactos ({plinCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'scan'
                ? 'bg-white text-[#0077b6] shadow-xs'
                : 'text-white/85 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
            <span>Escanear QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my-qr')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'my-qr'
                ? 'bg-white text-[#0077b6] shadow-xs'
                : 'text-white/85 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            <span>Mi QR Plin</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar pb-24 space-y-4">
        {/* ======================================================== */}
        {/* TAB 1: DIRECTORIO DE CONTACTOS (HU010)                   */}
        {/* ======================================================== */}
        {activeTab === 'contacts' && (
          <div className="space-y-3.5">
            {/* Permiso de contactos / Feedback de sincronización */}
            {!hasPermission ? (
              <div className="bg-white rounded-2xl p-5 border border-[#e5e7eb] text-center shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#00b4d8]/15 text-[#0077b6] flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[32px]">perm_contact_calendar</span>
                </div>
                <h3 className="font-extrabold text-[16px] text-[#1b1b1c] mb-1">
                  Permiso de Contactos
                </h3>
                <p className="text-[12px] text-[#5b5e66] leading-relaxed mb-4">
                  Para identificar quiénes de tus amigos usan Plin y transferirles sin comisiones, necesitamos permiso para contrastar tu agenda telefónica.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setHasPermission(true);
                    handleResyncWithServer();
                  }}
                  className="w-full h-11 rounded-xl bg-[#0077b6] hover:bg-[#005f94] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Permitir Acceso a Contactos</span>
                </button>
              </div>
            ) : (
              <>
                {/* Sync status badge */}
                <div className="flex items-center justify-between text-[11px] text-[#5b5e66] px-1">
                  <span className="flex items-center gap-1 text-[#006b54] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#006b54] animate-pulse" />
                    Directorio contrastado con el servidor Plin
                  </span>
                  <span>{contacts.length} contactos en agenda</span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5b5e66] text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar contacto o teléfono..."
                    className="w-full h-11 pl-10 pr-9 rounded-xl bg-white border border-[#d1d5db] focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/15 outline-hidden text-[13px] font-medium shadow-xs"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8d94] hover:text-[#1b1b1c]"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 text-[12px] font-bold">
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      filterMode === 'all'
                        ? 'bg-[#1b1b1c] text-white shadow-xs'
                        : 'bg-white text-[#5b5e66] border border-[#e5e7eb] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    Todos ({contacts.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterMode('plin-only')}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                      filterMode === 'plin-only'
                        ? 'bg-[#0077b6] text-white shadow-xs'
                        : 'bg-white text-[#0077b6] border border-[#0077b6]/30 hover:bg-[#00b4d8]/10'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Con Plin ({plinCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterMode('no-plin')}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      filterMode === 'no-plin'
                        ? 'bg-[#5b5e66] text-white shadow-xs'
                        : 'bg-white text-[#5b5e66] border border-[#e5e7eb] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    Sin Plin ({noPlinCount})
                  </button>
                </div>

                {/* Contacts Directory List */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-xs divide-y divide-[#f0eded]">
                  {filteredContacts.length === 0 ? (
                    <div className="p-8 text-center text-[#5b5e66]">
                      <span className="material-symbols-outlined text-[36px] text-[#8a8d94] mb-2 block">
                        search_off
                      </span>
                      <p className="text-[13px] font-semibold">No se encontraron contactos</p>
                      <p className="text-[11px] text-[#8a8d94]">Intenta con otro nombre o número telefónico</p>
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => handleContactClick(contact)}
                        className="p-3.5 flex items-center justify-between hover:bg-[#fcf9f8] cursor-pointer transition-colors active:bg-[#f6f3f2] group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar Circle */}
                          <div
                            className="w-11 h-11 rounded-full text-white font-bold text-[14px] flex items-center justify-center shrink-0 shadow-xs relative"
                            style={{ backgroundColor: contact.avatarColor }}
                          >
                            {contact.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}

                            {/* Plin mini indicator dot on avatar */}
                            {contact.isPlinUser && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00b4d8] ring-2 ring-white flex items-center justify-center text-[9px] font-black text-white">
                                P
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-[14px] text-[#1b1b1c] group-hover:text-[#0077b6] transition-colors">
                                {contact.name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#5b5e66]">
                              <span className="font-mono">{contact.phone}</span>
                              {contact.bank && (
                                <>
                                  <span>•</span>
                                  <span>{contact.bank}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Plin Badge / Status (HU010 Criterio 01 & 02) */}
                        <div className="text-right">
                          {contact.isPlinUser ? (
                            <div className="flex flex-col items-end gap-0.5">
                              {/* Distinctive Plin Logo Badge */}
                              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white text-[10px] font-black tracking-tight px-2.5 py-0.5 rounded-full shadow-2xs">
                                <span className="material-symbols-outlined text-[12px]">bolt</span>
                                PLIN
                              </span>
                              <span className="text-[10px] text-[#006b54] font-semibold">
                                Transferir &gt;
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-[#f0eded] text-[#5b5e66] text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <span className="material-symbols-outlined text-[11px]">person_add</span>
                              Invitar
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ESCANEAR QR PLIN                                  */}
        {/* ======================================================== */}
        {activeTab === 'scan' && (
          <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs text-center flex flex-col items-center">
            <div className="relative w-52 h-52 bg-neutral-900 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-[#00b4d8] shadow-inner mb-4">
              <div className="absolute inset-4 border border-dashed border-white/50 rounded-2xl pointer-events-none" />
              <div className="w-full h-0.5 bg-[#00b4d8] absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_12px_#00b4d8]" />
              <span className="material-symbols-outlined text-white/40 text-[56px]">
                qr_code_scanner
              </span>
              <span className="absolute bottom-3 text-white text-[11px] bg-black/60 px-3 py-1 rounded-full font-medium">
                Enfoca el código QR Plin
              </span>
            </div>
            <h3 className="font-bold text-[15px] text-[#1b1b1c] mb-1">
              Escanea códigos QR interoperables
            </h3>
            <p className="text-[12px] text-[#5b5e66] mb-4">
              Acepta códigos QR de Plin, Yape y comercios afiliados en todo el Perú.
            </p>
            <button
              type="button"
              onClick={() => {
                onSendPlinSuccess('Comercio Plin', 35.00, 'QR Dinámico');
              }}
              className="w-full h-11 rounded-xl bg-[#0077b6] hover:bg-[#005f94] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Simular Pago QR (S/ 35.00)</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MI QR PLIN                                        */}
        {/* ======================================================== */}
        {activeTab === 'my-qr' && (
          <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs text-center flex flex-col items-center">
            <span className="text-[11px] font-mono font-bold text-[#0077b6] bg-[#00b4d8]/15 px-3 py-0.5 rounded-full mb-3">
              Cobrar con Plin
            </span>
            <div className="p-4 bg-white border-2 border-dashed border-[#00b4d8] rounded-2xl shadow-xs mb-3">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PLIN-SCOTIA-CAMILA-984210948"
                alt="QR Plin de Camila"
                className="w-44 h-44 object-contain"
              />
            </div>
            <h4 className="font-extrabold text-[16px] text-[#1b1b1c]">Camila Morales Silva</h4>
            <p className="text-[12px] font-mono text-[#5b5e66] mt-0.5">Plin Scotiabank • 984 ••• 201</p>
            <p className="text-[11px] text-[#5b5e66] mt-3">
              Muestra este código para recibir dinero al instante sin comisiones.
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* HU010 Criterio 02: Modal ante Contacto No Afiliado        */}
      {/* ======================================================== */}
      {unregisteredContact && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-[#303030]/65 backdrop-blur-xs transition-opacity"
            onClick={() => setUnregisteredContact(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center border border-[#e5e7eb]">
            {/* Plin Invite Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-xs border border-amber-200">
              <span className="material-symbols-outlined text-[34px]">person_off</span>
            </div>

            <h3 className="text-[17px] font-extrabold text-[#1b1b1c] tracking-tight mb-2">
              Contacto no registrado
            </h3>

            {/* Exact textual requirement of HU010 Criterio 02 */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-4">
              <p className="text-[13px] font-bold text-amber-900 leading-snug">
                Este contacto aún no usa Plin. Puedes invitarlo enviándole un mensaje
              </p>
            </div>

            <div className="p-3 bg-[#fcf9f8] rounded-xl text-left text-[12px] text-[#5b5e66] mb-5 border border-[#e5e2e1] space-y-1">
              <p>
                <strong>Nombre:</strong> {unregisteredContact.name}
              </p>
              <p>
                <strong>Celular:</strong> <span className="font-mono">{unregisteredContact.phone}</span>
              </p>
              <p className="text-[11px] text-[#8a8d94] pt-1">
                Al invitarlo, le llegará un mensaje con los sencillos pasos para activar Plin en su banco.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleSendInvite}
                className="w-full h-12 rounded-xl bg-[#0077b6] hover:bg-[#005f94] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[19px]">send</span>
                <span>Enviar Invitación por Mensaje</span>
              </button>

              <button
                type="button"
                onClick={() => setUnregisteredContact(null)}
                className="w-full h-11 rounded-xl bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1b1c] font-semibold text-[13px] flex items-center justify-center transition-colors"
              >
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Transferir con Plin a Contacto Afiliado           */}
      {/* ======================================================== */}
      {selectedPlinContact && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-[#303030]/65 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedPlinContact(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 border border-[#e5e7eb]">
            <div className="flex items-center justify-between p-4 border-b border-[#e5e2e1] -mx-6 -mt-6 mb-5 bg-[#f6f3f2] rounded-t-3xl">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white font-extrabold text-[12px] flex items-center justify-center">
                  plin
                </span>
                <h3 className="font-extrabold text-[15px] text-[#1b1b1c]">Transferir con Plin</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlinContact(null)}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#5b5e66] hover:bg-[#e5e2e1]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Recipient Details */}
            <div className="flex items-center gap-3 p-3 bg-[#fcf9f8] rounded-2xl border border-[#e5e2e1] mb-4">
              <div
                className="w-12 h-12 rounded-full text-white font-bold text-[14px] flex items-center justify-center shrink-0 shadow-xs"
                style={{ backgroundColor: selectedPlinContact.avatarColor }}
              >
                {selectedPlinContact.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-[#1b1b1c]">{selectedPlinContact.name}</h4>
                <p className="text-[12px] font-mono text-[#5b5e66]">{selectedPlinContact.phone}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#0077b6] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                  {selectedPlinContact.bank} • Sin comisiones
                </span>
              </div>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#1b1b1c] block mb-1">
                  Monto a Transferir
                </label>
                <div className="relative flex items-center">
                  <span className="font-extrabold text-[18px] text-[#0077b6] absolute left-3">
                    S/
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="1500"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full h-12 pl-10 pr-3 rounded-xl bg-[#fcf9f8] border border-[#d1d5db] font-mono text-[18px] font-bold text-[#1b1b1c] focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20 outline-hidden"
                  />
                </div>
              </div>

              {/* Amount Quick Chips */}
              <div className="flex gap-2">
                {['10.00', '20.00', '50.00', '100.00'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTransferAmount(amt)}
                    className={`flex-1 py-1.5 rounded-lg text-[12px] font-mono font-bold transition-all ${
                      transferAmount === amt
                        ? 'bg-[#0077b6] text-white shadow-2xs'
                        : 'bg-[#f0eded] text-[#5b5e66] hover:bg-[#e5e2e1]'
                    }`}
                  >
                    S/ {parseInt(amt)}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:opacity-95 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] mt-2"
              >
                <span>Confirmar y Enviar</span>
                <span className="material-symbols-outlined text-[19px]">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
