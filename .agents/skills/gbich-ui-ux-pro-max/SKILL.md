---
name: gbich-ui-ux-pro-max
description: >-
  Use this skill whenever designing, building, styling, animating, or reviewing UI/UX components, screens, navigation, or micro-interactions for GBICH'APP. Provides the official brand identity (Primary #F5222D, Secondary #171416, Tertiary #A80F1C, Neutral #E8E5E2), the tri-font typographic hierarchy (Anton, Inter, Space Grotesk), component specifications (floating pill nav, button variants, search input, badges), and advanced motion design patterns (GSAP kinetic headlines, Framer Motion 3D flip-cards, 3D tilt, tactile haptic feedback).
---

# GBICH'APP UI/UX Pro Max — Design System & Motion Intelligence

Ce skill formalise les règles de conception d'interface, d'ergonomie, de direction artistique et de motion design pour l'ensemble de l'application **GBICH'APP** (Progressive Web App).

---

## 1. Identité Visuelle & Charte Graphique

Consultez le guide détaillé : [Directives de Charte Graphique](./references/brand-guidelines.md)  
Tokens JSON complets : [Tokens de Design](./references/design-tokens.json)

### Palette Officielle

| Token | Code Hex | Nom | Usage Maître |
| :--- | :--- | :--- | :--- |
| **`colors.primary`** | `#F5222D` | Satirical Red | Action principale, La Une, Badges d'urgence, Cercles de jeu, Onglet actif |
| **`colors.secondary`** | `#171416` | Ink Charcoal | Typographie principale, cartes inversées, fonds sombres d'encre |
| **`colors.tertiary`** | `#A80F1C` | Crimson Bordeaux | Accent dramatique, bordures d'alerte, états pressés |
| **`colors.neutral`** | `#E8E5E2` | Warm Newsprint | Fond papier journal chaud, cartes claires, boutons secondaires, inputs |

---

## 2. Système Typographique Tri-Font

Chaque typographie a un rôle unique et ne doit pas être mélangée arbitrairement :

1. **`Anton` (Headline & Display)** :
   - *Usage* : Titres satiriques choc, La Une du journal, punchlines des dessins, grands scores de fin de partie.
   - *Caractéristique* : Ultra-condensé, percutant, grand format, majuscules recommandées.
2. **`Inter` (Body & Reading)** :
   - *Usage* : Textes d'articles, décryptages journalistiques EMI, explications des quiz, paragraphes de lecture.
   - *Caractéristique* : Lisibilité optimale à toutes résolutions, graisses 400 à 600.
3. **`Space Grotesk` (Labels, Controls & Micro-copy)** :
   - *Usage* : Boutons, barre d'onglets, filtres thématiques, badges, chronomètres, scores en direct.
   - *Caractéristique* : Géométrique, typée technique/moderne, graisses 600 et 700.

---

## 3. Composants d'Interface Canoniques

Consultez le catalogue détaillé : [Spécifications des Composants](./references/components.md)

- **Boutons standardisés** :
  - `Primary` : Fond `#F5222D`, texte blanc, coins arrondis 12px, ombre portée douce.
  - `Secondary` : Fond `#E8E5E2`, texte `#171416`.
  - `Inverted` : Fond `#171416`, texte blanc.
  - `Outlined` : Fond transparent, bordure 1.5px `#A80F1C`, texte `#A80F1C`.
- **Barre de Navigation Flottante en Pilule** :
  - Conteneur arrondi (`border-radius: 9999px`), fond teinté avec flou d'arrière-plan (*glassmorphism*).
  - Onglet actif représenté par un cercle plein rouge `#F5222D` avec icône blanche contrastée.
- **Champ de Recherche** :
  - Bords arrondis 12px, loupe grise à gauche, fond `#FFFFFF` ou `#FAF9F8`.
- **Boutons Circulaires d'Action** :
  - Diamètre 40px, fond `#F5222D` ou `#A80F1C` (Baguette magique, Calques, Tag, Corbeille).
- **Lignes Séparatrices Satiriques Tri-Color** :
  - Triple barre horizontale d'accentuation (`#F5222D`, `#171416`, `#A80F1C`).

---

## 4. Référentiel Motion Design & 3D (GSAP, Framer Motion, MotionSites)

Consultez le guide complet : [Référentiel d'Animation & 3D](./references/motion-and-animation.md)

### Principes Clés
- **Courbe d'Accélération Maîtresse** : `cubic-bezier(0.16, 1, 0.3, 1)` pour tout mouvement snappy.
- **Framer Motion — Flip Card 3D (EMI "Vrai ou Faux ?")** :
  - Rotation 3D à 180° sur l'axe Y (`perspective: 1200px`, `backface-visibility: hidden`).
- **Framer Motion — Glissement Fluide d'Onglet (`layoutId`)** :
  - Ressort amorti (`stiffness: 450, damping: 32`) déplaçant la pastille rouge entre les icônes de la barre de navigation.
- **GSAP — Titres Cinétiques "La Une"** :
  - Animation de frappe et secousse satirique (*slam & shake*) à l'apparition des scoops.
- **GSAP / Canvas — Validation du Jeu des 7 Erreurs** :
  - Onde radar rouge (`#F5222D`) animée au point de contact tactile avec impulsion haptique.

---

## 5. Moteur de Recherche Local

Un utilitaire Python est disponible pour interroger rapidement les tokens et spécifications :

```bash
# Exemple d'interrogations rapides :
python .agents/skills/gbich-ui-ux-pro-max/scripts/search.py "primary color"
python .agents/skills/gbich-ui-ux-pro-max/scripts/search.py "buttons"
python .agents/skills/gbich-ui-ux-pro-max/scripts/search.py "flip card"
python .agents/skills/gbich-ui-ux-pro-max/scripts/search.py "typography"
```

---

## 6. Checklist de Validation Qualité UI/UX (Avant Livraison)

Avant de valider tout nouvel écran ou composant :
- [ ] Les couleurs utilisées proviennent exclusivement des tokens (`#F5222D`, `#171416`, `#A80F1C`, `#E8E5E2`).
- [ ] La hiérarchie typographique respecte la règle : **Anton** (Titres), **Inter** (Textes), **Space Grotesk** (Contrôles).
- [ ] Les boutons adoptent l'une des 4 variantes officielles (`Primary`, `Secondary`, `Inverted`, `Outlined`).
- [ ] Le layout est centré et réactif sur grand écran via le conteneur responsive.
- [ ] Les micro-interactions intègrent un retour tactile immédiat (rebond ressort sous 150ms).
- [ ] Le contraste texte/fond respecte strictement le seuil WCAG 2.1 AA (4.5:1 minimum).
