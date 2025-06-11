/**
 * Fichier JavaScript pour les pages de détail de projet
 * Gère le chargement du contenu Markdown et l'initialisation du carrousel
 */

// Configuration de Marked.js
marked.setOptions({
    breaks: true,           // Convertit les retours à la ligne en <br>
    gfm: true,              // GitHub Flavored Markdown
    headerIds: true,        // Ajoute des IDs aux en-têtes
    mangle: false,          // Désactive le remplacement des caractères spéciaux dans les IDs
    sanitize: false,        // Ne pas sanitizer (déjà géré par DOMPurify)
    smartLists: true,       // Utilise des listes plus intelligentes
    smartypants: true,      // Utilise des guillemets typographiques
    xhtml: false            // N'utilise pas XHTML
});

// Initialisation du carrousel Swiper
let projectSwiper;
function initSwiper() {
    projectSwiper = new Swiper('.swiper-container', {
        // Configuration de base pour l'effet banderole
        slidesPerView: 'auto',    // Nombre de slides basé sur leur largeur
        spaceBetween: 10,         // Espace réduit entre les slides (avant: 20)
        loop: true,               // Boucle infinie
        grabCursor: true,         // Curseur "grab" au survol
        centeredSlides: false,    // Ne pas centrer les slides
        freeMode: true,           // Mode libre pour un défilement plus naturel
        
        // Navigation
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Configuration responsive
        breakpoints: {
            // Mobile
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            // Petit écran
            480: {
                slidesPerView: 2,
                spaceBetween: 15
            },
            // Tablette
            768: {
                slidesPerView: 3,
                spaceBetween: 15
            },
            // Desktop
            1024: {
                slidesPerView: 3,
                spaceBetween: 20
            }
        }
    });
}

// Fonction pour charger le contenu Markdown
async function loadMarkdownContent() {
    const markdownContainer = document.getElementById('markdown-content');
    if (!markdownContainer) return;
    
    try {
        // Récupérer le nom du projet depuis l'URL ou le nom du fichier HTML
        const projectName = getProjectNameFromURL();
        
        // Si on ne peut pas déterminer le nom du projet, afficher un message d'erreur
        if (!projectName) {
            throw new Error("Impossible de déterminer le nom du projet. Veuillez spécifier un paramètre 'project' dans l'URL.");
        }
        
        // Charger les métadonnées du projet (titre, images, liens)
        await loadProjectMetadata(projectName);
        
        // Récupérer la langue actuelle
        const currentLang = localStorage.getItem('language') || 'fr';
        const langSuffix = currentLang === 'fr' ? 'fr' : 'en';
        
        // Chemin principal et alternatives pour le fichier Markdown avec prise en compte de la langue
        const possiblePaths = [
            `assets/projects/${projectName}/${projectName}${langSuffix}.md`,
            // Fallback au français si l'anglais n'existe pas
            currentLang === 'en' ? `assets/projects/${projectName}/${projectName}fr.md` : null,
            `assets/projects/${projectName}/${projectName}.md`
        ].filter(path => path !== null);
        
        console.log('Tentative de chargement du projet:', projectName);
        console.log('Langue actuelle:', currentLang);
        console.log('Chemins possibles:', possiblePaths);
        
        // Essayer de charger le fichier Markdown depuis les chemins possibles
        let response = null;
        let markdownText = "";
        let loadedPath = "";
        
        for (const path of possiblePaths) {
            try {
                console.log(`Tentative de chargement depuis: ${path}`);
                response = await fetch(path);
                if (response.ok) {
                    markdownText = await response.text();
                    loadedPath = path;
                    console.log(`Chargement réussi depuis: ${path}`);
                    break;
                }
            } catch (e) {
                console.log(`Échec de chargement depuis: ${path}`);
                // Continue à essayer le chemin suivant
            }
        }
        
        // Si aucun chemin n'a fonctionné, afficher un message d'erreur
        if (!markdownText) {
            throw new Error(`Erreur lors du chargement du fichier Markdown: aucun chemin valide trouvé`);
        }

        // Vérifier si on utilise un fallback de langue
        const isUsingFallback = currentLang === 'en' && loadedPath.includes('fr.md');
        
        // Convertir le contenu Markdown en HTML
        let htmlContent = marked.parse(markdownText);
        
        // Ajouter une notification si on utilise une langue différente
        if (isUsingFallback) {
            const notificationHtml = `
                <div class="language-fallback-notice">
                    <p class="notice-text">
                        <i class="fas fa-language"></i>
                        <span class="lang-en">This content is currently only available in French</span>
                        <span class="lang-fr">Ce contenu n'est disponible qu'en français</span>
                    </p>
                </div>
            `;
            htmlContent = notificationHtml + htmlContent;
        }
        
        // Afficher le contenu converti
        markdownContainer.innerHTML = htmlContent;
        
        // Mettre à jour l'affichage de la langue
        updateLanguageDisplay();
        
    } catch (error) {
        console.error('Erreur lors du chargement du contenu Markdown:', error);
        markdownContainer.innerHTML = `
            <div class="error-message">
                <h3>Erreur lors du chargement du contenu</h3>
                <p>${error.message}</p>
                <a href="index.php#projects" class="btn primary">
                    <i class="fas fa-arrow-left"></i> Retour aux projets
                </a>
            </div>
        `;
    }
}

