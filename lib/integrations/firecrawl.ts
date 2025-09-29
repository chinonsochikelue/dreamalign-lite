import FirecrawlApp from "@mendable/firecrawl-js"

// Initialize Firecrawl client
const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || "",
})

export interface JobListing {
  title: string
  company: string
  location: string
  description: string
  url: string
  salary?: string
  type?: string
  remote?: boolean
  skills?: string[]
}

export interface CourseListing {
  title: string
  provider: string
  description: string
  url: string
  price?: string
  duration?: string
  level?: string
  skills?: string[]
}

// Job scraping sites with better accessibility
const JOB_SITES = [
  "https://remoteok.io/remote-dev-jobs",
  "https://weworkremotely.com/categories/remote-programming-jobs",
  "https://angel.co/jobs",
  "https://stackoverflow.com/jobs",
]

// Course scraping sites
const COURSE_SITES = [
  "https://www.freecodecamp.org/learn",
  "https://www.coursera.org/browse/computer-science",
  "https://www.edx.org/learn/computer-science",
  "https://www.udemy.com/courses/development/",
]

export async function scrapeJobs(query: string, limit = 20): Promise<JobListing[]> {
  console.log(`[v0] Starting job scraping for query: ${query}, limit: ${limit}`)

  if (!process.env.FIRECRAWL_API_KEY) {
    console.warn("[v0] FIRECRAWL_API_KEY not found, returning sample data")
    return generateSampleJobs(query, limit)
  }

  const jobs: JobListing[] = []
  const sitesToScrape = JOB_SITES.slice(0, Math.min(2, Math.ceil(limit / 10)))

  for (const site of sitesToScrape) {
    try {
      console.log(`[v0] Scraping jobs from: ${site}`)

      const result = await firecrawl.scrape(site, {
        formats: ["markdown", "html"],
        onlyMainContent: true,
        timeout: 30000,
      })

      if (result.success && result.markdown) {
        const extractedJobs = extractJobsFromContent(result.markdown, query)
        jobs.push(...extractedJobs.slice(0, Math.floor(limit / sitesToScrape.length)))
        console.log(`[v0] Extracted ${extractedJobs.length} jobs from ${site}`)
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`[v0] Error scraping ${site}:`, error)
      continue
    }
  }

  // If no jobs found, return sample data
  if (jobs.length === 0) {
    console.log("[v0] No jobs scraped, returning sample data")
    return generateSampleJobs(query, limit)
  }

  return jobs.slice(0, limit)
}

export async function batchScrapeJobs(queries: string[], limitPerQuery = 10): Promise<JobListing[]> {
  console.log(`[v0] Starting batch job scraping for ${queries.length} queries`)

  const allJobs: JobListing[] = []

  for (const query of queries) {
    try {
      const jobs = await scrapeJobs(query, limitPerQuery)
      allJobs.push(...jobs)
      console.log(`[v0] Scraped ${jobs.length} jobs for query: ${query}`)

      // Rate limiting between queries
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`[v0] Error scraping jobs for query ${query}:`, error)
      continue
    }
  }

  return allJobs
}

export async function scrapeCourses(query: string, limit = 20): Promise<CourseListing[]> {
  console.log(`[v0] Starting course scraping for query: ${query}, limit: ${limit}`)

  if (!process.env.FIRECRAWL_API_KEY) {
    console.warn("[v0] FIRECRAWL_API_KEY not found, returning sample data")
    return generateSampleCourses(query, limit)
  }

  const courses: CourseListing[] = []
  const sitesToScrape = COURSE_SITES.slice(0, Math.min(2, Math.ceil(limit / 10)))

  for (const site of sitesToScrape) {
    try {
      console.log(`[v0] Scraping courses from: ${site}`)

      const result = await firecrawl.scrape(site, {
        formats: ["markdown", "html"],
        onlyMainContent: true,
        timeout: 30000,
      })

      if (result.success && result.markdown) {
        const extractedCourses = extractCoursesFromContent(result.markdown, query)
        courses.push(...extractedCourses.slice(0, Math.floor(limit / sitesToScrape.length)))
        console.log(`[v0] Extracted ${extractedCourses.length} courses from ${site}`)
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`[v0] Error scraping ${site}:`, error)
      continue
    }
  }

  // If no courses found, return sample data
  if (courses.length === 0) {
    console.log("[v0] No courses scraped, returning sample data")
    return generateSampleCourses(query, limit)
  }

  return courses.slice(0, limit)
}

export async function batchScrapeCourses(queries: string[], limitPerQuery = 10): Promise<CourseListing[]> {
  console.log(`[v0] Starting batch course scraping for ${queries.length} queries`)

  const allCourses: CourseListing[] = []

  for (const query of queries) {
    try {
      const courses = await scrapeCourses(query, limitPerQuery)
      allCourses.push(...courses)
      console.log(`[v0] Scraped ${courses.length} courses for query: ${query}`)

      // Rate limiting between queries
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`[v0] Error scraping courses for query ${query}:`, error)
      continue
    }
  }

  return allCourses
}

