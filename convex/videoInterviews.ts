import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create a new video interview session
export const createVideoInterview = mutation({
  args: {
    userId: v.id("users"),
    jobTitle: v.string(),
    jobDescription: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("videoInterviewSessions", {
      userId: args.userId,
      jobTitle: args.jobTitle,
      jobDescription: args.jobDescription,
      resumeUrl: args.resumeUrl,
      questions: [],
      status: "pending",
      createdAt: Date.now(),
    })

    return sessionId
  },
})

// Get video interview session by ID
export const getVideoInterview = query({
  args: { sessionId: v.id("videoInterviewSessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId)
    return session
  },
})

// Get all video interviews for a user
export const getUserVideoInterviews = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("videoInterviewSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()

    return sessions
  },
})

// Update video interview with Vapi call ID
export const updateVapiCallId = mutation({
  args: {
    sessionId: v.id("videoInterviewSessions"),
    vapiCallId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      vapiCallId: args.vapiCallId,
      status: "in-progress",
      startedAt: Date.now(),
    })
  },
})

// Add question and answer to video interview
export const addQuestionAnswer = mutation({
  args: {
    sessionId: v.id("videoInterviewSessions"),
    question: v.string(),
    answer: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    feedback: v.optional(v.string()),
    score: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId)
    if (!session) throw new Error("Session not found")

    const updatedQuestions = [
      ...session.questions,
      {
        question: args.question,
        answer: args.answer,
        audioUrl: args.audioUrl,
        feedback: args.feedback,
        score: args.score,
        timestamp: Date.now(),
      },
    ]

    await ctx.db.patch(args.sessionId, {
      questions: updatedQuestions,
    })
  },
})

// Complete video interview session
export const completeVideoInterview = mutation({
  args: {
    sessionId: v.id("videoInterviewSessions"),
    transcript: v.optional(v.string()),
    overallScore: v.optional(v.number()),
    overallFeedback: v.optional(v.string()),
    duration: v.optional(v.number()),
    recordingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      transcript: args.transcript,
      overallScore: args.overallScore,
      overallFeedback: args.overallFeedback,
      duration: args.duration,
      recordingUrl: args.recordingUrl,
      status: "completed",
      completedAt: Date.now(),
    })

    // Update user progress
    const session = await ctx.db.get(args.sessionId)
    if (session) {
      const userProgress = await ctx.db
        .query("userProgress")
        .withIndex("by_user", (q) => q.eq("userId", session.userId))
        .first()

      if (userProgress && args.overallScore) {
        const newTotal = userProgress.totalInterviews + 1
        const newAverage = (userProgress.averageScore * userProgress.totalInterviews + args.overallScore) / newTotal

        await ctx.db.patch(userProgress._id, {
          totalInterviews: newTotal,
          averageScore: newAverage,
          lastActivityAt: Date.now(),
        })
      }
    }
  },
})

// Update video interview status
export const updateVideoInterviewStatus = mutation({
  args: {
    sessionId: v.id("videoInterviewSessions"),
    status: v.union(v.literal("pending"), v.literal("in-progress"), v.literal("completed"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      status: args.status,
    })
  },
})
