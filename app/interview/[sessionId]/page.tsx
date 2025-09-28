"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Clock, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Pause,
  Play,
  SkipForward,
  Lightbulb,
  Target,
  BarChart3,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bookmark,
  RotateCcw,
  Zap
} from "lucide-react"

interface Question {
  id: number
  question: string
  answer?: string
  feedback?: string
  score?: number
  isAnswered: boolean
  difficulty?: string
  category?: string
  timeSpent?: number
}

interface InterviewSession {
  jobRole: string
  interviewType: string
  sessionType: "text" | "voice"
  difficulty: string
  startTime: number
  questions: Question[]
  currentQuestionIndex: number
  isCompleted: boolean
  isPaused?: boolean
}

export default function EnhancedOriginalInterviewSessionPage() {
  const [session, setSession] = useState<InterviewSession>({
    jobRole: "Full Stack Developer",
    interviewType: "general",
    sessionType: "text",
    difficulty: "intermediate",
    startTime: Date.now(),
    questions: [
      {
        id: 1,
        question: "Tell me about yourself and why you're interested in this role.",
        isAnswered: false,
        difficulty: "Easy",
        category: "Behavioral"
      },
      {
        id: 2,
        question: "Describe a challenging project you worked on and how you overcame obstacles.",
        isAnswered: false,
        difficulty: "Medium",
        category: "Behavioral"
      },
      {
        id: 3,
        question: "How do you handle conflicts in a team environment?",
        isAnswered: false,
        difficulty: "Medium",
        category: "Behavioral"
      },
      {
        id: 4,
        question: "What's your experience with modern JavaScript frameworks?",
        isAnswered: false,
        difficulty: "Medium",
        category: "Technical"
      },
      {
        id: 5,
        question: "Where do you see yourself in 5 years?",
        isAnswered: false,
        difficulty: "Easy",
        category: "Career Goals"
      }
    ],
    currentQuestionIndex: 0,
    isCompleted: false,
    isPaused: false
  })
  
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showHints, setShowHints] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [savedDraft, setSavedDraft] = useState("")

  // Calculate word count
  useEffect(() => {
    const words = currentAnswer.trim().split(/\s+/).filter(word => word.length > 0).length
    setWordCount(currentAnswer.trim() === "" ? 0 : words)
  }, [currentAnswer])

  // Timer effect
  useEffect(() => {
    if (session.isPaused || session.isCompleted || isLoading) return

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [session.isPaused, session.isCompleted, isLoading])

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return

    setIsSubmitting(true)
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)

    // Simulate AI evaluation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock evaluation based on answer length and content
    const mockScore = Math.floor(Math.random() * 3) + 7 // 7-10 score
    const mockFeedback = generateMockFeedback(currentAnswer, session.questions[session.currentQuestionIndex].category)

    const currentQuestion = session.questions[session.currentQuestionIndex]
    const updatedQuestions = [...session.questions]
    updatedQuestions[session.currentQuestionIndex] = {
      ...currentQuestion,
      answer: currentAnswer,
      feedback: mockFeedback,
      score: mockScore,
      isAnswered: true,
      timeSpent
    }

    const updatedSession = {
      ...session,
      questions: updatedQuestions,
    }

    setSession(updatedSession)
    setCurrentAnswer("")
    setSavedDraft("")
    setIsSubmitting(false)
    setShowHints(false)

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem(`interview_session`, JSON.stringify(updatedSession))
    }

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (session.currentQuestionIndex < session.questions.length - 1) {
        setSession(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }))
        setQuestionStartTime(Date.now())
      } else {
        // Interview completed
        const completedSession = { ...updatedSession, isCompleted: true }
        setSession(completedSession)
        if (typeof window !== 'undefined') {
          localStorage.setItem(`interview_session`, JSON.stringify(completedSession))
        }
      }
    }, 4000)
  }

  const generateMockFeedback = (answer: string, category?: string) => {
    const feedbackOptions = {
      Behavioral: [
        "Good use of specific examples. Consider structuring your response using the STAR method for even stronger impact.",
        "Your answer shows good self-awareness. Adding more quantifiable results would strengthen your response.",
        "Nice personal touch in your answer. Consider expanding on the skills you demonstrated in this situation."
      ],
      Technical: [
        "Solid technical knowledge demonstrated. Consider discussing trade-offs between different approaches.",
        "Good explanation of concepts. Adding real-world examples of implementation would enhance your answer.",
        "Shows understanding of the fundamentals. Discussing recent trends or updates would show continued learning."
      ],
      "Career Goals": [
        "Clear vision for your future. Consider connecting your goals more directly to this specific role.",
        "Good forward-thinking approach. Adding specific steps you're taking to achieve these goals would strengthen your answer.",
        "Realistic and thoughtful goals. Consider mentioning how this role fits into your broader career strategy."
      ]
    }

    const categoryFeedback = feedbackOptions[category as keyof typeof feedbackOptions] || feedbackOptions.Behavioral
    return categoryFeedback[Math.floor(Math.random() * categoryFeedback.length)]
  }

  const handlePauseResume = () => {
    setSession(prev => ({ ...prev, isPaused: !prev.isPaused }))
  }

  const handleSkipQuestion = () => {
    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }))
      setCurrentAnswer("")
      setQuestionStartTime(Date.now())
    }
  }

  const handleSaveDraft = () => {
    setSavedDraft(currentAnswer)
    // Could also save to localStorage here
  }

  const handleLoadDraft = () => {
    setCurrentAnswer(savedDraft)
  }

  const handleToggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real implementation, this would start/stop audio recording
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600"
    if (score >= 7) return "text-blue-600"
    if (score >= 5) return "text-yellow-600"
    return "text-red-600"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-700 border-green-200"
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "hard": return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const currentQuestion = session.questions[session.currentQuestionIndex]
  const progress = ((session.currentQuestionIndex + (currentQuestion?.isAnswered ? 1 : 0)) / session.questions.length) * 100
  const completedQuestions = session.questions.filter(q => q.isAnswered).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-xl font-semibold text-slate-900">Preparing Your Interview</h3>
          <p className="text-slate-600">AI is generating personalized questions...</p>
        </div>
      </div>
    )
  }

  if (session.isCompleted) {
    const averageScore = completedQuestions > 0 
      ? session.questions.filter(q => q.score).reduce((sum, q) => sum + (q.score || 0), 0) / completedQuestions
      : 0

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="bg-white shadow-2xl border-slate-200/50">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Interview Completed!</h2>
              <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto">
                Congratulations! You've successfully completed your {session.jobRole} interview session.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{completedQuestions}</div>
                  <p className="text-sm text-slate-600">Questions</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{formatTime(timeElapsed)}</div>
                  <p className="text-sm text-slate-600">Duration</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className={`text-2xl font-bold mb-1 ${getScoreColor(averageScore)}`}>
                    {averageScore.toFixed(1)}
                  </div>
                  <p className="text-sm text-slate-600">Avg Score</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                >
                  View Detailed Results
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Practice Again
                  <RotateCcw className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{session.jobRole} Interview</h1>
                <p className="text-sm text-slate-600 capitalize flex items-center space-x-2">
                  <span>{session.interviewType}</span>
                  <span>•</span>
                  <span>{session.difficulty}</span>
                  {session.isPaused && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">Paused</Badge>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handlePauseResume}>
                  {session.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="text-slate-600"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center space-x-3 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono tabular-nums">{formatTime(timeElapsed)}</span>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                {session.currentQuestionIndex + 1} of {session.questions.length}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Interview Progress</span>
              <span className="text-sm text-slate-600">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-3 bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current Question Card */}
            <Card className="bg-white shadow-xl border-slate-200/50">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className={`px-3 py-1 ${getDifficultyColor(currentQuestion.difficulty || "")}`}>
                        {currentQuestion.difficulty}
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        {currentQuestion.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-slate-900">
                      Question {session.currentQuestionIndex + 1}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHints(!showHints)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Lightbulb className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSkipQuestion}
                      className="text-slate-600"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <p className="text-xl text-slate-800 leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>

                {showHints && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Interview Tips</span>
                    </div>
                    <ul className="space-y-2 text-sm text-yellow-700">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Use the STAR method for behavioral questions (Situation, Task, Action, Result)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Provide specific examples from your experience</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Quantify your achievements when possible</span>
                      </li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Answer Input or Feedback */}
            {!currentQuestion.isAnswered ? (
              <Card className="bg-white shadow-xl border-slate-200/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-slate-900">
                        {session.sessionType === "voice" ? (
                          <>
                            <Mic className="w-5 h-5 mr-2" />
                            Voice Response
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Written Response
                          </>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Take your time and provide a thoughtful, detailed answer
                      </CardDescription>
                    </div>
                    {session.sessionType === "voice" && (
                      <Button
                        variant={isRecording ? "destructive" : "default"}
                        size="sm"
                        onClick={handleToggleRecording}
                        className="flex items-center space-x-2"
                      >
                        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        <span>{isRecording ? "Stop Recording" : "Start Recording"}</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {session.sessionType === "voice" ? (
                    <div className="text-center py-16">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${
                        isRecording 
                          ? "bg-red-100 border-4 border-red-300 animate-pulse shadow-lg" 
                          : "bg-slate-100 border-4 border-slate-300 hover:bg-slate-200"
                      }`}>
                        <Mic className={`w-8 h-8 ${isRecording ? "text-red-600" : "text-slate-600"}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {isRecording ? "Recording your response..." : "Ready to record"}
                      </h3>
                      <p className="text-slate-600 mb-6">
                        {isRecording 
                          ? "Speak clearly and at a natural pace. Click stop when finished." 
                          : "Click the record button above to start speaking your answer"
                        }
                      </p>
                      {isRecording && (
                        <div className="flex items-center justify-center space-x-2 text-red-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                          <span className="text-sm font-mono">{formatTime(Math.floor((Date.now() - questionStartTime) / 1000))}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Textarea
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          placeholder="Start typing your response here... Be specific and provide examples where possible."
                          className="min-h-40 text-base leading-relaxed border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                          disabled={isSubmitting || session.isPaused}
                        />
                        {session.isPaused && (
                          <div className="absolute inset-0 bg-slate-100/80 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Pause className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                              <p className="text-sm text-slate-600">Interview Paused</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-slate-500">
                          <span>{currentAnswer.length} characters</span>
                          <span>{wordCount} words</span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(Math.floor((Date.now() - questionStartTime) / 1000))}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {wordCount < 30 && currentAnswer.length > 0 && (
                            <div className="flex items-center space-x-1 text-amber-600">
                              <AlertCircle className="w-3 h-3" />
                              <span className="text-xs">Consider adding more detail</span>
                            </div>
                          )}
                          {savedDraft && (
                            <Button size="sm" variant="outline" onClick={handleLoadDraft}>
                              Load Draft
                            </Button>
                          )}
                          {currentAnswer && (
                            <Button size="sm" variant="ghost" onClick={handleSaveDraft}>
                              <Bookmark className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleSubmitAnswer} 
                      disabled={(!currentAnswer.trim() && !isRecording) || isSubmitting || session.isPaused}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Analyzing Response...
                        </>
                      ) : (
                        <>
                          Submit Answer
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Enhanced Feedback Display */
              <Card className="bg-white shadow-xl border-slate-200/50">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="flex items-center text-slate-900">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    AI Feedback & Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Star className="w-6 h-6 text-yellow-500" />
                        <span className={`text-4xl font-bold ${getScoreColor(currentQuestion.score || 0)}`}>
                          {currentQuestion.score}
                        </span>
                        <span className="text-2xl text-slate-500">/10</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Response Score</p>
                    </div>
                    <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Clock className="w-5 h-5 text-slate-500" />
                        <span className="text-4xl font-bold text-slate-900">
                          {formatTime(currentQuestion.timeSpent || 0)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Response Time</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Detailed Feedback</h4>
                        <p className="text-slate-700 leading-relaxed">{currentQuestion.feedback}</p>
                      </div>
                    </div>
                  </div>

                  {session.currentQuestionIndex < session.questions.length - 1 && (
                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-center space-x-2 text-blue-700">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Preparing next question...</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Overview */}
            <Card className="bg-white shadow-xl border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900 text-base">
                  <Target className="w-4 h-4 mr-2" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {session.questions.map((q, index) => (
                    <div
                      key={q.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition ${
                        index === session.currentQuestionIndex
                          ? "bg-blue-50 border-blue-300"
                          : q.isAnswered
                            ? "bg-green-50 border-green-200"
                            : "bg-slate-50 border-slate-200"
                      }`}
                      onClick={() => {
                        if (q.isAnswered || index === session.currentQuestionIndex) {
                          setSession(prev => ({ ...prev, currentQuestionIndex: index }))
                          setCurrentAnswer("")
                          setQuestionStartTime(Date.now())
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-slate-900">Q{index + 1}</span>
                        {q.isAnswered ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <span className="text-xs text-slate-500">{q.difficulty}</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 mt-1 line-clamp-2">
                        {q.question}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Session Stats */}
            <Card className="bg-white shadow-xl border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900 text-base">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Session Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Questions</span>
                  <span className="font-medium text-slate-900">{session.questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Answered</span>
                  <span className="font-medium text-slate-900">{completedQuestions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Time Elapsed</span>
                  <span className="font-medium text-slate-900">{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Avg. Score</span>
                  <span className={`font-medium ${getScoreColor(
                    completedQuestions > 0 
                      ? session.questions.filter(q => q.score).reduce((sum, q) => sum + (q.score || 0), 0) / completedQuestions
                      : 0
                  )}`}>
                    {completedQuestions > 0 
                      ? (session.questions.filter(q => q.score).reduce((sum, q) => sum + (q.score || 0), 0) / completedQuestions).toFixed(1)
                      : "N/A"
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}