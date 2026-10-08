<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

$data = json_decode(file_get_contents('php://input'), true);
$db   = __DIR__ . '/enquete.db';
$pdo  = new PDO('sqlite:' . $db);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $pdo->prepare("INSERT INTO reponses
  (age,genre,gouvernorat,situation,revenu,frequence,canal,budget,facteur,influence)
  VALUES (?,?,?,?,?,?,?,?,?,?)");
$stmt->execute([
  $data['age'], $data['genre'], $data['gouvernorat'], $data['situation'],
  $data['revenu'], $data['frequence'], $data['canal'], $data['budget'],
  $data['facteur'], $data['influence'] ?? null
]);
$id = $pdo->lastInsertId();

foreach (($data['categories'] ?? []) as $cat) {
  $pdo->prepare("INSERT INTO reponse_categories (reponse_id, categorie)
                 VALUES (?,?)")->execute([$id, $cat]);
}
echo json_encode(['success' => true, 'id' => (int)$id]);