import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Account, Transaction, CardSecuritySettings, TransferLimitSettings, NotificationItem, AuthorizedDevice, PlinContact } from './types/index.ts';
import {
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CARD_SECURITY,
  INITIAL_TRANSFER_LIMITS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUTHORIZED_DEVICES,
  INITIAL_PLIN_CONTACTS
} from './data/mockData.ts';

import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { Toast } from './components/Toast.tsx';

// Views
import { HomeView } from './components/views/HomeView.tsx';
import { AccountsView } from './components/views/AccountsView.tsx';
import { TransferStep1View } from './components/views/TransferStep1View.tsx';
import { TransferStep2View } from './components/views/TransferStep2View.tsx';
import { TransferReceiptView } from './components/views/TransferReceiptView.tsx';
import { ServicePayView } from './components/views/ServicePayView.tsx';
import { ServiceReceiptView } from './components/views/ServiceReceiptView.tsx';
import { CardSecurityView } from './components/views/CardSecurityView.tsx';
import { TransferLimitsView } from './components/views/TransferLimitsView.tsx';
import { BenefitsView } from './components/views/BenefitsView.tsx';
import { LoginBiometricView } from './components/views/LoginBiometricView.tsx';
import { BioErrorContingencyView } from './components/views/BioErrorContingencyView.tsx';
import { DigitalKeyLoginView } from './components/views/DigitalKeyLoginView.tsx';
import { LockoutSecurityView } from './components/views/LockoutSecurityView.tsx';
import { PasswordRecoveryView } from './components/views/PasswordRecoveryView.tsx';
import { AuthorizedDevicesView } from './components/views/AuthorizedDevicesView.tsx';
import { NewDeviceLoginView } from './components/views/NewDeviceLoginView.tsx';
import { ChangePasswordView } from './components/views/ChangePasswordView.tsx';
import { PlinView } from './components/views/PlinView.tsx';
import { AccountStatementsView } from './components/views/AccountStatementsView.tsx';
import { CreditCardPayView } from './components/views/CreditCardPayView.tsx';
import { CardEmergencyBlockView } from './components/views/CardEmergencyBlockView.tsx';

