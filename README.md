# FreedomNex — House Of Wisdom (بَيْتُ الْحِكْمَةِ)

A digital sanctuary inspired by the historic Abbasid **Bayt al-Hikma** (House of Wisdom) in Baghdad. FreedomNex bridges classical Islamic thought, philosophical inquiry, golden age sciences, and moral ethics with a modern, contemplative digital manuscript design.

![FreedomNex Preview](assets/img/logo.jpeg)

---

## 🌟 Key Features

1. **Scroll-Driven 3D Codex Experience (Three.js):**
   - A 3D leather & embossed gold-foil book centered in the hero section.
   - Dynamic page fanning and spine opening synchronized in real-time with scroll progress.
   - Dynamic procedural calligraphy textures (*"اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"* and *"رَّبِّ زِدْنِي عِلْمًا"*).
   - Atmospheric golden ambient dust motes and cursor-guided 3D parallax.
   - Graceful fallback for `prefers-reduced-motion` and legacy devices.

2. **Core Pillars of Wisdom:**
   - 6 structured knowledge pillars: *Qur'an & Tafsir*, *Hadith & Seerah*, *Islamic Philosophy & Kalam*, *Sciences & Golden Age Heritage*, *Ethics & Hikmah*, and *Contemporary Thought & Dialogue*.
   - Interactive topic inspection modals loaded from structured `data/content.json`.

3. **Curated Wisdom Anthology & Carousel:**
   - Rigorously attributed scripture and classical axioms (Surah Al-Baqarah, Sahih Muslim, Al-Kindi, Al-Ghazali, Ibn Sina).
   - Interactive category filtering (Qur'an, Hadith, Philosophy, Ethics), one-click clipboard copying, and auto-play controls.

4. **Structured Learning Paths & Curriculum:**
   - Modular syllabi (WIS-101, PHI-201, SCI-301, ETH-401) with difficulty levels, durations, and key topics.

5. **Historical Timeline & Legacy of Bayt al-Hikma:**
   - Interactive milestone timeline tracing the Baghdad renaissance, the translation movement, the empirical method revolution, and the modern digital revival.

6. **Instant Universal Search & Modals:**
   - Client-side fast search indexing concepts, philosophers, verses, and course tracks.

7. **Zero Backend / 100% Static & GitHub Pages Ready:**
   - No build step required; runs instantly in any modern web browser or static hosting environment.

---

## 📁 Project File Structure

```
freedomnex/
├── index.html               # Main single-page application entry point
├── logo.jpeg                # FreedomNex crest logo
├── README.md                # Documentation & deployment guide
├── agent.md                 # Project brief & requirements
├── assets/
│   ├── css/
│   │   └── style.css        # Complete responsive stylesheet & design system
│   ├── js/
│   │   ├── book-scroll.js   # Three.js 3D book scroll controller & particle system
│   │   └── main.js          # Dynamic data loading, carousel, modals & search
│   └── img/
│       └── logo.jpeg        # Brand asset
└── data/
    └── content.json         # Structured JSON schema (pillars, quotes, courses, timeline)
```

---

## 🚀 How to Run Locally

Because the project loads `data/content.json` asynchronously, running it via a local static web server is recommended:

### Option 1: Python 3 built-in server (Simplest)
```bash
# In the project root directory:
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your web browser.

### Option 2: Node.js `npx serve` / `live-server`
```bash
npx serve .
```

### Option 3: VS Code Live Server extension
Right-click `index.html` and click **"Open with Live Server"**.

---

## 🌐 Deploying to GitHub Pages

Deploying FreedomNex to GitHub Pages takes less than a minute:

### Step 1: Push the repository to GitHub
```bash
git init
git add .
git commit -m "Initial commit: FreedomNex House of Wisdom"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/freedomnex.git
git push -u origin main
```

### Step 2: Enable GitHub Pages in Repository Settings
1. Go to your repository on GitHub.
2. Navigate to **Settings** &rarr; **Pages** (under "Code and automation" in the left sidebar).
3. Under **Build and deployment**:
   - **Source:** Select `Deploy from a branch`.
   - **Branch:** Select `main` (or `gh-pages`) and choose `/ (root)`.
4. Click **Save**.
5. Your website will be live at: `https://<YOUR_USERNAME>.github.io/freedomnex/`

### (Optional) Setting a Custom Domain:
1. In **Settings** &rarr; **Pages**, enter your domain in the **Custom domain** field (e.g. `freedomnex.org`).
2. Add the corresponding `CNAME` or `A` records in your DNS provider pointing to GitHub's servers (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`).
3. Check **Enforce HTTPS** once DNS propagates.

---

## 📜 Content Ethics & Attribution Standards

- **Authenticity & Integrity:** All Qur'anic verses are cited with surah and ayah numbers. All Hadith are referenced to established collections (e.g. Sahih Muslim). Classical philosophical citations (Al-Kindi, Ibn Sina, Al-Ghazali) cite the original treatises.
- **Aniconism:** In adherence with traditional Islamic artistic heritage, visual assets strictly utilize geometric arabesque patterns, illuminated manuscript frames, and calligraphic motifs without figurative depictions.

---

## 📄 License
MIT License. Created for seekers of knowledge, wisdom, and reflection.
