import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Target, 
  Zap, 
  ShieldCheck,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback behavioral data
const fallbackPredictions = {
  forecast: [
    { day: "Lun", impulsionAchat: 65, adoptionDigitale: 78, besoinSocial: 45 },
    { day: "Mar", impulsionAchat: 68, adoptionDigitale: 80, besoinSocial: 42 },
    { day: "Mer", impulsionAchat: 75, adoptionDigitale: 82, besoinSocial: 48 },
    { day: "Jeu", impulsionAchat: 82, adoptionDigitale: 85, besoinSocial: 55 },
    { day: "Ven", impulsionAchat: 92, adoptionDigitale: 88, besoinSocial: 85 },
    { day: "Sam", impulsionAchat: 96, adoptionDigitale: 92, besoinSocial: 98 },
    { day: "Dim", impulsionAchat: 88, adoptionDigitale: 85, besoinSocial: 75 },
  ],
  insights: [
    {
      title: "Frénésie d'Achat Impulsive",
      description: "Comportement d'urgence observé chez les 25-35 ans cherchant des cadeaux de dernière minute. Priorité à la rapidité sur le prix.",
      probability: 94,
      impact: "high",
      category: "Impulsion",
      behavior: "Urgence"
    },
    {
      title: "Arbitrage Budgétaire Serré",
      description: "Les chefs de famille privilégient les produits de base et reportent les achats technologiques. Prudence accrue face à l'inflation.",
      probability: 91,
      impact: "medium",
      category: "Prudence",
      behavior: "Arbitrage"
    },
    {
      title: "Socialisation de Revanche",
      description: "Besoin massif de consommation en lieux physiques dès le coucher du soleil. Forte corrélation avec la recherche de lien social.",
      probability: 88,
      impact: "high",
      category: "Sociabilité",
      behavior: "Lien Social"
    }
  ],
  behavioralMetrics: [
    { name: "Achat Compulsif", level: "Très Élevé", trend: "+45%", status: "up" },
    { name: "Prudence Financière", level: "Modéré", trend: "+12%", status: "up" },
    { name: "Mobilité Nocturne", level: "Extrême", trend: "+60%", status: "up" },
    { name: "Méfiance Digitale", level: "Stable", trend: "0%", status: "neutral" }
  ]
};

export default function Predictions() {
  const query = trpc.analytics.predictions.useQuery();
  const data = query.data || fallbackPredictions;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20 shadow-lg shadow-primary/10">
                <BrainCircuit className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                  Prédictions Comportementales
                </h1>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest uppercase">
                  Analyse de la Psychologie Sociale
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-card/40 backdrop-blur-md p-4 rounded-3xl border border-primary/10 shadow-xl">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Dynamisme Comportemental</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-black text-foreground tracking-tighter">Vif / Intensif</p>
                <div className="flex h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Forecast Chart */}
        <Card className="border-primary/20 bg-card/30 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden rounded-[2rem]">
          <CardHeader className="border-b border-primary/5 pb-8 px-8 pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Intensité des Comportements
                </CardTitle>
                <p className="text-xs text-muted-foreground font-medium">
                  Projection de la psychologie de consommation pour les 7 prochains jours.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 bg-muted/20 p-2 rounded-xl border border-primary/5">
                <LegendItem color="oklch(0.7 0.22 25)" label="Impulsion" />
                <LegendItem color="oklch(0.6 0.15 155)" label="Digital" />
                <LegendItem color="oklch(0.5 0.1 260)" label="Lien Social" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.forecast} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorImpulsion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.7 0.22 25)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="oklch(0.7 0.22 25)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(1 0 0 / 5%)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'oklch(0.6 0 0)', fontSize: 13, fontWeight: 700}}
                    dy={15}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(0.18 0.02 260)', 
                      border: '1px solid oklch(0.7 0.22 25 / 40%)',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: 'white', fontSize: '13px', fontWeight: 'bold', padding: '4px 0' }}
                    labelStyle={{ color: 'oklch(0.7 0.22 25)', marginBottom: '12px', fontWeight: 'black', fontSize: '16px', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="impulsionAchat" 
                    stroke="oklch(0.7 0.22 25)" 
                    strokeWidth={5}
                    fillOpacity={1} 
                    fill="url(#colorImpulsion)" 
                    animationDuration={2500}
                    name="Intensité d'Impulsion"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="adoptionDigitale" 
                    stroke="oklch(0.6 0.15 155)" 
                    strokeWidth={3}
                    fill="transparent"
                    strokeDasharray="8 4"
                    animationDuration={3000}
                    name="Adoption Digitale"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="besoinSocial" 
                    stroke="oklch(0.5 0.1 260)" 
                    strokeWidth={2}
                    fill="transparent"
                    animationDuration={3500}
                    name="Besoin Social"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Behavioral Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.behavioralMetrics.map((cat, i) => (
            <Card key={i} className="group bg-card/30 border-primary/10 hover:border-primary/40 transition-all duration-500 rounded-3xl overflow-hidden shadow-lg hover:shadow-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <Badge className={`${cat.status === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'} border-none font-black`}>
                    {cat.trend}
                  </Badge>
                </div>
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">{cat.name}</h4>
                <p className="text-sm font-bold text-foreground">Niveau: {cat.level}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Behavioral Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {data.insights.map((insight, idx) => (
            <Card key={idx} className="group relative overflow-hidden bg-gradient-to-br from-card/60 to-card/20 border-primary/10 hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                <div 
                  className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-1000 delay-500" 
                  style={{ width: `${insight.probability}%` }}
                />
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-all group-hover:rotate-12">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Probabilité</p>
                    <p className="text-2xl font-black text-primary tracking-tighter">{insight.probability}%</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-2 mb-2">
                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                      {insight.category}
                    </Badge>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-primary/20">
                      Modèle: {insight.behavior}
                    </Badge>
                  </div>
                  <h3 className="font-black text-xl leading-tight tracking-tight uppercase group-hover:text-primary transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {insight.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Psycho-Analyse OK</span>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                    insight.impact === 'high' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-blue-500/20 text-blue-500 border border-blue-500/20'
                  }`}>
                    Impact {insight.impact === 'high' ? 'Critique' : 'Modéré'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actionable Footer */}
        <div className="relative group overflow-hidden bg-primary/10 border border-primary/20 p-10 rounded-[3rem] flex flex-col lg:flex-row items-center gap-8 justify-between shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
            <BrainCircuit className="h-48 w-48 text-primary" />
          </div>
          <div className="flex items-center gap-6 z-10">
            <div className="h-16 w-16 rounded-3xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-lg">
              <Info className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xl tracking-tight uppercase">Comprendre l'humain</h4>
              <p className="text-sm text-muted-foreground max-w-lg font-medium leading-relaxed">
                Nos modèles ne prédisent pas seulement des chiffres, ils analysent les motivations profondes des consommateurs tunisiens pour vous aider à anticiper leurs besoins réels.
              </p>
            </div>
          </div>
          <button className="z-10 group relative px-10 py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-[0_20px_50px_rgba(var(--primary),0.3)] text-xs uppercase tracking-[0.2em]">
            Exporter l'Analyse Comportementale
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-2.5 w-5 rounded-full shadow-lg" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  );
}
