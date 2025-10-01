import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, avatarId } = await request.json()

    const AKOOL_API_KEY = process.env.AKOOL_API_KEY
    if (!AKOOL_API_KEY) {
      return NextResponse.json({ error: "AKOOL_API_KEY not configured" }, { status: 500 })
    }

    // Send message to Akool avatar
    const akoolResponse = await fetch("https://openapi.akool.com/api/open/v3/avatar/streaming/message", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AKOOL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        avatar_id: avatarId,
        message: message,
        emotion: "professional", // Professional demeanor
      }),
    })

    if (!akoolResponse.ok) {
      const errorData = await akoolResponse.json()
      console.error("[v0] Akool send message error:", errorData)
      return NextResponse.json({ error: "Failed to send message to avatar", details: errorData }, { status: 500 })
    }

    const akoolData = await akoolResponse.json()

    return NextResponse.json({
      success: true,
      messageId: akoolData.message_id,
    })
  } catch (error) {
    console.error("[v0] Error sending message to Akool:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
