import { Account, Transaction, FrequentService, CardSecuritySettings, TransferLimitSettings, NotificationItem, AuthorizedDevice, PlinContact } from '../types/index.ts';

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-sueldo',
    name: 'Cuenta Sueldo Scotia',
    type: 'sueldo',
    number: '4821',
    currency: 'PEN',
    currencySymbol: 'S/',
    balance: 32450.00,
    isPinned: true,
    status: 'active'
  },
  {
    id: 'acc-visa',
    name: 'Scotia Visa Signature',
    type: 'credito',
    number: '9102',
    currency: 'PEN',
    currencySymbol: 'S/',
    balance: 68000.00,
    availableLine: 68000.00,
    currentDebt: 4320.00,
    isPinned: true,
    status: 'active'
  },
  {
    id: 'acc-dolares',
    name: 'Cuenta Ahorro Dólares Scotia',
    type: 'ahorros',
    number: '9920',
    currency: 'USD',
    currencySymbol: '$',
    balance: 4820.00,
    isPinned: true,
    status: 'active'
  },
  {
    id: 'acc-ahorro-soles',
    name: 'Cuenta Scotia Ahorro Crece',
    type: 'ahorros',
    number: '7412',
    currency: 'PEN',
    currencySymbol: 'S/',
    balance: 8900.50,
    isPinned: false,
    status: 'active'
  },
  {
    id: 'acc-plazo',
    name: 'Depósito a Plazo Fijo Digital',
    type: 'plazo',
    number: '3104',
    currency: 'PEN',
    currencySymbol: 'S/',
    balance: 15000.00,
    isPinned: false,
    status: 'active'
  },
  {
    id: 'acc-plazo-usd',
    name: 'Depósito Plazo Fijo USD',
    type: 'plazo',
    number: '6820',
    currency: 'USD',
    currencySymbol: '$',
    balance: 10000.00,
    isPinned: false,
    status: 'active'
  },
  {
    id: 'acc-nueva-cero',
    name: 'Cuenta Scotia Ahorro Digital (Nueva)',
    type: 'ahorros',
    number: '5519',
    currency: 'PEN',
    currencySymbol: 'S/',
    balance: 0.00,
    isPinned: false,
    status: 'active'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Amazon México',
    date: 'Hoy • Tarjeta Débito',
    account: 'Cuenta Sueldo Scotia',
    amount: 1249.00,
    isCredit: false,
    currencySymbol: 'S/',
    category: 'shopping',
    icon: 'shopping_bag'
  },
  {
    id: 'tx-2',
    title: 'Depósito de Nómina',
    date: 'Ayer • Transferencia Inmediata',
    account: 'Cuenta Sueldo Scotia',
    amount: 24500.00,
    isCredit: true,
    currencySymbol: 'S/',
    category: 'salary',
    icon: 'arrow_downward'
  },
  {
    id: 'tx-3',
    title: 'Supermercados Wong',
    date: '12 Oct • Tarjeta Débito',
    account: 'Cuenta Sueldo Scotia',
    amount: 380.20,
    isCredit: false,
    currencySymbol: 'S/',
    category: 'food',
    icon: 'storefront'
  },
  {
    id: 'tx-4',
    title: 'Starbucks Miraflores',
    date: '10 Oct • Tarjeta Débito',
    account: 'Cuenta Sueldo Scotia',
    amount: 28.50,
    isCredit: false,
    currencySymbol: 'S/',
    category: 'food',
    icon: 'local_cafe'
  },
  {
    id: 'tx-5',
    title: 'Luz del Sur S.A.A.',
    date: '08 Oct • Pago de Servicio',
    account: 'Cuenta Sueldo Scotia',
    amount: 142.80,
    isCredit: false,
    currencySymbol: 'S/',
    category: 'service',
    icon: 'bolt'
  },
  {
    id: 'tx-usd-1',
    title: 'Transferencia Interbancaria Recibida',
    date: '11 Oct • Transferencia CCE',
    account: 'Cuenta Ahorro Dólares Scotia',
    amount: 1200.00,
    isCredit: true,
    currencySymbol: '$',
    category: 'transfer',
    icon: 'arrow_downward'
  },
  {
    id: 'tx-usd-2',
    title: 'Suscripción Adobe Creative Cloud',
    date: '05 Oct • Pago Internacional',
    account: 'Cuenta Ahorro Dólares Scotia',
    amount: 54.99,
    isCredit: false,
    currencySymbol: '$',
    category: 'service',
    icon: 'credit_card'
  },
  {
    id: 'tx-visa-1',
    title: 'Restaurante Central',
    date: '09 Oct • Tarjeta Scotia Visa',
    account: 'Scotia Visa Signature',
    amount: 890.00,
    isCredit: false,
    currencySymbol: 'S/',
    category: 'food',
    icon: 'restaurant'
  },
  {
    id: 'tx-ahorro-1',
    title: 'Abono de Ahorro Automático',
    date: '01 Oct • Traspaso Programado',
    account: 'Cuenta Scotia Ahorro Crece',
    amount: 500.00,
    isCredit: true,
    currencySymbol: 'S/',
    category: 'salary',
    icon: 'savings'
  }
];

