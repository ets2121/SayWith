"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Smartphone,
  QrCode,
  Gift,
  Sparkles,
  Heart,
  Music,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Flame,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
  Radio,
  Layers,
  Camera,
  Play,
  Pause,
  Maximize2,
  Film,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  TEMPLATE_CATEGORIES,
  type TemplateItem
} from "@/data/templateCatalog";
import siteConfigDefault from "../../public/data/site-config.json";
import templatesDefault from "../../public/data/templates.json";

const socialIcons: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  messenger: MessageCircle
};

const occasions = [
  {
    icon: Heart,
    title: "Couples & Anniversaries",
    badge: "Most Popular",
    description: "Create a digital memory reel linked to 'your song', love letters, and favorite video clips to pair with keychains or anniversary gifts.",
    example: "Template: Cascading Rose Petals & Spotify Vibe Card"
  },
  {
    icon: Clock,
    title: "Long-Distance Love",
    badge: "Emotional Keepsake",
    description: "Keep each other close across miles. Tap the keychain or scan the styled photo whenever you miss them to hear their voice and video.",
    example: "Template: Love Letter Wax Seal & Midnight Serenade"
  },
  {
    icon: Flame,
    title: "Birthdays & Milestones",
    badge: "Unforgettable Surprise",
    description: "Ditch ordinary paper greeting cards. Give them a digital story loaded with celebratory footage, voice greetings, and personal messages.",
    example: "Template: Golden Hour Glow & Hollywood Premiere"
  },
  {
    icon: Sparkles,
    title: "Memorials & Tributes",
    badge: "Forever Cherished",
    description: "Preserve the precious laughter, voice, and smile of a loved one or pet close to your heart on a durable digital keepsake.",
    example: "Template: Cosmic Galaxy Night & Velvet Charcoal"
  }
];

const exampleUseCases = [
  {
    id: "acrylic-keychain",
    name: "Acrylic Photo Keychains",
    tagline: "The most popular way to carry a memory every day",
    format: "Keychain / Bag Charm Idea",
    badge: "Top Gift Idea",
    description: "Slide your SayWith styled QR code photo into a clear acrylic keychain blank and write your memory link onto an embedded NFC tag. Tap with any phone or scan the photo to replay.",
    features: [
      "SayWith custom styled QR code photo (print-ready)",
      "Instant NFC tap link ready for any NTAG chip",
      "Synchronized music, video clips & personal note",
      "Lifetime unlimited digital taps & scans",
      "Editable anytime without changing the physical item"
    ],
    highlight: true
  },
  {
    id: "couples-set",
    name: "Couples Matching Keepsakes",
    tagline: "For two hearts sharing one cherished digital memory",
    format: "Twin Keepsake Idea",
    badge: "Couples Favorite",
    description: "One digital memory reel shared between two physical items—matching keychains, twin wallet cards, or twin pendants. Both partners tap or scan to relive the same memory.",
    features: [
      "Single synchronized digital story for both partners",
      "Custom couple photo + twin styled QR photo designs",
      "Dual-access: Tap with phone NFC or scan styled QR photo",
      "Replay voice notes, special song & anniversary timeline",
      "Easy to load onto matching NFC tags or wallet cards"
    ],
    highlight: false
  },
  {
    id: "cards-and-tokens",
    name: "Greeting Cards, Tokens & Frames",
    tagline: "Elevate physical presents, letters, and desk displays",
    format: "Cards & Displays Idea",
    badge: "Creative Gifting",
    description: "Print your custom styled QR photo for desk frames, slip it into a wallet, or affix an ultra-thin NFC sticker onto greeting cards, gift boxes, and scrapbooks.",
    features: [
      "High-resolution styled QR photo file for crisp printing",
      "Compatible with any NFC card, coin token, or sticker",
      "Surprise the recipient the moment they open the gift",
      "Zero app download needed for anyone viewing",
      "Cloud-hosted forever with no recurring fees"
    ],
    highlight: false
  }
];

const faqs = [
  {
    q: "What does SayWith produce?",
    a: "SayWith creates the interactive digital presence for your gifts: we craft your personalized multimedia story using your chosen template (video, photos, audio music or voice recordings, and synchronized letter/captions) and deliver your high-resolution custom styled QR code photo along with your dynamic NFC-ready link. Physical items like keychains, tokens, and gift cards are example ways you can use your SayWith memory in the real world!"
  },
  {
    q: "Do you sell physical keychains or tokens?",
    a: "We specialize in producing the digital presence and the personalized styled QR code photo. Keychains, tokens, and cards shown on our site are examples of how customers bring their digital memories into physical objects. You can easily slip your styled QR photo into an acrylic keychain blank or write the link onto any NFC tag or sticker in seconds."
  },
  {
    q: "What is the styled QR code photo?",
    a: "Instead of an ordinary black-and-white barcode, we design a custom styled QR code photo. It features your chosen photo, beautiful borders, and artistic design accents with a scannable QR code harmonized into the picture. Any smartphone camera can scan it instantly, providing the perfect fallback for devices without NFC or when displaying the photo on a desk or in a wallet."
  },
  {
    q: "How does the NFC tap work?",
    a: "When you or your gift maker writes the SayWith link onto any standard NFC tag or smart keychain (takes 5 seconds with free phone apps like NFC Tools), simply hold the top of your iPhone or back of your Android near it. A notification banner instantly pops up on your screen. Tap it, and your personalized story opens immediately in the browser."
  },
  {
    q: "Does the recipient need to download an app?",
    a: "No! Absolutely zero apps are required for anyone viewing or scanning. It opens natively in Safari, Chrome, or your phone's default browser on both iOS and Android in seconds."
  },
  {
    q: "What can I put on my personalized template?",
    a: "You can include your own video clip or photo, a custom audio track (your voice message, favorite song, or audio note), and personal text or lyrics with synchronized subtitle captions."
  },
  {
    q: "How do I order after choosing a template?",
    a: "Simply browse our 50+ templates, choose the one you love, and click any 'Message to Order' button. Message us directly on your preferred chat app (Messenger, WhatsApp, or Instagram) with your template number, photos/video, music choice, and message—we craft your digital presence and deliver your link and styled QR photo!"
  },
  {
    q: "Can I update the video or message after it is created?",
    a: "Yes! Your SayWith link is completely dynamic. If you want to change the video, swap photos, or update the letter for a future anniversary, you can update your memory anytime without needing to change your physical keychain or QR code."
  },
  {
    q: "How long does my digital memory stay online?",
    a: "Your digital memory is stored with lifetime cloud hosting and unlimited taps/scans. There are zero monthly subscription fees or expiration dates."
  },
  {
    q: "Can you create a 100% custom template or bespoke design for me?",
    a: "Yes, absolutely! In addition to our 50+ ready-made templates, we offer bespoke custom template design services. Whether you want custom particle animations, specific wedding color palettes and monograms, an interactive anniversary milestone timeline, or branded corporate themes, message us and we'll craft a one-of-a-kind digital experience for your keepsake."
  }
];

