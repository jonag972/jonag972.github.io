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
            body.setAttribute('data-page', 'apps');
        } else {
            body.setAttribute('data-page', 'portfolio');
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
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavbarLoader();
});