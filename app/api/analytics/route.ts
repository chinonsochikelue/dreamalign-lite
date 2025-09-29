import { type NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

async function sendToScorecard(data: any) {
  if (!process.env.SCORECARD_API_KEY) {
    console.log("[Analytics] Scorecard API key not configured, skipping AI analytics")
    return
  }

  try {
    const response = await fetch("https://api.scorecard.ai/v1/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SCORECARD_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: data.eventType,
        user_id: data.userId,
        session_id: data.sessionId,
        properties: data.properties,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Scorecard API error: ${response.statusText}`)
    }

    console.log("[Analytics] Event sent to Scorecard successfully")
  } catch (error) {
    console.error("[Analytics] Failed to send to Scorecard:", error)
  }
}

async function sendAlert(alertData: any) {
  if (!process.env.RESEND_API_KEY || alertData.severity !== "critical") {
    return
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "alerts@dreamalign.app",
        to: ["admin@dreamalign.app"],
        subject: `Critical Alert: ${alertData.alertType}`,
        html: `
          <h2>Critical Alert Triggered</h2>
          <p><strong>Type:</strong> ${alertData.alertType}</p>
          <p><strong>Message:</strong> ${alertData.message}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <pre>${JSON.stringify(alertData.data, null, 2)}</pre>
        `,
      }),
    })

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`)
    }

    console.log("[Analytics] Critical alert sent via email")
  } catch (error) {
    console.error("[Analytics] Failed to send alert email:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const userAgent = request.headers.get("user-agent")
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
    const referrer = request.headers.get("referer")

    if (!data.eventType || !data.eventName) {
      return NextResponse.json({ error: "`eventType` and `eventName` are required." }, { status: 400 })
    }

    // console.log("[Analytics] Received event:", data)

    if (data.eventType === "ai_interaction") {
      await convex.mutation(api.analytics.trackAiEvent, {
        userId: data.userId || undefined, // Convert null to undefined
        sessionId: data.sessionId,
        aiProvider: data.properties?.provider || "unknown",
        model: data.properties?.model || "unknown",
        eventType: data.properties?.aiEventType || "generation_complete",
        inputTokens: data.properties?.inputTokens,
        outputTokens: data.properties?.outputTokens,
        latency: data.properties?.latency,
        cost: data.properties?.cost,
        quality: data.properties?.quality,
        feedback: data.properties?.feedback,
        metadata: data.properties?.metadata,
      })

      // Send AI-specific events to Scorecard
      await sendToScorecard(data)
    } else {
      await convex.mutation(api.analytics.trackEvent, {
        userId: data.userId || undefined, // Convert null to undefined
        sessionId: data.sessionId,
        eventType: data.eventType,
        eventName: data.eventName,
        properties: data.properties || {},
        userAgent,
        ip,
        referrer,
      })
    }

    if (data.eventType === "error_occurred" && data.properties?.severity === "critical") {
      // Create a critical alert in Convex and send email notification
      const alertData = {
        alertType: "error_spike" as const,
        severity: "critical" as const,
        message: `Critical error occurred: ${data.properties?.message}`,
        data: data.properties,
      }

      await convex.mutation(api.analytics.createAlert, alertData)
      await sendAlert(alertData)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Analytics] Error processing event:", error)

    // Create error alert
    try {
      const alertData = {
        alertType: "error_spike" as const,
        severity: "high" as const,
        message: `Analytics processing error: ${error instanceof Error ? error.message : "Unknown error"}`,
        data: { error: error instanceof Error ? error.message : error },
      }

      await convex.mutation(api.analytics.createAlert, alertData)
    } catch (alertError) {
      console.error("[Analytics] Failed to create error alert:", alertError)
    }

    return NextResponse.json({ error: "Failed to process analytics event" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const event = searchParams.get("event")
  const data = searchParams.get("data")

  if (event && data) {
    try {
      const parsedData = JSON.parse(decodeURIComponent(data))
      console.log(`[Analytics] Beacon event ${event}:`, parsedData)

      // Store beacon events in Convex
      await convex.mutation(api.analytics.trackEvent, {
        userId: parsedData.userId || undefined, // Convert null to undefined
        sessionId: parsedData.sessionId || "beacon-session",
        eventType: "beacon",
        eventName: event,
        properties: parsedData,
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("[Analytics] Error processing beacon event:", error)
    }
  }

  return NextResponse.json({ error: "Invalid beacon request" }, { status: 400 })
}
