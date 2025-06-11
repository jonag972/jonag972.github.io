document.addEventListener('DOMContentLoaded', function () {
    const consentCookieName = 'stats_consent';
    const bannerId = 'consent-banner-js';

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    function displayConsentBanner() {
        if (getCookie(consentCookieName)) {
            return; // L'utilisateur a déjà fait un choix
        }

        const bannerHTML = `
            <div id="${bannerId}" class="consent-banner">
                <div class="consent-content">
                    <h3>
                        <span class="lang-fr">Respect de votre vie privée</span>
                        <span class="lang-en">Privacy Notice</span>
                    </h3>
                    <p>
                        <span class="lang-fr">Ce site utilise des cookies pour collecter des statistiques de visite anonymes. Ces données m'aident à améliorer le site mais ne sont pas obligatoires.</span>
                        <span class="lang-en">This site uses cookies to collect anonymous visit statistics. This data helps me improve the site but is not mandatory.</span>
                    </p>
                    <div class="consent-buttons">
                        <button type="button" class="btn accept" data-action="accept">
                            <span class="lang-fr">Accepter</span>
                            <span class="lang-en">Accept</span>
                        </button>
                        <button type="button" class="btn decline" data-action="decline">
                            <span class="lang-fr">Refuser</span>
                            <span class="lang-en">Decline</span>
                        </button>
                        <a href="privacy-policy.html" class="privacy-link">
                            <span class="lang-fr">Politique de confidentialité</span>
                            <span class="lang-en">Privacy Policy</span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', bannerHTML);
        addBannerEventListeners();
        // Appliquer la langue actuelle à la bannière
        if (window.updateTextContent && typeof window.currentLang === 'string') {
            window.updateTextContent(document.getElementById(bannerId), window.currentLang);
        }
    }

    function addBannerEventListeners() {
        const banner = document.getElementById(bannerId);
        if (!banner) return;

        banner.addEventListener('click', function (event) {
            const target = event.target.closest('button[data-action]');
            if (target) {
                const action = target.dataset.action;
                if (action === 'accept') {
                    setCookie(consentCookieName, 'accepted', 30);
                    console.log("Consentement accepté pour les statistiques.");
                    // Ici, vous pourriez initialiser votre script de statistiques si l'utilisateur accepte
                    // if (typeof initializeStats === 'function') { initializeStats(); }
                } else if (action === 'decline') {
                    setCookie(consentCookieName, 'declined', 30);
                    console.log("Consentement refusé pour les statistiques.");
                }
                banner.style.display = 'none';
            }
        });
    }

    // Afficher la bannière
    displayConsentBanner();

    // Exposer une fonction pour vérifier le consentement si nécessaire par d'autres scripts
    window.hasConsentForStats = function() {
        return getCookie(consentCookieName) === 'accepted';
    };

    // Ajouter les styles CSS pour la bannière (similaires à ceux dans consent-manager.php)
    const style = document.createElement('style');
    style.textContent = `
        .consent-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: var(--background-alt, #f5f5f5);
            color: var(--text-color, #333); /* Ajout d'une couleur de texte par défaut */
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            padding: 15px;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif; /* Assurer la cohérence de la police */
        }
        .consent-banner .consent-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .consent-banner .consent-content h3 {
            margin: 0;
            color: var(--primary-color, #333);
            font-size: 1.1em; /* Ajustement taille */
        }
        .consent-banner .consent-content p {
            margin: 5px 0;
            font-size: 0.9em; /* Ajustement taille */
        }
        .consent-banner .consent-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }
        .consent-banner .consent-buttons .btn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            font-family: 'Poppins', sans-serif;
        }
        .consent-banner .consent-buttons .accept {
            background-color: var(--primary-color, #4caf50);
            color: white;
        }
        .consent-banner .consent-buttons .decline {
            background-color: var(--text-muted, #999);
            color: white;
        }
        .consent-banner .privacy-link {
            color: var(--primary-color, #333);
            text-decoration: underline;
            margin-left: 10px;
            font-size: 0.9em;
        }
        @media (max-width: 768px) {
            .consent-banner .consent-buttons {
                flex-direction: column;
                align-items: flex-start;
            }
            .consent-banner .privacy-link {
                margin-left: 0;
                margin-top: 10px;
            }
        }
    `;
    document.head.appendChild(style);
});

// Fonction globale pour vérifier le consentement (peut être appelée par d'autres scripts)
// Assurez-vous que cela ne cause pas d'erreur si le cookie n'est pas encore défini.
function getGlobalStatsConsent() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; stats_consent=`);
    if (parts.length === 2) return parts.pop().split(';').shift() === 'accepted';
    return false; // Par défaut, si pas de cookie ou pas accepté, retourne false.
}
