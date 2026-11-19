"use client";

import React, { useState, useId } from "react";
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
  ArrowRight,
  ShieldCheck,
  Flame,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  MessageCircle,
  Copy,
  Check,
  Radio,
  Layers,
  Box,
  Camera,
  Play,
  Pause,
  Volume2,
  Send,
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
  TEMPLATE_CATALOG,
  TEMPLATE_CATEGORIES,
  type TemplateItem
} from "@/data/templateCatalog";

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
    description: "Gift your partner a physical keychain linked to 'your song', love letters, and favorite video clips.",
    example: "Template: Cascading Rose Petals & Spotify Vibe Card"
  },
  {
    icon: Clock,
    title: "Long-Distance Love",
    badge: "Emotional Keepsake",
    description: "Keep each other close across miles. Tap the token whenever you miss them to hear their voice and video.",
    example: "Template: Love Letter Wax Seal & Midnight Serenade"
  },
  {
    icon: Flame,
    title: "Birthdays & Milestones",
    badge: "Unforgettable Gift",
    description: "Ditch ordinary paper greeting cards. Hand them a custom keepsake token loaded with memorable footage.",
    example: "Template: Golden Hour Glow & Hollywood Premiere"
  },
  {
    icon: Sparkles,
    title: "Memorials & Tributes",
    badge: "Forever Cherished",
    description: "Preserve the precious laughter, voice, and smile of a loved one or pet close to your heart on a durable keepsake.",
    example: "Template: Cosmic Galaxy Night & Velvet Charcoal"
  }
];

const keepsakeStyles = [
  {
    id: "acrylic-keychain",
    name: "Classic Acrylic NFC Keychain",
    tagline: "Everyday memory companion with high-gloss finish",
    format: "Crystal Clear Acrylic",
    badge: "Bestseller",
    description: "Our signature double-sided acrylic keepsake. Holds an embedded NFC microchip on one side and your vibrant styled QR code photo on the other.",
    features: [
      "Built-in NTAG213 / NTAG215 NFC smart chip",
      "Scratch-resistant crystal clear acrylic body",
      "High-resolution custom styled QR code photo insert",
      "Lifetime unlimited digital taps & scans",
      "Protective gift pouch included"
    ],
    highlight: true
  },
  {
    id: "couples-set",
    name: "Couples Matching Set (2x Keychains)",
    tagline: "For two hearts sharing one cherished memory",
    format: "Synchronized Dual Pair",
    badge: "Couples Favorite",
    description: "Two matching physical keychains linked to the same shared memory reel, special song, and heartfelt letters. One for you, one for your love.",
    features: [
      "Two synchronized NFC smart keychains",
      "Custom couple photo with matching styled QR photo",
      "Linked to shared video reel, music & message",
      "Dual-sided: Instant NFC tap + styled QR photo scan",
      "Premium gift packaging ready to present"
    ],
    highlight: false
  },
  {
    id: "memory-token",
    name: "Pocket Keepsake Token & Photo Card",
    tagline: "Slim memory token for wallets, bags, or desks",
    format: "Pocket Token + Styled QR Card",
    badge: "Sleek & Portable",
    description: "A sleek palm-sized smart token with embedded NFC antenna, accompanied by a wallet-sized styled QR photo card to keep memories always within reach.",
    features: [
      "Precision durable pocket token with embedded NFC",
      "Paired wallet-sized styled QR photo print card",
      "Weather-resistant build crafted to last for years",
      "Works with all modern iPhone and Android smartphones",
      "Velvet keepsake pouch included"
    ],
    highlight: false
  }
];

