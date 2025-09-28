'use client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, ArrowLeft, Star, TrendingUp, Users, Award, Play, MessageSquare, BarChart3, Target, Zap, BookOpen, Calendar, Briefcase, GraduationCap, Rocket, CheckCircle, ChevronRight, Clock, Trophy, Sparkles, Globe, Shield } from "lucide-react"

export default function EnhancedDemoPage() {
  const [activeDemo, setActiveDemo] = useState("career")
  const [isPlaying, setIsPlaying] = useState(false)
  const [interviewProgress, setInterviewProgress] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    success: 0,
    growth: 0
  })

  // Animated stats counter
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        users: prev.users < 10000 ? prev.users + 150 : 10000,
        success: prev.success < 95 ? prev.success + 1 : 95,
        growth: prev.growth < 3 ? prev.growth + 0.05 : 3
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Mock interview demo
  const interviewQuestions = [
    "Tell me about yourself and your background",
    "What's your greatest strength?",
    "Describe a challenging project you worked on",
    "Where do you see yourself in 5 years?"
  ]

  const startInterviewDemo = () => {
    setIsPlaying(true)
    setInterviewProgress(0)
    setCurrentQuestion(0)
    
    const interval = setInterval(() => {
      setInterviewProgress(prev => {
        if (prev >= 100) {
          setIsPlaying(false)
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    const questionInterval = setInterval(() => {
      setCurrentQuestion(prev => {
        if (prev >= interviewQuestions.length - 1) {
          clearInterval(questionInterval)
          return prev
        }
        return prev + 1
      })
    }, 1250)
  }

  const careerPaths = [
    { title: "Full Stack Developer", match: 95, salary: "$85k-120k", growth: "High", icon: "💻" },
    { title: "AI Engineer", match: 92, salary: "$100k-150k", growth: "Very High", icon: "🤖" },
    { title: "Product Manager", match: 87, salary: "$90k-130k", growth: "High", icon: "📊" },
    { title: "Data Scientist", match: 84, salary: "$80k-125k", growth: "High", icon: "📈" },
    { title: "UX Designer", match: 79, salary: "$70k-110k", growth: "Medium", icon: "🎨" }
  ]

  const skillRecommendations = [
    { skill: "React.js", level: 85, trending: true },
    { skill: "Machine Learning", level: 70, trending: true },
    { skill: "System Design", level: 60, trending: false },
    { skill: "Python", level: 90, trending: true }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Enhanced Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
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
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Live Demo
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">Interactive Demo</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Experience Career Companion
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Discover how our AI-powered platform transforms career development with personalized guidance, 
            intelligent coaching, and data-driven insights.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Play className="w-4 h-4 mr-2" />
              Start Interactive Demo
            </Button>
            <Button size="lg" variant="outline" className="bg-white dark:bg-slate-800">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Live Demo
            </Button>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="mb-16">
          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-1 mb-8">
              <TabsTrigger value="career" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Career Discovery
              </TabsTrigger>
              <TabsTrigger value="interview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Interview Coach
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Skill Builder
              </TabsTrigger>
              <TabsTrigger value="network" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Networking
              </TabsTrigger>
            </TabsList>

            {/* Career Discovery Demo */}
            <TabsContent value="career" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-slate-900 dark:text-white">AI Career Analysis</CardTitle>
                        <CardDescription>Personalized career recommendations based on your profile</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Top Career Matches</h4>
                      <div className="space-y-3">
                        {careerPaths.slice(0, 3).map((path, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{path.icon}</span>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">{path.title}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{path.salary}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={path.match >= 90 ? "default" : "secondary"} className="mb-1">
                                {path.match}% Match
                              </Badge>
                              <div className="text-xs text-emerald-600 dark:text-emerald-400">{path.growth} Growth</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                      <Target className="w-4 h-4 mr-2" />
                      Explore All Matches
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Skill Gap Analysis</CardTitle>
                    <CardDescription>Skills to develop for your target role</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skillRecommendations.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-slate-900 dark:text-white">{skill.skill}</span>
                            {skill.trending && <Badge variant="outline" className="text-xs">🔥 Trending</Badge>}
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Learning Path
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Interview Coach Demo */}
            <TabsContent value="interview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-slate-900 dark:text-white">Live Interview Simulation</CardTitle>
                        <CardDescription>Practice with AI-powered feedback</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg min-h-[200px] flex flex-col justify-center">
                      {!isPlaying ? (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-blue-600 transition-colors cursor-pointer" onClick={startInterviewDemo}>
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Start Mock Interview</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Click to begin a sample technical interview</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Recording...</span>
                          </div>
                          <div className="bg-white dark:bg-slate-700 p-3 rounded-lg">
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                              AI: {interviewQuestions[currentQuestion]}
                            </p>
                          </div>
                          <Progress value={interviewProgress} className="h-2" />
                          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                            Question {currentQuestion + 1} of {interviewQuestions.length}
                          </div>
                        </div>
                      )}
                    </div>
                    {interviewProgress === 100 && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800 dark:text-green-300">Interview Complete!</span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Overall Score: 8.5/10 - Great communication skills!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Real-time Feedback</CardTitle>
                    <CardDescription>AI analysis of your responses</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center space-x-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-800 dark:text-green-300">Strengths</span>
                        </div>
                        <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                          <li>• Clear and structured responses</li>
                          <li>• Good use of specific examples</li>
                          <li>• Confident delivery</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center space-x-2 mb-1">
                          <Target className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Areas to Improve</span>
                        </div>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                          <li>• Add more quantifiable results</li>
                          <li>• Practice STAR method</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center space-x-2 mb-1">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Next Steps</span>
                        </div>
                        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                          <li>• Practice behavioral questions</li>
                          <li>• Prepare project examples</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Personalized Learning Path</CardTitle>
                    <CardDescription>Curated courses based on your goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: "Advanced React Patterns", progress: 75, duration: "4 weeks" },
                        { title: "Machine Learning Fundamentals", progress: 30, duration: "8 weeks" },
                        { title: "System Design Principles", progress: 0, duration: "6 weeks" }
                      ].map((course, index) => (
                        <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900 dark:text-white">{course.title}</h4>
                            <Badge variant="outline">{course.duration}</Badge>
                          </div>
                          <Progress value={course.progress} className="h-2 mb-2" />
                          <div className="text-sm text-slate-600 dark:text-slate-400">{course.progress}% complete</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Skill Certifications</CardTitle>
                    <CardDescription>Earn industry-recognized credentials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "AWS Solutions Architect", status: "Earned", date: "Dec 2023" },
                        { name: "React Developer", status: "In Progress", date: "Est. Feb 2024" },
                        { name: "Data Science", status: "Recommended", date: "Start Soon" }
                      ].map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              cert.status === 'Earned' ? 'bg-green-500' : 
                              cert.status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-300'
                            }`} />
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{cert.name}</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">{cert.date}</div>
                            </div>
                          </div>
                          <Badge variant={cert.status === 'Earned' ? 'default' : 'outline'}>
                            {cert.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Networking Tab */}
            <TabsContent value="network" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Smart Connections</CardTitle>
                    <CardDescription>AI-curated networking opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Sarah Chen", role: "Senior Engineer at Google", match: "95%", mutual: 12 },
                        { name: "Michael Rodriguez", role: "Tech Lead at Microsoft", match: "88%", mutual: 8 },
                        { name: "Emily Johnson", role: "Product Manager at Stripe", match: "82%", mutual: 5 }
                      ].map((person, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                              {person.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{person.name}</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">{person.role}</div>
                              <div className="text-xs text-slate-500">{person.mutual} mutual connections</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="mb-2">{person.match} Match</Badge>
                            <Button size="sm" variant="outline" className="w-full">Connect</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Upcoming Events</CardTitle>
                    <CardDescription>Personalized networking events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { title: "AI in Tech Meetup", date: "Jan 15", attendees: 120, type: "Virtual" },
                        { title: "React Developer Conference", date: "Jan 22", attendees: 500, type: "In-Person" },
                        { title: "Career Growth Workshop", date: "Jan 28", attendees: 80, type: "Hybrid" }
                      ].map((event, index) => (
                        <div key={index} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900 dark:text-white">{event.title}</h4>
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>{event.date}</span>
                            <span>{event.attendees} attendees</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Animated Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {Math.floor(animatedStats.users).toLocaleString()}+
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Professionals guided</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{Math.floor(animatedStats.success)}%</h3>
              <p className="text-slate-600 dark:text-slate-400">Success rate</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{animatedStats.growth.toFixed(1)}x</h3>
              <p className="text-slate-600 dark:text-slate-400">Faster career growth</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">24/7</h3>
              <p className="text-slate-600 dark:text-slate-400">AI support</p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial Section */}
        <Card className="border-0 shadow-xl mb-16 bg-gradient-to-r from-blue-50 via-purple-50 to-emerald-50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-emerald-900/10">
          <CardContent className="pt-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
              <blockquote className="text-2xl font-medium text-slate-700 dark:text-slate-300 mb-6">
                "Career Companion               </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 dark:text-white">Jessica Davis</div>
                  <div className="text-slate-600 dark:text-slate-400">Software Engineer @ Google</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 text-center">AI-Powered Insights</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-4">
                Advanced algorithms analyze millions of career paths to provide personalized recommendations
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Personality-matched career paths</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Skill gap analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Market trend predictions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 text-center">Global Network</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-4">
                Connect with industry professionals and mentors worldwide
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Smart networking suggestions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Industry event recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Mentorship matching</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 text-center">Privacy First</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-4">
                Your data is secure and private, with full control over what you share
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>GDPR compliant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Data ownership control</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Interactive CTA Section */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 p-1">
          <div className="bg-white dark:bg-slate-900 rounded-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Ready to transform your career?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
                Join thousands of professionals who have accelerated their careers with AI guidance. 
                Start your journey today with personalized insights and expert coaching.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white dark:bg-slate-800">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Demo Call
                </Button>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Floating Demo Controls */}
        <div className="fixed bottom-6 right-6 z-40 space-y-2">
          <Button 
            size="sm" 
            className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
            title="Quick Demo"
            onClick={() => startInterviewDemo()}
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="rounded-full w-12 h-12 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all"
            title="Help"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}