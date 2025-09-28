"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, MessageSquare, Mic, Clock, Target, ArrowRight, CheckCircle, Sparkles, Award, TrendingUp, Users, Code, Briefcase } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

const JOB_ROLES = [
  { value: "Full Stack Developer", icon: Code, color: "text-blue-500" },
  { value: "Frontend Developer", icon: Briefcase, color: "text-green-500" },
  { value: "Backend Developer", icon: Code, color: "text-purple-500" },
  { value: "AI/ML Engineer", icon: Brain, color: "text-orange-500" },
  { value: "Data Scientist", icon: TrendingUp, color: "text-cyan-500" },
  { value: "Product Manager", icon: Users, color: "text-pink-500" },
  { value: "UI/UX Designer", icon: Sparkles, color: "text-indigo-500" },
  { value: "DevOps Engineer", icon: Code, color: "text-red-500" },
  { value: "Software Architect", icon: Award, color: "text-yellow-500" },
  { value: "Technical Lead", icon: Users, color: "text-emerald-500" },
]

const INTERVIEW_TYPES = [
  { 
    id: "technical", 
    label: "Technical Interview", 
    description: "Coding challenges and technical problem-solving",
    icon: Code,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:border-blue-800"
  },
  { 
    id: "behavioral", 
    label: "Behavioral Interview", 
    description: "Leadership scenarios and experience-based questions",
    icon: Users,
    color: "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:border-green-800"
  },
  { 
    id: "system-design", 
    label: "System Design", 
    description: "Architecture patterns and scalability challenges",
    icon: Award,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-950 dark:border-purple-800"
  },
  { 
    id: "general", 
    label: "General Interview", 
    description: "Mixed technical and behavioral assessment",
    icon: Target,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-950 dark:border-orange-800"
  },
]

const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Beginner", description: "Entry level questions", color: "text-green-600" },
  { value: "intermediate", label: "Intermediate", description: "Mid-level challenges", color: "text-orange-600" },
  { value: "advanced", label: "Advanced", description: "Senior level problems", color: "text-red-600" },
]

export default function InterviewSetupPage() {
  const [jobRole, setJobRole] = useState("")
  const [interviewType, setInterviewType] = useState("")
  const [sessionType, setSessionType] = useState<"text" | "voice">("text")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [isStarting, setIsStarting] = useState(false)

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

    // Note: In a real application, this would be sent to a backend
    // localStorage.setItem(`interview_${sessionId}`, JSON.stringify(interviewConfig))

    // Simulate setup delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // In real app: router.push(`/interview/${sessionId}`)
    alert(`Interview session ${sessionId} would start now!`)
    setIsStarting(false)
  }

  const isReadyToStart = jobRole && interviewType
  const selectedJobRole = JOB_ROLES.find(role => role.value === jobRole)
  const selectedInterviewType = INTERVIEW_TYPES.find(type => type.id === interviewType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Enhanced Navigation */}
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Interview Practice
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-6">
            Master Your Next Interview
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Practice with our AI interviewer, get real-time feedback, and build the confidence you need to land your dream job.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Setup Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Role Selection */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
                  Choose Your Role
                </CardTitle>
                <CardDescription className="text-base">
                  Select the position you're preparing for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {JOB_ROLES.map((role) => {
                    const Icon = role.icon
                    return (
                      <div
                        key={role.value}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                          jobRole === role.value 
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg" 
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 hover:shadow-md"
                        }`}
                        onClick={() => setJobRole(role.value)}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${role.color}`} />
                          <span className="font-medium text-slate-900 dark:text-slate-100">{role.value}</span>
                          {jobRole === role.value && <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Interview Type Selection */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl flex items-center">
                  <Target className="w-6 h-6 mr-3 text-indigo-600" />
                  Interview Focus
                </CardTitle>
                <CardDescription className="text-base">
                  What type of interview would you like to practice?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {INTERVIEW_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                      <div
                        key={type.id}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                          interviewType === type.id 
                            ? `border-blue-500 ${type.color} shadow-lg` 
                            : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md`
                        }`}
                        onClick={() => setInterviewType(type.id)}
                      >
                        <div className="flex items-start space-x-4">
                          <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{type.label}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{type.description}</p>
                          </div>
                          {interviewType === type.id && <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Session Configuration */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Session Type */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Session Format</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      sessionType === "text" 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                    }`}
                    onClick={() => setSessionType("text")}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">Text Chat</span>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Type your responses</p>
                      </div>
                      {sessionType === "text" && <CheckCircle className="w-4 h-4 text-blue-500 ml-auto" />}
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      sessionType === "voice" 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                    }`}
                    onClick={() => setSessionType("voice")}
                  >
                    <div className="flex items-center space-x-3">
                      <Mic className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">Voice Chat</span>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Speak naturally</p>
                      </div>
                      {sessionType === "voice" && <CheckCircle className="w-4 h-4 text-blue-500 ml-auto" />}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Difficulty Level */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Difficulty Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${level.color}`}>{level.label}</span>
                            <span className="text-slate-500 text-sm">• {level.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Start Button */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {isReadyToStart && (
                    <div className="flex items-center justify-center space-x-4 text-blue-100 mb-4">
                      <div className="flex items-center space-x-2">
                        {selectedJobRole && <selectedJobRole.icon className="w-4 h-4" />}
                        <span className="text-sm">{jobRole}</span>
                      </div>
                      <span className="text-blue-200">•</span>
                      <div className="flex items-center space-x-2">
                        {selectedInterviewType && <selectedInterviewType.icon className="w-4 h-4" />}
                        <span className="text-sm">{selectedInterviewType?.label}</span>
                      </div>
                      <span className="text-blue-200">•</span>
                      <span className="text-sm capitalize">{difficulty}</span>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleStartInterview}
                    disabled={!isReadyToStart || isStarting}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg py-6 rounded-xl shadow-lg disabled:bg-slate-100 disabled:text-slate-400"
                    size="lg"
                  >
                    {isStarting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
                        Preparing Your Interview...
                      </>
                    ) : isReadyToStart ? (
                      <>
                        Start Interview Session
                        <ArrowRight className="ml-3 w-5 h-5" />
                      </>
                    ) : (
                      "Please select role and interview type"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features Card */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                  What You'll Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Brain, title: "AI-Powered Questions", desc: "Tailored to your role and experience level" },
                  { icon: TrendingUp, title: "Real-time Analysis", desc: "Instant feedback on communication skills" },
                  { icon: Award, title: "Performance Scoring", desc: "Detailed metrics and improvement areas" },
                  { icon: Target, title: "Personalized Tips", desc: "Custom advice based on your responses" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <feature.icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">{feature.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                  Session Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Duration", value: "15-30 minutes" },
                  { label: "Questions", value: "5-8 adaptive questions" },
                  { label: "Feedback", value: "Instant + detailed report" },
                  { label: "Practice Mode", value: "Unlimited retakes" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}