export const FREQUENT_SERVICES: FrequentService[] = [
  {
    id: 'serv-luz',
    name: 'Luz del Sur - Casa',
    company: 'Luz del Sur S.A.A.',
    code: '2049182',
    category: 'Luz y Agua',
    icon: 'bolt',
    accentColor: 'text-[#ec111a] bg-[#ec111a]/10'
  },
  {
    id: 'serv-sedapal',
    name: 'Sedapal - Dpto',
    company: 'Sedapal Agua',
    code: '7483921',
    category: 'Luz y Agua',
    icon: 'water_drop',
    accentColor: 'text-[#006b54] bg-[#95f5d4]/40'
  },
  {
    id: 'serv-movistar',
    name: 'Movistar Hogar',
    company: 'Telefónica del Perú',
    code: '014728990',
    category: 'Telefonía e Internet',
    icon: 'wifi',
    accentColor: 'text-[#2D3138] bg-[#dfe2ec]'
  }
];

export const INITIAL_CARD_SECURITY: CardSecuritySettings = {
  masterActive: true,
  onlinePurchases: true,
  foreignUsage: false,
  posAtm: true,
  cvv: '742',
  cvvExpiresSeconds: 180,
  cardMasked: '5678',
  holderName: 'CAMILA MORALES SILVA',
  expiryDate: '09/28'
};

export const INITIAL_TRANSFER_LIMITS: TransferLimitSettings = {
  dailyConsumed: 500.00,
  maxLimit: 3000.00,
  normalDefault: 5000.00,
  requireTokenAbove1000: true
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Abono de nómina acreditado',
    message: 'Se acreditó el depósito de haberes por S/ 24,500.00 en tu Cuenta Sueldo.',
    time: 'Hace 2 horas',
    isRead: false,
    type: 'transaction'
  },
  {
    id: 'notif-2',
    title: 'Clave Digital Activa',
    message: 'Tu Token Digital Silencioso se sincronizó correctamente con tu teléfono.',
    time: 'Ayer',
    isRead: false,
    type: 'security'
  },
  {
    id: 'notif-3',
    title: 'Nuevo beneficio Scotia Plus',
    message: 'Disfruta de 25% de descuento en restaurantes afiliados los fines de semana.',
    time: '12 Oct',
    isRead: true,
    type: 'benefit'
  }
];

export const SCOTIABANK_LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1WBWIitneSFdny5BCAMFkJiupuXmTVouFCxOcLtQwARIcRDF2IHI924-UkQUBHXLQp-CewlblyOoNP55cEujD6h2wXv6mPqp4mJCMa67fGCpFJi8rGgDxoXAEyyqYgX6Vwxs0pLGSIR0fPt8UAX3jMzdm12NUsZBejl2-TegihWagAj8JRVW7JZXdLjCbOueapClINcnkw5C-qYIfY2LeKZ5DoF3RCxIyT0EONHQDLUfdGIj4MFhp-WznM';

export const USER_AVATAR_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1ViG2hhNY_AVfpzdQfIw0t-9GfR5y3_1Q4HYI9ssmZBn7P29mJskiKhIoCe9Zt1Zd7fXvKYHrQ7yMI5Hx-ofEquT2wlTyEg-e2exHyqEB0c7gHHYWwpxnjymhUM0U37D9hB4JEZg_xadwDeK4lcSqPm8l0eu0cm0iuaTYnbhHnOgaMXx5GqebtUF6C6706Z-PYkcSbX907r4rXqVOMdiLyw639aeDbIF885bDOy0UN3bkmq1Tk0WTp0iA';

