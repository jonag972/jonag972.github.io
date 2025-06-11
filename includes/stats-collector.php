<?php
/**
 * Collecteur de statistiques pour le Portfolio
 * Enregistre les visites dans un fichier JSON
 * Conforme au RGPD avec consentement explicite
 */

// Inclure le gestionnaire de consentement
include_once __DIR__ . '/consent-manager.php';

// Vérifier si l'utilisateur a accepté le suivi des statistiques
$statsAccepted = getConsentStatus();

// Si l'utilisateur a explicitement refusé ou n'a pas encore décidé, ne pas collecter de statistiques
if ($statsAccepted !== true) {
    return;
}

// Fichier pour sauvegarder les statistiques
$statsFile = __DIR__ . '/../data/stats.json';
$statsDir = __DIR__ . '/../data';

// Créer le répertoire data s'il n'existe pas
if (!file_exists($statsDir)) {
    mkdir($statsDir, 0755, true);
}

// Charger ou initialiser les statistiques
function loadStats() {
    global $statsFile;
    
    if (file_exists($statsFile)) {
        $stats = json_decode(file_get_contents($statsFile), true);
    } else {
        // Structure initiale des statistiques
        $stats = [
            'total_visits' => 0,
            'page_views' => [],
            'project_views' => [],
            'visitors' => [],
            'last_updated' => date('Y-m-d')
        ];
    }
    
    return $stats;
}

// Sauvegarder les statistiques
function saveStats($stats) {
    global $statsFile;
    file_put_contents($statsFile, json_encode($stats, JSON_PRETTY_PRINT));
}

// Collecter les informations sur la visite
function collectPageView() {
    // Si l'utilisateur n'a pas encore décidé d'accepter ou refuser les cookies
    // on ne collecte pas encore de données (conformité RGPD - consentement explicite)
    global $statsAccepted;
    if ($statsAccepted !== true) {
        return;
    }
    
    $stats = loadStats();
    $currentPage = $_SERVER['PHP_SELF'];
    $currentDate = date('Y-m-d');
    
    // Anonymiser l'adresse IP (conforme RGPD)
    $visitorIP = anonymizeIP($_SERVER['REMOTE_ADDR']);
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'direct';
    
    // Format de visite
    $visitInfo = [
        'timestamp' => date('Y-m-d H:i:s'),
        'ip_hash' => md5($visitorIP), // Stocker uniquement un hash, pas l'IP elle-même
        'device_type' => getDeviceType($userAgent),
        'referer_domain' => extractDomain($referer),
        'page' => $currentPage
    ];
    
    // Incrémenter le total des visites
    $stats['total_visits']++;
    
    // Incrémenter les vues de page
    if (!isset($stats['page_views'][$currentPage])) {
        $stats['page_views'][$currentPage] = 0;
    }
    $stats['page_views'][$currentPage]++;
    
    // Si c'est une page de projet, collecter les stats spécifiques
    if (strpos($currentPage, 'project-detail.php') !== false && isset($_GET['project'])) {
        $projectId = $_GET['project'];
        
        if (!isset($stats['project_views'][$projectId])) {
            $stats['project_views'][$projectId] = 0;
        }
        $stats['project_views'][$projectId]++;
        
        // Ajouter le projet à l'info de visite
        $visitInfo['project'] = $projectId;
    }
    
    // Ajouter la visite à l'historique (limiter à 1000 dernières visites)
    array_unshift($stats['visitors'], $visitInfo);
    if (count($stats['visitors']) > 1000) {
        array_pop($stats['visitors']);
    }
    
    // Mettre à jour la date
    $stats['last_updated'] = $currentDate;
    
    // Sauvegarder les statistiques
    saveStats($stats);
}

// Anonymiser l'adresse IP (conforme RGPD)
function anonymizeIP($ip) {
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
        return preg_replace('/\.\d+$/', '.0', $ip); // Remplace le dernier octet par 0
    } elseif (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
        return preg_replace('/:[\da-f]{4}$/i', ':0000', $ip); // Remplace le dernier groupe par 0000
    }
    return $ip;
}

// Détecter le type d'appareil
function getDeviceType($userAgent) {
    if (preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i', $userAgent)) {
        return 'mobile';
    } elseif (preg_match('/android|ipad|playbook|silk/i', $userAgent)) {
        return 'tablet';
    }
    return 'desktop';
}

// Extraire le domaine d'une URL
function extractDomain($url) {
    if (empty($url) || $url === 'direct') {
        return 'direct';
    }
    
    $parsedUrl = parse_url($url);
    
    if (isset($parsedUrl['host'])) {
        return $parsedUrl['host'];
    }
    
    return 'unknown';
}

// Collecter la statistique seulement si ce n'est pas un bot
$userAgent = $_SERVER['HTTP_USER_AGENT'];
if (!preg_match('/(bot|crawler|spider|slurp|yahoo|bing|google)/i', $userAgent)) {
    collectPageView();
}
?>