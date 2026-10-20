# GBICH’APP — Socle Technique & Architecture PWA

> **Journal satirique et ludo-éducatif ivoirien**  
> Plateforme multiplateforme optimisée en **Progressive Web App (PWA)**, responsive (smartphones, tablettes, ordinateurs), adossée à une API asynchrone haute performance en **Python / FastAPI**, **PostgreSQL 16**, **Redis 7.2** et stockage objet compatible S3 (**MinIO**).

---

## 1. Vue d'Ensemble & Décisions d'Architecture

Le projet **GBICH’APP** repose sur une séparation stricte entre :
- **Front-end Client** : Progressive Web App (PWA) développée avec **React Native Web** et **Expo** (TypeScript), installable sur mobile et bureau.
- **Passerelle d'accès & Sécurité** : Reverse Proxy **Nginx** assurant la terminaison SSL, la compression Gzip, les politiques de cache PWA et le Rate Limiting (SlowAPI / Nginx).
- **Cœur Applicatif Backend** : Serveur asynchrone **FastAPI** (ASGI / Uvicorn), validation de données stricte **Pydantic v2**, accès base via **SQLAlchemy 2.0 (asyncpg)**.
- **Magasins de Persistance & Cache** :
  - **PostgreSQL 16** : ACID, articles, fiches EMI, sessions de jeux, métadonnées médias.
  - **Redis 7.2** : Sessions, limitation de débit OTP, et *Sorted Sets* pour les classements de jeux en temps réel.
  - **MinIO (S3)** : Stockage des illustrations WebP optimisées (Pillow) et vidéos courtes format vertical 9:16.

### Arbitrages Techniques et Compatibilité PWA / Web

Pour respecter l'obligation formelle de délivrer une véritable **Progressive Web App (PWA)** exécutable dans un navigateur compatible tout en respectant l'architecture de référence `01 - Architecture tecnique.md` :

1. **Persistance Client (MMKV vs Web)** :
   - *Contrainte* : `react-native-mmkv` s'appuie sur des liaisons C++ natives (JSI) inopérantes dans un navigateur web standard.
   - *Solution retenue* : Implémentation d'un adaptateur universel [`src/utils/storage.ts`](mobile/src/utils/storage.ts) détectant `Platform.OS === 'web'`. Sur le web, il utilise de manière transparente `localStorage` (avec repli mémoire résilient), tout en conservant une interface synchrone identique prête à brancher MMKV sur mobile natif.
2. **Stockage Sécurisé des Tokens (SecureStore vs Web)** :
   - *Contrainte* : `expo-secure-store` cible le Keychain iOS et EncryptedSharedPreferences Android.
   - *Solution retenue* : Module d'abstraction [`src/utils/secureStore.ts`](mobile/src/utils/secureStore.ts) permettant le stockage isolé des jetons avec rotation automatique.
