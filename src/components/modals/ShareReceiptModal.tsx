import React, { useState } from 'react';

interface ShareReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationCode: string;
  amount: string;
  concept: string;
  onSuccess: (msg: string) => void;
}

export const ShareReceiptModal: React.FC<ShareReceiptModalProps> = ({
  isOpen,
  onClose,
  operationCode,
  amount,
  concept,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleUseMyEmail = () => {
    setEmail('camila.morales@scotiabank.com.pe');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmail('camila.morales@scotiabank.com.pe');
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      onSuccess(`Constancia enviada a ${email || 'camila.morales@scotiabank.com.pe'}`);
      setTimeout(() => {
        setIsSent(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  const handleQuickShare = (platform: string) => {
    onSuccess(`Abriendo ${platform} para compartir constancia...`);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0f172a]/65 backdrop-blur-[4px] transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] shadow-2xl overflow-hidden z-10 pb-safe animate-in slide-in-from-bottom duration-300">
        {/* Grab Handle */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#e5e2e1] rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 flex items-start justify-between">
          <div className="flex flex-col pr-4">
            <h2 className="text-[19px] font-bold text-[#1b1b1c] leading-tight">
              Compartir Constancia de Pago
            </h2>
            <p className="text-[12px] text-[#5b5e66] mt-0.5">
              Comprobante {operationCode} • Transferencia por {amount}
            </p>
          </div>
          <button
            aria-label="Cerrar modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6f3f2] hover:bg-[#eae7e7] flex items-center justify-center text-[#1b1b1c] transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto pt-1 pb-6 no-scrollbar">
          {/* PDF Preview Card */}
          <div className="flex items-center gap-3 p-3 bg-[#f6f3f2] rounded-xl border border-[#f0eded]">
            <div className="w-11 h-11 rounded-lg bg-[#ec111a]/10 flex items-center justify-center text-[#ec111a] shrink-0">
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                picture_as_pdf
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[13px] text-[#1b1b1c] font-semibold truncate">
                Comprobante_{operationCode.replace('#', '')}.pdf
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[11px] text-[#5b5e66]">148 KB</span>
                <span className="w-1 h-1 rounded-full bg-[#c3c6cf]"></span>
                <span className="font-mono text-[11px] text-[#006b54] flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">verified_user</span>
                  Cifrado Oficial
                </span>
              </div>
            </div>
            <button
              onClick={() => onSuccess('Visualizando vista previa del PDF oficial...')}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#e5e2e1] text-[#1b1b1c] hover:bg-[#f0eded] text-[12px] font-semibold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">visibility</span>
              Ver
            </button>
          </div>

          {/* Quick Share Icons */}
          <div>
            <p className="text-[11px] font-semibold text-[#5b5e66] uppercase tracking-wider mb-2">
              Compartir rápido
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={() => handleQuickShare('WhatsApp')}
                className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#f6f3f2] active:scale-95 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E8F8EE] flex items-center justify-center text-[#25D366] shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    chat
                  </span>
                </div>
                <span className="text-[12px] font-medium text-[#1b1b1c]">WhatsApp</span>
              </button>

              {/* Gmail */}
              <button
                onClick={() => handleQuickShare('Gmail')}
                className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#f6f3f2] active:scale-95 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#ffdad5] flex items-center justify-center text-[#ec111a] shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    mail
                  </span>
                </div>
                <span className="text-[12px] font-medium text-[#1b1b1c]">Gmail</span>
              </button>

              {/* Telegram */}
              <button
                onClick={() => handleQuickShare('Telegram')}
                className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#f6f3f2] active:scale-95 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E6F4FB] flex items-center justify-center text-[#24A1DE] shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    send
                  </span>
                </div>
                <span className="text-[12px] font-medium text-[#1b1b1c]">Telegram</span>
              </button>

              {/* Archivos */}
              <button
                onClick={() => handleQuickShare('Archivos')}
                className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#f6f3f2] active:scale-95 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#dfe2ec] flex items-center justify-center text-[#181c22] shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">
                    drive_folder_upload
                  </span>
                </div>
                <span className="text-[12px] font-medium text-[#1b1b1c]">Archivos</span>
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-2 py-0.5">
            <div className="h-px flex-1 bg-[#e5e2e1]"></div>
            <span className="text-[10px] font-mono text-[#5b5e66] tracking-widest uppercase">
              o enviar por correo
            </span>
            <div className="h-px flex-1 bg-[#e5e2e1]"></div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSendEmail} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="destEmail" className="text-[12px] font-semibold text-[#1b1b1c]">
                Correo electrónico destinatario
              </label>
              <button
                type="button"
                onClick={handleUseMyEmail}
                className="text-[12px] text-[#ec111a] font-bold hover:underline"
              >
                Usar mi correo
              </button>
            </div>

            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#5b5e66] text-[20px] pointer-events-none">
                alternate_email
              </span>
              <input
                id="destEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full h-12 pl-11 pr-4 bg-[#f6f3f2] focus:bg-white text-[#1b1b1c] text-[14px] rounded-xl outline-none border border-transparent focus:border-[#ec111a]/40 shadow-sm transition-all"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={includeDetails}
                onChange={(e) => setIncludeDetails(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                includeDetails ? 'bg-[#ec111a] text-white' : 'bg-[#f0eded] text-transparent'
              }`}>
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-[12px] text-[#1b1b1c]">
                Incluir resumen detallado de operación en el mensaje
              </span>
            </label>

            <button
              type="submit"
              disabled={isSending}
              className={`w-full h-12 mt-1 rounded-xl text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all ${
                isSent ? 'bg-[#006b54]' : 'bg-[#ec111a] hover:bg-[#c0000f] active:scale-[0.99] shadow-sm'
              }`}
            >
              {isSending ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                  <span>Enviando constancia...</span>
                </>
              ) : isSent ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>¡Enviado con Éxito!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>Enviar Comprobante</span>
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="flex items-start gap-2 p-3 bg-[#f6f3f2] rounded-xl border border-[#f0eded]">
            <span className="material-symbols-outlined text-[18px] text-[#006b54] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
            <p className="text-[11px] text-[#5b5e66] leading-snug">
              Documento protegido con firma y hash Scotiabank. No almacena contraseñas ni datos sensibles de tus cuentas o tarjetas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
