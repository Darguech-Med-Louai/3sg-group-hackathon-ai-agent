# Architecture

The repository contains two independent demonstrations and an incomplete
questionnaire prototype. They do not share a backend or a live data pipeline.

```mermaid
flowchart LR
  subgraph Dashboard["TuniBehavior AI — tableau de bord"]
    Browser["Navigateur<br/>React / TypeScript"]
    API["Express + tRPC"]
    Data["shared/tunisian_data.json<br/>données de démonstration"]
    Browser --> API --> Data
  end

  subgraph Chat["Tchati.ai — chatbot"]
    ChatUI["chatbot_tounsi_new.html"]
    Ollama["Ollama local<br/>localhost:11434/api/chat"]
    Save["save_message.php"]
    ChatDB[("SQLite<br/>chatbot.db")]
    ChatUI --> Ollama
    ChatUI --> Save --> ChatDB
  end

  subgraph Survey["Questionnaire — prototype incomplet"]
    Form["form.html"]
    Submit["submit.php"]
    SurveyDB[("SQLite<br/>enquete.db")]
    Missing["Schéma SQL référencé<br/>mais absent du dépôt"]
    Form --> Submit --> SurveyDB
    Missing -.-> SurveyDB
  end
```

## Flux et limites

- Le tableau de bord sert les pages d’indicateurs, tendances, segmentation,
  sentiment, géographie et prédictions à partir d’un JSON local. Les données
  sont statiques et illustratives : aucune collecte client ni pipeline temps
  réel n’est livré.
- L’assistant intégré au tableau de bord répond par règles/mots-clés ; ce n’est
  pas l’agent Ollama montré dans la vidéo.
- Le chatbot Tchati.ai appelle un modèle Ollama local configuré sous le nom
  `mon-chatbot` et enregistre les messages dans SQLite. Le modèle n’est pas
  fourni.
- Le formulaire d’enquête et ses scripts PHP sont un prototype distinct. Le
  fichier `init_db.php` référence `enquete_comportements_achat.sql`, absent du
  dépôt ; ce flux n’est donc pas prêt à l’exécution.
- Le code générique d’authentification/stockage du tableau de bord requiert des
  services et des variables d’environnement optionnels, non nécessaires à la
  consultation des données de démonstration.
