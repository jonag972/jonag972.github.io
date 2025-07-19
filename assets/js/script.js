/**
 * Portfolio Main JavaScript - Minimal Version
 * Handles theme switching, language switching, and basic interactions
 */

class PortfolioApp {
    constructor() {
        this.currentTheme = 'light';
        this.currentLanguage = 'fr';
        this.init();
    }

    init() {
        this.loadPreferences();
        this.setupEventListeners();
        this.setupScrollIndicator();
        this.applyInitialState();
    }

    // Load saved preferences from localStorage
    loadPreferences() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLanguage = localStorage.getItem('language') || 'fr';
    }

    // Setup all event listeners
    setupEventListeners() {
        // Settings toggle
        const settingsToggle = document.getElementById('settings-toggle');
        if (settingsToggle) {
            settingsToggle.addEventListener('click', (e) => {
                e.preventDefault();
                settingsToggle.classList.toggle('active');
            });
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Language toggle
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Close settings menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    // Toggle between light and dark theme
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.savePreferences();
    }

    // Apply theme to the page
    applyTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        
        if (this.currentTheme === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        } else {
            body.classList.remove('dark-mode');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        }
    }

    // Toggle between French and English
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'fr' ? 'en' : 'fr';
        this.applyLanguage();
        this.savePreferences();
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const navItems = document.getElementById('nav-items');
        if (navItems) {
            navItems.classList.toggle('active');
        }
    }

    // Apply language to the page
    applyLanguage() {
        const body = document.body;
        body.setAttribute('data-lang', this.currentLanguage);

        // Update page title
        const titleElement = document.querySelector('title.lang-content');
        if (titleElement) {
            const titleAttr = this.currentLanguage === 'fr' ? 'data-fr' : 'data-en';
            if (titleElement.hasAttribute(titleAttr)) {
                titleElement.textContent = titleElement.getAttribute(titleAttr);
            }
        }

        // Update document language
        document.documentElement.lang = this.currentLanguage;

        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    // Save preferences to localStorage
    savePreferences() {
        localStorage.setItem('theme', this.currentTheme);
        localStorage.setItem('language', this.currentLanguage);
    }

    // Apply initial state based on saved preferences
    applyInitialState() {
        this.applyTheme();
        this.applyLanguage();
        
        // Set active page indicator
        this.setActivePageIndicator();
    }

    // Set active page indicator for navbar
    setActivePageIndicator() {
        const body = document.body;
        const path = window.location.pathname;
        
        if (path.includes('projets.html') || path.includes('/projets/')) {
            body.setAttribute('data-page', 'projets');
        } else if (path.includes('apps.html')) {
            body.setAttribute('data-page', 'apps');
        } else {
            body.setAttribute('data-page', 'home');
        }
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Escape key to close settings menu
        if (e.key === 'Escape') {
            const settingsToggle = document.getElementById('settings-toggle');
            if (settingsToggle && settingsToggle.classList.contains('active')) {
                settingsToggle.classList.remove('active');
            }
        }

        // Ctrl/Cmd + D for theme toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            this.toggleTheme();
        }

        // Ctrl/Cmd + L for language toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            this.toggleLanguage();
        }
    }

    // Handle clicks outside settings menu
    handleOutsideClick(e) {
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsMenu = document.querySelector('.settings-menu');
        
        if (settingsToggle && settingsMenu && 
            !settingsToggle.contains(e.target) && 
            !settingsMenu.contains(e.target) &&
            settingsToggle.classList.contains('active')) {
            settingsToggle.classList.remove('active');
        }
    }

    // Setup scroll indicator functionality
    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        // Click to scroll to next section
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('#projects');
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // Hide/show based on scroll position
        let ticking = false;
        const updateScrollIndicator = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const threshold = window.innerHeight * 0.5;
            
            if (scrollTop > threshold) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollIndicator);
                ticking = true;
            }
        });
    }
}

// Navbar loader functionality
class NavbarLoader {
    constructor() {
        this.loadNavbar();
    }

    async loadNavbar() {
        const navbarPlaceholder = document.getElementById('navbar');
        if (!navbarPlaceholder) return;

        try {
            // Determine correct path based on current location
            const isInSubfolder = window.location.pathname.includes('/projets/');
            const navbarPath = isInSubfolder ? 
                '../components/navbar/navbar.html' : 
                'components/navbar/navbar.html';

            const response = await fetch(navbarPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const navbarHTML = await response.text();
            navbarPlaceholder.innerHTML = navbarHTML;

            // Initialize app after navbar is loaded
            window.portfolioApp = new PortfolioApp();

        } catch (error) {
            console.error('Error loading navbar:', error);
            // Fallback: initialize app anyway
            window.portfolioApp = new PortfolioApp();
        }
    }
}

// Mobile Tab Navigation Class
class MobileTabNavigation {
    constructor() {
        this.currentView = 'home';
        this.init();
    }

