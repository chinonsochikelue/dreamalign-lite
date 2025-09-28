import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const generatePaths = mutation({
  args: {
    userId: v.id("users"),
    interests: v.array(v.string()),
    aiRecommendations: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
        matchScore: v.number(),
        skills: v.array(v.string()),
        jobTitles: v.array(v.string()),
        salaryRange: v.object({
          min: v.number(),
          max: v.number(),
          currency: v.string(),
        }),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const pathIds = []

    for (const recommendation of args.aiRecommendations) {
      // Find relevant courses for this career path
      const relevantCourses = await ctx.db.query("scrapedCourses").withIndex("by_skills").collect()

      const matchingCourses = relevantCourses
        .filter((course) =>
          course.skills.some((skill) =>
            recommendation.skills.some(
              (reqSkill) =>
                skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
                reqSkill.toLowerCase().includes(skill.toLowerCase()),
            ),
          ),
        )
        .slice(0, 5)
        .map((course) => ({
          title: course.title,
          provider: course.provider,
          url: course.url,
          duration: course.duration,
          level: course.level,
        }))

      const pathId = await ctx.db.insert("careerPaths", {
        userId: args.userId,
        title: recommendation.title,
        description: recommendation.description,
        matchScore: recommendation.matchScore,
        skills: recommendation.skills,
        courses: matchingCourses,
        jobTitles: recommendation.jobTitles,
        salaryRange: recommendation.salaryRange,
        createdAt: now,
      })

      pathIds.push(pathId)
    }

    return pathIds
  },
})

export const getUserPaths = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("careerPaths")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()
  },
})

export const getPath = query({
  args: { pathId: v.id("careerPaths") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.pathId)
  },
})
