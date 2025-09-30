export interface ScrapeJobsOptions {
  query?: string
  queries?: string[]
  limit?: number
}

export interface ScrapeCoursesOptions {
  query?: string
  queries?: string[]
  limit?: number
}

export interface SyncScrapedDataOptions {
  skills: string[]
  userInterests?: string[]
}

// Client-side function to scrape jobs
export async function scrapeJobsClient(options: ScrapeJobsOptions) {
  try {
    const response = await fetch("/api/scrape/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error scraping jobs:", error)
    throw error
  }
}

// Client-side function to scrape courses
export async function scrapeCoursesClient(options: ScrapeCoursesOptions) {
  try {
    const response = await fetch("/api/scrape/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error scraping courses:", error)
    throw error
  }
}

// Client-side function to sync scraped data to database
export async function syncScrapedDataClient(options: SyncScrapedDataOptions) {
  try {
    const response = await fetch("/api/scrape/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error syncing scraped data:", error)
    throw error
  }
}

// Utility function to extract skills from user profile
export function extractSkillsFromProfile(user: any): string[] {
  const skills: string[] = []

  if (user?.skills) {
    skills.push(...user.skills)
  }

  if (user?.interests) {
    skills.push(...user.interests)
  }

  if (user?.goals) {
    // Extract skills from goals text
    const goalText = user.goals.join(" ").toLowerCase()
    const commonSkills = ["javascript", "python", "react", "node.js", "sql", "aws", "docker", "kubernetes"]
    commonSkills.forEach((skill) => {
      if (goalText.includes(skill)) {
        skills.push(skill)
      }
    })
  }

  // Remove duplicates and return
  return [...new Set(skills.filter((skill) => skill && skill.length > 0))]
}
