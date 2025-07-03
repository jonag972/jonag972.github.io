// Navbar loader and functionality
class NavbarLoader {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    // Initialize navbar loading and functionality
    async init() {
        try {
            await this.loadNavbar();
            this.setupNavLinks();
            this.setActiveNavItem();
            this.initializeEventListeners();
            this.loadPreferences();
        } catch (error) {
            console.error('Error initializing navbar:', error);
        }
    }

    // Load navbar HTML
    async loadNavbar() {
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (!navbarPlaceholder) {
            console.error('Navbar placeholder not found');
            return;
        }

        try {
            // Adjust path for project pages
            const navbarPath = window.location.pathname.includes('/projets/') ? '../navbar.html' : 'navbar.html';
            const response = await fetch(navbarPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const navbarHTML = await response.text();
            navbarPlaceholder.innerHTML = navbarHTML;
        } catch (error) {
            console.error('Error loading navbar:', error);
            // Fallback: keep existing navbar if loading fails
        }
    }

    // Setup navigation links with correct URLs
    setupNavLinks() {
        const isInProjectFolder = window.location.pathname.includes('/projets/');
        const basePrefix = isInProjectFolder ? '../' : '';
        
        // Update navigation links
        const navHome = document.querySelector('.nav-home');
        const navProjects = document.querySelector('.nav-projects');
        const navParcours = document.querySelector('.nav-parcours');
        const navContact = document.querySelector('.nav-contact');
        const navSoutenance = document.querySelector('.nav-soutenance');
        
        if (navHome) navHome.href = `${basePrefix}index.html`;
        if (navProjects) navProjects.href = `${basePrefix}index.html#projects`;
        if (navParcours) navParcours.href = `${basePrefix}index.html#parcours`;
        if (navContact) navContact.href = `${basePrefix}index.html#contact`;
        if (navSoutenance) navSoutenance.href = `${basePrefix}soutenance.html`;
    }

    // Determine current page based on URL
    getCurrentPage() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        // Handle project pages
        if (path.includes('/projets/')) {
            return 'projects';
        }
        
        // Handle soutenance page
        if (path.includes('soutenance.html')) {
            return 'soutenance';
        }
        
        // Handle index page sections
        if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
            if (hash.includes('#projects')) return 'projects';
            if (hash.includes('#parcours')) return 'parcours';
            if (hash.includes('#contact')) return 'contact';
            return 'index';
        }
        
        return 'index';
    }

    // Set active navigation item
    setActiveNavItem() {
        const navLinks = document.querySelectorAll('nav a[data-page]');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('data-page');
            if (linkPage === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Initialize event listeners
    initializeEventListeners() {
        this.initThemeToggle();
        this.initLanguageToggle();
        this.initMobileMenu();
        this.initScrollActiveNav();
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
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}` || 
                            link.getAttribute('href') === `index.html#${sectionId}`) {
                            link.classList.add('active');
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
    new NavbarLoader();
});