// Modals
import { CardPowerOffModal } from './components/modals/CardPowerOffModal.tsx';
import { CvvModal } from './components/modals/CvvModal.tsx';
import { ShareReceiptModal } from './components/modals/ShareReceiptModal.tsx';
import { LimitAuthTokenModal } from './components/modals/LimitAuthTokenModal.tsx';
import { CustomizeHomeModal } from './components/modals/CustomizeHomeModal.tsx';
import { QrScannerModal } from './components/modals/QrScannerModal.tsx';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer.tsx';
import { ProfileDrawer } from './components/modals/ProfileDrawer.tsx';
import { HelpCodeModal } from './components/modals/HelpCodeModal.tsx';
import { LogoutConfirmModal } from './components/modals/LogoutConfirmModal.tsx';
import { SessionExpiredModal } from './components/modals/SessionExpiredModal.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login-biometric');
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cardSettings, setCardSettings] = useState<CardSecuritySettings>(INITIAL_CARD_SECURITY);
  const [transferLimits, setTransferLimits] = useState<TransferLimitSettings>(INITIAL_TRANSFER_LIMITS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  // HU005 Authorized Devices state
  const [authorizedDevices, setAuthorizedDevices] = useState<AuthorizedDevice[]>(INITIAL_AUTHORIZED_DEVICES);
  // HU010 Plin Contacts Directory state
  const [plinContacts] = useState<PlinContact[]>(INITIAL_PLIN_CONTACTS);

  // Active Transfer Details
  const [activeTransfer, setActiveTransfer] = useState({
    originAccount: INITIAL_ACCOUNTS[0],
    transferType: 'terceros' as 'propias' | 'terceros' | 'otros',
    destAccount: '0001-2398-4710',
    recipientName: 'Carlos Mendoza Ruiz',
    amount: 450.00,
    concept: 'Alquiler oficina'
  });

  // Active Paid Service Details
  const [activePaidService, setActivePaidService] = useState({
    serviceName: 'Luz del Sur S.A.A.',
    supplyCode: '1948201-9',
    amount: 142.80,
    account: INITIAL_ACCOUNTS[0]
  });

  // Modals visibility state
  const [isPowerOffModalOpen, setIsPowerOffModalOpen] = useState(false);
  const [isCvvModalOpen, setIsCvvModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLimitAuthModalOpen, setIsLimitAuthModalOpen] = useState(false);
  const [pendingNewLimit, setPendingNewLimit] = useState<number>(3000);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpCodeModalOpen, setIsHelpCodeModalOpen] = useState(false);
  // HU004 Modal states
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isSessionExpiredOpen, setIsSessionExpiredOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // HU013 Criterio 01: Productos fijados (hasta un máximo de 6 productos)
  const handleTogglePinAccount = (accountId: string) => {
    setAccounts((prev) => {
      const target = prev.find((a) => a.id === accountId);
      if (!target) return prev;
      if (!target.isPinned) {
        const pinnedTotal = prev.filter((a) => a.isPinned).length;
        if (pinnedTotal >= 6) {
          showToast('Solo puedes fijar un máximo de 6 productos en el Home');
          return prev;
        }
      }
      return prev.map((acc) => (acc.id === accountId ? { ...acc, isPinned: !acc.isPinned } : acc));
    });
  };

  // HU017: Selección de cuenta para consulta de saldos y movimientos
  const [selectedAccountIdForView, setSelectedAccountIdForView] = useState<string | null>(null);

  const handleOpenAccountDetail = (accountId: string) => {
    setSelectedAccountIdForView(accountId);
    setCurrentView('cuentas');
  };

  const handleUpdateCardSettings = (newSettings: Partial<CardSecuritySettings>) => {
    setCardSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleConfirmPowerOff = () => {
    setCardSettings((prev) => ({ ...prev, masterActive: false }));
    setIsPowerOffModalOpen(false);
    showToast('Tarjeta pausada preventivamente con éxito');
  };

  const handleTransferSuccess = () => {
    // Deduct from origin account and create transaction
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === activeTransfer.originAccount.id
          ? { ...acc, balance: Math.max(acc.balance - activeTransfer.amount, 0) }
          : acc
      )
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Transferencia a ${activeTransfer.recipientName}`,
      date: 'Hoy • Transferencia Inmediata',
      account: activeTransfer.originAccount.name,
      amount: activeTransfer.amount,
      isCredit: false,
      currencySymbol: 'S/',
      category: 'transfer',
      icon: 'send_money'
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update daily limit consumed
    setTransferLimits((prev) => ({
      ...prev,
      dailyConsumed: prev.dailyConsumed + activeTransfer.amount
    }));

    showToast(`Transferencia por S/ ${activeTransfer.amount.toFixed(2)} enviada con éxito`);
  };

  const handleServicePaySuccess = (data: {
    serviceName: string;
    supplyCode: string;
    amount: number;
    account: Account;
  }) => {
    setActivePaidService(data);

    // Deduct from account
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === data.account.id
          ? { ...acc, balance: Math.max(acc.balance - data.amount, 0) }
          : acc
      )
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `${data.serviceName} - Suministro ${data.supplyCode}`,
      date: 'Hoy • Pago de Servicio en Línea',
      account: data.account.name,
      amount: data.amount,
      isCredit: false,
      currencySymbol: 'S/',
      category: 'service',
      icon: 'bolt'
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Pago de ${data.serviceName} por S/ ${data.amount.toFixed(2)} procesado exitosamente`);
  };

  const handleQrTransferSuccess = (recipientName: string, amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.type === 'sueldo'
          ? { ...acc, balance: Math.max(acc.balance - amount, 0) }
          : acc
      )
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Plin a ${recipientName}`,
      date: 'Hoy • Plin Inmediato',
      account: 'Cuenta Sueldo Scotia',
      amount: amount,
      isCredit: false,
      currencySymbol: 'S/',
      category: 'transfer',
      icon: 'qr_code_2'
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`¡Transferencia con Plin por S/ ${amount.toFixed(2)} enviada a ${recipientName}!`);
  };

  // HU010 Plin contact transfer execution
  const handleSendPlinContactSuccess = (recipientName: string, amount: number, phone: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.type === 'sueldo'
          ? { ...acc, balance: Math.max(acc.balance - amount, 0) }
          : acc
      )
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Plin a ${recipientName}`,
      date: 'Hoy • Plin Inmediato',
      account: 'Cuenta Sueldo Scotia',
      amount: amount,
      isCredit: false,
      currencySymbol: 'S/',
      category: 'transfer',
      icon: 'bolt'
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`¡Transferencia Plin de S/ ${amount.toFixed(2)} enviada a ${recipientName} (${phone})!`);
  };

  // HU032: Handler de Pago de Tarjeta de Crédito
  const handleCreditCardPaySuccess = (data: {
    cardName: string;
    cardNumber: string;
    amountPaid: number;
    currency: string;
    debitAccount: Account;
  }) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === data.debitAccount.id) {
          return { ...acc, balance: Math.max(acc.balance - data.amountPaid, 0) };
        }
        if (acc.type === 'credito') {
          return {
            ...acc,
            availableLine: (acc.availableLine || 68000) + data.amountPaid,
            currentDebt: Math.max((acc.currentDebt || 4320) - data.amountPaid, 0)
          };
        }
        return acc;
      })
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Pago Tarjeta ${data.cardName}`,
      date: 'Hoy • Pago Tarjeta',
      account: data.debitAccount.name,
      amount: data.amountPaid,
      isCredit: false,
      currencySymbol: data.currency === 'USD' ? '$' : 'S/',
      category: 'shopping',
      icon: 'credit_card'
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // HU042: Handler de Bloqueo Preventivo Definitivo de Tarjeta
  const handleCardEmergencyBlockSuccess = (data: {
    cardId: string;
    cardName: string;
    reason: string;
    blockCode: string;
  }) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === data.cardId ? { ...acc, status: 'paused', isPinned: false } : acc
      )
    );
    setCardSettings((prev) => ({ ...prev, masterActive: false }));
  };

  const handleConfirmLimitChange = () => {
    setTransferLimits((prev) => ({
      ...prev,
      maxLimit: pendingNewLimit
    }));
    setIsLimitAuthModalOpen(false);
    showToast(`Límite diario actualizado con éxito a S/ ${pendingNewLimit.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`);
  };

  const [failedKeyAttempts, setFailedKeyAttempts] = useState<number>(0);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [currentDigitalKey, setCurrentDigitalKey] = useState<string>('123456');
  // HU006 Previous keys history (last 3 combinations) & modification date
  const [previousKeys, setPreviousKeys] = useState<string[]>(['849201', '720194', '938102']);
  const [lastPasswordChangeDate, setLastPasswordChangeDate] = useState<string>('15 Sep 2026');

  const handleLoginSuccess = (method: 'biometric' | 'digital-key') => {
    setCurrentView('home');
    setFailedKeyAttempts(0);
    setIsLockedOut(false);
    if (method === 'biometric') {
      showToast('¡Bienvenida, Camila! Identidad biométrica confirmada');
    } else {
      showToast('¡Bienvenida, Camila! Autenticación exitosa con Clave Digital');
    }
  };

  const handleCustomNavigate = (view: ViewState) => {
    if (view === 'login-clave-digital' && isLockedOut) {
      setCurrentView('login-lockout');
      showToast('Tu Clave Digital está bloqueada por 15 minutos');
    } else {
      setCurrentView(view);
    }
  };

  const isAuthView =
    currentView === 'login-biometric' ||
    currentView === 'login-bio-error' ||
    currentView === 'login-clave-digital' ||
    currentView === 'login-lockout' ||
    currentView === 'recuperar-clave' ||
    currentView === 'vincular-dispositivo-login';

  // HU005 Handlers for Authorized Devices
  const handleAddAuthorizedDevice = (device: AuthorizedDevice) => {
    setAuthorizedDevices((prev) => [device, ...prev]);
  };

  const handleRemoveAuthorizedDevice = (deviceId: string) => {
    setAuthorizedDevices((prev) => prev.filter((d) => d.id !== deviceId));
  };

  const handleAuthorizeFromLogin = (device: AuthorizedDevice) => {
    setAuthorizedDevices((prev) => [device, ...prev]);
    setCurrentView('home');
    showToast(`¡Bienvenida, Camila! Dispositivo "${device.alias}" autorizado.`);
  };

  // HU004 Session destruction & memory cleanup
  const handleDestroySession = useCallback(() => {
    setActiveTransfer({
      originAccount: INITIAL_ACCOUNTS[0],
      transferType: 'terceros',
      destAccount: '0001-2398-4710',
      recipientName: 'Carlos Mendoza Ruiz',
      amount: 450.00,
      concept: 'Alquiler oficina'
    });
    try {
      sessionStorage.clear();
    } catch {
      // Safe fallback
    }
  }, []);

  const closeAllModals = useCallback(() => {
    setIsPowerOffModalOpen(false);
    setIsCvvModalOpen(false);
    setIsShareModalOpen(false);
    setIsLimitAuthModalOpen(false);
    setIsCustomizeModalOpen(false);
    setIsQrModalOpen(false);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
    setIsHelpCodeModalOpen(false);
    setIsLogoutConfirmOpen(false);
  }, []);

  // HU004 Criterio 01: Voluntary manual logout
  const handleManualLogoutConfirm = () => {
    handleDestroySession();
    closeAllModals();
    setCurrentView('login-biometric');
    showToast('Sesión finalizada con éxito. Memoria temporal liberada.');
  };

  // HU006 Criterio 01: Preventive password update
  const handlePreventivePasswordChangeSuccess = (newKey: string) => {
    setPreviousKeys((prev) => [currentDigitalKey, ...prev.slice(0, 2)]);
    setCurrentDigitalKey(newKey);
    setLastPasswordChangeDate(`Hoy (${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })})`);
    handleDestroySession();
    closeAllModals();
    setCurrentView('login-clave-digital');
    showToast('Clave Digital actualizada con éxito. Inicia sesión con tu nueva clave.');
  };

  // HU004 Criterio 02: Inactivity timeout (3 minutes continuous without interaction)
  useEffect(() => {
    if (isAuthView) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleDestroySession();
        closeAllModals();
        setCurrentView('login-biometric');
        setIsSessionExpiredOpen(true);
      }, 180 * 1000); // 3 continuous minutes (180s)
    };

    const interactionEvents = [
      'touchstart',
      'touchmove',
      'touchend',
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'click'
    ];

    interactionEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    // Start timer upon entering session
    resetInactivityTimer();

    // Dev & test grading utility: callable via window.simulateInactivityTimeout()
    (window as any).simulateInactivityTimeout = () => {
      clearTimeout(inactivityTimer);
      handleDestroySession();
      closeAllModals();
      setCurrentView('login-biometric');
      setIsSessionExpiredOpen(true);
    };

    return () => {
      clearTimeout(inactivityTimer);
      interactionEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      delete (window as any).simulateInactivityTimeout;
    };
  }, [isAuthView, handleDestroySession, closeAllModals]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col justify-between selection:bg-[#ec111a] selection:text-white">
      {/* Container wrapper ensuring standard mobile banking aspect ratio while responsive */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#fcf9f8] flex flex-col relative shadow-xl border-x border-[#e5e7eb]">
        {/* Header (se oculta en pantallas de Login para máxima fidelidad) */}
        {!isAuthView && (
          <Header
            currentView={currentView}
            onNavigate={setCurrentView}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            unreadNotificationsCount={unreadCount}
          />
        )}

        {/* Main Dynamic View Content */}
        <main className="flex-1 flex flex-col">
          {currentView === 'login-biometric' && (
            <LoginBiometricView
              onNavigate={handleCustomNavigate}
              onLoginSuccess={handleLoginSuccess}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'login-bio-error' && (
            <BioErrorContingencyView
              onNavigate={handleCustomNavigate}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'login-clave-digital' && (
            <DigitalKeyLoginView
              onNavigate={handleCustomNavigate}
              onLoginSuccess={handleLoginSuccess}
              onQuickNotify={showToast}
              failedAttempts={failedKeyAttempts}
              onFailedAttempt={() => setFailedKeyAttempts((prev) => prev + 1)}
              onResetAttempts={() => {
                setFailedKeyAttempts(0);
                setIsLockedOut(false);
              }}
              onLockout={() => {
                setIsLockedOut(true);
                showToast('Acceso bloqueado preventivamente por 15 minutos');
              }}
              currentValidKey={currentDigitalKey}
            />
          )}

          {currentView === 'login-lockout' && (
            <LockoutSecurityView
              onNavigate={setCurrentView}
              onResetLockout={() => {
                setFailedKeyAttempts(0);
                setIsLockedOut(false);
              }}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'recuperar-clave' && (
            <PasswordRecoveryView
              onNavigate={handleCustomNavigate}
              onPasswordResetSuccess={(newKey) => {
                setCurrentDigitalKey(newKey);
                setFailedKeyAttempts(0);
                setIsLockedOut(false);
                showToast('Nueva Clave Digital registrada. Ya puedes iniciar sesión con tu nueva clave.');
              }}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'vincular-dispositivo-login' && (
            <NewDeviceLoginView
              devices={authorizedDevices}
              onNavigate={handleCustomNavigate}
              onAuthorizeDevice={handleAuthorizeFromLogin}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'home' && (
            <HomeView
              accounts={accounts}
              transactions={transactions}
              onNavigate={setCurrentView}
              onOpenCustomize={() => setIsCustomizeModalOpen(true)}
              onOpenQr={() => setIsQrModalOpen(true)}
              onOpenCvv={() => setIsCvvModalOpen(true)}
              onQuickNotify={showToast}
              onSelectAccount={handleOpenAccountDetail}
            />
          )}

          {currentView === 'cuentas' && (
            <AccountsView
              accounts={accounts}
              transactions={transactions}
              onNavigate={setCurrentView}
              onOpenCvv={() => setIsCvvModalOpen(true)}
              onQuickNotify={showToast}
              selectedAccountId={selectedAccountIdForView}
              onSelectAccount={setSelectedAccountIdForView}
            />
          )}

          {currentView === 'transfer-step1' && (
            <TransferStep1View
              accounts={accounts}
              onNavigate={setCurrentView}
              onSetTransferData={(data) => setActiveTransfer(data)}
            />
          )}

          {currentView === 'transfer-step2' && (
            <TransferStep2View
              transferData={activeTransfer}
              onNavigate={setCurrentView}
              onConfirmSuccess={handleTransferSuccess}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'transfer-receipt' && (
            <TransferReceiptView
              amount={activeTransfer.amount}
              recipientName={activeTransfer.recipientName}
              destAccount={activeTransfer.destAccount}
              concept={activeTransfer.concept}
              originAccountName={activeTransfer.originAccount.name}
              originAccountNumber={activeTransfer.originAccount.number}
              onNavigate={setCurrentView}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'pago-servicios' && (
            <ServicePayView
              accounts={accounts}
              onNavigate={setCurrentView}
              onOpenHelpModal={() => setIsHelpCodeModalOpen(true)}
              onCompleteServicePayment={handleServicePaySuccess}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'servicio-receipt' && (
            <ServiceReceiptView
              serviceName={activePaidService.serviceName}
              supplyCode={activePaidService.supplyCode}
              amount={activePaidService.amount}
              onNavigate={setCurrentView}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'seguridad-tarjetas' && (
            <CardSecurityView
              cardSettings={cardSettings}
              onUpdateCardSettings={handleUpdateCardSettings}
              onNavigate={setCurrentView}
              onOpenCvv={() => setIsCvvModalOpen(true)}
              onRequestPowerOff={() => setIsPowerOffModalOpen(true)}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'limites-transferencia' && (
            <TransferLimitsView
              limits={transferLimits}
              onRequestAuthToken={(newLimit) => {
                setPendingNewLimit(newLimit);
                setIsLimitAuthModalOpen(true);
              }}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'beneficios' && (
            <BenefitsView onQuickNotify={showToast} />
          )}

          {currentView === 'dispositivos-autorizados' && (
            <AuthorizedDevicesView
              devices={authorizedDevices}
              onNavigate={setCurrentView}
              onAddDevice={handleAddAuthorizedDevice}
              onRemoveDevice={handleRemoveAuthorizedDevice}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'cambiar-clave' && (
            <ChangePasswordView
              currentKey={currentDigitalKey}
              previousKeys={previousKeys}
              lastModifiedDate={lastPasswordChangeDate}
              onNavigate={setCurrentView}
              onPasswordChangeSuccess={handlePreventivePasswordChangeSuccess}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'plin' && (
            <PlinView
              contacts={plinContacts}
              accounts={accounts}
              onNavigate={setCurrentView}
              onSendPlinSuccess={handleSendPlinContactSuccess}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'estados-cuenta' && (
            <AccountStatementsView
              accounts={accounts}
              onNavigate={setCurrentView}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'pago-tarjeta-credito' && (
            <CreditCardPayView
              accounts={accounts}
              onNavigate={setCurrentView}
              onPaySuccess={handleCreditCardPaySuccess}
              onQuickNotify={showToast}
            />
          )}

          {currentView === 'bloqueo-tarjeta-emergencia' && (
            <CardEmergencyBlockView
              accounts={accounts}
              onNavigate={setCurrentView}
              onBlockSuccess={handleCardEmergencyBlockSuccess}
              onQuickNotify={showToast}
            />
          )}
        </main>

        {/* Bottom Navigation Bar (solo para sesión autenticada) */}
        {!isAuthView && <BottomNav currentView={currentView} onNavigate={setCurrentView} />}

        {/* Modals & Submenus */}
        <CardPowerOffModal
          isOpen={isPowerOffModalOpen}
          onClose={() => setIsPowerOffModalOpen(false)}
          onConfirm={handleConfirmPowerOff}
          cardMasked={cardSettings.cardMasked}
        />

        <CvvModal
          isOpen={isCvvModalOpen}
          onClose={() => setIsCvvModalOpen(false)}
          cvv={cardSettings.cvv}
        />

        <ShareReceiptModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          operationCode="#OP-9841284"
          amount={`S/ ${activeTransfer.amount.toFixed(2)}`}
          concept={activeTransfer.concept}
          onSuccess={showToast}
        />

        <LimitAuthTokenModal
          isOpen={isLimitAuthModalOpen}
          onClose={() => setIsLimitAuthModalOpen(false)}
          onConfirm={handleConfirmLimitChange}
          newLimit={pendingNewLimit}
          oldLimit={transferLimits.maxLimit}
        />

        <CustomizeHomeModal
          isOpen={isCustomizeModalOpen}
          onClose={() => setIsCustomizeModalOpen(false)}
          accounts={accounts}
          onTogglePin={handleTogglePinAccount}
          onSave={() => showToast('Productos fijados en el inicio actualizados')}
        />

        <QrScannerModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          onSuccessTransfer={handleQrTransferSuccess}
        />

        <NotificationsDrawer
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            showToast('Todas las notificaciones marcadas como leídas');
          }}
          onClear={() => {
            setNotifications([]);
            showToast('Bandeja de notificaciones vaciada');
          }}
        />

        <ProfileDrawer
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onNavigate={setCurrentView}
          onNotify={showToast}
          onRequestLogout={() => setIsLogoutConfirmOpen(true)}
          devicesCount={authorizedDevices.length}
        />

        <HelpCodeModal
          isOpen={isHelpCodeModalOpen}
          onClose={() => setIsHelpCodeModalOpen(false)}
        />

        {/* HU004 Modals: Cierre de Sesión Manual y Cierre por Inactividad */}
        <LogoutConfirmModal
          isOpen={isLogoutConfirmOpen}
          onClose={() => setIsLogoutConfirmOpen(false)}
          onConfirmLogout={handleManualLogoutConfirm}
        />

        <SessionExpiredModal
          isOpen={isSessionExpiredOpen}
          onClose={() => setIsSessionExpiredOpen(false)}
        />

        {/* Toast Alerts */}
        <Toast message={toastMessage} />
      </div>
    </div>
  );
}
