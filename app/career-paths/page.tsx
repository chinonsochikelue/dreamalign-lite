"use client"

import { useEffect, useState, useRef } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  ArrowRight,
  Star,
  TrendingUp,
  BookOpen,
  DollarSign,
  MapPin,
  Sparkles,
  Award,
  Clock,
  Search,
  ExternalLink,
  Target,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardNav } from "@/components/dashboard-nav"
import { scrapeCoursesClient } from "@/lib/scraping-client"
import Link from "next/link"

export default function CareerPathsPage() {
  const { user: clerkUser } = useUser()
  const convexUser = useQuery(api.users.getCurrentUser)

  const careerPaths = useQuery(api.careerPaths.getUserPaths, convexUser?._id ? { userId: convexUser._id } : null)

  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("matchScore")
  const [filterBy, setFilterBy] = useState("all")
  const [liveCourses, setLiveCourses] = useState<any[]>([])
  const [isScrapingCourses, setIsScrapingCourses] = useState(false)
  const hasScrapedRef = useRef(false)

  useEffect(() => {
    if (convexUser && careerPaths !== undefined) {
      const interests = convexUser.interests || ["Technology", "Problem Solving"]
      setSelectedInterests(interests)

      if (interests.length > 0 && !hasScrapedRef.current) {
        hasScrapedRef.current = true
        scrapeLiveCoursesForInterests(interests)
      }
    }
  }, [convexUser, careerPaths])

  const scrapeLiveCoursesForInterests = async (interests: string[]) => {
    setIsScrapingCourses(true)
    try {
      const courses = await scrapeCoursesClient({ queries: interests, limit: 6 })
      setLiveCourses(courses.courses?.slice(0, 6) || [])
    } catch (error) {
      console.error("Failed to scrape courses:", error)
      setLiveCourses([])
    } finally {
      setIsScrapingCourses(false)
    }
  }

  const refreshCourses = () => {
    hasScrapedRef.current = false
    scrapeLiveCoursesForInterests(selectedInterests)
  }

  const sortedPaths = careerPaths
    ? [...careerPaths].sort((a, b) => {
        if (sortBy === "matchScore") return b.matchScore - a.matchScore
        if (sortBy === "salary") return b.salaryRange.max - a.salaryRange.max
        return 0
      })
    : []

  const filteredPaths = sortedPaths

  const isLoading = convexUser === undefined || careerPaths === undefined

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-pulse mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Loading Your Career Paths</h3>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Fetching your personalized recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Personalized for You
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-6">
            Your Perfect Career Match
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {selectedInterests.length > 0 ? (
              <>
                Based on your interests in{" "}
                <span className="font-semibold text-blue-600">{selectedInterests.join(", ")}</span>, here are the career
                paths that align perfectly with your profile.
              </>
            ) : (
              "Discover career paths tailored to your unique profile and interests."
            )}
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search career paths..."
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matchScore">Best Match</SelectItem>
                <SelectItem value="salary">Highest Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Career Paths Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-1 gap-8">
          {filteredPaths.map((path, index) => (
            <Card
              key={path._id}
              className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] overflow-hidden"
            >
              {/* Match Score Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{path.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-medium">{path.matchScore}% Match</span>
                        <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                          #{index + 1} Recommended
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{path.matchScore}%</div>
                    <Progress value={path.matchScore} className="w-24 h-2 mt-1" />
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{path.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
                    <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      ${Math.round(path.salaryRange.min / 1000)}K - ${Math.round(path.salaryRange.max / 1000)}K
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Salary Range</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
                    <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{path.matchScore}%</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Match Score</div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    Essential Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.slice(0, 8).map((skill, index) => (
                      <Badge
                        key={skill}
                        variant={index < 3 ? "default" : "secondary"}
                        className={
                          index < 3
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
                            : ""
                        }
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Job Titles */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                    Career Opportunities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {path.jobTitles.map((title) => (
                      <Badge key={title} variant="outline" className="border-slate-300 dark:border-slate-600">
                        {title}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Top Courses */}
                {path.courses && path.courses.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                      Recommended Learning Path
                    </h4>
                    <div className="space-y-3">
                      {path.courses.slice(0, 2).map((course, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-semibold text-slate-900 dark:text-white mb-1">{course.title}</h5>
                              <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                                <span className="flex items-center">
                                  <Award className="w-3 h-3 mr-1" />
                                  {course.provider}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {course.duration}
                                </span>
                              </div>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {course.level}
                              </Badge>
                            </div>
                            <Button size="sm" variant="ghost" className="ml-4" asChild>
                              <a href={course.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    className="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                    asChild
                  >
                    <Link href={`/career-paths/${path._id}`}>
                      <BookOpen className="mr-2 w-4 h-4" />
                      View Details
                    </Link>
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    asChild
                  >
                    <Link href="/interview">
                      Practice Interview
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPaths.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No career paths found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Complete your profile assessment to get personalized career recommendations.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" asChild>
              <Link href="/onboarding">Complete Assessment</Link>
            </Button>
          </div>
        )}

        {/* Bottom CTA */}
        {filteredPaths.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to take the next step?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Start with interview practice or explore detailed learning paths for your chosen career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-700 hover:bg-blue-800" asChild>
                  <Link href="/interview">
                    Start Interview Prep
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Live Courses section */}
        {liveCourses.length > 0 && (
          <div className="mt-16">
            <Card className="border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-2xl">
                        <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
                        Trending Courses for Your Interests
                        <Badge className="ml-3 bg-purple-500 text-white">Live</Badge>
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                        Latest courses matching your career interests: {selectedInterests.join(", ")}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={refreshCourses}
                      disabled={isScrapingCourses}
                      className="bg-transparent"
                    >
                      {isScrapingCourses ? "Updating..." : "Refresh"}
                    </Button>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8">
                {isScrapingCourses ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-slate-200 dark:bg-slate-700 rounded-xl h-48"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveCourses.map((course, index) => (
                      <Card
                        key={index}
                        className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-lg transition-all duration-200"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2">
                                {course.title}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{course.provider}</p>
                            </div>
                            {course.rating && (
                              <Badge className="bg-yellow-500 text-white ml-2">★ {course.rating}</Badge>
                            )}
                          </div>

                          {course.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
                              {course.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              {course.price && (
                                <span className="font-semibold text-green-600 dark:text-green-400">{course.price}</span>
                              )}
                              {course.duration && (
                                <span className="text-slate-500 dark:text-slate-400 ml-2">• {course.duration}</span>
                              )}
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a href={course.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
