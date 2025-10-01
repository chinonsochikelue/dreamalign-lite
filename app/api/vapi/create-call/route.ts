import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, jobDescription, sessionId } = await request.json()

    const VAPI_API_KEY = process.env.VAPI_API_KEY
    if (!VAPI_API_KEY) {
      return NextResponse.json({ error: "VAPI_API_KEY not configured" }, { status: 500 })
    }

    // Generate interview questions based on job details
    const systemPrompt = `You are an expert interviewer conducting a professional interview for the position of ${jobTitle}. 
${jobDescription ? `Job Description: ${jobDescription}` : ""}

Your role is to:
1. Ask relevant, thoughtful questions about the candidate's experience and skills
2. Listen carefully to their responses
3. Provide constructive feedback
4. Maintain a professional and encouraging tone
5. Ask 5-7 questions total, covering technical skills, experience, and behavioral aspects

Start by introducing yourself and the interview process, then proceed with your questions.`

    // Create Vapi web call using the correct endpoint
    const vapiResponse = await fetch("https://api.vapi.ai/call/web", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistant: {
          model: {
            provider: "openai",
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
            ],
          },
          voice: {
            provider: "11labs",
            voiceId: "21m00Tcm4TlvDq8ikWAM", // Professional voice
          },
          firstMessage: `Hello! I'm your AI interviewer today. I'll be conducting your interview for the ${jobTitle} position. This will be a conversational interview where I'll ask you about your experience, skills, and approach to various scenarios. Feel free to take your time with your responses. Are you ready to begin?`,
        },
        metadata: {
          sessionId,
          jobTitle,
        },
      }),
    })

    if (!vapiResponse.ok) {
      const errorData = await vapiResponse.json()
      console.error("[v0] Vapi API error:", errorData)
      return NextResponse.json({ error: "Failed to create Vapi call", details: errorData }, { status: 500 })
    }

    const vapiData = await vapiResponse.json()

    return NextResponse.json({
      callId: vapiData.id,
      webCallUrl: vapiData.webCallUrl,
    })
  } catch (error) {
    console.error("[v0] Error creating Vapi call:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}