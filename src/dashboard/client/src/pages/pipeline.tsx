import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle2,
  Circle,
  Loader2,
  ArrowRight,
  Database,
  Shield,
  Cog,
  Brain,
  FileText,
  LayoutDashboard,
} from "lucide-react";

const stageIcons = [Database, Shield, Cog, Brain, FileText, LayoutDashboard];

const stageDescriptions = [
  "Acquisition des donnees brutes depuis les sources tunisiennes (enquetes, APIs, open data)",
  "Nettoyage, normalisation et anonymisation des donnees personnelles (RGPD-compatible)",
  "Extraction, Transformation, Chargement — preparation des datasets pour l'analyse",
  "Modeles d'IA pour la segmentation, l'analyse de sentiment et la prediction",
  "Generation automatique des rapports analytiques et tableaux de bord",
  "Mise en forme finale et publication sur le dashboard interactif",
];

export default function Pipeline() {
  const pipeline = trpc.analytics.pipelineStages.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pipeline d'Orchestration
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Suivi du pipeline de traitement des donnees comportementales
          </p>
        </div>

        {/* Summary */}
        {pipeline.data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Terminees</p>
                  <p className="text-2xl font-bold">
                    {pipeline.data.filter((s) => s.status === "completed").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">En cours</p>
                  <p className="text-2xl font-bold">
                    {pipeline.data.filter((s) => s.status === "in_progress").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Circle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold">
                    {pipeline.data.filter((s) => s.status === "pending").length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pipeline Stepper */}
        {pipeline.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {pipeline.data?.map((stage, i) => {
              const Icon = stageIcons[i] || Cog;
              const isCompleted = stage.status === "completed";
              const isInProgress = stage.status === "in_progress";
              const isPending = stage.status === "pending";
              const isLast = i === (pipeline.data?.length ?? 0) - 1;

              return (
                <div key={stage.id} className="relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div className="absolute left-[23px] top-[72px] w-0.5 h-8 bg-border z-0">
                      {isCompleted && (
                        <div className="w-full h-full bg-emerald-500/50" />
                      )}
                    </div>
                  )}

                  <Card
                    className={`relative z-10 transition-all duration-300 ${
                      isInProgress
                        ? "border-blue-500/30 shadow-lg shadow-blue-500/5"
                        : isCompleted
                          ? "border-emerald-500/20"
                          : "opacity-60"
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500/10"
                              : isInProgress
                                ? "bg-blue-500/10"
                                : "bg-muted"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                          ) : isInProgress ? (
                            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <h3 className="font-semibold text-sm">{stage.name}</h3>
                            </div>
                            <Badge
                              variant={
                                isCompleted
                                  ? "default"
                                  : isInProgress
                                    ? "secondary"
                                    : "outline"
                              }
                              className={`text-[10px] ${
                                isCompleted
                                  ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                                  : isInProgress
                                    ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                                    : ""
                              }`}
                            >
                              {isCompleted ? "Termine" : isInProgress ? "En cours" : "En attente"}
                            </Badge>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            {stageDescriptions[i]}
                          </p>

                          {/* Progress Bar */}
                          <div className="flex items-center gap-3">
                            <Progress
                              value={stage.progress}
                              className={`h-2 flex-1 ${
                                isCompleted
                                  ? "[&>div]:bg-emerald-500"
                                  : isInProgress
                                    ? "[&>div]:bg-blue-500"
                                    : ""
                              }`}
                            />
                            <span className="text-xs font-medium text-muted-foreground w-10 text-right">
                              {stage.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Spacer for connector */}
                  {!isLast && <div className="h-2" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Overall Progress */}
        {pipeline.data && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Progression Globale</span>
                <span className="text-sm font-bold">
                  {Math.round(
                    pipeline.data.reduce((s, p) => s + p.progress, 0) / pipeline.data.length
                  )}
                  %
                </span>
              </div>
              <Progress
                value={Math.round(
                  pipeline.data.reduce((s, p) => s + p.progress, 0) / pipeline.data.length
                )}
                className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:via-blue-500 [&>div]:to-primary"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
