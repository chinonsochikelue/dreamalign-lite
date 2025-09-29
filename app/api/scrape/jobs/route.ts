import { type NextRequest, NextResponse } from "next/server"
import { scrapeJobs, batchScrapeJobs } from "@/lib/integrations/firecrawl"

export async function POST(request: NextRequest) {
  try {
    const { query, queries, limit = 20 } = await request.json()

    if (!query && !queries) {
      return NextResponse.json({ error: "Query or queries parameter is required" }, { status: 400 })
    }

    let jobs
    if (queries && Array.isArray(queries)) {
      // Batch scraping
      jobs = await batchScrapeJobs(queries, Math.floor(limit / queries.length))
    } else {
      // Single query scraping
      jobs = await scrapeJobs(query, limit)
    }

    return NextResponse.json({
      success: true,
      jobs,
      count: jobs.length,
    })
  } catch (error) {
    console.error("Error in jobs scraping API:", error)
    return NextResponse.json({ error: "Failed to scrape jobs" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const jobs = await scrapeJobs(query, limit)
    return NextResponse.json({
      success: true,
      jobs,
      count: jobs.length,
    })
  } catch (error) {
    console.error("Error in jobs scraping API:", error)
    return NextResponse.json({ error: "Failed to scrape jobs" }, { status: 500 })
  }
}
