"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Maximize2,
  Volume2,
  VolumeX,
  Film,
  Play,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TemplateItem } from "@/data/templateCatalog";

interface TemplateCardProps {
  template: TemplateItem;
  onOpenFullScreen: () => void;
  orderLink: string;
}

export function TemplateCard({
  template,
  onOpenFullScreen,
  orderLink,
}: TemplateCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [srcLoaded, setSrcLoaded] = useState(false);

  // Lazy-load: set video src only when card enters viewport
  useEffect(() => {
    if (!template.previewUrl || template.previewType !== "video") return;
    const el = frameRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSrcLoaded(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [template.previewUrl, template.previewType]);

  // Pause video if user prefers reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [srcLoaded]);

  // ── Desktop hover handlers: play with audio on hover, pause on mouse leave ──
  const handleMouseEnter = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setShowVolume(true);
    v.muted = false;
    setIsMuted(false);
    v.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Fallback to muted playback if browser restricts sound without gesture
        v.muted = true;
        setIsMuted(true);
        v.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setShowVolume(false);
    v.pause();
    v.muted = true;
    setIsMuted(true);
    setIsPlaying(false);
  }, []);

  const isVideo = template.previewType === "video" && !!template.previewUrl;

  return (
    <div className="bg-background rounded-2xl sm:rounded-3xl border border-border/80 overflow-hidden hover:border-primary/50 transition-all hover:shadow-2xl flex flex-col p-2.5 sm:p-4 group w-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-0.5">
        <div className="flex items-center gap-1 sm:gap-2 truncate mr-1">
          <span className="text-[10px] sm:text-xs font-mono font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-secondary border border-border text-foreground shrink-0">
            #{template.num}
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-primary truncate">
            {template.tag}
          </span>
        </div>

        {/* Fullscreen Expand Button (visible on desktop/tablet) */}
        <button
          onClick={onOpenFullScreen}
          className="hidden sm:inline-flex items-center gap-1 px-2 py-1 min-h-[30px] rounded-lg bg-secondary hover:bg-primary hover:text-white transition-colors text-xs font-medium text-muted-foreground shrink-0"
          title="View full screen mobile preview"
          aria-label={`View ${template.name} full screen`}
        >
          <Maximize2 className="w-3 h-3" />
          <span className="text-[10px]">Expand</span>
        </button>
      </div>

      {/* ── Phone Frame (aspect-[9/16] Mobile Phone Ratio - Tap/Click opens fullscreen) ── */}
      <div
        ref={frameRef}
        role="button"
        tabIndex={0}
        aria-label={`Watch ${template.name} preview`}
        className="relative w-full aspect-[9/16] rounded-[16px] sm:rounded-[24px] bg-slate-950 border-[2.5px] sm:border-[4px] border-slate-800 shadow-xl overflow-hidden group-hover:border-primary/60 transition-colors cursor-pointer select-none"
        onClick={onOpenFullScreen}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpenFullScreen()}
        onMouseEnter={isVideo ? handleMouseEnter : undefined}
        onMouseLeave={isVideo ? handleMouseLeave : undefined}
      >
        {/* Speaker Notch */}
        <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-8 sm:w-14 h-2 sm:h-3 bg-black rounded-full z-20 flex items-center justify-center pointer-events-none">
          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-800 mr-1 sm:mr-1.5" />
          <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-blue-900" />
        </div>

        {/* Volume indicator — desktop only, fades in when playing on hover */}
        {isVideo && (
          <div
            className={cn(
              "absolute top-2 right-2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-md pointer-events-none",
              showVolume && isPlaying ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}
            aria-hidden="true"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            )}
          </div>
        )}

        {/* Play Icon Overlay (visible when paused, fades out when playing) */}
        {isVideo && !isPlaying && (
          <div className="absolute inset-0 m-auto w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:scale-110 pointer-events-none z-20">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 text-primary fill-primary" />
          </div>
        )}

        {/* "Tap to watch" badge — visible only on touch screens via CSS */}
        {isVideo && (
          <div className="absolute bottom-8 inset-x-0 flex justify-center z-20 pointer-events-none tap-to-watch-badge">
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/75 text-white text-[9px] sm:text-[10px] backdrop-blur-sm shadow-md">
              👆 Tap to watch
            </span>
          </div>
        )}

        {/* Media Content */}
        {template.previewUrl ? (
          template.previewType === "video" ? (
            <div className="relative w-full h-full bg-black">
              <video
                ref={videoRef}
                src={srcLoaded ? template.previewUrl : undefined}
                poster={template.posterUrl || undefined}
                loop
                muted
                playsInline
                preload="none"
                width={324}
                height={576}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-10 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-black/60 text-[8px] sm:text-[9px] text-white backdrop-blur-sm pointer-events-none">
                <Film className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-primary" />
                <span>Video</span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full bg-black">
              <img
                src={template.previewUrl}
                alt={`${template.name} mobile screenshot`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          )
        ) : (
          <div
            className={cn(
              "w-full h-full p-2.5 sm:p-4 pt-6 sm:pt-8 flex flex-col justify-between bg-gradient-to-br text-white relative",
              template.accent
            )}
          >
            <div className="flex justify-between items-center text-[8px] sm:text-[10px] opacity-75">
              <span>9:41</span>
              <span className="font-semibold uppercase tracking-wider text-[8px] sm:text-[9px] bg-black/30 px-1.5 sm:px-2 py-0.5 rounded-full">
                {template.category}
              </span>
            </div>
            <div className="my-auto text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-black/25 backdrop-blur-md border border-white/10">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-white/80 animate-pulse" />
              <h4 className="font-headline font-bold text-xs sm:text-lg leading-tight truncate">
                {template.name}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-white/80 mt-1 leading-relaxed line-clamp-2">
                {template.desc}
              </p>
            </div>
            <p className="text-[7px] sm:text-[8px] text-center text-white/70">
              Tap phone to replay
            </p>
          </div>
        )}
      </div>

      {/* Card Bottom Details & Direct Order CTA */}
      <div className="mt-2.5 sm:mt-4 flex-1 flex flex-col justify-between px-0.5">
        <div>
          <div className="flex justify-between items-baseline gap-1">
            <h4 className="font-headline font-bold text-xs sm:text-base text-foreground group-hover:text-primary transition-colors truncate">
              {template.name}
            </h4>
            <span className="text-[9px] sm:text-[11px] text-muted-foreground uppercase font-medium shrink-0">
              {template.category}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed hidden xs:block sm:block">
            {template.desc}
          </p>
        </div>

        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-2">
          <span className="hidden sm:inline-flex text-[11px] sm:text-xs text-primary font-medium items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span>NFC &amp; QR</span>
          </span>
          <a
            href={orderLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-1 py-1 sm:py-0 px-2 rounded-md sm:rounded-none bg-primary/10 sm:bg-transparent text-primary hover:text-white sm:hover:text-primary hover:bg-primary sm:hover:bg-transparent text-[10px] sm:text-xs font-semibold transition-colors min-h-[34px] sm:min-h-[44px]"
          >
            <span>Inquire</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
