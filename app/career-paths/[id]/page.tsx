"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  ArrowLeft,
  Star,
  TrendingUp,
  BookOpen,
  DollarSign,
  MapPin,
  Users,
  Clock,
  ExternalLink,
  Bookmark,
  Share2,
  Calendar,
  Award,
  Target,
  BarChart3,
  CheckCircle,
  ChevronRight,
  Globe,
  Heart,
  Briefcase,
  GraduationCap,
  Play,

} from "lucide-react"

interface CareerPath {
  id: string
  title: string
  description: string
  matchScore: number
  skills: string[]
  jobTitles: string[]
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  courses: Array<{
    title: string
    provider: string
    url: string
    duration: string
    level: string
    rating: number
    enrolled: number
  }>
  marketInsights: {
    growthRate: number
    openPositions: number
    demandSupplyRatio: number
    topCompanies: string[]
    popularLocations: string[]
  }
  roadmap: Array<{
    phase: string
    duration: string
    milestones: string[]
    completed?: boolean
  }>
}

// Mock data for demonstration
const mockCareerPath: CareerPath = {
  id: "data-scientist",
  title: "Data Scientist",
  description: "Analyze complex data to help organizations make data-driven decisions using statistical methods, machine learning, and programming.",
  matchScore: 92,
  skills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization", "R Programming", "Deep Learning", "Big Data Analytics"],
  jobTitles: ["Data Scientist", "Senior Data Scientist", "Machine Learning Engineer", "Data Analytics Manager", "AI Research Scientist", "Business Intelligence Analyst"],
  salaryRange: {
    min: 85000,
    max: 150000,
    currency: "USD"
  },
  courses: [
    {
      title: "Python for Data Science and Machine Learning",
      provider: "Coursera",
      url: "#",
      duration: "8 weeks",
      level: "Beginner",
      rating: 4.6,
      enrolled: 125000
    },
    {
      title: "Advanced Machine Learning Specialization",
      provider: "edX",
      url: "#",
      duration: "12 weeks",
      level: "Advanced",
      rating: 4.8,
      enrolled: 89000
    },
    {
      title: "Statistical Analysis and Data Visualization",
      provider: "Udacity",
      url: "#",
      duration: "6 weeks",
      level: "Intermediate",
      rating: 4.5,
      enrolled: 67000
    }
  ],
  marketInsights: {
    growthRate: 85,
    openPositions: 12400,
    demandSupplyRatio: 3.2,
    topCompanies: ["Google", "Microsoft", "Amazon", "Meta", "Netflix"],
    popularLocations: ["San Francisco", "New York", "Seattle", "Austin", "Boston"]
  },
  roadmap: [
    {
      phase: "Foundation",
      duration: "3-6 months",
      milestones: ["Learn Python basics", "Master SQL", "Statistics fundamentals", "Data visualization tools"],
      completed: true
    },
    {
      phase: "Intermediate",
      duration: "6-9 months",
      milestones: ["Machine learning algorithms", "Advanced statistics", "Data preprocessing", "Build first projects"],
      completed: false
    },
    {
      phase: "Advanced",
      duration: "9-12 months",
      milestones: ["Deep learning", "Big data tools", "MLOps", "Portfolio development"],
      completed: false
    },
    {
      phase: "Professional",
      duration: "12+ months",
      milestones: ["Industry experience", "Specialization", "Leadership skills", "Continuous learning"],
      completed: false
    }
  ]
}

