import { NextRequest, NextResponse } from "next/server"
import { getAIService } from "@/lib/ai-provider"

export async function POST(req: NextRequest) {
  try {
    const { message, context, provider = "openai", conversationHistory } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const startTime = Date.now()
    const aiService = getAIService(provider)

    // Build comprehensive context from user data
    const systemContext = buildSystemContext(context)

    // Get AI response with full context
    const response = await aiService.chatWithContext(
      message,
      systemContext,
      conversationHistory || []
    )

    const latency = Date.now() - startTime

    return NextResponse.json({
      message: response.message,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
      latency,
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}

function buildSystemContext(context: any): string {
  const parts = []

  parts.push("You are an AI career assistant helping a user with their professional development.")
  parts.push("You have access to the following information about the user:\n")

  if (context.profile) {
    parts.push("USER PROFILE:")
    parts.push(`- Name: ${context.profile.name || "Not provided"}`)
    parts.push(`- Experience Level: ${context.profile.experienceLevel || "Not specified"}`)
    
    if (context.interests?.length > 0) {
      parts.push(`- Interests: ${context.interests.join(", ")}`)
    }
    
    if (context.skills?.length > 0) {
      parts.push(`- Current Skills: ${context.skills.join(", ")}`)
    }
    
    parts.push("")
  }

  if (context.careerPaths?.length > 0) {
    parts.push("CAREER RECOMMENDATIONS:")
    context.careerPaths.slice(0, 3).forEach((path: any, idx: number) => {
      parts.push(`${idx + 1}. ${path.title} (${path.matchScore}% match)`)
      parts.push(`   Description: ${path.description}`)
      parts.push(`   Required Skills: ${path.skills?.slice(0, 5).join(", ")}`)
      parts.push(`   Salary Range: $${path.salaryRange?.min?.toLocaleString()} - $${path.salaryRange?.max?.toLocaleString()}`)
    })
    parts.push("")
  }

  if (context.recentInterviews?.length > 0) {
    parts.push("RECENT INTERVIEW PERFORMANCE:")
    context.recentInterviews.forEach((interview: any, idx: number) => {
      const score = interview.overallScore || 0
      parts.push(`${idx + 1}. ${interview.jobRole} - Score: ${score}/10 (${interview.sessionType})`)
    })
    
    const avgScore = context.recentInterviews.reduce((sum: number, i: any) => 
      sum + (i.overallScore || 0), 0) / context.recentInterviews.length
    parts.push(`Average Score: ${avgScore.toFixed(1)}/10`)
    parts.push("")
  }

  if (context.profile?.progress) {
    parts.push("USER PROGRESS:")
    parts.push(`- Total Interviews: ${context.profile.progress.totalInterviews || 0}`)
    parts.push(`- Average Score: ${context.profile.progress.averageScore?.toFixed(1) || 0}/10`)
    
    if (context.profile.progress.strengths?.length > 0) {
      parts.push(`- Strengths: ${context.profile.progress.strengths.join(", ")}`)
    }
    
    if (context.profile.progress.improvementAreas?.length > 0) {
      parts.push(`- Areas to Improve: ${context.profile.progress.improvementAreas.join(", ")}`)
    }
    parts.push("")
  }

  parts.push("\nInstructions:")
  parts.push("- Provide personalized, actionable career advice based on the user's data")
  parts.push("- Reference specific details from their profile when relevant")
  parts.push("- Be encouraging but honest about areas for improvement")
  parts.push("- Suggest concrete next steps and resources")
  parts.push("- Keep responses concise but informative (2-4 paragraphs)")
  parts.push("- Use a friendly, professional tone")
  parts.push("- If you don't have enough information, ask clarifying questions")
  parts.push("- Format any lists using markdown for better readability")
  parts.push("- Use bullet points or numbered lists where appropriate")
  parts.push("- Include code snippets or examples when relevant")
  parts.push("- Be mindful of the user's context and tailor responses accordingly")
  parts.push("- Make use of google search results if provided")
  parts.push("- Make use of google search results for grounding if needed")
  parts.push("- Include citations for any external information used")

  return parts.join("\n")
}