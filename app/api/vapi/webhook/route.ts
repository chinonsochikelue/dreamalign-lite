import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    console.log("[v0] Vapi webhook received:", payload.type)

    // Handle different Vapi webhook events
    switch (payload.type) {
      case "call-started":
        console.log("[v0] Call started:", payload.call.id)
        break

      case "call-ended":
        console.log("[v0] Call ended:", payload.call.id)
        // Extract transcript and save to database
        if (payload.call.transcript) {
          // Process transcript and save
          console.log("[v0] Transcript:", payload.call.transcript)
        }
        break

      case "transcript":
        console.log("[v0] Transcript update:", payload.transcript)
        break

      case "function-call":
        console.log("[v0] Function call:", payload.functionCall)
        break

      default:
        console.log("[v0] Unknown event type:", payload.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Error processing Vapi webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
