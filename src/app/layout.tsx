import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "SayWith – Send Messages That Matter",
  description: "Create and send messages that truly resonate. A modern, animated landing page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        
<title>SayWith — Say it with style. Make it unforgettable.</title>
<meta name="title" content="SayWith — Say it with style. Make it unforgettable.">
<meta name="description" content="Transform your words, media, and ideas into stunning, shareable templates. Create, customize, and share your vision with SayWith.">


<meta name="keywords" content="SayWith, templates, QR code, social media design, Gen Z marketing, creative media, Instagram story templates, Facebook story templates, digital design, QR code sharing, logo design, motivational templates, video templates">
<meta name="author" content="SayWith Team">
<meta name="robots" content="index, follow">


<meta property="og:type" content="website">
<meta property="og:url" content="https://www.saywith.com/">
<meta property="og:title" content="SayWith — Say it with style. Make it unforgettable.">
<meta property="og:description" content="Create stunning media templates, share via QR codes, and make your message pop. Perfect for Gen Z and beyond.">
<meta property="og:image" content="https://www.saywith.com/icons/icon-512x512.png">
<meta property="og:site_name" content="SayWith">


<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://www.saywith.com/">
<meta name="twitter:title" content="SayWith — Say it with style. Make it unforgettable.">
<meta name="twitter:description" content="Transform your words, media, and ideas into stunning, shareable templates.">
<meta name="twitter:image" content="https://www.saywith.com/icons/icon-512x512.png">


<meta name="tiktok:creator" content="@saywith">
<meta name="tiktok:description" content="Turn your message into a visual masterpiece with SayWith.">
<meta name="tiktok:image" content="https://www.saywith.com/icons/icon-384x384.png">


<link rel="icon" href="/icons/favicon.ico" type="image/x-icon">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png">


<link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png">
<link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png">
<link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png">
<link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png">
<link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SayWith",
  "url": "https://www.saywith.com/",
  "description": "Transform your words, media, and ideas into stunning, shareable templates. Create, customize, and share your vision with SayWith.",
  "publisher": {
    "@type": "Organization",
    "name": "SayWith",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.saywith.com/icons/icon-512x512.png",
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
}
</script>

  
  
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
