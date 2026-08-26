/**
 * FreedomNex — House of Wisdom
 * Main Application Logic & Interactivity
 */

(function () {
  'use strict';

  // State
  let siteData = null;
  let currentQuoteIndex = 0;
  let filteredQuotes = [];
  let currentQuoteFilter = 'all';
  let carouselTimer = null;

  // DOM Elements
  const header = document.querySelector('.site-header');
  const pillarsContainer = document.getElementById('pillars-grid');
  const wisdomDisplay = document.getElementById('quote-display-container');
  const carouselDots = document.getElementById('carousel-indicators');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const pathsContainer = document.getElementById('paths-grid');
  const timelineContainer = document.getElementById('timeline-container');
  const testimonialsContainer = document.getElementById('testimonials-grid');
  const searchModal = document.getElementById('search-modal');
  const pillarModal = document.getElementById('pillar-modal');
  const toast = document.getElementById('toast-notice');
  const newsletterForm = document.getElementById('newsletter-form');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Fallback data in case of file:// protocol CORS restrictions
  const defaultFallbackData = {
    "platform": {
      "name": "FreedomNex",
      "tagline": "House Of Wisdom",
      "arabicTitle": "بَيْتُ الْحِكْمَةِ",
      "contact": {
        "phone": "+919211043281",
        "phoneFormatted": "+91 92110 43281",
        "whatsapp": "+919211043281"
      }
    },
    "pillars": [
      {
        "id": "quran-tafsir",
        "title": "Qur'an & Classical Exegesis",
        "arabic": "القرآن الكريم والتفسير",
        "icon": "book-open",
        "summary": "Exploring linguistic nuance, thematic coherence, and timeless hermeneutics across classical and contemporary exegesis.",
        "details": "Delve into the foundational text of Islam through the analytical lenses of classical mufassirun (Al-Tabari, Al-Zamakhshari, Ibn Kathir, Al-Razi) alongside modern linguistic and thematic methodologies.",
        "topics": ["Linguistic Miracles (I'jaz)", "Asbab al-Nuzul (Contexts)", "Thematic Surah Analysis", "Comparative Tafsir Traditions"]
      },
      {
        "id": "hadith-seerah",
        "title": "Hadith & Prophetic Seerah",
        "arabic": "الحديث النبوي والسيرة",
        "icon": "scroll",
        "summary": "Rigorous critical transmission methodology, moral archetype analysis, and the historical life of the Prophet ﷺ.",
        "details": "Study the science of Isnad (chains of transmission) and Matn (content critique), examining how ethical paradigms and living traditions were rigorously documented and preserved.",
        "topics": ["Mustalah al-Hadith (Hadith Terminology)", "Seerah as Moral Philosophy", "Shama'il Muhammadiyyah (Prophetic Character)", "Hadith in Legal Reasoning"]
      },
      {
        "id": "philosophy-kalam",
        "title": "Islamic Philosophy & Kalam",
        "arabic": "الفلسفة الإسلامية وعلم الكلام",
        "icon": "compass",
        "summary": "The dialogue between rational inquiry and revelation from Al-Kindi, Al-Farabi, and Ibn Sina to Al-Ghazali and Ibn Rushd.",
        "details": "Investigate the golden intellectual debates of the Abbasid and Andalusian eras: the nature of existence, epistemology, divine attributes, causality, and the harmony of reason (Aql) and revelation (Naql).",
        "topics": ["Kalam Cosmological Arguments", "Ibn Sina's Metaphysics of Being", "Al-Ghazali's Tahafut & Epistemology", "Ibn Rushd's Fasl al-Maqal"]
      },
      {
        "id": "sciences-civilization",
        "title": "Sciences & Golden Age Heritage",
        "arabic": "العلوم وتاريخ الحضارة",
        "icon": "globe",
        "summary": "Pioneering breakthroughs in astronomy, optics, algebra, medicine, and architecture at Bayt al-Hikma and beyond.",
        "details": "Discover how the synthesis of world knowledge in Baghdad, Cairo, Córdoba, and Samarkand sparked revolutionary advancements in empirical science by Ibn al-Haytham, Al-Khwarizmi, Al-Biruni, and Al-Zahrawi.",
        "topics": ["The Baghdad Translation Movement", "Optics & Empirical Scientific Method", "Algebra & Astronomy (Al-Zij)", "Islamic Medical Ethics & Hospitals (Bimaristans)"]
      },
      {
        "id": "ethics-hikmah",
        "title": "Ethics, Tazkiyah & Hikmah",
        "arabic": "الأخلاق والتزكية والحكمة",
        "icon": "heart",
        "summary": "Inner cultivation, virtue ethics, philosophical psychology, and the purification of the heart.",
        "details": "A contemplative exploration of moral virtue and spiritual realization, drawing from classical treatises of Akhlaq (Miskawayh, Al-Raghib al-Isfahani) and inward purification (Al-Ghazali's Ihya Ulum al-Din).",
        "topics": ["Virtue Ethics (Tahdhib al-Akhlaq)", "Spiritual Psychology of the Heart", "Contemplative Silence & Dhikr", "Social Justice & Ethical Responsibility"]
      },
      {
        "id": "contemporary-reflections",
        "title": "Contemporary Thought & Dialogue",
        "arabic": "الفكر المعاصر والحوار",
        "icon": "feather",
        "summary": "Engaging today's philosophical questions, technology ethics, artificial intelligence, and civilizational renewal.",
        "details": "Applying the depth of classical Islamic wisdom to modern existential inquiries: bioethics, environmental stewardship (Khilafah), algorithmic ethics, and fostering constructive cross-cultural discourse.",
        "topics": ["Islamic Perspectives on AI & Consciousness", "Environmental Ethics & Eco-Theology", "Epistemological Decolonization", "Interfaith Philosophical Discourse"]
      }
    ],
    "wisdomQuotes": [
      {
        "id": "quran-2-269",
        "category": "Qur'an",
        "arabic": "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ ۚ وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا ۗ وَمَا يَذَّكَّرُ إِلَّا أُولُو الْأَلْبَابِ",
        "translation": "He grants wisdom to whom He pleases; and whoever is granted wisdom has certainly been given an abundance of good. But none will remember except those of understanding.",
        "source": "Holy Qur'an — Surah Al-Baqarah [2:269]",
        "context": "The divine definition of 'Hikmah' (deep discernment combining true knowledge with virtuous conduct)."
      },
      {
        "id": "hadith-muslim-2699",
        "category": "Hadith",
        "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
        "translation": "Whoever treads a path in pursuit of knowledge, Allah will facilitate for them a path to Paradise.",
        "source": "Prophetic Tradition — Sahih Muslim 2699",
        "context": "The fundamental sanctification of intellectual seeking and continuous learning in Islamic tradition."
      },
      {
        "id": "al-kindi-truth",
        "category": "Classical Philosophy",
        "arabic": "يَنْبَغِي لَنَا أَلَّا نَسْتَحِيَ مِنَ اسْتِحْسَانِ الْحَقِّ وَاقْتِنَاءِ الْحَقِّ مِنْ أَيْنَ أَتَى",
        "translation": "We ought not to be embarrassed of appreciating the truth and of obtaining it wherever it comes from, even if it comes from earlier generations and foreign peoples.",
        "source": "Abu Yusuf Ya'qub ibn Ishaq Al-Kindi — Fi al-Falsafah al-Ula (c. 840 CE)",
        "context": "The foundational manifesto of the Baghdad House of Wisdom, establishing universal intellectual open-mindedness."
      },
      {
        "id": "al-ghazali-knowledge",
        "category": "Ethics & Hikmah",
        "arabic": "الْعِلْمُ بِلَا عَمَلٍ جُنُونٌ، وَالْعَمَلُ بِغَيْرِ عِلْمٍ لَا يَكُونُ",
        "translation": "Knowledge without action is insanity, and action without knowledge is vanity.",
        "source": "Imam Abu Hamid Al-Ghazali — Ayyuha al-Walad",
        "context": "The inseparable union between intellectual mastery and moral manifestation in daily conduct."
      },
      {
        "id": "ibn-sina-reason",
        "category": "Classical Philosophy",
        "arabic": "الْوَهْمُ نِصْفُ الدَّاءِ، وَالِاطْمِئْنَانُ نِصْفُ الدَّوَاءِ، وَالصَّبْرُ أَوَّلُ خُطُوَاتِ الشِّفَاءِ",
        "translation": "Anxiety is half the disease, tranquility is half the remedy, and patience is the first step toward healing.",
        "source": "Ibn Sina (Avicenna) — Al-Qanun fi al-Tibb",
        "context": "Holistic psychosomatic wisdom linking mental serenity, emotional balance, and physical well-being."
      }
    ],
    "learningPaths": [
      {
        "id": "path-1",
        "code": "WIS-101",
        "title": "Foundations of Hikmah: The Classical Mind",
        "level": "Introductory",
        "duration": "6 Weeks • 18 Modules",
        "badge": "Core Curriculum",
        "description": "An essential journey into the core epistemology of classical Islamic thought, tracing how reason and revelation flourished together.",
        "modules": [
          "Epistemology: Sources of Knowledge in Islam",
          "The Baghdad Renaissance & Translation Movement",
          "Logic (Mantiq) and Classical Argumentation",
          "Virtue Ethics & Character Transformation"
        ]
      },
      {
        "id": "path-2",
        "code": "PHI-201",
        "title": "The Great Debates: Kalam vs. Falsafah",
        "level": "Intermediate",
        "duration": "8 Weeks • 24 Modules",
        "badge": "Philosophy",
        "description": "Examine the rigorous metaphysical dialogues between the Mu'tazilites, Ash'arites, Avicennian philosophers, and Ghazalian critique.",
        "modules": [
          "The Nature of Existence & Causality",
          "The Problem of Free Will (Qadar)",
          "Tahafut al-Falasifah & Its Counter-Critiques",
          "Ibn Rushd's Doctrine of Double Truth Explored"
        ]
      },
      {
        "id": "path-3",
        "code": "SCI-301",
        "title": "The Golden Age of Discovery & Empirical Method",
        "level": "All Levels",
        "duration": "5 Weeks • 15 Modules",
        "badge": "History of Science",
        "description": "Discover how Muslim polymaths established the modern empirical scientific method through optics, astronomy, medicine, and geometry.",
        "modules": [
          "Ibn al-Haytham's Book of Optics & Experimentation",
          "Al-Biruni's Earth Circumference & Geodesy",
          "Astrolabes, Observatories & Celestial Geometry",
          "Bimaristans: The Birth of the Modern Hospital System"
        ]
      },
      {
        "id": "path-4",
        "code": "ETH-401",
        "title": "Contemplative Ethics & Modern Technology",
        "level": "Advanced",
        "duration": "6 Weeks • 16 Modules",
        "badge": "Contemporary Inquiry",
        "description": "A pioneering course synthesizing ancient Islamic moral psychology with modern challenges in artificial intelligence and transhumanism.",
        "modules": [
          "The Fitrah (Human Nature) in the Age of Algorithms",
          "Islamic Bioethics & Genetic Technologies",
          "Ecology, Stewardship (Khilafah) & Climate Ethics",
          "Cultivating Digital Solitude and Presence"
        ]
      }
    ],
    "timeline": [
      {
        "year": "762 CE",
        "title": "Foundation of Baghdad",
        "description": "Caliph Al-Mansur establishes Madinat al-Salam (The City of Peace), commissioning the first major palace libraries and intellectual circles."
      },
      {
        "year": "813–833 CE",
        "title": "The Golden Peak of Bayt al-Hikma",
        "description": "Caliph Al-Ma'mun elevates the House of Wisdom into the world's preeminent academy, observatory, and translation epicenter."
      },
      {
        "year": "965–1040 CE",
        "title": "The Empirical Revolution",
        "description": "Al-Hasan Ibn al-Haytham pioneers the modern scientific method in Cairo, formulating controlled experimental verification in 'Kitab al-Manazir'."
      },
      {
        "year": "1058–1111 CE",
        "title": "The Ghazalian Synthesis",
        "description": "Imam Abu Hamid Al-Ghazali harmonizes rational jurisprudence, spiritual psychology, and intellectual epistemology in 'Ihya Ulum al-Din'."
      },
      {
        "year": "Present Day",
        "title": "FreedomNex House Of Wisdom",
        "description": "Reviving the universal spirit of open inquiry, moral clarity, and timeless contemplation for the digital generation."
      }
    ],
    "testimonials": [
      {
        "quote": "FreedomNex captures the rare harmony between rigorous classical scholarship and an exquisitely designed, contemplative digital environment.",
        "author": "Dr. Tariq M.",
        "role": "Lecturer in Comparative Philosophy"
      },
      {
        "quote": "The scroll-linked manuscript experience evokes the awe of opening ancient codices in Baghdad, while making classical wisdom instantly accessible.",
        "author": "Maryam K.",
        "role": "Researcher in Islamic Intellectual History"
      },
      {
        "quote": "A masterclass in reverent, thoughtful digital design. In an age of endless digital distraction, this is a sanctuary of depth.",
        "author": "Zayd A.",
        "role": "Software Architect & Philosophy Student"
      }
    ]
  };

  // Initialize
  async function init() {
    setupScrollHeader();
    await loadContentData();
    renderPillars();
    setupWisdomCarousel();
    renderLearningPaths();
    renderTimeline();
    renderTestimonials();
    setupEventListeners();
  }

  // 1. Scroll-linked Navigation Header
  function setupScrollHeader() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 2. Fetch or load content data
  async function loadContentData() {
    try {
      const response = await fetch('data/content.json');
      if (response.ok) {
        siteData = await response.json();
      } else {
        siteData = defaultFallbackData;
      }
    } catch (err) {
      siteData = defaultFallbackData;
    }
  }

  // 3. Render Pillars
  function renderPillars() {
    if (!pillarsContainer || !siteData.pillars) return;

    pillarsContainer.innerHTML = siteData.pillars.map(pillar => `
      <article class="pillar-card" data-id="${pillar.id}">
        <div>
          <div class="pillar-icon-box">
            <i class="fas fa-${pillar.icon}"></i>
          </div>
          <div class="pillar-arabic-title">${pillar.arabic}</div>
          <h3 class="pillar-title">${pillar.title}</h3>
          <p class="pillar-summary">${pillar.summary}</p>
          <ul class="pillar-topics-list">
            ${pillar.topics.slice(0, 3).map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
        <button class="pillar-explore-btn" onclick="window.FreedomNexApp.openPillarModal('${pillar.id}')" aria-label="Explore ${pillar.title}">
          <span>Explore Pillar</span>
          <i class="fas fa-arrow-right"></i>
        </button>
      </article>
    `).join('');
  }

  // 4. Featured Wisdom Carousel
  function setupWisdomCarousel() {
    if (!siteData.wisdomQuotes) return;
    filteredQuotes = [...siteData.wisdomQuotes];
    currentQuoteIndex = 0;
    renderCurrentQuote();
    startCarouselAutoPlay();

    filterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        filterTabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const filter = e.currentTarget.getAttribute('data-filter');
        currentQuoteFilter = filter;

        if (filter === 'all') {
          filteredQuotes = [...siteData.wisdomQuotes];
        } else {
          filteredQuotes = siteData.wisdomQuotes.filter(q => q.category.toLowerCase().includes(filter.toLowerCase()));
        }
        currentQuoteIndex = 0;
        renderCurrentQuote();
        restartCarouselTimer();
      });
    });
  }

  function renderCurrentQuote() {
    if (!wisdomDisplay || filteredQuotes.length === 0) return;
    const q = filteredQuotes[currentQuoteIndex];

    wisdomDisplay.innerHTML = `
      <span class="quote-category-tag">✦ ${q.category} ✦</span>
      <div class="quote-arabic-text">${q.arabic}</div>
      <p class="quote-english-text">"${q.translation}"</p>
      <div class="quote-source-badge">${q.source}</div>
      <div class="quote-context-note">${q.context || ''}</div>
    `;

    // Render Indicator Dots
    if (carouselDots) {
      carouselDots.innerHTML = filteredQuotes.map((_, idx) => `
        <button class="indicator-dot ${idx === currentQuoteIndex ? 'active' : ''}" 
                onclick="window.FreedomNexApp.jumpToQuote(${idx})" 
                aria-label="Go to quote ${idx + 1}"></button>
      `).join('');
    }
  }

  function startCarouselAutoPlay() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
      nextQuote();
    }, 7000);
  }

  function restartCarouselTimer() {
    startCarouselAutoPlay();
  }

  function nextQuote() {
    if (filteredQuotes.length === 0) return;
    currentQuoteIndex = (currentQuoteIndex + 1) % filteredQuotes.length;
    renderCurrentQuote();
  }

  function prevQuote() {
    if (filteredQuotes.length === 0) return;
    currentQuoteIndex = (currentQuoteIndex - 1 + filteredQuotes.length) % filteredQuotes.length;
    renderCurrentQuote();
  }

  // 5. Render Structured Learning Paths
  function renderLearningPaths() {
    if (!pathsContainer || !siteData.learningPaths) return;

    pathsContainer.innerHTML = siteData.learningPaths.map(path => `
      <article class="path-card">
        <div>
          <div class="path-top-meta">
            <span class="path-code-badge">${path.code}</span>
            <span class="path-level-tag">${path.level}</span>
          </div>
          <h3 class="path-title">${path.title}</h3>
          <div class="path-duration">
            <i class="far fa-clock"></i>
            <span>${path.duration}</span>
          </div>
          <p class="path-desc">${path.description}</p>
          <div class="path-modules-box">
            <span class="path-modules-title">Curriculum Highlights:</span>
            <ul class="path-modules-list">
              ${path.modules.map(m => `<li>${m}</li>`).join('')}
            </ul>
          </div>
        </div>
        <button class="btn-gold-primary" onclick="window.FreedomNexApp.showToast('Enrollment for ${path.title} recorded in your study registry.')">
          <i class="fas fa-scroll"></i>
          <span>Enroll / View Syllabus</span>
        </button>
      </article>
    `).join('');
  }

  // 6. Render History Timeline
  function renderTimeline() {
    if (!timelineContainer || !siteData.timeline) return;

    timelineContainer.innerHTML = siteData.timeline.map((item, idx) => `
      <div class="timeline-item">
        <div class="timeline-node"></div>
        <div class="timeline-content-card">
          <div class="timeline-year">${item.year}</div>
          <h4 class="timeline-title">${item.title}</h4>
          <p class="timeline-desc">${item.description}</p>
        </div>
      </div>
    `).join('');
  }

  // 7. Render Testimonials
  function renderTestimonials() {
    if (!testimonialsContainer || !siteData.testimonials) return;

    testimonialsContainer.innerHTML = siteData.testimonials.map(t => `
      <div class="testimonial-card">
        <p>"${t.quote}"</p>
        <div>
          <div class="testimonial-author">${t.author}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    `).join('');
  }

  // 8. Event Listeners & Modals
  function setupEventListeners() {
    // Carousel buttons
    const prevBtn = document.getElementById('prev-quote-btn');
    const nextBtn = document.getElementById('next-quote-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => { prevQuote(); restartCarouselTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextQuote(); restartCarouselTimer(); });

    // Copy Quote button
    const copyBtn = document.getElementById('copy-quote-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const q = filteredQuotes[currentQuoteIndex];
        if (q) {
          const text = `${q.arabic}\n"${q.translation}"\n— ${q.source}`;
          navigator.clipboard.writeText(text).then(() => {
            showToast('Wisdom excerpt copied to clipboard.');
          });
        }
      });
    }



    // Modal backdrops click-to-close
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });

    // Close pillar modal
    const closePillarBtn = document.getElementById('close-pillar-btn');
    if (closePillarBtn) {
      closePillarBtn.addEventListener('click', () => {
        if (pillarModal) pillarModal.classList.remove('open');
      });
    }

    // Newsletter submit
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        if (input && input.value) {
          showToast(`Welcome to the House of Wisdom circle, ${input.value}.`);
          input.value = '';
        }
      });
    }

    // Mobile Drawer Controls
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle-btn');
    const mobileDrawerCloseBtn = document.getElementById('mobile-drawer-close-btn');

    if (mobileMenuToggleBtn && mobileDrawer) {
      mobileMenuToggleBtn.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    function closeMobileDrawer() {
      if (mobileDrawer) {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (mobileDrawerCloseBtn) {
      mobileDrawerCloseBtn.addEventListener('click', closeMobileDrawer);
    }

    if (mobileDrawer) {
      mobileDrawer.addEventListener('click', (e) => {
        if (e.target === mobileDrawer) {
          closeMobileDrawer();
        }
      });
    }

    // Auto-close mobile drawer on link click
    document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta').forEach(link => {
      link.addEventListener('click', closeMobileDrawer);
    });

    // Touch Swipe Gesture for Wisdom Carousel on Mobile
    const carouselWrapper = document.querySelector('.wisdom-carousel-wrapper');
    if (carouselWrapper) {
      let touchStartX = 0;
      let touchEndX = 0;

      carouselWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carouselWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 45) {
          if (diff < 0) {
            // Swiped left -> next quote
            nextQuote();
          } else {
            // Swiped right -> prev quote
            prevQuote();
          }
          restartCarouselTimer();
        }
      }, { passive: true });
    }
  }

  function handleLiveSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results-list');
    if (!resultsContainer) return;

    if (!query) {
      resultsContainer.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 2rem 0;">Type any concept, philosopher, ayah or subject...</p>';
      return;
    }

    const matches = [];

    // Search pillars
    if (siteData.pillars) {
      siteData.pillars.forEach(p => {
        if (p.title.toLowerCase().includes(query) || p.summary.toLowerCase().includes(query) || p.topics.some(t => t.toLowerCase().includes(query))) {
          matches.push({ type: 'Pillar', title: p.title, subtitle: p.arabic, desc: p.summary, id: p.id });
        }
      });
    }

    // Search quotes
    if (siteData.wisdomQuotes) {
      siteData.wisdomQuotes.forEach(q => {
        if (q.translation.toLowerCase().includes(query) || q.source.toLowerCase().includes(query) || q.category.toLowerCase().includes(query)) {
          matches.push({ type: 'Wisdom Quote', title: q.source, subtitle: q.category, desc: `"${q.translation}"` });
        }
      });
    }

    // Search courses
    if (siteData.learningPaths) {
      siteData.learningPaths.forEach(c => {
        if (c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)) {
          matches.push({ type: 'Course Path', title: `${c.code}: ${c.title}`, subtitle: c.duration, desc: c.description });
        }
      });
    }

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<p style="color: var(--text-dim); text-align: center; padding: 2rem 0;">No matching entries found for "${query}".</p>`;
      return;
    }

    resultsContainer.innerHTML = matches.map(m => `
      <div style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); cursor: pointer;" onclick="window.FreedomNexApp.showToast('Selected: ${m.title}')">
        <span style="font-size: 0.72rem; color: var(--gold-400); text-transform: uppercase; letter-spacing: 0.1em;">${m.type}</span>
        <h4 style="font-family: var(--font-serif-display); color: #fff; margin: 0.2rem 0;">${m.title}</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">${m.desc}</p>
      </div>
    `).join('');
  }

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('.toast-text').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  function openPillarModal(pillarId) {
    if (!siteData || !siteData.pillars || !pillarModal) return;
    const pillar = siteData.pillars.find(p => p.id === pillarId);
    if (!pillar) return;

    const modalBody = document.getElementById('pillar-modal-body');
    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-family: var(--font-arabic); font-size: 1.6rem; color: var(--gold-300); margin-bottom: 0.3rem;">${pillar.arabic}</div>
        <h2 style="font-family: var(--font-serif-display); font-size: 2rem; color: #fff;">${pillar.title}</h2>
      </div>
      <p style="font-size: 1.05rem; color: var(--text-main); line-height: 1.8; margin-bottom: 1.8rem;">${pillar.details}</p>
      <div style="background: rgba(201, 166, 98, 0.06); border: 1px solid var(--border-gold); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2rem;">
        <h4 style="font-family: var(--font-sans); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--gold-400); margin-bottom: 1rem;">Key Core Inquiries & Topics:</h4>
        <ul style="list-style: none;">
          ${pillar.topics.map(t => `<li style="padding: 0.4rem 0; color: #fff; font-size: 0.92rem; display: flex; align-items: center; gap: 0.6rem;"><span style="color: var(--gold-300);">✦</span> ${t}</li>`).join('')}
        </ul>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 1rem;">
        <button class="btn-gold-primary" onclick="window.FreedomNexApp.showToast('Pillar curriculum syllabus added to your study plan.'); document.getElementById('pillar-modal').classList.remove('open');">
          <i class="fas fa-bookmark"></i>
          <span>Save to Study Plan</span>
        </button>
      </div>
    `;

    pillarModal.classList.add('open');
  }

  // Global Public API
  window.FreedomNexApp = {
    openPillarModal,
    showToast,
    jumpToQuote: function (idx) {
      currentQuoteIndex = idx;
      renderCurrentQuote();
      restartCarouselTimer();
    }
  };

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