const faqs = [
  {
    q: "How does the NFC tap work?",
    a: "Every SayWith keepsake has a built-in NFC (Near Field Communication) chip. Simply hold the top of your iPhone or back of your Android phone near the keychain. A notification banner instantly pops up on your screen. Tap it, and your personalized cinematic story opens immediately in the browser."
  },
  {
    q: "What is the styled QR code photo?",
    a: "Instead of an ordinary black-and-white barcode, we design a custom styled QR code photo. It features your own photo, beautiful borders, and artistic design accents with a scannable QR code harmonized into the picture. Any smartphone camera can scan it instantly, providing the perfect fallback for devices without NFC or when displaying the photo on a desk or wallet."
  },
  {
    q: "Does the recipient need to download an app?",
    a: "No! Absolutely zero apps are required. It opens natively in Safari, Chrome, or your phone's default browser on both iOS and Android. Anyone can experience it in seconds."
  },
  {
    q: "What if someone's phone doesn't have NFC?",
    a: "Every physical keepsake comes paired with a high-resolution styled QR code photo. Any smartphone camera can simply point at the photo to scan and open the exact same interactive experience instantly."
  },
  {
    q: "What can I put on my personalized template?",
    a: "You can include your own video clip or photo, a custom audio track (your voice message, favorite song, or audio note), and personal text or lyrics with synchronized subtitle captions."
  },
  {
    q: "How do I order after choosing a template?",
    a: "Simply browse our 50+ templates, choose the one you love, and click 'Inquire to Order' or message us directly on Messenger or Instagram. Send us your template number, photos/video, music choice, and message—we will craft your physical keepsake and deliver it to you!"
  },
  {
    q: "Can I update the video or message after receiving my keepsake?",
    a: "Yes! Your SayWith link is completely dynamic. If you want to change the video, swap photos, or update the letter for a future anniversary, you can update your link anytime without needing a new physical keepsake."
  },
  {
    q: "How long does my digital memory stay online?",
    a: "Your digital memory is stored with lifetime cloud hosting and unlimited taps. There are zero monthly subscription fees or expiration dates."
  }
];

