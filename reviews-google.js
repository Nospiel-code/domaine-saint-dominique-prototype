/* ============================================================
   reviews-google.js — Domaine Saint Dominique
   ─────────────────────────────────────────────────────────────
   PROTOTYPE DATA — 5 sample reviews matching Google Places API
   field names so the live migration is a single fetch call.

   When the API key is ready, swap this entire block for:

     const res = await fetch(
       `https://places.googleapis.com/v1/places/${PLACE_ID}` +
       `?fields=rating,userRatingCount,reviews&languageCode=fr`,
       { headers: { 'X-Goog-Api-Key': API_KEY } }
     );
     const { rating, userRatingCount, reviews } = await res.json();
     window.DSD.googleReviews = { placeId: PLACE_ID, rating,
       userRatingCount, reviews: reviews.map(r => ({
         author:       r.authorAttribution.displayName,
         rating:       r.rating,
         relativeTime: r.relativePublishTimeDescription,
         date:         new Date(r.publishTime)
                         .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
         text:         r.text.text,
         lang:         r.text.languageCode,
       }))
     };
   ============================================================ */

window.DSD = window.DSD || {};
window.DSD.googleReviews = {
  placeId:         'REPLACE_WITH_PLACE_ID', /* ← paste Place ID here */
  rating:          4.4,
  userRatingCount: 67,

  reviews: [
    {
      author:       'Christophe Rodrigo',
      rating:       5,
      relativeTime: null,
      date:         'Août 2025',
      text:         'Là, tout n\'est que "bonheur et quiétude, générosité, convivialité et partage".\nUn cadre incroyable au milieu des vignes avec une piscine pour se détendre et se prélasser, une demeure magnifique à la décoration raffinée, soignée et des objets chinés qui rendent ce lieu unique, un petit-déjeuner quotidien succulent et copieux, un accueil chaleureux et familier et des hôtes - Patricia et Nicolas - adorables, remarquables de gentillesse et de générosité.\n6 jours passés sur une "autre planète".\nOn reviendra vous voir !!!',
      lang:         'fr',
    },
    {
      author:       'Lucie Galvain',
      rating:       5,
      relativeTime: null,
      date:         'Août 2025',
      text:         'Nous avons passé un séjour exceptionnel au Domaine Saint Dominique avec mon fils.\n\nL\'accueil est tout simplement parfait : chaleureux, attentionné et authentique. On sent que les propriétaires mettent tout leur cœur dans ce lieu, et cela se ressent dans les moindres détails. Les chambres sont spacieuses, confortables et extrêmement propres.\n\nLe domaine offre aussi de très belles prestations : une super piscine, un jardin entretenu avec soin, le petit-déjeuner est un vrai moment de bonheur, copieux et délicieux comportant uniquement des produits frais.\n\nUne adresse que je recommande les yeux fermés, et où nous reviendrons sans hésiter !',
      lang:         'fr',
    },
    {
      author:       'Leila Rouhani',
      rating:       5,
      relativeTime: null,
      date:         'Août 2025',
      text:         'Un séjour vraiment parfait ! La chambre était très agréable et on s\'y sent tout de suite comme chez soi. Les hôtes sont d\'une gentillesse incroyable, toujours souriants et aux petits soins. L\'ambiance est conviviale et chaleureuse, on a l\'impression d\'être accueilli comme des amis. Merci encore pour ce beau moment, nous reviendrons avec grand plaisir !',
      lang:         'fr',
    },
    {
      author:       'Johanna Bruneau',
      rating:       5,
      relativeTime: null,
      date:         'Août 2025',
      text:         'Un séjour parfait au Domaine Sainte Dominique !\nPatricia et Nicolas sont des hôtes incroyables comme on n\'en fait plus : généreux, aux petits soins, et d\'une gentillesse rare. On se sent vraiment comme à la maison, dans un lieu paisible et chaleureux.\n\nLe domaine est idéalement situé, proche de nombreux sites à visiter. La piscine est superbe, l\'ambiance conviviale, et on y fait de belles rencontres autour d\'un apéritif partagé.\n\nJe suis venue avec ma fille de 7 ans et tout a été parfait pour nous deux. Je recommande ce lieu les yeux fermés et j\'y reviendrai avec grand plaisir.\n\nUn grand merci pour la qualité de ce séjour, tant pour le confort et la praticité que pour la richesse humaine de ces moments partagés. ❤️',
      lang:         'fr',
    },
    {
      author:       'Charles de Besombes',
      rating:       5,
      relativeTime: null,
      date:         'Août 2024',
      text:         'Séjour magique et détendant de 5 nuits au cœur de l\'été dans cette splendide bastide provençale. Le cadre est calme et agréable, la déco jolie et soignée, la piscine au top. Les hôtes de cette maison de charme, Patricia et Nicolas, font tout pour vous rendre la vie agréable et vous inciter à profiter pleinement du moment et des douceurs locales. Nous garderons un excellent souvenir de notre séjour au Domaine Saint Dominique.',
      lang:         'fr',
    },
  ],
};
