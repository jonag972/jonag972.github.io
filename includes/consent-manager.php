<?php
/**
 * Gestionnaire de consentement RGPD
 * Permet aux utilisateurs d'accepter ou refuser le suivi des statistiques
 * Utilise principalement des cookies pour la persistance
 */

// Traitement des actions de consentement
if (isset($_POST['consent_action'])) {
    if ($_POST['consent_action'] === 'accept') {
        // Définir un cookie avec une durée de vie de 30 jours
        setcookie('stats_consent', 'accepted', time() + 60*60*24*30, '/', '', false, true);
        
        // Démarrer une session si nécessaire (pour une compatibilité avec le reste du code)
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['stats_accepted'] = true;
        
        // Redirection vers la page actuelle sans les paramètres POST
        header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
        exit;
    } elseif ($_POST['consent_action'] === 'decline') {
        // Définir un cookie avec une durée de vie de 30 jours
        setcookie('stats_consent', 'declined', time() + 60*60*24*30, '/', '', false, true);
        
        // Démarrer une session si nécessaire (pour une compatibilité avec le reste du code)
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['stats_accepted'] = false;
        
        // Redirection vers la page actuelle sans les paramètres POST
        header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
        exit;
    }
}

/**
 * Fonction pour vérifier si l'utilisateur a accepté le suivi des statistiques
 * @return bool|null true si accepté, false si refusé, null si pas encore décidé
 */
function getConsentStatus() {
    // Priorité au cookie car il est plus persistant
    if (isset($_COOKIE['stats_consent'])) {
        return $_COOKIE['stats_consent'] === 'accepted';
    }
    
    // Vérifier ensuite dans la session (compatibilité avec l'ancien système)
    if (session_status() == PHP_SESSION_NONE) {
        @session_start(); // Utilisation de @ pour éviter les erreurs si les headers sont déjà envoyés
    }
    
    if (isset($_SESSION['stats_accepted'])) {
        return $_SESSION['stats_accepted'];
    }
    
    // Aucune décision n'a encore été prise
    return null;
}

/**
 * Fonction pour générer la bannière de consentement RGPD
 * À appeler dans le footer des pages
 */
function displayConsentBanner() {
    // Vérifier si l'utilisateur a déjà fait son choix
    $consentStatus = getConsentStatus();
    
    // Ne pas afficher la bannière si l'utilisateur a déjà fait son choix
    if ($consentStatus !== null) {
        return '';
    }
    
    // HTML pour la bannière de consentement
    $html = <<<HTML
    <div id="consent-banner" class="consent-banner">
        <div class="consent-content">
            <h3>
                <span class="lang-fr">Respect de votre vie privée</span>
                <span class="lang-en">Privacy Notice</span>
            </h3>
            <p>
                <span class="lang-fr">Ce site utilise des cookies pour collecter des statistiques de visite anonymes. Ces données m'aide à améliorer le site mais ne sont pas obligatoires.</span>
                <span class="lang-en">This site uses cookies to collect anonymous visit statistics. This data helps me improve the site but is not mandatory.</span>
            </p>
            <div class="consent-buttons">
                <form method="post">
                    <input type="hidden" name="consent_action" value="accept">
                    <button type="submit" class="btn accept">
                        <span class="lang-fr">Accepter</span>
                        <span class="lang-en">Accept</span>
                    </button>
                </form>
                <form method="post">
                    <input type="hidden" name="consent_action" value="decline">
                    <button type="submit" class="btn decline">
                        <span class="lang-fr">Refuser</span>
                        <span class="lang-en">Decline</span>
                    </button>
                </form>
                <a href="privacy-policy.php" class="privacy-link">
                    <span class="lang-fr">Politique de confidentialité</span>
                    <span class="lang-en">Privacy Policy</span>
                </a>
            </div>
        </div>
    </div>
    
    <style>
        .consent-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: var(--background-alt, #f5f5f5);
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            padding: 15px;
            box-sizing: border-box;
        }
        
        .consent-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .consent-content h3 {
            margin: 0;
            color: var(--primary-color, #333);
        }
        
        .consent-content p {
            margin: 5px 0;
            color: var(--text-color, #666);
        }
        
        .consent-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .consent-buttons .btn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
        }
        
        .consent-buttons .accept {
            background-color: var(--primary-color, #4caf50);
            color: white;
        }
        
        .consent-buttons .decline {
            background-color: var(--text-muted, #999);
            color: white;
        }
        
        .privacy-link {
            color: var(--primary-color, #333);
            text-decoration: underline;
            margin-left: 10px;
        }
        
        @media (max-width: 768px) {
            .consent-buttons {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .privacy-link {
                margin-left: 0;
                margin-top: 10px;
            }
        }
    </style>
HTML;

    return $html;
}
?>