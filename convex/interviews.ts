import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createSession = mutation({
  args: {
    userId: v.id("users"),
    jobRole: v.string(),
    sessionType: v.union(v.literal("text"), v.literal("voice")),
    questions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("interviewSessions", {
      userId: args.userId,
      jobRole: args.jobRole,
      questions: args.questions.map((q) => ({ question: q })),
      status: "in-progress",
      sessionType: args.sessionType,
      createdAt: Date.now(),
    })

    return sessionId
  },
})

export const submitAnswer = mutation({
  args: {
    sessionId: v.id("interviewSessions"),
    questionIndex: v.number(),
    answer: v.string(),
    feedback: v.string(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId)
    if (!session) throw new Error("Session not found")

    const updatedQuestions = [...session.questions]
    updatedQuestions[args.questionIndex] = {
      ...updatedQuestions[args.questionIndex],
      answer: args.answer,
      feedback: args.feedback,
      score: args.score,
    }

    await ctx.db.patch(args.sessionId, {
      questions: updatedQuestions,
    })
  },
})

export const completeSession = mutation({
  args: {
    sessionId: v.id("interviewSessions"),
    overallScore: v.number(),
    overallFeedback: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId)
    if (!session) throw new Error("Session not found")

    const now = Date.now()

    await ctx.db.patch(args.sessionId, {
      overallScore: args.overallScore,
      overallFeedback: args.overallFeedback,
      duration: args.duration,
      status: "completed",
      completedAt: now,
    })

    // Update user progress
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .first()

    if (progress) {
      const newTotalInterviews = progress.totalInterviews + 1
      const newAverageScore =
        (progress.averageScore * progress.totalInterviews + args.overallScore) / newTotalInterviews

      await ctx.db.patch(progress._id, {
        totalInterviews: newTotalInterviews,
        averageScore: newAverageScore,
        lastActivityAt: now,
      })
    }

    return args.sessionId
  },
})

export const getUserSessions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviewSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()
  },
})

export const getSession = query({
  args: { sessionId: v.id("interviewSessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId)
  },
})
