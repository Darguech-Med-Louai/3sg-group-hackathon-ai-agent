import DashboardLayout from "@/components/dashboard-layout";
import { KPICard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wifi,
  ShoppingCart,
  TrendingUp,
  Heart,
  Globe2,
  DollarSign,
  Smile,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = [
  "oklch(0.65 0.22 25)",   // red
  "oklch(0.75 0.15 70)",   // gold
  "oklch(0.6 0.14 180)",   // teal
  "oklch(0.7 0.08 60)",    // warm gray
  "oklch(0.68 0.18 40)",   // amber
  "oklch(0.55 0.15 280)",  // purple
];

export default function Home() {
  const kpis = trpc.analytics.kpis.useQuery();
  const trends = trpc.analytics.monthlyTrends.useQuery();
  const segments = trpc.analytics.segments.useQuery();

  const kpiCards = kpis.data
    ? [
        { title: "Penetration Digitale", value: kpis.data.digitalPenetration, suffix: "%", icon: Wifi, trend: 4.2 },
        { title: "Indice Consommation", value: kpis.data.consumptionIndex, suffix: "", icon: ShoppingCart, trend: 3.1 },
        { title: "Mobilite Urbaine", value: kpis.data.urbanMobility, suffix: "%", icon: Globe2, trend: 2.5 },
        { title: "Sentiment Public", value: kpis.data.publicSentiment, suffix: "/10", icon: Heart, trend: 1.8 },
        { title: "Adoption E-commerce", value: kpis.data.ecommerceAdoption, suffix: "%", icon: TrendingUp, trend: 6.7 },
        { title: "Panier Moyen", value: kpis.data.averageBasketSize, suffix: "DT", icon: DollarSign, trend: -1.2 },
        { title: "Satisfaction Client", value: kpis.data.customerSatisfaction, suffix: "/10", icon: Smile, trend: 2.1 },
        { title: "Risque Churn", value: kpis.data.churnRisk, suffix: "%", icon: AlertTriangle, trend: -3.5 },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tableau de Bord
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Analyse comportementale des consommateurs tunisiens — Donnees en temps reel
          </p>
        </div>

        {/* KPI Cards Grid */}
        {kpis.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi, i) => (
              <KPICard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                suffix={kpi.suffix}
                icon={kpi.icon}
                trend={kpi.trend}
                trendLabel="vs mois dernier"
                delay={i * 50}
              />
            ))}
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trends */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Tendances Mensuelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trends.isLoading ? (
                <Skeleton className="h-[300px]" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trends.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.17 0.015 260)",
                        border: "1px solid oklch(1 0 0 / 10%)",
                        borderRadius: "8px",
                        color: "oklch(0.9 0 0)",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="consumption" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} name="Consommation" />
                    <Line type="monotone" dataKey="mobility" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} name="Mobilite" />
                    <Line type="monotone" dataKey="digital" stroke={CHART_COLORS[2]} strokeWidth={2} dot={false} name="Digital" />
                    <Line type="monotone" dataKey="opinion" stroke={CHART_COLORS[3]} strokeWidth={2} dot={false} name="Opinion" />
                    <Line type="monotone" dataKey="economy" stroke={CHART_COLORS[4]} strokeWidth={2} dot={false} name="Economie" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Segment Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Segments Comportementaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              {segments.isLoading ? (
                <Skeleton className="h-[300px]" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={segments.data}
                      dataKey="percentage"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {segments.data?.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.17 0.015 260)",
                        border: "1px solid oklch(1 0 0 / 10%)",
                        borderRadius: "8px",
                        color: "oklch(0.9 0 0)",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Part"]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Demographics Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Profil des Segments — Taux E-commerce vs Usage Reseaux Sociaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            {segments.isLoading ? (
              <Skeleton className="h-[280px]" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={segments.data} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.015 260)",
                      border: "1px solid oklch(1 0 0 / 10%)",
                      borderRadius: "8px",
                      color: "oklch(0.9 0 0)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="ecommerceRate" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} name="E-commerce %" />
                  <Bar dataKey="socialMediaUsage" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} name="Social Media %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
