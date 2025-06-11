/**
 * Ce script permet de charger dynamiquement les projets depuis le dossier assets/projects
 * Il récupère les informations depuis les fichiers JSON et génère les cartes de projet
 */

// Fonction pour charger les projets
async function loadProjects() {
    try {
        console.log("Début du chargement des projets");
        
        // Récupérer la liste des projets
        const response = await fetch('assets/projects/projects-list.json');
        
        // Si la liste des projets n'existe pas encore, on utilise une approche alternative
        if (!response.ok) {
            console.log('Liste des projets non trouvée, tentative de chargement automatique');
            await loadProjectsFromDirectory();
            return;
        }
        
        const projectsList = await response.json();
        console.log("Liste des projets chargée:", projectsList);
        
        // Tableau pour stocker les données complètes des projets
        const projectsData = [];
        
        // Charger les détails de chaque projet
        for (const projectInfo of projectsList.projects) {
            try {
                // Utiliser le chemin complet du projet ou construire le chemin par défaut
                const projectPath = projectInfo.path || `${projectInfo.id}/${projectInfo.id}.json`;
                const projectResponse = await fetch(`assets/projects/${projectPath}`);
                
                if (projectResponse.ok) {
                    const projectData = await projectResponse.json();
                    // Ajouter l'ID au projectData s'il n'existe pas déjà
                    projectData.id = projectInfo.id || projectData.id;
                    projectsData.push(projectData);
                    console.log(`Projet ${projectInfo.id} chargé avec succès:`, projectData);
                } else {
                    console.error(`Erreur lors du chargement du projet ${projectInfo.id}: fichier introuvable`);
                }
            } catch (error) {
                console.error(`Erreur lors du chargement du projet ${projectInfo.id}:`, error);
            }
        }
        
        // Générer les cartes de projet
        await generateProjectCards(projectsData);
        
    } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        // En cas d'erreur, on essaie de charger uniquement les projets connus
        await loadFallbackProjects();
    }
}

// Fonction pour charger les projets en fallback (si la méthode principale échoue)
async function loadFallbackProjects() {
    console.log("Tentative de chargement avec méthode fallback");
    
    // Liste des projets connus (hardcodée en cas d'échec)
    const knownProjects = ['medicsearch'];
    
    // Tableau pour stocker les données de projets
    const projectsData = [];
    
    // Charger les données de chaque projet connu
    for (const projectId of knownProjects) {
        try {
            const response = await fetch(`assets/projects/${projectId}/${projectId}.json`);
            if (response.ok) {
                const projectData = await response.json();
                projectData.id = projectId;  // Ajouter l'ID
                projectsData.push(projectData);
                console.log(`Projet fallback ${projectId} chargé avec succès:`, projectData);
            } else {
                console.error(`Erreur lors du chargement du projet fallback ${projectId}: fichier introuvable`);
            }
        } catch (error) {
            console.error(`Erreur lors du chargement du projet fallback ${projectId}:`, error);
        }
    }
    
    // Générer les cartes de projet
    await generateProjectCards(projectsData);
}

// Approche alternative: tenter de découvrir automatiquement les projets dans le dossier
async function loadProjectsFromDirectory() {
    console.log("Tentative de chargement automatique des projets");
    
    // Dans un environnement purement statique, cette approche ne peut pas fonctionner
    // Le navigateur ne peut pas lister les répertoires
    // On passe directement à la méthode de fallback
    await loadFallbackProjects();
}

// Fonction pour générer les cartes de projet
async function generateProjectCards(projectsData) {
    console.log("Génération des cartes de projet avec données:", projectsData);
    
    const projectsGrid = document.querySelector('.projects-grid');
    
    // Si le conteneur n'existe pas, on quitte la fonction
    if (!projectsGrid) {
        console.error("Conteneur de projets non trouvé");
        return;
    }
    
    // Vider le conteneur (si on remplace le contenu existant)
    projectsGrid.innerHTML = '';
    
    // Vérifier si des projets ont été trouvés
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
    
    // Ajouter chaque projet
    for (const project of projectsData) {
        // Créer la carte de projet
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // Déterminer l'image à utiliser (première du tableau ou image par défaut)
        const imageUrl = project.images && project.images.length > 0 
            ? project.images[0].src 
            : 'assets/img/default_project_image.png';
        
        const imageAlt = project.images && project.images.length > 0 
            ? project.images[0].alt 
            : project.title || 'Image du projet';
        
        // Construire les tags HTML
        const tagsHtml = (project.tags || [])
            .map(tag => `<span class="project-tag">${tag}</span>`)
            .join('');
        
        // Récupérer l'ID du projet
        const projectId = project.id || getProjectIdFromTitle(project.title);
        
        // Construire l'HTML de la carte
        projectCard.innerHTML = `
            <img src="${imageUrl}" alt="${imageAlt}" class="project-image" onerror="this.src='assets/img/default_project_image.png'; this.onerror=null;">
            <div class="project-content">
                <div class="project-tags">
                    ${tagsHtml}
                </div>
                <h3 class="project-title">
                    <span class="lang-fr">${project.title || ''}</span>
                    <span class="lang-en">${project.titleEn || project.title || ''}</span>
                </h3>
                <p class="project-description">
                    <span class="lang-fr">${project.shortDescription || ''}</span>
                    <span class="lang-en">${project.shortDescriptionEn || project.shortDescription || ''}</span>
                </p>
                <div class="project-links">
                    <a href="project-detail.html?project=${projectId}" class="project-link">
                        <i class="fas fa-external-link-alt"></i> 
                        <span class="lang-fr">Voir le projet</span>
                        <span class="lang-en">View project</span>
                    </a>
                    ${project.githubUrl ? `
                    <a href="${project.githubUrl}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i> 
                        <span class="lang-fr">Code source</span>
                        <span class="lang-en">Source code</span>
                    </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Ajouter la carte au conteneur
        projectsGrid.appendChild(projectCard);
        console.log(`Carte ajoutée pour le projet: ${project.title}`);
    }
    
    // Mettre à jour l'affichage des langues
    updateLanguageDisplay();
}

// Fonction pour extraire un ID de projet à partir d'un titre
function getProjectIdFromTitle(title) {
    if (!title) return 'project';
    
    // Convertir en minuscules, remplacer les espaces par des tirets et supprimer les caractères spéciaux
    return title.toLowerCase()
        .replace(/\s+/g, '-')           // Remplacer les espaces par des tirets
        .replace(/[^\w\-]/g, '')        // Supprimer les caractères non alphanumériques (sauf tirets)
        .replace(/\-+/g, '-');          // Remplacer les séquences de tirets par un seul tiret
}

// Fonction pour mettre à jour l'affichage des langues
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

// Attendre que le DOM soit chargé puis charger les projets
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé, démarrage du chargement des projets");
    loadProjects();
});