export default function EnhancedCareerPathDetailPage() {
  const [careerPath, setCareerPath] = useState<CareerPath>(mockCareerPath)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: careerPath.title,
          text: careerPath.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 75) return "text-blue-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getMatchScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent Match"
    if (score >= 75) return "Good Match"
    if (score >= 60) return "Fair Match"
    return "Poor Match"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading career path details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Career Paths</span>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Career Companion
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/50">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-4xl font-bold text-slate-900">{careerPath.title}</h1>
                  <Badge variant="secondary" className="text-sm font-medium">
                    {getMatchScoreLabel(careerPath.matchScore)}
                  </Badge>
                </div>
                <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">{careerPath.description}</p>
              </div>
              <div className="flex items-center space-x-3 ml-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={`${isBookmarked ? 'text-yellow-500 border-yellow-300' : 'text-slate-600'}`}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare} className="text-slate-600">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Enhanced Match Score */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Star className={`w-6 h-6 ${getMatchScoreColor(careerPath.matchScore)}`} />
                  <span className="font-semibold text-slate-900">Compatibility Score</span>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getMatchScoreColor(careerPath.matchScore)}`}>
                    {careerPath.matchScore}%
                  </div>
                  <div className="text-sm text-slate-600">{getMatchScoreLabel(careerPath.matchScore)}</div>
                </div>
              </div>
              <Progress value={careerPath.matchScore} className="h-3" />
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white rounded-xl shadow-sm border border-slate-200/50 p-1">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Roadmap</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Skills</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Learning</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Market</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Overview Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white shadow-lg border-slate-200/50 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-slate-900">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    Salary Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    ${careerPath.salaryRange.min.toLocaleString()} - ${careerPath.salaryRange.max.toLocaleString()}
                  </div>
                  <p className="text-slate-600">{careerPath.salaryRange.currency} annually</p>
                  <div className="mt-4 text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    15% above market average
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-slate-200/50 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-slate-900">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    Job Demand
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">High</div>
                  <p className="text-slate-600">Market demand</p>
                  <div className="mt-4 text-sm text-blue-600 flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" />
                    12,400+ open positions
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-slate-200/50 hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-slate-900">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    Time to Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">12-18</div>
                  <p className="text-slate-600">Months with dedication</p>
                  <div className="mt-4 text-sm text-purple-600 flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    Based on your background
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Titles */}
            <Card className="bg-white shadow-lg border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Common Job Titles
                </CardTitle>
                <CardDescription>Roles you can pursue in this career path</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {careerPath.jobTitles.map((title, index) => (
                    <div key={title} className="group p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">{title}</span>
                        <Badge variant={index < 2 ? "default" : "secondary"} className="ml-2">
                          {index < 2 ? "Primary" : "Alternative"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card className="bg-white shadow-lg border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <Calendar className="w-5 h-5 mr-2" />
                  Learning Roadmap
                </CardTitle>
                <CardDescription>Your personalized path to becoming a {careerPath.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {careerPath.roadmap.map((phase, index) => (
                    <div key={phase.phase} className="relative">
                      {index < careerPath.roadmap.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-20 bg-slate-200"></div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                          phase.completed 
                            ? 'bg-green-100 border-green-300 text-green-600' 
                            : 'bg-slate-100 border-slate-300 text-slate-600'
                        }`}>
                          {phase.completed ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <span className="font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{phase.phase}</h3>
                            <Badge variant="outline">{phase.duration}</Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 mt-3">
                            {phase.milestones.map((milestone, mIndex) => (
                              <div key={mIndex} className="flex items-center space-x-2 text-sm text-slate-600">
                                <div className={`w-2 h-2 rounded-full ${phase.completed ? 'bg-green-400' : 'bg-slate-300'}`}></div>
                                <span>{milestone}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card className="bg-white shadow-lg border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <Award className="w-5 h-5 mr-2" />
                  Required Skills
                </CardTitle>
                <CardDescription>Master these skills to excel in this career path</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {careerPath.skills.map((skill, index) => (
                    <div
                      key={skill}
                      className="group flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 cursor-pointer"
                    >
                      <span className="font-medium text-slate-900">{skill}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={index < 3 ? "default" : "secondary"}>
                          {index < 3 ? "Critical" : "Important"}
                        </Badge>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card className="bg-white shadow-lg border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Recommended Learning Path
                </CardTitle>
                <CardDescription>Curated courses to build your expertise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {careerPath.courses.map((course, index) => (
                    <div key={index} className="group p-6 bg-slate-50 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-2 text-lg">{course.title}</h4>
                          <div className="flex items-center space-x-6 text-sm text-slate-600 mb-3">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {course.provider}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {course.duration}
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {course.rating}
                            </span>
                            <span className="flex items-center">
                              <Globe className="w-4 h-4 mr-1" />
                              {course.enrolled.toLocaleString()} enrolled
                            </span>
                          </div>
                          <Badge variant="outline" className="mb-2">{course.level}</Badge>
                        </div>
                        <Button className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Play className="w-4 h-4 mr-2" />
                          Start Course
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-900">Market Statistics</CardTitle>
                  <CardDescription>Current market trends and opportunities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600 mb-2">{careerPath.marketInsights.growthRate}%</div>
                      <p className="text-sm text-green-700">Growth Rate</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{(careerPath.marketInsights.openPositions / 1000).toFixed(1)}k+</div>
                      <p className="text-sm text-blue-700">Open Jobs</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600 mb-2">{careerPath.marketInsights.demandSupplyRatio}:1</div>
                      <p className="text-sm text-purple-700">Demand/Supply</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-900">Top Hiring Companies</CardTitle>
                  <CardDescription>Leading employers in this field</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerPath.marketInsights.topCompanies.map((company, index) => (
                      <div key={company} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-900">{company}</span>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-lg border-slate-200/50">
              <CardHeader>
                <CardTitle className="text-slate-900">Popular Locations</CardTitle>
                <CardDescription>Cities with highest demand for this role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {careerPath.marketInsights.popularLocations.map((location) => (
                    <div key={location} className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 cursor-pointer">
                      <MapPin className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                      <span className="text-sm font-medium text-slate-900">{location}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced CTA */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                <p className="text-xl text-blue-100 mb-8">
                  Take the next step with personalized mock interviews and career guidance tailored to your goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-slate-900 hover:bg-slate-100">
                    <Play className="w-5 h-5 mr-2" />
                    Start Mock Interview
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-slate-900">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}