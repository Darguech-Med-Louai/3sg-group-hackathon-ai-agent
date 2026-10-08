import DashboardLayout from "@/components/dashboard-layout";
import { AIChatBox, Message } from "@/components/ai-chat-box";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Bot } from "lucide-react";

// Formal Analytics Response Engine (removing Tunisian style/Derja)
function getAnalyticsResponse(
  question: string,
  kpis: any,
  segments: any[],
  govs: any[]
): string {
  const q = question.toLowerCase();

  if (q.includes("kpi") || q.includes("indicateur") || q.includes("chiffre")) {
    return `### Indicateurs Clés de Performance (KPI)\n\nVoici un aperçu des principaux indicateurs pour le marché tunisien :\n\n` +
      `- **Pénétration Digitale** : ${kpis.digitalPenetration}%\n` +
      `- **Indice de Consommation** : ${kpis.consumptionIndex}\n` +
      `- **Mobilité Urbaine** : ${kpis.urbanMobility}%\n` +
      `- **Sentiment Public** : ${kpis.publicSentiment}/10\n` +
      `- **Adoption E-commerce** : ${kpis.ecommerceAdoption}%\n` +
      `- **Panier Moyen** : ${kpis.averageBasketSize} DT\n` +
      `- **Satisfaction Client** : ${kpis.customerSatisfaction}/10\n` +
      `- **Risque de Churn** : ${kpis.churnRisk}%\n\n` +
      `Souhaitez-vous des détails sur un indicateur spécifique ?`;
  }

  if (q.includes("segment") || q.includes("profil") || q.includes("consommateur")) {
    const segList = segments.map(
      (s) => `- **${s.name}** (${s.percentage}%) : ${s.description}`
    ).join("\n");
    return `### Segmentation des Consommateurs\n\nNous avons identifié 6 segments principaux sur le marché :\n\n${segList}\n\n` +
      `Le segment le plus représenté est **${segments.find((s: any) => s.name === "Family Oriented")?.name}** avec ${segments.find((s: any) => s.name === "Family Oriented")?.percentage}%.`;
  }

  if (q.includes("gouvernorat") || q.includes("région") || q.includes("ville")) {
    const top5 = [...govs]
      .sort((a, b) => b.behaviors.ecommerceRate - a.behaviors.ecommerceRate)
      .slice(0, 5);
    const list = top5.map(
      (g) => `- **${g.name}** : E-commerce ${g.behaviors.ecommerceRate}%, Pénétration Digitale ${g.behaviors.digitalPenetration}%`
    ).join("\n");
    return `### Analyse Géographique\n\nVoici le top 5 des gouvernorats par taux d'adoption du e-commerce :\n\n${list}\n\n` +
      `Les zones urbaines affichent une maturité digitale nettement supérieure.`;
  }

  if (q.includes("e-commerce") || q.includes("ecommerce") || q.includes("achat en ligne")) {
    return `### Analyse E-commerce\n\nLe commerce électronique en Tunisie présente les caractéristiques suivantes :\n\n` +
      `- Taux d'adoption global : **${kpis.ecommerceAdoption}%**\n` +
      `- Panier moyen : **${kpis.averageBasketSize} DT**\n` +
      `- Les segments jeunes (18-25 ans) affichent un taux d'adoption de **85%**.\n` +
      `- Une forte disparité subsiste entre les zones urbaines et rurales.`;
  }

  if (q.includes("sentiment") || q.includes("avis") || q.includes("opinion")) {
    return `### Analyse de Sentiment\n\nSynthèse de la perception des consommateurs :\n\n` +
      `- **Indice de Sentiment Public** : ${kpis.publicSentiment}/10\n` +
      `- **Score de Satisfaction** : ${kpis.customerSatisfaction}/10\n\n` +
      `Les retours sont globalement positifs dans les pôles économiques, tandis que les zones intérieures expriment des besoins accrus en services de logistique.`;
  }

  if (q.includes("pipeline") || q.includes("données") || q.includes("traitement")) {
    return `### État du Pipeline de Données\n\nLe processus de traitement est structuré en 6 étapes :\n\n` +
      `1. **Collecte** : 100%\n` +
      `2. **Nettoyage** : 100%\n` +
      `3. **Traitement ETL** : 75%\n` +
      `4. **Analyse IA** : 45%\n` +
      `5. **Rapports** : 0%\n` +
      `6. **Visualisation** : 0%\n\n` +
      `Progression globale : environ **53%**.`;
  }

  if (q.includes("bonjour") || q.includes("salut") || q.includes("hello")) {
    return `Bonjour ! Je suis votre assistant IA dédié à l'analyse de données TuniBehavior.\n\n` +
      `Je peux vous aider sur les points suivants :\n` +
      `- **Indicateurs clés (KPI)**\n` +
      `- **Segments de consommateurs**\n` +
      `- **Données par gouvernorat**\n` +
      `- **Tendances e-commerce**\n` +
      `- **Analyse de sentiment**\n\n` +
      `Quelle information souhaitez-vous obtenir ?`;
  }

  return `Je ne suis pas sûr de comprendre votre demande. En tant qu'assistant analytique, je peux vous fournir des informations sur :\n\n` +
    `- Les indicateurs clés (KPI)\n` +
    `- Les segments de consommateurs\n` +
    `- L'analyse par gouvernorat\n` +
    `- Les tendances e-commerce\n` +
    `- L'état du pipeline de données\n\n` +
    `N'hésitez pas à poser une question précise sur ces sujets.`;
}

const suggestedPrompts = [
  "Quels sont les KPIs principaux ?",
  "Décris les segments de consommateurs",
  "Top gouvernorats en e-commerce",
  "Analyse de sentiment globale",
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider dans votre analyse aujourd'hui ?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const kpis = trpc.analytics.kpis.useQuery();
  const segments = trpc.analytics.segments.useQuery();
  const govs = trpc.analytics.governorates.useQuery();

  const dataReady = kpis.data && segments.data && govs.data;

  const handleSendMessage = (content: string) => {
    if (!content.trim() || isLoading || !dataReady) return;

    const userMsg: Message = { role: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAnalyticsResponse(
        content,
        kpis.data,
        segments.data!,
        govs.data!
      );
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 overflow-hidden flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Assistant Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assistant Analytique IA</h1>
            <p className="text-muted-foreground text-xs">Analyse intelligente du comportement des consommateurs</p>
          </div>
        </div>

        {/* Chat Component Integration */}
        <div className="flex-1 min-h-0">
          <AIChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder={dataReady ? "Posez une question sur les données..." : "Chargement des données..."}
            height="100%"
            emptyStateMessage="Comment puis-je vous aider ?"
            suggestedPrompts={suggestedPrompts}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
