# SayWith — AI Image Generator Prompts Guide

This guide provides detailed, production-ready AI image generator prompts (optimized for **Midjourney v6**, **DALL-E 3**, **Flux.1**, and **Stable Diffusion XL**) to generate all custom non-template images for the SayWith landing page.

Each entry includes:
- **Target Size & Aspect Ratio**
- **Where to configure it** in `public/data/site-config.json`
- **Recommended Model Prompt**
- **Style Keywords & Atmosphere Parameters**
- **Negative Prompts** (to avoid unwanted clutter)

---

## 1. Hero Background Image

- **Target Size**: `1920 × 1080 px` (Aspect Ratio: `16:9`)
- **JSON Field**: `"bgImageUrl"` inside `public/data/site-config.json` (`hero` object)
- **Design Requirement**: Must remain visible through the dark translucent overlay while keeping foreground UI text crystal clear.

### Prompt (Midjourney / Flux / DALL-E 3)
```text
Atmospheric cinematic night scene, subtle warm bokeh lights in the distance, moody deep navy blue and dark indigo tones with soft warm amber glow, gentle romantic particles floating in the air, smooth depth of field, elegant cinematic lighting, minimal and uncluttered composition, cozy emotional ambiance, clean modern aesthetic, 8k resolution, shot on 35mm lens, f/1.8, master photograph --ar 16:9 --style raw --v 6.0
```

### Negative Prompt
```text
text, watermark, logo, bright distracting glare, loud saturated colors, cluttered objects, oversaturated, low quality, noisy artifacts
```

---

## 2. Hero Physical Keepsake Mockup — Keychain Photo Insert

- **Target Size**: `600 × 800 px` (Aspect Ratio: `3:4` portrait) or `800 × 800 px` (1:1 square)
- **JSON Field**: `"keychainPhotoUrl"` inside `public/data/site-config.json` (`hero` object)
- **Design Requirement**: High-contrast, heartfelt portrait of a couple or memorable milestone that looks stunning inside an acrylic keychain mockup.

### Prompt (Midjourney / Flux / DALL-E 3)
```text
Candid portrait photograph of an attractive happy young couple laughing together during golden hour sunset, soft warm sunlight rim lighting on hair, genuine smiles, intimate and romantic moment, natural cinematic depth of field with blurry sunset backdrop, shot on 85mm f/1.4 portrait lens, Kodak Portra 400 film tones, photorealistic, 8k --ar 3:4 --v 6.0
```

### Negative Prompt
```text
stiff pose, exaggerated facial expressions, artificial plastic skin, oversaturated, blurry faces, deformed hands
```

---

## 3. Hero Physical Keepsake Mockup — Styled QR Code Photo Card

- **Target Size**: `600 × 600 px` (Aspect Ratio: `1:1` square)
- **JSON Field**: `"styledQrPhotoUrl"` inside `public/data/site-config.json` (`hero` object)
- **Design Requirement**: An artistic mini photo card blending a couple portrait with elegant floral/gold borders and a stylized decorative QR code element.

### Prompt (Midjourney / Flux / DALL-E 3)
```text
Flatlay product photography of a personalized custom mini photo keepsake card on textured handmade cotton paper, soft pastel rose and warm cream tones, subtle gold foil embossed decorative border, centered scannable stylized artistic QR code element harmonized with a miniature couple polaroid photo, elegant aesthetic, soft daylight from side, clean minimalist luxury gift styling --ar 1:1 --v 6.0
```

### Negative Prompt
```text
ugly barcode, messy lines, dirty background, high contrast harsh black boxes, text errors, dark shadows
```

---

## 4. Hero Smartphone Screen Preview Media

- **Target Size**: `1080 × 1920 px` (Aspect Ratio: `9:16` vertical mobile)
- **JSON Field**: `"phonePreviewMediaUrl"` inside `public/data/site-config.json` (`hero` object)
- **Design Requirement**: Full-screen vertical cinematic visual that appears inside the flagship smartphone mockup.

### Prompt (Midjourney / Flux / DALL-E 3)
```text
Cinematic vertical portrait shot of a romantic couple holding hands and walking under twinkling warm fairy lights at dusk in an outdoor garden, dreamy bokeh spheres, cinematic cyan and warm amber color grading, emotional cinematic film still, shot on Sony A7R V with 50mm f/1.2 lens, ultra realistic, award-winning cinematography --ar 9:16 --v 6.0
```

### Negative Prompt
```text
landscape horizontal, text, subtitles, UI overlay, distorted proportions, low quality
```

---

## 5. Showcase Card 1 — Classic Acrylic NFC Keychain Product Photo

- **Target Size**: `1000 × 800 px` (Aspect Ratio: `5:4` or `4:3`)
- **JSON Field**: `"acrylicKeychainImageUrl"` inside `public/data/site-config.json` (`showcaseMedia` object)
- **Design Requirement**: Clean, premium product photography of a crystal-clear acrylic photo keychain with stainless steel ring.

### Prompt (Midjourney / Flux / DALL-E 3)
```text
Commercial product photography of a modern crystal-clear acrylic rectangular photo keychain with rounded corners and a premium stainless steel key ring, lying on a beige linen fabric and polished light oak surface, soft sunlight casting beautiful transparent glass refractions, a vibrant mini couple photo visible through the acrylic, minimal luxury aesthetic, studio lighting, hyper-detailed, 8k --ar 5:4 --v 6.0
```

