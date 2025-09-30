"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams, useRouter } from "next/navigation"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  ArrowLeft,
  Star,
  BookOpen,
  DollarSign,
  Award,
  Clock,
  Bookmark,
  Share2,
  Target,
  Briefcase,
  GraduationCap,
  Play,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export default function EnhancedCareerPathDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pathId = params.id as Id<"careerPaths">

  const careerPath = useQuery(api.careerPaths.getPath, { pathId })

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: careerPath?.title,
          text: careerPath?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
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

  if (careerPath === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading career path details...</p>
        </div>
      </div>
    )
  }

  if (careerPath === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-600">Career path not found</p>
          <Button onClick={() => router.push("/career-paths")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Career Paths
          </Button>
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
            <Button variant="ghost" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900" asChild>
              <Link href="/career-paths">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Career Paths</span>
              </Link>
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
                  className={`${isBookmarked ? "text-yellow-500 border-yellow-300" : "text-slate-600"}`}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare} className="text-slate-600 bg-transparent">
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
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl shadow-sm border border-slate-200/50 p-1">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Skills</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Learning</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Overview Cards */}
            <div className="grid md:grid-cols-2 gap-6">
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
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-slate-200/50 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-slate-900">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    Match Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold mb-2 ${getMatchScoreColor(careerPath.matchScore)}`}>
                    {careerPath.matchScore}%
                  </div>
                  <p className="text-slate-600">{getMatchScoreLabel(careerPath.matchScore)}</p>
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
                    <div
                      key={title}
                      className="group p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 cursor-pointer"
                    >
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
                      <Badge variant={index < 3 ? "default" : "secondary"}>
                        {index < 3 ? "Critical" : "Important"}
                      </Badge>
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
                {careerPath.courses && careerPath.courses.length > 0 ? (
                  <div className="space-y-4">
                    {careerPath.courses.map((course, index) => (
                      <div
                        key={index}
                        className="group p-6 bg-slate-50 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 mb-2 text-lg">{course.title}</h4>
                            <div className="flex items-center space-x-6 text-sm text-slate-600 mb-3">
                              <span className="flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                {course.provider}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {course.duration}
                              </span>
                            </div>
                            <Badge variant="outline" className="mb-2">
                              {course.level}
                            </Badge>
                          </div>
                          <Button
                            className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            asChild
                          >
                            <a href={course.url} target="_blank" rel="noopener noreferrer">
                              <Play className="w-4 h-4 mr-2" />
                              Start Course
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-8">No courses available yet for this career path.</p>
                )}
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
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 bg-white text-slate-900 hover:bg-slate-100"
                    asChild
                  >
                    <Link href="/interview">
                      <Play className="w-5 h-5 mr-2" />
                      Start Mock Interview
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
                    asChild
                  >
                    <Link href="/career-paths">
                      <Calendar className="w-5 h-5 mr-2" />
                      Explore More Paths
                    </Link>
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
