"use client";

import * as React from "react";
import { X } from "lucide-react";

const INTRO_SEEN_KEY = "appbase-dashboard-intro-seen-v1";

type IntroAsset = {
   poster: string;
   video: string;
};

const DESKTOP_INTRO: IntroAsset = {
   poster: "/dashboard-assets/intro-desktop-poster.jpg",
   video: "/dashboard-assets/intro-desktop.mp4",
};
const MOBILE_INTRO: IntroAsset = {
   poster: "/dashboard-assets/intro-mobile-poster.jpg",
   video: "/dashboard-assets/intro-mobile.mp4",
};

export function DashboardIntro() {
   const videoRef = React.useRef<HTMLVideoElement>(null);
   const [visible, setVisible] = React.useState(false);
   const [asset, setAsset] = React.useState<IntroAsset | null>(null);
   const [videoReady, setVideoReady] = React.useState(false);

   const dismiss = React.useCallback(() => {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, "true");
      setVisible(false);
   }, []);

   React.useEffect(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.sessionStorage.getItem(INTRO_SEEN_KEY) === "true") return;
      setAsset(window.matchMedia("(max-width: 767px)").matches ? MOBILE_INTRO : DESKTOP_INTRO);
      setVisible(true);
   }, []);

   React.useEffect(() => {
      if (!visible || !asset) return;
      void videoRef.current?.play().catch(() => {
         // Keep the skip button visible if a browser blocks playback.
      });
   }, [asset, visible]);

   React.useEffect(() => {
      if (!visible || !asset) return;
      const timeout = window.setTimeout(dismiss, 18_000);
      return () => window.clearTimeout(timeout);
   }, [asset, dismiss, visible]);

   if (!visible || !asset) return null;

   return (
      <div
         className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f4f0ea] bg-contain bg-center bg-no-repeat"
         style={{ backgroundImage: `url(${asset.poster})` }}
         role="dialog"
         aria-label="AppBase dashboard opening animation">
         <video
            ref={videoRef}
            className={`h-full w-full object-contain transition-opacity duration-300 ${videoReady ? "opacity-100" : "opacity-0"}`}
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={asset.poster}
            onEnded={dismiss}
            onError={dismiss}
            onTimeUpdate={(event) => {
               if (event.currentTarget.currentTime > 0.4) setVideoReady(true);
            }}
            src={asset.video}
         />
         <button
            type="button"
            onClick={dismiss}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/85 text-zinc-950 shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
            aria-label="Skip dashboard opening animation">
            <X className="size-5" aria-hidden />
         </button>
      </div>
   );
}
