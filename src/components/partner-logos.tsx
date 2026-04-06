"use client";

interface LogoProps {
  name: string;
  src: string;
}

function BrandLogo({ name, src }: LogoProps) {
  return (
    <img
      src={src}
      alt={name}
      className="h-12 w-auto max-w-[140px] object-contain"
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = "none";
        const fallback = target.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = "flex";
      }}
    />
  );
}

export function QitafLogo() {
  return (
    <div className="relative flex items-center justify-center">
      <BrandLogo name="Qitaf" src="https://www.qitaf.com/assets/img/logo.png" />
      <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-[#6B21A8]/10 text-sm font-bold text-[#6B21A8]">Q</div>
    </div>
  );
}

export function AlRajhiLogo() {
  return (
    <div className="relative flex items-center justify-center">
      <BrandLogo name="Al Rajhi Bank" src="https://www.alrajhibank.com.sa/sites/alrajhi/themes/alrajhi/images/logo.svg" />
      <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-[#CC0000]/10 text-sm font-bold text-[#CC0000]">AR</div>
    </div>
  );
}

export function MobilyLogo() {
  return (
    <div className="relative flex items-center justify-center">
      <BrandLogo name="Mobily" src="https://www.mobily.com.sa/wps/wcm/connect/english/home/images/logo.png" />
      <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-[#16A34A]/10 text-sm font-bold text-[#16A34A]">M</div>
    </div>
  );
}

export function AkthrLogo() {
  return (
    <div className="relative flex items-center justify-center">
      <BrandLogo name="Akthr" src="https://akthr.com.sa/assets/images/logo.png" />
      <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-[#1D4ED8]/10 text-sm font-bold text-[#1D4ED8]">أكثر</div>
    </div>
  );
}

export function AnbRewardsLogo() {
  return (
    <div className="relative flex items-center justify-center">
      <BrandLogo name="ANB Rewards" src="https://rewards.anb.com.sa/assets/images/anb-logo.png" />
      <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A8A]/10 text-sm font-bold text-[#1E3A8A]">ANB</div>
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