export default function SayWithLandingPage() {
  const [siteConfig, setSiteConfig] = useState(siteConfigDefault);
  const [templates, setTemplates] = useState<TemplateItem[]>(templatesDefault as TemplateItem[]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPlayingHero, setIsPlayingHero] = useState<boolean>(true);

  // Full Screen Template Preview Lightbox Modal
  const [fullScreenTemplate, setFullScreenTemplate] = useState<TemplateItem | null>(null);

  // Expandable Templates Catalog State (clean initial UI vs full 50 catalog view)
  const [isTemplatesExpanded, setIsTemplatesExpanded] = useState<boolean>(false);

  // Runtime live fetch from public/data JSON files so edits in public/data update immediately
  useEffect(() => {
    fetch("/data/site-config.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSiteConfig(data);
      })
      .catch(() => { });

    fetch("/data/templates.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setTemplates(data);
      })
      .catch(() => { });
  }, []);

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `#${t.num}`.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const isFiltering = searchQuery.trim() !== "" || selectedCategory !== "All";
  const displayedTemplates = (isTemplatesExpanded || isFiltering)
    ? filteredTemplates
    : filteredTemplates.slice(0, 12);

  const hero = siteConfig.hero || siteConfigDefault.hero;
  const socials = siteConfig.socials || siteConfigDefault.socials;
  const ordering = (siteConfig as Record<string, unknown>).ordering as
    | { directChatUrl?: string; platformName?: string; buttonLabel?: string }
    | undefined;
  const customDesign = ((siteConfig as Record<string, unknown>).customDesign ||
    (siteConfigDefault as Record<string, unknown>).customDesign) as
    | {
        bannerImageUrl?: string;
        badge?: string;
        title?: string;
        subtitle?: string;
        description?: string;
        features?: string[];
        ctaText?: string;
      }
    | undefined;

  // Direct link generator to configured messaging platform (e.g. Messenger, WhatsApp, or Instagram)
  const getOrderLink = (template?: TemplateItem, useCaseName?: string) => {
    const directUrl =
      ordering?.directChatUrl ||
      socials?.messengerUrl ||
      socials?.whatsappUrl ||
      "https://messenger.com";

    // If configured as WhatsApp, append pre-filled message text automatically
    if (directUrl.includes("wa.me") || directUrl.includes("whatsapp.com")) {
      const text = template
        ? `Hi SayWith! I want to order a custom digital presence with Template #${template.num} (${template.name}).`
        : useCaseName
        ? `Hi SayWith! I want to order a custom digital presence for ${useCaseName}.`
        : "Hi SayWith! I want to inquire about ordering a custom digital presence.";
      const separator = directUrl.includes("?") ? "&" : "?";
      return `${directUrl}${separator}text=${encodeURIComponent(text)}`;
    }

    return directUrl;
  };

  return (
    <div className="bg-background text-foreground antialiased selection:bg-primary selection:text-white" suppressHydrationWarning>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <nav className="container mx-auto flex items-center justify-between p-4 px-6">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-primary group">
            <Image
              src="/icons/icon-192x192.png"
              alt="SayWith Logo"
              width={34}
              height={34}
              priority
              className="rounded-lg group-hover:scale-105 transition-transform"
            />
            <span className="tracking-tight text-foreground font-headline">Say<span className="text-primary">With</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-5 text-sm font-medium">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#nfc-feature" className="hover:text-cyan-400 transition-colors flex items-center gap-1 font-semibold text-cyan-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              NFC Tap
            </a>
            <a href="#mockups" className="hover:text-primary transition-colors">Examples & Mockups</a>
            <a href="#templates" className="hover:text-primary transition-colors">50+ Templates</a>
            <a href="#custom-service" className="hover:text-primary transition-colors flex items-center gap-1 font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Custom Design
            </a>
            <a href="#use-cases" className="hover:text-primary transition-colors">Use Cases</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="#templates">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-2">
                <Eye className="w-4 h-4 text-primary" />
                Templates
              </Button>
            </a>
            <a
              href={getOrderLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="gap-2 shadow-lg shadow-primary/20"
              >
                <MessageCircle className="w-4 h-4" />
                {ordering?.buttonLabel || "Contact to Order"}
              </Button>
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section with Visible Background Image */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-12 md:py-20 px-4">
          {/* Visible Hero Background with High Priority per Modern Web Guidance */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src={hero.bgImageUrl || "/images/hero-bg.png"}
              alt="SayWith Memory Keepsake Atmosphere"
              fill
              priority
              sizes="100vw"
              className="transition-opacity duration-700"
              style={{
                objectFit: "cover",
                opacity: hero.bgImageOpacity ?? 0.9
              }}
            />
            {/* Soft Vignette Overlay so hero background is vividly visible while text is easy to read */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
            {/* Top Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs md:text-sm font-semibold mb-6 backdrop-blur-md shadow-md">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>{hero.badgeText || "⚡ NFC Instant Tap & Styled QR Code Photo"}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-center drop-shadow-lg text-white">
              {hero.mainTitle || "The Digital Heart of Your Keepsake."} <br />
              <span className="bg-gradient-to-r from-blue-300 via-primary to-cyan-200 bg-clip-text text-transparent">
                {hero.highlightTitle || "Tap with NFC. Scan with Styled QR."}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-2xl mx-auto text-center text-sm sm:text-base md:text-lg text-slate-200 font-light leading-relaxed drop-shadow">
              {hero.description}
            </p>

            {/* NFC Tap Explainer Highlight Banner */}
            <div className="mt-6 max-w-2xl mx-auto rounded-2xl bg-slate-900/90 border border-cyan-500/40 p-3.5 px-5 flex items-center justify-center gap-3.5 backdrop-blur-md shadow-xl">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium text-left">
                <strong className="text-cyan-300 font-bold">NFC Instant Tap Feature:</strong> Hold any phone near the keychain to launch your interactive story in 1 second. <span className="text-primary font-semibold">Zero app downloads or logins required.</span>
              </p>
            </div>

            {/* Technology Pill Bar */}
            <div className="mt-5 flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm text-slate-200">
              <a href="#nfc-feature" className="inline-flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-cyan-500/40 text-cyan-300 backdrop-blur-sm hover:bg-cyan-950/60 transition-colors">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>NFC Instant Tap (How It Works)</span>
              </a>
              <span className="inline-flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-700/80 backdrop-blur-sm">
                <QrCode className="w-4 h-4 text-emerald-400" />
                Custom Styled QR Code Photo
              </span>
              <a href="#custom-service" className="inline-flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-primary/40 text-primary-foreground backdrop-blur-sm hover:bg-primary/20 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Custom Template Design Available</span>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="#templates" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base gap-2 px-8 py-6 shadow-xl shadow-primary/30">
                  <Eye className="w-5 h-5" />
                  Explore 50+ Templates
                </Button>
              </a>
              <a
                href={getOrderLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base gap-2 px-8 py-6 bg-slate-900/80 border-slate-700 hover:bg-slate-800 text-white backdrop-blur-sm"
                >
                  <MessageCircle className="w-5 h-5 text-primary" />
                  {ordering?.buttonLabel || "Contact Us to Order"}
                </Button>
              </a>
            </div>

            {/* HERO VISUAL MOCKUP: Example Application (Acrylic Keychain + Styled QR Photo + Phone Screen) */}
            <div className="mt-14 max-w-4xl mx-auto">
              <div className="relative rounded-3xl bg-slate-950/75 border border-slate-800 p-6 md:p-10 shadow-2xl backdrop-blur-md overflow-hidden">
                {/* Decorative background grid and glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Example Real-World Application</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Physical Keepsake + SayWith Digital Presence</h3>
                  <p className="text-xs md:text-sm text-slate-300 mt-1">
                    Use your digital presence in an acrylic keychain with an NFC chip, or with your custom styled QR photo card
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Physical Application Example Mockup */}
                  <div className="md:col-span-5 flex flex-col items-center gap-6">
                    {/* Example Acrylic Keychain */}
                    <div className="relative flex flex-col items-center group">
                      {/* Metal Ring and Chain */}
                      <div className="w-9 h-9 rounded-full border-4 border-slate-300 dark:border-slate-500 shadow-md flex items-center justify-center -mb-2 z-20">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600"></div>
                      </div>
                      <div className="w-1.5 h-4 bg-gradient-to-b from-slate-400 to-slate-500 rounded -mb-1 z-20"></div>

                      {/* Acrylic Keychain Capsule */}
                      <div className="w-48 sm:w-56 h-64 rounded-3xl bg-gradient-to-b from-white/30 via-white/10 to-white/5 border-2 border-white/40 p-3 shadow-2xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        {/* Acrylic Gloss Reflection Highlight */}
                        <div className="absolute -top-12 -left-12 w-36 h-36 bg-gradient-to-br from-white/40 to-transparent rotate-45 rounded-full pointer-events-none"></div>
                        
                        {/* Top: NFC Loop Indicator */}
                        <div className="flex justify-between items-center z-10">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/30 text-white border border-primary/40">
                            <Radio className="w-2.5 h-2.5 animate-pulse text-primary" />
                            NFC Chip Tap
                          </span>
                          <span className="text-[10px] text-slate-300 font-mono">NTAG215</span>
                        </div>

                        {/* Center Photo Inside Keychain */}
                        <div className="relative rounded-2xl overflow-hidden h-36 bg-gradient-to-br from-rose-500/80 via-purple-600/80 to-blue-600/80 p-3 flex flex-col justify-between text-white shadow-inner">
                          {hero.keychainPhotoUrl ? (
                            <img
                              src={hero.keychainPhotoUrl}
                              alt="Custom Keychain Photo"
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5 z-10">
                                <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300 animate-pulse" />
                                <span className="text-[10px] font-semibold tracking-wide">Always Together</span>
                              </div>
                              
                              {/* Golden NFC Antenna Coil Illustration */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                <div className="w-24 h-24 rounded-full border border-amber-300/80 flex items-center justify-center">
                                  <div className="w-16 h-16 rounded-full border border-amber-300/60 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full border border-amber-300/40"></div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          <div className="z-10">
                            <p className="text-[11px] font-bold">2nd Anniversary Keepsake</p>
                            <p className="text-[9px] opacity-80">Hold Phone Here to Tap</p>
                          </div>
                        </div>

                        {/* Bottom Tag */}
                        <div className="text-center z-10 py-1">
                          <span className="text-[11px] font-medium text-white">Example Keychain Usage</span>
                        </div>
                      </div>
                    </div>

                    {/* Styled QR Code Photo Card Mockup */}
                    <div className="w-48 sm:w-56 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex items-center gap-3">
                      {/* Stylized QR Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-cyan-500/30 border border-primary/40 p-1.5 flex flex-col items-center justify-center relative shrink-0 overflow-hidden">
                        {hero.styledQrPhotoUrl ? (
                          <img
                            src={hero.styledQrPhotoUrl}
                            alt="Styled QR Photo"
                            className="w-full h-full object-cover rounded-lg"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <>
                            <QrCode className="w-8 h-8 text-primary" />
                            <span className="text-[7px] text-primary font-bold mt-0.5">SCAN</span>
                          </>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">Styled QR Photo</p>
                        <p className="text-[10px] text-slate-300 leading-tight mt-0.5">Printable custom photo card</p>
                        <span className="inline-block mt-1 text-[9px] text-emerald-400 font-medium">Any camera can scan</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Animated NFC Waves & Connection Indicator */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center py-4">
                    <div className="flex md:flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center animate-pulse">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div className="flex md:flex-col gap-1 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/80"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                      </div>
                      <span className="text-[10px] font-bold text-primary text-center px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                        INSTANT TAP
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Smartphone Digital Story Mockup */}
                  <div className="md:col-span-5 flex justify-center">
                    <div className="w-64 sm:w-72 rounded-[36px] bg-slate-900 border-[6px] border-slate-700/80 shadow-2xl overflow-hidden p-2 relative text-white">
                      {/* Phone Speaker Pill / Dynamic Island */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-800 mr-2"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
                      </div>

                      {/* Phone Screen Display */}
                      <div className="rounded-[28px] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 p-4 pt-8 flex flex-col justify-between h-[420px] relative">
                        {/* Status bar */}
                        <div className="flex justify-between items-center text-[10px] opacity-70 mb-3 px-1">
                          <span>9:41</span>
                          <span className="text-[9px] bg-primary/30 text-primary-foreground px-1.5 py-0.5 rounded-full">
                            Template #12
                          </span>
                          <span>5G 100%</span>
                        </div>

                        {/* Template Story Player Card */}
                        <div className="relative rounded-2xl overflow-hidden h-44 bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 p-3 flex flex-col justify-between shadow-lg">
                          {hero.phonePreviewMediaUrl ? (
                            hero.phonePreviewMediaType === "video" ? (
                              <video
                                src={hero.phonePreviewMediaUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={hero.phonePreviewMediaUrl}
                                alt="Phone Preview Media"
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            )
                          ) : (
                            /* Floating Particles Animation Default */
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                              <Heart className="w-3.5 h-3.5 text-white/50 absolute top-4 left-6 animate-bounce" />
                              <Sparkles className="w-3.5 h-3.5 text-amber-200/70 absolute top-8 right-6 animate-pulse" />
                              <Heart className="w-3 h-3 text-pink-200/60 absolute bottom-6 right-8 animate-ping" />
                            </div>
                          )}

                          <div className="flex justify-between items-center z-10">
                            <span className="text-[9px] font-semibold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                              SayWith Memories
                            </span>
                            <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                              HD Video
                            </span>
                          </div>

                          <div className="z-10">
                            <p className="text-xs font-bold drop-shadow">Golden Hour Serenade</p>
                            <p className="text-[10px] opacity-90 drop-shadow">Happy Anniversary My Love</p>
                          </div>
                        </div>

                        {/* Synchronized Audio Player Pill */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 mt-2 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setIsPlayingHero(!isPlayingHero)}
                                className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform shrink-0"
                                aria-label={isPlayingHero ? "Pause audio mockup" : "Play audio mockup"}
                              >
                                {isPlayingHero ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                              </button>
                              <div className="min-w-0">
                                <p className="text-[11px] font-semibold truncate leading-tight">{hero.musicTitle || "Until I Found You"}</p>
                                <p className="text-[9px] text-slate-300 truncate">{hero.musicSubtitle || "Synchronized music track"}</p>
                              </div>
                            </div>

                            {/* Animated Equalizer Waveform */}
                            <div className="flex items-end gap-0.5 h-4 px-1">
                              <span className={cn("w-1 bg-cyan-400 rounded-full transition-all", isPlayingHero ? "h-3 animate-pulse" : "h-1")}></span>
                              <span className={cn("w-1 bg-primary rounded-full transition-all", isPlayingHero ? "h-4 animate-bounce" : "h-1.5")}></span>
                              <span className={cn("w-1 bg-rose-400 rounded-full transition-all", isPlayingHero ? "h-2.5 animate-pulse" : "h-1")}></span>
                              <span className={cn("w-1 bg-amber-400 rounded-full transition-all", isPlayingHero ? "h-3.5 animate-bounce" : "h-2")}></span>
                            </div>
                          </div>
                        </div>

                        {/* Personal Letter Text Preview */}
                        <div className="bg-black/30 rounded-xl p-2.5 mt-2 text-[10px] text-slate-200 leading-relaxed border border-white/5 italic">
                          &ldquo;{hero.letterText || "Every single day with you is a gift I never take for granted. Forever and always. ❤️"}&rdquo;
                        </div>

                        {/* Bottom Bar */}
                        <div className="mt-2 text-center text-[9px] text-slate-400">
                          <span>Plays in mobile Safari & Chrome • Zero app</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated NFC Instant Tap Feature Spotlight Section */}
        <section id="nfc-feature" className="py-20 bg-gradient-to-b from-slate-950 via-slate-900/90 to-background border-y border-cyan-800/40 relative overflow-hidden">
          {/* Glowing Ambient Backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs md:text-sm font-semibold mb-4 shadow-sm">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>NFC Instant Tap Feature</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-white tracking-tight">
                How NFC Tap Works <span className="text-cyan-400">Like Magic</span>
              </h2>
              <p className="mt-3 text-base sm:text-lg text-slate-300">
                No apps to download. No accounts to register. Simply hold your phone to the keychain, and your personalized digital memory instantly springs to life.
              </p>
            </div>

            {/* 3 Step NFC Flow with Styled QR Bonus */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/30 p-6 flex flex-col justify-between hover:border-cyan-400/60 transition-all shadow-xl group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Step 1 • Hardware
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Embedded NFC Chip</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Inside the acrylic keychain or token blank sits an ultra-durable NTAG215 microchip programmed with your permanent SayWith link. It requires zero batteries and lasts for decades.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-cyan-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Battery-free & lifetime durable</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl bg-slate-900/80 border border-primary/40 p-6 flex flex-col justify-between hover:border-primary transition-all shadow-xl group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-primary/20 text-primary-foreground border border-primary/30">
                      Step 2 • 1-Second Tap
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Hold Phone Near It</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Touch the top of any iPhone (iPhone XS or newer) or the back of any Android phone near the keychain. A native banner immediately illuminates on the screen without unlocking any app.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-primary font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Works natively on iOS & Android</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl bg-slate-900/80 border border-emerald-500/30 p-6 flex flex-col justify-between hover:border-emerald-400/60 transition-all shadow-xl group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                      <Film className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Step 3 • Experience
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Instant Story Plays</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Tap the notification, and Safari or Chrome opens directly into your personalized full-screen story. Your video, music note, subtitles, and heartfelt message play in high fidelity.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-emerald-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Synchronized music + video reel</span>
                </div>
              </div>
            </div>

            {/* Styled QR Camera Fallback Notice */}
            <div className="mt-8 rounded-2xl bg-slate-900/60 border border-slate-800 p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-primary shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Bonus: Dual Access with Styled QR Code Photo</p>
                  <p className="text-xs text-slate-400">
                    If someone has a device without NFC, our matching custom styled QR photo card can be scanned by any smartphone camera instantly.
                  </p>
                </div>
              </div>
              <a href="#templates" className="shrink-0 w-full sm:w-auto">
                <Button size="sm" variant="outline" className="w-full sm:w-auto border-cyan-500/50 text-cyan-300 hover:bg-cyan-950">
                  Browse 50+ Styles
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Examples of Physical Usage Section */}
        <section id="mockups" className="py-20 bg-secondary/30 border-y border-border/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">Real-World Examples</h2>
              <p className="text-3xl sm:text-4xl font-headline font-bold mt-2">Where You Can Use Your Digital Presence</p>
              <p className="mt-3 text-muted-foreground">
                We craft your digital story and custom styled QR photo. Here are the most popular ways customers bring it into the physical world using NFC or QR codes.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Mockup Card 1: Keychains & Bag Charms */}
              <div className="bg-background rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg group">
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-br from-blue-900/40 via-secondary to-background border border-border flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {siteConfig.showcaseMedia?.acrylicKeychainImageUrl ? (
                      <img
                        src={siteConfig.showcaseMedia.acrylicKeychainImageUrl}
                        alt="Classic Acrylic NFC Keychain"
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-24 h-32 rounded-2xl bg-white/10 dark:bg-white/5 border-2 border-white/30 backdrop-blur-sm p-2 flex flex-col justify-between items-center shadow-lg group-hover:scale-105 transition-transform">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-400"></div>
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center text-white">
                          <Heart className="w-7 h-7 fill-white" />
                        </div>
                        <div className="w-8 h-1 rounded-full bg-white/40"></div>
                      </div>
                    )}
                    <span className="absolute bottom-2 text-[10px] text-primary font-semibold bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Acrylic NFC Keychain
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mt-4">Classic Acrylic Keychain</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Insert your photo inside an acrylic keychain blank with an embedded NFC tag. Tap with any phone or scan to replay your digital memory.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Radio className="w-3.5 h-3.5" />
                  <span>NFC & Styled QR Ready</span>
                </div>
              </div>

              {/* Mockup Card 2: Custom Styled QR Code Photo */}
              <div className="bg-background rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg group">
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-br from-pink-900/30 via-secondary to-background border border-border flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {siteConfig.showcaseMedia?.styledQrCardImageUrl ? (
                      <img
                        src={siteConfig.showcaseMedia.styledQrCardImageUrl}
                        alt="Styled QR Photo Card Flatlay"
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-28 h-32 rounded-xl bg-white dark:bg-slate-900 border border-border shadow-lg p-2 flex flex-col justify-between items-center group-hover:scale-105 transition-transform">
                        <div className="w-full h-12 rounded-lg bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-[9px] text-white font-bold">
                          Couple Photo
                        </div>
                        <div className="w-12 h-12 rounded-md bg-secondary border border-border flex items-center justify-center">
                          <QrCode className="w-9 h-9 text-foreground" />
                        </div>
                        <span className="text-[8px] text-muted-foreground font-mono">SCAN ME</span>
                      </div>
                    )}
                    <span className="absolute bottom-2 text-[10px] text-rose-300 font-semibold bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Printable Photo Card
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mt-4">Styled QR Photo Card</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    We deliver a high-resolution artistic photo card featuring your portrait and a custom scannable QR code. Perfect for wallets, desks, or framed keepsakes.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Point Any Phone Camera</span>
                </div>
              </div>

              {/* Mockup Card 3: Smartphone Tapping Keychain (NFC in Action) */}
              <div className="bg-background rounded-2xl border border-cyan-500/50 p-5 flex flex-col justify-between hover:border-cyan-400 transition-all hover:shadow-xl shadow-cyan-500/10 group relative">
                <div className="absolute -top-3 right-4 bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                  NFC in Action
                </div>
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-br from-cyan-900/40 via-secondary to-background border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {siteConfig.showcaseMedia?.phoneTapImageUrl ? (
                      <img
                        src={siteConfig.showcaseMedia.phoneTapImageUrl}
                        alt="Smartphone Tapping Keychain - NFC in Action"
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-32 h-28 rounded-2xl bg-slate-900 border-2 border-slate-700 p-2 flex flex-col justify-between shadow-xl group-hover:scale-105 transition-transform">
                        <div className="w-full bg-primary/20 border border-primary/40 rounded-lg p-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-primary shrink-0" />
                          <span className="text-[8px] text-primary font-bold truncate">Open SayWith Story</span>
                        </div>
                        <div className="flex justify-center items-center py-2">
                          <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
                        </div>
                        <span className="text-[8px] text-center text-slate-400">Zero App Needed</span>
                      </div>
                    )}
                    <span className="absolute bottom-2 text-[10px] text-cyan-300 font-semibold bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      ⚡ Instant Phone Tap
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mt-4">NFC Tap in Action</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Simply hold your smartphone over the keychain. The embedded NFC antenna triggers a notification in 1 second, opening your story automatically.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>iOS & Android Native</span>
                </div>
              </div>

              {/* Mockup Card 4: Gift Packaging & Unboxing */}
              <div className="bg-background rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg group">
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-br from-amber-900/30 via-secondary to-background border border-border flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {siteConfig.showcaseMedia?.giftPackagingImageUrl ? (
                      <img
                        src={siteConfig.showcaseMedia.giftPackagingImageUrl}
                        alt="Gift Packaging & Unboxing Presentation"
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-400/40 p-2.5 flex flex-col justify-between items-center shadow-xl group-hover:scale-105 transition-transform relative">
                        <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
                          <Gift className="w-4 h-4" />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-amber-200">Pocket Token / Frame</p>
                          <p className="text-[8px] text-slate-300">Desk Photo & Token</p>
                        </div>
                        <div className="w-12 h-1 rounded-full bg-amber-400/40"></div>
                      </div>
                    )}
                    <span className="absolute bottom-2 text-[10px] text-amber-300 font-semibold bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Unboxing Experience
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mt-4">Gift Box Unboxing</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Present your keychain or styled QR photo in an elegant gift box. When they open it and tap with their phone, it delivers an unforgettable surprise.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Unforgettable Gift Surprise</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works: Selecting Template -> Digital Presence Delivered */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">The Process</h2>
              <p className="text-3xl sm:text-4xl font-headline font-bold mt-2">How We Create Your Digital Presence</p>
              <p className="mt-3 text-muted-foreground">
                We design and host your interactive digital story, providing you with your custom styled QR photo and NFC link.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-background/80 p-6 rounded-2xl border border-border/70 flex flex-col items-start relative group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  1
                </div>
                <h3 className="text-lg font-bold">Pick a Template</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Browse 50+ cinematic designs: Falling Rose Petals, Retro Vinyl, Starry Night, Polaroid, or Spotify cards.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>50+ cinematic styles</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-background/80 p-6 rounded-2xl border border-border/70 flex flex-col items-start relative group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  2
                </div>
                <h3 className="text-lg font-bold">Message Us Your Media</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send us your photos or video clip, favorite background music or voice message, and personal letter via chat.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Music className="w-3.5 h-3.5" />
                  <span>Media + audio sync</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-background/80 p-6 rounded-2xl border border-border/70 flex flex-col items-start relative group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  3
                </div>
                <h3 className="text-lg font-bold">Get Your Digital Presence</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We host your memory forever and provide your high-resolution custom styled QR photo card and NFC link.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Styled QR Photo + Link</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-background/80 p-6 rounded-2xl border border-border/70 flex flex-col items-start relative group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  4
                </div>
                <h3 className="text-lg font-bold">Use in Keychains & Gifts</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Load it onto any NFC keychain or print your styled QR photo for cards, frames, or tokens. Tap or scan anytime!
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Instant NFC & QR access</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 50+ Templates Showcase with Mobile Phone Ratio Cards & Full Screen Buttons */}
        <section id="templates" className="py-20 bg-secondary/30 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Showcase Catalog</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-headline font-bold">Explore All 50+ Templates</h2>
                <p className="mt-2 text-muted-foreground max-w-xl">
                  Shown in actual mobile phone ratio. Tap the full-screen button on any card to preview the full high-res layout or video.
                </p>
              </div>

              {/* Search input */}
              <div className="w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search template name, #, or style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap gap-2 pb-2">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold"
                      : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
              <div>
                Showing <strong className="text-foreground font-semibold">{displayedTemplates.length}</strong> of <strong className="text-foreground font-semibold">{filteredTemplates.length}</strong> templates
                {!isTemplatesExpanded && !isFiltering && filteredTemplates.length > 12 && (
                  <span className="ml-2 text-primary font-medium">(Clean view: 12 featured templates shown)</span>
                )}
              </div>
              {filteredTemplates.length > 12 && !isFiltering && (
                <button
                  onClick={() => setIsTemplatesExpanded(!isTemplatesExpanded)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  {isTemplatesExpanded ? (
                    <>
                      <span>Collapse to Clean View (12 Items)</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Expand All 50 Templates ({filteredTemplates.length} Available)</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Template Grid with Mobile Phone Ratio (aspect-[9/16]) */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedTemplates.map((template: TemplateItem) => (
                <div
                  key={template.id}
                  className="bg-background rounded-3xl border border-border/80 overflow-hidden hover:border-primary/50 transition-all hover:shadow-2xl flex flex-col p-4 group"
                >
                  {/* Top Bar with Number & Full Screen Action */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-secondary border border-border text-foreground">
                        #{template.num}
                      </span>
                      <span className="text-[11px] font-semibold text-primary">
                        {template.tag}
                      </span>
                    </div>

                    {/* Full Screen Button */}
                    <button
                      onClick={() => setFullScreenTemplate(template)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary hover:bg-primary hover:text-white transition-colors text-xs font-medium text-muted-foreground"
                      title="View full screen mobile preview"
                      aria-label={`View ${template.name} full screen`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Full Screen</span>
                    </button>
                  </div>

                  {/* MOBILE PHONE FRAME CONTAINER (aspect-[9/16] Mobile Ratio) */}
                  <div className="relative w-full aspect-[9/16] rounded-[24px] bg-slate-950 border-[4px] border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between group-hover:border-primary/60 transition-colors">
                    {/* Phone Top Speaker Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-black rounded-full z-20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800 mr-1.5"></div>
                      <div className="w-1 h-1 rounded-full bg-blue-900"></div>
                    </div>

                    {/* Full Screen Overlay Button inside phone screen */}
                    <button
                      onClick={() => setFullScreenTemplate(template)}
                      className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-primary text-white backdrop-blur-md flex items-center justify-center transition-all shadow-md group-hover:scale-110"
                      title="Expand full screen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Phone Screen Media Content (Dynamic Image or Video) */}
                    {template.previewUrl ? (
                      template.previewType === "video" ? (
                        <div className="relative w-full h-full bg-black">
                          <video
                            src={template.previewUrl}
                            poster={template.posterUrl || undefined}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-[9px] text-white backdrop-blur-sm">
                            <Film className="w-2.5 h-2.5 text-primary" />
                            <span>Video Preview</span>
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
                      /* Stylized Mobile Template Mockup (When screenshot URL is yet to be set) */
                      <div className={cn("w-full h-full p-4 pt-8 flex flex-col justify-between bg-gradient-to-br text-white relative", template.accent)}>
                        <div className="flex justify-between items-center text-[10px] opacity-75">
                          <span>9:41</span>
                          <span className="font-semibold uppercase tracking-wider text-[9px] bg-black/30 px-2 py-0.5 rounded-full">
                            {template.category}
                          </span>
                        </div>

                        {/* Template Center Visual */}
                        <div className="my-auto text-center p-3 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10">
                          <Sparkles className="w-6 h-6 mx-auto mb-2 text-white/80 animate-pulse" />
                          <h4 className="font-headline font-bold text-lg leading-tight">{template.name}</h4>
                          <p className="text-[10px] text-white/80 mt-1.5 leading-relaxed line-clamp-3">
                            {template.desc}
                          </p>
                        </div>

                        {/* Mobile Bottom Audio & Letter Simulation */}
                        <div className="space-y-1.5">
                          <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1.5 truncate">
                              <Music className="w-3 h-3 text-cyan-300 shrink-0" />
                              <span className="truncate">Music Sync Ready</span>
                            </div>
                            <span className="text-[8px] bg-white/20 px-1.5 py-0.5 rounded">NFC</span>
                          </div>
                          <p className="text-[8px] text-center text-white/70">Tap phone to replay</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Details & Direct Order CTA */}
                  <div className="mt-4 flex-1 flex flex-col justify-between px-1">
                    <div>
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-headline font-bold text-base text-foreground group-hover:text-primary transition-colors">
                          {template.name}
                        </h4>
                        <span className="text-[11px] text-muted-foreground uppercase font-medium">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                        {template.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-primary font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>NFC & Styled QR</span>
                      </span>
                      <a
                        href={getOrderLink(template)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        Inquire with This <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Expand / Collapse Control & Action Bar */}
            <div className="mt-14 rounded-2xl bg-secondary/40 border border-border/80 p-6 flex flex-col items-center justify-center gap-5 text-center">
              <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl">
                {filteredTemplates.length > 12 && !isFiltering && (
                  <Button
                    size="lg"
                    variant={isTemplatesExpanded ? "outline" : "default"}
                    onClick={() => {
                      setIsTemplatesExpanded(!isTemplatesExpanded);
                      if (isTemplatesExpanded) {
                        document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="gap-2 px-8 py-6 text-sm font-semibold shadow-lg shadow-primary/20 flex-1 sm:flex-initial"
                  >
                    {isTemplatesExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Collapse to Clean View (Show Top 12)
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Expand & View All {filteredTemplates.length} Templates
                      </>
                    )}
                  </Button>
                )}

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="gap-2 px-6 py-6 text-sm font-medium border-border/80 hover:bg-secondary flex-1 sm:flex-initial"
                  title="Scroll back to top of template catalog"
                >
                  <ChevronUp className="w-4 h-4 text-primary" />
                  Top of Templates
                </Button>

                <a href="#custom-service" className="flex-1 sm:flex-initial">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="gap-2 px-6 py-6 text-sm font-medium hover:text-primary"
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    Bespoke Custom Service ↓
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  Showing {displayedTemplates.length} of {filteredTemplates.length} templates
                </span>
                <span>•</span>
                <span>Lifetime Cloud Hosting</span>
                <span>•</span>
                <span>Unlimited NFC Taps & Styled QR Scans</span>
              </div>
            </div>

          </div>
        </section>

        {/* Dedicated Bespoke & Custom Template Design Service Section */}
        <section id="custom-service" className="py-24 bg-gradient-to-b from-secondary/40 via-background to-secondary/30 border-t border-border/50 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground border border-primary/40 text-xs md:text-sm font-semibold mb-4 shadow-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>{customDesign?.badge || "1-on-1 Bespoke Service"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight text-white">
                {customDesign?.title || "Bespoke & Custom Template Design Service"}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                {customDesign?.description ||
                  "Have a unique creative vision? In addition to our 50+ templates, our design team builds 100% custom, exclusive digital experiences for weddings, anniversaries, proposals, brand launches, and VIP gifts."}
              </p>
            </div>

            {/* Custom Design Feature Showcase with High-Res Banner */}
            <div className="mt-14 rounded-3xl bg-slate-950/80 border border-primary/30 shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left: Custom Design Banner Image */}
                <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                  <div className="aspect-[16/10] sm:aspect-[16/9] w-full relative">
                    <img
                      src={customDesign?.bannerImageUrl || "/images/custom-template-banner.jpg"}
                      alt="SayWith Bespoke Custom Template Design Showcase"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div>
                        <p className="text-sm font-bold drop-shadow">100% Exclusive Design</p>
                        <p className="text-xs text-slate-300 drop-shadow">Made uniquely for you & your loved one</p>
                      </div>
                      <span className="text-[11px] font-mono bg-primary/80 px-2.5 py-1 rounded-full text-white backdrop-blur-sm">
                        Bespoke
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: What You Get in Custom Design */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Tailored Digital Magic Crafted From Scratch
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                      Collaborate directly with our design team. We write personalized code, animate custom particle effects, integrate your favorite songs, and format your styled QR photo card to match your exact celebration.
                    </p>

                    <div className="space-y-3.5">
                      {(
                        customDesign?.features || [
                          "Custom particle animations (Sakura petals, stardust, fireworks, glowing hearts)",
                          "Bespoke typography, wedding monograms & luxury color palettes",
                          "Interactive multi-scene timeline, photo gallery & audio/video sync",
                          "Direct designer collaboration via chat until you're 100% in love",
                          "High-resolution styled QR photo & ready-to-write NFC instant tap link included"
                        ]
                      ).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm text-slate-200">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
                    <a
                      href={getOrderLink(undefined, "Bespoke Custom Template Design")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex-1"
                    >
                      <Button size="lg" className="w-full gap-2 py-6 text-base shadow-xl shadow-primary/30">
                        <Sparkles className="w-5 h-5" />
                        {customDesign?.ctaText || "Request a Custom Design"}
                      </Button>
                    </a>
                    <a href="#templates" className="w-full sm:w-auto">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto py-6 border-slate-700 text-slate-300 hover:bg-slate-800">
                        View 50+ Ready Catalog
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Use Cases Showcase */}
        <section id="use-cases" className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>Example Applications</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-headline font-bold">Ways to Use Your SayWith Presence</h2>
              <p className="mt-3 text-muted-foreground">
                We produce the digital experience and custom styled QR photo. Here are popular ways you or your gift maker can bring it into the physical world.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {exampleUseCases.map((useCase) => (
                <div
                  key={useCase.id}
                  className={cn(
                    "rounded-3xl p-8 flex flex-col justify-between transition-all relative",
                    useCase.highlight
                      ? "bg-secondary border-2 border-primary shadow-2xl shadow-primary/10"
                      : "bg-secondary/40 border border-border"
                  )}
                >
                  {useCase.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                      Top Gift Idea
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {useCase.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mt-4">{useCase.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{useCase.tagline}</p>
                    
                    <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-background/80 border border-border text-xs font-medium text-foreground">
                      <Gift className="w-3.5 h-3.5 text-primary" />
                      <span>{useCase.format}</span>
                    </div>

                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                      {useCase.description}
                    </p>

                    <ul className="mt-6 space-y-3 text-sm">
                      {useCase.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-xs sm:text-sm">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <a
                      href={getOrderLink(undefined, useCase.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button
                        className={cn(
                          "w-full py-5 text-sm font-semibold gap-2",
                          useCase.highlight ? "shadow-lg shadow-primary/25" : ""
                        )}
                        variant={useCase.highlight ? "default" : "outline"}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Inquire for This Idea
                      </Button>
                    </a>
                    <p className="text-[11px] text-center text-muted-foreground mt-2">
                      Includes lifetime cloud link & custom styled QR photo
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Occasions / Target Audience */}
        <section id="occasions" className="py-20 bg-secondary/30 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">Perfect Occasions</h2>
              <p className="text-3xl sm:text-4xl font-headline font-bold mt-2">Who is SayWith Made For?</p>
              <p className="mt-3 text-muted-foreground">
                SayWith turns simple objects into emotional heirlooms that people treasure every single day.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
              {occasions.map((occ, idx) => (
                <div key={idx} className="bg-background p-8 rounded-2xl border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <occ.icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/20">
                        {occ.badge}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mt-6">{occ.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {occ.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/40 text-xs text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <span>{occ.example}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Order / Contact Us Showcase Section */}
        <section id="contact" className="py-20">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Easy Ordering Process</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-headline font-bold">
              Ready to Order? Message Us Directly.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              We make the ordering process effortless. Pick your favorite template from our showcase, then message us on your preferred chat app to receive your custom digital presence and styled QR photo!
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="bg-secondary/40 p-6 rounded-2xl border border-border">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center mb-3">
                  A
                </span>
                <h4 className="font-bold text-base">1. Choose a Template</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Browse our 50+ templates and note the template name or number you want for your memory story.
                </p>
              </div>

              <div className="bg-secondary/40 p-6 rounded-2xl border border-border">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center mb-3">
                  B
                </span>
                <h4 className="font-bold text-base">2. Send Us a Message</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Reach out on Messenger, Instagram, or WhatsApp. Tell us your chosen template and how you plan to use it (keychain, gift card, etc.).
                </p>
              </div>

              <div className="bg-secondary/40 p-6 rounded-2xl border border-border">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center mb-3">
                  C
                </span>
                <h4 className="font-bold text-base">3. Send Media & Get Link</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Send your photos, video clip, song title, or letter. We deliver your hosted digital link and custom styled QR photo!
                </p>
              </div>
            </div>

            {/* Direct Messaging Platform Links */}
            <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
              <a
                href={socials.messengerUrl || "https://messenger.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full sm:w-auto gap-2 px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  <MessageCircle className="w-5 h-5" />
                  Chat on Messenger
                </Button>
              </a>

              <a
                href={socials.instagramUrl || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-6 py-6 border-pink-500/40 text-pink-500 hover:bg-pink-500/10">
                  <Instagram className="w-5 h-5" />
                  Message on Instagram
                </Button>
              </a>

              {socials.whatsappUrl && (
                <a
                  href={getOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 px-6 py-6 border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10">
                    <Smartphone className="w-5 h-5" />
                    Chat on WhatsApp
                  </Button>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-secondary/30 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-4xl" aria-labelledby="faq-heading">
            <div className="text-center max-w-2xl mx-auto">
              <h2 id="faq-heading" className="text-xs uppercase tracking-widest text-primary font-semibold">Common Questions</h2>
              <p className="text-3xl sm:text-4xl font-headline font-bold mt-2">Everything You Need to Know</p>
              <p className="mt-3 text-muted-foreground">
                How our digital presence, styled QR code photos, and physical NFC applications work together.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-background rounded-2xl border border-border/80 p-5 transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer font-bold text-base sm:text-lg select-none list-none text-foreground hover:text-primary transition-colors">
                    <span>{faq.q}</span>
                    <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 ml-4 group-open:rotate-180 transition-transform">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </summary>
                  <div className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed pt-3 border-t border-border/50">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FULL SCREEN TEMPLATE PREVIEW MODAL */}
      <Dialog open={!!fullScreenTemplate} onOpenChange={(open) => !open && setFullScreenTemplate(null)}>
        <DialogContent className="sm:max-w-xl max-h-[95vh] overflow-y-auto bg-slate-950 border border-slate-800 p-6 text-white rounded-3xl">
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
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-900 rounded-full z-20"></div>

                {fullScreenTemplate.previewUrl ? (
                  fullScreenTemplate.previewType === "video" ? (
                    <video
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
                  <div className={cn("w-full h-full p-6 pt-10 flex flex-col justify-between bg-gradient-to-br text-white", fullScreenTemplate.accent)}>
                    <div className="flex justify-between items-center text-xs opacity-75">
                      <span>9:41</span>
                      <span className="font-mono">SayWith</span>
                    </div>

                    <div className="my-auto text-center p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 text-white/90 animate-pulse" />
                      <h4 className="font-headline font-bold text-xl">{fullScreenTemplate.name}</h4>
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

      {/* Footer */}
      <footer className="bg-secondary/60 py-12 border-t border-border/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/icons/icon-192x192.png" alt="SayWith Logo" width={32} height={32} className="rounded-lg" />
              <span className="font-headline font-bold text-lg">SayWith</span>
              <span className="text-xs text-muted-foreground">Digital Presence for Smart NFC & QR Keepsakes</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
              <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
              <a href="#nfc-feature" className="hover:text-cyan-400 text-cyan-400 font-semibold transition-colors">NFC Tap</a>
              <a href="#mockups" className="hover:text-primary transition-colors">Mockups & Examples</a>
              <a href="#templates" className="hover:text-primary transition-colors">50+ Templates</a>
              <a href="#custom-service" className="hover:text-primary text-primary font-semibold transition-colors">Custom Design</a>
              <a href="#use-cases" className="hover:text-primary transition-colors">Use Cases</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact to Order</a>
              <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            </div>

            <div className="flex justify-center items-center gap-3">
              {Object.entries(socialIcons).map(([name, Icon]) => {
                const socialUrl =
                  name === "messenger"
                    ? socials.messengerUrl
                    : name === "instagram"
                    ? socials.instagramUrl
                    : socials.facebookUrl || `https://${name}.com`;
                return (
                  <a
                    key={name}
                    href={socialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name.charAt(0).toUpperCase() + name.slice(1)}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full hover:bg-secondary"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> SayWith. All rights reserved. The digital presence provider for NFC tap & styled QR code photo memories.
          </div>
        </div>
      </footer>

      {/* Floating Sticky Quick-Navigation Pill when full catalog is expanded */}
      {isTemplatesExpanded && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 bg-slate-950/90 border border-primary/50 text-white rounded-full p-2 pl-4 pr-2.5 shadow-2xl backdrop-blur-md">
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
              Catalog: <strong className="text-primary">{displayedTemplates.length}</strong> Templates
            </span>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <button
              onClick={() => {
                setIsTemplatesExpanded(false);
                document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Collapse to 12</span>
            </button>
            <button
              onClick={() => {
                document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary/90 text-white font-medium transition-colors shadow-md cursor-pointer"
              title="Scroll to top of templates"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Top ↑</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
