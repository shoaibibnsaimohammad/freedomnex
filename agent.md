# FreedomNex — "House Of Wisdom"
### Prompt for generating a static, GitHub-Pages-ready website

Use this document as the full build brief. Generate a complete static website (HTML/CSS/JS, no backend, no build step required — or Vite if a bundler is preferred, but the final output must be static files deployable directly to GitHub Pages).

---

## 1. Project Identity

- **Platform Name:** FreedomNex
- **Tagline:** "House Of Wisdom"
- **Category:** Islamic, educational, philosophical & wisdom platform
- **Purpose:** A digital "House of Wisdom" (inspired by Bayt al-Hikma, the historic Abbasid center of learning) — a home for Islamic knowledge, philosophy, reflection, and education, presented through a modern, immersive, premium digital experience.
- **Tone:** Reverent, calm, intellectual, elegant — not flashy or gimmicky. Think "digital manuscript meets modern web design."

---

## 2. Core Concept — The Signature Interaction

The hero section shows a **closed 3D book** floating/resting center-stage. As the user scrolls down from the hero, the book **opens in 3D**, its pages turning/fanning outward in sync with scroll position (scroll-driven, not autoplay), revealing content on the "pages" — snippets of wisdom, calligraphy, or section previews — before transitioning into the rest of the site.

**Implementation approach:**
- Build the book as a 3D scene using **Three.js** (via CDN, e.g. `three@0.160+`) with a simple `PlaneGeometry`-based page-turn (hinge/skew transform per page, or shader-based curl if time allows) — avoid GLTF dependency unless a lightweight custom book model is generated.
- Alternative lighter-weight approach if Three.js is overkill: pure CSS 3D transforms (`perspective`, `rotateY`, `transform-style: preserve-3d`) on a stack of `<div>` "pages," driven by a scroll-linked JS controller (IntersectionObserver + scroll progress calculation, or GSAP ScrollTrigger via CDN).
- Bind page rotation angle directly to scroll progress within the hero container (pin the hero section using `position: sticky` for ~150–200vh of scroll distance while the book animates, similar to Apple product-page scroll storytelling).
- Cover design: dark leather/deep emerald or midnight-blue texture with gold-leaf embossed title "FreedomNex" and subtitle "House Of Wisdom" in an Arabic-calligraphy-inspired serif, plus a subtle geometric Islamic pattern (8-point star / arabesque) border.
- Inner pages (revealed mid-scroll): parchment/cream texture, thin gold rule lines, a short rotating wisdom quote (Quranic ayah reference, hadith, or philosopher quote — clearly attributed) rendered in elegant typography.
- On full open, the book fades/scales into the main site content (About/Sections) — smooth crossfade, no jarring cut.
- Must degrade gracefully: on low-power devices or reduced-motion preference (`prefers-reduced-motion`), replace the 3D animation with a simple fade/slide static illustration of an open book — always respect accessibility settings.

---

## 3. Visual & Brand Design

**Palette:**
- Primary: Deep emerald green `#0B3D2E` or midnight navy `#0B1B2B`
- Accent: Warm gold / brass `#C9A662`
- Background: Warm off-white / parchment `#F7F2E7` for light sections, deep charcoal `#111417` for dark sections
- Support: Muted teal, ivory, soft bronze

