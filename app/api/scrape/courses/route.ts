import { type NextRequest, NextResponse } from "next/server"
import { scrapeCourses, batchScrapeCourses } from "@/lib/integrations/firecrawl"

export async function POST(request: NextRequest) {
  try {
    const { query, queries, limit = 15 } = await request.json()

    if (!query && !queries) {
      return NextResponse.json({ error: "Query or queries parameter is required" }, { status: 400 })
    }

    let courses
    if (queries && Array.isArray(queries)) {
      // Batch scraping
      courses = await batchScrapeCourses(queries, Math.floor(limit / queries.length))
    } else {
      // Single query scraping
      courses = await scrapeCourses(query, limit)
    }

    return NextResponse.json({
      success: true,
      courses,
      count: courses.length,
    })
  } catch (error) {
    console.error("Error in courses scraping API:", error)
    return NextResponse.json({ error: "Failed to scrape courses" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const limit = Number.parseInt(searchParams.get("limit") || "15")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const courses = await scrapeCourses(query, limit)
    return NextResponse.json({
      success: true,
      courses,
      count: courses.length,
    })
  } catch (error) {
    console.error("Error in courses scraping API:", error)
    return NextResponse.json({ error: "Failed to scrape courses" }, { status: 500 })
  }
}
