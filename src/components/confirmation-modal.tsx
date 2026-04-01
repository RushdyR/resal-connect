"use client";

import { Locale, t } from "@/lib/i18n";

interface ConfirmationModalProps {
  partnerName: string;
  locale: Locale;
  onClose: () => void;
}

export function ConfirmationModal({
  partnerName,
  locale,
  onClose,
}: ConfirmationModalProps) {
  const description = t(locale, "confirmDesc").replace("{partner}", partnerName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        {/* Success Icon */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-foreground">
          {t(locale, "confirmTitle")} 🎉
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          {t(locale, "backToConnect")}
        </button>
      </div>
    </div>
  );
}
