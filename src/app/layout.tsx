
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  metadataBase: new URL("https://saywith.vercel.app"),
  title: "SayWith — Say it with style. Make it unforgettable.",
  description: "Transform your words, media, and ideas into stunning, shareable templates. Create, customize, and share your vision with SayWith.",
  keywords: ["SayWith", "templates", "QR code", "social media design", "Gen Z marketing", "creative media", "Instagram story templates", "Facebook story templates", "digital design", "QR code sharing", "logo design", "motivational templates", "video templates"],
  authors: [{ name: "Mark john Valdez" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://saywith.vercel.app/",
    title: "SayWith — Say it with style. Make it unforgettable.",
    description: "Create stunning media templates, share via QR codes, and make your message pop. Perfect for Gen Z and beyond.",
    images: ["/icons/icon-512x512.png"],
    siteName: "SayWith",
  },
  twitter: {
    card: "summary_large_image",
    title: "SayWith — Say it with style. Make it unforgettable.",
    description: "Transform your words, media, and ideas into stunning, shareable templates.",
    images: ["/icons/icon-512x512.png"],
    url: "https://saywith.vercel.app/",
  },
  other: {
    "tiktok:creator": "@saywith",
    "tiktok:description": "Turn your message into a visual masterpiece with SayWith.",
    "tiktok:image": "/icons/icon-384x384.png",
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico', type: 'image/x-icon' },
      { url: '/icons/icon-96x96.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/icon-72x72.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '180x180' },
      { url: '/icons/icon-128x128.png', sizes: '128x128' },
      { url: '/icons/icon-144x144.png', sizes: '144x144' },
      { url: '/icons/icon-152x152.png', sizes: '152x152' },
      { url: '/icons/icon-192x192.png', sizes: '192x192' },
      { url: '/icons/icon-384x384.png', sizes: '384x384' },
      { url: '/icons/icon-512x512.png', sizes: '512x512' },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SayWith",
      "url": "https://saywith.vercel.app/",
      "description": "Transform your words, media, and ideas into stunning, shareable templates. Create, customize, and share your vision with SayWith.",
      "publisher": {
        "@type": "Organization",
        "name": "SayWith",
        "logo": {
          "@type": "ImageObject",
          "url": "https://saywith.vercel.app/icons/icon-512x512.png",
          "width": 512,
          "height": 512
        }
      },
      "sameAs": [
        "https://www.facebook.com/YourPageHere",
        "https://www.instagram.com/YourPageHere",
        "https://www.tiktok.com/@YourPageHere",
        "https://twitter.com/YourPageHere",
        "https://www.youtube.com/@YourChannelHere"
      ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=PT+Sans:wght@400;700&family=Caveat:wght@400;700&family=Great+Vibes&family=Orbitron:wght@400;700&family=Exo+2:wght@300;400;700&family=Share+Tech+Mono&family=Crimson+Text:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&family=Bebas+Neue&family=Anton&family=Special+Elite&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
         <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="font-body antialiased">
        <ServiceWorkerRegistration />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
