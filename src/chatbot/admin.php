<?php
$pdo  = new PDO('sqlite:' . __DIR__ . '/enquete.db');
$rows = $pdo->query("
  SELECT r.*, GROUP_CONCAT(rc.categorie, ', ') AS categories
  FROM reponses r
  LEFT JOIN reponse_categories rc ON rc.reponse_id = r.id
  GROUP BY r.id ORDER BY r.id DESC
")->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<title>Admin — Réponses</title>
<style>
body{font-family:sans-serif;padding:24px;background:#fdf2f2}
h1{color:#c0392b;margin-bottom:16px}
table{border-collapse:collapse;width:100%;font-size:13px;background:#fff;border-radius:8px;overflow:hidden}
th{background:#c0392b;color:#fff;padding:10px 12px;text-align:left}
td{padding:8px 12px;border-bottom:1px solid #fcd5d5}
tr:hover td{background:#fdecea}
.badge{background:#fdecea;color:#96281b;border-radius:4px;padding:2px 6px;font-size:11px}
</style>
</head><body>
<h1>📋 Réponses reçues (<?= count($rows) ?>)</h1>
<table>
<tr><th>#</th><th>Âge</th><th>Genre</th><th>Gouvernorat</th>
    <th>Situation</th><th>Revenu</th><th>Fréquence</th>
    <th>Canal</th><th>Budget</th><th>Catégories</th>
    <th>Facteur</th><th>Influence</th><th>Date</th></tr>
<?php foreach($rows as $r): ?>
<tr>
  <td><?= $r['id'] ?></td>
  <td><span class="badge"><?= $r['age'] ?></span></td>
  <td><?= $r['genre'] ?></td>
  <td><?= $r['gouvernorat'] ?></td>
  <td><?= $r['situation'] ?></td>
  <td><?= $r['revenu'] ?></td>
  <td><?= $r['frequence'] ?></td>
  <td><?= $r['canal'] ?></td>
  <td><?= $r['budget'] ?></td>
  <td><?= $r['categories'] ?></td>
  <td><?= $r['facteur'] ?></td>
  <td><?= htmlspecialchars($r['influence'] ?? '') ?></td>
  <td><?= $r['soumis_le'] ?></td>
</tr>
<?php endforeach ?>
</table></body></html>
