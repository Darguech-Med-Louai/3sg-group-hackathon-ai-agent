<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['message']) || !isset($data['sender'])) {
    echo json_encode(['success' => false, 'error' => 'Message ou sender manquant']);
    exit;
}

try {
    $db = __DIR__ . '/chatbot.db';
    $pdo = new PDO('sqlite:' . $db);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Créer la table si elle n'existe pas
    $pdo->exec("CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT NOT NULL CHECK(sender IN ('user', 'bot')),
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        session_id TEXT
    )");

    $stmt = $pdo->prepare("
        INSERT INTO messages (sender, message, session_id)
        VALUES (?, ?, ?)
    ");

    $sessionId = $data['session_id'] ?? bin2hex(random_bytes(8));
    
    $stmt->execute([
        $data['sender'],
        $data['message'],
        $sessionId
    ]);

    $id = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'id' => (int)$id,
        'timestamp' => date('Y-m-d H:i:s'),
        'session_id' => $sessionId
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
