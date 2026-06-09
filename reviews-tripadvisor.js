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
  rating:     4.9,
  total:      215,
  badge:      'Travellers\' Choice',
  profileUrl: 'https://www.tripadvisor.fr/Hotel_Review-g2189461-d2178064-Reviews-Domaine_Saint_Dominique',

  reviews: [
    {
      author:   'Paula F',
      location: 'Marseille, France',
      rating:   5,
      date:     'Mai 2026',
      title:    'Merveilleux Domaine',
      text:     'Nous avons passé un séjour absolument merveilleux au sein de Domaine Saint Dominique. Dès notre arrivée, nous avons été accueillis par Patou et Nicolas des hôtes exceptionnels, attentifs et soucieux de notre bien-être. Le domaine est magnifique, décoré avec beaucoup de goût et d\'authenticité. Les chambres sont spacieuses, impeccablement propres et très confortables. Le cadre est un véritable havre de paix, entouré de vignes et de nature, idéal pour se ressourcer. La piscine, le jardin, les terrasses sont de merveilleux espaces de détente invitant à la relaxation. Mention spéciale pour les délicieux petits-déjeuners, copieux et préparés avec soin (confitures maison, salade de fruits frais et jus de fruits), ainsi que pour les moments de convivialité qui rendent le séjour encore plus agréable. Plus qu\'une simple chambre d\'hôtes, c\'est une expérience très chaleureuse que nous avons vécue. Une adresse d\'exception que nous recommandons les yeux fermés 😁',
      lang:     'fr',
      reply:    null,
    },
    {
      author:   'François L',
      location: 'Lyon, France',
      rating:   5,
      date:     'Juin 2026',
      title:    'Paradisiaque',
      text:     'Un passage de 3 jours dans cette chambre d\'hôtes où j\'y avais de beaux souvenirs, à été aussi merveilleux que mes précédents séjours. L\'accueil de Patou est Nicolas est toujours aussi chaleureux et amical. Les terrasses fleuries et la piscine un véritable havre de paix et de bien être Que dire des petits déjeuners ? Toujours aussi goûteux et variés ! Quant aux apéros de nos hôtes, avec le rosé local et la tapenade maison…. Le mieux est de découvrir cet endroit magnifique et atypique pour vous même ! Une maison incontournable et inimitable !',
      lang:     'fr',
      reply:    null,
    },
    {
      author:   'François L',
      location: 'Lyon, France',
      rating:   5,
      date:     'Août 2025',
      title:    'Un lieu enchanteur',
      text:     'Une maison incroyable qui vous plonge dans un autre univers. Patou et Nicolas vous reçoivent tel un membre de leur famille : bienveillance, gentillesse et une attention toute particulière pour votre bien être. Les chambres sont toutes différentes et décorées par thème. Les hôtes vous proposent un apéro avec de la tapenade maison, qui est excellente. Les petits déjeuners sont gargantuesques et pris sous la magnifique terrasse devant la maison. Les points d\'intérêts sont nombreux et proches. Les amoureux de calme et de verdure seront ravis autour de la grande piscine chauffée. Une belle adresse à découvrir qui vous laissera de beaux souvenirs !',
      lang:     'fr',
      reply:    null,
    },
    {
      author:   'Florence A',
      location: null,
      rating:   5,
      date:     'Août 2025',
      title:    'A découvrir absolument !',
      text:     'Accueil très chaleureux et dans la bonne humeur. Les propriétaires ont été très attentifs à nos besoins et à rendre le séjour agréable. Le cadre est beau et reposant. Le petit déjeuner sur la terrasse est au top! La chambre était propre, spacieuse, confortable et décorée avec beaucoup de goût (comme tout le domaine d\'ailleurs). Quel plaisir également de profiter de la piscine après une journée de ballade. Nous recommandons à 100%.',
      lang:     'fr',
      reply:    null,
    },
    {
      author:   'Lucie G',
      location: null,
      rating:   5,
      date:     'Août 2025',
      title:    'Comme à la maison',
      text:     'Nous avons passé un séjour exceptionnel au Domaine Saint Dominique avec mon fils. L\'accueil est tout simplement parfait : chaleureux, attentionné et authentique. On sent que les propriétaires mettent tout leur cœur dans ce lieu, et cela se ressent dans les moindres détails. Les chambres sont spacieuses, confortables et extrêmement propres. Le domaine offre aussi de très belles prestations : une super piscine, un jardin entretenu avec soin, le petit-déjeuner est un vrai moment de bonheur, copieux et délicieux comportant uniquement des produits frais. Une adresse que je recommande les yeux fermés, et où nous reviendrons sans hésiter !',
      lang:     'fr',
      reply:    null,
    },
  ],
};