3. **PWA & Capacités Hors Connexion (Offline-First)** :
   - Mise en place du manifeste PWA [`mobile/public/manifest.json`](mobile/public/manifest.json) (thème sombre `#121212`, couleur d'accentuation `#FFCC00`, mode `standalone`).
   - Service Worker dédié [`mobile/public/sw.js`](mobile/public/sw.js) avec stratégie de cache :
     - *Ressources statiques* : Cache-first avec mise à jour en arrière-plan (*stale-while-revalidate*).
     - *Requêtes API (`/api/`)* : Network-first avec repli automatique sur le cache en cas de coupure réseau.
     - *Service Worker non mis en cache* : Directive Nginx `no-cache, no-store` pour garantir les mises à jour transparentes.
4. **Mise en Page Responsive & Hybride** :
   - Composant [`ResponsiveContainer`](mobile/src/components/common/ResponsiveContainer.tsx) adaptant l'interface : pleine largeur sur smartphone, centrage élégant (max-width 540px) sur tablette et desktop avec ombrage moderne.

---

## 2. Structure du Dépôt

```text
gbich_app/
├── 01 - Architecture tecnique.md # Document de référence technique
├── README.md                     # Documentation technique principale
├── docker-compose.yml            # Orchestration des services locaux
├── .env.example                  # Modèle des variables d'environnement globales
├── .gitignore                    # Fichiers et dossiers ignorés
├── nginx/                        # Configuration du reverse proxy
│   └── nginx.conf
├── backend/                      # Cœur applicatif FastAPI (Python 3.11+)
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   └── health.py # Endpoint de santé (Postgres, Redis, MinIO)
│   │   │       └── router.py     # Routeur racine de l'API v1
│   │   ├── core/
│   │   │   ├── config.py         # Configuration centralisée Pydantic Settings v2
│   │   │   ├── database.py       # Session asynchrone SQLAlchemy 2.0 (asyncpg)
│   │   │   ├── redis.py          # Client asynchrone Redis 7.2
│   │   │   ├── storage.py        # Client stockage objets MinIO
│   │   │   └── logging.py        # Logs structurés
│   │   ├── models/               # Modèles de base de données SQLAlchemy
│   │   │   ├── base.py
│   │   │   └── entities.py       # Users, Categories, Contents, FactChecks, Games
│   │   ├── schemas/              # Schémas de validation Pydantic v2
│   │   │   └── health.py
│   │   ├── services/             # Couche métier et arbitrage (placeholders)
│   │   └── main.py               # Point d'entrée FastAPI, CORS, SlowAPI & Lifespan
│   ├── alembic/                  # Migrations de base de données
│   │   ├── env.py                # Configuration async Alembic
│   │   ├── script.py.mako
│   │   └── versions/             # Fichiers de révision des migrations
│   ├── alembic.ini               # Configuration Alembic
│   ├── tests/                    # Tests unitaires et d'intégration
│   │   └── test_health.py
│   ├── requirements.txt          # Dépendances Python
│   ├── Dockerfile                # Image conteneur backend
│   └── .env.example
└── mobile/                       # Client Front-End PWA (Expo / React Native Web)
    ├── assets/                   # Icônes et images statiques
    ├── public/                   # Fichiers publics PWA
    │   ├── manifest.json         # Web App Manifest PWA
    │   └── sw.js                 # Service Worker (Cache & Offline)
    ├── src/
    │   ├── api/                  # Client Axios avec intercepteurs JWT & QueryClient
    │   ├── components/           # Arborescence modulaire des composants UI
    │   │   ├── common/           # ResponsiveContainer, boutons génériques
    │   │   ├── feed/             # Dessins de presse & zoom tactile
    │   │   ├── video/            # Lecteur vertical 9:16
    │   │   ├── emi/              # Composant Flip-Card "Vrai ou Faux"
    │   │   └── games/            # Composants Quiz, 7 Erreurs, Mots Croisés
    │   ├── hooks/                # Hooks personnalisés
    │   ├── navigation/           # Navigation Tab & Stack React Navigation
    │   ├── screens/              # Écrans de base du socle technique
    │   ├── store/                # Stores d'état Zustand (Auth, Paramètres)
    │   └── utils/                # Adaptateurs de stockage universels & Service Worker
    ├── app.json                  # Métadonnées et configuration Expo Web/PWA
    ├── package.json              # Dépendances npm du client
    ├── tsconfig.json             # Configuration TypeScript
    └── Dockerfile                # Image conteneur de build/déploiement web
```

---

## 3. Prérequis Système

- **Node.js** : v20.x ou v22.x LTS
- **npm** : v10.x ou supérieur
- **Python** : 3.11 ou 3.12 (ou 3.14)
- **Docker & Docker Compose** : Docker Desktop v24+ avec Docker Compose v2+
- Navigateur moderne compatible PWA : Chrome, Edge, Safari, Firefox

---

## 4. Configuration de l'Environnement

Dupliquez les fichiers d'exemple pour initialiser vos variables locales :

```bash
# Variables globales / Docker
cp .env.example .env

# Variables backend
cp backend/.env.example backend/.env
```

Les valeurs pré-configurées conviennent directement pour un environnement de développement local.

---

## 5. Commandes d'Installation et de Démarrage

### Option A — Démarrage Complet via Docker Compose (Recommandé)

Lance l'ensemble des services : PostgreSQL, Redis, MinIO, Backend FastAPI et Nginx :

```bash
docker compose up -d --build
```

Arrêt des services :
```bash
docker compose down
```

### Option B — Démarrage Local Sans Docker (Développement Rapide)

#### 1. Démarrer le Backend FastAPI

```bash
# 1. Se positionner dans le dossier backend
cd backend

# 2. Créer l'environnement virtuel Python
python -m venv .venv

# 3. Activer l'environnement virtuel
# Sur Windows PowerShell :
.venv\Scripts\Activate.ps1
# Sur macOS/Linux :
source .venv/bin/activate

# 4. Installer les dépendances
pip install -r requirements.txt

# 5. Lancer le serveur de développement Uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Démarrer le Front-End PWA (Expo Web)

Dans un second terminal :

```bash
# 1. Se positionner dans le dossier mobile
cd mobile

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur web de développement
npm run web
```

L'application s'ouvre automatiquement dans votre navigateur par défaut à l'adresse `http://localhost:8081`.

---

## 6. Base de Données & Migrations Alembic

Pour appliquer les migrations ou générer une nouvelle révision :

```bash
cd backend

# Appliquer les migrations existantes
alembic upgrade head

# Générer une nouvelle migration basée sur les modèles SQLAlchemy
alembic revision --autogenerate -m "Initial schema setup"

# Revenir en arrière d'une révision
alembic downgrade -1
```

---

## 7. Tests & Validation

### Tests Backend (Pytest)

```bash
cd backend
pytest -v
```

### Vérification TypeScript & Compilation PWA Front-End

```bash
cd mobile

# Vérification des types TypeScript
npx tsc --noEmit

# Compilation du bundle PWA de production
npx expo export -p web
```

---

## 8. URLs et Endpoints Utiles

| Service | URL Locale | Description |
| :--- | :--- | :--- |
| **PWA Web Client** | `http://localhost:8081` ou `http://localhost:80` | Interface progressive installable |
| **API Backend Root** | `http://localhost:8000/` | Informations de version et statut |
| **API Health Check** | `http://localhost:8000/api/v1/health` | Contrôle de santé (Postgres, Redis, MinIO) |
| **Documentation Swagger** | `http://localhost:8000/docs` | Documentation interactive OpenAPI v3 |
| **Documentation ReDoc** | `http://localhost:8000/redoc` | Documentation technique alternative |
| **Console MinIO S3** | `http://localhost:9001` | Administration du stockage objet |

---

## 9. Procédure de Vérification PWA (Navigateur)

1. Ouvrez `http://localhost:8081` (ou `http://localhost:80` via Nginx) dans Google Chrome ou Microsoft Edge.
2. Ouvrez les **Outils de développement** (`F12`), onglet **Application** :
   - **Manifest** : Vérifiez que l'application détecte le nom `GBICH'APP`, les icônes, la couleur `#FFCC00` et le mode `standalone`.
   - **Service Workers** : Vérifiez que `sw.js` est marqué comme activé et en cours d'exécution.
   - **Bouton d'installation** : Cliquez sur l'icône d'installation dans la barre d'adresse du navigateur ("Installer GBICH'APP") pour tester l'installation PWA sur le bureau ou sur l'écran d'accueil.
3. Test Hors Connexion :
   - Dans l'onglet **Réseau (Network)**, activez la case **Offline**.
   - Rafraîchissez la page : le shell applicatif et les ressources statiques continuent de fonctionner grâce au Service Worker.
