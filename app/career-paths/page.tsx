"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowRight, Star, TrendingUp, BookOpen, DollarSign, MapPin } from "lucide-react"
import Link from "next/link"
import { generateCareerPaths } from "@/lib/ai-career-analysis"

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
  }>
}

export default function CareerPathsPage() {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  useEffect(() => {
    const loadCareerPaths = async () => {
      // Get interests from localStorage (in real app, this would come from Convex)
      const interests = JSON.parse(localStorage.getItem("userInterests") || "[]")
      setSelectedInterests(interests)

      if (interests.length > 0) {
        const paths = await generateCareerPaths(interests)
        setCareerPaths(paths)
      }
      setIsLoading(false)
    }

    loadCareerPaths()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Generating Career Paths</h3>
          <p className="text-muted-foreground">AI is analyzing your interests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">Career Companion</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Personalized Career Paths</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Based on your interests, here are the career paths that match your profile best.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {careerPaths.map((path) => (
            <Card key={path.id} className="border-border bg-card hover:bg-card/80 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-foreground text-xl mb-2">{path.title}</CardTitle>
                    <CardDescription className="text-base">{path.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-foreground">{path.matchScore}%</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Match Score</span>
                    <span className="text-sm text-muted-foreground">{path.matchScore}%</span>
                  </div>
                  <Progress value={path.matchScore} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Salary Range */}
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <span className="font-medium text-foreground">
                    ${path.salaryRange.min.toLocaleString()} - ${path.salaryRange.max.toLocaleString()}{" "}
                    {path.salaryRange.currency}
                  </span>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Key Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.slice(0, 6).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Job Titles */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Common Job Titles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {path.jobTitles.slice(0, 4).map((title) => (
                      <Badge key={title} variant="outline">
                        {title}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Recommended Courses */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Recommended Courses
                  </h4>
                  <div className="space-y-2">
                    {path.courses.slice(0, 3).map((course, index) => (
                      <div key={index} className="p-3 bg-background rounded-lg border border-border">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground text-sm">{course.title}</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              {course.provider} • {course.duration} • {course.level}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" className="text-xs">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Link href={`/career-paths/${path.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/interview" className="flex-1">
                    <Button className="w-full">
                      Practice Interview
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {careerPaths.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">No career paths found</h3>
            <p className="text-muted-foreground mb-6">
              Please complete the onboarding process to get personalized recommendations.
            </p>
            <Link href="/onboarding">
              <Button>Complete Onboarding</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
