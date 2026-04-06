"use client";

import { useState } from "react";
import { Locale, t } from "@/lib/i18n";

interface Partner {
  id: string;
  name: string;
  nameAr: string;
}

interface ActivationModalProps {
  partner: Partner;
  locale: Locale;
  onClose: () => void;
  onConfirm: (earnPoints: boolean, redeemPoints: boolean) => void;
  submitting: boolean;
}

export function ActivationModal({
  partner,
  locale,
  onClose,
  onConfirm,
  submitting,
}: ActivationModalProps) {
  const [earnPoints, setEarnPoints] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(false);

  const name = locale === "ar" ? partner.nameAr : partner.name;
  const canSubmit = earnPoints || redeemPoints;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-lg font-bold text-primary">
              {name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {t(locale, "activateTitle")} {name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t(locale, "activateSubtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {/* Earn Points */}
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
              earnPoints
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <input
              type="checkbox"
              checked={earnPoints}
              onChange={(e) => setEarnPoints(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <div className="font-semibold text-foreground">
                {t(locale, "earnPoints")}
              </div>
              <div className="mt-0.5 text-sm text-muted-foreground">
                {t(locale, "earnPointsDesc")}
              </div>
            </div>
          </label>

          {/* Redeem Points */}
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
              redeemPoints
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <input
              type="checkbox"
              checked={redeemPoints}
              onChange={(e) => setRedeemPoints(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <div className="font-semibold text-foreground">
                {t(locale, "redeemPoints")}
              </div>
              <div className="mt-0.5 text-sm text-muted-foreground">
                {t(locale, "redeemPointsDesc")}
              </div>
            </div>
          </label>
        </div>


        {/* Confirm Button */}
        <button
          onClick={() => onConfirm(earnPoints, redeemPoints)}
          disabled={!canSubmit || submitting}
          className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "..." : t(locale, "confirmRequest")}
        </button>
      </div>
    </div>
  );
}
