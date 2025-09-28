import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    imageUrl: v.string(),
    interests: v.optional(v.array(v.string())),
    profileCompleted: v.optional(v.boolean()),
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
})
