"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, ArrowLeft, Star, TrendingUp, TrendingDown, Clock, Target, Award, MessageSquare, Download, Share2, BookOpen, CheckCircle, XCircle, AlertCircle, Trophy, Zap, BarChart3 } from "lucide-react"

interface InterviewResults {
  jobRole: string
  interviewType: string
  sessionType: string
  difficulty: string
  startTime: number
  questions: Array<{
    id: number
    question: string
    answer: string
    feedback: string
    score: number
  }>
  overallScore: number
  strengths: string[]
  improvementAreas: string[]
  recommendations: string[]
  duration: number
}

export default function EnhancedInterviewResultsPage() {
  const [results, setResults] = useState<InterviewResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)

  useEffect(() => {
    // Simulate loading and generate mock data
    setTimeout(() => {
      const mockResults: InterviewResults = {
        jobRole: "Senior Software Engineer",
        interviewType: "Technical Interview",
        sessionType: "Mock Interview",
        difficulty: "Advanced",
        startTime: Date.now() - 1800000, // 30 minutes ago
        questions: [
          {
            id: 1,
            question: "Explain the difference between REST and GraphQL APIs, and when would you choose one over the other?",
            answer: "REST is a stateless architecture that uses standard HTTP methods, while GraphQL provides a single endpoint with flexible queries. I'd choose REST for simple CRUD operations and GraphQL for complex data relationships.",
            feedback: "Good technical understanding. Could benefit from more specific examples of implementation scenarios.",
            score: 7.5
          },
          {
            id: 2,
            question: "How would you optimize a slow database query?",
            answer: "I'd start by analyzing the execution plan, check for proper indexing, optimize joins, and consider query restructuring. Also look at database statistics and consider caching strategies.",
            feedback: "Excellent systematic approach! Great mention of execution plans and multiple optimization strategies.",
            score: 9.0
          },
          {
            id: 3,
            question: "Describe your experience with microservices architecture.",
            answer: "I've worked with containerized services using Docker and Kubernetes, implemented service discovery, and handled inter-service communication through message queues.",
            feedback: "Solid practical experience mentioned. Could elaborate more on challenges faced and lessons learned.",
            score: 8.0
          },
          {
            id: 4,
            question: "How do you handle error handling in distributed systems?",
            answer: "I implement circuit breakers, retry mechanisms with exponential backoff, proper logging, and monitoring. Also use bulkhead patterns for isolation.",
            feedback: "Outstanding knowledge of resilience patterns! Very comprehensive answer covering multiple aspects.",
            score: 9.5
          }
        ],
        overallScore: 8.5,
        strengths: ["Strong technical knowledge", "Systematic problem-solving approach", "Good understanding of distributed systems", "Practical experience with modern tools"],
        improvementAreas: ["Provide more specific examples", "Elaborate on challenges and lessons learned", "Discuss trade-offs in more detail"],
        recommendations: ["Practice behavioral questions with STAR method", "Prepare more detailed project examples", "Study system design patterns", "Practice explaining complex concepts simply"],
        duration: 1800
      }

      setResults(mockResults)
      setIsLoading(false)
      
      // Trigger animations after a short delay
      setTimeout(() => setAnimationComplete(true), 500)
    }, 1500)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-emerald-500"
    if (score >= 8) return "text-green-500"
    if (score >= 7) return "text-yellow-500"
    if (score >= 6) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 9) return <CheckCircle className="w-5 h-5 text-emerald-500" />
    if (score >= 7) return <AlertCircle className="w-5 h-5 text-yellow-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getOverallGrade = (score: number) => {
    if (score >= 9.5) return { grade: "A+", color: "text-emerald-500", bg: "bg-emerald-500/10" }
    if (score >= 9) return { grade: "A", color: "text-emerald-500", bg: "bg-emerald-500/10" }
    if (score >= 8.5) return { grade: "A-", color: "text-green-500", bg: "bg-green-500/10" }
    if (score >= 8) return { grade: "B+", color: "text-green-500", bg: "bg-green-500/10" }
    if (score >= 7) return { grade: "B", color: "text-yellow-500", bg: "bg-yellow-500/10" }
    if (score >= 6) return { grade: "B-", color: "text-yellow-500", bg: "bg-yellow-500/10" }
    if (score >= 5) return { grade: "C", color: "text-orange-500", bg: "bg-orange-500/10" }
    return { grade: "D", color: "text-red-500", bg: "bg-red-500/10" }
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 9) return { level: "Exceptional", icon: <Trophy className="w-5 h-5" />, color: "text-emerald-500" }
    if (score >= 8) return { level: "Strong", icon: <Zap className="w-5 h-5" />, color: "text-green-500" }
    if (score >= 7) return { level: "Good", icon: <Target className="w-5 h-5" />, color: "text-yellow-500" }
    if (score >= 6) return { level: "Fair", icon: <BarChart3 className="w-5 h-5" />, color: "text-orange-500" }
    return { level: "Needs Work", icon: <AlertCircle className="w-5 h-5" />, color: "text-red-500" }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">Analyzing your performance...</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">This may take a moment</div>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Results not found</h3>
          <p className="text-slate-500 dark:text-slate-400">The interview session could not be loaded.</p>
          <Button className="mt-4">Start New Interview</Button>
        </div>
      </div>
    )
  }

  const overallGrade = getOverallGrade(results.overallScore)
  const performanceLevel = getPerformanceLevel(results.overallScore)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Enhanced Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Career Companion
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animated Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center animate-pulse">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Interview Complete! 🎉
          </h1>
          <div className="flex items-center justify-center space-x-4 text-slate-600 dark:text-slate-400">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              {results.jobRole}
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              {results.interviewType}
            </span>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
              {formatDuration(results.duration)}
            </span>
          </div>
        </div>

        {/* Enhanced Overall Score Card */}
        <Card className={`border-0 shadow-2xl mb-8 overflow-hidden transition-all duration-1000 ${animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 p-1">
            <div className="bg-white dark:bg-slate-900 rounded-lg">
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-8 mb-8">
                    <div className="text-center">
                      <div className={`text-7xl font-bold ${overallGrade.color} mb-2 transition-all duration-1000 ${animationComplete ? 'scale-100' : 'scale-0'}`}>
                        {overallGrade.grade}
                      </div>
                      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${overallGrade.bg} mb-2`}>
                        {performanceLevel.icon}
                        <span className={`font-semibold ${performanceLevel.color}`}>
                          {performanceLevel.level}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Performance Level</p>
                    </div>
                    <div className="text-center">
                      <div className="text-7xl font-bold text-slate-900 dark:text-white mb-2 transition-all duration-1000 delay-300">
                        {results.overallScore}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 font-medium">out of 10</div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Average Score</p>
                    </div>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Progress 
                      value={results.overallScore * 10} 
                      className="h-4 bg-slate-200 dark:bg-slate-700"
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Enhanced Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-1000 delay-500 ${animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{results.questions.length}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Questions Answered</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{formatDuration(results.duration)}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Duration</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{results.strengths.length}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Key Strengths</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{results.improvementAreas.length}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Growth Areas</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Questions
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Analysis
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Next Steps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900 dark:text-white">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    Your Strengths
                  </CardTitle>
                  <CardDescription>Areas where you excelled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900 dark:text-white">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    Growth Opportunities
                  </CardTitle>
                  <CardDescription>Areas to focus on improving</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.improvementAreas.map((area, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{area}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="grid gap-6">
              {results.questions.map((question, index) => (
                <Card 
                  key={question.id} 
                  className={`border-0 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedQuestion === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedQuestion(selectedQuestion === index ? null : index)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <CardTitle className="text-slate-900 dark:text-white">
                          Question {index + 1}
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getScoreIcon(question.score)}
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(question.score)}`}>
                            {question.score}/10
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Score</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={`space-y-4 transition-all duration-300 ${
                    selectedQuestion === index ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Question
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{question.question}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Your Answer</h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{question.answer}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                        <Brain className="w-4 h-4 mr-2" />
                        AI Feedback
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{question.feedback}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Performance Analysis
                </CardTitle>
                <CardDescription>Detailed breakdown of your interview performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Score Distribution</h4>
                    <div className="space-y-4">
                      {results.questions.map((question, index) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-900 dark:text-white">
                              Question {index + 1}
                            </span>
                            <span className={`font-bold ${getScoreColor(question.score)}`}>
                              {question.score}/10
                            </span>
                          </div>
                          <Progress value={question.score * 10} className="h-3" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Personalized Action Plan
                </CardTitle>
                <CardDescription>Tailored recommendations to accelerate your interview success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{recommendation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Button size="lg" variant="outline" className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Practice Again
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
              <Button size="lg" variant="outline" className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Study Resources
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Achievement Badge Section */}
        <div className={`mt-12 transition-all duration-1000 delay-700 ${animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-red-900/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center space-x-2">
                    {results.overallScore >= 9 ? (
                      <>
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                          🏆 Interview Master Achievement Unlocked!
                        </span>
                      </>
                    ) : results.overallScore >= 8 ? (
                      <>
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          ⭐ Strong Performer Badge Earned!
                        </span>
                      </>
                    ) : results.overallScore >= 7 ? (
                      <>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          🎯 Good Progress Badge Earned!
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          ⚡ Learning Journey Badge Earned!
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  {results.overallScore >= 9 
                    ? "Outstanding performance! You've demonstrated exceptional interview skills and deep technical knowledge."
                    : results.overallScore >= 8
                    ? "Great job! You showed strong technical competency and clear communication skills."
                    : results.overallScore >= 7
                    ? "Good work! You're on the right track with solid fundamentals and room to grow."
                    : "Every interview is a learning opportunity. Keep practicing and you'll see continuous improvement!"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Floating Panel */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className="flex flex-col space-y-2">
            <Button 
              size="sm" 
              className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
              title="Share Results"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="rounded-full w-12 h-12 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all"
              title="Download Report"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}