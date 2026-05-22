/* ============================================================
   contact.js — steppers · room chips · envoi email via Web3Forms
   ============================================================

   CONFIGURATION — à faire avant toute utilisation :

   1. Allez sur https://web3forms.com/
   2. Entrez l'adresse email de réception, cliquez « Create Access Key »
   3. Validez le lien reçu par email (vérifiez les spams)
   4. Copiez la clé (36 caractères) et collez-la dans WEB3FORMS_ACCESS_KEY

   ─ Pour tester   : entrez thomas@shunpo.fr → clé de test
   ─ En production : entrez domainesaintdominique@wanadoo.fr → clé prod

   Note : les requêtes fetch sont bloquées si la page est ouverte
   en file:// . Servez-la en local (ex. Live Server dans VS Code)
   ou testez depuis votre hébergement.
   ============================================================ */

const WEB3FORMS_ACCESS_KEY = "647f42a8-cdd0-4557-937b-b6e5294c38ad";

(function () {
  /* ── helpers ──────────────────────────────────────────────── */

  function fmtDate(iso) {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    const M = [
      "jan.",
      "fév.",
      "mar.",
      "avr.",
      "mai",
      "juin",
      "juil.",
      "août",
      "sep.",
      "oct.",
      "nov.",
      "déc.",
    ];
    return `${Number(d)} ${M[+m - 1]} ${y}`;
  }

  function nights(a, b) {
    if (!a || !b) return null;
    const n = Math.round((new Date(b) - new Date(a)) / 86400000);
    return n > 0 ? n : null;
  }

  /* ── init ─────────────────────────────────────────────────── */

  function init() {
    /* steppers ±  adultes / enfants */
    document.querySelectorAll(".stepper button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const inp = btn.parentElement.querySelector("input");
        if (!inp) return;
        inp.value = String(
          Math.max(
            +inp.min || 0,
            Math.min(+inp.max || 99, (+inp.value || 0) + +btn.dataset.step)
          )
        );
      });
    });

    /* room chips */
    const chips = document.querySelectorAll(".rooms-chips .chip");
    const roomIn = document.querySelector('input[name="room"]');
    chips.forEach((c, i) => {
      if (i === 0) c.classList.add("chip-active");
      c.addEventListener("click", () => {
        chips.forEach((x) => x.classList.remove("chip-active"));
        c.classList.add("chip-active");
        if (roomIn) roomIn.value = c.dataset.room;
      });
    });

    /* pré-sélection chambre via hash URL #book-rose … */
    if (location.hash.startsWith("#book-")) {
      const want = location.hash.replace("#book-", "");
      const match = Array.from(chips).find((c) => c.dataset.room === want);
      if (match) match.click();
    }

    /* ── soumission ───────────────────────────────────────────── */

    const form = document.getElementById("bookform");
    if (!form) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const submitLabel = submitBtn && submitBtn.querySelector("span");
    const okBox = form.querySelector(".ct-ok");
    const errBox = form.querySelector(".ct-error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      /* honeypot — abandon silencieux si rempli */
      if (form.querySelector('[name="website"]')?.value?.trim()) return;

      /* validation front-end des champs requis */
      let valid = true;
      form.querySelectorAll("[required]").forEach((el) => {
        el.style.removeProperty("border-bottom-color");
        if (!el.value.trim()) {
          valid = false;
          el.style.borderBottomColor = "var(--terracotta)";
          el.addEventListener(
            "input",
            () => el.style.removeProperty("border-bottom-color"),
            { once: true }
          );
        }
      });
      if (!valid) {
        form
          .querySelector('[style*="terracotta"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      /* état chargement */
      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = "Envoi en cours…";
      if (errBox) errBox.hidden = true;

      /* collecte des données */
      const fd = new FormData(form);
      const get = (k) => (fd.get(k) || "").trim();

      const prenom = get("firstname");
      const nom = get("lastname");
      const email = get("email");
      const phone = get("phone") || "—";
      const arrival = get("from");
      const depart = get("to");
      const adults = get("adults") || "2";
      const kids = get("kids") || "0";
      const msg = get("message") || "—";
      const room = get("room") || "any";

      const roomLabels = {
        any: "Indifférent",
        rouge: "Chambre Rouge",
        bleue: "Chambre Bleue",
        rose: "Chambre Rose",
        grise: "Chambre Grise",
        "bleue-onde": "Chambre Bleue Onde",
      };
      const roomLabel = roomLabels[room] || room;

      const n = nights(arrival, depart);
      const duree = n ? ` (${n} nuit${n > 1 ? "s" : ""})` : "";

      /* corps de l'email — lisible dans n'importe quel client */
      const body = [
        "Nouvelle demande de réservation — Domaine Saint Dominique",
        "",
        "── COORDONNÉES ─────────────────────────────────",
        `Prénom    : ${prenom}`,
        `Nom       : ${nom}`,
        `Email     : ${email}`,
        `Téléphone : ${phone}`,
        "",
        "── SÉJOUR ───────────────────────────────────────",
        `Arrivée   : ${fmtDate(arrival)}`,
        `Départ    : ${fmtDate(depart)}${duree}`,
        `Adultes   : ${adults}`,
        `Enfants   : ${kids}`,
        `Chambre   : ${roomLabel}`,
        "",
        "── MESSAGE ──────────────────────────────────────",
        msg,
        "",
        "─────────────────────────────────────────────────",
        `Répondre directement à : ${email}`,
      ].join("\n");

      /* envoi via Web3Forms */
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `Demande de réservation — ${prenom} ${nom}`,
            from_name: `${prenom} ${nom}`,
            email,
            message: body,
            botcheck: "" /* honeypot natif Web3Forms */,
          }),
        });

        const json = await res.json().catch(() => ({}));

        if (res.ok && json.success) {
          /* succès : masquer le formulaire, afficher la confirmation */
          form
            .querySelectorAll(".fs, .ct-submit")
            .forEach((f) => (f.style.display = "none"));
          if (okBox) {
            okBox.hidden = false;
            okBox.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          throw new Error(json.message || `HTTP ${res.status}`);
        }
      } catch (err) {
        console.error("[DSD form]", err);
        if (submitBtn) {
          submitBtn.disabled = false;
        }
        if (submitLabel) {
          submitLabel.textContent = "Envoyer le message";
        }
        if (errBox) {
          errBox.hidden = false;
          errBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
