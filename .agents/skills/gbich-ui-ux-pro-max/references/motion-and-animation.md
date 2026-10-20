# GBICH'APP — Référentiel d'Animation, 3D et Motion Design

> **Inspirations** : GSAP (GreenSock), Framer Motion / Motion, MotionSites, Award-winning Web interactions.

Le ton satirique, vif et percutant de **GBICH'APP** impose une gestuelle d'animation dynamique, réactive et tactile. Pas d'animations lentes ou superflues : chaque transition doit procurer une sensation de vivacité, d'impact journalistique et de gratification ludique.

---

## 1. Principes Fondamentaux de Motion Design (MotionSites Guidelines)

1. **Snappy & Punchy** : Temps de réponse sous 100ms. Utilisation systématique de courbes d'amortissement exponentielles ou de ressorts amortis (*spring physics*).
2. **Courbe Maîtresse GBICH! (Snappy Curve)** :
   ```css
   /* La courbe d'impact "coup de poing satirique" */
   transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
   ```
3. **Hiérarchie Spatiale & Profondeur (3D)** :
   - Perspective de base : `perspective: 1000px;`
   - Déplacement en Z subtil sur les cartes au survol (`translateZ(12px)` + ombre portée dynamique).
4. **Synchronisation Tactile / Haptique** :
   - Retour haptique couplé aux animations de succès ou d'erreur :
   ```javascript
   if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
     navigator.vibrate([15, 30, 45]); // Vibration courte rythmée
   }
   ```

---

## 2. Intégration Framer Motion / Motion

### A. Composant Biface 3D "Vrai ou Faux ?" (Flip Card EMI)

Le composant EMI de fact-checking s'articule autour d'une rotation 3D sur l'axe Y à 180° :

```tsx
import { motion } from 'framer-motion';
import { useState } from 'react';

export const EmiFlipCard = ({ claim, verdict, explanation }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div style={{ perspective: 1200 }} className="w-full max-w-md cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-80 rounded-2xl"
      >
        {/* Face A : La Rumeur / L'Infox */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 bg-[#171416] border border-[#262325] rounded-2xl p-6 flex flex-col justify-between"
        >
          <span className="font-['Space_Grotesk'] text-[#F5222D] text-xs font-bold tracking-widest uppercase">
            ⚡ Rumeur Virale à Vérifier
          </span>
          <p className="font-['Anton'] text-white text-2xl tracking-wide uppercase">
            "{claim}"
          </p>
          <div className="font-['Space_Grotesk'] text-[#E8E5E2] text-sm flex items-center gap-2">
            <span>👆 Touchez pour découvrir le verdict</span>
          </div>
        </div>

        {/* Face B : Le Verdict Journalistique */}
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 bg-[#E8E5E2] border-2 border-[#F5222D] rounded-2xl p-6 flex flex-col justify-between text-[#171416]"
        >
          <div className="flex items-center justify-between">
            <span className="font-['Anton'] text-3xl text-[#F5222D] uppercase tracking-wider">
              {verdict}
            </span>
            <span className="bg-[#F5222D] text-white text-xs font-['Space_Grotesk'] px-3 py-1 rounded-full font-bold">
              EMI FACT-CHECK
            </span>
          </div>
          <p className="font-['Inter'] text-sm leading-relaxed text-[#262422]">
            {explanation}
          </p>
          <span className="font-['Space_Grotesk'] text-xs text-[#756F72] underline">
            Sources & Méthode de vérification
          </span>
        </div>
      </motion.div>
    </div>
  );
};
```

### B. Navigation Flottante avec Indicateur Coulissant (`layoutId`)

L'indicateur circulaire rouge `#F5222D` glisse avec un effet de ressort naturel entre les onglets :

```tsx
import { motion } from 'framer-motion';

export const PillTab = ({ isActive, icon, label, onClick }) => {
  return (
    <button onClick={onClick} className="relative px-5 py-3 flex items-center justify-center">
      {isActive && (
        <motion.div
          layoutId="activeTabPill"
          className="absolute inset-0 bg-[#F5222D] rounded-full shadow-lg shadow-red-500/30"
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
        />
      )}
      <span className={`relative z-10 text-lg ${isActive ? 'text-white' : 'text-[#756F72]'}`}>
        {icon}
      </span>
    </button>
  );
};
```

