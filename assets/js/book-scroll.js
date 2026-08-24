/**
 * FreedomNex — House of Wisdom
 * 3D Book Scroll-Driven Experience with Three.js
 */

(function () {
  'use strict';

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvasContainer = document.getElementById('book-canvas-container');
  const scrollContainer = document.querySelector('.hero-scroll-container');
  const heroHeader = document.querySelector('.hero-header-block');
  const scrollCue = document.querySelector('.hero-scroll-cue');
  const revelationBox = document.querySelector('.wisdom-revelation-overlay');

  if (!canvasContainer || !scrollContainer) return;

  let scene, camera, renderer;
  let bookGroup, frontCoverGroup, backCoverMesh, spineMesh;
  let pageMeshes = [];
  let particleSystem;
  let ambientLight, mainLight, goldPointLight;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollProgress = 0;
  let targetScrollProgress = 0;
  let isMobile = window.innerWidth <= 768;

  function initThreeScene() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, skipping 3D book initialization.');
      return;
    }

    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070e14, 0.04);

    // 2. Camera Setup
    const aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    updateCameraPosition();

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasContainer.appendChild(renderer.domElement);

    // 4. Lighting
    ambientLight = new THREE.AmbientLight(0xffeedd, 0.85);
    scene.add(ambientLight);

    mainLight = new THREE.DirectionalLight(0xfff3d6, 2.2);
    mainLight.position.set(4, 8, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x1a3860, 2.0);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    goldPointLight = new THREE.PointLight(0xc9a662, 1.8, 15);
    goldPointLight.position.set(0, 0.5, 2);
    scene.add(goldPointLight);

    // 5. Build 3D Book
    buildBook();

    // 6. Floating Particles (Gold Dust / Star motes)
    buildParticles();

    // 7. Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('scroll', calculateScrollProgress, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Initial render call
    calculateScrollProgress();
    animate();
  }

  function updateCameraPosition() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    isMobile = width <= 768;

    if (width <= 380) {
      camera.position.set(0, 0.1, 7.2);
    } else if (width <= 480) {
      camera.position.set(0, 0.15, 6.4);
    } else if (width <= 768) {
      camera.position.set(0, 0.2, 5.6);
    } else {
      camera.position.set(0, 0.35, 4.4);
    }
  }

  function onTouchMove(e) {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      mouse.targetX = (touch.clientX / window.innerWidth - 0.5) * 1.5;
      mouse.targetY = (touch.clientY / window.innerHeight - 0.5) * 1.5;
    }
  }

  /**
   * Helper: Generate a high-res dynamic procedural texture for Leather & Gold Foil Cover
   */
  function createCoverTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');

    // Royal midnight navy / sapphire leather gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#071629');
    bgGradient.addColorStop(0.5, '#0e2b4d');
    bgGradient.addColorStop(1, '#051120');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Noise/grain texture simulation
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < 40000; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      ctx.fillRect(rx, ry, 1, 1);
    }

    // Outer Gold Foil Border
    ctx.strokeStyle = '#c9a662';
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Inner Delicate Filigree Border
    ctx.strokeStyle = '#e5c378';
    ctx.lineWidth = 4;
    ctx.strokeRect(65, 65, canvas.width - 130, canvas.height - 130);

    // 8-Pointed Star Motif in Center
    drawIslamicStar(ctx, canvas.width / 2, 450, 160, '#c9a662', '#e5c378');

    // Title Typography in Gold
    ctx.fillStyle = '#f3e0a3';
    ctx.textAlign = 'center';

    // Bismillah
    ctx.font = 'bold 36px "Amiri", serif';
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', canvas.width / 2, 220);

    // FreedomNex
    ctx.font = 'bold 72px "Cinzel", "Georgia", serif';
    ctx.fillText('FREEDOMNEX', canvas.width / 2, 750);

    // Subtitle
    ctx.fillStyle = '#c9a662';
    ctx.font = '32px "Cinzel", "Georgia", serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('HOUSE OF WISDOM', canvas.width / 2, 830);

    // Arabic Subtitle
    ctx.font = '48px "Amiri", serif';
    ctx.fillText('بَيْتُ الْحِكْمَةِ', canvas.width / 2, 920);

    // Corner Ornaments
    drawCornerOrnament(ctx, 80, 80);
    drawCornerOrnament(ctx, canvas.width - 80, 80);
    drawCornerOrnament(ctx, 80, canvas.height - 80);
    drawCornerOrnament(ctx, canvas.width - 80, canvas.height - 80);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }

  function drawIslamicStar(ctx, cx, cy, radius, color1, color2) {
    ctx.save();
    ctx.translate(cx, cy);

    ctx.strokeStyle = color1;
    ctx.lineWidth = 6;
    ctx.fillStyle = 'rgba(14, 43, 77, 0.45)';

    // Draw square 1
    ctx.beginPath();
    ctx.rect(-radius / 2, -radius / 2, radius, radius);
    ctx.fill();
    ctx.stroke();

    // Draw square 2 (rotated 45 deg)
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.rect(-radius / 2, -radius / 2, radius, radius);
    ctx.fill();
    ctx.stroke();

    // Inner circle
    ctx.strokeStyle = color2;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawCornerOrnament(ctx, x, y) {
    ctx.strokeStyle = '#c9a662';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.stroke();
  }

  /**
   * Helper: Generate a parchment manuscript texture for the inner pages
   */
  function createPageTexture(isLeft) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');

    // Parchment gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    if (isLeft) {
      grad.addColorStop(0, '#f8f3e6');
      grad.addColorStop(0.9, '#f4ece0');
      grad.addColorStop(1, '#d8cbba'); // spine shadow
    } else {
      grad.addColorStop(0, '#d8cbba'); // spine shadow
      grad.addColorStop(0.1, '#f4ece0');
      grad.addColorStop(1, '#f8f3e6');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gilded page border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    ctx.strokeStyle = 'rgba(201, 166, 98, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(65, 65, canvas.width - 130, canvas.height - 130);

    // Calligraphic page contents
    ctx.textAlign = 'center';
    if (isLeft) {
      ctx.fillStyle = '#0c233f';
      ctx.font = 'bold 44px "Amiri", serif';
      ctx.fillText('اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ', canvas.width / 2, 450);

      ctx.fillStyle = '#3e3629';
      ctx.font = 'italic 28px "Lora", serif';
      ctx.fillText('"Read! In the name of your Lord who created."', canvas.width / 2, 550);

      ctx.fillStyle = '#aa8640';
      ctx.font = '20px "Inter", sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('SURAH AL-ALAQ [96:1]', canvas.width / 2, 630);
    } else {
      ctx.fillStyle = '#0c233f';
      ctx.font = 'bold 44px "Amiri", serif';
      ctx.fillText('رَّبِّ زِدْنِي عِلْمًا', canvas.width / 2, 450);

      ctx.fillStyle = '#3e3629';
      ctx.font = 'italic 28px "Lora", serif';
      ctx.fillText('"My Lord, increase me in knowledge."', canvas.width / 2, 550);

      ctx.fillStyle = '#aa8640';
      ctx.font = '20px "Inter", sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('SURAH TAHA [20:114]', canvas.width / 2, 630);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  function buildBook() {
    bookGroup = new THREE.Group();
    bookGroup.rotation.x = 0.45;
    bookGroup.rotation.y = -0.3;
    bookGroup.rotation.z = -0.05;
    scene.add(bookGroup);

    const bookWidth = 1.9;
    const bookHeight = 2.6;
    const bookDepth = 0.28;

    // Materials
    const coverTexture = createCoverTexture();
    const coverMaterial = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.35,
      metalness: 0.25,
      bumpScale: 0.05
    });

    const spineMaterial = new THREE.MeshStandardMaterial({
      color: 0x091c33,
      roughness: 0.4,
      metalness: 0.3
    });

    const pageEdgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5c378,
      roughness: 0.5,
      metalness: 0.6
    });

    const leftPageTexture = createPageTexture(true);
    const rightPageTexture = createPageTexture(false);

    const leftPageMat = new THREE.MeshStandardMaterial({
      map: leftPageTexture,
      roughness: 0.8
    });

    const rightPageMat = new THREE.MeshStandardMaterial({
      map: rightPageTexture,
      roughness: 0.8
    });

    // 1. Spine (Hinge)
    const spineGeo = new THREE.CylinderGeometry(bookDepth / 2, bookDepth / 2, bookHeight, 16, 1, false, 0, Math.PI);
    spineMesh = new THREE.Mesh(spineGeo, spineMaterial);
    spineMesh.rotation.y = Math.PI / 2;
    spineMesh.position.set(0, 0, 0);
    bookGroup.add(spineMesh);

    // 2. Back Cover & Base Page Block (Static relative to book group)
    const backCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight, 0.04);
    backCoverMesh = new THREE.Mesh(backCoverGeo, coverMaterial);
    backCoverMesh.position.set(bookWidth / 2, 0, -bookDepth / 2);
    bookGroup.add(backCoverMesh);

    // Base Right Page Block
    const pageBlockGeo = new THREE.BoxGeometry(bookWidth * 0.96, bookHeight * 0.96, bookDepth * 0.85);
    const pageBlockMesh = new THREE.Mesh(pageBlockGeo, [
      pageEdgeMaterial, // Right edge (gilded)
      pageEdgeMaterial, // Left edge
      pageEdgeMaterial, // Top edge
      pageEdgeMaterial, // Bottom edge
      rightPageMat,     // Front face (Parchment manuscript)
      pageEdgeMaterial  // Back face
    ]);
    pageBlockMesh.position.set((bookWidth * 0.96) / 2 + 0.02, 0, 0);
    bookGroup.add(pageBlockMesh);

    // 3. Front Cover Group (Rotates along left edge hinge: x = 0)
    frontCoverGroup = new THREE.Group();
    frontCoverGroup.position.set(0, 0, bookDepth / 2);

    const frontCoverMesh = new THREE.Mesh(backCoverGeo, coverMaterial);
    frontCoverMesh.position.set(bookWidth / 2, 0, 0);
    frontCoverGroup.add(frontCoverMesh);

    bookGroup.add(frontCoverGroup);

    // 4. Turning Inner Pages (Fanning stack)
    const numTurningPages = 4;
    pageMeshes = [];

    for (let i = 0; i < numTurningPages; i++) {
      const pageHingeGroup = new THREE.Group();
      pageHingeGroup.position.set(0, 0, (bookDepth / 2) * (1 - (i + 1) / (numTurningPages + 1)));

      const pagePlaneGeo = new THREE.PlaneGeometry(bookWidth * 0.95, bookHeight * 0.95, 4, 1);
      const pageMat = i % 2 === 0 ? leftPageMat : rightPageMat;
      const singlePageMesh = new THREE.Mesh(pagePlaneGeo, pageMat);
      singlePageMesh.position.set((bookWidth * 0.95) / 2 + 0.02, 0, 0);
      singlePageMesh.castShadow = true;
      singlePageMesh.receiveShadow = true;

      pageHingeGroup.add(singlePageMesh);
      bookGroup.add(pageHingeGroup);
      pageMeshes.push(pageHingeGroup);
    }
  }

  function buildParticles() {
    const particleCount = isMobile ? 80 : 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 8;
      scales[i / 3] = Math.random() * 0.06 + 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      color: 0xe5c378,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
  }

  function calculateScrollProgress() {
    const rect = scrollContainer.getBoundingClientRect();
    const totalScrollable = scrollContainer.offsetHeight - window.innerHeight;
    const currentScrolled = -rect.top;

    let p = currentScrolled / totalScrollable;
    p = Math.max(0, Math.min(1, p));
    targetScrollProgress = p;
  }

  function onMouseMove(e) {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onWindowResize() {
    if (!renderer || !camera || !canvasContainer) return;
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    updateCameraPosition();
  }

  function animate() {
    requestAnimationFrame(animate);

    // Smooth scroll interpolation
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.1;

    // Smooth mouse parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    if (bookGroup) {
      // 1. Cover Opening Rotation (from 0 to -Math.PI radians)
      const coverOpenAngle = -Math.PI * Math.min(1, scrollProgress * 1.5);
      frontCoverGroup.rotation.y = coverOpenAngle;

      // 2. Fanning pages turning in sequential cascade
      pageMeshes.forEach((pageGroup, idx) => {
        const delay = (idx + 1) * 0.12;
        const pageProgress = Math.max(0, Math.min(1, (scrollProgress - delay) * 1.8));
        pageGroup.rotation.y = -Math.PI * pageProgress * 0.94;
      });

      // 3. Book orientation in 3D space during scroll
      // As scroll proceeds, the book turns center-facing and scales gently
      const baseRotX = 0.45 - scrollProgress * 0.4;
      const baseRotY = -0.3 + scrollProgress * 0.3;
      const parallaxX = mouse.y * 0.15;
      const parallaxY = mouse.x * 0.2;

      bookGroup.rotation.x = baseRotX + parallaxX;
      bookGroup.rotation.y = baseRotY + parallaxY;
      bookGroup.position.y = -scrollProgress * 0.4;
      bookGroup.position.z = scrollProgress * 0.5;

      // Light beam intensity changes as book opens
      if (goldPointLight) {
        goldPointLight.intensity = 1.5 + scrollProgress * 2.5;
      }
    }

    // Gentle particle swirl
    if (particleSystem) {
      particleSystem.rotation.y += 0.0015;
      particleSystem.rotation.x = mouse.y * 0.05;
    }

    // UI elements synchronization with scroll progress
    syncUIWithScroll(scrollProgress);

    renderer.render(scene, camera);
  }

  function syncUIWithScroll(p) {
    // Header title fade out as user scrolls
    if (heroHeader) {
      const headerOpacity = Math.max(0, 1 - p * 3.0);
      heroHeader.style.opacity = headerOpacity.toFixed(3);
      heroHeader.style.transform = `translateY(${-p * 80}px)`;
    }

    // Scroll cue fade out
    if (scrollCue) {
      scrollCue.style.opacity = (Math.max(0, 1 - p * 4.0)).toFixed(3);
    }

    // Wisdom Revelation Overlay Display (Peaks between 45% and 88% scroll)
    if (revelationBox) {
      if (p > 0.42 && p < 0.92) {
        revelationBox.classList.add('active');
      } else {
        revelationBox.classList.remove('active');
      }
    }
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
  } else {
    initThreeScene();
  }

  // Export for testing or external controls
  window.FreedomNexBookController = {
    setScrollProgress: function (p) {
      targetScrollProgress = p;
    }
  };
})();