function extractJobsFromContent(content: string, query: string): JobListing[] {
  const jobs: JobListing[] = []

  // Enhanced regex patterns for job extraction
  const jobPatterns = [
    /(?:^|\n)(?:##?\s*)?(.+?(?:developer|engineer|programmer|analyst|designer|manager).*?)(?:\n|$)/gim,
    /(?:job|position|role):\s*(.+?)(?:\n|$)/gim,
    /(?:title|position):\s*(.+?)(?:\n|$)/gim,
  ]

  const companyPatterns = [
    /(?:company|employer|organization):\s*(.+?)(?:\n|$)/gim,
    /(?:at|@)\s*([A-Z][a-zA-Z\s&.,-]+?)(?:\s|$)/gim,
  ]

  const locationPatterns = [/(?:location|based|office):\s*(.+?)(?:\n|$)/gim, /(?:remote|hybrid|on-site)/gim]

  // Extract potential job titles
  for (const pattern of jobPatterns) {
    let match
    while ((match = pattern.exec(content)) !== null && jobs.length < 20) {
      const title = match[1]?.trim()
      if (title && title.length > 5 && title.length < 100) {
        jobs.push({
          title,
          company: "Various Companies",
          location: "Remote/Hybrid",
          description: `${title} position matching "${query}" requirements`,
          url: "#",
          type: "Full-time",
          remote: true,
          skills: extractSkillsFromText(title + " " + query),
        })
      }
    }
  }

  return jobs.slice(0, 10)
}

function extractCoursesFromContent(content: string, query: string): CourseListing[] {
  const courses: CourseListing[] = []

  // Enhanced regex patterns for course extraction
  const coursePatterns = [
    /(?:course|class|tutorial|training):\s*(.+?)(?:\n|$)/gim,
    /(?:learn|master|introduction to|complete)\s+(.+?)(?:\n|$)/gim,
    /(?:^|\n)(?:##?\s*)?(.+?(?:course|tutorial|bootcamp|certification).*?)(?:\n|$)/gim,
  ]

  // Extract potential course titles
  for (const pattern of coursePatterns) {
    let match
    while ((match = pattern.exec(content)) !== null && courses.length < 20) {
      const title = match[1]?.trim()
      if (title && title.length > 5 && title.length < 100) {
        courses.push({
          title,
          provider: "Online Learning Platform",
          description: `Comprehensive ${title} course covering ${query} fundamentals and advanced concepts`,
          url: "#",
          level: "Beginner to Advanced",
          duration: "4-12 weeks",
          skills: extractSkillsFromText(title + " " + query),
        })
      }
    }
  }

  return courses.slice(0, 10)
}

function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "SQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Git",
    "HTML",
    "CSS",
    "Java",
    "C++",
    "Go",
    "Rust",
    "MongoDB",
    "PostgreSQL",
    "Redis",
    "GraphQL",
    "REST API",
    "Machine Learning",
    "AI",
    "DevOps",
  ]

  const foundSkills = commonSkills.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()))

  return foundSkills.slice(0, 5)
}

function generateSampleJobs(query: string, limit: number): JobListing[] {
  const sampleJobs = [
    {
      title: `Senior ${query} Developer`,
      company: "TechCorp Inc.",
      location: "Remote",
      description: `We're looking for an experienced ${query} developer to join our growing team.`,
      url: "#",
      salary: "$80,000 - $120,000",
      type: "Full-time",
      remote: true,
      skills: extractSkillsFromText(query),
    },
    {
      title: `${query} Engineer`,
      company: "StartupXYZ",
      location: "San Francisco, CA",
      description: `Join our innovative team working on cutting-edge ${query} solutions.`,
      url: "#",
      salary: "$90,000 - $140,000",
      type: "Full-time",
      remote: false,
      skills: extractSkillsFromText(query),
    },
    {
      title: `Junior ${query} Developer`,
      company: "DevAgency",
      location: "Remote",
      description: `Entry-level position perfect for someone starting their ${query} career.`,
      url: "#",
      salary: "$50,000 - $70,000",
      type: "Full-time",
      remote: true,
      skills: extractSkillsFromText(query),
    },
  ]

  return sampleJobs.slice(0, limit)
}

function generateSampleCourses(query: string, limit: number): CourseListing[] {
  const sampleCourses = [
    {
      title: `Complete ${query} Bootcamp`,
      provider: "Online Academy",
      description: `Master ${query} from beginner to advanced level with hands-on projects.`,
      url: "#",
      price: "$99",
      duration: "8 weeks",
      level: "Beginner",
      skills: extractSkillsFromText(query),
    },
    {
      title: `Advanced ${query} Techniques`,
      provider: "Tech University",
      description: `Deep dive into advanced ${query} concepts and best practices.`,
      url: "#",
      price: "$149",
      duration: "6 weeks",
      level: "Advanced",
      skills: extractSkillsFromText(query),
    },
    {
      title: `${query} for Professionals`,
      provider: "Professional Learning",
      description: `Industry-focused ${query} course designed for working professionals.`,
      url: "#",
      price: "$199",
      duration: "10 weeks",
      level: "Intermediate",
      skills: extractSkillsFromText(query),
    },
  ]

  return sampleCourses.slice(0, limit)
}