// Fonction pour charger les métadonnées du projet (titre, images, liens)
async function loadProjectMetadata(projectName) {
    try {
        const response = await fetch(`assets/projects/${projectName}/${projectName}.json`);
        if (!response.ok) {
            console.error('Fichier JSON introuvable pour ce projet');
            return;
        }
        
        const metadata = await response.json();
        
        // Mettre à jour le titre de la page dans l'onglet
        document.title = `${metadata.title || projectName} - Portfolio`;
        
        // Mettre à jour le titre du projet
        const titleElement = document.getElementById('project-title');
        if (titleElement) {
            const frTitle = document.createElement('span');
            frTitle.className = 'lang-fr';
            frTitle.textContent = metadata.title || metadata.titleFr || projectName;
            
            const enTitle = document.createElement('span');
            enTitle.className = 'lang-en';
            enTitle.textContent = metadata.titleEn || metadata.title || projectName;
            
            titleElement.innerHTML = '';
            titleElement.appendChild(frTitle);
            titleElement.appendChild(enTitle);
        }
        
        // Mettre à jour la description du projet
        const descriptionElement = document.getElementById('project-description');
        if (descriptionElement && (metadata.shortDescription || metadata.shortDescriptionEn)) {
            const frDescription = document.createElement('span');
            frDescription.className = 'lang-fr';
            frDescription.textContent = metadata.shortDescription || '';
            
            const enDescription = document.createElement('span');
            enDescription.className = 'lang-en';
            enDescription.textContent = metadata.shortDescriptionEn || metadata.shortDescription || '';
            
            descriptionElement.innerHTML = '';
            descriptionElement.appendChild(frDescription);
            descriptionElement.appendChild(enDescription);
        }
        
        // Charger les informations de période, durée et lieu
        loadProjectDetails(metadata);
        
        // Charger les tags du projet
        loadProjectTags(metadata.tags || []);
        
        // Charger les images dans le carrousel
        loadProjectImages(metadata.images);
        
        // Charger les liens du projet
        loadProjectLinks(metadata, projectName);
        
        // Mise à jour de l'affichage de la langue
        updateLanguageDisplay();
        
    } catch (error) {
        console.error('Erreur lors du chargement des métadonnées du projet:', error);
    }
}

