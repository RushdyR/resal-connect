"use client";

import { Locale, t } from "@/lib/i18n";

const menuItems = [
  { key: "home" as const, icon: "home" },
  { key: "loyalty" as const, icon: "loyalty" },
  { key: "digitalCards" as const, icon: "credit_card" },
  { key: "cardOrders" as const, icon: "receipt_long" },
  { key: "campaigns" as const, icon: "campaign" },
  { key: "transactions" as const, icon: "swap_horiz" },
  { key: "members" as const, icon: "group" },
];

export function Sidebar({ locale }: { locale: Locale }) {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col bg-gradient-to-b from-[#1a1a6e] to-[#2d2db8] text-white min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 pt-8 pb-6">
        <span className="text-2xl font-bold tracking-wide">resal</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              <div className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                {t(locale, item.key)}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom items */}
      <div className="px-3 pb-6 space-y-1">
        <div className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">
            account_balance_wallet
          </span>
          {t(locale, "resalPay")}
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold text-white cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">
            hub
          </span>
          {t(locale, "resalConnect")}
          <span className="ms-auto rounded-full bg-green-400 px-2 py-0.5 text-[10px] font-bold text-green-900">
            New
          </span>
        </div>
      </div>
    </aside>
  );
}
