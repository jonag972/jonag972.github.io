# Portfolio de Jonathan Gromat

## Structure des projets

Chaque projet est défini par un fichier JSON avec les champs suivants :

```json
{
  "title": "Titre du projet (FR)",
  "titleEn": "Project title (EN)",
  "shortDescription": "Description courte (FR)",
  "shortDescriptionEn": "Short description (EN)",
  "period": {
    "start": "Mois Année (FR)",
    "end": "Mois Année (FR)",
    "startEn": "Month Year (EN)",
    "endEn": "Month Year (EN)"
  },
  "duration": {
    "value": 3,
    "unit": "mois",
    "unitEn": "months"
  },
  "location": {
    "fr": "Lieu (FR)",
    "en": "Location (EN)"
  },
  "images": [
    {
      "src": "chemin/vers/image.jpg",
      "alt": "Description de l'image"
    }
  ],
  "demoUrl": "URL de démo (optionnel)",
  "githubUrl": "URL GitHub (optionnel)",
  "tags": ["Techno1", "Techno2"]
}
```

## Fonctionnalités

- Affichage responsive
- Lightbox pour les images
- Multilingue (FR/EN) avec basculement facile
- Mode clair/sombre automatique et manuel
- Section détaillée pour chaque projet avec :
  - Période de réalisation
  - Durée
  - Lieu
  - Technologies utilisées
  - Description détaillée via fichier Markdown
- Chargement dynamique des projets depuis un fichier JSON
- Formulaire de contact (si applicable, sinon à retirer)
- Bannière de consentement RGPD
- Menu d'administration caché (accessible par triple clic sur le logo "JG")

## Statistiques et Administration

- **Collecte de statistiques :** Le fichier `includes/stats-collector.php` enregistre les visites (date, heure, page visitée, user agent, langue) dans `data/stats.json`.
- **Gestion du consentement :** Le fichier `includes/consent-manager.php` gère l'affichage de la bannière RGPD et le stockage du consentement dans les cookies.
- **Page d'administration :** Le fichier `admin/stats.php` affiche les statistiques collectées. L'accès se fait via le menu caché (triple clic sur le logo "JG").

## Dépendances

- [Font Awesome](https://fontawesome.com/) pour les icônes
- [Poppins](https://fonts.google.com/specimen/Poppins) pour la typographie
- [Swiper](https://swiperjs.com/) pour les carrousels
- [Marked.js](https://marked.js.org/) pour le rendu Markdown