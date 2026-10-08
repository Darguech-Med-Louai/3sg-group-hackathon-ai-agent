import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  Users,
  Smartphone,
  ShoppingBag,
  TrendingUp,
  Target,
  DollarSign,
} from "lucide-react";

const COLORS = [
  "oklch(0.65 0.22 25)",
  "oklch(0.75 0.15 70)",
  "oklch(0.6 0.14 180)",
  "oklch(0.7 0.08 60)",
  "oklch(0.68 0.18 40)",
  "oklch(0.55 0.15 280)",
];

const segmentIcons = [Smartphone, TrendingUp, Users, Target, ShoppingBag, DollarSign];

export default function Segments() {
  const segments = trpc.analytics.segments.useQuery();

  const radarData = segments.data?.map((s) => ({
    name: s.name.split(" ").slice(0, 2).join(" "),
    ecommerce: s.ecommerceRate,
    social: s.socialMediaUsage,
    basket: Math.min(100, (s.avgBasketSize / 350) * 100),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Segmentation Comportementale
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            6 segments de consommateurs identifies a travers la Tunisie
          </p>
        </div>

        {/* Segment Cards Grid */}
        {segments.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[250px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments.data?.map((segment, i) => {
              const Icon = segmentIcons[i % segmentIcons.length];
              return (
                <Card
                  key={segment.id}
                  className="group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: COLORS[i] + "20" }}
                          >
                            <Icon className="h-4 w-4" style={{ color: COLORS[i] }} />
                          </div>
                          <h3 className="font-semibold text-sm">{segment.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {segment.description}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs font-bold shrink-0"
                        style={{ color: COLORS[i] }}
                      >
                        {segment.percentage}%
                      </Badge>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">E-commerce</span>
                          <span className="font-medium">{segment.ecommerceRate}%</span>
                        </div>
                        <Progress value={segment.ecommerceRate} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Reseaux Sociaux</span>
                          <span className="font-medium">{segment.socialMediaUsage}%</span>
                        </div>
                        <Progress value={segment.socialMediaUsage} className="h-1.5" />
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs text-muted-foreground">Age moyen</span>
                        <span className="text-sm font-bold">{segment.avgAge} ans</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Panier moyen</span>
                        <span className="text-sm font-bold">{segment.avgBasketSize} DT</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Comparaison des Segments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {segments.isLoading ? (
                <Skeleton className="h-[350px]" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="oklch(1 0 0 / 10%)" />
                    <PolarAngleAxis
                      dataKey="name"
                      tick={{ fontSize: 9, fill: "oklch(0.6 0 0)" }}
                    />
                    <PolarRadiusAxis
                      tick={{ fontSize: 9, fill: "oklch(0.5 0 0)" }}
                      axisLine={false}
                    />
                    <Radar
                      name="E-commerce"
                      dataKey="ecommerce"
                      stroke={COLORS[0]}
                      fill={COLORS[0]}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Social Media"
                      dataKey="social"
                      stroke={COLORS[2]}
                      fill={COLORS[2]}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.17 0.015 260)",
                        border: "1px solid oklch(1 0 0 / 10%)",
                        borderRadius: "8px",
                        color: "oklch(0.9 0 0)",
                        fontSize: "12px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Repartition des Segments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {segments.isLoading ? (
                <Skeleton className="h-[350px]" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={segments.data}
                      dataKey="percentage"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={2}
                      strokeWidth={0}
                      label={({ name, percentage }) =>
                        `${name.split(" ")[0]} ${percentage}%`
                      }
                      labelLine={{ strokeWidth: 1, stroke: "oklch(0.5 0 0)" }}
                    >
                      {segments.data?.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
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
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
