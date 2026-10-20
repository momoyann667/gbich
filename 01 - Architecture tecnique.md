# ANALYSE D'ARCHITECTURE TECHNIQUE & FONCTIONNELLE COMPLÈTE — GBICH'APP

Cette analyse détaille l'ingénierie système, les patterns d'intégration, la logique métier et les mécanismes de résilience requis pour concrétiser **GBICH'APP**. Elle prend pour base la stack imposée : **React Native (TypeScript)** pour le client mobile multiplateforme et **Python / FastAPI** pour le cœur applicatif asynchrone, articulé avec **PostgreSQL 16**, **Redis 7** et un stockage objet compatible S3 (**MinIO / S3**).

---

## 1. MODÉLISATION DE LA TOPOLOGIE SYSTÈME (DIAGRAMME GLOBAL)

L'architecture sépare rigoureusement la couche d'interface client, la passerelle d'accès, le moteur d'exécution d'API et les magasins de persistance/cache.

```
+---------------------------------------------------------------------------------------------+
|                                APPLICATION MOBILE REACT NATIVE                              |
|                                                                                             |
|   [ Interface UI (FlashList, Pinch-to-Zoom, Lecteur 9:16, Canvas 7 Erreurs, Grille 10x10) ]   |
|                                             │                                               |
|               ┌─────────────────────────────┴─────────────────────────────┐                 |
|               ▼                                                           ▼                 |
|   [ Cache Mémoire & Requêtes ]                              [ Persistance Locale Offline ]  |
|   - TanStack Query v5                                       - MMKV (Jetons, Préférences)    |
|   - Axios Interceptors (JWT & Retry)                        - SQLite / Cache d'état         |
+----------------------------------------------┬----------------------------------------------+
                                               │ HTTPS / TLS 1.3 (REST JSON + WebSockets)
                                               ▼
+---------------------------------------------------------------------------------------------+
|                               PASSERELLE INVERSE / REVERSE PROXY                            |
|                                                                                             |
|   [ Nginx Gateway ]                                                                         |
|   - Terminaison SSL & Négociation HTTP/2                                                    |
|   - Compression Gzip / Brotli des payloads JSON                                             |
|   - Rate Limiting granulaire par IP (Protection endpoints sensibles : OTP, soumissions jeux)|
+----------------------------------------------┬----------------------------------------------+
                                               │ Socket UNIX / Proxy TCP
                                               ▼
+---------------------------------------------------------------------------------------------+
|                         SERVEUR D'APPLICATION FASTAPI (ASGI / UVICORN)                      |
|                                                                                             |
|   [ Couche Présentation (API Routers v1) ]                                                  |
|   - Auth & Session | Contenus Éditoriaux | Fact-Checking EMI | Moteurs de Jeux | Classement  |
|                                             │                                               |
|   [ Couche Métier (Domain Services) ]       │ Ingestion Média (Pillow / WebP)               |
|   - Validation stricte Pydantic v2          │ Validation géométrique des clics (7 Erreurs)  |
|   - Arbitrage asynchrone des quiz           │ Calcul et projection des Leaderboards Redis   |
|                                             │                                               |
|   [ Couche Accès Données (Persistence Abstraction) ]                                        |
|   - SQLAlchemy 2.0 Async Session (Pool de connexions asyncpg)                               |
+----------------------┬──────────────────────┬──────────────────────┬------------------------+
                       │                      │                      │
                       ▼                      ▼                      ▼
        [ SGBD RELATIONNEL ]          [ EN-MÉMOIRE / CACHE ]  [ STOCKAGE OBJETS S3 ]
        PostgreSQL 16                 Redis 7.2              MinIO / AWS S3
        - ACID transactions           - Sessions & OTP       - Illustrations WebP
        - Données éditoriales         - Sorted Sets (Scores) - Vidéos 1 min (HLS/MP4)
        - Comptes & Métadonnées EMI   - Cache des Feeds JSON - Masques 7 erreurs

```

---

## 2. DÉCOMPOSITION TECHNIQUE DES DOMAINES FONCTIONNELS

### 2.1 Moteur Éditorial Hybride (70 % Visuel / 30 % Satire & Pédagogie)



Le défi réside dans l'affichage massif d'illustrations haute définition sur des réseaux mobiles à connectivité variable sans générer de surconsommation de forfait ni de ralentissement d'interface :

