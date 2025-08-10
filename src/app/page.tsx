
"use client";

import React, { useEffect, useRef, useState, type SVGProps } from "react";
import Image from "next/image";
import { 
  PenTool,
  Image as ImageIcon,
  QrCode,
  ShieldCheck,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const socialIcons: { [key: string]: React.ComponentType<SVGProps<SVGSVGElement>> } = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  messenger: MessageCircle
};

const features = [
  {
    icon: PenTool,
    title: "Create Stunning Templates",
    description: "Design beautiful, custom templates that make your message shine.",
  },
  {
    icon: ImageIcon,
    title: "Your Media, Your Message",
    description: "Integrate your own images and videos for a personal touch.",
  },
  {
    icon: QrCode,
    title: "Easy QR Code Sharing",
    description: "Generate and share QR codes for instant access to your content.",
  },
  {
    icon: ShieldCheck,
    title: "Secure and Flexible",
    description: "Your content is protected and accessible wherever you need it.",
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Upload Your Media",
    description: "Upload your media and script.",
  },
  {
    step: 2,
    title: "Choose a Template",
    description: "Choose from 40+ customizable templates.",
  },
  {
    step: 3,
    title: "Personalize and Preview",
    description: "Personalize and preview instantly.",
  },
  {
    step: 4,
    title: "Share Your Story",
    description: "Share via link or QR code.",
  },
];

interface QrCode {
  imageUrl: string;
  alt: string;
}

interface Template {
  imageUrl: string;
  alt: string;
}

interface SocialLink {
  name: string;
  url: string;
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}


const useFadeInSection = () => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, []);
  return ref;
};

const Section = ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const ref = useFadeInSection();
  return (
    <section ref={ref} className={cn("fade-in-section", className)} {...props}>
      {children}
    </section>
  );
};


export default function SayWithLandingPage() {
  const qrcodePlugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const templatePlugin = React.useRef(Autoplay({ delay: 2200, stopOnInteraction: true }));
  const testimonialPlugin = React.useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));

  const [qrcodes, setQrcodes] = useState<QrCode[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch('/qrcodes.json')
      .then((res) => res.json())
      .then((data) => setQrcodes(data))
      .catch((err) => console.error("Failed to load qrcodes.json", err));

    fetch('/templates.json')
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => console.error("Failed to load templates.json", err));
      
    fetch('/links.json')
      .then((res) => res.json())
      .then((data) => setSocialLinks(data.socials))
      .catch((err) => console.error("Failed to load links.json", err));

    fetch('/testimonials.json')
      .then((res) => res.json())
      .then((data) => setTestimonials(data))
      .catch((err) => console.error("Failed to load testimonials.json", err));
  }, []);

  return (
    <div className="bg-background text-foreground antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <nav className="container mx-auto flex items-center justify-between p-4 px-6">
          <a href="#" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Image src="/icons/icon-192x192.png" alt="SayWith Logo" width={32} height={32} />
            <span>SayWith</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <Button>Get Started</Button>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-[calc(100vh-68px)] flex items-center justify-center text-center text-white overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image 
                    src="https://placehold.co/1920x1080.png"
                    data-ai-hint="abstract gradient ocean blue"
                    alt="Ocean Blue Gradient with subtle waves"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
            </div>
            <div className="relative z-10 p-6 animate-fade-in-down">
                <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-md">
                    Say it with style. Say it with SayWith.
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl font-light drop-shadow-sm">
                    Transform your words, media, and ideas into powerful, shareable experiences.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg">Get Started</Button>
                    <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                        Explore Templates
                    </Button>
                </div>
            </div>
        </section>


        {/* Features Section */}
        <Section id="features" className="py-20 bg-secondary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Everything You Need to Create</h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
              Powerful tools to bring your stories to life, simply and beautifully.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-background p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-left">
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
        
        {/* QR Codes Section */}
        <Section id="qrcodes" className="py-20 bg-background">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Share with a Scan</h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
              Generate stylish QR codes that match your brand and message.
            </p>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[qrcodePlugin.current]}
              onMouseEnter={() => qrcodePlugin.current.stop()}
              onMouseLeave={() => qrcodePlugin.current.reset()}
              className="w-full max-w-4xl mx-auto mt-12"
            >
              <CarouselContent>
                {qrcodes.map((qrcode, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Image
                        src={qrcode.imageUrl}
                        alt={qrcode.alt}
                        width={400}
                        height={400}
                        className="rounded-lg shadow-lg"
                        data-ai-hint="qr code"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </Section>
        
        {/* Templates Section */}
        <Section id="templates" className="py-20 bg-secondary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">40+ Beautiful Templates</h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
              Find the perfect look for any occasion.
            </p>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[templatePlugin.current]}
              onMouseEnter={() => templatePlugin.current.stop()}
              onMouseLeave={() => templatePlugin.current.reset()}
              className="w-full max-w-6xl mx-auto mt-12"
            >
              <CarouselContent>
                {templates.map((template, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <Image
                        src={template.imageUrl}
                        alt={template.alt}
                        width={400}
                        height={800}
                        className="rounded-lg shadow-lg"
                        data-ai-hint="social media story"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </Section>


        {/* About Section */}
        <Section id="about" className="py-20">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <Image
                    src="https://placehold.co/800x800.png"
                    data-ai-hint="minimal workspace ocean blue"
                    alt="About SayWith"
                    width={800}
                    height={800}
                    className="rounded-lg shadow-2xl"
                />
            </div>
            <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">Make It Unforgettable.</h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                    SayWith is your one-stop creative platform for personalizing media, designing for impact, and sharing effortlessly. Whether it’s a heartfelt message, a bold business announcement, or a stylish visual for social media — we help you make it unforgettable.
                </p>
            </div>
          </div>
        </Section>
        
        {/* How It Works Section */}
        <Section id="how-it-works" className="py-20 bg-secondary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Four Easy Steps</h2>
            <div className="relative mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border hidden md:block"></div>
              {howItWorksSteps.map((step) => (
                <div key={step.step} className="relative flex flex-col items-center text-center">
                   <div className="relative z-10 h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4 border-4 border-secondary">
                     {step.step}
                   </div>
                   <h3 className="text-xl font-bold">{step.title}</h3>
                   <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Testimonials Section */}
        <Section id="testimonials" className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center">Loved by Creators</h2>
             <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[testimonialPlugin.current]}
              onMouseEnter={() => testimonialPlugin.current.stop()}
              onMouseLeave={() => testimonialPlugin.current.reset()}
              className="w-full max-w-4xl mx-auto mt-12"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-4">
                      <div className="bg-secondary p-8 rounded-lg shadow-md h-full flex flex-col justify-between">
                        <p className="text-lg italic text-foreground">"{testimonial.quote}"</p>
                        <div className="mt-4 flex items-center">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <p className="font-bold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </Section>
        
        {/* Contact Section */}
        <Section id="contact" className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Let's Work Together</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Got a message worth sharing? We’ll make it shine. Get in touch today.
            </p>
            <div className="mt-8">
              <Button size="lg" className="w-full sm:w-auto">Contact Us</Button>
            </div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-6">
              {socialLinks.map((link) => {
                  const Icon = socialIcons[link.name];
                  if (!Icon) return null;
                  return (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Icon className="h-6 w-6" />
                      <span className="sr-only">{link.name.charAt(0).toUpperCase() + link.name.slice(1)}</span>
                    </a>
                  );
                })}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">&copy; {new Date().getFullYear()} SayWith. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
