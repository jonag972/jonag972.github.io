// Morphing Navbar functionality
class MorphingNavbar {
    constructor() {
        this.currentSection = this.getCurrentSection();
        this.init();
    }

    // Initialize navbar loading and functionality
    async init() {
        try {
            await this.loadNavbar();
            this.setupNavigation();
            this.setActiveSection();
            this.initializeEventListeners();
            this.loadPreferences();
        } catch (error) {
            console.error('Error initializing navbar:', error);
        }
    }

    // Load navbar HTML
    async loadNavbar() {
        const navbarPlaceholder = document.getElementById('navbar');
        if (!navbarPlaceholder) {
            console.error('Navbar placeholder not found');
            return;
        }

        try {
            // Adjust path for different folder structures
            const navbarPath = window.location.pathname.includes('/projets/') ? '../components/navbar/navbar.html' : 'components/navbar/navbar.html';
            const response = await fetch(navbarPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const navbarHTML = await response.text();
            navbarPlaceholder.innerHTML = navbarHTML;
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    // Setup navigation functionality
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const navbarContainer = document.querySelector('.navbar-container');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });
        
        // Set initial state
        if (navbarContainer) {
            navbarContainer.setAttribute('data-active', this.currentSection);
        }
    }

    // Navigate to different sections
    navigateToSection(section) {
        if (section === 'portfolio') {
            // Navigate to portfolio (index.html)
            window.location.href = 'index.html';
        } else if (section === 'apps') {
            // Navigate to apps page (projets.html)
            window.location.href = 'projets.html';
        }
    }

    // Determine current section based on URL
    getCurrentSection() {
        const path = window.location.pathname;
        
        // Check if we're on apps/projects page
        if (path.includes('projets.html') || path.includes('/projets/')) {
            return 'apps';
        }
        
        // Default to portfolio for index and other pages
        return 'portfolio';
    }

    // Set active section and morphing state
    setActiveSection() {
        const navItems = document.querySelectorAll('.nav-item');
        const navbarContainer = document.querySelector('.navbar-container');
        
        // Remove active class from all items
        navItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to current section
        const activeItem = document.querySelector(`[data-section="${this.currentSection}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Set morphing background position
        if (navbarContainer) {
            navbarContainer.setAttribute('data-active', this.currentSection);
        }
    }

    // Initialize event listeners
    initializeEventListeners() {
        this.initSettingsMenu();
        this.initThemeToggle();
        this.initLanguageToggle();
    }

    // Settings menu functionality
    initSettingsMenu() {
        const settingsToggle = document.querySelector('.settings-toggle');
        const settingsMenu = document.querySelector('.settings-menu');
        
        if (!settingsToggle || !settingsMenu) return;
        
        // Toggle settings menu
        settingsToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            settingsMenu.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!settingsToggle.contains(e.target) && !settingsMenu.contains(e.target)) {
                settingsMenu.classList.remove('show');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && settingsMenu.classList.contains('show')) {
                settingsMenu.classList.remove('show');
                settingsToggle.focus();
            }
        });
    }

    // Theme toggle functionality
    initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const body = document.body;
        
        if (!themeToggle) return;
        
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            // Save preference
            const isDarkMode = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode.toString());
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            if (isDarkMode) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    }

    // Language toggle functionality
    initLanguageToggle() {
        const langToggle = document.querySelector('.lang-toggle');
        
        if (!langToggle) return;
        
        langToggle.addEventListener('click', () => {
            const currentLang = langToggle.querySelector('.current-lang');
            const isCurrentlyFrench = currentLang.textContent === 'FR';
            
            if (isCurrentlyFrench) {
                currentLang.textContent = 'EN';
                this.switchToEnglish();
                localStorage.setItem('language', 'en');
            } else {
                currentLang.textContent = 'FR';
                this.switchToFrench();
                localStorage.setItem('language', 'fr');
            }
            
            // Dispatch custom event for language change
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: localStorage.getItem('language') }
            }));
        });
    }

    // Mobile menu functionality
    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav ul');
        
        if (!menuToggle || !nav) return;
        
        // Toggle menu on click
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            
            // Update aria attributes
            const isOpen = nav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            nav.setAttribute('aria-hidden', !isOpen);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                this.closeMenu();
                menuToggle.focus();
            }
        });
        
        // Close menu on nav link click (mobile)
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && nav.classList.contains('active')) {
                    setTimeout(() => this.closeMenu(), 100);
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    // Initialize navigation listeners for URL changes
    initNavigationListeners() {
        // Listen for hash changes (for section navigation)
        window.addEventListener('hashchange', () => {
            this.updateActiveNavigation();
        });
        
        // Listen for popstate events (for back/forward navigation)
        window.addEventListener('popstate', () => {
            this.updateActiveNavigation();
        });
        
        // Listen for manual navigation clicks
        const navLinks = document.querySelectorAll('nav a[data-page]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Small delay to allow URL change to complete
                setTimeout(() => {
                    this.updateActiveNavigation();
                }, 50);
            });
        });
    }

    // Update active navigation based on current URL
    updateActiveNavigation() {
        this.currentPage = this.getCurrentPage();
        this.setActiveNavItem();
    }

    // Close mobile menu
    closeMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav ul');
        
        if (menuToggle && nav) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', false);
            nav.setAttribute('aria-hidden', true);
        }
    }

    // Scroll-based active navigation (for single page sections)
    initScrollActiveNav() {
        if (this.currentPage !== 'index') return;
        
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');
        
        if (sections.length === 0) return;
        
        let isScrollingFromClick = false;
        
        // Track when user clicks on navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                isScrollingFromClick = true;
                // Reset flag after animation completes
                setTimeout(() => {
                    isScrollingFromClick = false;
                }, 1000);
            });
        });
        
        const observer = new IntersectionObserver((entries) => {
            // Don't update active state if user just clicked a nav link
            if (isScrollingFromClick) return;
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}` || 
                            link.getAttribute('href') === `portfolio.html#${sectionId}`) {
                            link.classList.add('active');
                            // Update the current page to match the section
                            this.currentPage = link.getAttribute('data-page') || 'index';
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }

    // Switch to French
    switchToFrench() {
        document.querySelectorAll('.lang-fr').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.lang-en').forEach(el => el.style.display = 'none');
        
        // Update page title
        const titleElement = document.querySelector('title.lang-content');
        if (titleElement && titleElement.hasAttribute('data-fr')) {
            titleElement.textContent = titleElement.getAttribute('data-fr');
        }
        
        // Update document language
        document.documentElement.lang = 'fr';
    }

    // Switch to English
    switchToEnglish() {
        document.querySelectorAll('.lang-fr').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.lang-en').forEach(el => el.style.display = 'block');
        
        // Update page title
        const titleElement = document.querySelector('title.lang-content');
        if (titleElement && titleElement.hasAttribute('data-en')) {
            titleElement.textContent = titleElement.getAttribute('data-en');
        }
        
        // Update document language
        document.documentElement.lang = 'en';
    }

    // Load saved preferences
    loadPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-mode');
            const themeToggle = document.querySelector('.theme-toggle i');
            if (themeToggle) {
                themeToggle.classList.remove('fa-sun');
                themeToggle.classList.add('fa-moon');
            }
        }
        
        // Load language preference
        const savedLanguage = localStorage.getItem('language');
        const langToggle = document.querySelector('.lang-toggle .current-lang');
        if (savedLanguage === 'en') {
            if (langToggle) langToggle.textContent = 'EN';
            this.switchToEnglish();
        } else {
            if (langToggle) langToggle.textContent = 'FR';
            this.switchToFrench();
        }
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MorphingNavbar();
});