export const RECIPIENT_AVATAR_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwqMu4bZxtYMGA5ThiyXL6Dn3HwiEnyZCxk95089Uu-zs_4KTVx0gdaI_TgJxBFZ2WFjNJXafv0OKpeLnyuov1nx7sc8nC4VCj2Qolp-7oHRUza4wqcyzWjfNH55Qmhrl8hB9lPxO6U_tRaAo-nu_0a4llXCElSDqDbm3f7xZZl1oMI33mTBn4kVg_5kiYecEiVSImFRe6LDLOa0oVnrdE5zVmzJ9VVCM6h7C2t9U3cLlMnNDz2LX_';

export const INITIAL_AUTHORIZED_DEVICES: AuthorizedDevice[] = [
  {
    id: 'dev-1',
    alias: 'iPhone 14 Pro - Camila',
    model: 'Apple iPhone 14 Pro (A2890)',
    imei: '354829104829102',
    uuid: 'UUID-98A4-4B21-B780',
    linkedDate: '12 Oct 2026, 09:30',
    isCurrent: true,
    os: 'iOS'
  },
  {
    id: 'dev-2',
    alias: 'iPad Air de Trabajo',
    model: 'Apple iPad Air 5ta Gen',
    imei: '358910293847120',
    uuid: 'UUID-10C3-89F2-C451',
    linkedDate: '01 Sep 2026, 14:15',
    isCurrent: false,
    os: 'iOS'
  },
  {
    id: 'dev-3',
    alias: 'Samsung Galaxy A54 Personal',
    model: 'Samsung Galaxy A54 5G',
    imei: '359182736451928',
    uuid: 'UUID-77E1-22A8-D990',
    linkedDate: '18 Jul 2026, 18:40',
    isCurrent: false,
    os: 'Android'
  }
];

export const INITIAL_PLIN_CONTACTS: PlinContact[] = [
  {
    id: 'con-1',
    name: 'Carlos Mendoza Ruiz',
    phone: '984 210 948',
    isPlinUser: true,
    avatarColor: '#ec111a',
    bank: 'Scotiabank',
    lastTransferDate: 'Ayer • S/ 50.00'
  },
  {
    id: 'con-2',
    name: 'Andrea Castillo Vega',
    phone: '971 450 182',
    isPlinUser: true,
    avatarColor: '#004481',
    bank: 'BBVA',
    lastTransferDate: '12 Oct • S/ 35.00'
  },
  {
    id: 'con-3',
    name: 'Mateo Quispe Flores',
    phone: '962 104 892',
    isPlinUser: false,
    avatarColor: '#6b7280',
    bank: 'Sin afiliar'
  },
  {
    id: 'con-4',
    name: 'Lucía Benavides Gómez',
    phone: '983 910 241',
    isPlinUser: true,
    avatarColor: '#009944',
    bank: 'Interbank',
    lastTransferDate: '08 Oct • S/ 80.00'
  },
  {
    id: 'con-5',
    name: 'Jorge Valdivia Ramos',
    phone: '951 829 104',
    isPlinUser: false,
    avatarColor: '#6b7280',
    bank: 'Sin afiliar'
  },
  {
    id: 'con-6',
    name: 'Valeria Soto Morales',
    phone: '992 481 029',
    isPlinUser: true,
    avatarColor: '#ec111a',
    bank: 'Scotiabank',
    lastTransferDate: '05 Oct • S/ 120.00'
  },
  {
    id: 'con-7',
    name: 'Diego Alarcón Paz',
    phone: '976 102 938',
    isPlinUser: false,
    avatarColor: '#6b7280',
    bank: 'Sin afiliar'
  },
  {
    id: 'con-8',
    name: 'Sofía Huamán Castro',
    phone: '988 392 018',
    isPlinUser: true,
    avatarColor: '#ff7800',
    bank: 'BanBif',
    lastTransferDate: '28 Sep • S/ 45.00'
  }
];