// Fonction pour charger les informations détaillées du projet (période, durée, lieu)
function loadProjectDetails(metadata) {
    const detailsContainer = document.getElementById('project-details');
    if (!detailsContainer) return;
    
    let detailsHtml = '<div class="project-details-grid">';
    
    // Période de réalisation
    if (metadata.period) {
        detailsHtml += `
            <div class="project-detail-item">
                <div class="detail-icon"><i class="far fa-calendar-alt"></i></div>
                <div class="detail-content">
                    <h4>
                        <span class="lang-fr">Période</span>
                        <span class="lang-en">Period</span>
                    </h4>
                    <p>
                        <span class="lang-fr">${metadata.period.start} - ${metadata.period.end}</span>
                        <span class="lang-en">${metadata.period.startEn || metadata.period.start} - ${metadata.period.endEn || metadata.period.end}</span>
                    </p>
                </div>
            </div>
        `;
    }
    
    // Durée de réalisation
    if (metadata.duration) {
        detailsHtml += `
            <div class="project-detail-item">
                <div class="detail-icon"><i class="far fa-clock"></i></div>
                <div class="detail-content">
                    <h4>
                        <span class="lang-fr">Durée</span>
                        <span class="lang-en">Duration</span>
                    </h4>
                    <p>
                        <span class="lang-fr">${metadata.duration.value} ${metadata.duration.unit}</span>
                        <span class="lang-en">${metadata.duration.value} ${metadata.duration.unitEn || metadata.duration.unit}</span>
                    </p>
                </div>
            </div>
        `;
    }
    
    // Lieu de réalisation
    if (metadata.location) {
        detailsHtml += `
            <div class="project-detail-item">
                <div class="detail-icon"><i class="fas fa-map-marker-alt"></i></div>
                <div class="detail-content">
                    <h4>
                        <span class="lang-fr">Lieu</span>
                        <span class="lang-en">Location</span>
                    </h4>
                    <p>
                        <span class="lang-fr">${metadata.location.fr}</span>
                        <span class="lang-en">${metadata.location.en || metadata.location.fr}</span>
                    </p>
                </div>
            </div>
        `;
    }
    
    // Technologies utilisées
    if (metadata.tags && metadata.tags.length > 0) {
        detailsHtml += `
            <div class="project-detail-item">
                <div class="detail-icon"><i class="fas fa-code"></i></div>
                <div class="detail-content">
                    <h4>
                        <span class="lang-fr">Technologies</span>
                        <span class="lang-en">Technologies</span>
                    </h4>
                    <div class="detail-tags">
                        ${metadata.tags.map(tag => `<span class="detail-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    detailsHtml += '</div>';
    detailsContainer.innerHTML = detailsHtml;
}

// Fonction pour charger les tags du projet
function loadProjectTags(tags) {
    const tagsContainer = document.getElementById('project-tags');
    if (!tagsContainer) return;
    
    // Si pas de tags, afficher un message
    if (!tags || tags.length === 0) {
        tagsContainer.innerHTML = `
            <p class="text-muted">
                <span class="lang-fr">Aucune technologie spécifiée</span>
                <span class="lang-en">No technologies specified</span>
            </p>
        `;
        return;
    }
    
    // Vider le conteneur
    tagsContainer.innerHTML = '';
    
    // Ajouter chaque tag
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'project-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
}

// Fonction pour charger les images dans le carrousel
function loadProjectImages(images) {
    const imagesContainer = document.getElementById('project-images');
    if (!imagesContainer || !images || images.length === 0) {
        // Si pas d'images, utiliser une image par défaut
        imagesContainer.innerHTML = `
            <div class="swiper-slide">
                <img src="assets/img/default_project_image.png" alt="Image par défaut" class="gallery-image">
            </div>
        `;
        return;
    }
    
    // Vider le conteneur
    imagesContainer.innerHTML = '';
    
    // Ajouter chaque image
    images.forEach(image => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt || '';
        img.className = 'gallery-image';
        img.onerror = function() {
            this.src = 'assets/img/default_project_image.png';
            this.onerror = null;
        };
        
        // Ajouter un événement de clic pour ouvrir la lightbox
        img.addEventListener('click', function() {
            openLightbox(image.src, image.alt || '');
        });
        
        slide.appendChild(img);
        imagesContainer.appendChild(slide);
    });
    
    // Réinitialiser le swiper pour prendre en compte les nouvelles slides
    if (projectSwiper) {
        projectSwiper.update();
        projectSwiper.slideTo(0);
    }
}

