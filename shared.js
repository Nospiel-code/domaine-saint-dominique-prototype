/* ============================================================
   shared.js — Domaine Saint Dominique
   - i18n swap (FR/EN)
   - header scroll state
   - reveal-on-scroll IntersectionObserver
   - mobile drawer
   - tweaks state (logo / palette / typo pairing)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- TWEAKS — persisted between pages via localStorage ---------- */
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "lang": "fr",
    "logoVariant": "monogram",
    "typePair": "cormorant-karla",
    "displayWeight": "light",
    "italicColor": "amber",
    "density": "regular",
    "radius": "soft",
    "phStyle": "striped",
    "brandTag": "1868",
    "botanical": true,
    "animations": true,
    "showPress": true,
    "showFacts": true,
    "showMeta": true,
    "ctaColor": "terracotta",
    "headerStyle": "transparent",
    "eyebrowStyle": "capsule",
    "containerWidth": "regular"
  }/*EDITMODE-END*/;

  const LS_KEY = 'dsd-tweaks-v2';
  function loadTweaks() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { ...TWEAK_DEFAULTS };
      return { ...TWEAK_DEFAULTS, ...JSON.parse(raw) };
    } catch { return { ...TWEAK_DEFAULTS }; }
  }
  function saveTweaks(t) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(t)); } catch {}
  }
  window.DSD = window.DSD || {};
  window.DSD.tweaks = loadTweaks();
  window.DSD.setTweak = function (key, value) {
    window.DSD.tweaks[key] = value;
    saveTweaks(window.DSD.tweaks);
    // Persist to disk so values survive a ZIP download / project reopen.
    // The host parses the EDITMODE-BEGIN/END JSON block in this file and
    // merges the edit, then writes the file back.
    try {
      window.parent.postMessage(
        { type: '__edit_mode_set_keys', edits: { [key]: value } },
        '*'
      );
    } catch (e) {}
    applyTweaks();
    if (key === 'lang') applyI18N();
    if (key === 'logoVariant') renderLogos();
    if (window.DSD.onTweak) window.DSD.onTweak(key, value);
  };

  const TYPE_PAIRS = {
    'cormorant-karla': { serif: "'Cormorant Garamond', 'EB Garamond', Georgia, serif", sans: "'Karla', -apple-system, sans-serif" },
    'dmserif-manrope': { serif: "'DM Serif Display', 'Cormorant Garamond', serif", sans: "'Manrope', -apple-system, sans-serif" }
  };

  function applyTweaks() {
    const t = window.DSD.tweaks;
    const root = document.documentElement;
    const pair = TYPE_PAIRS[t.typePair] || TYPE_PAIRS['cormorant-karla'];
    root.style.setProperty('--serif', pair.serif);
    root.style.setProperty('--sans', pair.sans);

    // Body data attributes drive most variants via CSS
    const body = document.body;
    if (!body) return;
    body.setAttribute('data-density', t.density || 'regular');
    body.setAttribute('data-radius', t.radius || 'sharp');
    body.setAttribute('data-display', t.displayWeight || 'regular');
    body.setAttribute('data-italic', t.italicColor || 'terracotta');
    body.setAttribute('data-ph', t.phStyle || 'striped');
    body.setAttribute('data-tag', t.brandTag === 'off' ? 'off' : 'on');
    body.setAttribute('data-botanical', t.botanical ? 'on' : 'off');
    body.setAttribute('data-anim', t.animations ? 'on' : 'off');
    body.setAttribute('data-show-press', t.showPress ? 'on' : 'off');
    body.setAttribute('data-show-facts', t.showFacts ? 'on' : 'off');
    body.setAttribute('data-show-meta', t.showMeta ? 'on' : 'off');
    body.setAttribute('data-mode', 'light');
    body.setAttribute('data-cta', t.ctaColor || 'terracotta');
    body.setAttribute('data-header', t.headerStyle || 'transparent');
    body.setAttribute('data-eyebrow', t.eyebrowStyle || 'line');
    body.setAttribute('data-container', t.containerWidth || 'regular');

    // Brand tag text variants
    updateBrandTag(t.brandTag);
  }

  function updateBrandTag(mode) {
    const labels = {
      '1868':     { fr: "Maison d'hôtes · 1868",            en: "Guesthouse · since 1868" },
      'province': { fr: "Maison d'hôtes · Provence Verte",  en: "Guesthouse · Provence Verte" },
      'var':      { fr: "Var · 5 chambres",                 en: "Var, France · 5 rooms" },
      'off':      { fr: '', en: '' }
    };
    const lang = window.DSD?.tweaks?.lang || 'fr';
    const set = labels[mode] || labels['1868'];
    document.querySelectorAll('.brand-tag').forEach(el => {
      el.textContent = set[lang] || set.fr;
    });
  }

  /* ---------- I18N ---------- */
  function applyI18N() {
    const lang = window.DSD.tweaks.lang || 'fr';
    document.documentElement.setAttribute('lang', lang);
    const dict = (window.I18N && window.I18N[lang]) || {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) {
        // Preserve <em>/<br> inside translation by allowing HTML
        el.innerHTML = dict[key];
      }
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr'); // "placeholder:key"
      spec.split(',').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        if (dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });
    // Update language switcher UI
    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  /* ---------- LOGOS ---------- */
  // 4 variants, all simple SVG / type-based, monochrome-safe.
  const LOGOS = {
    wordmark: () => `
      <svg viewBox="0 0 38 38" aria-hidden="true">
        <circle cx="19" cy="19" r="17.5" fill="none" stroke="currentColor" stroke-width="1"/>
        <text x="19" y="24" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="16" font-style="italic" fill="currentColor">d</text>
      </svg>
    `,
    monogram: () => `
      <svg viewBox="0 0 38 38" aria-hidden="true">
        <rect x="1" y="1" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1"/>
        <text x="19" y="22" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="13" letter-spacing="0.5" fill="currentColor">DSD</text>
        <line x1="6" y1="29" x2="32" y2="29" stroke="currentColor" stroke-width="0.6"/>
      </svg>
    `,
    olive: () => `
      <svg viewBox="0 0 38 38" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
          <path d="M19 4 C 19 14, 19 24, 19 34"/>
          <ellipse cx="13" cy="11" rx="4" ry="1.6" transform="rotate(-30 13 11)"/>
          <ellipse cx="25" cy="14" rx="4" ry="1.6" transform="rotate(30 25 14)"/>
          <ellipse cx="13" cy="20" rx="4" ry="1.6" transform="rotate(-30 13 20)"/>
          <ellipse cx="25" cy="23" rx="4" ry="1.6" transform="rotate(30 25 23)"/>
          <ellipse cx="14" cy="29" rx="3.5" ry="1.4" transform="rotate(-30 14 29)"/>
        </g>
      </svg>
    `,
    sceau: () => `
      <svg viewBox="0 0 38 38" aria-hidden="true">
        <circle cx="19" cy="19" r="17" fill="none" stroke="currentColor" stroke-width="0.6"/>
        <circle cx="19" cy="19" r="14" fill="none" stroke="currentColor" stroke-width="0.6"/>
        <text x="19" y="14" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="5.5" letter-spacing="1.4" fill="currentColor">DOMAINE</text>
        <text x="19" y="22" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="9" font-style="italic" fill="currentColor">SD</text>
        <text x="19" y="29" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="4" letter-spacing="2" fill="currentColor">EST · 1868</text>
        <line x1="6" y1="19" x2="9" y2="19" stroke="currentColor" stroke-width="0.6"/>
        <line x1="29" y1="19" x2="32" y2="19" stroke="currentColor" stroke-width="0.6"/>
      </svg>
    `
  };

  function renderLogos() {
    const v = window.DSD.tweaks.logoVariant || 'wordmark';
    document.querySelectorAll('[data-logo-slot]').forEach(slot => {
      slot.innerHTML = LOGOS[v] ? LOGOS[v]() : LOGOS.wordmark();
    });
    // also update the wordmark display style
    document.body.setAttribute('data-logo', v);
  }

  /* ---------- HEADER SCROLL ---------- */
  function setupHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 12) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- REVEAL ---------- */
  function setupReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // 1) Immediately reveal anything currently in (or above) the viewport,
    //    bypassing the transition. This guards against throttled iframes
    //    where transitions can stay stuck near opacity 0.
    const vh = window.innerHeight || 800;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < vh - 40) {
        el.style.transition = 'none';
        el.classList.add('in');
        requestAnimationFrame(() => { el.style.transition = ''; });
      }
    });

    // 2) Observe the rest with IntersectionObserver for subtle fade-in.
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => { if (!el.classList.contains('in')) io.observe(el); });

    // 3) Safety: 1.2s after init, force-reveal anything still hidden.
    setTimeout(() => {
      els.forEach(el => {
        if (!el.classList.contains('in')) {
          el.style.transition = 'none';
          el.classList.add('in');
          requestAnimationFrame(() => { el.style.transition = ''; });
        }
      });
    }, 1500);
  }

  /* ---------- MOBILE DRAWER ---------- */
  function setupDrawer() {
    const open = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    if (!open || !drawer) return;
    open.addEventListener('click', () => drawer.classList.toggle('open'));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
  }

  /* ---------- LANG SWITCH ---------- */
  function setupLang() {
    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.addEventListener('click', () => {
        const lg = b.dataset.lang;
        window.DSD.setTweak('lang', lg);
      });
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    applyTweaks();
    renderLogos();
    applyI18N();
    setupHeader();
    setupReveal();
    setupDrawer();
    setupLang();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* Tweaks edit-mode protocol is owned by tweaks-panel.jsx */
})();
