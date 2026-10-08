import tunisianData from "../shared/tunisian_data.json";

// ─── Types ───────────────────────────────────────────────────────────
export type KPIs = typeof tunisianData.kpis;

export type BehaviorData = {
  digital: number;
  ecommerce: number;
  traditional: number;
  social: number;
  basket: number;
  topCategory: string;
};

export type GovernorateData = {
  id: number;
  name: string;
  population: number;
  urbanization: number;
  lat: number;
  lon: number;
  behaviors: BehaviorData;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    verbatims: { text: string; lang: string; sentiment: string }[];
  };
};

export type SegmentData = (typeof tunisianData.segments)[number];
export type TrendData = (typeof tunisianData.monthlyTrends)[number];
export type PipelineStageData = (typeof tunisianData.pipelineStages)[number];

// ─── Verbatims library (Strictly French, Tunisian Spirit) ───────────────────
const verbatimsPool = [
  // Positive
  { text: "Les services digitaux facilitent vraiment la vie pendant le Ramadan.", lang: "fr", sentiment: "positive" },
  { text: "Le paiement à la livraison est indispensable pour moi, c'est une question de confiance.", lang: "fr", sentiment: "positive" },
  { text: "On trouve enfin de bons produits locaux sur les boutiques Instagram.", lang: "fr", sentiment: "positive" },
  { text: "Les promos en ligne sont souvent plus intéressantes que dans les grandes surfaces.", lang: "fr", sentiment: "positive" },
  { text: "La digitalisation des banques tunisiennes s'améliore, c'est encourageant.", lang: "fr", sentiment: "positive" },
  // Neutral
  { text: "Le site est correct, mais la livraison prend parfois plus de 3 jours.", lang: "fr", sentiment: "neutral" },
  { text: "Je préfère quand même aller au Souk pour les produits frais, le digital c'est pour l'électronique.", lang: "fr", sentiment: "neutral" },
  { text: "C'est une bonne initiative, mais il y a encore des bugs sur l'application.", lang: "fr", sentiment: "neutral" },
  { text: "L'usage des réseaux sociaux est omniprésent, même pour les petites boutiques de quartier.", lang: "fr", sentiment: "neutral" },
  // Negative
  { text: "Encore trop de retards de livraison dans les régions de l'intérieur.", lang: "fr", sentiment: "negative" },
  { text: "Le service client ne répond jamais aux messages sur Messenger.", lang: "fr", sentiment: "negative" },
  { text: "Les prix sur internet sont devenus trop chers par rapport au salaire moyen.", lang: "fr", sentiment: "negative" },
  { text: "Manque de clarté sur les politiques de retour des produits défectueux.", lang: "fr", sentiment: "negative" },
  { text: "Trop de faux profils et d'arnaques sur les groupes de vente Facebook.", lang: "fr", sentiment: "negative" },
];

// ─── Deterministic seed for consistent data ──────────────────────────
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// ─── Generate enriched governorate data ──────────────────────────────
function generateGovernorateData(): GovernorateData[] {
  return tunisianData.governorates.map((gov) => {
    const seed = gov.id;
    const urbanFactor = gov.urbanization / 100;

    // Direct mapping with fallback for older JSON structure if needed
    const b = (gov as any).behaviors || {};
    
    const behaviors: BehaviorData = {
      digital: b.digital || Math.round(30 + urbanFactor * 60),
      ecommerce: b.ecommerce || Math.round(20 + urbanFactor * 65),
      traditional: b.traditional || Math.round(90 - urbanFactor * 50),
      social: b.social || Math.round(40 + urbanFactor * 55),
      basket: b.basket || Math.round(80 + urbanFactor * 150),
      topCategory: b.topCategory || "Alimentaire",
    };

    const posBase = 45 + urbanFactor * 20 + seededRandom(seed * 23) * 10;
    const negBase = 15 + (1 - urbanFactor) * 15 + seededRandom(seed * 29) * 10;
    const total = 100;
    const positive = Math.round(posBase);
    const negative = Math.round(negBase);
    const neutral = total - positive - negative;

    const verbatims = [
      verbatimsPool[Math.floor(seededRandom(seed * 31) * 5)],
      verbatimsPool[5 + Math.floor(seededRandom(seed * 37) * 4)],
      verbatimsPool[9 + Math.floor(seededRandom(seed * 41) * 5)],
    ];

    return {
      id: gov.id,
      name: gov.name,
      population: gov.population,
      urbanization: gov.urbanization,
      lat: gov.lat,
      lon: gov.lon,
      behaviors,
      sentiment: { positive, neutral, negative, verbatims },
    };
  });
}