export default function SayWithLandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPlayingHero, setIsPlayingHero] = useState<boolean>(true);
  
  // Contact / Inquiry modal state
  const [inquiryOpen, setInquiryOpen] = useState<boolean>(false);
  const [selectedTemplateForInquiry, setSelectedTemplateForInquiry] = useState<TemplateItem | null>(null);
  const [selectedKeepsakeStyle, setSelectedKeepsakeStyle] = useState<string>("Classic Acrylic NFC Keychain");
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const filteredTemplates = TEMPLATE_CATALOG.filter((t) => {
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openInquiryModal = (template?: TemplateItem, keepsakeName?: string) => {
    if (template) {
      setSelectedTemplateForInquiry(template);
    }
    if (keepsakeName) {
      setSelectedKeepsakeStyle(keepsakeName);
    }
    setInquiryOpen(true);
  };

  const getInquiryMessage = () => {
    const templateName = selectedTemplateForInquiry
      ? `Template #${selectedTemplateForInquiry.num} (${selectedTemplateForInquiry.name})`
      : "one of your 50+ templates";
    return `Hi SayWith! I want to order a custom ${selectedKeepsakeStyle} with ${templateName}. How can I send my photos, music, and message?`;
  };

  const handleCopyInquiry = () => {
    navigator.clipboard.writeText(getInquiryMessage());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
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

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#mockups" className="hover:text-primary transition-colors">Showcase</a>
            <a href="#templates" className="hover:text-primary transition-colors">50+ Templates</a>
            <a href="#keepsakes" className="hover:text-primary transition-colors">Keepsake Styles</a>
            <a href="#occasions" className="hover:text-primary transition-colors">Occasions</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="#templates">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-2">
                <Eye className="w-4 h-4 text-primary" />
                Templates
              </Button>
            </a>
            <Button
              size="sm"
              onClick={() => openInquiryModal()}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              <MessageCircle className="w-4 h-4" />
              Contact to Order
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section with Interactive Mockups */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-12 md:py-20 px-4">
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-950/30 via-background to-background">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
            {/* Top Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs md:text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Smart NFC Chips & Custom Styled QR Code Photos</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-center drop-shadow-md text-foreground">
              Hold the Keepsake. <br />
              <span className="bg-gradient-to-r from-blue-400 via-primary to-cyan-300 bg-clip-text text-transparent">
                Tap to Relive the Memory.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-2xl mx-auto text-center text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed">
              Personalized acrylic keychains and gift keepsakes embedded with instant <strong className="text-foreground font-medium">NFC smart chips</strong> and paired with custom <strong className="text-foreground font-medium">styled QR code photos</strong>. Tap with any phone to immediately reveal your personalized video, music, and heartfelt letters.
            </p>

            {/* Technology Pill Bar */}
            <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 bg-secondary/80 px-3.5 py-1.5 rounded-full border border-border">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                Instant Phone NFC Tap
              </span>
              <span className="inline-flex items-center gap-1.5 bg-secondary/80 px-3.5 py-1.5 rounded-full border border-border">
                <QrCode className="w-4 h-4 text-emerald-400" />
                Styled QR Code Photo
              </span>
              <span className="inline-flex items-center gap-1.5 bg-secondary/80 px-3.5 py-1.5 rounded-full border border-border">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                No App Download Needed
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="#templates" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base gap-2 px-8 py-6 shadow-xl shadow-primary/25">
                  <Eye className="w-5 h-5" />
                  Show All 50+ Templates
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openInquiryModal()}
                className="w-full sm:w-auto text-base gap-2 px-8 py-6 bg-secondary/80 border-border hover:bg-secondary"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
                Contact Us to Order
              </Button>
            </div>

            {/* HERO VISUAL MOCKUP: Physical Keepsake + Styled QR Photo + Live Phone Screen */}
            <div className="mt-14 max-w-4xl mx-auto">
              <div className="relative rounded-3xl bg-secondary/40 border border-border/80 p-6 md:p-10 shadow-2xl backdrop-blur-sm overflow-hidden">
                {/* Decorative background grid and glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-8">
                  <span className="text-xs uppercase tracking-widest text-primary font-semibold">Interactive Showcase</span>
                  <h3 className="text-xl md:text-2xl font-bold mt-1">From Tangible Keepsake to Digital Screen</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Tap the physical keychain with your phone or point at the styled QR code photo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Physical Keepsake & Styled QR Photo Mockup */}
                  <div className="md:col-span-5 flex flex-col items-center gap-6">
                    {/* Physical Acrylic Keychain Mockup */}
                    <div className="relative flex flex-col items-center group">
                      {/* Metal Ring and Chain */}
                      <div className="w-9 h-9 rounded-full border-4 border-slate-300 dark:border-slate-500 shadow-md flex items-center justify-center -mb-2 z-20">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600"></div>
                      </div>
                      <div className="w-1.5 h-4 bg-gradient-to-b from-slate-400 to-slate-500 rounded -mb-1 z-20"></div>

                      {/* Acrylic Keychain Capsule */}
                      <div className="w-48 sm:w-56 h-64 rounded-3xl bg-gradient-to-b from-white/30 via-white/10 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-transparent border-2 border-white/40 dark:border-white/20 p-3 shadow-2xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        {/* Acrylic Gloss Reflection Highlight */}
                        <div className="absolute -top-12 -left-12 w-36 h-36 bg-gradient-to-br from-white/40 to-transparent rotate-45 rounded-full pointer-events-none"></div>
                        
                        {/* Top: NFC Loop Indicator */}
                        <div className="flex justify-between items-center z-10">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                            <Radio className="w-2.5 h-2.5 animate-pulse" />
                            NFC Chip Inside
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">NTAG215</span>
                        </div>

                        {/* Center Photo Inside Keychain */}
                        <div className="relative rounded-2xl overflow-hidden h-36 bg-gradient-to-br from-rose-500/80 via-purple-600/80 to-blue-600/80 p-3 flex flex-col justify-between text-white shadow-inner">
                          <div className="flex items-center gap-1.5">
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

                          <div className="z-10">
                            <p className="text-[11px] font-bold">2nd Anniversary Keepsake</p>
                            <p className="text-[9px] opacity-80">Hold Phone Here to Tap</p>
                          </div>
                        </div>

                        {/* Bottom Tag */}
                        <div className="text-center z-10 py-1">
                          <span className="text-[11px] font-medium text-foreground">Acrylic Smart Keychain</span>
                        </div>
                      </div>
                    </div>

                    {/* Styled QR Code Photo Card Mockup */}
                    <div className="w-48 sm:w-56 p-3 rounded-2xl bg-background border border-border/80 shadow-lg flex items-center gap-3">
                      {/* Stylized QR Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 border border-primary/30 p-1.5 flex flex-col items-center justify-center relative shrink-0">
                        <QrCode className="w-8 h-8 text-primary" />
                        <span className="text-[7px] text-primary font-bold mt-0.5">SCAN</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">Styled QR Photo</p>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Custom photo card with scannable QR</p>
                        <span className="inline-block mt-1 text-[9px] text-emerald-400 font-medium">Camera fallback ready</span>
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

                  {/* Right Column: Smartphone Digital Template Mockup */}
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
                          {/* Floating Particles Animation */}
                          <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <Heart className="w-3.5 h-3.5 text-white/50 absolute top-4 left-6 animate-bounce" />
                            <Sparkles className="w-3.5 h-3.5 text-amber-200/70 absolute top-8 right-6 animate-pulse" />
                            <Heart className="w-3 h-3 text-pink-200/60 absolute bottom-6 right-8 animate-ping" />
                          </div>

                          <div className="flex justify-between items-center z-10">
                            <span className="text-[9px] font-semibold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                              SayWith Memories
                            </span>
                            <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                              HD 4K Video
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
                                <p className="text-[11px] font-semibold truncate leading-tight">Until I Found You</p>
                                <p className="text-[9px] text-slate-300 truncate">Custom song / voice note</p>
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
                          &ldquo;Every single day with you is a gift I never take for granted. Forever and always. ❤️&rdquo;
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

        {/* Supporting Mockups & Visual Showcase Section */}
        <section id="mockups" className="py-20 bg-secondary/30 border-y border-border/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">Visual Showcase</h2>
              <p className="text-3xl sm:text-4xl font-headline font-bold mt-2">Crafted Keepsake & Styled QR Photo</p>
              <p className="mt-3 text-muted-foreground">
                See how every piece is carefully designed: physical quality in your hand, personalized art, and instant tap playback.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Mockup Card 1: Acrylic Smart Keychain */}
              <div className="bg-background rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg group">
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-br from-blue-900/40 via-secondary to-background border border-border flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {/* Visual Keychain Illustration */}
                    <div className="w-24 h-32 rounded-2xl bg-white/10 dark:bg-white/5 border-2 border-white/30 backdrop-blur-sm p-2 flex flex-col justify-between items-center shadow-lg group-hover:scale-105 transition-transform">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-400"></div>
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center text-white">
                        <Heart className="w-7 h-7 fill-white" />
                      </div>
                      <div className="w-8 h-1 rounded-full bg-white/40"></div>
                    </div>
                    <span className="absolute bottom-2 text-[10px] text-primary font-semibold">Crystal Clear Acrylic</span>
                  </div>
                  <h3 className="text-lg font-bold mt-4">Acrylic NFC Keychain</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Double-sided durable acrylic with an embedded high-gain NFC chip and your favorite photo on display.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Instant Tap Ready</span>
                </div>
              </div>

              {/* Mockup Card 2: Custom Styled QR Code Photo */}
              <div className="bg-background rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg group">
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-br from-pink-900/30 via-secondary to-background border border-border flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {/* Styled QR Photo Mockup */}
                    <div className="w-28 h-32 rounded-xl bg-white dark:bg-slate-900 border border-border shadow-lg p-2 flex flex-col justify-between items-center group-hover:scale-105 transition-transform">
                      <div className="w-full h-12 rounded-lg bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-[9px] text-white font-bold">
                        Couple Photo
                      </div>
                      <div className="w-12 h-12 rounded-md bg-secondary border border-border flex items-center justify-center">
                        <QrCode className="w-9 h-9 text-foreground" />
                      </div>
                      <span className="text-[8px] text-muted-foreground font-mono">SCAN ME</span>
                    </div>
                    <span className="absolute bottom-2 text-[10px] text-rose-400 font-semibold">Artistic Photo Card</span>
                  </div>
                  <h3 className="text-lg font-bold mt-4">Styled QR Code Photo</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Not a dull barcode! A custom photo keepsake card with a stylized scannable QR code embedded into the design.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Point Any Phone Camera</span>
                </div>
              </div>

              {/* Mockup Card 3: The Phone Tap Action */}
              <div className="bg-background rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg group">
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-br from-cyan-900/30 via-secondary to-background border border-border flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {/* Phone Tapping Animation Illustration */}
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
                    <span className="absolute bottom-2 text-[10px] text-cyan-400 font-semibold">Instant Web Popup</span>
                  </div>
                  <h3 className="text-lg font-bold mt-4">Seamless Phone Tap</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Just tap the top of your iPhone or back of your Android. The memory plays natively in Safari or Chrome.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>iOS & Android Compatible</span>
                </div>
              </div>

              {/* Mockup Card 4: Gift Packaging Presentation */}
              <div className="bg-background rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg group">
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-br from-amber-900/30 via-secondary to-background border border-border flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {/* Gift Presentation Mockup */}
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-400/40 p-2.5 flex flex-col justify-between items-center shadow-xl group-hover:scale-105 transition-transform relative">
                      <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
                        <Gift className="w-4 h-4" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-amber-200">Ready to Gift</p>
                        <p className="text-[8px] text-slate-300">Pouch & Photo Card</p>
                      </div>
                      <div className="w-12 h-1 rounded-full bg-amber-400/40"></div>
                    </div>
                    <span className="absolute bottom-2 text-[10px] text-amber-400 font-semibold">Unforgettable Unboxing</span>
                  </div>
                  <h3 className="text-lg font-bold mt-4">Gift Ready Presentation</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Arrives packaged with a protective pouch and matching styled QR photo card, ready to hand directly to your special someone.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Complete Gifting Package</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works: Physical Keepsake -> Digital Memory */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">The Experience</h2>
              <p className="text-3xl sm:text-4xl font-headline font-bold mt-2">How SayWith Brings Memories to Life</p>
              <p className="mt-3 text-muted-foreground">
                A seamless bridge between a physical keepsake you can hold and a digital memory you can replay anytime.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-background/80 p-6 rounded-2xl border border-border/70 flex flex-col items-start relative group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  1
                </div>
                <h3 className="text-lg font-bold">Pick Your Keepsake</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose from custom acrylic keychains, couple&apos;s matching pairs, or pocket memory tokens with styled QR photo cards.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Physical keepsake</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-background/80 p-6 rounded-2xl border border-border/70 flex flex-col items-start relative group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  2
                </div>
                <h3 className="text-lg font-bold">Select a Template</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Browse 50+ cinematic designs: Falling Rose Petals, Retro Vinyl, Starry Night, Polaroid, or Spotify cards.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>50+ cinematic styles</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-background/80 p-6 rounded-2xl border border-border/70 flex flex-col items-start relative group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  3
                </div>
                <h3 className="text-lg font-bold">Message Us Your Media</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send us your photos or video clip, favorite background music or voice message, and personal note via chat.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Music className="w-3.5 h-3.5" />
                  <span>Media + audio sync</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-background/80 p-6 rounded-2xl border border-border/70 flex flex-col items-start relative group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  4
                </div>
                <h3 className="text-lg font-bold">Tap with NFC or Scan</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Hold any smartphone to the keychain or scan the paired styled QR photo. The personalized story plays instantly!
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Instant phone tap</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 50+ Templates Showcase */}
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
                  Choose the exact vibe that fits your gift: from falling rose petals and stardust particles to retro vinyls and movie reels.
                </p>
              </div>

              {/* Search input */}
              <div className="w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search template name or style..."
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

            <div className="mt-4 text-xs text-muted-foreground">
              Showing {filteredTemplates.length} of {TEMPLATE_CATALOG.length} templates
            </div>

            {/* Template Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.slice(0, 15).map((template: TemplateItem) => (
                <div
                  key={template.id}
                  className="bg-background rounded-2xl border border-border/80 overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl flex flex-col group"
                >
                  {/* Visual Top Preview */}
                  <div className={cn("h-44 p-4 flex flex-col justify-between relative bg-gradient-to-br", template.accent)}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-black/50 text-white backdrop-blur-sm">
                        #{template.num}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/20 text-white backdrop-blur-sm">
                        {template.tag}
                      </span>
                    </div>

                    <div className="text-white drop-shadow-md">
                      <p className="text-xs uppercase tracking-wider opacity-80">{template.category}</p>
                      <h4 className="text-xl font-bold font-headline">{template.name}</h4>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {template.desc}
                    </p>

                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-primary font-medium">NFC & Styled QR Ready</span>
                      <button
                        onClick={() => openInquiryModal(template)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        Inquire With This <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length > 15 && (
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Plus {filteredTemplates.length - 15} more handcrafted templates available for your gift.
                </p>
                <Button size="lg" onClick={() => openInquiryModal()} className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Ask Us About Any Template & Style
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Physical Keepsake Styles Showcase (Showcase without direct order/pricing) */}
        <section id="keepsakes" className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">Keepsake Styles</h2>
              <p className="text-3xl sm:text-4xl font-headline font-bold mt-2">Physical Formats to Match Your Memory</p>
              <p className="mt-3 text-muted-foreground">
                Choose the physical format you want. Every piece comes embedded with an instant NFC smart chip and a paired styled QR code photo card.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {keepsakeStyles.map((prod) => (
                <div
                  key={prod.id}
                  className={cn(
                    "rounded-3xl p-8 flex flex-col justify-between transition-all relative",
                    prod.highlight
                      ? "bg-secondary border-2 border-primary shadow-2xl shadow-primary/10"
                      : "bg-secondary/40 border border-border"
                  )}
                >
                  {prod.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                      Most Popular Style
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {prod.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mt-4">{prod.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{prod.tagline}</p>
                    
                    <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-background/80 border border-border text-xs font-medium text-foreground">
                      <Gift className="w-3.5 h-3.5 text-primary" />
                      <span>{prod.format}</span>
                    </div>

                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                      {prod.description}
                    </p>

                    <ul className="mt-6 space-y-3 text-sm">
                      {prod.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-xs sm:text-sm">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={() => openInquiryModal(undefined, prod.name)}
                      className={cn(
                        "w-full py-5 text-sm font-semibold gap-2",
                        prod.highlight ? "shadow-lg shadow-primary/25" : ""
                      )}
                      variant={prod.highlight ? "default" : "outline"}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire About This Style
                    </Button>
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
              We make the ordering process effortless. Pick your favorite template from our showcase, then contact us through your preferred chat app to complete your personalized gift!
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="bg-secondary/40 p-6 rounded-2xl border border-border">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center mb-3">
                  A
                </span>
                <h4 className="font-bold text-base">1. Choose a Template</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Browse our 50+ templates and note the template name or number you want for your keepsake.
                </p>
              </div>

              <div className="bg-secondary/40 p-6 rounded-2xl border border-border">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center mb-3">
                  B
                </span>
                <h4 className="font-bold text-base">2. Send Us a Message</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Reach out on Messenger, Instagram, or WhatsApp. Tell us which template and keepsake style you chose.
                </p>
              </div>

              <div className="bg-secondary/40 p-6 rounded-2xl border border-border">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center mb-3">
                  C
                </span>
                <h4 className="font-bold text-base">3. Send Media & Relax</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Send your photos, video clip, song title, or letter. We craft your physical NFC keepsake and ship it to you!
                </p>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
              <a
                href="https://messenger.com"
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
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-6 py-6 border-pink-500/40 text-pink-500 hover:bg-pink-500/10">
                  <Instagram className="w-5 h-5" />
                  Message on Instagram
                </Button>
              </a>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => openInquiryModal()}
                className="w-full sm:w-auto gap-2 px-6 py-6"
              >
                <Send className="w-5 h-5 text-primary" />
                Open Inquiry Details
              </Button>
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
                How NFC technology, styled QR code photos, and digital templates work together.
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

      {/* Inquiry & Order Contact Dialog */}
      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <DialogContent className="sm:max-w-md bg-background border border-border p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Contact Us to Order
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Send us a message with your chosen template and keepsake style to start customizing your gift.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            {/* Selected Template Badge */}
            <div className="p-3.5 rounded-xl bg-secondary/60 border border-border">
              <p className="text-xs text-muted-foreground">Selected Template</p>
              <p className="text-sm font-bold text-foreground mt-0.5">
                {selectedTemplateForInquiry
                  ? `Template #${selectedTemplateForInquiry.num} — ${selectedTemplateForInquiry.name}`
                  : "Any 50+ Template from Showcase"}
              </p>
            </div>

            {/* Keepsake Style Selector */}
            <div className="p-3.5 rounded-xl bg-secondary/60 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Keepsake Style</p>
              <select
                value={selectedKeepsakeStyle}
                onChange={(e) => setSelectedKeepsakeStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {keepsakeStyles.map((style) => (
                  <option key={style.id} value={style.name}>
                    {style.name} ({style.format})
                  </option>
                ))}
              </select>
            </div>

            {/* Pre-formatted Message with Copy Action */}
            <div className="p-3 rounded-xl bg-background border border-border/80">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">Ready-to-Send Message:</span>
                <button
                  onClick={handleCopyInquiry}
                  className="text-[11px] inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground italic bg-secondary/40 p-2.5 rounded-lg border border-border/40">
                &ldquo;{getInquiryMessage()}&rdquo;
              </p>
            </div>

            {/* Direct Chat Channels */}
            <div className="space-y-2 pt-2">
              <a
                href="https://messenger.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <MessageCircle className="w-4 h-4" />
                  Send via Messenger
                </Button>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Button variant="outline" className="w-full gap-2 border-pink-500/40 text-pink-500 hover:bg-pink-500/10">
                  <Instagram className="w-4 h-4" />
                  Send via Instagram DM
                </Button>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-secondary/60 py-12 border-t border-border/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/icons/icon-192x192.png" alt="SayWith Logo" width={32} height={32} className="rounded-lg" />
              <span className="font-headline font-bold text-lg">SayWith</span>
              <span className="text-xs text-muted-foreground">Smart NFC & Styled QR Keepsakes</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
              <a href="#mockups" className="hover:text-primary transition-colors">Showcase</a>
              <a href="#templates" className="hover:text-primary transition-colors">Templates</a>
              <a href="#keepsakes" className="hover:text-primary transition-colors">Keepsakes</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact to Order</a>
              <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            </div>

            <div className="flex justify-center items-center gap-3">
              {Object.entries(socialIcons).map(([name, Icon]) => (
                <a
                  key={name}
                  href={`https://${name}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name.charAt(0).toUpperCase() + name.slice(1)}
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full hover:bg-secondary"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SayWith. All rights reserved. Smart NFC Tap & Custom Styled QR Code Photo Keepsakes.
          </div>
        </div>
      </footer>
    </div>
  );
}
