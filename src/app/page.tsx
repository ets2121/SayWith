"use client";

import { useState, useEffect, type SVGProps } from "react";
import Image from "next/image";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SocialLinks {
  facebook: string;
  twitter: string;
  tiktok: string;
  youtube: string;
  instagram: string;
}

const TiktokIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M13.5 8.5v8" />
    <path d="M10 11.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M13.5 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </svg>
);

const socialIcons: { [key: string]: React.ComponentType<SVGProps<SVGSVGElement>> } = {
  facebook: Facebook,
  twitter: Twitter,
  tiktok: TiktokIcon,
  youtube: Youtube,
  instagram: Instagram,
};

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen w-screen fixed inset-0 bg-background z-50">
    <div className="relative">
      <h1 className="font-headline text-5xl font-bold text-accent animate-pulsate">
        SayWith
      </h1>
    </div>
  </div>
);

export default function SayWithLandingPage() {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<SocialLinks | null>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/links.json');
        if (!response.ok) throw new Error('Failed to fetch links');
        const data = await response.json();
        setLinks(data);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Error loading content',
          description: 'Could not load social media links.',
        });
      }
    };
    
    Promise.all([
      fetchData(),
      new Promise((res) => setTimeout(res, 2000)),
    ]).finally(() => {
      setLoading(false);
      setTimeout(() => setIsContentVisible(true), 100);
    });
  }, [toast]);

  return (
    <>
      {loading && <LoadingScreen />}
      <div className={cn('bg-background min-h-screen text-foreground transition-opacity duration-1000 ease-in', isContentVisible ? 'opacity-100' : 'opacity-0')}>
        <div className="relative isolate overflow-hidden">
          <svg
            className="absolute inset-0 -z-10 h-full w-full stroke-gray-700/50 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern id="grid-pattern" width={200} height={200} x="50%" y={-1} patternUnits="userSpaceOnUse">
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
          </svg>
          <div
            className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
            aria-hidden="true"
          >
            <div
              className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary to-accent opacity-20"
              style={{
                clipPath:
                  'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64.6%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
              }}
            />
          </div>
          
          <header className="absolute inset-x-0 top-0 z-10 animate-fade-in-down">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
              <div className="flex lg:flex-1">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">SayWith</span>
                  <h2 className="font-headline text-2xl font-bold text-accent">SayWith</h2>
                </a>
              </div>
            </nav>
          </header>

          <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-48 sm:pb-32 lg:flex lg:px-8 lg:py-40">
            <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
              <div className="mt-10 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-6xl">
                  SayWith – Send Messages That Matter
                </h1>
                <p className="font-body mt-6 text-lg leading-8 text-gray-300">
                  Craft meaningful connections with messages that resonate. Animate your words, express your true self, and make every interaction unforgettable.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Button size="lg">Get Started</Button>
                  <Button size="lg" variant="link" className="px-0">Learn more <span aria-hidden="true">→</span></Button>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
              <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                <div className="-m-2 rounded-xl bg-card/60 p-2 ring-1 ring-inset ring-border/20 backdrop-blur-md lg:-m-4 lg:rounded-2xl lg:p-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <Image
                    src="https://placehold.co/800x600.png"
                    data-ai-hint="digital communication chat"
                    alt="App screenshot"
                    width={2432}
                    height={1442}
                    className="w-[76rem] rounded-md shadow-2xl ring-1 ring-foreground/10"
                  />
                </div>
              </div>
            </div>
          </main>

          <footer className="w-full py-8">
            <div className="container mx-auto flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex justify-center items-center gap-6">
                {links && Object.entries(links).map(([key, url]) => {
                  const Icon = socialIcons[key];
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                      <Icon className="h-6 w-6" />
                      <span className="sr-only">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </a>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} SayWith. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
