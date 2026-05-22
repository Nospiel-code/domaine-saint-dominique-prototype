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
  rating:          4.9,
  userRatingCount: 312,

  reviews: [
    {
      author:       'Hélène M.',
      rating:       5,
      relativeTime: 'il y a 2 mois',
      date:         'Mars 2026',
      text:         'Patricia nous a accueillis comme de la famille. Petit-déjeuner sous les platanes, piscine au calme, conseils précieux de Nicolas pour la rando du Caramy. La chambre est un bijou. Mention spéciale pour la confiture de figues maison.',
      lang:         'fr',
    },
    {
      author:       'Famille Bertrand',
      rating:       5,
      relativeTime: 'il y a 4 mois',
      date:         'Septembre 2025',
      text:         'Trouvée par hasard et qu\'on n\'oublie plus. La chambre est parfaite pour notre famille — deux ados qui rechignaient à venir et qui repartent enchantés. Cuisine accessible, piscine impeccable, accueil franc et simple.',
      lang:         'fr',
    },
    {
      author:       'Camille D.',
      rating:       5,
      relativeTime: 'il y a 5 mois',
      date:         'Septembre 2025',
      text:         'Quatre nuits pour notre dixième anniversaire de mariage. Patricia avait préparé un petit mot dans la chambre, des fleurs du jardin, une bouteille du voisin. Le genre d\'attention qu\'on n\'oublie pas. On reviendra.',
      lang:         'fr',
    },
    {
      author:       'Sophie R.',
      rating:       5,
      relativeTime: 'il y a 6 mois',
      date:         'Août 2025',
      text:         'Le linge de lit en lin, le savon de Marseille fait à 20 km, la carte des sentiers annotée à la main. On sent que c\'est tenu par des gens qui aiment vraiment recevoir. Bravo.',
      lang:         'fr',
    },
    {
      author:       'Jean-François L.',
      rating:       5,
      relativeTime: 'il y a 8 mois',
      date:         'Mai 2025',
      text:         'Deuxième séjour en trois ans. Toujours aussi parfait. Nicolas est devenu un ami, Patricia connaît nos préférences. Le domaine est tenu avec un soin maniaque, mais sans jamais en faire trop. Vraie maison, vraie campagne, vraies gens.',
      lang:         'fr',
    },
  ],
};