// Fonction pour charger les liens du projet depuis un fichier JSON
function loadProjectLinks(metadata, projectName) {
    const linksContainer = document.getElementById('project-links');
    if (!linksContainer) return;
    
    let linksHtml = '';
    
    // Ajouter le lien de démo s'il existe
    if (metadata.demoUrl) {
        linksHtml += `
            <a href="${metadata.demoUrl}" target="_blank" class="project-link">
                <i class="fas fa-external-link-alt"></i>
                <span class="lang-fr">Voir la démo</span>
                <span class="lang-en">View Demo</span>
            </a>
        `;
    }
    
    // Ajouter le lien GitHub s'il existe
    if (metadata.githubUrl) {
        linksHtml += `
            <a href="${metadata.githubUrl}" target="_blank" class="project-link">
                <i class="fab fa-github"></i>
                <span class="lang-fr">Code Source</span>
                <span class="lang-en">Source Code</span>
            </a>
        `;
    }
    
    // Si aucun lien n'est disponible
    if (!linksHtml) {
        linksHtml = `
            <p class="text-muted">
                <span class="lang-fr">Liens non disponibles pour ce projet</span>
                <span class="lang-en">Links not available for this project</span>
            </p>
        `;
    }
    
    linksContainer.innerHTML = linksHtml;
}

// Fonction pour extraire le nom du projet de l'URL (pour project-detail.html?project=xxx)
function getProjectNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('project');
}

// Mise à jour de l'affichage de la langue (coordination avec script.js)
function updateLanguageDisplay() {
    const langElements = document.querySelectorAll('.lang-fr, .lang-en');
    const currentLang = localStorage.getItem('language') || 'fr';
    
    langElements.forEach(el => {
        if (el.classList.contains(`lang-${currentLang}`)) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
}

// Variables de gestion de la lightbox
let currentLightboxIndex = 0;
let lightboxImages = [];

// Fonction pour ouvrir la lightbox
function openLightbox(src, alt) {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    // Mettre à jour l'image dans la lightbox
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    
    // Collecter toutes les images du carousel pour la navigation
    const galleryImages = document.querySelectorAll('.gallery-image');
    lightboxImages = Array.from(galleryImages).map(img => ({
        src: img.src,
        alt: img.alt
    }));
    
    // Trouver l'index de l'image actuelle
    currentLightboxIndex = lightboxImages.findIndex(img => img.src === src);
    
    // Afficher la lightbox
    lightbox.classList.add('active');
    
    // Empêcher le défilement de la page quand la lightbox est ouverte
    document.body.style.overflow = 'hidden';
}

// Fonction pour fermer la lightbox
function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    lightbox.classList.remove('active');
    
    // Réactiver le défilement de la page
    document.body.style.overflow = 'auto';
}

// Fonction pour naviguer vers l'image précédente
function prevImage() {
    if (lightboxImages.length <= 1) return;
    
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.src = lightboxImages[currentLightboxIndex].src;
    lightboxImage.alt = lightboxImages[currentLightboxIndex].alt;
}

// Fonction pour naviguer vers l'image suivante
function nextImage() {
    if (lightboxImages.length <= 1) return;
    
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.src = lightboxImages[currentLightboxIndex].src;
    lightboxImage.alt = lightboxImages[currentLightboxIndex].alt;
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le carrousel Swiper
    initSwiper();
    
    // Charger le contenu Markdown
    loadMarkdownContent();
    
    // Mettre à jour l'affichage de la langue
    updateLanguageDisplay();
    
    // Ajouter les écouteurs d'événements pour la lightbox
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightbox = document.getElementById('image-lightbox');
    
    // Fermer la lightbox en cliquant sur le bouton de fermeture
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Navigation dans la lightbox
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    // Fermer la lightbox en cliquant en dehors de l'image
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Gérer les touches du clavier pour la navigation dans la lightbox
    document.addEventListener('keydown', function(e) {
        if (!document.getElementById('image-lightbox').classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
});