### C. Effet 3D Tilt Parallaxe sur les Cartes de Dessin de Presse

Effet gyroscope / souris réactif pour sublimer les caricatures :

```tsx
import { motion, useMotionValue, useTransform } from 'framer-motion';

export const Caricature3DCard = ({ imageSrc, title, artist }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full bg-[#171416] border border-[#262325] rounded-2xl p-4 shadow-xl"
      >
        <img src={imageSrc} alt={title} className="w-full rounded-xl object-cover transform translate-z-4" />
        <h3 className="font-['Anton'] text-white text-xl mt-3 uppercase tracking-wide">
          {title}
        </h3>
        <span className="font-['Space_Grotesk'] text-xs text-[#F5222D] font-bold">
          Par {artist}
        </span>
      </motion.div>
    </motion.div>
  );
};
```

---

## 3. Intégration GSAP (GreenSock)

Pour les animations complexes, la typographie cinétique des gros titres et les mécaniques du Jeu des 7 Erreurs.

### A. Titre Choc Cinétique "La Une GBICH!" (Slam & Shake Effect)

```javascript
import gsap from 'gsap';

export function animateNewspaperSlam(targetElement) {
  const tl = gsap.timeline();

  tl.fromTo(
    targetElement,
    {
      scale: 3.5,
      opacity: 0,
      rotation: -12,
      filter: 'blur(10px)',
    },
    {
      scale: 1,
      opacity: 1,
      rotation: 0,
      filter: 'blur(0px)',
      duration: 0.45,
      ease: 'power4.out',
    }
  ).to(targetElement, {
    x: '+=6',
    yoyo: true,
    repeat: 3,
    duration: 0.04,
    ease: 'power1.inOut',
  });

  return tl;
}
```

### B. Validation d'un Point au Jeu des 7 Erreurs (Radar Shockwave)

Lorsqu'un clic valide une erreur aux coordonnées $(x, y)$ :

```javascript
export function animateErrorFound(canvasCtx, normX, normY, canvasWidth, canvasHeight) {
  const targetX = normX * canvasWidth;
  const targetY = normY * canvasHeight;

  const shockwave = { radius: 5, alpha: 1, strokeWidth: 4 };

  gsap.to(shockwave, {
    radius: 36,
    alpha: 0,
    strokeWidth: 1,
    duration: 0.6,
    ease: 'power2.out',
    onUpdate: () => {
      canvasCtx.beginPath();
      canvasCtx.arc(targetX, targetY, shockwave.radius, 0, Math.PI * 2);
      canvasCtx.strokeStyle = `rgba(245, 34, 45, ${shockwave.alpha})`;
      canvasCtx.lineWidth = shockwave.strokeWidth;
      canvasCtx.stroke();
    },
  });
}
```

---

## 4. Presets d'Animation de Micro-Interactions

| Interaction | Action UI | Bibliothèque recommandée | Paramètres |
| :--- | :--- | :--- | :--- |
| **Bouton Press** | Scale down au touch | Framer Motion / Reanimated | `whileTap={{ scale: 0.95 }}` |
| **Bouton Hover** | Glow rouge & élévation | CSS / Motion | `boxShadow: '0 0 20px rgba(245, 34, 45, 0.4)'` |
| **Affichage de Liste** | Entrée en cascade (*stagger*) | Framer Motion | `staggerChildren: 0.05, duration: 0.3` |
| **Changement de Vue** | Entrée latérale fluide | Motion AnimatePresence | `x: [-20, 0], opacity: [0, 1]` |
| **Badge Nouveau** | Pulsation discrète | CSS Keyframes | `scale: [1, 1.08, 1], ease: 'easeInOut'` |
| **Score / Timer** | Compteur numérique animé | GSAP Flip / Counter | `roundProps: "text", duration: 1.2` |
