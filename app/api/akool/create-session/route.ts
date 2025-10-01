import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    const AKOOL_API_KEY = process.env.AKOOL_API_KEY
    if (!AKOOL_API_KEY) {
      return NextResponse.json({ error: "AKOOL_API_KEY not configured" }, { status: 500 })
    }

    // Create Akool streaming avatar session
    const akoolResponse = await fetch("https://openapi.akool.com/api/open/v3/avatar/streaming/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AKOOL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar_id: "default_professional", // Use a professional avatar
        voice_id: "en-US-professional-female", // Professional voice
        quality: "high",
        metadata: {
          sessionId,
        },
      }),
    })

    if (!akoolResponse.ok) {
      const errorData = await akoolResponse.json()
      console.error("[v0] Akool API error:", errorData)
      return NextResponse.json({ error: "Failed to create Akool session", details: errorData }, { status: 500 })
    }

    const akoolData = await akoolResponse.json()

    return NextResponse.json({
      sessionId: akoolData.session_id,
      avatarId: akoolData.avatar_id,
      streamUrl: akoolData.stream_url,
      websocketUrl: akoolData.websocket_url,
    })
  } catch (error) {
    console.error("[v0] Error creating Akool session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
