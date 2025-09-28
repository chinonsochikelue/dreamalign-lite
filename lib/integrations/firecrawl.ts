// Mock Firecrawl integration for scraping job and course data
export interface ScrapedJob {
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  skills: string[]
  salaryRange?: {
    min: number
    max: number
    currency: string
  }
  url: string
}

export interface ScrapedCourse {
  title: string
  provider: string
  description: string
  skills: string[]
  level: string
  duration: string
  price?: number
  rating?: number
  url: string
}

// Mock function to scrape job data
export async function scrapeJobs(query: string, limit = 20): Promise<ScrapedJob[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock job data based on query
  const mockJobs: ScrapedJob[] = [
    {
      title: "Senior Full Stack Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      description: "We're looking for a senior full stack developer to join our growing team...",
      requirements: ["5+ years experience", "React/Node.js", "TypeScript", "AWS"],
      skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
      salaryRange: { min: 120000, max: 160000, currency: "USD" },
      url: "https://example.com/job/1",
    },
    {
      title: "AI/ML Engineer",
      company: "DataTech Solutions",
      location: "New York, NY",
      description: "Join our AI team to build cutting-edge machine learning solutions...",
      requirements: ["3+ years ML experience", "Python", "TensorFlow/PyTorch", "Statistics"],
      skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Statistics", "Docker"],
      salaryRange: { min: 130000, max: 180000, currency: "USD" },
      url: "https://example.com/job/2",
    },
    {
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Austin, TX",
      description: "Lead product strategy and development for our SaaS platform...",
      requirements: ["3+ years PM experience", "Agile methodology", "Analytics", "Leadership"],
      skills: ["Product Strategy", "Agile", "Analytics", "Leadership", "User Research", "Roadmapping"],
      salaryRange: { min: 110000, max: 150000, currency: "USD" },
      url: "https://example.com/job/3",
    },
  ]

  // Filter based on query
  return mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(query.toLowerCase())),
  )
}

// Mock function to scrape course data
export async function scrapeCourses(query: string, limit = 15): Promise<ScrapedCourse[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Mock course data
  const mockCourses: ScrapedCourse[] = [
    {
      title: "Complete Web Development Bootcamp",
      provider: "Udemy",
      description: "Learn full stack web development from scratch...",
      skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
      level: "Beginner",
      duration: "65 hours",
      price: 89.99,
      rating: 4.7,
      url: "https://udemy.com/course/web-dev",
    },
    {
      title: "Machine Learning Specialization",
      provider: "Coursera",
      description: "Master machine learning fundamentals and advanced techniques...",
      skills: ["Python", "Machine Learning", "TensorFlow", "Statistics", "Deep Learning"],
      level: "Intermediate",
      duration: "3 months",
      price: 49.99,
      rating: 4.9,
      url: "https://coursera.org/specializations/ml",
    },
    {
      title: "Product Management Fundamentals",
      provider: "LinkedIn Learning",
      description: "Learn the essentials of product management...",
      skills: ["Product Strategy", "User Research", "Analytics", "Roadmapping", "Agile"],
      level: "Beginner",
      duration: "6 hours",
      rating: 4.5,
      url: "https://linkedin.com/learning/pm-fundamentals",
    },
  ]

  return mockCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.skills.some((skill) => skill.toLowerCase().includes(query.toLowerCase())),
  )
}
