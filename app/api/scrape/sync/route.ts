import { type NextRequest, NextResponse } from "next/server"
import { scrapeJobs, scrapeCourses } from "@/lib/integrations/firecrawl"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
  try {
    const { skills, userInterests } = await request.json()

    if (!skills || !Array.isArray(skills)) {
      return NextResponse.json({ error: "Skills array is required" }, { status: 400 })
    }

    console.log(`Starting sync for skills: ${skills.join(", ")}`)

    // Scrape jobs for each skill
    const allJobs = []
    for (const skill of skills) {
      try {
        const jobs = await scrapeJobs(skill, 5) // Limit per skill to avoid overwhelming
        allJobs.push(...jobs.map((job) => ({ ...job, source: "firecrawl" })))
      } catch (error) {
        console.error(`Error scraping jobs for skill "${skill}":`, error)
      }
    }

    // Scrape courses for each skill
    const allCourses = []
    for (const skill of skills) {
      try {
        const courses = await scrapeCourses(skill, 3) // Limit per skill
        allCourses.push(...courses)
      } catch (error) {
        console.error(`Error scraping courses for skill "${skill}":`, error)
      }
    }

    // Store in Convex database
    let jobIds = []
    let courseIds = []

    if (allJobs.length > 0) {
      try {
        jobIds = await convex.mutation(api.scraping.addScrapedJobs, { jobs: allJobs })
        console.log(`Stored ${allJobs.length} jobs in database`)
      } catch (error) {
        console.error("Error storing jobs:", error)
      }
    }

    if (allCourses.length > 0) {
      try {
        courseIds = await convex.mutation(api.scraping.addScrapedCourses, { courses: allCourses })
        console.log(`Stored ${allCourses.length} courses in database`)
      } catch (error) {
        console.error("Error storing courses:", error)
      }
    }

    return NextResponse.json({
      success: true,
      jobsScraped: allJobs.length,
      coursesScraped: allCourses.length,
      jobIds,
      courseIds,
    })
  } catch (error) {
    console.error("Error in sync API:", error)
    return NextResponse.json({ error: "Failed to sync scraped data" }, { status: 500 })
  }
}
