"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Locale, t, isRTL } from "@/lib/i18n";
import { PartnerCard } from "@/components/partner-card";
import { ActivationModal } from "@/components/activation-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";

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

interface MerchantInfo {
  merchantId: string;
  merchantName: string;
  merchantEmail: string;
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const locale: Locale = langParam === "ar" ? "ar" : "en";
  const [partners, setPartners] = useState<Partner[]>([]);
  const [activatedPartnerIds, setActivatedPartnerIds] = useState<Set<string>>(new Set());
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedPartnerName, setConfirmedPartnerName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Read merchant info from URL params
  // Usage: /?merchantId=123&merchantName=StoreName&merchantEmail=store@email.com
  const merchant: MerchantInfo = {
    merchantId: searchParams.get("merchantId") || "",
    merchantName: searchParams.get("merchantName") || "",
    merchantEmail: searchParams.get("merchantEmail") || "",
  };
  const hasMerchant = merchant.merchantId && merchant.merchantName && merchant.merchantEmail;

  useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => setPartners(data));

    // Load activated partners scoped to this merchant
    if (merchant.merchantId) {
      const stored = localStorage.getItem(`activatedPartners_${merchant.merchantId}`);
      if (stored) {
        setActivatedPartnerIds(new Set(JSON.parse(stored)));
      }
    }
  }, [merchant.merchantId]);

  const handleActivate = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  const handleConfirm = async (earnPoints: boolean, redeemPoints: boolean) => {
    if (!selectedPartner) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/activations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId: selectedPartner.id,
          earnPoints,
          redeemPoints,
          ...merchant,
        }),
      });

      if (res.ok) {
        const newActivated = new Set(activatedPartnerIds);
        newActivated.add(selectedPartner.id);
        setActivatedPartnerIds(newActivated);
        localStorage.setItem(
          `activatedPartners_${merchant.merchantId}`,
          JSON.stringify(Array.from(newActivated))
        );

        const name =
          locale === "ar" ? selectedPartner.nameAr : selectedPartner.name;
        setConfirmedPartnerName(name);
        setSelectedPartner(null);
        setShowConfirmation(true);
      }
    } catch (err) {
      console.error("Activation failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const dir = isRTL(locale) ? "rtl" : "ltr";

  // Guard: require merchant params
  if (!hasMerchant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFC] p-8 text-center">
        <div className="mx-auto max-w-md rounded-2xl border bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground">Access Required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This page must be accessed from the Resal merchant dashboard. Please navigate to ResalConnect from your dashboard.
          </p>
          <div className="mt-6 rounded-lg bg-muted p-3 text-start">
            <p className="text-xs font-medium text-muted-foreground">Required URL parameters:</p>
            <code className="mt-1 block text-xs text-foreground">?merchantId=...&merchantName=...&merchantEmail=...</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen bg-[#FAFAFC]">
        {/* Page Content */}
        <main className="px-8 py-6">
          {/* Breadcrumb */}
          <div className="mb-1 text-sm text-muted-foreground">
            {t(locale, "breadcrumbHome")} / {t(locale, "resalConnect")}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground">
            {t(locale, "appName")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            {t(locale, "subtitle")}
          </p>


          {/* Partner Cards Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                locale={locale}
                activated={activatedPartnerIds.has(partner.id)}
                onActivate={handleActivate}
              />
            ))}
          </div>
        </main>

      {/* Activation Modal */}
      {selectedPartner && (
        <ActivationModal
          partner={selectedPartner}
          locale={locale}
          onClose={() => setSelectedPartner(null)}
          onConfirm={handleConfirm}
          submitting={submitting}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          partnerName={confirmedPartnerName}
          locale={locale}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}
