"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Smartphone,
  QrCode,
  Gift,
  Sparkles,
  Heart,
  Music,
  ShoppingBag,
  Eye,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Flame,
  Clock,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  TEMPLATE_CATALOG, 
  TEMPLATE_CATEGORIES, 
  type TemplateItem 
} from "@/data/templateCatalog";

const socialIcons: Record<string, LucideIcon> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
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

const keepsakeProducts = [
  {
    name: "Classic Acrylic NFC Keychain",
    tagline: "Everyday memory companion",
    price: "$19.99",
    badge: "Bestseller",
    features: [
      "Built-in NTAG213 / NTAG215 NFC smart chip",
      "Scratch-resistant crystal clear acrylic",
      "Laser-engraved high-density QR code on back",
      "Lifetime unlimited digital taps & scans",
      "Free gift pouch included"
    ],
    highlight: true
  },
  {
    name: "Couples Matching Set (2x Keychains)",
    tagline: "For two hearts sharing one memory",
    price: "$34.99",
    badge: "Save 15%",
    features: [
      "Two synchronized NFC keychains",
      "Custom laser initials or anniversary date",
      "Linked to shared video reel, music & message",
      "Dual-sided NFC tap + camera QR scan",
      "Premium magnetic couple's gift box"
    ],
    highlight: false
  },
  {
    name: "Engraved Metal Keepsake Token",
    tagline: "Heavyweight luxury token for wallets or bags",
    price: "$27.99",
    badge: "Premium Finish",
    features: [
      "Precision matte black or brushed silver alloy",
      "Embedded ultra-thin high-gain NFC antenna",
      "Micro-etched precision QR code fallback",
      "Weatherproof & built to last a lifetime",
      "Velvet display case"
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
    q: "Does the recipient need to download an app?",
    a: "No! Absolutely zero apps are required. It opens natively in Safari, Chrome, or your phone's default browser on both iOS and Android. Anyone can experience it in seconds."
  },
  {
    q: "What if someone's phone doesn't have NFC?",
    a: "Every physical keepsake is dual-technology: it features an embedded NFC chip inside AND a high-contrast laser-etched QR code on the back. Any smartphone camera can scan the QR code to open the exact same experience."
  },
  {
    q: "What can I put on my personalized template?",
    a: "You can include your own video clip or photo, a custom audio track (your voice message, favorite song, or audio note), and personal text or lyrics with synchronized subtitle captions."
  },
  {
    q: "Can I update the video or message after buying?",
    a: "Yes! Your SayWith link is completely dynamic. If you want to change the video, swap photos, or update the letter for a future anniversary, you can update your link anytime without needing a new physical keychain."
  },
  {
    q: "How long does my digital memory stay online?",
    a: "Your digital memory is stored with lifetime cloud hosting and unlimited taps. There are zero monthly subscription fees or expiration dates."
  }
];

export default function SayWithLandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTemplates = TEMPLATE_CATALOG.filter((t) => {
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-background text-foreground antialiased selection:bg-primary selection:text-white">
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

          <div className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#templates" className="hover:text-primary transition-colors">50+ Templates</a>
            <a href="#occasions" className="hover:text-primary transition-colors">Occasions</a>
            <a href="#keepsakes" className="hover:text-primary transition-colors">Keepsakes</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="#templates">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-2">
                <Eye className="w-4 h-4 text-primary" />
                Templates
              </Button>
            </a>
            <a href="#order">
              <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
                <ShoppingBag className="w-4 h-4" />
                Order Custom Gift
              </Button>
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center text-center text-white overflow-hidden py-16 px-4">
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-950/40 via-background to-background">
            <Image 
              src="https://placehold.co/1920x1080.png"
              data-ai-hint="atmospheric night gradient with subtle warm lights"
              alt="SayWith NFC Keepsakes"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
              className="opacity-30 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs md:text-sm font-semibold mb-6 animate-fade-in-down">
              <Sparkles className="w-4 h-4" />
              <span>Smart NFC & QR Personalized Keepsakes</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight drop-shadow-md text-foreground">
              Hold the Keepsake. <br />
              <span className="bg-gradient-to-r from-blue-400 via-primary to-cyan-300 bg-clip-text text-transparent">
                Tap to Relive the Memory.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Personalized keychains, gift tokens, and physical keepsakes embedded with smart NFC and laser QR codes. 
              Tap with any phone to instantly reveal your personalized videos, music, and heartfelt messages.
            </p>

            {/* Technology Pill Bar */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 bg-secondary/80 px-3.5 py-1.5 rounded-full border border-border">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                Tap with NFC (Instant)
              </span>
              <span className="inline-flex items-center gap-1.5 bg-secondary/80 px-3.5 py-1.5 rounded-full border border-border">
                <QrCode className="w-4 h-4 text-emerald-400" />
                Scan with QR (All Phones)
              </span>
              <span className="inline-flex items-center gap-1.5 bg-secondary/80 px-3.5 py-1.5 rounded-full border border-border">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                No App Download Required
              </span>
            </div>

            {/* Primary & Secondary Calls to Action */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="#templates" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base gap-2 px-8 py-6 shadow-xl shadow-primary/25">
                  <Eye className="w-5 h-5" />
                  Show All 50+ Templates
                </Button>
              </a>
              <a href="#order" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base gap-2 px-8 py-6 bg-secondary/80 border-border hover:bg-secondary">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Your Custom Keepsake
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* How It Works: Physical Keepsake -> Digital Memory */}
        <section id="how-it-works" className="py-20 bg-secondary/40 border-y border-border/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">The Experience</h2>
              <p className="text-3xl sm:text-4xl font-headline font-bold mt-2">How SayWith Brings Memories to Life</p>
              <p className="mt-3 text-muted-foreground">
                A seamless bridge between a physical gift you can hold and a digital memory you can replay anytime.
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
                  Choose from custom acrylic keychains, couple&apos;s matching pairs, or engraved metal gift tokens.
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
                <h3 className="text-lg font-bold">Upload Your Media</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add your photos or video clip, favorite background music or audio voice message, and personal note.
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
                  Hold any smartphone to the keychain or scan the back QR code. The personalized experience plays instantly!
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Instant phone tap</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Customers / Occasions */}
        <section id="occasions" className="py-20">
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
                <div key={idx} className="bg-secondary/40 p-8 rounded-2xl border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between">
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

        {/* 50+ Templates Showcase */}
        <section id="templates" className="py-20 bg-secondary/30 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Catalog</span>
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
                      <span className="text-xs text-primary font-medium">Ready for NFC & QR</span>
                      <a href="#order" className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                        Choose This <ArrowRight className="w-3.5 h-3.5" />
                      </a>
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
                <a href="#order">
                  <Button size="lg" className="gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Select a Template & Order Keepsake
                  </Button>
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Physical Products / Pricing Section */}
        <section id="keepsakes" className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">Physical Keepsakes</h2>
              <p className="text-3xl sm:text-4xl font-headline font-bold mt-2">Crafted to Last a Lifetime</p>
              <p className="mt-3 text-muted-foreground">
                Premium materials embedded with high-frequency NFC microchips and scratch-resistant laser QR codes.
              </p>
            </div>

            <div id="order" className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {keepsakeProducts.map((prod, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "rounded-3xl p-8 flex flex-col justify-between transition-all relative",
                    prod.highlight
                      ? "bg-secondary border-2 border-primary shadow-2xl shadow-primary/10"
                      : "bg-secondary/40 border border-border"
                  )}
                >
                  {prod.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                      Most Popular Gift
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
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold">{prod.price}</span>
                      <span className="text-xs text-muted-foreground">/ one-time</span>
                    </div>

                    <ul className="mt-8 space-y-3.5 text-sm">
                      {prod.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10">
                    <Button 
                      className={cn(
                        "w-full py-6 text-base font-semibold gap-2",
                        prod.highlight ? "shadow-lg shadow-primary/25" : ""
                      )}
                      variant={prod.highlight ? "default" : "outline"}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Order {prod.name.split(" ")[0]} Now
                    </Button>
                    <p className="text-[11px] text-center text-muted-foreground mt-2.5">
                      Includes lifetime cloud link & template setup
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section with Native Modern HTML Accordion */}
        <section id="faq" className="py-20 bg-secondary/30 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-4xl" aria-labelledby="faq-heading">
            <div className="text-center max-w-2xl mx-auto">
              <h2 id="faq-heading" className="text-xs uppercase tracking-widest text-primary font-semibold">Common Questions</h2>
              <p className="text-3xl sm:text-4xl font-headline font-bold mt-2">Everything You Need to Know</p>
              <p className="mt-3 text-muted-foreground">
                How NFC technology, camera QR codes, and digital templates work together.
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

        {/* Final Conversion Banner */}
        <section className="py-20 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-6">
              <Gift className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-headline font-bold">
              Give a Gift They Will Never Forget.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Combine a tangible keepsake with your most cherished videos and voices. Ready to surprise someone special?
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="#order" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base gap-2 px-8 py-6 shadow-xl shadow-primary/25">
                  <ShoppingBag className="w-5 h-5" />
                  Order Your Custom NFC Gift
                </Button>
              </a>
              <a href="#templates" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base gap-2 px-8 py-6">
                  <Eye className="w-5 h-5" />
                  Browse 50+ Templates
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/60 py-12 border-t border-border/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/icons/icon-192x192.png" alt="SayWith Logo" width={32} height={32} className="rounded-lg" />
              <span className="font-headline font-bold text-lg">SayWith</span>
              <span className="text-xs text-muted-foreground">Smart NFC & QR Keepsakes</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
              <a href="#templates" className="hover:text-primary transition-colors">Templates</a>
              <a href="#occasions" className="hover:text-primary transition-colors">Occasions</a>
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
            &copy; {new Date().getFullYear()} SayWith. All rights reserved. Tap with NFC or Scan with QR.
          </div>
        </div>
      </footer>
    </div>
  );
}
