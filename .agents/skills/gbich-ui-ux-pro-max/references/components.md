# GBICH'APP — Spécifications des Composants d'Interface (Design System)

Cette référence détaille l'implémentation des composants canoniques visualisés dans la charte graphique de **GBICH'APP**.

---

## 1. Boutons (Button Variants)

Tous les boutons utilisent la typographie **Space Grotesk** en graisse semi-bold/bold avec un rayon d'arrondi standardisé (`border-radius: 12px` ou `16px`).

```
+-------------------------------------------------------------------------------+
|  [ Primary ]      Fond #F5222D | Texte Blanc | Ombre portée douce              |
|  [ Secondary ]    Fond #E8E5E2 | Texte #171416                                |
|  [ Inverted ]     Fond #171416 | Texte Blanc                                  |
|  [ Outlined ]     Fond Transparent | Bordure 1.5px #A80F1C | Texte #A80F1C    |
+-------------------------------------------------------------------------------+
```

### Spécifications CSS / React Native Web :

```tsx
// 1. Primary Button
const primaryBtnStyle = {
  backgroundColor: '#F5222D',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 24,
  shadowColor: '#F5222D',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 4,
};

// 2. Secondary Button
const secondaryBtnStyle = {
  backgroundColor: '#E8E5E2',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 24,
};

// 3. Inverted Button
const invertedBtnStyle = {
  backgroundColor: '#171416',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 24,
};

// 4. Outlined Button
const outlinedBtnStyle = {
  backgroundColor: 'transparent',
  borderWidth: 1.5,
  borderColor: '#A80F1C',
  borderRadius: 12,
  paddingVertical: 11,
  paddingHorizontal: 23,
};
```

---

## 2. Barre de Navigation Flottante en Pilule (Floating Pill Nav)

Composant de navigation signature visible dans la charte :
- **Forme** : Pilule arrondie (`border-radius: 9999px`).
- **Fond** : `#E8E5E2` (fond clair) ou `#171416` (fond sombre) avec léger flou d'arrière-plan (*backdrop-filter: blur(12px)*).
- **Indicateur d'onglet actif** : Cercle plein rouge `#F5222D` avec icône blanche contrastée.
- **Onglets inactifs** : Icônes vectorielles trait fin `#756F72`.

```
  ( [ 🏠 ]     🔍      👤 )
     ^^^^
   Cercle plein
     #F5222D
```

---

## 3. Champ de Recherche (Search Input)

- **Conteneur** : Hauteur 48px, fond `#FFFFFF` ou `#FAF9F8`, bordure fine `#D4D0CC` (ou bordure accentuée `#A80F1C` en focus).
- **Icône** : Loupe fine couleur `#8F8B85` à gauche (padding gauche 16px).
- **Typographie** : `Inter` 14px, couleur texte `#171416`, placeholder `#8F8B85`.
- **Rayon** : `border-radius: 12px`.

---

## 4. Boutons d'Action Circulaires (Action Icon Buttons)

Alignement de 4 boutons d'action circulaires d'appoint visualisés dans la charte :
1. **Magic Wand** (Baguette magique) : Actions d'optimisation / filtre comique.
2. **Layers** (Superposition de calques) : Comparateur 7 Erreurs / Affichage biface EMI.
3. **Tag** (Étiquette de rubrique) : Filtrage rapide par thématique satire/dessin.
4. **Trash** (Corbeille d'action) : Réinitialisation de partie ou suppression.
- **Style** : Diamètre 40px, fond `#F5222D` ou `#A80F1C`, icônes vectorielles blanches centrées, micro-animation de rebond au clic.

---

## 5. Badges & Puces d'Édition (Chips & Badges)

- **Badge Rectangulaire avec Icône Crayon** :
  - Fond plein `#F5222D`, texte blanc en `Space Grotesk` 13px bold, icône crayon blanc.
- **Carré d'action isolée** :
  - Carré de 36x36px avec coins arrondis (`border-radius: 8px`), fond `#F5222D`, icône crayon blanc au centre.

---

## 6. Lignes Séparatrices Satiriques (Tri-Color Accent Bars)

Triple ligne horizontale d'accentuation pour souligner les titres d'articles ou séparer les sections de La Une :
1. Barre supérieure : Épaisse (4px), couleur `#F5222D` (Primary), largeur 60%.
2. Barre intermédiaire : Moyenne (3px), couleur `#171416` (Secondary), largeur 75%.
3. Barre inférieure : Épaisse (4px), couleur `#A80F1C` (Tertiary), largeur 45%.
Effet d'empreinte visuelle immédiat propre à l'énergie de la presse satirique.
