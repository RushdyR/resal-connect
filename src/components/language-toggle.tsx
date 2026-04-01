"use client";

import { Locale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface LanguageToggleProps {
  locale: Locale;
  onToggle: () => void;
}

export function LanguageToggle({ locale, onToggle }: LanguageToggleProps) {
  return (
    <Button variant="outline" size="sm" onClick={onToggle} className="text-sm">
      {t(locale, "switchLang")}
    </Button>
  );
}
