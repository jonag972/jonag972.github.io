/**
 * Dynamic Project Detail Loader
 * Loads project data from JSON files and populates the project detail page
 */

class DynamicProjectDetail {
    constructor() {
        this.projectId = null;
        this.projectData = null;
        this.swiper = null;
    }

    // Initialize the dynamic project detail system
    async init() {
        try {
            // Get project ID from URL parameters
            this.projectId = this.getProjectIdFromUrl();
            
            if (!this.projectId) {
                throw new Error('No project ID specified in URL');
            }

            console.log(`Loading project: ${this.projectId}`);
            
            // Load project data
            await this.loadProjectData();
            
            // Populate the page with project data
            await this.populateProjectPage();
            
            // Initialize interactive components
            this.initializeComponents();
            
            console.log('Project detail page loaded successfully');
            
        } catch (error) {
            console.error('Failed to load project detail:', error);
            this.showError(error.message);
        }
    }

    // Extract project ID from URL parameters
    getProjectIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('project');
    }

    // Load project data from JSON file
    async loadProjectData() {
        try {
            const response = await fetch(`assets/projects/${this.projectId}/${this.projectId}.json`);
            
            if (!response.ok) {
                throw new Error(`Project not found: ${this.projectId}`);
            }
            
            this.projectData = await response.json();
            
            // Validate project data
            if (!this.validateProjectData(this.projectData)) {
                throw new Error('Invalid project data structure');
            }
            
        } catch (error) {
            throw new Error(`Failed to load project data: ${error.message}`);
        }
    }

    // Validate project data structure
    validateProjectData(data) {
        return data && 
               data.id && 
               data.title && 
               data.shortDescription && 
               Array.isArray(data.tags) && 
               Array.isArray(data.images) &&
               data.metadata;
    }

    // Populate the project detail page with data
    async populateProjectPage() {
        // Hide loading state
        document.getElementById('project-loading').style.display = 'none';
        
        // Show project content
        document.getElementById('project-content').style.display = 'block';
        
        // Update page title
        this.updatePageTitle();
        
        // Populate header
        this.populateHeader();
        
        // Populate image carousel
        this.populateImageCarousel();
        
        // Populate metadata
        this.populateMetadata();
        
        // Populate tags
        this.populateTags();
        
        // Populate content sections
        this.populateContentSections();
        
        // Update language display
        this.updateLanguageDisplay();
    }

    // Update page title
    updatePageTitle() {
        const titleElement = document.querySelector('title');
        const currentLang = localStorage.getItem('language') || 'fr';
        const projectTitle = currentLang === 'en' && this.projectData.titleEn 
            ? this.projectData.titleEn 
            : this.projectData.title;
        
        if (currentLang === 'fr') {
            titleElement.textContent = `${projectTitle} - Mon Portfolio`;
        } else {
            titleElement.textContent = `${projectTitle} - My Portfolio`;
        }
    }

    // Populate project header
    populateHeader() {
        const titleElement = document.getElementById('project-title');
        const descriptionElement = document.getElementById('project-description');
        
        // Set title
        titleElement.querySelector('.lang-fr').textContent = this.projectData.title;
        titleElement.querySelector('.lang-en').textContent = this.projectData.titleEn || this.projectData.title;
        
        // Set description
        descriptionElement.querySelector('.lang-fr').textContent = this.projectData.shortDescription;
        descriptionElement.querySelector('.lang-en').textContent = this.projectData.shortDescriptionEn || this.projectData.shortDescription;
    }

    // Populate image carousel
    populateImageCarousel() {
        const carouselWrapper = document.getElementById('carousel-wrapper');
        carouselWrapper.innerHTML = '';
        
        if (this.projectData.images && this.projectData.images.length > 0) {
            this.projectData.images.forEach(image => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `<img src="${this.escapeHtml(image.src)}" alt="${this.escapeHtml(image.alt)}">`;
                carouselWrapper.appendChild(slide);
            });
        } else {
            // Add default image if no images available
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `<img src="assets/img/default_project_image.png" alt="Project Image">`;
            carouselWrapper.appendChild(slide);
        }
    }

    // Populate project metadata
    populateMetadata() {
        const metadataContainer = document.getElementById('project-metadata');
        metadataContainer.innerHTML = '';
        
        const metadata = this.projectData.metadata;
        
        // Period
        if (metadata.period) {
            const periodItem = this.createMetadataItem('fas fa-calendar-alt', 'Période', 'Period', metadata.period, metadata.periodEn);
            metadataContainer.appendChild(periodItem);
        }
        
        // Duration
        if (metadata.duration) {
            const durationItem = this.createMetadataItem('fas fa-clock', 'Durée', 'Duration', metadata.duration, metadata.durationEn);
            metadataContainer.appendChild(durationItem);
        }
        
        // Location
        if (metadata.location) {
            const locationItem = this.createMetadataItem('fas fa-map-marker-alt', 'Lieu', 'Location', metadata.location, metadata.locationEn);
            metadataContainer.appendChild(locationItem);
        }
    }

    // Create metadata item element
    createMetadataItem(iconClass, labelFr, labelEn, valueFr, valueEn) {
        const item = document.createElement('div');
        item.className = 'project-detail-item';
        item.innerHTML = `
            <span class="detail-icon"><i class="${iconClass}"></i></span>
            <div class="detail-content">
                <h4>
                    <span class="lang-fr">${labelFr}</span>
                    <span class="lang-en">${labelEn}</span>
                </h4>
                <p>
                    <span class="lang-fr">${this.escapeHtml(valueFr)}</span>
                    <span class="lang-en">${this.escapeHtml(valueEn || valueFr)}</span>
                </p>
            </div>
        `;
        return item;
    }

    // Populate project tags
    populateTags() {
        const tagsContainer = document.getElementById('project-tags');
        tagsContainer.innerHTML = '';
        
        if (this.projectData.tags && this.projectData.tags.length > 0) {
            this.projectData.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'project-tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
    }

    // Populate content sections
    populateContentSections() {
        const sectionsContainer = document.getElementById('project-sections');
        sectionsContainer.innerHTML = '';
        
        if (this.projectData.content && this.projectData.content.sections) {
            this.projectData.content.sections.forEach(section => {
                const sectionElement = document.createElement('div');
                sectionElement.className = 'content-section';
                
                // Create section title
                const titleElement = document.createElement('h2');
                titleElement.innerHTML = `
                    <span class="lang-fr">${this.escapeHtml(section.title)}</span>
                    <span class="lang-en">${this.escapeHtml(section.titleEn || section.title)}</span>
                `;
                sectionElement.appendChild(titleElement);
                
                // Create section content
                const contentElement = document.createElement('div');
                contentElement.innerHTML = `
                    <div class="lang-fr">${section.content}</div>
                    <div class="lang-en">${section.contentEn || section.content}</div>
                `;
                sectionElement.appendChild(contentElement);
                
                sectionsContainer.appendChild(sectionElement);
            });
        }
    }

    // Initialize interactive components
    initializeComponents() {
        // Initialize the ProjectDetailInteractive class
        if (typeof ProjectDetailInteractive !== 'undefined') {
            window.projectDetailInteractive = new ProjectDetailInteractive();
            window.projectDetailInteractive.init();
        }
    }

    // Update language display
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
        
        // Update page title when language changes
        this.updatePageTitle();
    }

    // Setup language change listeners
    setupLanguageListener() {
        // Listen for custom language change events
        document.addEventListener('languageChanged', () => {
            this.updateLanguageDisplay();
        });

        // Listen for storage changes (language switching from other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'language') {
                this.updateLanguageDisplay();
            }
        });
    }

    // Show error state
    showError(message) {
        document.getElementById('project-loading').style.display = 'none';
        document.getElementById('project-content').style.display = 'none';
        document.getElementById('project-error').style.display = 'flex';
        
        console.error('Project detail error:', message);
    }

    // Utility function to escape HTML
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const projectDetail = new DynamicProjectDetail();
    projectDetail.setupLanguageListener();
    projectDetail.init();
});