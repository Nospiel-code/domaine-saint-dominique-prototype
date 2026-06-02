/* ============================================================
   partials.js — injects shared header, drawer & footer.
   Each page sets <body data-page="domain|rooms|activities|reviews|contact">
   ============================================================ */

(function () {
  function inject() {
    const page = document.body.getAttribute('data-page') || '';

  const header = `
    <header class="site-header">
      <div class="wrap nav-row">
        <a class="brand" href="index.html" aria-label="Domaine Saint Dominique">
          <span class="brand-mark" data-logo-slot></span>
          <span>
            <span class="brand-name">Domaine <em>Saint Dominique</em></span>
            <div class="brand-tag">Maison d'hôtes · 1868</div>
          </span>
        </a>
        <nav class="nav-main" aria-label="Principal">
          <a href="index.html" data-i18n="nav.home"${page==='home'?' class="active"':''}>Accueil</a>
          <a href="domaine.html" data-i18n="nav.domain"${page==='domain'?' class="active"':''}>Le Domaine</a>
          <a href="chambres.html" data-i18n="nav.rooms"${page==='rooms'?' class="active"':''}>Les Chambres</a>
          <a href="activites.html" data-i18n="nav.activities"${page==='activities'?' class="active"':''}>Activités &amp; Alentours</a>
          <a href="avis.html" data-i18n="nav.reviews"${page==='reviews'?' class="active"':''}>Avis</a>
          <a href="contact.html" data-i18n="nav.contact"${page==='contact'?' class="active"':''}>Contact</a>
        </nav>
        <div class="nav-end">
          <div class="lang-switch" role="group" aria-label="Langue">
            <button data-lang="fr" class="active">FR</button>
            <button data-lang="en">EN</button>
          </div>
          <a class="btn btn-primary hide-sm" href="contact.html"><span data-i18n="nav.book">Réserver</span>
            <svg class="arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
          </a>
          <button class="mobile-toggle" aria-label="Menu"><span></span></button>
        </div>
      </div>
    </header>
    <div class="mobile-drawer" aria-hidden="true">
      <button class="mobile-close" aria-label="Fermer">✕</button>
      <a href="index.html" data-i18n="nav.home">Accueil</a>
      <a href="domaine.html" data-i18n="nav.domain">Le Domaine</a>
      <a href="chambres.html" data-i18n="nav.rooms">Les Chambres</a>
      <a href="activites.html" data-i18n="nav.activities">Activités &amp; Alentours</a>
      <a href="avis.html" data-i18n="nav.reviews">Avis</a>
      <a href="contact.html" data-i18n="nav.contact">Contact</a>
    </div>
  `;

  const footer = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-col">
            <h4 data-i18n="footer.tag">Maison d'hôtes en Provence Verte</h4>
            <div class="footer-brand">Domaine <em>Saint Dominique</em></div>
            <p style="color: rgba(255,255,255,.65); font-size: 14px; max-width: 36ch;">Cinq chambres, un parc, une piscine et deux hôtes qui aiment recevoir. Ouvert d'avril à octobre.</p>
          </div>
          <div class="footer-col">
            <h4 data-i18n="footer.explore">Explorer</h4>
            <ul>
              <li><a href="domaine.html" data-i18n="nav.domain">Le Domaine</a></li>
              <li><a href="chambres.html" data-i18n="nav.rooms">Les Chambres</a></li>
              <li><a href="activites.html" data-i18n="nav.activities">Activités &amp; Alentours</a></li>
              <li><a href="avis.html" data-i18n="nav.reviews">Avis</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 data-i18n="footer.contact">Contact</h4>
            <ul>
              <li><span data-i18n="footer.addr">177 Quartier de Paris</span></li>
              <li><span data-i18n="footer.city">83470 Seillons-Source-d'Argens</span></li>
              <li><a href="tel:+33630072816" data-i18n="footer.tel">+33 6 30 07 28 16</a></li>
              <li><a href="mailto:domainesaintdominique@wanadoo.fr" data-i18n="footer.mail">domainesaintdominique@wanadoo.fr</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 data-i18n="footer.follow">Nous suivre</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Google Reviews</a></li>
              <li><a href="#">TripAdvisor</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-meta">
          <span data-i18n="footer.rights">© 2026 Domaine Saint Dominique · Tous droits réservés</span>
          <span data-i18n="footer.craft">Site refondu avec soin · MMXXVI</span>
        </div>
      </div>
    </footer>
  `;

  // Inject before #content-end and #content-start markers
  const hSlot = document.querySelector('[data-slot="header"]');
  const fSlot = document.querySelector('[data-slot="footer"]');
  if (hSlot) hSlot.outerHTML = header;
    if (fSlot) fSlot.outerHTML = footer;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
