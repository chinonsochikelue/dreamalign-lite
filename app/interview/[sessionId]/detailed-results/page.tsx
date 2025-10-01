"use client"

import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function InterviewDetailedResultsPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const sessionData = useQuery(api.interviews.getSession, { sessionId })

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="text-center">
          <p className="text-lg text-slate-700 dark:text-slate-300">Loading detailed results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          className="mb-6 flex items-center text-blue-600 hover:underline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl">Detailed Interview Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Overall Feedback</h3>
              <p className="text-slate-700 dark:text-slate-300">{sessionData.overallFeedback || "Great job!"}</p>
            </div>
            <div className="space-y-6">
              {sessionData.questions.map((q: any, idx: number) => (
                <div key={idx} className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Q{idx + 1}</Badge>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{q.question}</span>
                  </div>
                  <div className="mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-medium">Your Answer:</span> {q.answer || <span className="italic text-slate-400">No answer</span>}
                  </div>
                  <div className="mb-1 text-blue-700 dark:text-blue-400">
                    <span className="font-medium">Feedback:</span> {q.feedback || <span className="italic text-slate-400">No feedback</span>}
                  </div>
                  {q.score !== undefined && (
                    <div className="text-green-700 dark:text-green-400">
                      <span className="font-medium">Score:</span> {q.score}/10
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
