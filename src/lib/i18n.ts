export type Locale = "en" | "ar";

export const translations = {
  en: {
    appName: "ResalConnect",
    switchLang: "العربية",
    breadcrumbHome: "Home",
    subtitle: "Connect your store with loyalty and rewards partners to increase sales and customer retention.",
    earlyAccessTitle: "Early Access",
    earlyAccessDesc: "Activate the partners below to register your interest. Integrations will be available soon for all registered merchants.",
    requestActivation: "Request activation",
    activate: "Activate",
    activatePartner: "Activate",
    interestRegistered: "Interest Registered",
    deactivated: "Deactivated",

    // Activation modal
    activateTitle: "Activate",
    activateSubtitle: "Choose how to use this integration when available.",
    earnPoints: "Earn Points",
    earnPointsDesc: "Reward your customers with loyalty points when they complete orders.",
    redeemPoints: "Redeem Points",
    redeemPointsDesc: "Allow customers to use their points as a payment method at checkout.",
    earlyNote: "Early access feature. Activating registers your interest and we'll notify you when it's live.",
    confirmRequest: "Confirm request",
    close: "Close",

    // Confirmation modal
    confirmTitle: "Interest Registered!",
    confirmDesc: "Thank you for your interest in activating {partner}. We have added your store to the waiting list and will update you as soon as the feature is available.",
    backToConnect: "Back to ResalConnect",

    // Sidebar
    home: "Home",
    loyalty: "Loyalty",
    digitalCards: "Digital Cards",
    cardOrders: "Card orders",
    campaigns: "Campaigns",
    transactions: "Transactions",
    members: "Members",
    resalPay: "ResalPay",
    resalConnect: "ResalConnect",

    // Admin
    adminLogin: "Admin Login",
    password: "Password",
    login: "Login",
    dashboard: "Dashboard",
    totalActivations: "Total Activations",
    earnInterest: "Earn Interest",
    redeemInterest: "Redeem Interest",
    topPartners: "Top Partners",
    merchant: "Merchant",
    partner: "Partner",
    type: "Type",
    date: "Date",
    status: "Status",
    pending: "Pending",
    contacted: "Contacted",
    all: "All",
    export: "Export CSV",
    logout: "Logout",
    noActivations: "No activations yet",
  },
  ar: {
    appName: "رسال كونكت",
    switchLang: "English",
    breadcrumbHome: "الرئيسية",
    subtitle: "اربط متجرك بشركاء الولاء والمكافآت لزيادة المبيعات والاحتفاظ بالعملاء.",
    earlyAccessTitle: "وصول مبكر",
    earlyAccessDesc: "فعّل الشركاء أدناه لتسجيل اهتمامك. ستتوفر عمليات التكامل قريباً لجميع التجار المسجلين.",
    requestActivation: "طلب التفعيل",
    activate: "تفعيل",
    activatePartner: "تفعيل",
    interestRegistered: "تم تسجيل الاهتمام",
    deactivated: "غير مفعل",

    activateTitle: "تفعيل",
    activateSubtitle: "اختر كيف تريد استخدام هذا التكامل عند توفره.",
    earnPoints: "كسب النقاط",
    earnPointsDesc: "كافئ عملاءك بنقاط الولاء عند إتمام الطلبات.",
    redeemPoints: "استبدال النقاط",
    redeemPointsDesc: "اسمح للعملاء باستخدام نقاطهم كوسيلة دفع عند الشراء.",
    earlyNote: "ميزة الوصول المبكر. التفعيل يسجل اهتمامك وسنبلغك عندما تكون متاحة.",
    confirmRequest: "تأكيد الطلب",
    close: "إغلاق",

    confirmTitle: "!تم تسجيل الاهتمام",
    confirmDesc: "شكراً لاهتمامك بتفعيل {partner}. لقد أضفنا متجرك إلى قائمة الانتظار وسنحدثك فور توفر الميزة.",
    backToConnect: "العودة إلى رسال كونكت",

    home: "الرئيسية",
    loyalty: "الولاء",
    digitalCards: "البطاقات الرقمية",
    cardOrders: "طلبات البطاقات",
    campaigns: "الحملات",
    transactions: "المعاملات",
    members: "الأعضاء",
    resalPay: "ريزال باي",
    resalConnect: "رسال كونكت",

    adminLogin: "تسجيل دخول المسؤول",
    password: "كلمة المرور",
    login: "دخول",
    dashboard: "لوحة التحكم",
    totalActivations: "إجمالي التفعيلات",
    earnInterest: "اهتمام بالكسب",
    redeemInterest: "اهتمام بالاستبدال",
    topPartners: "أفضل الشركاء",
    merchant: "التاجر",
    partner: "الشريك",
    type: "النوع",
    date: "التاريخ",
    status: "الحالة",
    pending: "قيد الانتظار",
    contacted: "تم التواصل",
    all: "الكل",
    export: "تصدير CSV",
    logout: "تسجيل خروج",
    noActivations: "لا توجد تفعيلات بعد",
  },
} as const;

export function t(locale: Locale, key: keyof (typeof translations)["en"]) {
  return translations[locale][key];
}

export function isRTL(locale: Locale) {
  return locale === "ar";
}
