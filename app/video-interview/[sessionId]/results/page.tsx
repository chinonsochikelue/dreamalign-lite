"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, TrendingUp, Clock, ArrowRight, Share2, RotateCcw } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function VideoInterviewResultsPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as Id<"videoInterviewSessions">

  const sessionData = useQuery(api.videoInterviews.getVideoInterview, { sessionId })

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading results...</p>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600"
    if (score >= 7) return "text-blue-600"
    if (score >= 5) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Interview Completed!</h1>
          <p className="text-xl text-slate-600">Great job on completing your {sessionData.jobTitle} interview</p>
        </div>

        {/* Overall Score */}
        <Card className="border-0 shadow-2xl mb-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-slate-600 mb-4">Overall Performance</p>
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(sessionData.overallScore || 0)}`}>
                {sessionData.overallScore?.toFixed(1) || "N/A"}
                <span className="text-3xl text-slate-500">/10</span>
              </div>
              <div className="flex items-center justify-center space-x-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${
                      star <= Math.round((sessionData.overallScore || 0) / 2)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-slate-700 max-w-2xl mx-auto leading-relaxed">
                {sessionData.overallFeedback || "Great performance! Keep practicing to improve further."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="text-sm text-slate-600 mb-1">Duration</p>
              <p className="text-2xl font-bold text-slate-900">
                {sessionData.duration ? formatTime(sessionData.duration) : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-sm text-slate-600 mb-1">Questions Answered</p>
              <p className="text-2xl font-bold text-slate-900">{sessionData.questions.length}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <p className="text-sm text-slate-600 mb-1">Performance</p>
              <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-green-500 to-blue-500">Excellent</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                  <span className="text-slate-700">Clear and confident communication style</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                  <span className="text-slate-700">Strong technical knowledge demonstrated</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                  <span className="text-slate-700">Good use of specific examples</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span className="text-slate-700">Consider providing more quantifiable results</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                  <span className="text-slate-700">Practice structuring answers using the STAR method</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 bg-transparent"
            onClick={() => router.push("/video-interview/new")}
          >
            <RotateCcw className="mr-2 w-5 h-5" />
            Practice Again
          </Button>
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            <Share2 className="mr-2 w-5 h-5" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  )
}
