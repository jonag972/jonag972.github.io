<?php
// Inclure les fichiers de statistiques et de consentement RGPD
include_once __DIR__ . '/includes/stats-collector.php';
include_once __DIR__ . '/includes/consent-manager.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détail Projet - Portfolio</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="assets/css/project-detail.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
</head>
<body>
    <header>
        <div class="logo" id="logo-container">
            <h1>JG</h1>
            <!-- Menu déroulant caché -->
            <div class="admin-menu" id="admin-menu">
                <a href="admin/stats.php">Administration</a>
                <!-- Ajoutez d'autres liens ici si nécessaire -->
            </div>
        </div>
        <nav>
            <ul>
                <li><a href="/">Accueil</a></li>
                <li><a href="/#projects">Projets</a></li>
                <li><a href="/#contact">Contact</a></li>
            </ul>
        </nav>
        <div class="toggle-container">
            <div class="theme-toggle">
                <i class="fas fa-sun"></i>
            </div>
            <div class="lang-toggle">
                <i class="fas fa-globe"></i>
                <span class="current-lang">FR</span>
            </div>
        </div>
    </header>

    <main>
        <div class="detail-container">
            <section class="project-detail section">
                <div class="project-detail-header">
                    <h2 class="section-title" id="project-title">
                        <span class="lang-fr">Chargement...</span>
                        <span class="lang-en">Loading...</span>
                    </h2>
                    
                    <!-- Description courte sous le titre -->
                    <div class="project-description-header" id="project-description">
                        <span class="lang-fr">Chargement de la description...</span>
                        <span class="lang-en">Loading description...</span>
                    </div>
                </div>

                <!-- RUBAN D'IMAGES / CARROUSEL -->
                <div class="project-carousel swiper-container">
                    <div class="swiper-wrapper" id="project-images">
                        <!-- Les images seront chargées dynamiquement ici -->
                        <div class="swiper-slide">
                            <div class="loading-spinner">
                                <i class="fas fa-spinner fa-spin"></i> 
                                <span class="lang-fr">Chargement des images...</span>
                                <span class="lang-en">Loading images...</span>
                            </div>
                        </div>
                    </div>
                    <!-- Ajout des flèches de navigation -->
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>

                <!-- INFORMATIONS DE PROJET (période, durée, lieu) -->
                <div class="project-metadata" id="project-details">
                    <!-- Les détails du projet seront chargés dynamiquement ici -->
                </div>
                
                <!-- CONTENU MARKDOWN -->
                <div class="markdown-content" id="markdown-content">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i> 
                        <span class="lang-fr">Chargement du contenu...</span>
                        <span class="lang-en">Loading content...</span>
                    </div>
                </div>

                <!-- LIENS UTILES -->
                <div class="project-links-detail">
                    <h3>
                        <span class="lang-fr">Liens</span>
                        <span class="lang-en">Links</span>
                    </h3>
                    <div id="project-links">
                        <p class="text-muted">
                            <span class="lang-fr">Liens non disponibles pour ce projet</span>
                            <span class="lang-en">Links not available for this project</span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Lightbox pour afficher les images en grand -->
    <div class="lightbox" id="image-lightbox">
        <div class="lightbox-content">
            <img src="" alt="" class="lightbox-image" id="lightbox-image">
            <div class="lightbox-close" id="lightbox-close">
                <i class="fas fa-times"></i>
            </div>
            <div class="lightbox-nav">
                <div class="lightbox-prev" id="lightbox-prev">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <div class="lightbox-next" id="lightbox-next">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Pied de page/Contact -->
    <section id="contact" class="section bg-light">
        <div class="section-header">
            <h2 class="section-title">
                <span class="lang-fr">Contact</span>
                <span class="lang-en">Contact</span>
            </h2>
            <p class="section-subtitle">
                <span class="lang-fr">N'hésitez pas à me contacter pour discuter de vos projets</span>
                <span class="lang-en">Feel free to contact me to discuss your projects</span>
            </p>
        </div>
        
        <div class="contact-container">
            <div class="contact-info">
                <div class="contact-methods">
                    <div class="contact-method">
                        <div class="contact-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="contact-details">
                            <h4>Email</h4>
                            <p><a href="mailto:jonathan.gromat@outlook.com">jonathan.gromat@outlook.com</a></p>
                        </div>
                    </div>
                    
                    <div class="contact-method">
                        <div class="contact-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="contact-details">
                            <h4>
                                <span class="lang-fr">Localisation</span>
                                <span class="lang-en">Location</span>
                            </h4>
                            <p>Île-de-France</p>
                        </div>
                    </div>
                    
                    <div class="contact-method">
                        <div class="contact-icon">
                            <i class="fab fa-linkedin-in"></i>
                        </div>
                        <div class="contact-details">
                            <h4>LinkedIn</h4>
                            <p><a href="https://www.linkedin.com/in/jonathan-gromat-1398402b7/" target="_blank">jonathan.gromat</a></p>
                        </div>
                    </div>
                    
                    <div class="contact-method">
                        <div class="contact-icon">
                            <i class="fab fa-github"></i>
                        </div>
                        <div class="contact-details">
                            <h4>GitHub</h4>
                            <p><a href="https://github.com/jonag972" target="_blank">jonag972</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer-section text-center mt-5 py-3">
            <div class="container">
                <p>
                    <span class="lang-fr">&copy; 2025 Jonathan Gromat. Tous droits réservés. | Portfolio personnel - Développeur web et Data</span>
                    <span class="lang-en">&copy; 2025 Jonathan Gromat. All rights reserved. | Personal portfolio - Web & Data Developer</span>
                </p>
                <p class="footer-links">
                    <a href="/privacy-policy.php" class="footer-link">
                        <span class="lang-fr">Politique de confidentialité</span>
                        <span class="lang-en">Privacy Policy</span>
                    </a>
                </p>
            </div>
        </div>
    </section>

    <!-- Bibliothèque Marked.js pour convertir le Markdown en HTML -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <!-- Swiper.js pour le carrousel -->
    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
    <script src="assets/js/script.js"></script>
    <script src="assets/js/project-detail.js"></script>
    
    <!-- Bannière de consentement RGPD -->
    <?php echo displayConsentBanner(); ?>
</body>
</html>