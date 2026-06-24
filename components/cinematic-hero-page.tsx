"use client";

import { useCallback, useEffect } from "react";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { InAppBrowserUI } from "@/components/in-app-browser";
import { openCheckout, openSupport } from "@/lib/checkout";
import { landingCopy } from "@/lib/copy/landing";
import { bootstrapTrackingParams } from "@/lib/tracking";

export function CinematicHeroPage() {
  useEffect(() => {
    bootstrapTrackingParams();
  }, []);

  const handleCheckout = useCallback(() => {
    openCheckout();
  }, []);

  const handleSupport = useCallback(() => {
    openSupport();
  }, []);

  return (
    <>
      <InAppBrowserUI />
      <div className="overflow-x-hidden w-full min-h-screen">
        <CinematicHero
          tagline1={landingCopy.hero.tagline1}
          tagline2={landingCopy.hero.tagline2}
          scrollHint={landingCopy.hero.scrollHint}
          brandName={landingCopy.card.brandName}
          cardHeading={landingCopy.card.cardHeading}
          cardDescription={
            <>
              A{" "}
              <span className="text-white font-semibold">Comunidade Tinder Gospel</span> reúne
              cristãos que buscam conhecer alguém especial — com a mesma fé, respeito e conversas
              reais no WhatsApp.
            </>
          }
          metricValue={landingCopy.card.metricValue}
          metricLabel={landingCopy.card.metricLabel}
          badgeTopTitle={landingCopy.card.badgeTopTitle}
          badgeTopSubtitle={landingCopy.card.badgeTopSubtitle}
          badgeBottomTitle={landingCopy.card.badgeBottomTitle}
          badgeBottomSubtitle={landingCopy.card.badgeBottomSubtitle}
          phoneChannelLabel={landingCopy.phone.channelLabel}
          phoneAppTitle={landingCopy.phone.appTitle}
          phoneWidget1Title={landingCopy.phone.widget1Title}
          phoneWidget1Subtitle={landingCopy.phone.widget1Subtitle}
          phoneWidget2Title={landingCopy.phone.widget2Title}
          phoneWidget2Subtitle={landingCopy.phone.widget2Subtitle}
          ctaEyebrow={landingCopy.cta.eyebrow}
          ctaHeading={landingCopy.cta.heading}
          ctaSubheading={landingCopy.cta.subheading}
          priceAmount={landingCopy.cta.priceAmount}
          priceCurrency={landingCopy.cta.priceCurrency}
          priceNote={landingCopy.cta.priceNote}
          ctaBullets={[...landingCopy.cta.ctaBullets]}
          trustBadges={[...landingCopy.cta.trustBadges]}
          checkoutLabel={landingCopy.cta.checkoutLabel}
          checkoutHint={landingCopy.cta.checkoutHint}
          supportLabel={landingCopy.cta.supportLabel}
          onCheckout={handleCheckout}
          onSupport={handleSupport}
        />
      </div>
    </>
  );
}
