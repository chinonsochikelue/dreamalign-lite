"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, MessageSquare, Mic, Clock, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const JOB_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "AI/ML Engineer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Software Architect",
  "Technical Lead",
]

const INTERVIEW_TYPES = [
  { id: "technical", label: "Technical Interview", description: "Coding and technical problem-solving" },
  { id: "behavioral", label: "Behavioral Interview", description: "Soft skills and experience-based questions" },
  { id: "system-design", label: "System Design", description: "Architecture and scalability questions" },
  { id: "general", label: "General Interview", description: "Mixed technical and behavioral questions" },
]

export default function InterviewSetupPage() {
  const [jobRole, setJobRole] = useState("")
  const [interviewType, setInterviewType] = useState("")
  const [sessionType, setSessionType] = useState<"text" | "voice">("text")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [isStarting, setIsStarting] = useState(false)
  const router = useRouter()

  const handleStartInterview = async () => {
    if (!jobRole || !interviewType) return

    setIsStarting(true)

    // Generate session ID and store interview config
    const sessionId = `session_${Date.now()}`
    const interviewConfig = {
      jobRole,
      interviewType,
      sessionType,
      difficulty,
      startTime: Date.now(),
    }

    localStorage.setItem(`interview_${sessionId}`, JSON.stringify(interviewConfig))

    // Simulate setup delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    router.push(`/interview/${sessionId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/career-paths"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <span>← Back to Career Paths</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">Career Companion</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">AI Interview Coach</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice interviews with AI-powered feedback and improve your performance with personalized coaching.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Setup Form */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Interview Setup</CardTitle>
              <CardDescription>Configure your mock interview session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="jobRole">Job Role</Label>
                <Select value={jobRole} onValueChange={setJobRole}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select a job role" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Interview Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {INTERVIEW_TYPES.map((type) => (
                    <div
                      key={type.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                        interviewType === type.id ? "border-primary bg-primary/10" : "border-border bg-background"
                      }`}
                      onClick={() => setInterviewType(type.id)}
                    >
                      <h4 className="font-medium text-foreground text-sm">{type.label}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                      sessionType === "text" ? "border-primary bg-primary/10" : "border-border bg-background"
                    }`}
                    onClick={() => setSessionType("text")}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Text-based</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Type your answers</p>
                  </div>
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                      sessionType === "voice" ? "border-primary bg-primary/10" : "border-border bg-background"
                    }`}
                    onClick={() => setSessionType("voice")}
                  >
                    <div className="flex items-center space-x-2">
                      <Mic className="w-5 h-5 text-accent" />
                      <span className="font-medium text-foreground">Voice-based</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Speak your answers</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleStartInterview}
                disabled={!jobRole || !interviewType || isStarting}
                className="w-full"
                size="lg"
              >
                {isStarting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Preparing Interview...
                  </>
                ) : (
                  <>
                    Start Interview
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Target className="w-5 h-5 mr-2" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Real-time Feedback</h4>
                    <p className="text-sm text-muted-foreground">Get instant AI-powered feedback on each answer</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Performance Scoring</h4>
                    <p className="text-sm text-muted-foreground">Detailed scoring with improvement suggestions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Progress Tracking</h4>
                    <p className="text-sm text-muted-foreground">Monitor your improvement over time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Personalized Tips</h4>
                    <p className="text-sm text-muted-foreground">Customized advice based on your performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Clock className="w-5 h-5 mr-2" />
                  Session Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">15-30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="font-medium text-foreground">5-8 questions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Feedback:</span>
                  <span className="font-medium text-foreground">Instant & detailed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Report:</span>
                  <span className="font-medium text-foreground">Comprehensive summary</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