    init() {
        this.setupMobileTabListeners();
        this.loadMobileContent();
        this.setInitialView();
    }

    setInitialView() {
        // Ensure home view is active by default
        document.querySelectorAll('.mobile-view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById('mobile-home').classList.add('active');
        
        // Ensure home tab is active
        document.querySelectorAll('.mobile-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector('[data-view="home"]').classList.add('active');
    }

    setupMobileTabListeners() {
        const mobileTabs = document.querySelectorAll('.mobile-tab');
        mobileTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = tab.getAttribute('data-view');
                this.switchView(viewName);
            });
        });

        // Mobile theme and language toggles
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        const mobileLangToggle = document.getElementById('mobile-lang-toggle');
        
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', () => {
                if (window.portfolioApp) {
                    window.portfolioApp.toggleTheme();
                }
            });
        }

        if (mobileLangToggle) {
            mobileLangToggle.addEventListener('click', () => {
                if (window.portfolioApp) {
                    window.portfolioApp.toggleLanguage();
                }
            });
        }
    }

    switchView(viewName) {
        // Update active tab
        document.querySelectorAll('.mobile-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update active view
        document.querySelectorAll('.mobile-view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`mobile-${viewName}`).classList.add('active');

        this.currentView = viewName;
        
        // Load content for the view
        this.loadViewContent(viewName);
    }

    loadViewContent(viewName) {
        switch(viewName) {
            case 'projets':
                this.loadProjectsContent();
                break;
            case 'apps':
                this.loadAppsContent();
                break;
        }
    }

    loadProjectsContent() {
        const projectsList = document.querySelector('.mobile-projects-list');
        if (!projectsList || projectsList.children.length > 0) return;

        const projects = [
            {
                title: 'MedicSearch',
                description: 'Application d\'agrégation et recherche de médicaments avec IA',
                tags: ['Python', 'Flask', 'MongoDB', 'Mistral AI'],
                link: 'projets/medicsearch.html'
            },
            {
                title: 'Outil de Migration de Données',
                description: 'Outil Python pour la migration Oracle vers PostgreSQL',
                tags: ['Python', 'Oracle', 'PostgreSQL', 'Ora2PG'],
                link: 'projets/data-migration-tool.html'
            },
            {
                title: 'Site Portfolio Personnel',
                description: 'Site web portfolio responsive avec navigation morphing',
                tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
                link: 'projets/portfolio-website.html'
            }
        ];

        projects.forEach(project => {
            const projectCard = this.createMobileProjectCard(project);
            projectsList.appendChild(projectCard);
        });
    }

    loadAppsContent() {
        const appsList = document.querySelector('.mobile-apps-list');
        if (!appsList || appsList.children.length > 0) return;

        const apps = [
            {
                title: 'MedicSearch Live',
                description: 'Application de recherche de médicaments avec IA',
                tags: ['Live Demo', 'IA', 'Flask'],
                comingSoon: true
            },
            {
                title: 'Portfolio Interactif',
                description: 'Vous y êtes ! Explorez les fonctionnalités',
                tags: ['Live Site', 'Responsive', 'Multilingue'],
                link: 'index.html'
            }
        ];

        apps.forEach(app => {
            const appCard = this.createMobileAppCard(app);
            appsList.appendChild(appCard);
        });
    }

    createMobileProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'mobile-project-card';
        card.innerHTML = `
            <div class="mobile-card-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="mobile-card-tags">
                    ${project.tags.map(tag => `<span class="mobile-tag">${tag}</span>`).join('')}
                </div>
                <a href="${project.link}" class="mobile-card-link">
                    <i class="fas fa-arrow-right"></i>
                    <span class="lang-fr">Voir le projet</span>
                    <span class="lang-en">View project</span>
                </a>
            </div>
        `;
        return card;
    }

    createMobileAppCard(app) {
        const card = document.createElement('div');
        card.className = 'mobile-app-card';
        const linkContent = app.comingSoon 
            ? `<span class="mobile-coming-soon">
                <i class="fas fa-clock"></i>
                <span class="lang-fr">Bientôt disponible</span>
                <span class="lang-en">Coming Soon</span>
               </span>`
            : `<a href="${app.link}" class="mobile-card-link">
                <i class="fas fa-external-link-alt"></i>
                <span class="lang-fr">Tester</span>
                <span class="lang-en">Test</span>
               </a>`;
        
        card.innerHTML = `
            <div class="mobile-card-content">
                <h3>${app.title}</h3>
                <p>${app.description}</p>
                <div class="mobile-card-tags">
                    ${app.tags.map(tag => `<span class="mobile-tag">${tag}</span>`).join('')}
                </div>
                ${linkContent}
            </div>
        `;
        return card;
    }

    loadMobileContent() {
        // Load initial content
        this.loadProjectsContent();
        this.loadAppsContent();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavbarLoader();
    
    // Initialize mobile navigation if on mobile
    if (window.innerWidth <= 768) {
        new MobileTabNavigation();
    }
});