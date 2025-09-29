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
      return existingUser
    }

    const now = Date.now()
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      imageUrl: args?.imageUrl,
      interests: [],
      profileCompleted: false,
      onboardingStep: 1,
      skills: [],
      experienceLevel: undefined,
      careerGoals: [],
      preferredLearningStyle: undefined,
      availabilityHours: undefined,
      personalityType: undefined,
      workPreferences: [],
      salaryExpectation: undefined,
      location: undefined,
      remotePreference: undefined,
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

    const newUser = await ctx.db.get(userId)
    return newUser
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

export const completeOnboarding = mutation({
  args: {
    userId: v.id("users"),
    interests: v.array(v.string()),
    skills: v.optional(v.array(v.string())),
    experienceLevel: v.optional(v.string()),
    careerGoals: v.optional(v.array(v.string())),
    preferredLearningStyle: v.optional(v.string()),
    availabilityHours: v.optional(v.number()),
    personalityType: v.optional(v.string()),
    workPreferences: v.optional(v.array(v.string())),
    salaryExpectation: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
      }),
    ),
    location: v.optional(v.string()),
    remotePreference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...userData } = args

    await ctx.db.patch(userId, {
      ...userData,
      profileCompleted: true,
      onboardingStep: 5,
      updatedAt: Date.now(),
    })

    // Return updated user
    return await ctx.db.get(userId)
  },
})

export const getOnboardingStatus = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    return {
      exists: !!user,
      profileCompleted: user?.profileCompleted || false,
      onboardingStep: user?.onboardingStep || 1,
      userId: user?._id,
      userData: user,
    }
  },
})

export const updateOnboardingStep = mutation({
  args: {
    userId: v.id("users"),
    step: v.number(),
    data: v.object({
      interests: v.optional(v.array(v.string())),
      skills: v.optional(v.array(v.string())),
      experienceLevel: v.optional(v.string()),
      careerGoals: v.optional(v.array(v.string())),
      preferredLearningStyle: v.optional(v.string()),
      availabilityHours: v.optional(v.number()),
      personalityType: v.optional(v.string()),
      workPreferences: v.optional(v.array(v.string())),
      salaryExpectation: v.optional(
        v.object({
          min: v.number(),
          max: v.number(),
          currency: v.string(),
        }),
      ),
      location: v.optional(v.string()),
      remotePreference: v.optional(v.string()),
      profilePicture: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const updateData = {
      onboardingStep: args.step,
      updatedAt: Date.now(),
      ...args.data,
    }

    // If this is the final step, mark profile as completed
    if (args.step >= 5) {
      updateData.profileCompleted = true
    }

    await ctx.db.patch(args.userId, updateData)
    return await ctx.db.get(args.userId)
  },
})

export const getCareerRecommendations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user || !user.profileCompleted) return []

    // Get existing career paths for this user
    const existingPaths = await ctx.db
      .query("careerPaths")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    return existingPaths
  },
})

export const generateCareerPaths = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user || !user.profileCompleted) return []

    // Generate career paths based on user interests and skills
    const careerPaths = generateCareerPathsFromProfile(user)

    const now = Date.now()
    const createdPaths = []

    for (const path of careerPaths) {
      const pathId = await ctx.db.insert("careerPaths", {
        userId: args.userId,
        ...path,
        createdAt: now,
      })
      const createdPath = await ctx.db.get(pathId)
      createdPaths.push(createdPath)
    }

    return createdPaths
  },
})

// Helper function to generate career paths based on user profile
function generateCareerPathsFromProfile(user: any) {
  const careerPathTemplates = [
    {
      title: "Full Stack Developer",
      description: "Build end-to-end web applications using modern technologies",
      matchScore: calculateMatchScore(user.interests, ["web-dev", "ai"]),
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
      courses: [
        {
          title: "Complete Web Development Bootcamp",
          provider: "Udemy",
          url: "#",
          duration: "65 hours",
          level: "Beginner to Advanced",
        },
        {
          title: "React - The Complete Guide",
          provider: "Udemy",
          url: "#",
          duration: "48 hours",
          level: "Intermediate",
        },
      ],
      jobTitles: ["Full Stack Developer", "Web Developer", "Software Engineer"],
      salaryRange: { min: 70000, max: 120000, currency: "USD" },
    },
    {
      title: "AI/ML Engineer",
      description: "Develop intelligent systems and machine learning models",
      matchScore: calculateMatchScore(user.interests, ["ai", "data-science"]),
      skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning"],
      courses: [
        {
          title: "Machine Learning A-Z",
          provider: "Udemy",
          url: "#",
          duration: "44 hours",
          level: "Beginner to Advanced",
        },
        {
          title: "Deep Learning Specialization",
          provider: "Coursera",
          url: "#",
          duration: "3 months",
          level: "Intermediate",
        },
      ],
      jobTitles: ["AI Engineer", "ML Engineer", "Data Scientist"],
      salaryRange: { min: 90000, max: 150000, currency: "USD" },
    },
    {
      title: "Product Manager",
      description: "Lead product strategy and development from conception to launch",
      matchScore: calculateMatchScore(user.interests, ["product", "design"]),
      skills: ["Product Strategy", "User Research", "Analytics", "Agile", "Leadership"],
      courses: [
        {
          title: "Product Management Fundamentals",
          provider: "Coursera",
          url: "#",
          duration: "6 weeks",
          level: "Beginner",
        },
        {
          title: "Advanced Product Management",
          provider: "Udacity",
          url: "#",
          duration: "4 months",
          level: "Advanced",
        },
      ],
      jobTitles: ["Product Manager", "Senior Product Manager", "Product Owner"],
      salaryRange: { min: 80000, max: 140000, currency: "USD" },
    },
  ]

  return careerPathTemplates
    .filter((path) => path.matchScore > 60)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
}

function calculateMatchScore(userInterests: string[] = [], pathInterests: string[]): number {
  if (!userInterests.length) return 70 // Default score if no interests

  const matches = userInterests.filter((interest) => pathInterests.includes(interest))
  const baseScore = (matches.length / pathInterests.length) * 100

  // Add some randomization for variety
  const variation = Math.random() * 20 - 10
  return Math.max(60, Math.min(100, Math.round(baseScore + variation)))
}
