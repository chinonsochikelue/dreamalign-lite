import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getUserProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()
  },
})

export const updateStrengthsAndAreas = mutation({
  args: {
    userId: v.id("users"),
    strengths: v.array(v.string()),
    improvementAreas: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()

    if (progress) {
      await ctx.db.patch(progress._id, {
        strengths: args.strengths,
        improvementAreas: args.improvementAreas,
      })
    }
  },
})

export const addAchievement = mutation({
  args: {
    userId: v.id("users"),
    achievement: v.object({
      title: v.string(),
      description: v.string(),
      icon: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()

    if (progress) {
      const newAchievement = {
        ...args.achievement,
        unlockedAt: Date.now(),
      }

      await ctx.db.patch(progress._id, {
        achievements: [...progress.achievements, newAchievement],
      })
    }
  },
})

export const updateStreak = mutation({
  args: {
    userId: v.id("users"),
    streakDays: v.number(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()

    if (progress) {
      await ctx.db.patch(progress._id, {
        streakDays: args.streakDays,
        lastActivityAt: Date.now(),
      })
    }
  },
})
