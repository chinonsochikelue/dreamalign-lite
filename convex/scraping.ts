import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const addScrapedJobs = mutation({
  args: {
    jobs: v.array(
      v.object({
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
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const jobIds = []

    for (const job of args.jobs) {
      const jobId = await ctx.db.insert("scrapedJobs", {
        ...job,
        scrapedAt: now,
      })
      jobIds.push(jobId)
    }

    return jobIds
  },
})

export const addScrapedCourses = mutation({
  args: {
    courses: v.array(
      v.object({
        title: v.string(),
        provider: v.string(),
        description: v.string(),
        skills: v.array(v.string()),
        level: v.string(),
        duration: v.string(),
        price: v.optional(v.number()),
        rating: v.optional(v.number()),
        url: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const courseIds = []

    for (const course of args.courses) {
      const courseId = await ctx.db.insert("scrapedCourses", {
        ...course,
        scrapedAt: now,
      })
      courseIds.push(courseId)
    }

    return courseIds
  },
})

export const getJobsBySkills = query({
  args: { skills: v.array(v.string()) },
  handler: async (ctx, args) => {
    const allJobs = await ctx.db.query("scrapedJobs").collect()

    return allJobs
      .filter((job) =>
        job.skills.some((skill) =>
          args.skills.some(
            (userSkill) =>
              skill.toLowerCase().includes(userSkill.toLowerCase()) ||
              userSkill.toLowerCase().includes(skill.toLowerCase()),
          ),
        ),
      )
      .slice(0, 20)
  },
})

export const getCoursesBySkills = query({
  args: { skills: v.array(v.string()) },
  handler: async (ctx, args) => {
    const allCourses = await ctx.db.query("scrapedCourses").collect()

    return allCourses
      .filter((course) =>
        course.skills.some((skill) =>
          args.skills.some(
            (userSkill) =>
              skill.toLowerCase().includes(userSkill.toLowerCase()) ||
              userSkill.toLowerCase().includes(skill.toLowerCase()),
          ),
        ),
      )
      .slice(0, 15)
  },
})
