"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAnalytics } from "@/lib/analytics"
import { scrapeJobsClient, scrapeCoursesClient } from "@/lib/scraping-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OnboardingGuard } from "@/components/onboarding-guard"
import {
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
  Briefcase,
  Brain,
  Lightbulb,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DashboardNav } from "@/components/dashboard-nav"
import EmptyVideoInterview from "./emptyVideoInterview"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const analytics = useAnalytics()
  const [interviewList, setInterviewList] = useState([])
  const getUserByEmail = useQuery(
    api.users.getByEmail,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip",
  )

  const getCareerRecommendations = useQuery(
    api.users.getCareerRecommendations,
    getUserByEmail?._id ? { userId: getUserByEmail._id } : "skip",
  )

  const getUserProfile = useQuery(api.users.getProfile, getUserByEmail?._id ? { userId: getUserByEmail._id } : "skip")

  const interviewSessions = useQuery(
    api.interviews.getUserSessions,
    getUserByEmail?._id ? { userId: getUserByEmail._id } : "skip",
  )

  const userProgress = useQuery(
    api.progress.getUserProgress,
    getUserByEmail?._id ? { userId: getUserByEmail._id } : "skip",
  )

  const [personalizedContent, setPersonalizedContent] = useState({
    recommendedActions: [],
    skillGaps: [],
    learningPath: [],
    matchingJobs: [],
  })

  const [scrapedJobs, setScrapedJobs] = useState([])
  const [scrapedCourses, setScrapedCourses] = useState([])
  const [isScrapingJobs, setIsScrapingJobs] = useState(false)
  const [isScrapingCourses, setIsScrapingCourses] = useState(false)

  const userStats = {
    totalInterviews: userProgress?.totalInterviews || 0,
    averageScore: userProgress?.averageScore || 0,
    improvementRate: 23, // Can be calculated from historical data
    streakDays: userProgress?.streakDays || 0,
    careerPathsExplored: getCareerRecommendations?.length || 0,
    hoursSpent: getUserByEmail?.availabilityHours || 0,
  }

  useEffect(() => {
    if (getUserByEmail && getCareerRecommendations) {
      generatePersonalizedContent()
    }
  }, [getUserByEmail, getCareerRecommendations])

  useEffect(() => {
    if (isLoaded && user) {
      analytics.track("dashboard_viewed", {
        user_id: user.id,
        user_email: user.primaryEmailAddress?.emailAddress,
        experience_level: getUserByEmail?.experienceLevel,
        interests_count: getUserByEmail?.interests?.length || 0,
        career_paths_count: getCareerRecommendations?.length || 0,
        total_interviews: userStats.totalInterviews,
        average_score: userStats.averageScore,
      })
    }
  }, [isLoaded, user, getUserByEmail, getCareerRecommendations, analytics])

  const generatePersonalizedContent = () => {
    const user = getUserByEmail
    const careerPaths = getCareerRecommendations || []

    // Generate recommended actions based on user profile
    const recommendedActions = []

    if (user?.experienceLevel === "beginner") {
      recommendedActions.push({
        title: "Complete Skill Assessment",
        description: "Take our comprehensive skill assessment to identify your strengths",
        icon: "🎯",
        priority: "high",
        action: "assessment",
      })
    }

    if (user?.careerGoals?.includes("Learn new skills")) {
      recommendedActions.push({
        title: "Explore Learning Paths",
        description: "Discover courses tailored to your interests and goals",
        icon: "📚",
        priority: "medium",
        action: "learning",
      })
    }

    if (careerPaths.length === 0) {
      recommendedActions.push({
        title: "Generate Career Paths",
        description: "Get AI-powered career recommendations based on your profile",
        icon: "🚀",
        priority: "high",
        action: "careers",
      })
    }

    if (user?.interests && user.interests.length > 0) {
      recommendedActions.push({
        title: "Find Live Job Opportunities",
        description: "Discover current job openings that match your profile",
        icon: "💼",
        priority: "medium",
        action: "scrape-jobs",
      })
    }

    // Generate skill gaps analysis
    const skillGaps = []
    if (user?.interests?.includes("ai") && !user?.skills?.includes("Python")) {
      skillGaps.push({ skill: "Python", importance: "High", reason: "Essential for AI development" })
    }
    if (user?.interests?.includes("web-dev") && !user?.skills?.includes("React")) {
      skillGaps.push({ skill: "React", importance: "High", reason: "Popular frontend framework" })
    }

    setPersonalizedContent({
      recommendedActions,
      skillGaps,
      learningPath: generateLearningPath(user),
      matchingJobs: generateMatchingJobs(user),
    })
  }

  const generateLearningPath = (user) => {
    if (!user?.interests) return []

    const paths = []
    if (user.interests.includes("ai")) {
      paths.push({
        title: "AI Fundamentals",
        progress: 0,
        duration: "4 weeks",
        modules: ["Introduction to AI", "Machine Learning Basics", "Python for AI"],
      })
    }
    if (user.interests.includes("web-dev")) {
      paths.push({
        title: "Modern Web Development",
        progress: 25,
        duration: "6 weeks",
        modules: ["HTML/CSS", "JavaScript ES6+", "React Fundamentals", "Backend APIs"],
      })
    }
    return paths
  }

  const generateMatchingJobs = (user) => {
    if (!user?.interests) return []

    const jobs = []
    if (user.interests.includes("ai")) {
      jobs.push({
        title: "Junior AI Developer",
        company: "TechCorp",
        match: 85,
        salary: "$75,000 - $95,000",
        location: user.location || "Remote",
      })
    }
    if (user.interests.includes("web-dev")) {
      jobs.push({
        title: "Frontend Developer",
        company: "StartupXYZ",
        match: 92,
        salary: "$65,000 - $85,000",
        location: user.location || "Remote",
      })
    }
    return jobs
  }

  const handleScrapeJobs = async () => {
    if (!getUserByEmail?.interests) return

    setIsScrapingJobs(true)
    try {
      const jobs = await scrapeJobsClient({
        interests: getUserByEmail.interests,
        skills: getUserByEmail.skills || [],
        experienceLevel: getUserByEmail.experienceLevel || "mid",
        location: getUserByEmail.location || "Remote",
      })
      setScrapedJobs(jobs.slice(0, 5)) // Show top 5 jobs

      analytics.track("jobs_scraped", {
        user_id: user?.id,
        job_count: jobs.length,
        interests: getUserByEmail.interests,
      })
    } catch (error) {
      console.error("Failed to scrape jobs:", error)
    } finally {
      setIsScrapingJobs(false)
    }
  }

  const handleScrapeCourses = async () => {
    if (!getUserByEmail?.interests) return

    setIsScrapingCourses(true)
    try {
      const courses = await scrapeCoursesClient(getUserByEmail.interests)
      setScrapedCourses(courses.slice(0, 3)) // Show top 3 courses

      analytics.track("courses_scraped", {
        user_id: user?.id,
        course_count: courses.length,
        interests: getUserByEmail.interests,
      })
    } catch (error) {
      console.error("Failed to scrape courses:", error)
    } finally {
      setIsScrapingCourses(false)
    }
  }

  const interviewHistory = (interviewSessions || []).map((session) => ({
    id: session._id,
    jobRole: session.jobRole,
    date: new Date(session.createdAt).toISOString().split("T")[0],
    score: session.overallScore || 0,
    duration: session.duration ? `${Math.round(session.duration / 60)}m` : "N/A",
    type: session.sessionType === "voice" ? "Voice" : "Technical",
  }))

  const achievements = (userProgress?.achievements || []).map((achievement, index) => ({
    id: String(index + 1),
    title: achievement.title,
    description: achievement.description,
    icon: achievement.icon,
    unlockedAt: new Date(achievement.unlockedAt).toISOString().split("T")[0],
    isUnlocked: true,
  }))

  // Add default locked achievements if user has fewer than 6
  const defaultAchievements = [
    {
      id: "default-1",
      title: "First Interview",
      description: "Complete your first mock interview",
      icon: "🎯",
      unlockedAt: "",
      isUnlocked: false,
    },
    {
      id: "default-2",
      title: "High Scorer",
      description: "Achieve a score of 8+ in an interview",
      icon: "⭐",
      unlockedAt: "",
      isUnlocked: false,
    },
    {
      id: "default-3",
      title: "Consistent Learner",
      description: "Complete 5 interviews in a week",
      icon: "🔥",
      unlockedAt: "",
      isUnlocked: false,
    },
    {
      id: "default-4",
      title: "Career Explorer",
      description: "Explore 3 different career paths",
      icon: "🗺️",
      unlockedAt: "",
      isUnlocked: false,
    },
    {
      id: "default-5",
      title: "Perfect Score",
      description: "Achieve a perfect 10/10 in an interview",
      icon: "💎",
      unlockedAt: "",
      isUnlocked: false,
    },
    {
      id: "default-6",
      title: "Marathon Learner",
      description: "Spent 10+ hours practicing this month",
      icon: "🏃",
      unlockedAt: "",
      isUnlocked: false,
    },
  ]

  const allAchievements = [...achievements, ...defaultAchievements.slice(achievements.length)]

  const careerPaths = getCareerRecommendations || []

  const performanceData = interviewHistory
    .slice(0, 6)
    .reverse()
    .map((interview) => ({
      date: new Date(interview.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: interview.score,
    }))

  const skillsData = (userProgress?.strengths || getUserByEmail?.skills || []).slice(0, 5).map((skill) => ({
    skill: typeof skill === "string" ? skill : skill.name || "Unknown",
    score: typeof skill === "object" && skill.score ? skill.score : Math.random() * 3 + 7,
  }))

  // Add default skills if user has none
  if (skillsData.length === 0) {
    skillsData.push(
      { skill: "Communication", score: 0 },
      { skill: "Technical", score: 0 },
      { skill: "Problem Solving", score: 0 },
    )
  }

  const weeklyActivityData = (() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const counts = new Array(7).fill(0)

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    interviewHistory.forEach((interview) => {
      const interviewDate = new Date(interview.date)
      if (interviewDate.getTime() > oneWeekAgo) {
        const dayIndex = (interviewDate.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
        counts[dayIndex]++
      }
    })

    return days.map((day, index) => ({
      day,
      interviews: counts[index],
    }))
  })()

  const interestData =
    getUserByEmail?.interests?.map((interest) => ({
      name: interest.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value: Math.random() * 30 + 10,
    })) || []

  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"]

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

  const handleTabChange = (tabValue) => {
    analytics.track("dashboard_tab_changed", {
      tab: tabValue,
      user_id: user?.id,
      timestamp: new Date().toISOString(),
    })
  }

  const handleStartInterview = () => {
    analytics.track("start_interview_clicked", {
      source: "dashboard_quick_action",
      user_id: user?.id,
    })
  }

  const handleExploreCareers = () => {
    analytics.track("explore_careers_clicked", {
      source: "dashboard_quick_action",
      user_id: user?.id,
    })
  }

  const handleRecommendedAction = (action) => {
    analytics.track("recommended_action_clicked", {
      action_type: action.action,
      action_title: action.title,
      priority: action.priority,
      user_id: user?.id,
    })

    if (action.action === "scrape-jobs") {
      handleScrapeJobs()
    } else if (action.action === "learning") {
      handleScrapeCourses()
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600 dark:text-slate-300">Loading your personalized dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <DashboardNav />

        <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 py-8">
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
              {getUserByEmail?.experienceLevel === "beginner"
                ? "Ready to start your career journey? Let's build those foundational skills."
                : getUserByEmail?.experienceLevel === "expert"
                  ? "Continue mastering your expertise and exploring new opportunities."
                  : "Ready to take your career to the next level? Let's keep building those skills."}
            </p>
            {getUserByEmail?.interests && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {getUserByEmail.interests.slice(0, 3).map((interest) => (
                  <Badge key={interest} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {interest.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {personalizedContent.recommendedActions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
                Recommended for You
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedContent.recommendedActions.map((action, index) => (
                  <Card
                    key={index}
                    className="border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => handleRecommendedAction(action)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{action.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{action.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{action.description}</p>
                          <Badge variant={action.priority === "high" ? "default" : "secondary"}>
                            {action.priority} priority
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
                      <span className="ml-1">Keep practicing!</span>
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
                      {userStats.averageScore.toFixed(1)}
                      <span className="text-lg">/10</span>
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                      {getImprovementIcon(12)}
                      <span className="ml-1">Great progress!</span>
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
                    <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Career Match</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                      {careerPaths[0]?.matchScore || 0}%
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>Top career path</span>
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 shadow-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">Learning Hours</p>
                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                      {userStats.hoursSpent}
                      <span className="text-lg">h</span>
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">Weekly goal</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-8" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="personalized"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                For You
              </TabsTrigger>
              <TabsTrigger
                value="videoInterviews"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Video Interviews
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

            <TabsContent value="personalized" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Skill Gaps Analysis */}
                {personalizedContent.skillGaps.length > 0 && (
                  <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-1">
                      <CardHeader>
                        <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                            <Target className="w-4 h-4 text-white" />
                          </div>
                          Skill Gaps to Address
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">
                          Skills that could boost your career prospects
                        </CardDescription>
                      </CardHeader>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {personalizedContent.skillGaps.map((gap, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl"
                          >
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-slate-100">{gap.skill}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{gap.reason}</p>
                            </div>
                            <Badge variant={gap.importance === "High" ? "destructive" : "secondary"}>
                              {gap.importance}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Interest Distribution */}
                {interestData.length > 0 && (
                  <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-1">
                      <CardHeader>
                        <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          Your Interest Profile
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">
                          Distribution of your career interests
                        </CardDescription>
                      </CardHeader>
                    </div>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={interestData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {interestData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>

              {scrapedJobs.length > 0 && (
                <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-1">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <Briefcase className="w-4 h-4 text-white" />
                        </div>
                        Live Job Opportunities
                        <Badge className="ml-2 bg-green-500 text-white">Fresh</Badge>
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Real-time job openings matching your profile
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {scrapedJobs.map((job, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                              <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200">{job.title}</h4>
                              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                <span>{job.company}</span>
                                <span>•</span>
                                <span>{job.location}</span>
                                {job.salary && (
                                  <>
                                    <span>•</span>
                                    <span>{job.salary}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Button size="sm" variant="outline" asChild>
                              <a href={job.url} target="_blank" rel="noopener noreferrer">
                                Apply
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={handleScrapeJobs}
                        disabled={isScrapingJobs}
                        className="bg-transparent"
                      >
                        {isScrapingJobs ? "Searching..." : "Refresh Jobs"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {scrapedCourses.length > 0 && (
                <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-1">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        Trending Courses
                        <Badge className="ml-2 bg-purple-500 text-white">Live</Badge>
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Latest courses for your interests
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      {scrapedCourses.map((course, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl"
                        >
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{course.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{course.provider}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                              {course.price || "Free"}
                            </span>
                            <Button size="sm" variant="outline" asChild>
                              <a href={course.url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={handleScrapeCourses}
                        disabled={isScrapingCourses}
                        className="bg-transparent"
                      >
                        {isScrapingCourses ? "Finding Courses..." : "Refresh Courses"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Learning Paths */}
              {personalizedContent.learningPath.length > 0 && (
                <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 p-1">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        Personalized Learning Paths
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Curated learning journeys based on your interests
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {personalizedContent.learningPath.map((path, index) => (
                        <div
                          key={index}
                          className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl"
                        >
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{path.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{path.duration}</p>
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{path.progress}%</span>
                            </div>
                            <Progress value={path.progress} className="h-2" />
                          </div>
                          <div className="space-y-1">
                            {path.modules.slice(0, 3).map((module, idx) => (
                              <div key={idx} className="text-xs text-slate-500 dark:text-slate-400">
                                • {module}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Matching Jobs */}
              {personalizedContent.matchingJobs.length > 0 && (
                <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-1">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <Briefcase className="w-4 h-4 text-white" />
                        </div>
                        Jobs Matching Your Profile
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Opportunities aligned with your interests and skills
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {personalizedContent.matchingJobs.map((job, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                              <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200">{job.title}</h4>
                              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                <span>{job.company}</span>
                                <span>•</span>
                                <span>{job.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-500 text-white mb-1">{job.match}% match</Badge>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{job.salary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

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
                      <Button
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                        onClick={handleStartInterview}
                      >
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
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Discover new career opportunities
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-transparent"
                        onClick={handleExploreCareers}
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
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {skill.skill}
                            </span>
                            <span className={`font-bold ${getScoreColor(skill.score)}`}>
                              {skill.score.toFixed(1)}/10
                            </span>
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

            <TabsContent value="videoInterviews" className="space-y-6">
              {interviewList.length == 0 &&
              <EmptyVideoInterview />
              }
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
                    key={path.id || path._id}
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
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {path.progress || 0}%
                          </span>
                        </div>
                        <Progress value={path.progress || 0} className="h-3" />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {path.salaryRange
                            ? `$${path.salaryRange.min.toLocaleString()} - $${path.salaryRange.max.toLocaleString()}`
                            : "Salary info available"}
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
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Problem Solving
                          </span>
                          <Badge className="bg-green-500 text-white">8.2/10</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Technical Skills
                          </span>
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
                {allAchievements.map((achievement, index) => (
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
    </OnboardingGuard>
  )
}