// ─── Cached data ─────────────────────────────────────────────────────
let _governorates: GovernorateData[] | null = null;

function getGovernorates(): GovernorateData[] {
  if (!_governorates) {
    _governorates = generateGovernorateData();
  }
  return _governorates;
}

export function getKPIs(): KPIs {
  return tunisianData.kpis;
}

export function getAllGovernorates(): GovernorateData[] {
  return getGovernorates();
}

export function getGovernorateById(id: number): GovernorateData | undefined {
  return getGovernorates().find((g) => g.id === id);
}

export function getSegments(): SegmentData[] {
  return tunisianData.segments;
}

export function getMonthlyTrends(): TrendData[] {
  return tunisianData.monthlyTrends;
}

export function getPipelineStages(): PipelineStageData[] {
  return tunisianData.pipelineStages;
}

export function getSentiments() {
  return getGovernorates().map((g) => ({
    governorateId: g.id,
    governorateName: g.name,
    ...g.sentiment,
  }));
}

export function getGovernorateBehaviors() {
  return getGovernorates().map((g) => ({
    governorateId: g.id,
    governorateName: g.name,
    ...g.behaviors,
  }));
}

export function getPredictions() {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const now = new Date();
  
  return {
    forecast: Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const dayLabel = days[date.getDay()];
      const seed = i + 100;
      
      const growthFactor = 1 + (i * 0.05); 
      
      return {
        day: dayLabel,
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        impulsionAchat: Math.round((68 + seededRandom(seed) * 15) * growthFactor),
        adoptionDigitale: Math.round((75 + seededRandom(seed + 1) * 10) * (1 + i * 0.02)),
        besoinSocial: Math.round((50 + seededRandom(seed + 2) * 20) * (1 + (i > 4 ? 0.4 : 0))),
      };
    }),
    insights: [
      {
        title: "Frénésie d'Achat Impulsive",
        description: "Comportement d'urgence observé chez les 25-35 ans cherchant des cadeaux de dernière minute. Priorité à la rapidité de livraison sur le prix.",
        probability: 94,
        impact: "high",
        category: "Impulsion",
        behavior: "Urgence"
      },
      {
        title: "Arbitrage Budgétaire Serré",
        description: "Les chefs de famille privilégient les produits de base et reportent les achats technologiques. Analyse d'une prudence accrue face à l'inflation.",
        probability: 91,
        impact: "medium",
        category: "Prudence",
        behavior: "Arbitrage"
      },
      {
        title: "Socialisation de Revanche",
        description: "Besoin massif de consommation en lieux physiques (cafés, souks) dès le coucher du soleil. Forte corrélation avec la recherche de lien social.",
        probability: 88,
        impact: "high",
        category: "Sociabilité",
        behavior: "Lien Social"
      },
      {
        title: "Fidélité de Proximité",
        description: "Retour vers le commerçant de quartier par peur de la rupture de stock en ligne. Valorisation de la relation de confiance immédiate.",
        probability: 82,
        impact: "medium",
        category: "Confiance",
        behavior: "Fidélité"
      }
    ],
    behavioralMetrics: [
      { name: "Achat Compulsif", level: "Très Élevé", trend: "+45%", status: "up" },
      { name: "Prudence Financière", level: "Modéré", trend: "+12%", status: "up" },
      { name: "Mobilité Nocturne", level: "Extrême", trend: "+60%", status: "up" },
      { name: "Méfiance Digitale", level: "Stable", trend: "0%", status: "neutral" }
    ]
  };
}
