import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const trackEvent = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.string(),
    eventType: v.string(),
    eventName: v.string(),
    properties: v.object({
      page: v.optional(v.string()),
      component: v.optional(v.string()),
      action: v.optional(v.string()),
      value: v.optional(v.any()),
      metadata: v.optional(v.any()),
    }),
    userAgent: v.optional(v.string()),
    ip: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyticsEvents", {
      ...args,
      timestamp: Date.now(),
    })
  },
})

export const trackAiEvent = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.string(),
    aiProvider: v.string(),
    model: v.string(),
    eventType: v.union(
      v.literal("generation_start"),
      v.literal("generation_complete"),
      v.literal("generation_error"),
      v.literal("feedback_received"),
    ),
    inputTokens: v.optional(v.number()),
    outputTokens: v.optional(v.number()),
    latency: v.optional(v.number()),
    cost: v.optional(v.number()),
    quality: v.optional(v.number()),
    feedback: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyticsAiEvents", {
      ...args,
      timestamp: Date.now(),
    })
  },
})

export const createAlert = mutation({
  args: {
    alertType: v.union(
      v.literal("error_spike"),
      v.literal("performance_degradation"),
      v.literal("user_drop_off"),
      v.literal("ai_cost_spike"),
    ),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    message: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyticsAlerts", {
      ...args,
      resolved: false,
      createdAt: Date.now(),
      notificationsSent: [],
    })
  },
})

export const getEventsByUser = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analyticsEvents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 100)
  },
})

export const getAiEventsByUser = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analyticsAiEvents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 100)
  },
})

export const getUnresolvedAlerts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("analyticsAlerts")
      .withIndex("by_resolved", (q) => q.eq("resolved", false))
      .order("desc")
  },
})

export const getEventStats = query({
  args: {
    startTime: v.number(),
    endTime: v.number(),
    eventType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("analyticsEvents")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", args.startTime).lte("timestamp", args.endTime))

    const events = await query.collect()

    const filteredEvents = args.eventType ? events.filter((e) => e.eventType === args.eventType) : events

    return {
      totalEvents: filteredEvents.length,
      uniqueUsers: new Set(filteredEvents.map((e) => e.userId).filter(Boolean)).size,
      uniqueSessions: new Set(filteredEvents.map((e) => e.sessionId)).size,
      eventTypes: Object.entries(
        filteredEvents.reduce(
          (acc, e) => {
            acc[e.eventType] = (acc[e.eventType] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      ).map(([type, count]) => ({ type, count })),
    }
  },
})
