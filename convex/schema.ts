import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    imageUrl: v.string(),
    bio: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    goals: v.optional(v.array(v.string())),
    profileCompleted: v.optional(v.boolean()),
    profilePicture: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    experienceLevel: v.optional(v.string()),
    careerGoals: v.optional(v.array(v.string())),
    preferredLearningStyle: v.optional(v.string()),
    availabilityHours: v.optional(v.number()),
    onboardingStep: v.optional(v.number()),
    personalityType: v.optional(v.string()),
    personalityTraits: v.optional(v.array(v.string())),
    workPreferences: v.optional(
      v.union(
        v.array(v.string()),
        v.object({
          remoteWork: v.optional(v.boolean()),
          teamSize: v.optional(v.string()),
          workEnvironment: v.optional(v.string()),
          careerGoals: v.optional(v.array(v.string())),
        }),
      ),
    ),
    salaryExpectation: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
      }),
    ),
    location: v.optional(v.string()),
    remotePreference: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  careerPaths: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    matchScore: v.number(),
    skills: v.array(v.string()),
    courses: v.array(
      v.object({
        title: v.string(),
        provider: v.string(),
        url: v.string(),
        duration: v.string(),
        level: v.string(),
      }),
    ),
    jobTitles: v.array(v.string()),
    salaryRange: v.object({
      min: v.number(),
      max: v.number(),
      currency: v.string(),
    }),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  interviewSessions: defineTable({
    userId: v.id("users"),
    jobRole: v.string(),
    questions: v.array(
      v.object({
        question: v.string(),
        answer: v.optional(v.string()),
        feedback: v.optional(v.string()),
        score: v.optional(v.number()),
      }),
    ),
    overallScore: v.optional(v.number()),
    overallFeedback: v.optional(v.string()),
    status: v.union(v.literal("in-progress"), v.literal("completed")),
    sessionType: v.union(v.literal("text"), v.literal("voice")),
    duration: v.optional(v.number()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  videoInterviewSessions: defineTable({
    userId: v.id("users"),
    jobTitle: v.string(),
    jobDescription: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    vapiCallId: v.optional(v.string()),
    questions: v.array(
      v.object({
        question: v.string(),
        answer: v.optional(v.string()),
        audioUrl: v.optional(v.string()),
        feedback: v.optional(v.string()),
        score: v.optional(v.number()),
        timestamp: v.optional(v.number()),
      }),
    ),
    transcript: v.optional(v.string()),
    overallScore: v.optional(v.number()),
    overallFeedback: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("in-progress"), v.literal("completed"), v.literal("failed")),
    duration: v.optional(v.number()),
    recordingUrl: v.optional(v.string()),
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  userProgress: defineTable({
    userId: v.id("users"),
    totalInterviews: v.number(),
    averageScore: v.number(),
    improvementAreas: v.array(v.string()),
    strengths: v.array(v.string()),
    lastActivityAt: v.number(),
    streakDays: v.number(),
    achievements: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
        unlockedAt: v.number(),
        icon: v.string(),
      }),
    ),
  }).index("by_user", ["userId"]),

  scrapedJobs: defineTable({
    title: v.string(),
    company: v.string(),
    location: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    skills: v.array(v.string()),
    salaryRange: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
      }),
    ),
    url: v.string(),
    source: v.string(),
    scrapedAt: v.number(),
  }).index("by_skills", ["skills"]),

  scrapedCourses: defineTable({
    title: v.string(),
    provider: v.string(),
    description: v.string(),
    skills: v.array(v.string()),
    level: v.string(),
    duration: v.string(),
    price: v.optional(v.number()),
    rating: v.optional(v.number()),
    url: v.string(),
    scrapedAt: v.number(),
  }).index("by_skills", ["skills"]),

  analyticsEvents: defineTable({
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
    timestamp: v.number(),
    userAgent: v.optional(v.string()),
    ip: v.optional(v.string()),
    referrer: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_event_type", ["eventType"])
    .index("by_timestamp", ["timestamp"]),

  analyticsAiEvents: defineTable({
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
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId"])
    .index("by_provider", ["aiProvider"])
    .index("by_event_type", ["eventType"])
    .index("by_timestamp", ["timestamp"]),

  analyticsAlerts: defineTable({
    alertType: v.union(
      v.literal("error_spike"),
      v.literal("performance_degradation"),
      v.literal("user_drop_off"),
      v.literal("ai_cost_spike"),
    ),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    message: v.string(),
    data: v.any(),
    resolved: v.boolean(),
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
    notificationsSent: v.array(v.string()),
  })
    .index("by_severity", ["severity"])
    .index("by_resolved", ["resolved"]),
})
