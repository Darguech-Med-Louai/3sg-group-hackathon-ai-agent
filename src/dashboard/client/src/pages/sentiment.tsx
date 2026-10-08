import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Smile, Meh, Frown, MessageSquareQuote, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Sentiment() {
  const sentiments = trpc.analytics.sentiments.useQuery();
  const [filterSentiment, setFilterSentiment] = useState<string>("all");

  // Aggregate stats
  const avgPositive = sentiments.data
    ? Math.round(sentiments.data.reduce((s, d) => s + d.positive, 0) / sentiments.data.length)
    : 0;
  const avgNeutral = sentiments.data
    ? Math.round(sentiments.data.reduce((s, d) => s + d.neutral, 0) / sentiments.data.length)
    : 0;
  const avgNegative = sentiments.data
    ? Math.round(sentiments.data.reduce((s, d) => s + d.negative, 0) / sentiments.data.length)
    : 0;

  // All verbatims
  const allVerbatims = sentiments.data?.flatMap((s) =>
    s.verbatims.map((v) => ({
      ...v,
      governorate: s.governorateName,
    }))
  ) ?? [];

  const filteredVerbatims =
    filterSentiment === "all"
      ? allVerbatims
      : allVerbatims.filter((v) => v.sentiment === filterSentiment);

  // Deduplicate verbatims for display (since many govs share from the same pool)
  const uniqueVerbatims = filteredVerbatims.reduce<typeof filteredVerbatims>((acc, v) => {
    if (!acc.find((a) => a.text === v.text && a.governorate === v.governorate)) {
      acc.push(v);
    }
    return acc;
  }, []).slice(0, 12);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Analyse de Sentiment
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Perception des consommateurs tunisiens par gouvernorat
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-emerald-500/20">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Smile className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Positif</p>
                <p className="text-3xl font-bold text-emerald-500">{avgPositive}%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/20">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Meh className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Neutre</p>
                <p className="text-3xl font-bold text-yellow-500">{avgNeutral}%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-400/20">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-400/10 flex items-center justify-center">
                <Frown className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Negatif</p>
                <p className="text-3xl font-bold text-red-400">{avgNegative}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Sentiment par Gouvernorat
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sentiments.isLoading ? (
              <Skeleton className="h-[400px]" />
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={sentiments.data?.sort((a, b) => b.positive - a.positive)}
                  layout="vertical"
                  margin={{ left: 80 }}
                  barSize={14}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <YAxis
                    dataKey="governorateName"
                    type="category"
                    tick={{ fontSize: 9, fill: "oklch(0.6 0 0)" }}
                    axisLine={false}
                    tickLine={false}
                    width={75}
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
                  <Bar dataKey="positive" stackId="a" fill="oklch(0.7 0.18 155)" name="Positif" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="neutral" stackId="a" fill="oklch(0.75 0.12 85)" name="Neutre" />
                  <Bar dataKey="negative" stackId="a" fill="oklch(0.65 0.2 25)" name="Negatif" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Verbatims */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MessageSquareQuote className="h-4 w-4 text-primary" />
                Verbatims Consommateurs
              </CardTitle>
              <Select value={filterSentiment} onValueChange={setFilterSentiment}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="positive">Positif</SelectItem>
                  <SelectItem value="neutral">Neutre</SelectItem>
                  <SelectItem value="negative">Negatif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {uniqueVerbatims.map((v, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-2 hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm leading-relaxed italic">
                    &ldquo;{v.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${
                        v.sentiment === "positive"
                          ? "text-emerald-500"
                          : v.sentiment === "negative"
                            ? "text-red-400"
                            : "text-yellow-500"
                      }`}
                    >
                      {v.sentiment === "positive" ? "😊" : v.sentiment === "negative" ? "😟" : "😐"}{" "}
                      {v.sentiment}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {v.lang === "fr" ? "🇫🇷 FR" : "🇹🇳 Derja"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{v.governorate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
