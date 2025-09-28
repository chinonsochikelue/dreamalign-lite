"use client"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  Target,
  Clock,
  MessageSquare,
  Star,
  ArrowRight,
  Plus,
  BarChart3,
  Zap,
  Calendar,
  BookOpen,
  Trophy,
  Activity,
  Sparkles,
  ChevronRight,
  Play,
  CheckCircle,
  ArrowUp,
  TrendingDown,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [userStats, setUserStats] = useState({
    totalInterviews: 12,
    averageScore: 7.8,
    improvementRate: 23,
    streakDays: 5,
    careerPathsExplored: 3,
    hoursSpent: 8.5,
  })

  const [interviewHistory, setInterviewHistory] = useState([
    {
      id: "1",
      jobRole: "Full Stack Developer",
      date: "2025-01-20",
      score: 8.5,
      duration: "25m",
      type: "Technical",
    },
    {
      id: "2",
      jobRole: "AI/ML Engineer",
      date: "2025-01-18",
      score: 7.2,
      duration: "30m",
      type: "Behavioral",
    },
    {
      id: "3",
      jobRole: "Product Manager",
      date: "2025-01-15",
      score: 6.8,
      duration: "22m",
      type: "General",
    },
    {
      id: "4",
      jobRole: "Full Stack Developer",
      date: "2025-01-12",
      score: 7.9,
      duration: "28m",
      type: "System Design",
    },
    {
      id: "5",
      jobRole: "Data Scientist",
      date: "2025-01-10",
      score: 7.5,
      duration: "32m",
      type: "Technical",
    },
  ])

  const [achievements, setAchievements] = useState([
    {
      id: "1",
      title: "First Interview",
      description: "Completed your first mock interview",
      icon: "🎯",
      unlockedAt: "2025-01-10",
      isUnlocked: true,
    },
    {
      id: "2",
      title: "High Scorer",
      description: "Achieved a score of 8+ in an interview",
      icon: "⭐",
      unlockedAt: "2025-01-15",
      isUnlocked: true,
    },
    {
      id: "3",
      title: "Consistent Learner",
      description: "Completed 5 interviews in a week",
      icon: "🔥",
      unlockedAt: "2025-01-20",
      isUnlocked: true,
    },
    {
      id: "4",
      title: "Career Explorer",
      description: "Explored 3 different career paths",
      icon: "🗺️",
      unlockedAt: "2025-01-22",
      isUnlocked: true,
    },
    {
      id: "5",
      title: "Perfect Score",
      description: "Achieved a perfect 10/10 in an interview",
      icon: "💎",
      unlockedAt: "",
      isUnlocked: false,
    },
    {
      id: "6",
      title: "Marathon Learner",
      description: "Spent 10+ hours practicing this month",
      icon: "🏃",
      unlockedAt: "",
      isUnlocked: false,
    },
  ])

  const [careerPaths, setCareerPaths] = useState([
    {
      id: "1",
      title: "Full Stack Developer",
      matchScore: 95,
      progress: 75,
      lastViewed: "2025-01-20",
    },
    {
      id: "2",
      title: "AI/ML Engineer",
      matchScore: 92,
      progress: 45,
      lastViewed: "2025-01-18",
    },
    {
      id: "3",
      title: "Product Manager",
      matchScore: 87,
      progress: 30,
      lastViewed: "2025-01-15",
    },
  ])

  // Enhanced performance data
  const performanceData = [
    { date: "Jan 5", score: 5.8 },
    { date: "Jan 10", score: 6.2 },
    { date: "Jan 12", score: 7.9 },
    { date: "Jan 15", score: 6.8 },
    { date: "Jan 18", score: 7.2 },
    { date: "Jan 20", score: 8.5 },
  ]

  const skillsData = [
    { skill: "Communication", score: 8.5 },
    { skill: "Technical", score: 7.8 },
    { skill: "Problem Solving", score: 8.2 },
    { skill: "Leadership", score: 6.9 },
    { skill: "Creativity", score: 7.5 },
  ]

  const weeklyActivityData = [
    { day: "Mon", interviews: 2 },
    { day: "Tue", interviews: 1 },
    { day: "Wed", interviews: 3 },
    { day: "Thu", interviews: 0 },
    { day: "Fri", interviews: 2 },
    { day: "Sat", interviews: 1 },
    { day: "Sun", interviews: 1 },
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-500"
    if (score >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadgeVariant = (score) => {
    if (score >= 8) return "default"
    if (score >= 6) return "secondary"
    return "outline"
  }

  const getImprovementIcon = (rate) => {
    return rate > 0 ? <ArrowUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600 dark:text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <DashboardNav />

      <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Ready to continue your career development journey? Let's track your progress and keep building those skills.
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Total Interviews</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{userStats.totalInterviews}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                    {getImprovementIcon(5)}
                    <span className="ml-1">+2 this week</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 shadow-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">Average Score</p>
                  <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                    {userStats.averageScore}
                    <span className="text-lg">/10</span>
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                    {getImprovementIcon(12)}
                    <span className="ml-1">+0.3 this month</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 shadow-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Improvement</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">+{userStats.improvementRate}%</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>vs last month</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 shadow-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                    {userStats.streakDays}
                    <span className="text-lg">d</span>
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">Keep it going!</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="interviews"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Interviews
            </TabsTrigger>
            <TabsTrigger
              value="careers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Career Paths
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Performance Chart - Larger */}
              <div className="lg:col-span-2">
                <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-1">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        Performance Trend
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Your interview scores over time
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" className="text-slate-500" />
                        <YAxis domain={[0, 10]} className="text-slate-500" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7, fill: "#1d4ed8" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="border-0 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Ready for more?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Start another interview to improve your skills
                    </p>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                      Start Interview
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Explore Careers</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Discover new career opportunities</p>
                    <Button
                      variant="outline"
                      className="w-full border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-transparent"
                    >
                      Browse Paths
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Skills and Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-1">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      Skills Breakdown
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Your performance by skill area
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {skillsData.map((skill, index) => (
                      <div key={skill.skill} className="space-y-2" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{skill.skill}</span>
                          <span className={`font-bold ${getScoreColor(skill.score)}`}>{skill.score}/10</span>
                        </div>
                        <Progress value={skill.score * 10} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 p-1">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      Weekly Activity
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Interviews completed this week
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" className="text-slate-500" />
                      <YAxis className="text-slate-500" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                        }}
                      />
                      <Bar dataKey="interviews" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {interviewHistory.slice(0, 3).map((interview, index) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">{interview.jobRole}</h4>
                          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                            <Badge variant="outline" className="text-xs">
                              {interview.type}
                            </Badge>
                            <span>•</span>
                            <span>{formatDate(interview.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge variant={getScoreBadgeVariant(interview.score)} className="mb-1">
                            {interview.score}/10
                          </Badge>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{interview.duration}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Interview History</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Track your progress and review past interviews
                </p>
              </div>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Interview
              </Button>
            </div>

            <div className="grid gap-4">
              {interviewHistory.map((interview, index) => (
                <Card
                  key={interview.id}
                  className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                            {interview.jobRole}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            >
                              {interview.type}
                            </Badge>
                            <span>•</span>
                            <span>{formatDate(interview.date)}</span>
                            <span>•</span>
                            <span>{interview.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getScoreColor(interview.score)} mb-1`}>
                            {interview.score}/10
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Overall Score</p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="careers" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Your Career Paths</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Explore and track your career development progress
                </p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Explore More
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerPaths.map((path, index) => (
                <Card
                  key={path.id}
                  className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-slate-800 dark:text-slate-100">{path.title}</CardTitle>
                        <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
                          {path.matchScore}% match
                        </Badge>
                      </div>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Learning Progress
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-3" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last viewed: {formatDate(path.lastViewed)}
                      </span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Continue Learning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Your Progress</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 p-1">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-slate-100">
                      <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                        <Target className="w-3 h-3 text-white" />
                      </div>
                      Weekly Goals
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Track your weekly learning objectives
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Complete 3 interviews
                      </span>
                      <Badge variant="secondary">2/3</Badge>
                    </div>
                    <Progress value={67} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Explore 1 career path
                      </span>
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    </div>
                    <Progress value={100} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Achieve 8+ average score
                      </span>
                      <Badge variant="outline">7.8/8.0</Badge>
                    </div>
                    <Progress value={97} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-1">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-slate-100">
                      <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center mr-2">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      Learning Streak
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Keep up your consistent learning habit
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                      {userStats.streakDays}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Days in a row</p>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <div
                          key={day}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                            day <= userStats.streakDays
                              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg scale-110"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    Skill Development
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Areas where you're improving
                  </CardDescription>
                </CardHeader>
              </div>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center text-lg">
                      <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                        <TrendingUp className="w-3 h-3 text-white" />
                      </div>
                      Strengths
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Communication</span>
                        <Badge className="bg-green-500 text-white">8.5/10</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Problem Solving</span>
                        <Badge className="bg-green-500 text-white">8.2/10</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Technical Skills</span>
                        <Badge className="bg-green-500 text-white">7.8/10</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center text-lg">
                      <div className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center mr-2">
                        <Target className="w-3 h-3 text-white" />
                      </div>
                      Areas to Improve
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Leadership</span>
                        <Badge variant="outline">6.9/10</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Creativity</span>
                        <Badge variant="outline">7.5/10</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Achievements</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Unlock rewards as you progress in your career journey
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card
                  key={achievement.id}
                  className={`border-0 transition-all duration-300 hover:scale-105 ${
                    achievement.isUnlocked
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-xl"
                      : "bg-white/40 dark:bg-slate-800/40 opacity-60 shadow-lg"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`text-5xl mb-4 ${achievement.isUnlocked ? "animate-bounce" : ""}`}>
                      {achievement.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {achievement.description}
                    </p>
                    {achievement.isUnlocked ? (
                      <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 shadow-lg">
                        <Trophy className="w-3 h-3 mr-1" />
                        Unlocked {formatDate(achievement.unlockedAt)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-500">
                        <span className="mr-1">🔒</span>
                        Locked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-16 py-8">
          <p className="text-slate-500 dark:text-slate-400">Keep pushing forward on your career journey!</p>
        </div>
      </div>
    </div>
  )
}
