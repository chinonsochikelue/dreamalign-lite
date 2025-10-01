"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Phone, PhoneOff, Loader2, AlertCircle, Volume2, VolumeX } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function VideoInterviewPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const sessionId = params.sessionId as Id<"videoInterviewSessions">

  // Convex queries and mutations
  const sessionData = useQuery(api.videoInterviews.getVideoInterview, { sessionId })
  const updateVapiCallId = useMutation(api.videoInterviews.updateVapiCallId)
  const completeVideoInterview = useMutation(api.videoInterviews.completeVideoInterview)
  console.log("sessionData:", sessionData)

  // Local state
  const [isInitializing, setIsInitializing] = useState(true)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [vapiCallId, setVapiCallId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const [interviewProgress, setInterviewProgress] = useState(0)

  const callStartTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!sessionData || sessionData.status !== "pending") return

    const initializeSessions = async () => {
      try {
        setIsInitializing(true)

        const vapiResponse = await fetch("/api/vapi/create-call", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: sessionData.jobTitle,
            jobDescription: sessionData.jobDescription,
            sessionId: sessionId,
          }),
        })

        if (!vapiResponse.ok) {
          throw new Error("Failed to create Vapi call")
        }

        const vapiData = await vapiResponse.json()
        setVapiCallId(vapiData.callId)
        await updateVapiCallId({ sessionId, vapiCallId: vapiData.callId })

        setIsInitializing(false)
      } catch (err) {
        console.error("[v0] Error initializing sessions:", err)
        setError("Failed to initialize interview. Please try again.")
        setIsInitializing(false)
      }
    }

    initializeSessions()
  }, [sessionData])

  useEffect(() => {
    if (!isCallActive) return

    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - callStartTimeRef.current) / 1000)
      setCallDuration(duration)

      const progress = Math.min((duration / (15 * 60)) * 100, 100)
      setInterviewProgress(progress)
    }, 1000)

    return () => clearInterval(interval)
  }, [isCallActive])

  const handleStartCall = () => {
    setIsCallActive(true)
    callStartTimeRef.current = Date.now()
  }

  const handleEndCall = async () => {
    setIsCallActive(false)

    try {
      await completeVideoInterview({
        sessionId,
        duration: callDuration,
        overallScore: 8.5,
        overallFeedback: "Great interview! You demonstrated strong communication skills and technical knowledge.",
      })

      router.push(`/video-interview/${sessionId}/results`)
    } catch (err) {
      console.error("[v0] Error completing interview:", err)
      setError("Failed to save interview results")
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading interview session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Voice Interview</h1>
              <p className="text-slate-600">{sessionData.jobTitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              {isCallActive && (
                <>
                  <Badge variant="outline" className="px-4 py-2 bg-red-50 border-red-200 text-red-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
                    Recording
                  </Badge>
                  <div className="text-lg font-mono text-slate-700">{formatTime(callDuration)}</div>
                </>
              )}
            </div>
          </div>
          {isCallActive && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Interview Progress</span>
                <span className="text-sm text-slate-600">{Math.round(interviewProgress)}%</span>
              </div>
              <Progress value={interviewProgress} className="h-2" />
            </div>
          )}
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 aspect-video">
                  {isInitializing ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
                        <p className="text-white">Initializing AI interviewer...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div
                            className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 transition-all ${isCallActive ? "bg-white/20 animate-pulse" : "bg-white/10"
                              }`}
                          >
                            <Mic
                              className={`w-16 h-16 text-white ${isCallActive && !isMuted ? "animate-pulse" : ""}`}
                            />
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2">
                            {isCallActive ? "Interview in Progress" : "Ready to Start"}
                          </h2>
                          <p className="text-white/80 mb-6">
                            {isCallActive
                              ? "The AI interviewer is listening. Speak clearly and naturally."
                              : "Click the button below to begin your voice interview"}
                          </p>
                          {!isCallActive && (
                            <Button
                              size="lg"
                              onClick={handleStartCall}
                              className="bg-white text-blue-600 hover:bg-white/90 px-8"
                            >
                              <Phone className="w-5 h-5 mr-2" />
                              Start Interview
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {isCallActive && (
                  <div className="bg-slate-800 p-6">
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={toggleMute}
                        className={`rounded-full w-14 h-14 ${isMuted
                            ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                            : "bg-slate-700 text-white border-slate-600"
                          }`}
                      >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={toggleSpeaker}
                        className="rounded-full w-14 h-14 bg-slate-700 text-white border-slate-600"
                      >
                        {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                      </Button>

                      <Button
                        size="lg"
                        onClick={handleEndCall}
                        className="rounded-full w-16 h-16 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <PhoneOff className="w-7 h-7" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Position</p>
                  <p className="font-semibold text-slate-900">{sessionData.jobTitle}</p>
                </div>
                {sessionData.jobDescription && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Description</p>
                    <p className="text-sm text-slate-700 line-clamp-3">{sessionData.jobDescription}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <Badge
                    variant={
                      sessionData.status === "completed"
                        ? "default"
                        : sessionData.status === "in-progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {sessionData.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {isCallActive && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-teal-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Mic className="w-5 h-5 mr-2 text-green-600" />
                    Live Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Microphone</span>
                      <Badge variant={isMuted ? "destructive" : "default"}>{isMuted ? "Muted" : "Active"}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Speaker</span>
                      <Badge variant={isSpeakerOn ? "default" : "secondary"}>{isSpeakerOn ? "On" : "Off"}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Connection</span>
                      <Badge variant="default" className="bg-green-500">
                        <div className="w-2 h-2 bg-white rounded-full mr-1" />
                        Connected
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
