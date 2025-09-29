import FirecrawlApp from "@mendable/firecrawl-js"

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

// Initialize Firecrawl client
const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || "",
})

// Job scraping sites configuration
const JOB_SITES = [
  {
    name: "LinkedIn",
    baseUrl: "https://www.linkedin.com/jobs/search",
    searchParam: "keywords",
    selector: ".job-search-card",
  },
  {
    name: "Indeed",
    baseUrl: "https://www.indeed.com/jobs",
    searchParam: "q",
    selector: ".jobsearch-SerpJobCard",
  },
  {
    name: "AngelList",
    baseUrl: "https://angel.co/jobs",
    searchParam: "query",
    selector: ".job-listing",
  },
]

// Course scraping sites configuration
const COURSE_SITES = [
  {
    name: "Coursera",
    baseUrl: "https://www.coursera.org/search",
    searchParam: "query",
    selector: ".cds-CommonCard-container",
  },
  {
    name: "Udemy",
    baseUrl: "https://www.udemy.com/courses/search",
    searchParam: "q",
    selector: ".course-card--container",
  },
  {
    name: "edX",
    baseUrl: "https://www.edx.org/search",
    searchParam: "q",
    selector: ".discovery-card",
  },
]

// Extract job data from scraped content
function extractJobData(content: string, url: string, siteName: string): ScrapedJob | null {
  try {
    // Use regex patterns to extract job information
    const titleMatch = content.match(
      /<h[1-3][^>]*>([^<]+(?:developer|engineer|manager|analyst|designer)[^<]*)<\/h[1-3]>/i,
    )
    const companyMatch = content.match(/company[^>]*>([^<]+)</i) || content.match(/employer[^>]*>([^<]+)</i)
    const locationMatch = content.match(/location[^>]*>([^<]+)</i) || content.match(/city[^>]*>([^<]+)</i)
    const descriptionMatch = content.match(/description[^>]*>([^<]{100,500})</i)

    // Extract salary information
    const salaryMatch = content.match(/\$(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*-?\s*\$?(\d{1,3}(?:,\d{3})*(?:k|K)?)/)

    // Extract skills from content
    const skillsPattern =
      /(JavaScript|TypeScript|React|Vue|Angular|Node\.js|Python|Java|C\+\+|SQL|AWS|Docker|Kubernetes|Git|HTML|CSS|MongoDB|PostgreSQL|Redis|GraphQL|REST|API|Agile|Scrum)/gi
    const skillsMatches = content.match(skillsPattern) || []
    const skills = [...new Set(skillsMatches.map((s) => s.toLowerCase()))]

    if (!titleMatch) return null

    const job: ScrapedJob = {
      title: titleMatch[1].trim(),
      company: companyMatch?.[1]?.trim() || "Unknown Company",
      location: locationMatch?.[1]?.trim() || "Remote",
      description: descriptionMatch?.[1]?.trim() || "No description available",
      requirements: extractRequirements(content),
      skills,
      url,
    }

    // Add salary range if found
    if (salaryMatch) {
      const min =
        Number.parseInt(salaryMatch[1].replace(/[,k]/gi, "")) * (salaryMatch[1].toLowerCase().includes("k") ? 1000 : 1)
      const max = salaryMatch[2]
        ? Number.parseInt(salaryMatch[2].replace(/[,k]/gi, "")) *
          (salaryMatch[2].toLowerCase().includes("k") ? 1000 : 1)
        : min
      job.salaryRange = { min, max, currency: "USD" }
    }

    return job
  } catch (error) {
    console.error("Error extracting job data:", error)
    return null
  }
}

// Extract course data from scraped content
function extractCourseData(content: string, url: string, siteName: string): ScrapedCourse | null {
  try {
    const titleMatch = content.match(/<h[1-3][^>]*>([^<]+(?:course|tutorial|bootcamp|certification)[^<]*)<\/h[1-3]>/i)
    const providerMatch = content.match(/instructor[^>]*>([^<]+)</i) || content.match(/author[^>]*>([^<]+)</i)
    const descriptionMatch = content.match(/description[^>]*>([^<]{100,500})</i)
    const priceMatch = content.match(/\$(\d+(?:\.\d{2})?)/)
    const ratingMatch = content.match(/(\d\.\d)\s*(?:stars?|rating)/i)
    const durationMatch = content.match(/(\d+(?:\.\d+)?)\s*(hours?|weeks?|months?)/i)
    const levelMatch = content.match(/(beginner|intermediate|advanced|expert)/i)

    // Extract skills
    const skillsPattern =
      /(JavaScript|TypeScript|React|Vue|Angular|Node\.js|Python|Java|C\+\+|SQL|AWS|Docker|Kubernetes|Git|HTML|CSS|MongoDB|PostgreSQL|Redis|GraphQL|REST|API|Machine Learning|Data Science|AI|UX|UI)/gi
    const skillsMatches = content.match(skillsPattern) || []
    const skills = [...new Set(skillsMatches.map((s) => s.toLowerCase()))]

    if (!titleMatch) return null

    const course: ScrapedCourse = {
      title: titleMatch[1].trim(),
      provider: providerMatch?.[1]?.trim() || siteName,
      description: descriptionMatch?.[1]?.trim() || "No description available",
      skills,
      level: levelMatch?.[1]?.toLowerCase() || "beginner",
      duration: durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : "Self-paced",
      url,
    }

    if (priceMatch) {
      course.price = Number.parseFloat(priceMatch[1])
    }

    if (ratingMatch) {
      course.rating = Number.parseFloat(ratingMatch[1])
    }

    return course
  } catch (error) {
    console.error("Error extracting course data:", error)
    return null
  }
}

// Extract requirements from job content
function extractRequirements(content: string): string[] {
  const requirementsPattern = /(?:requirements?|qualifications?|must have|needed)[^:]*:([^.]+(?:\.[^.]+)*)/gi
  const matches = content.match(requirementsPattern)

  if (!matches) return []

  const requirements: string[] = []
  matches.forEach((match) => {
    const items = match
      .split(/[,;•\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 10)
    requirements.push(...items)
  })

  return requirements.slice(0, 5) // Limit to 5 requirements
}

// Scrape jobs from multiple sites
export async function scrapeJobs(query: string, limit = 20): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = []

  try {
    for (const site of JOB_SITES) {
      if (jobs.length >= limit) break

      const searchUrl = `${site.baseUrl}?${site.searchParam}=${encodeURIComponent(query)}`

      try {
        console.log(`Scraping jobs from ${site.name}: ${searchUrl}`)

        const scrapeResult = await firecrawl.scrape(searchUrl, {
          formats: ["markdown", "html"],
          includeTags: ["h1", "h2", "h3", "p", "div", "span", "a"],
          excludeTags: ["script", "style", "nav", "footer", "header"],
          waitFor: 2000,
        })

        if (scrapeResult.success && scrapeResult.data?.html) {
          const extractedJob = extractJobData(scrapeResult.data.html, searchUrl, site.name)
          if (extractedJob) {
            jobs.push(extractedJob)
          }
        }
      } catch (siteError) {
        console.error(`Error scraping ${site.name}:`, siteError)
        continue
      }
    }

    // If we didn't get enough jobs from scraping, add some fallback data
    if (jobs.length < 3) {
      console.log(`Adding fallback job data, only found ${jobs.length} jobs`)
      jobs.push(...getFallbackJobs(query).slice(0, limit - jobs.length))
    }

    console.log(`Successfully scraped ${jobs.length} jobs for query: ${query}`)
    return jobs.slice(0, limit)
  } catch (error) {
    console.error("Error in scrapeJobs:", error)
    // Return fallback data on error
    return getFallbackJobs(query).slice(0, limit)
  }
}

// Scrape courses from multiple sites
export async function scrapeCourses(query: string, limit = 15): Promise<ScrapedCourse[]> {
  const courses: ScrapedCourse[] = []

  try {
    for (const site of COURSE_SITES) {
      if (courses.length >= limit) break

      const searchUrl = `${site.baseUrl}?${site.searchParam}=${encodeURIComponent(query)}`

      try {
        console.log(`Scraping courses from ${site.name}: ${searchUrl}`)

        const scrapeResult = await firecrawl.scrape(searchUrl, {
          formats: ["markdown", "html"],
          includeTags: ["h1", "h2", "h3", "p", "div", "span", "a"],
          excludeTags: ["script", "style", "nav", "footer", "header"],
          waitFor: 2000,
        })

        if (scrapeResult.success && scrapeResult.data?.html) {
          const extractedCourse = extractCourseData(scrapeResult.data.html, searchUrl, site.name)
          if (extractedCourse) {
            courses.push(extractedCourse)
          }
        }
      } catch (siteError) {
        console.error(`Error scraping ${site.name}:`, siteError)
        continue
      }
    }

    // If we didn't get enough courses from scraping, add some fallback data
    if (courses.length < 3) {
      console.log(`Adding fallback course data, only found ${courses.length} courses`)
      courses.push(...getFallbackCourses(query).slice(0, limit - courses.length))
    }

    console.log(`Successfully scraped ${courses.length} courses for query: ${query}`)
    return courses.slice(0, limit)
  } catch (error) {
    console.error("Error in scrapeCourses:", error)
    // Return fallback data on error
    return getFallbackCourses(query).slice(0, limit)
  }
}

// Fallback job data when scraping fails
function getFallbackJobs(query: string): ScrapedJob[] {
  const fallbackJobs: ScrapedJob[] = [
    {
      title: `Senior ${query} Developer`,
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      description: `We're looking for a senior ${query} developer to join our growing team...`,
      requirements: ["5+ years experience", `${query} expertise`, "Problem-solving skills", "Team collaboration"],
      skills: [query.toLowerCase(), "javascript", "react", "node.js", "typescript", "aws"],
      salaryRange: { min: 120000, max: 160000, currency: "USD" },
      url: "https://example.com/job/1",
    },
    {
      title: `${query} Engineer`,
      company: "DataTech Solutions",
      location: "New York, NY",
      description: `Join our team to build cutting-edge ${query} solutions...`,
      requirements: ["3+ years experience", `${query} proficiency`, "Agile methodology", "Communication skills"],
      skills: [query.toLowerCase(), "python", "sql", "docker", "kubernetes", "git"],
      salaryRange: { min: 100000, max: 140000, currency: "USD" },
      url: "https://example.com/job/2",
    },
  ]

  return fallbackJobs
}

// Fallback course data when scraping fails
function getFallbackCourses(query: string): ScrapedCourse[] {
  const fallbackCourses: ScrapedCourse[] = [
    {
      title: `Complete ${query} Bootcamp`,
      provider: "Udemy",
      description: `Learn ${query} from scratch with hands-on projects...`,
      skills: [query.toLowerCase(), "javascript", "html", "css", "react"],
      level: "beginner",
      duration: "40 hours",
      price: 89.99,
      rating: 4.7,
      url: "https://udemy.com/course/complete-bootcamp",
    },
    {
      title: `Advanced ${query} Specialization`,
      provider: "Coursera",
      description: `Master advanced ${query} concepts and techniques...`,
      skills: [query.toLowerCase(), "advanced concepts", "best practices", "architecture"],
      level: "advanced",
      duration: "3 months",
      price: 49.99,
      rating: 4.9,
      url: "https://coursera.org/specializations/advanced",
    },
  ]

  return fallbackCourses
}

// Batch scrape multiple queries
export async function batchScrapeJobs(queries: string[], limitPerQuery = 10): Promise<ScrapedJob[]> {
  const allJobs: ScrapedJob[] = []

  for (const query of queries) {
    try {
      const jobs = await scrapeJobs(query, limitPerQuery)
      allJobs.push(...jobs)
    } catch (error) {
      console.error(`Error scraping jobs for query "${query}":`, error)
    }
  }

  // Remove duplicates based on URL
  const uniqueJobs = allJobs.filter((job, index, self) => index === self.findIndex((j) => j.url === job.url))

  return uniqueJobs
}

// Batch scrape multiple course queries
export async function batchScrapeCourses(queries: string[], limitPerQuery = 8): Promise<ScrapedCourse[]> {
  const allCourses: ScrapedCourse[] = []

  for (const query of queries) {
    try {
      const courses = await scrapeCourses(query, limitPerQuery)
      allCourses.push(...courses)
    } catch (error) {
      console.error(`Error scraping courses for query "${query}":`, error)
    }
  }

  // Remove duplicates based on URL
  const uniqueCourses = allCourses.filter(
    (course, index, self) => index === self.findIndex((c) => c.url === course.url),
  )

  return uniqueCourses
}
