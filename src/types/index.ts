export interface Account {
  id: string;
  name: string;
  type: 'sueldo' | 'ahorros' | 'credito' | 'plazo';
  number: string;
  currency: 'PEN' | 'USD' | 'MXN';
  currencySymbol: string;
  balance: number;
  availableLine?: number;
  currentDebt?: number;
  isPinned: boolean;
  status: 'active' | 'paused';
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  account: string;
  amount: number;
  isCredit: boolean;
  currencySymbol: string;
  category: 'shopping' | 'salary' | 'transfer' | 'service' | 'food';
  icon: string;
}

export interface FrequentService {
  id: string;
  name: string;
  company: string;
  code: string;
  category: string;
  icon: string;
  accentColor: string;
}

export interface CardSecuritySettings {
  masterActive: boolean;
  onlinePurchases: boolean;
  foreignUsage: boolean;
  posAtm: boolean;
  cvv: string;
  cvvExpiresSeconds: number;
  cardMasked: string;
  holderName: string;
  expiryDate: string;
}

export interface TransferLimitSettings {
  dailyConsumed: number;
  maxLimit: number;
  normalDefault: number;
  requireTokenAbove1000: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'security' | 'transaction' | 'benefit';
}

export interface AuthorizedDevice {
  id: string;
  alias: string;
  model: string;
  imei: string;
  uuid: string;
  linkedDate: string;
  isCurrent: boolean;
  os: 'iOS' | 'Android';
}

export interface PlinContact {
  id: string;
  name: string;
  phone: string;
  isPlinUser: boolean;
  avatarColor: string;
  bank?: string;
  lastTransferDate?: string;
}

export type ViewState = 
  | 'home'
  | 'cuentas'
  | 'transfer-step1'
  | 'transfer-step2'
  | 'transfer-receipt'
  | 'pago-servicios'
  | 'servicio-receipt'
  | 'seguridad-tarjetas'
  | 'limites-transferencia'
  | 'beneficios'
  | 'dispositivos-autorizados'
  | 'login-biometric'
  | 'login-bio-error'
  | 'login-clave-digital'
  | 'login-lockout'
  | 'recuperar-clave'
  | 'vincular-dispositivo-login'
  | 'cambiar-clave'
  | 'plin'
  | 'estados-cuenta'
  | 'pago-tarjeta-credito'
  | 'bloqueo-tarjeta-emergencia';