* **Pipeline d'Ingestion et Optimisation Média (Serveur FastAPI)** :
1. Réception de l'image haute définition via le CMS.
2. Traitement asynchrone par `Pillow` : redimensionnement normalisé (largeur max : 1440 px), conversion en format **WebP (qualité 80)** et calcul automatique du ratio d'aspect (`ratio = width / height`).
3. Génération d'une miniature (*thumbnail*) basse résolution (largeur : 320 px, WebP qualité 40) pour le préchargement visuel flou (*blur-up placeholder*).
4. Sauvegarde sur le bucket S3/MinIO et persistance des URLs et métadonnées dimensionnelles dans PostgreSQL.


* **Moteur d'Affichage Côté Mobile (React Native)** :
* Utilisation de `@shopify/flash-list` au lieu d'une `FlatList` standard afin d'assurer un recyclage performant des vues à 60 images par seconde.
* Exploitation immédiate des champs `width` et `height` renvoyés par l'API pour instancier la carte sans saut d'écran (*Cumulative Layout Shift = 0*).
* Visionneuse dédiée `ZoomableDrawingViewer` s'appuyant sur `react-native-gesture-handler` et `react-native-reanimated` : activation du zoom à deux doigts (*Pinch-to-zoom*) et du panoramique tactile fluide sans rechargement réseau.





### 2.2 Module d'Éducation aux Médias et à l'Information (EMI)



Intégré organiquement au flux d'actualité pour développer l'esprit critique sans alourdir la lecture :

* **Composant Interactif "Vrai ou Faux ?"** : Carte mobile biface avec micro-animation fluide au tap.


* *Face A* : L'infox, la rumeur ou le média suspect contextualisé.


* *Face B* : Le verdict officiel (*Vrai, Faux, Trompeur, Hors contexte*), le décryptage journalistique sourcé et le tutoriel rapide d'éducation aux médias (*Comment vérifier ?*).




* **Lecteur Vidéo "1 Minute pour Comprendre"** : Composant vidéo vertical (format 9:16 ou 4:5) basé sur `expo-av`, avec écouteur de visibilité (*Intersection Observer* mobile) : la vidéo démarre automatiquement en sourdine uniquement lorsqu'elle occupe plus de 60 % de l'écran et s'interrompt dès qu'elle sort du champ pour préserver la mémoire vive et la batterie.



### 2.3 Moteurs Ludiques et Gamification (Rétention Quotidienne)



Les trois jeux s'exécutent selon une logique d'intégrité stricte empêchant la fraude et assurant un engagement instantané :

```
                        FLUX D'ARBITRAGE DES JEUX GBICH!

    [ ÉCRAN DU JEU (MOBILE) ]                 [ API FASTAPI ]                 [ REDIS ]
                │                                    │                            │
  GET /games/{type}/today                            │                            │
  ──────────────────────────────────────────────────►│                            │
                │     Envoi données épurées          │                            │
                │     (SANS les réponses/solutions)  │                            │
                │◄───────────────────────────────────│                            │
                │                                    │                            │
  [ Joueur résout l'épreuve ]                        │                            │
                │                                    │                            │
  POST /games/{type}/submit                          │                            │
  (Options choisies OU Coordonnées x,y tactiles)     │                            │
  ──────────────────────────────────────────────────►│                            │
                │                                    │                            │
                │                        Contrôle de conformité                   │
                │                        et calcul du score                       │
                │                                    │── ZADD (Leaderboard) ─────►│
                │                                    │                            │
                │     Retourne :                     │                            │
                │     - Score validé                 │                            │
                │     - Réponses & Explications EMI  │                            │
                │     - Feedback haptique / visuel   │                            │
                │◄───────────────────────────────────│                            │

```

1. **Le Quiz du Jour** :
* L'API ne délivre aucun booléen `is_correct` au chargement.


* La soumission groupée valide les choix côté serveur, calcule les points en fonction du temps de réponse et retourne les fiches explicatives détaillées.




2. **Le Jeu des 7 Erreurs** :
* L'image modifiée est affichée sous l'image originale.


* Au clic de l'utilisateur, les coordonnées tactiles locales sont converties en coordonnées relatives normalisées $(x, y) \in [0, 1]$ :

$$x = \frac{\text{position\_x}}{\text{largeur\_canvas}}, \quad y = \frac{\text{position\_y}}{\text{hauteur\_canvas}}$$


