import {
  animate,
  createTimeline,
  createSpring,
  createDraggable,
  createAnimatable,
  createScope,
  createLayout,
  onScroll,
  stagger,
  splitText,
  svg,
  utils,
} from 'animejs';

interface ModalProductData {
  id: string;
  name: string;
  badge: string;
  photoStyle: 'studio' | 'nature';
  imageSrc: string;
  fullDescription: string;
  idealFor: string[];
  specs: string[];
  waUrl: string;
}

const WHATSAPP_NUMBER = '51995822660';

function spawnBubbleBurst(clientX: number, clientY: number, count = 12): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bubbles: HTMLSpanElement[] = [];
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('span');
    bubble.className = 'burst-bubble';
    const size = utils.random(7, 18);
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${clientX - size / 2}px`;
    bubble.style.top = `${clientY - size / 2}px`;
    document.body.appendChild(bubble);
    bubbles.push(bubble);
  }

  animate(bubbles, {
    translateX: () => utils.random(-90, 90),
    translateY: () => utils.random(-110, 45),
    scale: [0.35, 1.35, 0],
    opacity: [0.95, 0],
    duration: () => utils.random(550, 950),
    ease: 'outExpo',
    onComplete: () => {
      bubbles.forEach((b) => b.remove());
    },
  });
}

function pulseRipples(): void {
  const ripples = document.querySelectorAll('#hero-ripples .hero-ripple');
  if (!ripples.length) return;
  animate(ripples, {
    scale: [0.9, 1.16, 1],
    opacity: [0.9, 0.3, 0.72],
    duration: 950,
    delay: stagger(90),
    ease: 'outExpo',
  });
}

function initAnimations(): void {
  const scope = createScope({
    mediaQueries: {
      mobile: '(max-width: 900px)',
      desktop: '(min-width: 901px)',
      reduced: '(prefers-reduced-motion: reduce)',
    },
  });

  scope.add((self) => {
    const isReduced = Boolean(self?.matches.reduced);
    const isMobile = Boolean(self?.matches.mobile);

    // -----------------------------------------
    // 1. Scroll Depth Gauge & Navbar Submerged State
    // -----------------------------------------
    const navEl = document.getElementById('site-nav');
    const gaugeEl = document.getElementById('depth-gauge');
    const gaugeLabel = document.getElementById('depth-gauge-label');
    const gaugeFill = document.getElementById('depth-gauge-fill');
    const gaugeDroplet = document.getElementById('depth-gauge-droplet');
    const mainEl = document.querySelector('main');

    if (mainEl) {
      onScroll({
        target: mainEl,
        enter: 'top top',
        leave: 'bottom bottom',
        sync: true,
        onUpdate: (obs) => {
          const p = Math.max(0, Math.min(1, obs.progress));
          const meters = Math.round(p * 20);
          if (gaugeLabel) gaugeLabel.textContent = `${meters}m`;
          if (gaugeFill) gaugeFill.style.transform = `scaleY(${p})`;
          if (gaugeDroplet) gaugeDroplet.style.top = `${p * 100}%`;

          const submerged = window.scrollY > 140;
          navEl?.classList.toggle('is-submerged', submerged);
          gaugeEl?.classList.toggle('is-submerged', submerged);
        },
      });
    }

    if (isReduced) {
      return;
    }

    // -----------------------------------------
    // 2. Hero Entrance Choreography + SplitText
    // -----------------------------------------
    const heroLineEl = document.querySelector<HTMLElement>('.hero-title-line');
    const heroWords = heroLineEl
      ? splitText(heroLineEl, {
          words: { wrap: 'clip' },
        }).words
      : [];

    const heroTl = createTimeline({
      defaults: { ease: 'outExpo' },
    });

    heroTl
      .add('.hero-eyebrow-line', {
        scaleX: [0, 1],
        duration: 550,
      })
      .add(
        '.hero-eyebrow span:last-child',
        {
          opacity: [0, 1],
          translateX: [-12, 0],
          duration: 550,
        },
        '<-=350'
      );

    if (heroWords.length) {
      heroTl.add(
        heroWords,
        {
          translateY: ['115%', '0%'],
          opacity: [0, 1],
          duration: 750,
          delay: stagger(75),
        },
        '-=320'
      );
    }

    heroTl
      .add(
        '.hero-highlight',
        {
          scale: [0.68, 1],
          rotate: [-4, 0],
          opacity: [0, 1],
          duration: 850,
          ease: createSpring({ bounce: 0.45, duration: 850 }),
        },
        '-=450'
      )
      .add(
        '.hero-lead',
        {
          translateY: [22, 0],
          opacity: [0, 1],
          duration: 650,
        },
        '-=560'
      )
      .add(
        '.hero-actions .pill',
        {
          translateY: [20, 0],
          opacity: [0, 1],
          scale: [0.92, 1],
          duration: 650,
          delay: stagger(90),
        },
        '-=460'
      )
      .add(
        '#hero-drop-shell',
        {
          scale: [0.72, 1],
          translateY: [32, 0],
          opacity: [0, 1],
          duration: 1050,
          ease: createSpring({ bounce: 0.42, duration: 1050 }),
        },
        0.15 * 1000
      )
      .add(
        '#hero-ripples .hero-ripple',
        {
          scale: [0.55, 1],
          opacity: [0, 0.72],
          duration: 900,
          delay: stagger(110),
        },
        360
      );

    // Gentle floating drift for the main drop & logo
    animate('#hero-drop-shell', {
      translateY: [-8, 10],
      duration: 3600,
      alternate: true,
      loop: true,
      ease: 'inOutSine',
    });

    // Scroll cue line animation
    animate('#scroll-cue-fill', {
      scaleY: [0.2, 1, 0.2],
      duration: 2400,
      loop: true,
      ease: 'inOutSine',
    });

    // -----------------------------------------
    // 3. Interactive Draggable Drop (Touch + Desktop)
    // -----------------------------------------
    const dropDraggableEl = document.getElementById('hero-drop-draggable');
    const dropLogoEl = document.getElementById('hero-drop-logo');
    const dropHintEl = document.getElementById('drop-hint');

    if (dropDraggableEl) {
      const bound = isMobile ? 42 : 76;
      createDraggable(dropDraggableEl, {
        container: [-bound, -bound, bound, bound],
        releaseStiffness: 190,
        releaseDamping: 11,
        releaseMass: 1.15,
        cursor: { onHover: 'grab', onGrab: 'grabbing' },
        onGrab: () => {
          if (dropHintEl) {
            animate(dropHintEl, { opacity: 0, scale: 0.85, duration: 250 });
          }
          animate('#hero-drop-shell', { scale: 1.045, duration: 220, ease: 'outQuad' });
        },
        onDrag: (d) => {
          if (dropLogoEl) {
            dropLogoEl.style.transform = `translate3d(${d.x * 0.14}px, ${d.y * 0.14}px, 0)`;
          }
        },
        onRelease: () => {
          animate('#hero-drop-shell', {
            scale: 1,
            duration: 500,
            ease: createSpring({ bounce: 0.45, duration: 550 }),
          });
          if (dropLogoEl) {
            animate(dropLogoEl, {
              translateX: 0,
              translateY: 0,
              duration: 550,
              ease: createSpring({ bounce: 0.45, duration: 550 }),
            });
          }
          const rect = dropDraggableEl.getBoundingClientRect();
          spawnBubbleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
          pulseRipples();

          // Return cleanly back to origin with spring bounce
          animate(dropDraggableEl, {
            x: 0,
            y: 0,
            duration: 720,
            ease: createSpring({ bounce: 0.5, duration: 720 }),
          });
        },
      });

      dropDraggableEl.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          const rect = dropDraggableEl.getBoundingClientRect();
          spawnBubbleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
          pulseRipples();
        }
      });
    }

    // -----------------------------------------
    // 4. SVG Motion Paths (Satellite Drops) & Morphing Waves
    // -----------------------------------------
    const path1 = svg.createMotionPath('#orbit-path-1');
    const path2 = svg.createMotionPath('#orbit-path-2');
    const path3 = svg.createMotionPath('#orbit-path-3');

    animate('#sat-drop-1', {
      translateX: path1.translateX,
      translateY: path1.translateY,
      duration: 14000,
      loop: true,
      ease: 'linear',
    });

    animate('#sat-drop-2', {
      translateX: path2.translateX,
      translateY: path2.translateY,
      duration: 11000,
      loop: true,
      ease: 'linear',
    });

    animate('#sat-drop-3', {
      translateX: path3.translateX,
      translateY: path3.translateY,
      duration: 16500,
      loop: true,
      ease: 'linear',
    });

    animate('#wave-back', {
      d: svg.morphTo('#wave-back-alt'),
      duration: 4600,
      alternate: true,
      loop: true,
      ease: 'inOutSine',
    });

    animate('#wave-front', {
      d: svg.morphTo('#wave-front-alt'),
      duration: 3800,
      alternate: true,
      loop: true,
      ease: 'inOutSine',
    });

    // Hero parallax dive linked to scroll (awesome on mobile thumb scroll)
    const heroSection = document.getElementById('inicio');
    if (heroSection) {
      animate('#hero-drop-stage', {
        translateY: isMobile ? 38 : 76,
        scale: isMobile ? 0.94 : 0.9,
        autoplay: onScroll({
          target: heroSection,
          enter: 'top top',
          leave: 'bottom top',
          sync: 0.6,
        }),
      });
    }

    // -----------------------------------------
    // 5. Underwater Rays & Multi-Depth Bubbles Parallax on Scroll
    // -----------------------------------------
    animate('[data-ray]', {
      skewX: [-4, 4],
      opacity: [0.35, 0.78],
      duration: 5200,
      delay: stagger(700),
      alternate: true,
      loop: true,
      ease: 'inOutSine',
    });

    const productsSection = document.getElementById('productos');
    if (productsSection) {
      const bubbleTravel: Record<string, number> = {
        '1': isMobile ? -90 : -140,
        '2': isMobile ? -160 : -260,
        '3': isMobile ? -240 : -380,
      };

      document.querySelectorAll<HTMLElement>('.bubble').forEach((bubble) => {
        const depth = bubble.dataset.bubbleDepth || '2';
        animate(bubble, {
          translateY: bubbleTravel[depth] ?? -180,
          translateX: utils.random(-22, 22),
          autoplay: onScroll({
            target: productsSection,
            enter: 'bottom top',
            leave: 'top bottom',
            sync: 0.55,
          }),
        });
      });
    }

    // -----------------------------------------
    // 6. Scroll Reveals: Split Headings, Staggered Cards & Numeral Parallax
    // -----------------------------------------
    document.querySelectorAll<HTMLElement>('.js-split-heading').forEach((heading) => {
      const { words } = splitText(heading, { words: { wrap: 'clip' } });
      if (!words.length) return;

      animate(words, {
        translateY: ['110%', '0%'],
        opacity: [0, 1],
        duration: 720,
        delay: stagger(65),
        ease: 'outExpo',
        autoplay: onScroll({
          target: heading,
          enter: 'bottom-=8% top',
          repeat: false,
        }),
      });
    });

    const cards = Array.from(document.querySelectorAll<HTMLElement>('.product-card'));
    cards.forEach((card, idx) => {
      const capsule = card.querySelector('.product-capsule');
      const numeral = card.querySelector('[data-parallax-numeral]');

      if (capsule) {
        animate(capsule, {
          translateY: [48, 0],
          opacity: [0, 1],
          scale: [0.94, 1],
          duration: 850,
          delay: isMobile ? 0 : idx * 95,
          ease: createSpring({ bounce: 0.34, duration: 850 }),
          autoplay: onScroll({
            target: card,
            enter: 'bottom-=12% top',
            repeat: false,
          }),
        });
      }

      if (numeral) {
        animate(numeral, {
          translateY: [isMobile ? 28 : 54, isMobile ? -24 : -48],
          autoplay: onScroll({
            target: card,
            enter: 'bottom top',
            leave: 'top bottom',
            sync: 0.7,
          }),
        });
      }
    });

    // -----------------------------------------
    // 7. About Section: SVG Drawable Icons + Counting Metrics
    // -----------------------------------------
    const aboutSection = document.getElementById('nosotros');
    const purityDrawables = svg.createDrawable('.purity-draw');
    if (aboutSection && purityDrawables.length) {
      animate(purityDrawables, {
        draw: ['0 0', '0 1'],
        duration: 1100,
        delay: stagger(140),
        ease: 'inOutQuad',
        autoplay: onScroll({
          target: '#purity-grid',
          enter: 'bottom-=10% top',
          leave: 'center center',
          sync: 0.85,
        }),
      });
    }

    const purityCards = document.querySelectorAll('.purity-card');
    if (purityCards.length) {
      animate(purityCards, {
        translateY: [38, 0],
        opacity: [0, 1],
        duration: 780,
        delay: stagger(110),
        ease: 'outExpo',
        autoplay: onScroll({
          target: '#purity-grid',
          enter: 'bottom-=10% top',
          repeat: false,
        }),
      });
    }

    document.querySelectorAll<HTMLElement>('.js-counter').forEach((counterEl) => {
      const targetVal = Number(counterEl.dataset.target ?? '0');
      const suffix = counterEl.dataset.suffix ?? '';
      const state = { val: 0 };

      animate(state, {
        val: targetVal,
        duration: 1300,
        ease: 'outExpo',
        autoplay: onScroll({
          target: '#metrics-strip',
          enter: 'bottom-=10% top',
          repeat: false,
        }),
        onUpdate: () => {
          counterEl.textContent = `${Math.round(state.val)}${suffix}`;
        },
      });
    });

    // Section-closing WhatsApp CTA banners
    document.querySelectorAll<HTMLElement>('.js-wa-cta').forEach((banner) => {
      animate(banner, {
        translateY: [26, 0],
        opacity: [0, 1],
        scale: [0.96, 1],
        duration: 720,
        ease: createSpring({ bounce: 0.3, duration: 720 }),
        autoplay: onScroll({
          target: banner,
          enter: 'bottom-=6% top',
          repeat: false,
        }),
      });
    });

    animate('.wa-pulse-dot', {
      scale: [1, 1.5, 1],
      opacity: [1, 0.45, 1],
      duration: 1800,
      loop: true,
      ease: 'inOutSine',
    });

    document.querySelectorAll<HTMLElement>('.wa-cta-btn').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        const rect = btn.getBoundingClientRect();
        const cx = ev.clientX || rect.left + rect.width / 2;
        const cy = ev.clientY || rect.top + rect.height / 2;
        spawnBubbleBurst(cx, cy, 10);
      });
    });

    // -----------------------------------------
    // 8. Fine Pointer Micro-interactions (3D Card Tilt & Magnetic Pills)
    // -----------------------------------------
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.querySelectorAll<HTMLElement>('[data-tilt-card]').forEach((card) => {
        const tilt = createAnimatable(card, {
          rotateX: 160,
          rotateY: 160,
          ease: 'outQuad',
        });

        card.addEventListener('pointermove', (e) => {
          const rect = card.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          tilt.rotateY(nx * 7);
          tilt.rotateX(-ny * 7);
        });

        card.addEventListener('pointerleave', () => {
          tilt.rotateX(0);
          tilt.rotateY(0);
        });
      });

      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
        const mag = createAnimatable(btn, {
          translateX: 180,
          translateY: 180,
          ease: 'outExpo',
        });

        btn.addEventListener('pointermove', (e) => {
          const rect = btn.getBoundingClientRect();
          const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
          const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
          mag.translateX(dx);
          mag.translateY(dy);
        });

        btn.addEventListener('pointerleave', () => {
          mag.translateX(0);
          mag.translateY(0);
        });
      });
    }
  });

  // -----------------------------------------
  // 9. Interactive Product Filter (createLayout FLIP)
  // -----------------------------------------
  const gridEl = document.getElementById('product-grid');
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');

  if (gridEl && filterBtns.length) {
    const gridLayout = createLayout(gridEl, {
      children: '.product-card',
      duration: 520,
      ease: 'outExpo',
    });

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter || 'all';
        filterBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', String(active));
        });

        gridLayout.update(() => {
          gridEl.querySelectorAll<HTMLElement>('.product-card').forEach((card) => {
            const match = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('is-hidden', !match);
          });
        });
      });
    });
  }

  // -----------------------------------------
  // 10. Mobile Drawer Navigation
  // -----------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  const setDrawer = (open: boolean) => {
    if (!navToggle || !mobileDrawer) return;
    navToggle.setAttribute('aria-expanded', String(open));
    mobileDrawer.setAttribute('aria-hidden', String(!open));

    if (open) {
      mobileDrawer.classList.add('is-open');
      animate(mobileDrawer, {
        opacity: [0, 1],
        duration: 280,
        ease: 'outQuad',
      });
      animate('.mobile-drawer-link, .mobile-drawer-cta', {
        translateX: [-24, 0],
        opacity: [0, 1],
        duration: 420,
        delay: stagger(55),
        ease: 'outExpo',
      });
    } else {
      animate(mobileDrawer, {
        opacity: [1, 0],
        duration: 220,
        ease: 'inQuad',
        onComplete: () => {
          mobileDrawer.classList.remove('is-open');
        },
      });
    }
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setDrawer(!isOpen);
  });

  mobileDrawer?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setDrawer(false));
  });

  // -----------------------------------------
  // 11. Product Specification Modal & Order Builder Sync
  // -----------------------------------------
  const modalDataScript = document.getElementById('products-modal-data');
  const modalProducts: ModalProductData[] = modalDataScript?.textContent
    ? JSON.parse(modalDataScript.textContent)
    : [];

  const modalEl = document.getElementById('product-modal');
  const modalDialog = document.getElementById('modal-dialog');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalPhotoWrap = document.getElementById('modal-photo-wrap');
  const modalImg = document.getElementById('modal-product-img') as HTMLImageElement | null;
  const modalBadge = document.getElementById('modal-product-badge');
  const modalTitle = document.getElementById('modal-product-title');
  const modalDesc = document.getElementById('modal-product-desc');
  const modalIdeal = document.getElementById('modal-product-ideal');
  const modalSpecs = document.getElementById('modal-product-specs');
  const modalWaLink = document.getElementById('modal-wa-link') as HTMLAnchorElement | null;
  const modalToFormBtn = document.getElementById('modal-to-form');

  let activeModalProductName = 'Aguaflor 7 L';

  const closeModal = () => {
    if (!modalEl || !modalDialog) return;
    animate(modalEl, {
      opacity: [1, 0],
      duration: 200,
      ease: 'inQuad',
      onComplete: () => {
        modalEl.classList.remove('is-open');
        modalEl.setAttribute('aria-hidden', 'true');
      },
    });
  };

  const openModal = (productId: string) => {
    const prod = modalProducts.find((item) => item.id === productId);
    if (!prod || !modalEl || !modalDialog) return;

    activeModalProductName = prod.name;
    if (modalPhotoWrap) {
      modalPhotoWrap.classList.toggle('is-nature', prod.photoStyle === 'nature');
    }
    if (modalImg) {
      modalImg.src = prod.imageSrc;
      modalImg.alt = prod.name;
    }
    if (modalBadge) modalBadge.textContent = prod.badge;
    if (modalTitle) modalTitle.textContent = prod.name;
    if (modalDesc) modalDesc.textContent = prod.fullDescription;
    if (modalIdeal) {
      modalIdeal.innerHTML = '';
      prod.idealFor.forEach((tag) => {
        const span = document.createElement('span');
        span.className = 'product-chip';
        span.textContent = tag;
        modalIdeal.appendChild(span);
      });
    }
    if (modalSpecs) {
      modalSpecs.innerHTML = '';
      prod.specs.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        modalSpecs.appendChild(li);
      });
    }
    if (modalWaLink) modalWaLink.href = prod.waUrl;

    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    animate(modalEl, { opacity: [0, 1], duration: 240, ease: 'outQuad' });
    animate(modalDialog, {
      scale: [0.9, 1],
      translateY: [24, 0],
      duration: 460,
      ease: createSpring({ bounce: 0.32, duration: 460 }),
    });
  };

  document.querySelectorAll<HTMLButtonElement>('.js-open-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.modalProduct) openModal(btn.dataset.modalProduct);
    });
  });

  modalCloseBtn?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl?.classList.contains('is-open')) closeModal();
  });

  // Order builder state
  const orderProductInput = document.getElementById('order-product-input') as HTMLInputElement | null;
  const orderQtyInput = document.getElementById('order-qty-input') as HTMLInputElement | null;
  const qtyValueEl = document.getElementById('qty-value');
  const qtyMinusBtn = document.getElementById('qty-minus');
  const qtyPlusBtn = document.getElementById('qty-plus');
  const orderChips = document.querySelectorAll<HTMLButtonElement>('.order-chip');

  const selectOrderProduct = (productName: string) => {
    if (orderProductInput) orderProductInput.value = productName;
    orderChips.forEach((chip) => {
      chip.classList.toggle('is-selected', chip.dataset.chipProduct === productName);
    });
  };

  orderChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (chip.dataset.chipProduct) {
        selectOrderProduct(chip.dataset.chipProduct);
        animate(chip, {
          scale: [0.92, 1],
          duration: 320,
          ease: createSpring({ bounce: 0.45, duration: 320 }),
        });
      }
    });
  });

  const updateQty = (delta: number) => {
    if (!orderQtyInput || !qtyValueEl) return;
    const next = Math.max(1, Math.min(99, Number(orderQtyInput.value || '1') + delta));
    orderQtyInput.value = String(next);
    qtyValueEl.textContent = String(next);
    animate(qtyValueEl, {
      scale: [1.32, 1],
      duration: 320,
      ease: createSpring({ bounce: 0.5, duration: 320 }),
    });
  };

  qtyMinusBtn?.addEventListener('click', () => updateQty(-1));
  qtyPlusBtn?.addEventListener('click', () => updateQty(1));

  document.querySelectorAll<HTMLElement>('.js-select-order').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = trigger.dataset.orderProduct;
      if (productName) selectOrderProduct(productName);
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  modalToFormBtn?.addEventListener('click', () => {
    closeModal();
    selectOrderProduct(activeModalProductName);
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Order form submission with bubble burst & pre-filled WhatsApp dispatch
  const orderForm = document.getElementById('order-form') as HTMLFormElement | null;
  const orderFeedback = document.getElementById('order-feedback');
  const orderFeedbackText = document.getElementById('order-feedback-text');
  const orderFeedbackWa = document.getElementById('order-feedback-wa') as HTMLAnchorElement | null;
  const orderSubmitBtn = document.getElementById('order-submit-btn');

  orderForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(orderForm);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const address = String(formData.get('address') || '').trim();
    const product = String(formData.get('product') || 'Aguaflor 7 L');
    const qty = String(formData.get('quantity') || '1');

    if (!name || !phone || !address) {
      if (orderFeedback && orderFeedbackText) {
        orderFeedback.classList.add('is-visible');
        orderFeedbackText.textContent =
          'Por favor completa tu nombre, teléfono y dirección de entrega en Chanchamayo.';
        if (orderFeedbackWa) orderFeedbackWa.style.display = 'none';
      }
      animate(orderForm, {
        translateX: [-8, 8, -5, 5, 0],
        duration: 380,
        ease: 'inOutSine',
      });
      return;
    }

    const message = `Hola Aguaflor! Soy ${name} (${phone}). Quiero pedir ${qty}x ${product}. Dirección: ${address}.`;
    const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    if (orderFeedback && orderFeedbackText && orderFeedbackWa) {
      orderFeedback.classList.add('is-visible');
      orderFeedbackText.textContent = `¡Pedido preparado! ${qty} × ${product} para ${name}. Confírmalo al instante por WhatsApp:`;
      orderFeedbackWa.href = waHref;
      orderFeedbackWa.style.display = 'inline-block';
      animate(orderFeedback, {
        translateY: [10, 0],
        opacity: [0, 1],
        duration: 420,
        ease: 'outExpo',
      });
    }

    if (orderSubmitBtn) {
      const rect = orderSubmitBtn.getBoundingClientRect();
      spawnBubbleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations, { once: true });
} else {
  initAnimations();
}