**Typography:**
- Headings: an elegant serif with slight calligraphic character (e.g. "Amiri", "Cormorant Garamond", or "Playfair Display" from Google Fonts) — Amiri also supports Arabic script for authentic Quranic/Arabic excerpts.
- Body: a clean, highly legible serif or humanist sans (e.g. "Lora" or "Inter") for long-form reading comfort.
- Arabic text (ayat, du'as) rendered in a proper Arabic typeface (e.g. "Amiri" or "Scheherazade New") with correct RTL direction.

**Motifs:**
- Geometric Islamic patterns (8/12-point stars, arabesque line work) as subtle SVG background textures, section dividers, and border accents — never overpowering text.
- Gold-leaf line accents, thin hairline rules, generous whitespace/parchment breathing room.
- Avoid depicting human or animal figures per Islamic art convention; use geometric/calligraphic/vegetal (arabesque) motifs only.

**Motion:**
- Smooth, slow, intentional easing (no bouncy/playful easing — this is a contemplative brand).
- Scroll-reveal fade-ups for content blocks (IntersectionObserver-based).
- Subtle parallax on background patterns only — content stays crisp and readable.

---

## 4. Site Structure / Sections

1. **Hero** — Full-viewport. Platform wordmark "FreedomNex," tagline "House Of Wisdom" in Arabic + English, the 3D closed book centered, subtle ambient particles/light rays, a scroll-down cue (e.g. small animated chevron).
2. **The Opening Book (scroll-pinned sequence)** — as described in Section 2.
3. **About / Mission** — Short manifesto: what FreedomNex is, why "House of Wisdom" (nod to Bayt al-Hikma), who it serves (seekers of knowledge, students, reflective minds).
4. **Pillars / Categories** — Grid or card layout of core content pillars, e.g.:
   - Qur'an & Tafsir
   - Hadith & Seerah
   - Islamic Philosophy & Kalam
   - History of Islamic Civilization
   - Ethics & Wisdom (Hikmah)
   - Contemporary Reflections
   Each card: icon (geometric/line-art style, no figurative imagery), short description, "Explore" link (can be placeholder `#` anchors).
5. **Featured Wisdom** — A rotating/carousel strip of short quotes (ayah, hadith, or philosopher quote) each with proper attribution and source citation — paraphrase or use only short public-domain/scripture excerpts; do not fabricate translations, cite the surah/ayah number or hadith reference clearly.
6. **Library / Learning Paths** — Preview of structured courses or reading paths (cards: title, level, duration, short blurb) — placeholder content is fine, structured for easy future CMS/data-driven population (e.g. from a `content.json`).
7. **Testimonials / Community** *(optional)* — Simple, tasteful quote blocks from "learners," no fabricated real names/photos — use generic first names or omit.
8. **Newsletter / Join Signup** — Minimal email capture form (static — can post to a placeholder or Formspree-style endpoint), styled consistent with the parchment/gold theme.
9. **Footer** — Wordmark, tagline, nav links, social icons (line-art), small Arabic calligraphy flourish, copyright.

---

## 5. Technical Requirements

- **Output:** Fully static site — plain HTML/CSS/JS (or a bundler like Vite producing static `dist/`) suitable for GitHub Pages (`/docs` folder or `gh-pages` branch).
- **No server-side code, no databases.**
- **Libraries (via CDN, keep dependencies minimal):**
  - Three.js (only if used for the 3D book)
  - GSAP + ScrollTrigger (for scroll-linked animation) — good lightweight alternative/complement to raw Three.js scroll math
  - Google Fonts (Amiri, Cormorant Garamond or Playfair Display, Lora/Inter)
- **Responsive:** Mobile-first; on small screens, simplify the 3D book to a lighter 2D/CSS animation or a shorter scroll-pin distance for performance.
- **Performance:** Lazy-load heavy scripts, compress any images/textures, target good Lighthouse scores; avoid huge GLTF/texture assets.
- **Accessibility:** Semantic HTML, proper heading hierarchy, alt text, sufficient color contrast (verify gold-on-dark and text-on-parchment contrast ratios), `prefers-reduced-motion` fallback, keyboard-navigable nav/menu.
- **SEO basics:** Proper `<title>`, meta description, Open Graph tags, favicon (simple geometric star/book monogram).
- **File structure suggestion:**
  ```
  /
  ├── index.html
  ├── /assets
  │   ├── /css/style.css
  │   ├── /js/main.js
  │   ├── /js/book-scroll.js
  │   ├── /fonts (if self-hosted)
  │   └── /img (patterns, favicon, textures)
  ├── /data/content.json   (pillars, quotes, courses — for easy editing)
  └── README.md
  ```
- **Deployment:** Include a short `README.md` section explaining how to enable GitHub Pages (Settings → Pages → deploy from `main` / `docs` folder or `gh-pages` branch) and how to set a custom domain if desired.

---

## 6. Content Guardrails

- All Qur'anic ayat and hadith must be clearly attributed with surah:ayah or hadith source/reference — use only short, well-known excerpts, never long verbatim passages beyond fair, clearly-cited quotation.
- Maintain neutrality and respect: present mainstream, non-sectarian framing of Islamic wisdom and philosophy unless the user specifies a particular school of thought.
- No figurative (human/animal) imagery — geometric, calligraphic, and arabesque decoration only, consistent with traditional Islamic aesthetic conventions.
- Placeholder text should be clearly marked as such (e.g. `[Course description placeholder]`) so it's easy to replace with real content later.

---

## 7. Deliverable Summary

Build the complete static site described above: a visually rich, calm, premium-feeling single-page (or lightly multi-page) site named **FreedomNex — House Of Wisdom**, centered on a scroll-driven 3D book-opening hero moment, followed by well-organized sections on Islamic knowledge, philosophy, and wisdom, fully responsive, accessible, and ready to deploy to GitHub Pages with zero backend dependencies.