* Le backend compare ce point avec les 7 cercles d'erreur stockés en base (`target_x`, `target_y`, `radius`). Si $\sqrt{(x - x_t)^2 + (y - y_t)^2} \le r$, l'erreur est validée. Un cercle rouge vectoriel s'anime instantanément sur l'application avec vibration haptique native.




3. **Mots Croisés Satiriques** :
* Matrice $10 \times 10$ gérée par un modèle d'état bidimensionnel. Un clavier customisé bloque les caractères spéciaux et force les majuscules. La validation de la grille s'effectue en une seule passe par hachage ou comparaison de matrice côté serveur.




4. **Classements en Temps Réel** :
* Les scores validés sont immédiatement indexés dans les structures de données *Sorted Sets* de Redis (`leaderboard:daily:<date>` et `leaderboard:weekly:<semaine>`).


* La récupération du tableau d'honneur s'opère en complexité logarithmique $O(\log(N) + M)$ sans solliciter le moteur de requêtes relationnel de PostgreSQL.



---

## 3. MODÈLE CONCEPTUEL & PHYSIQUE DE DONNÉES (POSTGRESQL)

```sql
-- Utilisateurs et Profils
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar_slug VARCHAR(50) DEFAULT 'avatar_default',
    preferred_lang VARCHAR(5) DEFAULT 'fr',
    role VARCHAR(20) DEFAULT 'reader', -- 'reader', 'contributor', 'editor', 'admin'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catégories Éditoriales
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_fr VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL
);

-- Contenus (Articles, Dessins, Vidéos)
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id INT REFERENCES categories(id) ON DELETE RESTRICT,
    content_type VARCHAR(30) NOT NULL, -- 'dessin_du_jour', 'dessin_express', 'satire', 'video_1min', 'vrai_faux'
    title_fr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NULL,
    body_text_fr TEXT NULL,
    body_text_en TEXT NULL,
    author_artist VARCHAR(100) NOT NULL,
    media_url VARCHAR(500) NULL,
    media_thumbnail_url VARCHAR(500) NULL,
    media_width INT NULL,
    media_height INT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Métadonnées Fact-Checking (EMI)
CREATE TABLE fact_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID UNIQUE REFERENCES contents(id) ON DELETE CASCADE,
    claim_evaluated TEXT NOT NULL,
    verdict VARCHAR(30) NOT NULL, -- 'vrai', 'faux', 'trompeur', 'hors_contexte'
    explanation_fr TEXT NOT NULL,
    explanation_en TEXT NULL,
    sources_json JSONB DEFAULT '[]'::jsonb
);

-- Sessions de Jeux Quotidiens
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_type VARCHAR(30) NOT NULL, -- 'quiz', 'spot_errors', 'crosswords'
    target_date DATE NOT NULL,
    title VARCHAR(150) NOT NULL,
    public_payload JSONB NOT NULL,    -- Données transmises au mobile
    secret_solutions JSONB NOT NULL,  -- Réponses / Coordonnées conservées sur l'API
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_game_per_day UNIQUE (game_type, target_date)
);

-- Historique des Parties & Scores
CREATE TABLE user_game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    score INT NOT NULL,
    duration_seconds INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_game_session UNIQUE (user_id, game_session_id)
);

CREATE INDEX idx_contents_feed ON contents (is_published, published_at DESC);
CREATE INDEX idx_game_sessions_date ON game_sessions (target_date, game_type);

```

---

## 4. ARCHITECTURE LOGICIELLE DU CLIENT MOBILE (REACT NATIVE)

### 4.1 Arborescence Modulaire et Principes de Conception

L'application adopte une séparation nette entre l'état, la logique métier et les vues :

```text
mobile/src/
├── api/                  # Clients Axios configurés avec intercepteurs de tokens JWT
├── components/
│   ├── common/           # Boutons GBICH!, indicateurs de statut, modales génériques
│   ├── feed/             # Cartes d'actualité, Carrousels, Visualiseur Pinch-to-zoom
│   ├── video/            # Lecteur 9:16 avec détection de visibilité
│   ├── emi/              # Composant interactif Flip-Card "Vrai ou Faux ?"
│   └── games/            # Composants Quiz, Double Canvas 7 Erreurs, Grille 10x10
├── hooks/                # useFeedQuery, useGameSession, usePinchGesture, useNetworkStatus
├── navigation/           # RootNavigator, MainTabNavigator, Stacks spécialisés
├── screens/              # FeedHomeScreen, DetailScreen, GamesHubScreen, ProfileScreen
├── store/                # Stores Zustand légers (AuthSession, AppSettings, SoundPreferences)
└── utils/                # Normalisation des coordonnées tactiles, export d'images

```

