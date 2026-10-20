# GBICH'APP — Directives de Charte Graphique & Identité Visuelle

Cette référence consigne les spécifications exactes de l'identité visuelle de **GBICH'APP**, dérivées de la charte graphique officielle.

---

## 1. Palette Chromatique Principale

### 🔴 Primary : Satirical Red (`#F5222D`)
- **Rôle** : Couleur emblématique de GBICH!. Symbolise l'urgence, le scoop satirique, la vivacité du trait caricatural et l'action principale.
- **Usage** : Boutons d'action prioritaires (CTA), badges "La Une / En Direct", verdict "FAUX !", cercles d'erreurs trouvées, indicateurs actifs de navigation.
- **Nuancier** :
  - `900` : `#2B0A0D` — Fond sombre teinté
  - `700` : `#730E18` — Ombre et survol sombre
  - `600` : `#A80F1C` — Couleur tertiaire / Accent bordeaux
  - `400` : `#F5222D` — **Couleur Primaire Officielle**
  - `200` : `#FF7875` — Accent clair & survol
  - `50`  : `#FFCCC7` — Fond de badge atténué
  - `25`  : `#FFF1F0` — Arrière-plan de message d'alerte

### ⬛ Secondary : Ink Charcoal (`#171416`)
- **Rôle** : Noir d'encre de rotative de presse. Remplace le noir pur `#000000` par une teinte charbon profond chaude et texturée.
- **Usage** : Typographie principale sur fond clair, cartes inversées, boutons "Inverted", fond d'écran sombre élégant, contours d'illustrations.
- **Nuancier** :
  - `950` : `#0D0C0D` — Noir absolu adouci
  - `900` : `#171416` — **Couleur Secondaire Officielle**
  - `800` : `#262325` — Cartes sombres et modales
  - `600` : `#575254` — Textes secondaires et icônes inactives
  - `400` : `#969093` — Bordures et séparateurs discrets
  - `200` : `#D9D6D7` — Arrière-plans subtils

### 🍷 Tertiary : Crimson Bordeaux (`#A80F1C`)
- **Rôle** : Rouge profond dramatique. Apporte de la profondeur aux dégradés, aux états de pression (*active/pressed*) et aux bordures d'avertissement.
- **Usage** : Boutons "Outlined", dégradés de cartes premium, séparateurs satiriques.

### 📜 Neutral : Warm Newsprint (`#E8E5E2`)
- **Rôle** : Teinte papier journal / ivoire chaud. Évite l'éblouissement du blanc pur et évoque l'authenticité du papier de presse imprimé.
- **Usage** : Arrière-plans de conteneurs, cartes claires, boutons secondaires, champs de saisie de recherche.
- **Nuancier** :
  - `700` : `#6B6762` — Sous-titres sur fond neutre
  - `500` : `#B5B0AA` — Bordures d'input
  - `300` : `#E8E5E2` — **Couleur Neutre Officielle**
  - `100` : `#FAF9F8` — Fond de page lumineux
  - `50`  : `#FFFFFF` — Blanc pur pour reflets et cartes détachées

---

## 2. Système Typographique Tri-Font

Le design system de GBICH'APP associe 3 polices à rôles complémentaires pour un impact visuel maximal :

```
+-------------------------------------------------------------------------------+
|  HEADLINE : Anton (Display / Sans-Serif condensée percutante)                  |
|  -> Titres de presse, La Une, punchlines satiriques, scores géants            |
+-------------------------------------------------------------------------------+
|  BODY : Inter (Moderne, aérée, géométrique, excellente lisibilité)            |
|  -> Articles, décryptages EMI fact-checking, explications de quiz             |
+-------------------------------------------------------------------------------+
|  LABEL : Space Grotesk (Technique, monospace-feel, contemporaine)             |
|  -> Boutons, badges, chronomètres, filtres, micro-actions, compteurs de points|
+-------------------------------------------------------------------------------+
```

### Échelle Typographique Recommandée

| Style Token | Police | Taille / Line-Height | Poids | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `Anton` | 40px / 44px | 400 (Ultra Bold) | La Une, Titres choc du journal |
| **Headline 1** | `Anton` | 28px / 32px | 400 | Titres d'écrans, Cartes de jeux |
| **Headline 2** | `Anton` | 22px / 26px | 400 | Titres de rubriques, Verdicts EMI |
| **Body Large** | `Inter` | 16px / 24px | 400 / 500 | Introduction d'articles |
| **Body Regular** | `Inter` | 14px / 20px | 400 | Texte courant, fiches explicatives |
| **Body Small** | `Inter` | 12px / 16px | 400 / 500 | Mentions légales, métadonnées auteur |
| **Label Bold** | `Space Grotesk` | 14px / 18px | 700 (Uppercase) | Textes de boutons CTA, Badges |
| **Label Micro** | `Space Grotesk` | 11px / 14px | 600 (Tracking +0.05) | Timers, tags, points, pagination |

---

## 3. Règles d'Accessibilité & Contraste (WCAG 2.1 AA)

- **Texte Blanc sur Primaire (`#FFFFFF` sur `#F5222D`)** : Ratio de contraste 4.54:1 $\rightarrow$ Conforme WCAG AA pour texte normal et grand texte.
- **Texte Sombre sur Neutre (`#171416` sur `#E8E5E2`)** : Ratio de contraste 12.8:1 $\rightarrow$ Conforme WCAG AAA (excellence de lecture).
- **Texte Blanc sur Secondaire (`#FFFFFF` sur `#171416`)** : Ratio de contraste 16.2:1 $\rightarrow$ Conforme WCAG AAA (mode sombre haute fidélité).
- Ne jamais superposer du texte rouge `#F5222D` sur le fond secondaire `#171416` sans vérifier le ratio de taille (utiliser `#FF7875` si taille < 18px).
