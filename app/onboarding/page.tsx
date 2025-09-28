'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowRight, Check, Sparkles, Target, Zap } from "lucide-react"

const INTEREST_OPTIONS = [
  { id: "ai", label: "Artificial Intelligence", description: "Machine learning, deep learning, AI systems", icon: "🤖", color: "bg-purple-500" },
  { id: "web-dev", label: "Web Development", description: "Frontend, backend, full-stack development", icon: "💻", color: "bg-blue-500" },
  { id: "mobile-dev", label: "Mobile Development", description: "iOS, Android, cross-platform apps", icon: "📱", color: "bg-green-500" },
  { id: "data-science", label: "Data Science", description: "Analytics, visualization, big data", icon: "📊", color: "bg-orange-500" },
  { id: "cybersecurity", label: "Cybersecurity", description: "Security, ethical hacking, compliance", icon: "🔒", color: "bg-red-500" },
  { id: "cloud", label: "Cloud Computing", description: "AWS, Azure, DevOps, infrastructure", icon: "☁️", color: "bg-cyan-500" },
  { id: "product", label: "Product Management", description: "Strategy, roadmaps, user experience", icon: "🎯", color: "bg-pink-500" },
  { id: "design", label: "UI/UX Design", description: "User interface, user experience, design systems", icon: "🎨", color: "bg-yellow-500" },
  { id: "marketing", label: "Digital Marketing", description: "SEO, social media, content marketing", icon: "📢", color: "bg-indigo-500" },
  { id: "finance", label: "Fintech", description: "Financial technology, blockchain, payments", icon: "💳", color: "bg-emerald-500" },
  { id: "healthcare", label: "Healthcare Tech", description: "Medical devices, health apps, telemedicine", icon: "🏥", color: "bg-teal-500" },
  { id: "gaming", label: "Game Development", description: "Game design, graphics, interactive media", icon: "🎮", color: "bg-violet-500" },
]

export default function OnboardingPage() {
  const [selectedInterests, setSelectedInterests] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId],
    )
  }

  const handleAnalyze = async () => {
    if (selectedInterests.length === 0) return

    setIsAnalyzing(true)
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsAnalyzing(false)
    
    // In a real app, this would navigate to the next page
    alert("Analysis complete! Career paths would be displayed next.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Navigation */}
      <nav className="border-b border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Career Companion
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">AI-Powered Career Discovery</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                AI Ready
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-yellow-900" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
            Discover Your Perfect
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Career Path</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Let our advanced AI analyze your interests and uncover career opportunities tailored specifically for you. 
            Your dream career is just a few clicks away.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">1</span>
              </div>
              <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">Select Interests</span>
            </div>
            <div className="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
            <div className="flex items-center opacity-50">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-slate-500 text-sm font-semibold">2</span>
              </div>
              <span className="ml-2 text-sm font-medium text-slate-500">AI Analysis</span>
            </div>
            <div className="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
            <div className="flex items-center opacity-50">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-slate-500 text-sm font-semibold">3</span>
              </div>
              <span className="ml-2 text-sm font-medium text-slate-500">Career Paths</span>
            </div>
          </div>
        </div>

        {/* Main Selection Card */}
        <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-1">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                What drives your passion?
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-300">
                Choose 3-5 areas that ignite your professional curiosity and excitement
              </CardDescription>
            </CardHeader>
          </div>
          
          <CardContent className="p-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {INTEREST_OPTIONS.map((interest, index) => (
                <div
                  key={interest.id}
                  className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    selectedInterests.includes(interest.id)
                      ? "border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg scale-105"
                      : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                  onClick={() => toggleInterest(interest.id)}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl transition-transform group-hover:scale-110 ${interest.color}`}>
                      {interest.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {interest.label}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {interest.description}
                    </p>
                    {selectedInterests.includes(interest.id) && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Interests Summary */}
        {selectedInterests.length > 0 && (
          <Card className="border-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 shadow-xl backdrop-blur-sm mb-8 animate-in slide-in-from-bottom duration-300">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center justify-center lg:justify-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    {selectedInterests.length} Interest{selectedInterests.length !== 1 ? 's' : ''} Selected
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    {selectedInterests.map((interestId) => {
                      const interest = INTEREST_OPTIONS.find((opt) => opt.id === interestId)
                      return (
                        <Badge 
                          key={interestId} 
                          className="px-4 py-2 text-sm bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 transition-colors"
                        >
                          <span className="mr-2">{interest?.icon}</span>
                          {interest?.label}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || selectedInterests.length === 0}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Analyzing Your Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-3 w-5 h-5" />
                      Discover My Career Paths
                      <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Progress */}
        {isAnalyzing && (
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-500">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-purple-200 dark:border-purple-700 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute top-3 left-3 w-18 h-18 border-3 border-pink-300 border-t-transparent rounded-full animate-spin animation-delay-150" style={{animationDirection: 'reverse'}}></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center justify-center">
                  <Brain className="mr-3 w-6 h-6 text-purple-500" />
                  AI Analysis in Progress
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
                  Our advanced AI is analyzing your interests and matching them with personalized career opportunities...
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-16 py-8">
          <p className="text-slate-500 dark:text-slate-400">
            Powered by advanced AI algorithms and real-time market data
          </p>
        </div>
      </div>
    </div>
  )
}