### 4.2 Stratégie Offline-First et Résilience Bande Passante

Pour répondre aux instabilités des réseaux de télécommunication locaux :

* **Double Couche de Stockage Client** :
* `react-native-mmkv` : Fournit un accès synchrone en C++ natif pour la lecture immédiate du jeton de session, des préférences de langue et des paramètres utilisateur.
* `TanStack Query (React Query)` couplé au plugin de persistance `createAsyncStoragePersister` sur MMKV : Le cache des requêtes JSON (`/api/v1/feed`, `/api/v1/games/today`) est stocké sur disque.


* **Fonctionnement Déconnecté** :
* À l'ouverture de l'application hors réseau, l'utilisateur accède instantanément aux 20 derniers dessins consultés et au quiz du jour déjà téléchargé.


* Les soumissions de parties terminées hors-ligne sont enregistrées dans une file d'attente locale et synchronisées en tâche de fond dès que le hook `useNetInfo` signale le rétablissement d'Internet.



---

## 5. MODÈLE DE SÉCURITÉ ET INTÉGRITÉ APPLICATIVE

1. **Protection contre l'Épuisement des Ressources SMS (OTP)** :
* L'endpoint d'authentification est protégé par `SlowAPI` adossé à Redis : un maximum de 3 requêtes d'envoi par tranche de 5 minutes est autorisé par adresse IP et numéro de téléphone.
* Mise à disposition d'un mode "Invité" sans mot de passe pour consulter librement les contenus publics sans déclencher d'OTP payant.




2. **Cycle de Vie des Jetons JWT** :
* `Access Token` : Durée de vie courte (30 minutes), stocké en mémoire vive dans le store Zustand.
* `Refresh Token` : Durée de vie longue (30 jours), stocké dans le trousseau sécurisé (*Keychain* iOS / *EncryptedSharedPreferences* Android via `expo-secure-store`).
* Rotation stricte du refresh token à chaque réémission pour révoquer automatiquement toute session suspecte.


3. **Protection contre la Triche** :
* La logique de complétion temporelle et de validation spatiale est exécutée côté serveur FastAPI. Aucun fichier source contenant les coordonnées brutes des 7 erreurs ou les bonnes réponses du quiz n'est exposé en clair au client React Native.





---

## 6. MATRICE D'EXÉCUTION TECHNIQUE & JALONS DE LIVRAISON (8 SEMAINES)

| Phase | Période | Livrables d'Architecture & Validation Technique |
| --- | --- | --- |
| **S1 — Socle Infra & BDD** | J1 – J7 | Fichiers `docker-compose.yml` (Postgres, Redis, MinIO), migrations `Alembic`, configuration initiale du dépôt React Native. |
| **S2 — Auth & Tuyauterie API** | J8 – J14 | Endpoints OTP, gestion des JWT / sessions invités, configuration des intercepteurs Axios et navigation de base.

 |
| **S3 — Moteur Éditorial 70/30**<br> | J15 – J21 | Ingestion d'images WebP via Pillow, endpoint `/feed` paginé, FlashList mobile et composant de zoom tactile haute définition.

 |
| **S4 — Média Avancé & Module EMI**<br> | J22 – J28 | Intégration du lecteur vidéo vertical, composant interactif "Vrai ou Faux ? (EMI)", back-office web express de publication.

 |
| **S5 — Moteurs de Jeux (1 & 2)**<br> | J29 – J35 | Moteur du Quiz du jour, moteur tactile du Jeu des 7 erreurs (validation des coordonnées), intégration du cache Redis.

 |
| **S6 — Mots Croisés & Leaderboard**<br> | J36 – J42 | Grille interactive 10x10 avec clavier custom, Leaderboards temps réel (Sorted Sets), module d'export d'image virale pour WhatsApp.

 |
| **S7 — Offline & Durcissement** | J43 – J49 | Mise en cache offline avec MMKV/TanStack Query, tests de charge sur FastAPI, optimisation du poids du bundle mobile (< 25 Mo). |
| **S8 — Recette Finale & Release**<br> | J50 – J60 | Injection des données d'essai réelles (dessins GBICH!, quiz), compilation des binaires Android (`.aab`) et iOS (`.ipa`), déploiement sur VPS de production.

 |

---