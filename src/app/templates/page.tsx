"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Search,
  ArrowLeft,
  MessageCircle,
  ChevronUp,
  Radio,
  X,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TEMPLATE_CATEGORIES, type TemplateItem } from "@/data/templateCatalog";
import { TemplateCard } from "@/components/common/TemplateCard";
import siteConfigDefault from "../../../public/data/site-config.json";
import templatesDefault from "../../../public/data/templates.json";

export default function TemplatesPage() {
  const [siteConfig, setSiteConfig] = useState(siteConfigDefault);
  const [templates, setTemplates] = useState<TemplateItem[]>(
    templatesDefault as TemplateItem[]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fullScreenTemplate, setFullScreenTemplate] =
    useState<TemplateItem | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Runtime live fetch from public/data JSON files so edits update immediately
  useEffect(() => {
    fetch("/data/site-config.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSiteConfig(data);
      })
      .catch(() => {});

    fetch("/data/templates.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setTemplates(data);
      })
      .catch(() => {});
  }, []);

  // Show "Back to top" button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ordering = siteConfig.ordering as
    | { buttonLabel?: string; directChatUrl?: string }
    | undefined;
  const socials = siteConfig.socials as
    | { messengerUrl?: string; whatsappUrl?: string }
    | undefined;

  const getOrderLink = (template?: TemplateItem) => {
    const directUrl =
      ordering?.directChatUrl ||
      socials?.messengerUrl ||
      socials?.whatsappUrl ||
      "https://messenger.com";

    if (directUrl.includes("wa.me") || directUrl.includes("whatsapp.com")) {
      const text = template
        ? `Hi SayWith! I want to order a custom digital presence with Template #${template.num} (${template.name}).`
        : `Hi SayWith! I want to order a custom digital presence for my keepsake.`;
      const encoded = encodeURIComponent(text);
      return directUrl.includes("?")
        ? `${directUrl}&text=${encoded}`
        : `${directUrl}?text=${encoded}`;
    }

    return directUrl;
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(template.num).includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <nav className="container mx-auto flex items-center justify-between p-3 sm:p-4 px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2.5 rounded-lg hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <div className="h-4 w-px bg-border hidden sm:block" />

            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-primary"
            >
              <Image
                src="/icons/icon-192x192.png"
                alt="SayWith Logo"
                width={28}
                height={28}
                priority
                className="rounded-lg"
              />
              <span className="tracking-tight text-foreground font-headline hidden sm:inline">
                Say<span className="text-primary">With</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={getOrderLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="gap-2 shadow-lg shadow-primary/20 text-xs sm:text-sm">
                <MessageCircle className="w-4 h-4" />
                <span>Contact to Order</span>
              </Button>
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-8 sm:py-14">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complete 50+ Keepsake Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-headline font-bold">
                All 50+ Smart Keepsake Templates
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Browse our entire collection in actual 9:16 mobile phone ratio.
                Hover on desktop to hear audio sync, or tap any card to watch full-screen with music.
              </p>
            </div>

            {/* Real-time Search */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, #, or style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-secondary/50 border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-1.5 sm:gap-2 pb-2">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold"
                    : "bg-secondary/40 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Summary Bar */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Showing <strong className="text-foreground font-semibold">{filteredTemplates.length}</strong> of{" "}
              <strong className="text-foreground font-semibold">{templates.length}</strong> templates
              {selectedCategory !== "All" && (
                <span className="ml-1.5 text-primary">in {selectedCategory}</span>
              )}
            </div>
            {(selectedCategory !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* ── RESPONSIVE TEMPLATE GRID (2 Columns on Mobile!) ── */}
          {filteredTemplates.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-7">
              {filteredTemplates.map((template: TemplateItem) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onOpenFullScreen={() => setFullScreenTemplate(template)}
                  orderLink={getOrderLink(template)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center p-12 rounded-3xl bg-secondary/30 border border-border/80 max-w-md mx-auto">
              <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-60" />
              <h3 className="text-lg font-bold">No templates matched your search</h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                Try searching for another keyword like &quot;wedding&quot;, &quot;minimal&quot;, or &quot;galaxy&quot;.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                View All Templates
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* FULL SCREEN TEMPLATE PREVIEW LIGHTBOX MODAL */}
      <Dialog
        open={!!fullScreenTemplate}
        onOpenChange={(open) => !open && setFullScreenTemplate(null)}
      >
        <DialogContent className="sm:max-w-xl max-h-[100dvh] overflow-y-auto overscroll-contain bg-slate-950 border border-slate-800 p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:p-6 text-white rounded-3xl">
          {fullScreenTemplate && (
            <div>
              <DialogHeader className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-white/10 text-primary">
                      #{fullScreenTemplate.num}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-slate-300">
                      {fullScreenTemplate.category}
                    </span>
                  </div>
                </div>
                <DialogTitle className="text-2xl font-bold mt-2 text-white">
                  {fullScreenTemplate.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-300 mt-1">
                  {fullScreenTemplate.desc}
                </DialogDescription>
              </DialogHeader>

              {/* Full Mobile Screen Frame */}
              <div className="relative w-full aspect-[9/16] max-w-[340px] mx-auto rounded-[32px] bg-black border-[6px] border-slate-700 shadow-2xl overflow-hidden my-4">
                {/* Speaker notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-900 rounded-full z-20" />

                {fullScreenTemplate.previewUrl ? (
                  fullScreenTemplate.previewType === "video" ? (
                    <video
                      key={fullScreenTemplate.id}
                      src={fullScreenTemplate.previewUrl}
                      poster={fullScreenTemplate.posterUrl || undefined}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={fullScreenTemplate.previewUrl}
                      alt={`${fullScreenTemplate.name} full view`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )
                ) : (
                  <div
                    className={cn(
                      "w-full h-full p-6 pt-10 flex flex-col justify-between bg-gradient-to-br text-white",
                      fullScreenTemplate.accent
                    )}
                  >
                    <div className="flex justify-between items-center text-xs opacity-75">
                      <span>9:41</span>
                      <span className="font-mono">SayWith</span>
                    </div>

                    <div className="my-auto text-center p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 text-white/90 animate-pulse" />
                      <h4 className="font-headline font-bold text-xl">
                        {fullScreenTemplate.name}
                      </h4>
                      <p className="text-xs text-white/80 mt-2 leading-relaxed">
                        {fullScreenTemplate.desc}
                      </p>
                      <span className="inline-block mt-3 text-[10px] font-mono bg-white/20 px-2.5 py-1 rounded-full">
                        Tag: {fullScreenTemplate.tag}
                      </span>
                    </div>

                    <div className="text-center text-xs text-white/70">
                      <span>Mobile Safari & Chrome Compatible</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Order Link in Full Screen Modal */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={getOrderLink(fullScreenTemplate)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full gap-2 py-6 bg-primary text-white">
                    <MessageCircle className="w-4 h-4" />
                    Message to Order Template #{fullScreenTemplate.num}
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => setFullScreenTemplate(null)}
                  className="w-full sm:w-auto py-6 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-110 transition-all cursor-pointer"
          title="Back to Top"
          aria-label="Scroll back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-secondary/60 py-10 border-t border-border/50 mt-12">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/icon-192x192.png"
              alt="SayWith Logo"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="font-bold text-foreground">SayWith</span>
            <span>— Smart NFC & QR Digital Presence Keepsakes</span>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="/#nfc-feature" className="hover:text-cyan-400 transition-colors">
              NFC Tap
            </Link>
            <Link href="/#faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
