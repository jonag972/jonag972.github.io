/**
 * Enhanced Dynamic Project Loader System
 * Loads projects from JSON files with robust error handling and caching
 */

class ProjectLoader {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
        this.performanceMetrics = {
            startTime: null,
            loadTime: null,
            projectCount: 0
        };
    }

    // Main function to load and display projects
    async loadProjects() {
        try {
            console.log("Starting project loading...");
            this.showLoadingState();
            
            const projectsList = await this.fetchProjectsList();
            if (!projectsList || !projectsList.projects) {
                throw new Error('Invalid projects list structure');
            }
            
            const projectsData = await this.loadProjectsData(projectsList.projects);
            await this.generateProjectCards(projectsData);
            
            console.log(`Successfully loaded ${projectsData.length} projects`);
            
        } catch (error) {
            console.error('Failed to load projects:', error);
            await this.handleLoadingError(error);
        }
    }

    // Fetch the master projects list with caching and retry logic
    async fetchProjectsList() {
        const cacheKey = 'projects-list';
        
        // Check cache first
        if (this.isCacheValid(cacheKey)) {
            console.log('Using cached projects list');
            return this.cache.get(cacheKey).data;
        }
        
        // Fetch with retry logic
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch('assets/projects/projects-list.json');
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const projectsList = await response.json();
                
                // Validate structure
                if (!this.validateProjectsList(projectsList)) {
                    throw new Error('Invalid projects list structure');
                }
                
                // Cache the result
                this.cache.set(cacheKey, {
                    data: projectsList,
                    timestamp: Date.now()
                });
                
                return projectsList;
                
            } catch (error) {
                console.warn(`Attempt ${attempt} failed:`, error.message);
                
                if (attempt === this.retryAttempts) {
                    throw error;
                }
                
                await this.delay(this.retryDelay * attempt);
            }
        }
    }

    // Load individual project data files
    async loadProjectsData(projectInfos) {
        const projectsData = [];
        
        // Filter enabled projects and sort by priority
        const enabledProjects = projectInfos
            .filter(project => project.enabled !== false)
            .sort((a, b) => (a.priority || 999) - (b.priority || 999));
        
        // Load projects in parallel with error handling
        const loadPromises = enabledProjects.map(async (projectInfo) => {
            try {
                const projectData = await this.fetchProjectData(projectInfo);
                if (projectData && this.validateProjectData(projectData)) {
                    return projectData;
                }
            } catch (error) {
                console.error(`Failed to load project ${projectInfo.id}:`, error);
                return null;
            }
        });
        
        const results = await Promise.allSettled(loadPromises);
        
        // Collect successful results
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                projectsData.push(result.value);
            }
        });
        
        return projectsData;
    }

    // Fetch individual project data with caching
    async fetchProjectData(projectInfo) {
        const cacheKey = `project-${projectInfo.id}`;
        
        // Check cache first
        if (this.isCacheValid(cacheKey)) {
            console.log(`Using cached data for project ${projectInfo.id}`);
            return this.cache.get(cacheKey).data;
        }
        
        const projectPath = projectInfo.path || `${projectInfo.id}/${projectInfo.id}.json`;
        const response = await fetch(`assets/projects/${projectPath}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const projectData = await response.json();
        
        // Ensure ID is set
        projectData.id = projectInfo.id || projectData.id;
        
        // Cache the result
        this.cache.set(cacheKey, {
            data: projectData,
            timestamp: Date.now()
        });
        
        return projectData;
    }

    // Utility methods for caching and validation
    isCacheValid(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        
        const now = Date.now();
        return (now - cached.timestamp) < this.cacheExpiry;
    }

    validateProjectsList(projectsList) {
        return projectsList && 
               Array.isArray(projectsList.projects) && 
               projectsList.projects.length > 0;
    }

    validateProjectData(projectData) {
        return projectData && 
               projectData.id && 
               projectData.title && 
               projectData.shortDescription && 
               Array.isArray(projectData.tags) && 
               Array.isArray(projectData.images);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Show loading state in the projects grid
    showLoadingState() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div class="loading-projects">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>
                        <span class="lang-fr">Chargement des projets...</span>
                        <span class="lang-en">Loading projects...</span>
                    </p>
                </div>
            `;
        }
    }

    // Handle loading errors with fallback
    async handleLoadingError(error) {
        console.error('Project loading failed:', error);
        
        // Try fallback loading
        try {
            await this.loadFallbackProjects();
        } catch (fallbackError) {
            console.error('Fallback loading also failed:', fallbackError);
            this.showErrorState(error);
        }
    }

    // Load projects using fallback method
    async loadFallbackProjects() {
        console.log("Attempting fallback project loading");
        
        const knownProjects = ['medicsearch'];
        const projectsData = [];
        
        for (const projectId of knownProjects) {
            try {
                const response = await fetch(`assets/projects/${projectId}/${projectId}.json`);
                if (response.ok) {
                    const projectData = await response.json();
                    projectData.id = projectId;
                    
                    if (this.validateProjectData(projectData)) {
                        projectsData.push(projectData);
                        console.log(`Fallback project ${projectId} loaded successfully`);
                    }
                }
            } catch (error) {
                console.error(`Failed to load fallback project ${projectId}:`, error);
            }
        }
        
        await this.generateProjectCards(projectsData);
    }

    // Show error state in the projects grid
    showErrorState(error) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            // Determine error message based on error type
            let errorMessage = {
                fr: 'Erreur lors du chargement des projets',
                en: 'Error loading projects'
            };

            if (error.message.includes('Network')) {
                errorMessage = {
                    fr: 'Problème de connexion réseau',
                    en: 'Network connection problem'
                };
            } else if (error.message.includes('not found')) {
                errorMessage = {
                    fr: 'Fichiers de projets introuvables',
                    en: 'Project files not found'
                };
            }

            projectsGrid.innerHTML = `
                <div class="error-projects">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>
                        <span class="lang-fr">${errorMessage.fr}</span>
                        <span class="lang-en">${errorMessage.en}</span>
                    </p>
                    <button onclick="projectLoader.loadProjects()" class="retry-btn">
                        <span class="lang-fr">Réessayer</span>
                        <span class="lang-en">Retry</span>
                    </button>
                </div>
            `;
            
            // Update language display for error state
            this.updateLanguageDisplay();
        }
    }

    // Show partial loading state when some projects fail
    showPartialErrorState(successCount, totalCount) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid && successCount < totalCount) {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'partial-error-warning';
            warningDiv.innerHTML = `
                <div class="warning-projects">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>
                        <span class="lang-fr">Certains projets n'ont pas pu être chargés (${successCount}/${totalCount} chargés)</span>
                        <span class="lang-en">Some projects could not be loaded (${successCount}/${totalCount} loaded)</span>
                    </p>
                </div>
            `;
            projectsGrid.insertBefore(warningDiv, projectsGrid.firstChild);
            this.updateLanguageDisplay();
        }
    }

    // Generate project cards from loaded data
    async generateProjectCards(projectsData) {
        console.log("Generating project cards with data:", projectsData);
        
        const projectsGrid = document.querySelector('.projects-grid');
        
        if (!projectsGrid) {
            console.error("Projects container not found");
            return;
        }
        
        // Clear existing content
        projectsGrid.innerHTML = '';
        
        // Check if projects were found
        if (!projectsData || projectsData.length === 0) {
            projectsGrid.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>
                        <span class="lang-fr">Aucun projet n'a été trouvé</span>
                        <span class="lang-en">No projects found</span>
                    </p>
                </div>
            `;
            return;
        }
        
        // Generate cards for each project
        for (const project of projectsData) {
            const projectCard = this.createProjectCard(project);
            projectsGrid.appendChild(projectCard);
            console.log(`Card added for project: ${project.title}`);
        }
        
        // Update language display
        this.updateLanguageDisplay();
    }

    // Create individual project card element
    createProjectCard(project) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // Add mobile-friendly attributes
        projectCard.setAttribute('role', 'article');
        projectCard.setAttribute('aria-label', project.title || 'Project');
        
        // Determine image to use
        const imageUrl = project.images && project.images.length > 0 
            ? project.images[0].src 
            : 'assets/img/default_project_image.png';
        
        const imageAlt = project.images && project.images.length > 0 
            ? project.images[0].alt 
            : project.title || 'Project image';
        
        const imageAltEn = project.images && project.images.length > 0 && project.images[0].altEn
            ? project.images[0].altEn
            : imageAlt;
        
        // Build tags HTML
        const tagsHtml = (project.tags || [])
            .map(tag => `<span class="project-tag">${this.escapeHtml(tag)}</span>`)
            .join('');
        
        // Determine project links
        const detailLink = project.links && project.links.detail 
            ? project.links.detail 
            : `project-detail.html?project=${project.id}`;
        
        const githubLink = project.links && project.links.github 
            ? `<a href="${this.escapeHtml(project.links.github)}" target="_blank" class="project-link" rel="noopener noreferrer">
                <i class="fab fa-github"></i> 
                <span class="lang-fr">Code source</span>
                <span class="lang-en">Source code</span>
               </a>`
            : '';
        
        // Build card HTML with mobile optimizations
        projectCard.innerHTML = `
            <img src="${this.escapeHtml(imageUrl)}" 
                 alt="${this.escapeHtml(imageAlt)}" 
                 class="project-image" 
                 loading="lazy"
                 decoding="async"
                 onerror="this.src='assets/img/default_project_image.png'; this.onerror=null;">
            <div class="project-content">
                <div class="project-tags">
                    ${tagsHtml}
                </div>
                <h3 class="project-title">
                    <span class="lang-fr">${this.escapeHtml(project.title || '')}</span>
                    <span class="lang-en">${this.escapeHtml(project.titleEn || project.title || '')}</span>
                </h3>
                <p class="project-description">
                    <span class="lang-fr">${this.escapeHtml(project.shortDescription || '')}</span>
                    <span class="lang-en">${this.escapeHtml(project.shortDescriptionEn || project.shortDescription || '')}</span>
                </p>
                <div class="project-links">
                    <a href="${this.escapeHtml(detailLink)}" class="project-link" aria-label="View ${this.escapeHtml(project.title)} details">
                        <i class="fas fa-external-link-alt"></i> 
                        <span class="lang-fr">Voir le projet</span>
                        <span class="lang-en">View project</span>
                    </a>
                    ${githubLink}
                </div>
            </div>
        `;
        
        return projectCard;
    }

    // Update language display for dynamically generated content
    updateLanguageDisplay() {
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

    // Listen for language change events
    setupLanguageListener() {
        // Listen for storage changes (language switching)
        window.addEventListener('storage', (e) => {
            if (e.key === 'language') {
                this.updateLanguageDisplay();
            }
        });

        // Listen for custom language change events
        document.addEventListener('languageChanged', () => {
            this.updateLanguageDisplay();
        });
    }

    // Utility function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global instance
let projectLoader;

// Initialize project loader when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing project loader");
    projectLoader = new ProjectLoader();
    projectLoader.setupLanguageListener();
    projectLoader.loadProjects();
});