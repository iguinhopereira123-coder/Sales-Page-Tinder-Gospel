"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { landingCopy } from "@/lib/copy/landing";

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .text-3d-matte {
      color: var(--color-foreground);
      text-shadow: 
          0 10px 30px color-mix(in srgb, var(--color-foreground) 20%, transparent), 
          0 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, var(--color-foreground) 0%, color-mix(in srgb, var(--color-foreground) 40%, transparent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 10px 20px color-mix(in srgb, var(--color-foreground) 15%, transparent)) 
          drop-shadow(0px 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent));
  }

  .text-hero-reveal {
      display: inline-block;
      color: hsl(var(--primary));
      -webkit-text-fill-color: hsl(var(--primary));
      background: none;
      text-shadow:
          0 2px 16px color-mix(in srgb, hsl(var(--primary)) 35%, transparent),
          0 1px 2px color-mix(in srgb, var(--color-foreground) 15%, transparent);
      will-change: clip-path, filter, transform;
  }

  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) 
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  .premium-depth-card {
      background: linear-gradient(145deg, #128C7E 0%, #0A1512 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(255, 255, 255, 0.2),
          inset 0 -2px 4px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.04);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .iphone-bezel {
      background-color: #111;
      box-shadow: 
          inset 0 0 0 2px #52525B, 
          inset 0 0 0 7px #000, 
          0 40px 80px -15px rgba(0,0,0,0.9),
          0 15px 25px -5px rgba(0,0,0,0.7);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow: 
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.15),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.05);
  }
  
  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow: 
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px); 
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 
          0 0 0 1px rgba(255, 255, 255, 0.1),
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.2),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      cursor: pointer;
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #E8A838 0%, #D4922A 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #3F3F46 0%, #27272A 100%);
  }
  .btn-modern-dark:active {
      transform: translateY(1px);
    background: #18181B;
  }

  .cta-offer-card {
      background: linear-gradient(165deg, #FFFFFF 0%, #F8F6F2 55%, #F3F0EA 100%);
      border-radius: 28px;
      box-shadow:
          0 0 0 1px rgba(18, 140, 126, 0.14),
          0 2px 4px rgba(0, 0, 0, 0.04),
          0 20px 50px -12px rgba(0, 0, 0, 0.14),
          inset 0 1px 0 rgba(255, 255, 255, 0.9);
      position: relative;
      overflow: hidden;
  }

  .cta-offer-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, #128C7E 0%, #1CB5A3 50%, #E8A838 100%);
  }

  .cta-offer-glow {
      position: absolute;
      top: -40%;
      right: -20%;
      width: 60%;
      height: 80%;
      background: radial-gradient(circle, rgba(18, 140, 126, 0.08) 0%, transparent 70%);
      pointer-events: none;
  }

  .cta-price-amount {
      background: linear-gradient(135deg, #128C7E 0%, #0A5C52 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
  }

  .cta-benefit-icon {
      background: linear-gradient(135deg, rgba(18, 140, 126, 0.15) 0%, rgba(18, 140, 126, 0.06) 100%);
      box-shadow: inset 0 0 0 1px rgba(18, 140, 126, 0.2);
  }

  .btn-cta-primary {
      background: linear-gradient(135deg, #E8A838 0%, #D4922A 55%, #C47E1A 100%);
      color: #1A1208;
      box-shadow:
          0 0 0 1px rgba(0, 0, 0, 0.06),
          0 4px 8px rgba(196, 126, 26, 0.25),
          0 16px 32px -8px rgba(196, 126, 26, 0.45),
          inset 0 1px 0 rgba(255, 255, 255, 0.45);
      transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
  }

  .btn-cta-primary::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
  }

  .btn-cta-primary:hover {
      transform: translateY(-2px);
      box-shadow:
          0 0 0 1px rgba(0, 0, 0, 0.06),
          0 8px 16px rgba(196, 126, 26, 0.3),
          0 24px 40px -10px rgba(196, 126, 26, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  .btn-cta-primary:hover::after {
      transform: translateX(100%);
  }

  .btn-cta-primary:active {
      transform: translateY(1px);
  }

  .cta-trust-pill {
      background: rgba(18, 140, 126, 0.07);
      border: 1px solid rgba(18, 140, 126, 0.12);
      color: #0A5C52;
  }

  .cta-support-link {
      color: hsl(var(--muted-foreground));
      transition: color 0.2s ease;
      cursor: pointer;
      background: none;
      border: none;
  }

  .cta-support-link:hover {
      color: hsl(var(--primary));
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  scrollHint?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  phoneChannelLabel?: string;
  phoneAppTitle?: string;
  phoneWidget1Title?: string;
  phoneWidget1Subtitle?: string;
  phoneWidget2Title?: string;
  phoneWidget2Subtitle?: string;
  ctaHeading?: string;
  ctaEyebrow?: string;
  ctaSubheading?: string;
  priceAmount?: string;
  priceCurrency?: string;
  priceNote?: string;
  ctaDescription?: string;
  ctaBullets?: string[];
  trustBadges?: string[];
  checkoutLabel?: string;
  checkoutHint?: string;
  supportLabel?: string;
  priceLabel?: string;
  badgeTopTitle?: string;
  badgeTopSubtitle?: string;
  badgeBottomTitle?: string;
  badgeBottomSubtitle?: string;
  onCheckout?: () => void;
  onSupport?: () => void;
}

export function CinematicHero({
  brandName = landingCopy.card.brandName,
  tagline1 = landingCopy.hero.tagline1,
  tagline2 = landingCopy.hero.tagline2,
  scrollHint = landingCopy.hero.scrollHint,
  cardHeading = landingCopy.card.cardHeading,
  cardDescription = landingCopy.card.descriptionDesktop,
  metricValue = landingCopy.card.metricValue,
  metricLabel = landingCopy.card.metricLabel,
  phoneChannelLabel = landingCopy.phone.channelLabel,
  phoneAppTitle = landingCopy.phone.appTitle,
  phoneWidget1Title = landingCopy.phone.widget1Title,
  phoneWidget1Subtitle = landingCopy.phone.widget1Subtitle,
  phoneWidget2Title = landingCopy.phone.widget2Title,
  phoneWidget2Subtitle = landingCopy.phone.widget2Subtitle,
  ctaHeading = landingCopy.cta.heading,
  ctaEyebrow = landingCopy.cta.eyebrow,
  ctaSubheading = landingCopy.cta.subheading,
  priceAmount = landingCopy.cta.priceAmount,
  priceCurrency = landingCopy.cta.priceCurrency,
  priceNote = landingCopy.cta.priceNote,
  ctaDescription = landingCopy.cta.ctaDescription,
  ctaBullets = [...landingCopy.cta.ctaBullets],
  trustBadges = [...landingCopy.cta.trustBadges],
  checkoutLabel = landingCopy.cta.checkoutLabel,
  checkoutHint = landingCopy.cta.checkoutHint,
  supportLabel = landingCopy.cta.supportLabel,
  priceLabel = landingCopy.cta.priceLabel,
  badgeTopTitle = landingCopy.card.badgeTopTitle,
  badgeTopSubtitle = landingCopy.card.badgeTopSubtitle,
  badgeBottomTitle = landingCopy.card.badgeBottomTitle,
  badgeBottomSubtitle = landingCopy.card.badgeBottomSubtitle,
  onCheckout,
  onSupport,
  className,
  ...props
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const currentStepRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (currentStepRef.current < 2) return;

      cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    let removeStepNav: (() => void) | undefined;

    const ctx = gsap.context(() => {
      gsap.set(".text-track", {
        autoAlpha: 0,
        y: 60,
        scale: 0.85,
        filter: "blur(20px)",
        rotationX: -20,
      });
      gsap.set(".text-days", {
        autoAlpha: 1,
        clipPath: "inset(0 100% 0 0)",
        filter: "blur(12px)",
        x: -8,
      });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set(
        [".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"],
        { autoAlpha: 0 }
      );
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl.to(".text-track", {
        duration: 2.2,
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        rotationX: 0,
        ease: "power2.out",
      });

      const STEPS = 4;
      const stepTransitionDuration = isMobile ? 1.6 : 1.9;
      const smoothEase = "sine.inOut";

      // Tempos absolutos na timeline — cada etapa para exatamente nestes pontos
      const T = { hero: 0, reveal: 1, card: 2, cta: 3 } as const;
      const STEP_TIMES = [T.hero, T.reveal, T.card, T.cta] as const;

      const scrollTl = gsap.timeline({ paused: true });

      scrollTl
        .addLabel("hero", T.hero)

        // ── Etapa 0→1: revela "com a mesma fé." ──
        .to(
          ".text-days",
          {
            clipPath: "inset(0 0% 0 0)",
            filter: "blur(0px)",
            x: 0,
            ease: smoothEase,
            duration: 0.55,
          },
          T.hero + 0.1
        )
        .to(".hero-headline", { scale: 1.015, ease: smoothEase, duration: 0.38 }, T.hero + 0.48)
        .set(
          [".hero-text-wrapper", ".text-days", ".text-track"],
          { filter: "blur(0px)", opacity: 1, scale: 1 },
          T.reveal - 0.001
        )
        .addLabel("reveal", T.reveal)

        // ── Etapa 1→2: card + celular ──
        .to(
          [".hero-text-wrapper", ".bg-grid-theme"],
          { scale: 1.1, filter: "blur(14px)", opacity: 0.28, ease: smoothEase, duration: 0.55 },
          T.reveal
        )
        .to(".main-card", { y: 0, ease: smoothEase, duration: 0.6 }, T.reveal)
        .to(
          ".main-card",
          {
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            ease: smoothEase,
            duration: 0.45,
          },
          T.reveal + 0.2
        )
        .fromTo(
          ".mockup-scroll-wrapper",
          { y: 220, z: -400, rotationX: 40, rotationY: -24, autoAlpha: 0, scale: 0.72 },
          {
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            autoAlpha: 1,
            scale: 1,
            ease: smoothEase,
            duration: 0.65,
          },
          T.reveal + 0.15
        )
        .fromTo(
          ".phone-widget",
          { y: 32, autoAlpha: 0, scale: 0.94 },
          { y: 0, autoAlpha: 1, scale: 1, stagger: 0.08, ease: smoothEase, duration: 0.45 },
          T.reveal + 0.4
        )
        .to(
          ".progress-ring",
          { strokeDashoffset: 60, duration: 0.45, ease: smoothEase },
          T.reveal + 0.52
        )
        .to(
          ".counter-val",
          { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 0.45, ease: smoothEase },
          T.reveal + 0.52
        )
        .fromTo(
          ".floating-badge",
          { y: 72, autoAlpha: 0, scale: 0.82, rotationZ: -8 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            rotationZ: 0,
            ease: smoothEase,
            duration: 0.4,
            stagger: 0.1,
          },
          T.reveal + 0.58
        )
        .fromTo(
          ".card-left-text",
          { x: -36, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, ease: smoothEase, duration: 0.35 },
          T.reveal + 0.65
        )
        .fromTo(
          ".card-right-text",
          { x: 36, autoAlpha: 0, scale: 0.9 },
          { x: 0, autoAlpha: 1, scale: 1, ease: smoothEase, duration: 0.35 },
          T.reveal + 0.65
        )
        .addLabel("card", T.card)

        // ── Etapa 2→3: CTA de pagamento ──
        .to(".hero-text-wrapper", { autoAlpha: 0, ease: smoothEase, duration: 0.35 }, T.card + 0.05)
        .to(
          ".cta-wrapper",
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", ease: smoothEase, duration: 0.5 },
          T.card + 0.1
        )
        .to(
          [".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"],
          {
            scale: 0.92,
            y: -28,
            z: -160,
            autoAlpha: 0,
            ease: smoothEase,
            duration: 0.5,
            stagger: 0.08,
          },
          T.card + 0.15
        )
        .to(
          ".main-card",
          {
            width: isMobile ? "92vw" : "85vw",
            height: isMobile ? "92vh" : "85vh",
            borderRadius: isMobile ? "32px" : "40px",
            ease: smoothEase,
            duration: 0.52,
          },
          T.card + 0.15
        )
        .to(
          ".main-card",
          { y: -window.innerHeight - 300, ease: smoothEase, duration: 0.45 },
          T.card + 0.58
        )
        .addLabel("cta", T.cta);

      let stepAnimation: gsap.core.Tween | null = null;
      let introDone = false;

      introTl.eventCallback("onComplete", () => {
        introDone = true;
      });

      const snapToTime = (time: number) => {
        scrollTl.pause().time(time);
      };

      const goToStep = (step: number, immediate = false) => {
        const clamped = Math.max(0, Math.min(STEPS - 1, step));
        if (!immediate && isAnimatingRef.current) return;
        if (!immediate && clamped === currentStepRef.current) return;
        if (!immediate && !introDone) return;

        stepAnimation?.kill();
        currentStepRef.current = clamped;
        if (clamped > 0) setShowScrollHint(false);

        const targetTime = STEP_TIMES[clamped];

        if (immediate) {
          snapToTime(targetTime);
          isAnimatingRef.current = false;
          return;
        }

        isAnimatingRef.current = true;

        stepAnimation = gsap.to(scrollTl, {
          time: targetTime,
          duration: stepTransitionDuration,
          ease: "sine.inOut",
          overwrite: true,
          onComplete: () => {
            snapToTime(targetTime);
            isAnimatingRef.current = false;
            stepAnimation = null;
          },
        });
      };

      const changeStep = (direction: 1 | -1) => {
        if (isAnimatingRef.current || !introDone) return false;
        const next = currentStepRef.current + direction;
        if (next < 0 || next >= STEPS) return false;
        goToStep(next);
        return true;
      };

      let touchStartY = 0;
      let lastWheelAt = 0;

      const onWheel = (event: WheelEvent) => {
        if (isAnimatingRef.current || !introDone) return;
        if (Math.abs(event.deltaY) < 8) return;

        const now = Date.now();
        if (now - lastWheelAt < 400) return;
        lastWheelAt = now;

        const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1;
        const next = currentStepRef.current + direction;
        if (next < 0 || next >= STEPS) return;

        event.preventDefault();
        changeStep(direction);
      };

      const onTouchStart = (event: TouchEvent) => {
        touchStartY = event.touches[0]?.clientY ?? 0;
      };

      const onTouchEnd = (event: TouchEvent) => {
        if (isAnimatingRef.current || !introDone) return;

        const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
        const delta = touchStartY - touchEndY;
        if (Math.abs(delta) < 48) return;

        const direction: 1 | -1 = delta > 0 ? 1 : -1;
        const next = currentStepRef.current + direction;
        if (next < 0 || next >= STEPS) return;

        event.preventDefault();
        changeStep(direction);
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (isAnimatingRef.current || !introDone) return;
        if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
          event.preventDefault();
          changeStep(1);
        } else if (event.key === "ArrowUp" || event.key === "PageUp") {
          event.preventDefault();
          changeStep(-1);
        }
      };

      const onResize = () => {
        goToStep(currentStepRef.current, true);
      };

      snapToTime(T.hero);

      const root = containerRef.current;
      root?.addEventListener("wheel", onWheel, { passive: false });
      root?.addEventListener("touchstart", onTouchStart, { passive: true });
      root?.addEventListener("touchend", onTouchEnd, { passive: false });
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("resize", onResize);

      removeStepNav = () => {
        stepAnimation?.kill();
        root?.removeEventListener("wheel", onWheel);
        root?.removeEventListener("touchstart", onTouchStart);
        root?.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("resize", onResize);
      };
    }, containerRef);

    return () => {
      removeStepNav?.();
      ctx.revert();
    };
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-screen h-screen overflow-hidden touch-none overscroll-none flex items-center justify-center bg-background text-foreground font-sans antialiased",
        className
      )}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div
        className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50"
        aria-hidden="true"
      />

      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform transform-style-3d">
        <h1 className="hero-headline flex flex-col items-center gap-1 sm:gap-2 text-[2rem] leading-tight sm:text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight font-display">
          <span className="text-track gsap-reveal text-3d-matte">{tagline1}</span>
          <span className="text-days gsap-reveal text-hero-reveal font-extrabold tracking-tighter max-sm:whitespace-nowrap">
            {tagline2}
          </span>
        </h1>
      </div>

      {showScrollHint && (
        <div
          className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-muted-foreground pointer-events-none transition-opacity duration-500"
          aria-hidden="true"
        >
          <span className="text-xs sm:text-sm font-medium">{scrollHint}</span>
          <svg
            className="w-5 h-5 animate-bounce opacity-70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}

      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <div className="cta-offer-card w-full max-w-[22rem] sm:max-w-md p-6 sm:p-8 text-left relative">
          <div className="cta-offer-glow" aria-hidden="true" />

          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            {ctaEyebrow}
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display leading-tight mb-1.5">
            {ctaHeading}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
            {ctaSubheading}
          </p>

          <div className="flex items-end gap-1 mb-1">
            <span className="text-lg sm:text-xl font-bold text-primary pb-1">{priceCurrency}</span>
            <span className="cta-price-amount text-5xl sm:text-6xl font-black font-display tracking-tight">
              {priceAmount}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6">{priceNote}</p>

          <ul className="space-y-3 mb-6">
            {ctaBullets.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm sm:text-[15px] text-foreground/90">
                <span
                  className="cta-benefit-icon flex items-center justify-center w-7 h-7 rounded-full shrink-0"
                  aria-hidden="true"
                >
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onCheckout}
            className="btn-cta-primary w-full flex flex-col items-center justify-center gap-0.5 rounded-2xl min-h-[56px] px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <span className="text-base sm:text-lg font-bold">{checkoutLabel}</span>
            <span className="text-xs font-medium opacity-75">{checkoutHint}</span>
          </button>

          <div className="flex flex-wrap justify-center gap-2 mt-5 mb-4">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="cta-trust-pill text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onSupport}
            className="cta-support-link w-full text-center text-sm underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            {supportLabel}
          </button>
        </div>
      </div>

      <div
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        style={{ perspective: "1500px" }}
      >
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2 className="text-4xl sm:text-6xl md:text-[6rem] lg:text-[8rem] font-black uppercase tracking-tighter text-card-silver-matte lg:mt-0 font-display text-center lg:text-right">
                {brandName}
              </h2>
            </div>

            <div
              className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[380px] lg:h-[600px] flex items-center justify-center z-10"
              style={{ perspective: "1000px" }}
            >
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.65] md:scale-85 lg:scale-100">
                <div
                  ref={mockupRef}
                  className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform transform-style-3d"
                >
                  <div
                    className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-[7px] bg-[#050914] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)] text-white z-10">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    </div>

                    <div className="relative w-full h-full pt-12 px-5 pb-8 flex flex-col">
                      <div className="phone-widget flex justify-between items-center mb-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">
                            {phoneChannelLabel}
                          </span>
                          <span className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-md">
                            {phoneAppTitle}
                          </span>
                        </div>
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-400/20 shadow-lg shadow-black/50 shrink-0">
                          <img
                            src="/assets/logo-tinder-gospel.png"
                            alt="Tinder Gospel"
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="phone-widget relative w-44 h-44 mx-auto flex items-center justify-center mb-8 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                          <circle
                            cx="88"
                            cy="88"
                            r="64"
                            fill="none"
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="12"
                          />
                          <circle
                            className="progress-ring"
                            cx="88"
                            cy="88"
                            r="64"
                            fill="none"
                            stroke="#128C7E"
                            strokeWidth="12"
                          />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center">
                          <span className="counter-val text-4xl font-extrabold tracking-tighter text-white">
                            0
                          </span>
                          <span className="text-[8px] text-emerald-200/50 uppercase tracking-[0.1em] font-bold mt-0.5">
                            {metricLabel}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 flex items-center justify-center mr-3 border border-emerald-400/20 shadow-inner">
                            <svg
                              className="w-4 h-4 text-emerald-400 drop-shadow-md"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-white truncate">{phoneWidget1Title}</p>
                            <p className="text-[9px] text-neutral-400 truncate">{phoneWidget1Subtitle}</p>
                          </div>
                        </div>
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 flex items-center justify-center mr-3 border border-amber-400/20 shadow-inner shrink-0">
                            <svg
                              className="w-4 h-4 text-amber-400 drop-shadow-md"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-white truncate">{phoneWidget2Title}</p>
                            <p className="text-[9px] text-neutral-400 truncate">{phoneWidget2Subtitle}</p>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/20 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    </div>
                  </div>
                </div>

                <div className="floating-badge absolute flex top-4 sm:top-6 lg:top-12 left-0 sm:left-[-15px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-2.5 sm:p-3 lg:p-4 items-center gap-2 sm:gap-3 lg:gap-4 z-30 max-w-[140px] sm:max-w-none">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 flex items-center justify-center border border-emerald-400/30 shadow-inner">
                    <span className="text-base lg:text-xl drop-shadow-lg" aria-hidden="true">
                      ✨
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">
                      {badgeTopTitle}
                    </p>
                    <p className="text-emerald-200/50 text-[10px] lg:text-xs font-medium">
                      {badgeTopSubtitle}
                    </p>
                  </div>
                </div>

                <div className="floating-badge absolute flex bottom-8 sm:bottom-12 lg:bottom-20 right-0 sm:right-[-15px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-2.5 sm:p-3 lg:p-4 items-center gap-2 sm:gap-3 lg:gap-4 z-30 max-w-[140px] sm:max-w-none">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-teal-500/20 to-teal-900/10 flex items-center justify-center border border-teal-400/30 shadow-inner">
                    <span className="text-base lg:text-lg drop-shadow-lg" aria-hidden="true">
                      🤝
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">
                      {badgeBottomTitle}
                    </p>
                    <p className="text-emerald-200/50 text-[10px] lg:text-xs font-medium">
                      {badgeBottomSubtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-4 lg:px-0">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 lg:mb-5 tracking-tight font-display">
                {cardHeading}
              </h3>
              <p className="text-emerald-100/80 md:text-emerald-100/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                {cardDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
