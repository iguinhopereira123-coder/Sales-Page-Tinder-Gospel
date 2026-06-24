"use client";

import { useEffect, useState } from "react";
import { landingCopy } from "@/lib/copy/landing";

function detectInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  const patterns = [
    "fban",
    "fbav",
    "fb_iab",
    "fbios",
    "instagram",
    "twitter",
    "twitterbot",
    "line/",
    "micromessenger",
    "tiktok",
    "musical_ly",
    "bytedance",
    "snapchat",
    "linkedinapp",
    "pinterest",
    "kakaotalk",
    "wv)",
  ];
  return patterns.some((token) => ua.includes(token));
}

export function InAppBrowserUI() {
  const [showBanner, setShowBanner] = useState(false);
  const isInApp = detectInAppBrowser();

  useEffect(() => {
    if (!isInApp) return;
    try {
      if (sessionStorage.getItem("inapp_banner_dismissed") !== "1") {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
  }, [isInApp]);

  const dismissBanner = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem("inapp_banner_dismissed", "1");
    } catch {
      /* ignore */
    }
  };

  const openInBrowser = () => {
    const target = window.location.href;
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIOS) {
      window.location.href = target.replace(/^https?:/, "x-safari-https:");
    } else if (isAndroid) {
      window.location.href =
        target.replace(/^https?:\/\//, "intent://") +
        "#Intent;scheme=https;package=com.android.chrome;end";
    }
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] bg-[#fff7e6] border-b border-[#f0c36d] text-[#5a3a00] px-4 py-3 text-center text-sm shadow-md"
      role="alert"
    >
      <button
        type="button"
        onClick={dismissBanner}
        className="absolute top-2 right-3 text-lg leading-none"
        aria-label="Fechar"
      >
        &times;
      </button>
      <strong className="block mb-1 text-[#4a2f00]">{landingCopy.inAppBrowser.bannerTitle}</strong>
      {landingCopy.inAppBrowser.bannerBody}
      <button
        type="button"
        onClick={openInBrowser}
        className="mt-2 block mx-auto bg-[#128C7E] text-white border-0 rounded-full px-4 py-2 font-bold text-xs cursor-pointer"
      >
        {landingCopy.inAppBrowser.bannerButton}
      </button>
    </div>
  );
}