### Negative Prompt
```text
scratched plastic, cheap hardware, dust, fingerprints, messy room, low quality 3D render
```

---

## 6. Showcase Card 2 — Styled QR Code Photo Card Flatlay

- **Target Size**: `1000 × 800 px` (Aspect Ratio: `5:4` or `4:3`)
- **JSON Field**: `"styledQrCardImageUrl"` inside `public/data/site-config.json` (`showcaseMedia` object)
- **Design Requirement**: Shows a wallet-sized or pocket photo card with artistic QR code styling.

### Prompt (Midjourney / Flux / DALL-E 3)
```text
Minimalist top-down flatlay photography of an artistic custom styled QR photo keepsake card, size of a credit card, printed on thick luxury matte cardstock with rounded corners, featuring a lovely romantic photo with a scannable styled QR pattern smoothly integrated into the art, placed next to a single dried pressed flower and subtle kraft paper envelope, soft warm morning lighting, aesthetic Pinterest style --ar 5:4 --v 6.0
```

### Negative Prompt
```text
plain black and white barcode, pixelated graphic, unreadable mess, cluttered desk
```

---

## 7. Showcase Card 3 — Smartphone Tapping Keychain (NFC in Action)

- **Target Size**: `1000 × 800 px` (Aspect Ratio: `5:4` or `4:3`)
- **JSON Field**: `"phoneTapImageUrl"` inside `public/data/site-config.json` (`showcaseMedia` object)
- **Design Requirement**: Demonstrates the real-world action of holding a smartphone near the acrylic keychain to trigger the instant tap.

### Prompt (Midjourney / Flux / DALL-E 3)
```text
Macro photography close-up of a person's manicured hands holding a sleek flagship smartphone, gently tapping the top edge of the phone against an acrylic photo keychain lying on a clean coffee shop wooden table, soft subtle blue ethereal light ripple indicating smart NFC contact, cozy natural lighting, shallow depth of field, tech-meets-warm-lifestyle aesthetic --ar 5:4 --v 6.0
```

### Negative Prompt
```text
distorted fingers, extra thumbs, cartoon glow, aggressive lightning bolts, futuristic holograms, messy background
```

---

## 8. Showcase Card 4 — Gift Packaging & Unboxing Presentation

- **Target Size**: `1000 × 800 px` (Aspect Ratio: `5:4` or `4:3`)
- **JSON Field**: `"giftPackagingImageUrl"` inside `public/data/site-config.json` (`showcaseMedia` object)
- **Design Requirement**: Unboxing presentation ready to be gifted to a partner or loved one.

### Prompt (Midjourney / Flux / DALL-E 3)
```text
High-end luxury gift unboxing flatlay, an open matte navy blue or charcoal gift presentation box with plush soft black velvet interior, inside rests a crystal-clear custom photo keychain with a silver ring, accompanied by a matching styled QR code photo card and an elegant tied silk ribbon, sophisticated gift presentation, warm studio lighting, 8k commercial photo --ar 5:4 --v 6.0
```

### Negative Prompt
```text
damaged cardboard box, wrinkled ribbon, plastic wrapping, harsh flash reflections, low-budget look
```

---

## 9. Bespoke & Custom Design Banner Image

- **Target Size**: `1200 × 600 px` (Aspect Ratio: `2:1`) or `1600 × 900 px` (Aspect Ratio: `16:9`)
- **JSON Field**: Can be added as `"customBannerUrl"`
- **Design Requirement**: Illustrates custom digital design work, bespoke animations, and personalized creative craftsmanship.

### Prompt (Midjourney / Flux / DALL-E 3)
```text
Inspiring creative digital design studio atmosphere, a designer's desk with an iPad Pro displaying glowing interactive UI animation wireframes with floating heart particles, mood board with couple photography, color swatches in champagne and rose gold, warm ambient desk lamp, clean contemporary aesthetic, creative craftsmanship, depth of field --ar 16:9 --v 6.0
```

---

## Summary of Sizes Quick Reference

| Asset | Recommended Dimensions | Aspect Ratio | JSON Field in `public/data/site-config.json` |
|---|---|---|---|
| **Hero Background** | `1920 × 1080 px` | `16:9` | `hero.bgImageUrl` |
| **Keychain Photo Mockup** | `600 × 800 px` or `800 × 800 px` | `3:4` or `1:1` | `hero.keychainPhotoUrl` |
| **Styled QR Photo Mockup** | `600 × 600 px` | `1:1` | `hero.styledQrPhotoUrl` |
| **Hero Phone Media** | `1080 × 1920 px` | `9:16` | `hero.phonePreviewMediaUrl` |
| **Acrylic Keychain Card** | `1000 × 800 px` | `5:4` | `showcaseMedia.acrylicKeychainImageUrl` |
| **Styled QR Photo Card** | `1000 × 800 px` | `5:4` | `showcaseMedia.styledQrCardImageUrl` |
| **Phone NFC Tap Card** | `1000 × 800 px` | `5:4` | `showcaseMedia.phoneTapImageUrl` |
| **Gift Unboxing Card** | `1000 × 800 px` | `5:4` | `showcaseMedia.giftPackagingImageUrl` |
| **Custom Design Banner** | `1600 × 900 px` | `16:9` | (Optional banner) |
