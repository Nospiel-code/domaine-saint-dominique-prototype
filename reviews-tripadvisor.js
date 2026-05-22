/* ============================================================
   reviews-tripadvisor.js — Domaine Saint Dominique
   ─────────────────────────────────────────────────────────────
   TripAdvisor reviews — maintained manually.
   Recommended: refresh every 2–3 months with recent reviews.

   Fields per review:
   · author    (string)         reviewer name
   · location  (string|null)    reviewer's city/country — optional
   · rating    (1–5)            number of stars
   · date      (string)         display date, e.g. 'Octobre 2025'
   · title     (string)         review headline
   · text      (string)         body text
   · lang      (string)         'fr' | 'en' | 'de' | 'es' | …
   · reply     (object|null)    optional host reply → { text, date }
   ============================================================ */

window.DSD = window.DSD || {};
window.DSD.taReviews = {
  rating:     4.8,
  total:      108,
  badge:      'Travellers\' Choice',
  profileUrl: 'https://www.tripadvisor.fr/Hotel_Review-g2189461-d2178064-Reviews-Domaine_Saint_Dominique',

  reviews: [
    {
      author:   'James & Eliza',
      location: 'Londres, Royaume-Uni',
      rating:   5,
      date:     'Octobre 2025',
      title:    'A real gem in the heart of Provence',
      text:     'The house has soul, the breakfast is fresh and abundant, Nicolas knows every trail and every winemaker in the region. We had a glass of rosé with our hosts on arrival and didn\'t want to leave. Easily our best French stay.',
      lang:     'en',
      reply:    null,
    },
    {
      author:   'Klaus H.',
      location: 'Munich, Allemagne',
      rating:   5,
      date:     'Août 2025',
      title:    'Echte Gastfreundschaft',
      text:     'Wunderschönes Haus, herzliche Gastgeber. Das Frühstück mit hausgemachter Konfitüre und frischem Brot war jeden Morgen ein Highlight. Der Pool und der Garten — pure Erholung. Vielen Dank an Nicolas und Patricia!',
      lang:     'de',
      reply:    null,
    },
    {
      author:   'Elena V.',
      location: 'Madrid, Espagne',
      rating:   5,
      date:     'Juillet 2025',
      title:    'Un rincón mágico de la Provenza',
      text:     'Casa preciosa, jardín sublime, anfitriones encantadores. Nos ayudaron a planificar visitas a bodegas locales y nos prestaron las bicicletas para recorrer los pueblos. Volveremos sin duda.',
      lang:     'es',
      reply:    null,
    },
    {
      author:   'Marc N.',
      location: 'Lyon, France',
      rating:   4,
      date:     'Juillet 2025',
      title:    'Très belle adresse, petit bémol',
      text:     'L\'accueil est exceptionnel, la maison superbe, la table excellente. Seul reproche : la départementale en contrebas qui se fait entendre vers une chambre côté route. Demander les chambres côté parc pour ceux qui ont le sommeil léger.',
      lang:     'fr',
      reply: {
        text: 'Merci Marc pour ce retour si juste. Nous avons replanté en novembre la haie côté route — d\'ici l\'été 2026, le bruit ne devrait plus être un sujet. Au plaisir de vous accueillir à nouveau !',
        date: 'Juillet 2025',
      },
    },
    {
      author:   'Anna G.',
      location: 'Stockholm, Suède',
      rating:   5,
      date:     'Mai 2025',
      title:    'Beyond expectations',
      text:     'We\'ve stayed in many B&Bs across Europe. This is one of the very best. Authentic, generous, warm, and beautifully restored. Patricia\'s breakfasts deserve their own review. The pool was the perfect end to every hiking day.',
      lang:     'en',
      reply:    null,
    },
  ],
};
