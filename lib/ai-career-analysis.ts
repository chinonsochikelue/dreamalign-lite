import { CAREER_ANALYSIS_PROMPT } from "./ai-prompts"

// Mock AI analysis function - in real app, this would call OpenAI API
export async function generateCareerPaths(interests: string[]): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock career paths based on interests
  const mockPaths = [
    {
      id: "full-stack-dev",
      title: "Full Stack Developer",
      description:
        "Build end-to-end web applications using modern frameworks and technologies. Work on both frontend user interfaces and backend systems.",
      matchScore: 95,
      skills: ["JavaScript", "React", "Node.js", "TypeScript", "SQL", "Git", "AWS", "REST APIs"],
      jobTitles: ["Full Stack Developer", "Software Engineer", "Web Developer", "Frontend Developer"],
      salaryRange: { min: 75000, max: 130000, currency: "USD" },
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
        {
          title: "Node.js Developer Course",
          provider: "Coursera",
          url: "#",
          duration: "40 hours",
          level: "Intermediate",
        },
      ],
    },
    {
      id: "ai-engineer",
      title: "AI/ML Engineer",
      description:
        "Design and implement machine learning models and AI systems. Work with large datasets and cutting-edge AI technologies.",
      matchScore: 92,
      skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "Statistics", "SQL", "Docker"],
      jobTitles: ["AI Engineer", "Machine Learning Engineer", "Data Scientist", "ML Researcher"],
      salaryRange: { min: 90000, max: 160000, currency: "USD" },
      courses: [
        {
          title: "Machine Learning Specialization",
          provider: "Coursera",
          url: "#",
          duration: "3 months",
          level: "Intermediate",
        },
        {
          title: "Deep Learning with PyTorch",
          provider: "edX",
          url: "#",
          duration: "8 weeks",
          level: "Advanced",
        },
        {
          title: "AI for Everyone",
          provider: "Coursera",
          url: "#",
          duration: "4 weeks",
          level: "Beginner",
        },
      ],
    },
    {
      id: "product-manager",
      title: "Product Manager",
      description:
        "Lead product strategy and development. Work with cross-functional teams to bring innovative products to market.",
      matchScore: 87,
      skills: [
        "Product Strategy",
        "User Research",
        "Analytics",
        "Agile",
        "Communication",
        "Market Analysis",
        "Roadmapping",
        "Leadership",
      ],
      jobTitles: ["Product Manager", "Senior Product Manager", "Product Owner", "VP of Product"],
      salaryRange: { min: 85000, max: 150000, currency: "USD" },
      courses: [
        {
          title: "Product Management Fundamentals",
          provider: "LinkedIn Learning",
          url: "#",
          duration: "6 hours",
          level: "Beginner",
        },
        {
          title: "Google Analytics Certification",
          provider: "Google",
          url: "#",
          duration: "4 hours",
          level: "Intermediate",
        },
        {
          title: "Agile Product Management",
          provider: "Udemy",
          url: "#",
          duration: "12 hours",
          level: "Intermediate",
        },
      ],
    },
  ]

  // Filter and sort based on interests
  return mockPaths.sort((a, b) => b.matchScore - a.matchScore)
}

// Mock function to analyze interests with AI
export async function analyzeInterestsWithAI(interests: string[]): Promise<string> {
  const prompt = CAREER_ANALYSIS_PROMPT.replace("{interests}", interests.join(", "))

  // In real implementation, this would call OpenAI API
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: [{ role: "user", content: prompt }],
  //   temperature: 0.7,
  // })

  // return response.choices[0].message.content || ""

  return "Mock AI analysis complete"
}
