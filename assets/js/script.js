// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner les éléments
    const themeToggle = document.querySelector('.theme-toggle');
    const langToggle = document.querySelector('.lang-toggle');
    const body = document.body;
    const statCards = document.querySelectorAll('.stat-card');
    
    // Fonction pour basculer entre le mode clair et sombre
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Sauvegarder la préférence de thème dans localStorage
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode.toString());
        
        // Changer l'icône
        const icon = themeToggle.querySelector('i');
        if (isDarkMode) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });
    
    // Fonction pour basculer entre français et anglais
    langToggle.addEventListener('click', () => {
        const currentLang = langToggle.querySelector('.current-lang');
        const isCurrentlyFrench = currentLang.textContent === 'FR';
        
        if (isCurrentlyFrench) {
            currentLang.textContent = 'EN';
            switchToEnglish();
            localStorage.setItem('language', 'en');
        } else {
            currentLang.textContent = 'FR';
            switchToFrench();
            localStorage.setItem('language', 'fr');
        }
    });
    
    // Fonction pour passer au français
    function switchToFrench() {
        // Afficher les éléments en français et masquer ceux en anglais
        document.querySelectorAll('.lang-fr').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.lang-en').forEach(el => el.style.display = 'none');
        
        // Mettre à jour le titre de la page
        document.title = "Mon Portfolio";        // Navigation
        const navLink1 = document.querySelector('nav ul li:nth-child(1) a');
        if (navLink1) navLink1.textContent = 'Accueil';
        const navLink2 = document.querySelector('nav ul li:nth-child(2) a');
        if (navLink2) navLink2.textContent = 'Projets';
        const navLink3 = document.querySelector('nav ul li:nth-child(3) a');
        if (navLink3) navLink3.textContent = 'Parcours';
        const navLink4 = document.querySelector('nav ul li:nth-child(4) a');
        if (navLink4) navLink4.textContent = 'Contact';
        
        // Boutons CTA
        const ctaPrimary = document.querySelector('.cta-buttons .btn.primary');
        if (ctaPrimary) ctaPrimary.innerHTML = 'Me contacter <i class="fas fa-paper-plane"></i>';
        const ctaSecondary = document.querySelector('.cta-buttons .btn.secondary');
        if (ctaSecondary) ctaSecondary.innerHTML = 'Télécharger CV <i class="fas fa-download"></i>';
    }
    
    // Fonction pour passer à l'anglais
    function switchToEnglish() {
        // Afficher les éléments en anglais et masquer ceux en français
        document.querySelectorAll('.lang-fr').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.lang-en').forEach(el => el.style.display = 'block');
        
        // Mettre à jour le titre de la page
        document.title = "My Portfolio";        // Navigation
        const navLink1 = document.querySelector('nav ul li:nth-child(1) a');
        if (navLink1) navLink1.textContent = 'Home';
        const navLink2 = document.querySelector('nav ul li:nth-child(2) a');
        if (navLink2) navLink2.textContent = 'Projects';
        const navLink3 = document.querySelector('nav ul li:nth-child(3) a');
        if (navLink3) navLink3.textContent = 'Journey';
        const navLink4 = document.querySelector('nav ul li:nth-child(4) a');
        if (navLink4) navLink4.textContent = 'Contact';
        
        // Boutons CTA
        const ctaPrimary = document.querySelector('.cta-buttons .btn.primary');
        if (ctaPrimary) ctaPrimary.innerHTML = 'Contact Me <i class="fas fa-paper-plane"></i>';
        const ctaSecondary = document.querySelector('.cta-buttons .btn.secondary');
        if (ctaSecondary) ctaSecondary.innerHTML = 'Download CV <i class="fas fa-download"></i>';
    }
    
    // Récupérer les préférences de langue et de thème depuis localStorage
    let savedLanguage = localStorage.getItem('language');
    let savedDarkMode = localStorage.getItem('darkMode');
    
    // Définir les préférences par défaut si elles ne sont pas déjà définies
    if (savedLanguage === null) {
        savedLanguage = 'fr'; // Langue par défaut : français
        localStorage.setItem('language', savedLanguage);
    }
    if (savedDarkMode === null) {
        savedDarkMode = 'false'; // Thème par défaut : clair
        localStorage.setItem('darkMode', savedDarkMode);
    }

    // Appliquer le thème sauvegardé
    if (savedDarkMode === 'true') {
        body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    // Appliquer la langue sauvegardée
    if (savedLanguage === 'fr') {
        langToggle.querySelector('.current-lang').textContent = 'FR';
        switchToFrench();
    } else if (savedLanguage === 'en') {
        langToggle.querySelector('.current-lang').textContent = 'EN';
        switchToEnglish();
    } else {
        // Par défaut, on commence en français (ne devrait pas être atteint après l'initialisation)
        langToggle.querySelector('.current-lang').textContent = 'FR';
        switchToFrench();
    }
    
    // Animation au défilement
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    // Observer les cartes de statistiques
    statCards.forEach(card => {
        observer.observe(card);
    });
    
    // Animation de l'indicateur de défilement
    const scrollIndicator = document.querySelector('.scroll-indicator');
    scrollIndicator.addEventListener('click', () => {
        window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
    
    // Ajouter une classe pour déclencher les animations d'entrée
    setTimeout(() => {
        document.querySelector('.hero').classList.add('loaded');
    }, 300);
    
    // Gestion du menu burger
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');

    if (menuToggle && nav) {
        // Toggle menu on click
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            
            // Update aria attributes for accessibility
            const isOpen = nav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            nav.setAttribute('aria-hidden', !isOpen);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeMenu();
                menuToggle.focus(); // Return focus to toggle button
            }
        });
        
        // Function to close menu
        function closeMenu() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
            nav.setAttribute('aria-hidden', 'true');
        }
    }

    // Fermer le menu lorsqu'on clique sur un lien
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && nav && nav.classList.contains('active')) {
                // Delay closing to allow smooth navigation
                setTimeout(() => {
                    if (menuToggle && nav) {
                        menuToggle.classList.remove('active');
                        nav.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                        menuToggle.setAttribute('aria-expanded', 'false');
                        nav.setAttribute('aria-hidden', 'true');
                    }
                }, 100);
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
            nav.setAttribute('aria-hidden', 'true');
        }
    });
});

// Fonctionnalité du menu admin caché
document.addEventListener('DOMContentLoaded', () => {
    const logoContainer = document.getElementById('logo-container');
    const adminMenu = document.getElementById('admin-menu');
    
    if (logoContainer && adminMenu) {
        let clickCount = 0;
        let lastClickTime = 0;
        const clickTimeout = 500; // Temps max entre les clics (ms)

        logoContainer.addEventListener('click', (event) => {
            const currentTime = new Date().getTime();

            // Réinitialiser si le délai est trop long
            if (currentTime - lastClickTime > clickTimeout) {
                clickCount = 1;
            } else {
                clickCount++;
            }

            lastClickTime = currentTime;

            // Si 3 clics rapides
            if (clickCount === 3) {
                adminMenu.classList.toggle('visible');
                clickCount = 0; // Réinitialiser après 3 clics
                event.stopPropagation(); // Empêche la fermeture immédiate par le listener global
            }
        });

        // Fermer le menu si on clique ailleurs
        document.addEventListener('click', (event) => {
            if (adminMenu.classList.contains('visible') && !logoContainer.contains(event.target)) {
                adminMenu.classList.remove('visible');
                clickCount = 0; // Réinitialiser le compteur
            }
        });
    }
});