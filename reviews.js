/* ============================================================
   reviews.js — Domaine Saint Dominique
   Renders Google + TripAdvisor review cards into .rev-wall
   on avis.html. Also handles filter chip interactions.
   Data sources: reviews-google.js · reviews-tripadvisor.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */
  const AVATAR = ['a-1', 'a-2', 'a-3', 'a-4', 'a-5'];

  function initials(name) {
    return name
      .split(/[\s&,]+/)
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  function stars(n) {
    return '★'.repeat(n) + (n < 5 ? '☆'.repeat(5 - n) : '');
  }

  /* Safely escape text for innerHTML insertion */
  function esc(str) {
    const el = document.createElement('span');
    el.textContent = String(str);
    return el.innerHTML;
  }

  /* ── Card templates ──────────────────────────────────────── */
  function googleCard(r, idx) {
    return `
      <article class="rev-card reveal" data-source="google">
        <div class="rev-head">
          <div class="rev-avatar ${AVATAR[idx % 5]}">${esc(initials(r.author))}</div>
          <div>
            <div class="rev-name">${esc(r.author)}</div>
            <div class="rev-meta">
              <span class="rev-stars">${stars(r.rating)}</span>
              <span>·</span>
              <span class="caption">${esc(r.date)}</span>
              ${r.relativeTime ? `<span class="caption">· ${esc(r.relativeTime)}</span>` : ''}
            </div>
          </div>
          <div class="rev-src g" title="Google">G</div>
        </div>
        ${r.title ? `<h4 class="rev-title">${esc(r.title)}</h4>` : ''}
        <p class="rev-text">${esc(r.text)}</p>
      </article>`;
  }

  function taCard(r, idx) {
    const replyHtml = r.reply ? `
      <div class="rev-reply">
        <div class="rev-reply-head">
          <strong>Réponse de Nicolas &amp; Patricia</strong>
          <span class="caption">· ${esc(r.reply.date)}</span>
        </div>
        <p>${esc(r.reply.text)}</p>
      </div>` : '';

    return `
      <article class="rev-card reveal" data-source="ta">
        <div class="rev-head">
          <div class="rev-avatar ${AVATAR[idx % 5]}">${esc(initials(r.author))}</div>
          <div>
            <div class="rev-name">
              ${esc(r.author)}
              ${r.location ? `<span class="rev-location"> · ${esc(r.location)}</span>` : ''}
            </div>
            <div class="rev-meta">
              <span class="rev-stars">${stars(r.rating)}</span>
              <span>·</span>
              <span class="caption">${esc(r.date)}</span>
            </div>
          </div>
          <div class="rev-src t" title="TripAdvisor">◉</div>
        </div>
        ${r.title ? `<h4 class="rev-title">${esc(r.title)}</h4>` : ''}
        <p class="rev-text">${esc(r.text)}</p>
        ${replyHtml}
      </article>`;
  }

  /* Section divider — spans all grid columns */
  function sectionHead(label, first) {
    return `<div class="rev-section-head${first ? ' rev-section-head--first' : ''}" data-section-head>
      <span class="caption">${label}</span>
    </div>`;
  }

  /* ── Render all reviews into .rev-wall ───────────────────── */
  function render() {
    const wall = document.querySelector('.rev-wall');
    if (!wall) return;

    const gr = window.DSD && window.DSD.googleReviews;
    const ta = window.DSD && window.DSD.taReviews;
    let html  = '';
    let total = 0;

    if (gr && gr.reviews && gr.reviews.length) {
      html += sectionHead(`Google · ${gr.reviews.length} avis récents`, true);
      gr.reviews.forEach((r, i) => { html += googleCard(r, i); total++; });
    }

    if (ta && ta.reviews && ta.reviews.length) {
      html += sectionHead('TripAdvisor · sélection mise à jour manuellement', false);
      ta.reviews.forEach((r, i) => { html += taCard(r, i); total++; });
    }

    wall.innerHTML = html;

    /* Update footer count */
    const counter = document.querySelector('.rev-count');
    if (counter) counter.textContent = `Affichage ${total} avis`;
  }

  /* ── Filter chips ────────────────────────────────────────── */
  function setupFilters() {
    document.querySelectorAll('.chip[data-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip[data-filter]')
          .forEach(c => c.classList.remove('chip-active'));
        chip.classList.add('chip-active');
        applyFilter(chip.dataset.filter);
      });
    });
  }

  function applyFilter(source) {
    const wall = document.querySelector('.rev-wall');
    if (!wall) return;

    /* Show/hide cards */
    wall.querySelectorAll('.rev-card').forEach(card => {
      card.style.display =
        (source === 'all' || card.dataset.source === source) ? '' : 'none';
    });

    /* Hide a section head if all its cards are hidden */
    wall.querySelectorAll('[data-section-head]').forEach(head => {
      let sibling = head.nextElementSibling;
      let hasVisible = false;
      while (sibling && !sibling.hasAttribute('data-section-head')) {
        if (sibling.style.display !== 'none') { hasVisible = true; break; }
        sibling = sibling.nextElementSibling;
      }
      head.style.display = hasVisible ? '' : 'none';
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    render();
    setupFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
