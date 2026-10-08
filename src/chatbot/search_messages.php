<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

$keyword = $_GET['keyword'] ?? '';
$session_id = $_GET['session_id'] ?? '';
$sender = $_GET['sender'] ?? ''; // 'user', 'bot', ou vide pour tous

try {
    $db = __DIR__ . '/chatbot.db';
    $pdo = new PDO('sqlite:' . $db);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "SELECT * FROM messages WHERE 1=1";
    $params = [];

    // Filtrer par mot-clé (recherche dans le texte du message)
    if (!empty($keyword)) {
        $query .= " AND message LIKE ?";
        $params[] = '%' . $keyword . '%';
    }

    // Filtrer par session
    if (!empty($session_id)) {
        $query .= " AND session_id = ?";
        $params[] = $session_id;
    }

    // Filtrer par sender (user ou bot)
    if (!empty($sender) && in_array($sender, ['user', 'bot'])) {
        $query .= " AND sender = ?";
        $params[] = $sender;
    }

    $query .= " ORDER BY timestamp DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'count' => count($results),
        'messages' => $results,
        'search_params' => [
            'keyword' => $keyword,
            'session_id' => $session_id,
            'sender' => $sender
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
