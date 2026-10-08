import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/system-router";
import { publicProcedure, router } from "./_core/trpc";
import {
  getKPIs,
  getAllGovernorates,
  getSegments,
  getMonthlyTrends,
  getPipelineStages,
  getSentiments,
  getGovernorateBehaviors,
  getPredictions,
} from "./analytics-data";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  analytics: router({
    kpis: publicProcedure.query(() => getKPIs()),
    governorates: publicProcedure.query(() => getAllGovernorates()),
    segments: publicProcedure.query(() => getSegments()),
    monthlyTrends: publicProcedure.query(() => getMonthlyTrends()),
    pipelineStages: publicProcedure.query(() => getPipelineStages()),
    sentiments: publicProcedure.query(() => getSentiments()),
    governorateBehaviors: publicProcedure.query(() => getGovernorateBehaviors()),
    predictions: publicProcedure.query(() => getPredictions()),
  }),
});

// Trigger reload for predictions procedure
export type AppRouter = typeof appRouter;
