/* ============================================================
   tweaks.jsx — Domaine Saint Dominique
   Full tweak panel with ~15 controls grouped in 6 sections.
   Every change routes through window.DSD.setTweak so it persists
   in localStorage and applies live across all 6 pages.
   ============================================================ */

(function () {
  if (!window.React || !window.ReactDOM) return;
  const { useState } = React;

  function App() {
    const [tweaks, setTweaks] = useState(() => ({ ...(window.DSD?.tweaks || {}) }));

    const set = (key, value) => {
      window.DSD?.setTweak(key, value);
      setTweaks({ ...window.DSD.tweaks });
    };

    return (
      <TweaksPanel title="Tweaks · Domaine SD">

        {/* ─── Couleurs ─── */}
        <TweakSection label="Couleurs">
          <TweakSelect
            label="Italiques"
            value={tweaks.italicColor}
            options={[
              { value: 'terracotta', label: 'Couleur accent' },
              { value: 'olive',      label: 'Olive' },
              { value: 'ink',        label: 'Encre (sobre)' },
            ]}
            onChange={(v) => set('italicColor', v)}
          />
          <TweakSelect
            label="CTA principal"
            value={tweaks.ctaColor}
            options={[
              { value: 'terracotta', label: 'Terracotta (accent)' },
              { value: 'ink',        label: 'Encre noire' },
              { value: 'olive',      label: 'Olive' },
            ]}
            onChange={(v) => set('ctaColor', v)}
          />
        </TweakSection>

        {/* ─── Typographie ─── */}
        <TweakSection label="Typographie">
          <TweakSelect
            label="Pairing"
            value={tweaks.typePair}
            options={[
              { value: 'cormorant-karla', label: 'Cormorant · Karla' },
              { value: 'dmserif-manrope', label: 'DM Serif · Manrope' },
            ]}
            onChange={(v) => set('typePair', v)}
          />
          <TweakRadio
            label="Display"
            value={tweaks.displayWeight}
            options={[
              { value: 'light',   label: 'Léger' },
              { value: 'regular', label: 'Régulier' },
              { value: 'medium',  label: 'Médium' },
            ]}
            onChange={(v) => set('displayWeight', v)}
          />
        </TweakSection>

        {/* ─── Mise en page ─── */}
        <TweakSection label="Mise en page">
          <TweakRadio
            label="Densité"
            value={tweaks.density}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'regular', label: 'Régulier' },
              { value: 'airy',    label: 'Aéré' },
            ]}
            onChange={(v) => set('density', v)}
          />
          <TweakRadio
            label="Coins"
            value={tweaks.radius}
            options={[
              { value: 'sharp',   label: 'Net' },
              { value: 'soft',    label: 'Doux' },
              { value: 'rounded', label: 'Arrondi' },
            ]}
            onChange={(v) => set('radius', v)}
          />
          <TweakRadio
            label="Largeur"
            value={tweaks.containerWidth}
            options={[
              { value: 'narrow',  label: 'Étroit' },
              { value: 'regular', label: 'Standard' },
              { value: 'wide',    label: 'Large' },
            ]}
            onChange={(v) => set('containerWidth', v)}
          />
          <TweakSelect
            label="Eyebrow"
            value={tweaks.eyebrowStyle}
            options={[
              { value: 'line',    label: 'Ligne (par défaut)' },
              { value: 'dot',     label: 'Point' },
              { value: 'bracket', label: 'Crochets [ ]' },
              { value: 'clean',   label: 'Sans ornement' },
            ]}
            onChange={(v) => set('eyebrowStyle', v)}
          />
          <TweakSelect
            label="Header"
            value={tweaks.headerStyle}
            options={[
              { value: 'transparent', label: 'Transparent (par défaut)' },
              { value: 'line',        label: 'Avec filet inférieur' },
              { value: 'solid',       label: 'Toujours opaque' },
            ]}
            onChange={(v) => set('headerStyle', v)}
          />
        </TweakSection>

        {/* ─── Identité ─── */}
        <TweakSection label="Identité">
          <TweakSelect
            label="Logo"
            value={tweaks.logoVariant}
            options={[
              { value: 'wordmark', label: 'Wordmark · initial' },
              { value: 'monogram', label: 'Monogramme DSD' },
              { value: 'olive',    label: 'Rameau d’olivier' },
              { value: 'sceau',    label: 'Sceau / cartouche' },
            ]}
            onChange={(v) => set('logoVariant', v)}
          />
          <TweakSelect
            label="Baseline"
            value={tweaks.brandTag}
            options={[
              { value: '1782',     label: '« Maison d’hôtes · 1782 »' },
              { value: 'province', label: '« Maison d’hôtes · Provence Verte »' },
              { value: 'var',      label: '« Var · 5 chambres »' },
              { value: 'off',      label: 'Sans baseline' },
            ]}
            onChange={(v) => set('brandTag', v)}
          />
        </TweakSection>

        {/* ─── Images & effets ─── */}
        <TweakSection label="Images & effets">
          <TweakSelect
            label="Placeholders"
            value={tweaks.phStyle}
            options={[
              { value: 'striped', label: 'Rayés (par défaut)' },
              { value: 'solid',   label: 'Aplats unis' },
              { value: 'grid',    label: 'Trame de points' },
              { value: 'cross',   label: 'Hachures croisées' },
            ]}
            onChange={(v) => set('phStyle', v)}
          />
          <TweakToggle
            label="Filigrane plume (olivier)"
            value={tweaks.botanical}
            onChange={(v) => set('botanical', v)}
          />
          <TweakToggle
            label="Animations au scroll"
            value={tweaks.animations}
            onChange={(v) => set('animations', v)}
          />
        </TweakSection>

        {/* ─── Sections accueil ─── */}
        <TweakSection label="Sections accueil">
          <TweakToggle
            label="Encart presse Var-Matin"
            value={tweaks.showPress}
            onChange={(v) => set('showPress', v)}
          />
          <TweakToggle
            label="Strip de chiffres-clés"
            value={tweaks.showFacts}
            onChange={(v) => set('showFacts', v)}
          />
          <TweakToggle
            label="Méta hero (coordonnées)"
            value={tweaks.showMeta}
            onChange={(v) => set('showMeta', v)}
          />
        </TweakSection>

        {/* ─── Langue ─── */}
        <TweakSection label="Langue">
          <TweakRadio
            label="Site"
            value={tweaks.lang}
            options={[
              { value: 'fr', label: 'FR' },
              { value: 'en', label: 'EN' },
            ]}
            onChange={(v) => set('lang', v)}
          />
        </TweakSection>

      </TweaksPanel>
    );
  }

  const mount = document.createElement('div');
  mount.id = 'dsd-tweaks-root';
  document.body.appendChild(mount);
  ReactDOM.createRoot(mount).render(<App />);
})();
