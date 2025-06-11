<?php
// Protection par mot de passe simple (à améliorer en production)
$password = "Gromat97200!"; // Mot de passe personnalisé

session_start();

// Vérification de l'authentification
if (!isset($_SESSION['admin_logged_in'])) {
    if (isset($_POST['password']) && $_POST['password'] === $password) {
        $_SESSION['admin_logged_in'] = true;
    } else {
        // Afficher le formulaire de connexion
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <title>Connexion - Statistiques</title>
            <link rel="stylesheet" href="../assets/css/styles.css">
            <style>
                .login-container {
                    max-width: 400px;
                    margin: 100px auto;
                    padding: 20px;
                    background-color: var(--background-alt);
                    border-radius: 8px;
                    box-shadow: var(--shadow);
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                }
                .form-group input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                }
                .btn-submit {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h2>Statistiques Portfolio</h2>
                <form method="post">
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" name="password" required>
                    </div>
                    <button type="submit" class="btn-submit">Connexion</button>
                </form>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
}

// Charger les statistiques
$statsFile = __DIR__ . '/../data/stats.json';
if (!file_exists($statsFile)) {
    die("Fichier de statistiques introuvable. Veuillez attendre que des visites soient enregistrées.");
}

$stats = json_decode(file_get_contents($statsFile), true);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Tableau de bord - Statistiques</title>
    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .stats-container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
        }
        .stats-card {
            background-color: var(--background-alt);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 20px;
            margin-bottom: 20px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .stat-box {
            background-color: var(--background);
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            box-shadow: var(--shadow-sm);
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
        }
        .stat-label {
            color: var(--text-muted);
            margin-top: 5px;
        }
        .visits-table {
            width: 100%;
            border-collapse: collapse;
        }
        .visits-table th, .visits-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        .visits-table th {
            background-color: var(--background);
        }
        .chart-container {
            height: 300px;
            margin-bottom: 20px;
        }
        .flex-row {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .flex-col {
            flex: 1;
            min-width: 300px;
        }
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: var(--primary-color);
            text-decoration: none;
        }
        .back-link:hover {
            text-decoration: underline;
        }
        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            .flex-row {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="stats-container">
        <a href="../index.php" class="back-link"><i class="fas fa-arrow-left"></i> Retour au site</a>
        
        <h1><i class="fas fa-chart-line"></i> Statistiques du Portfolio</h1>
        <p>Dernière mise à jour: <?php echo $stats['last_updated']; ?></p>
        
        <!-- Compteurs principaux -->
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-number"><?php echo $stats['total_visits']; ?></div>
                <div class="stat-label">Visites totales</div>
            </div>
            
            <div class="stat-box">
                <div class="stat-number"><?php echo count($stats['page_views']); ?></div>
                <div class="stat-label">Pages visitées</div>
            </div>
            
            <div class="stat-box">
                <div class="stat-number"><?php echo count($stats['project_views']); ?></div>
                <div class="stat-label">Projets consultés</div>
            </div>
            
            <div class="stat-box">
                <div class="stat-number"><?php echo count($stats['visitors']); ?></div>
                <div class="stat-label">Visites récentes</div>
            </div>
        </div>
        
        <!-- Graphiques et tableaux -->
        <div class="flex-row">
            <!-- Visites par projet -->
            <div class="flex-col">
                <div class="stats-card">
                    <h2>Projets populaires</h2>
                    <?php if (empty($stats['project_views'])): ?>
                        <p>Aucune visite de projet enregistrée pour le moment.</p>
                    <?php else: ?>
                        <div class="chart-container">
                            <canvas id="projectsChart"></canvas>
                        </div>
                        <table class="visits-table">
                            <thead>
                                <tr>
                                    <th>Projet</th>
                                    <th>Vues</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php 
                                // Trier les projets par nombre de vues (décroissant)
                                arsort($stats['project_views']);
                                foreach ($stats['project_views'] as $project => $views): 
                                ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($project); ?></td>
                                    <td><?php echo $views; ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Visites par page -->
            <div class="flex-col">
                <div class="stats-card">
                    <h2>Pages populaires</h2>
                    <?php if (empty($stats['page_views'])): ?>
                        <p>Aucune visite de page enregistrée pour le moment.</p>
                    <?php else: ?>
                        <div class="chart-container">
                            <canvas id="pagesChart"></canvas>
                        </div>
                        <table class="visits-table">
                            <thead>
                                <tr>
                                    <th>Page</th>
                                    <th>Vues</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php 
                                // Trier les pages par nombre de vues (décroissant)
                                arsort($stats['page_views']);
                                foreach ($stats['page_views'] as $page => $views): 
                                ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($page); ?></td>
                                    <td><?php echo $views; ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <!-- Appareils -->
        <div class="stats-card">
            <h2>Types d'appareils</h2>
            <div class="chart-container" style="height: 250px;">
                <canvas id="devicesChart"></canvas>
            </div>
        </div>
        
        <!-- Dernières visites -->
        <div class="stats-card">
            <h2>Dernières visites</h2>
            <?php if (empty($stats['visitors'])): ?>
                <p>Aucune visite enregistrée pour le moment.</p>
            <?php else: ?>
                <table class="visits-table">
                    <thead>
                        <tr>
                            <th>Date et heure</th>
                            <th>Page</th>
                            <th>Projet</th>
                            <th>Appareil</th>
                            <th>Référent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        // Limiter à 25 visites pour ne pas surcharger la page
                        $visitsToShow = array_slice($stats['visitors'], 0, 25);
                        foreach ($visitsToShow as $visit): 
                        ?>
                        <tr>
                            <td><?php echo htmlspecialchars($visit['timestamp']); ?></td>
                            <td><?php echo htmlspecialchars($visit['page']); ?></td>
                            <td><?php echo isset($visit['project']) ? htmlspecialchars($visit['project']) : '-'; ?></td>
                            <td><?php echo htmlspecialchars($visit['device_type']); ?></td>
                            <td><?php echo htmlspecialchars($visit['referer_domain']); ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>
    
    <script>
    // Préparation des données pour les graphiques
    document.addEventListener('DOMContentLoaded', function() {
        // Données pour le graphique des projets
        <?php if (!empty($stats['project_views'])): ?>
        var projectsCtx = document.getElementById('projectsChart').getContext('2d');
        var projectsChart = new Chart(projectsCtx, {
            type: 'bar',
            data: {
                labels: [<?php 
                    // Limiter aux 10 projets les plus visités
                    $projectLabels = array_keys(array_slice($stats['project_views'], 0, 10, true));
                    echo "'" . implode("', '", array_map('addslashes', $projectLabels)) . "'";
                ?>],
                datasets: [{
                    label: 'Nombre de vues',
                    data: [<?php 
                        // Valeurs correspondant aux labels ci-dessus
                        $projectValues = array_values(array_slice($stats['project_views'], 0, 10, true));
                        echo implode(", ", $projectValues);
                    ?>],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
        <?php endif; ?>
        
        // Données pour le graphique des pages
        <?php if (!empty($stats['page_views'])): ?>
        var pagesCtx = document.getElementById('pagesChart').getContext('2d');
        var pagesChart = new Chart(pagesCtx, {
            type: 'bar',
            data: {
                labels: [<?php 
                    // Limiter aux 10 pages les plus visitées
                    $pageLabels = array_keys(array_slice($stats['page_views'], 0, 10, true));
                    echo "'" . implode("', '", array_map('addslashes', $pageLabels)) . "'";
                ?>],
                datasets: [{
                    label: 'Nombre de vues',
                    data: [<?php 
                        // Valeurs correspondant aux labels ci-dessus
                        $pageValues = array_values(array_slice($stats['page_views'], 0, 10, true));
                        echo implode(", ", $pageValues);
                    ?>],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
        <?php endif; ?>
        
        // Données pour le graphique des appareils
        <?php 
        // Compter les types d'appareils
        $deviceTypes = ['desktop' => 0, 'mobile' => 0, 'tablet' => 0];
        foreach ($stats['visitors'] as $visit) {
            if (isset($visit['device_type'])) {
                $type = $visit['device_type'];
                if (isset($deviceTypes[$type])) {
                    $deviceTypes[$type]++;
                }
            }
        }
        ?>
        
        var devicesCtx = document.getElementById('devicesChart').getContext('2d');
        var devicesChart = new Chart(devicesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Ordinateur', 'Mobile', 'Tablette'],
                datasets: [{
                    data: [
                        <?php echo $deviceTypes['desktop']; ?>,
                        <?php echo $deviceTypes['mobile']; ?>,
                        <?php echo $deviceTypes['tablet']; ?>
                    ],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 206, 86, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    });
    </script>
</body>
</html>