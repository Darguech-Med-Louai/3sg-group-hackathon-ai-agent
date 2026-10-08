import DashboardLayout from "@/components/dashboard-layout";
import { TunisiaMap } from "@/components/tunisia-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, TrendingUp, Users, Smartphone, ShoppingBag, Store, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type BehaviorType = "digital" | "ecommerce" | "traditional" | "social" | "basket";

const behaviorMetrics: { value: BehaviorType; label: string; icon: any; description: string }[] = [
  { 
    value: "digital", 
    label: "Maturité Digitale", 
    icon: Smartphone,
    description: "Niveau d'équipement en smartphones et accès internet haut débit."
  },
  { 
    value: "ecommerce", 
    label: "Adoption E-commerce", 
    icon: ShoppingBag,
    description: "Fréquence des achats en ligne et utilisation des services de livraison."
  },
  { 
    value: "traditional", 
    label: "Consommation Traditionnelle", 
    icon: Store,
    description: "Attachement aux marchés locaux (Souks) et commerces de proximité."
  },
  { 
    value: "social", 
    label: "Usage Réseaux Sociaux", 
    icon: Users,
    description: "Influence des plateformes (Facebook, Instagram) sur les décisions d'achat."
  },
  { 
    value: "basket", 
    label: "Panier Moyen (DT)", 
    icon: TrendingUp,
    description: "Dépense moyenne par transaction commerciale (en Dinars Tunisiens)."
  },
];

export default function Geographic() {
  const [selectedGovId, setSelectedGovId] = useState<number | null>(null);
  const [activeMetric, setActiveMetric] = useState<BehaviorType>("digital");
  const governorates = trpc.analytics.governorates.useQuery();

  // Robust data normalization
  const normalizedData = useMemo(() => {
    if (!governorates.data) return [];
    return governorates.data.map(g => {
      const b = g.behaviors || {};
      return {
        ...g,
        behaviors: {
          digital: b.digital ?? (g as any).behaviors?.digitalPenetration ?? 0,
          ecommerce: b.ecommerce ?? (g as any).behaviors?.ecommerceRate ?? 0,
          traditional: b.traditional ?? 0,
          social: b.social ?? 0,
          basket: b.basket ?? (g as any).behaviors?.consumptionIndex ?? 0,
          topCategory: b.topCategory || "Alimentaire"
        }
      };
    });
  }, [governorates.data]);

  const selectedGov = normalizedData.find((g) => g.id === selectedGovId);
  const activeMetricInfo = behaviorMetrics.find(m => m.value === activeMetric);

  const mapData = normalizedData.map((g) => ({
    id: g.id,
    name: g.name,
    value: g.behaviors[activeMetric] as number,
    population: g.population,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Analyse Géographique</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Cartographie comportementale de la consommation par gouvernorat
            </p>
          </div>

          <div className="flex items-center gap-3 bg-card p-2 rounded-xl border border-primary/20 shadow-sm shadow-primary/5">
            <span className="text-xs font-bold text-primary tracking-widest ml-2 uppercase">Filtrer par :</span>
            <Select value={activeMetric} onValueChange={(v) => setActiveMetric(v as BehaviorType)}>
              <SelectTrigger className="w-[230px] border-none bg-muted/30 focus:ring-0 font-semibold h-10">
                <SelectValue placeholder="Choisir un comportement" />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary/20">
                {behaviorMetrics.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="focus:bg-primary/10">
                    <div className="flex items-center gap-2">
                      <m.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{m.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 flex items-start gap-3 animate-in fade-in duration-500">
          <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-black text-foreground uppercase tracking-tight mr-1">{activeMetricInfo?.label} :</span> 
            {activeMetricInfo?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 xl:col-span-8 overflow-hidden bg-card/40 backdrop-blur-md border-primary/10 shadow-2xl shadow-primary/5">
            <CardContent className="p-0">
              {governorates.isLoading ? (
                <Skeleton className="h-[600px] w-full bg-muted/20" />
              ) : (
                <div className="p-4 md:p-10">
                  <TunisiaMap
                    governorates={mapData}
                    selectedId={selectedGovId}
                    onSelect={setSelectedGovId}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-5 xl:col-span-4">
            {selectedGov ? (
              <Card className="h-full border-primary/30 bg-card/60 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 shadow-2xl shadow-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <MapPin className="h-32 w-32 text-primary" />
                </div>
                
                <CardHeader className="pb-6 border-b border-primary/10 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight">
                      <MapPin className="h-6 w-6 text-primary fill-primary/10" />
                      {selectedGov.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-[11px] font-black border-primary/30 text-primary uppercase">
                      Code {selectedGov.id.toString().padStart(2, '0')}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-8 space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Population</p>
                      <p className="text-3xl font-black italic tracking-tighter">
                        {(selectedGov.population / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Top Catégorie</p>
                      <p className="text-xl font-black text-primary uppercase tracking-tighter">
                        {selectedGov.behaviors.topCategory}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                      <span className="h-1 w-8 bg-primary rounded-full" />
                      Profil Consommation
                    </h4>
                    <div className="space-y-6">
                      <BehaviorMetric
                        label="Maturité Digitale"
                        value={selectedGov.behaviors.digital}
                        icon={Smartphone}
                        color="oklch(0.7 0.22 25)"
                      />
                      <BehaviorMetric
                        label="Adoption E-commerce"
                        value={selectedGov.behaviors.ecommerce}
                        icon={ShoppingBag}
                        color="oklch(0.6 0.22 25)"
                      />
                      <BehaviorMetric
                        label="Usage Traditionnel (Souks)"
                        value={selectedGov.behaviors.traditional}
                        icon={Store}
                        color="oklch(0.5 0.15 25)"
                      />
                      <BehaviorMetric
                        label="Influence Réseaux Sociaux"
                        value={selectedGov.behaviors.social}
                        icon={Users}
                        color="oklch(0.4 0.15 25)"
                      />
                    </div>
                  </div>

                  <div className="pt-8 mt-4 border-t border-primary/10">
                    <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span>Panier Moyen estimé</span>
                        </div>
                        <p className="text-5xl font-black text-foreground tracking-tighter">
                          {selectedGov.behaviors.basket} <span className="text-xl font-bold text-muted-foreground italic">DT</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-primary text-primary-foreground font-black border-none shadow-lg shadow-primary/20">
                          SCORE A+
                        </Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Dynamisme local</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full border-dashed border-primary/20 flex flex-col items-center justify-center text-center p-12 bg-primary/5 border-4 rounded-3xl animate-pulse">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
                  <MapPin className="h-12 w-12 text-primary opacity-40" />
                </div>
                <h3 className="font-black text-xl mb-4 tracking-tight">Explorez les Régions</h3>
                <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed font-medium">
                  Cliquez sur un gouvernorat pour débloquer les insights comportementaux détaillés.
                </p>
                <div className="mt-8 flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function BehaviorMetric({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color?: string }) {
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5 font-bold">
          <Icon className="h-4 w-4 text-primary/70" />
          <span className="text-[13px] tracking-tight">{label}</span>
        </div>
        <span className="font-black text-sm text-foreground">{value}%</span>
      </div>
      <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden border border-primary/5 shadow-inner">
        <div
          className="h-full transition-all duration-1000 ease-in-out relative"
          style={{ 
            width: `${value}%`,
            backgroundColor: color || 'var(--primary)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
      </div>
    </div>
  );
}
