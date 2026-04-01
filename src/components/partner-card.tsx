"use client";

import { Locale, t } from "@/lib/i18n";
import { partnerLogos } from "@/components/partner-logos";

interface Partner {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  description: string | null;
  descriptionAr: string | null;
  logoUrl: string | null;
}

interface PartnerCardProps {
  partner: Partner;
  locale: Locale;
  activated: boolean;
  onActivate: (partner: Partner) => void;
}

export function PartnerCard({
  partner,
  locale,
  activated,
  onActivate,
}: PartnerCardProps) {
  const name = locale === "ar" ? partner.nameAr : partner.name;
  const description = locale === "ar" ? partner.descriptionAr : partner.description;
  const LogoComponent = partnerLogos[partner.id];

  return (
    <div className="relative flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md">
      {/* Partner Logo */}
      <div className="mb-4 flex h-16 items-center justify-center">
        {LogoComponent ? (
          <LogoComponent />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-xl font-bold text-primary">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Partner Name */}
      <h3 className="text-base font-bold text-foreground">{name}</h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground min-h-[48px]">
        {description}
      </p>

      {/* CTA Button */}
      {activated ? (
        <button
          disabled
          className="mt-4 w-full rounded-xl bg-primary/10 py-3 text-sm font-semibold text-primary/60 cursor-not-allowed"
        >
          {t(locale, "interestRegistered")}
        </button>
      ) : (
        <button
          onClick={() => onActivate(partner)}
          className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          {t(locale, "requestActivation")}
        </button>
      )}
    </div>
  );
}
