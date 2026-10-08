<?php
$pdo = new PDO('sqlite:' . __DIR__ . '/enquete.db');
$pdo->exec(file_get_contents('enquete_comportements_achat.sql'));
echo 'Base de données créée avec succès !';