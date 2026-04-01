"use client";

export function QitafLogo() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-[#4B0082]">qitaf</span>
        <span className="text-lg font-bold text-[#4B0082]">قطاف</span>
      </div>
      <span className="text-[10px] text-[#4B0082]/70">by stc</span>
    </div>
  );
}

export function AlRajhiLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-end text-[10px] leading-tight text-[#4B0082]">
        <span>مصرفالراجحي</span>
        <span>alrajhi bank</span>
      </div>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="12" r="8" stroke="#4338CA" strokeWidth="2.5" fill="none" />
        <circle cx="12" cy="24" r="8" stroke="#4338CA" strokeWidth="2.5" fill="none" />
        <circle cx="24" cy="24" r="8" stroke="#4338CA" strokeWidth="2.5" fill="none" />
      </svg>
    </div>
  );
}

export function MobilyLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="2" width="24" height="24" rx="4" fill="#1E3A8A" />
        <path d="M8 10h6v8H8z" fill="#2563EB" />
        <path d="M14 10h6v8h-6z" fill="#60A5FA" />
      </svg>
      <div className="flex flex-col items-start leading-tight">
        <span className="text-xs font-bold text-[#1E3A8A]">موبايلي</span>
        <span className="text-xs font-bold text-[#1E3A8A]">mobily</span>
      </div>
    </div>
  );
}

export function AkthrLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1a2744" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">A</text>
      </svg>
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-[#1a2744]">أكثـر</span>
        <span className="text-[10px] text-[#1a2744]/60">الإنماء</span>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 2l8 6-8 6z" fill="#2563EB" />
        <path d="M0 2l8 6-8 6z" fill="#60A5FA" />
      </svg>
    </div>
  );
}

export function AnbRewardsLogo() {
  return (
    <div className="flex items-center gap-1">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="12" r="7" stroke="#2563EB" strokeWidth="2" fill="none" />
        <circle cx="16" cy="12" r="7" stroke="#2563EB" strokeWidth="2" fill="none" />
      </svg>
      <span className="text-base font-bold text-[#1a2744]">
        <span className="text-[#2563EB]">a</span>nb
      </span>
      <span className="text-base text-[#1a2744]">rewards</span>
    </div>
  );
}

export const partnerLogos: Record<string, React.ComponentType> = {
  qitaf: QitafLogo,
  alrajhi: AlRajhiLogo,
  mobily: MobilyLogo,
  akthr: AkthrLogo,
  anb: AnbRewardsLogo,
};
