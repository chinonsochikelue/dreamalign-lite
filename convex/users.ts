import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const CreateNewUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existingUser) {
      throw new Error("User already exists")
    }

    const now = Date.now()
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      imageUrl: args?.imageUrl,
      interests: [],
      profileCompleted: false,
      createdAt: now,
      updatedAt: now,
    })

    // Initialize user progress
    await ctx.db.insert("userProgress", {
      userId,
      totalInterviews: 0,
      averageScore: 0,
      improvementAreas: [],
      strengths: [],
      lastActivityAt: now,
      streakDays: 0,
      achievements: [],
    })

    return userId
  },
})

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()
  },
})

export const updateInterests = mutation({
  args: {
    userId: v.id("users"),
    interests: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      interests: args.interests,
      profileCompleted: true,
      updatedAt: Date.now(),
    })
  },
})

export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user) return null

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()

    return {
      ...user,
      progress,
    }
  },
})
