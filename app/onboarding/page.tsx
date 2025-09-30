"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Brain, ArrowRight, ArrowLeft, Check, Sparkles, Target, Zap, User, Briefcase, MapPin } from "lucide-react"
import { OnboardingGuard } from "@/components/onboarding-guard"
import { useUserDetails } from "@/context/UserDetailContext"
import { useAnalytics } from "@/lib/analytics"
import { sendCareerRecommendationEmail } from "@/lib/integrations/resend"

const INTEREST_OPTIONS = [
  {
    id: "ai",
    label: "Artificial Intelligence",
    description: "Machine learning, deep learning, AI systems",
    icon: "🤖",
    color: "bg-purple-500",
  },
  {
    id: "web-dev",
    label: "Web Development",
    description: "Frontend, backend, full-stack development",
    icon: "💻",
    color: "bg-blue-500",
  },
  {
    id: "mobile-dev",
    label: "Mobile Development",
    description: "iOS, Android, cross-platform apps",
    icon: "📱",
    color: "bg-green-500",
  },
  {
    id: "data-science",
    label: "Data Science",
    description: "Analytics, visualization, big data",
    icon: "📊",
    color: "bg-orange-500",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    description: "Security, ethical hacking, compliance",
    icon: "🔒",
    color: "bg-red-500",
  },
  {
    id: "cloud",
    label: "Cloud Computing",
    description: "AWS, Azure, DevOps, infrastructure",
    icon: "☁️",
    color: "bg-cyan-500",
  },
  {
    id: "product",
    label: "Product Management",
    description: "Strategy, roadmaps, user experience",
    icon: "🎯",
    color: "bg-pink-500",
  },
  {
    id: "design",
    label: "UI/UX Design",
    description: "User interface, user experience, design systems",
    icon: "🎨",
    color: "bg-yellow-500",
  },
  {
    id: "marketing",
    label: "Digital Marketing",
    description: "SEO, social media, content marketing",
    icon: "📢",
    color: "bg-indigo-500",
  },
  {
    id: "finance",
    label: "Fintech",
    description: "Financial technology, blockchain, payments",
    icon: "💳",
    color: "bg-emerald-500",
  },
  {
    id: "healthcare",
    label: "Healthcare Tech",
    description: "Medical devices, health apps, telemedicine",
    icon: "🏥",
    color: "bg-teal-500",
  },
  {
    id: "gaming",
    label: "Game Development",
    description: "Game design, graphics, interactive media",
    icon: "🎮",
    color: "bg-violet-500",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    interests: [],
    skills: [],
    experienceLevel: "",
    careerGoals: [],
    preferredLearningStyle: "",
    availabilityHours: 10,
    personalityType: "",
    workPreferences: [],
    salaryExpectation: { min: 50000, max: 100000, currency: "USD" },
    location: "",
    remotePreference: "",
    profilePicture: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { user } = useUser()
  const { userDetail } = useUserDetails()
  const analytics = useAnalytics() // Added analytics hook
  const [stepStartTime, setStepStartTime] = useState(Date.now())

  const updateOnboardingStep = useMutation(api.users.updateOnboardingStep)
  const completeOnboarding = useMutation(api.users.completeOnboarding)
  const generateCareerPaths = useMutation(api.users.generateCareerPaths)
  const getUserByEmail = useQuery(
    api.users.getByEmail,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip",
  )

  useEffect(() => {
    const currentUser = userDetail || getUserByEmail
    if (currentUser) {
      setCurrentStep(currentUser.onboardingStep || 1)
      setFormData((prev) => ({
        ...prev,
        interests: currentUser.interests || [],
        skills: currentUser.skills || [],
        experienceLevel: currentUser.experienceLevel || "",
        careerGoals: currentUser.careerGoals || [],
        preferredLearningStyle: currentUser.preferredLearningStyle || "",
        availabilityHours: currentUser.availabilityHours || 10,
        personalityType: currentUser.personalityType || "",
        workPreferences: currentUser.workPreferences || [],
        salaryExpectation: currentUser.salaryExpectation || { min: 50000, max: 100000, currency: "USD" },
        location: currentUser.location || "",
        remotePreference: currentUser.remotePreference || "",
        profilePicture: currentUser.profilePicture || "",
      }))
    }
  }, [userDetail, getUserByEmail])

  useEffect(() => {
    analytics.track("onboarding_started", {
      userEmail: user?.primaryEmailAddress?.emailAddress,
      startStep: currentStep,
    })
  }, [])

  useEffect(() => {
    if (currentStep > 1) {
      analytics.trackOnboardingStep(currentStep - 1, {
        stepData: getStepData(currentStep - 1),
        timeSpent: Date.now() - stepStartTime,
      })
    }
    setStepStartTime(Date.now())
  }, [currentStep])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentStep < 5) {
        analytics.trackOnboardingAbandoned(currentStep, Date.now() - stepStartTime)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [currentStep, stepStartTime])

  const handleNext = async () => {
    if (currentStep < 5) {
      setIsProcessing(true)
      try {
        const currentUser = userDetail || getUserByEmail
        if (currentUser?._id) {
          await updateOnboardingStep({
            userId: currentUser._id,
            step: currentStep + 1,
            data: getStepData(currentStep),
          })

          analytics.trackOnboardingStep(currentStep, {
            stepData: getStepData(currentStep),
            timeSpent: Date.now() - stepStartTime,
            userId: currentUser._id,
          })

          setCurrentStep(currentStep + 1)
        }
      } catch (error) {
        console.error("Error updating onboarding step:", error)
        analytics.trackError(error, `onboarding_step_${currentStep}`)
      }
      setIsProcessing(false)
    } else {
      await handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsProcessing(true)
    const onboardingStartTime = Date.now() - stepStartTime * 5 // Approximate total time

    try {
      const currentUser = userDetail || getUserByEmail
      if (currentUser?._id) {
        await completeOnboarding({
          userId: currentUser._id,
          ...formData,
        })

        const careerPathsResult = await generateCareerPaths({ userId: currentUser._id })

        analytics.trackOnboardingCompleted(
          Date.now() - onboardingStartTime,
          100, // 100% completion rate
        )

        if (user?.primaryEmailAddress?.emailAddress && user.fullName && careerPathsResult) {
          try {
            // Extract career path names from the result
            const careerPaths = careerPathsResult.map((path: any) => path.title || path.name || path)

            const emailSent = await sendCareerRecommendationEmail(
              user.primaryEmailAddress.emailAddress,
              user.fullName,
              careerPaths,
            )

            if (emailSent) {
              console.log("[Onboarding] Career recommendation email sent successfully")
              analytics.track("career_recommendation_email_sent", {
                userId: currentUser._id,
                userEmail: user.primaryEmailAddress.emailAddress,
                careerPathsCount: careerPaths.length,
              })
            } else {
              console.error("[Onboarding] Failed to send career recommendation email")
              analytics.track("career_recommendation_email_failed", {
                userId: currentUser._id,
                userEmail: user.primaryEmailAddress.emailAddress,
              })
            }
          } catch (emailError) {
            console.error("[Onboarding] Error sending career recommendation email:", emailError)
            analytics.trackError(emailError, "career_recommendation_email")
          }
        }

        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (error) {
      console.error("Error completing onboarding:", error)
      analytics.trackError(error, "onboarding_completion")
    }
    setIsProcessing(false)
  }

  const getStepData = (step: number) => {
    switch (step) {
      case 1:
        return { interests: formData.interests }
      case 2:
        return {
          skills: formData.skills,
          experienceLevel: formData.experienceLevel,
        }
      case 3:
        return {
          careerGoals: formData.careerGoals,
          preferredLearningStyle: formData.preferredLearningStyle,
          availabilityHours: formData.availabilityHours,
        }
      case 4:
        return {
          personalityType: formData.personalityType,
          workPreferences: formData.workPreferences,
        }
      case 5:
        return {
          salaryExpectation: formData.salaryExpectation,
          location: formData.location,
          remotePreference: formData.remotePreference,
        }
      default:
        return {}
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <InterestsStep formData={formData} setFormData={setFormData} />
      case 2:
        return <SkillsStep formData={formData} setFormData={setFormData} />
      case 3:
        return <GoalsStep formData={formData} setFormData={setFormData} />
      case 4:
        return <PersonalityStep formData={formData} setFormData={setFormData} />
      case 5:
        return <PreferencesStep formData={formData} setFormData={setFormData} />
      default:
        return <InterestsStep formData={formData} setFormData={setFormData} />
    }
  }

  const getStepTitle = () => {
    const titles = [
      "What drives your passion?",
      "What are your skills?",
      "What are your goals?",
      "What's your work style?",
      "What are your preferences?",
    ]
    return titles[currentStep - 1]
  }

  const getStepDescription = () => {
    const descriptions = [
      "Choose 3-5 areas that ignite your professional curiosity and excitement",
      "Tell us about your current skills and experience level",
      "Share your career aspirations and learning preferences",
      "Help us understand your personality and work preferences",
      "Let us know your location and salary expectations",
    ]
    return descriptions[currentStep - 1]
  }

  return (
    <OnboardingGuard requireOnboarding={true}>
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
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Step {currentStep} of 5
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
              {getStepTitle()}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {getStepDescription()}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step <= currentStep
                        ? "bg-blue-500 text-white shadow-lg"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    }`}
                  >
                    {step < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-semibold">{step}</span>
                    )}
                  </div>
                  {step < 5 && (
                    <div
                      className={`w-8 h-px transition-all duration-300 ${
                        step < currentStep ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-1">
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  {currentStep === 1 && <Target className="w-8 h-8 text-blue-500" />}
                  {currentStep === 2 && <Briefcase className="w-8 h-8 text-blue-500" />}
                  {currentStep === 3 && <Target className="w-8 h-8 text-blue-500" />}
                  {currentStep === 4 && <User className="w-8 h-8 text-blue-500" />}
                  {currentStep === 5 && <MapPin className="w-8 h-8 text-blue-500" />}
                </div>
              </CardHeader>
            </div>
            <CardContent className="p-8">{renderStep()}</CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1 || isProcessing}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg bg-transparent"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isProcessing}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Processing...
                </>
              ) : currentStep === 5 ? (
                <>
                  <Sparkles className="mr-3 w-5 h-5" />
                  Complete Setup
                  <Check className="ml-3 w-5 h-5" />
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="ml-3 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </OnboardingGuard>
  )
}

// Step Components
function InterestsStep({ formData, setFormData }) {
  const toggleInterest = (interestId) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }))
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {INTEREST_OPTIONS.map((interest, index) => (
        <div
          key={interest.id}
          className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            formData.interests.includes(interest.id)
              ? "border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg scale-105"
              : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
          onClick={() => toggleInterest(interest.id)}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl transition-transform group-hover:scale-110 ${interest.color}`}
            >
              {interest.icon}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {interest.label}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{interest.description}</p>
            {formData.interests.includes(interest.id) && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function SkillsStep({ formData, setFormData }) {
  const [customSkill, setCustomSkill] = useState("")

  const skillOptions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "Machine Learning",
    "Data Analysis",
    "Project Management",
    "Leadership",
    "Communication",
    "Problem Solving",
    "Creative Thinking",
    "Marketing",
    "Design",
    "Sales",
  ]

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()],
      }))
      setCustomSkill("")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-lg font-semibold mb-4 block">Experience Level</Label>
        <Select
          value={formData.experienceLevel}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, experienceLevel: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
            <SelectItem value="intermediate">Intermediate (2-4 years)</SelectItem>
            <SelectItem value="advanced">Advanced (5-7 years)</SelectItem>
            <SelectItem value="expert">Expert (8+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-lg font-semibold mb-4 block">Skills</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {skillOptions.map((skill) => (
            <Badge
              key={skill}
              variant={formData.skills.includes(skill) ? "default" : "outline"}
              className="cursor-pointer p-3 text-center justify-center hover:scale-105 transition-transform"
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add custom skill..."
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
          />
          <Button onClick={addCustomSkill} variant="outline">
            Add
          </Button>
        </div>

        {formData.skills.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Selected skills:</p>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} className="bg-blue-500 text-white">
                  {skill}
                  <button
                    onClick={() => toggleSkill(skill)}
                    className="ml-2 hover:bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function GoalsStep({ formData, setFormData }) {
  const goalOptions = [
    "Get promoted",
    "Switch careers",
    "Learn new skills",
    "Start a business",
    "Work remotely",
    "Increase salary",
    "Find better work-life balance",
    "Lead a team",
    "Become an expert",
    "Network more",
  ]

  const learningStyles = [
    { value: "visual", label: "Visual (diagrams, charts)" },
    { value: "auditory", label: "Auditory (lectures, discussions)" },
    { value: "kinesthetic", label: "Hands-on (practice, experiments)" },
    { value: "reading", label: "Reading/Writing (books, notes)" },
  ]

  const toggleGoal = (goal) => {
    setFormData((prev) => ({
      ...prev,
      careerGoals: prev.careerGoals.includes(goal)
        ? prev.careerGoals.filter((g) => g !== goal)
        : [...prev.careerGoals, goal],
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-lg font-semibold mb-4 block">Career Goals</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {goalOptions.map((goal) => (
            <Badge
              key={goal}
              variant={formData.careerGoals.includes(goal) ? "default" : "outline"}
              className="cursor-pointer p-3 text-center justify-center hover:scale-105 transition-transform"
              onClick={() => toggleGoal(goal)}
            >
              {goal}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-lg font-semibold mb-4 block">Preferred Learning Style</Label>
        <Select
          value={formData.preferredLearningStyle}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, preferredLearningStyle: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="How do you learn best?" />
          </SelectTrigger>
          <SelectContent>
            {learningStyles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-lg font-semibold mb-4 block">Weekly Learning Hours: {formData.availabilityHours}</Label>
        <Slider
          value={[formData.availabilityHours]}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, availabilityHours: value[0] }))}
          max={40}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-slate-500 mt-2">
          <span>1 hour</span>
          <span>40 hours</span>
        </div>
      </div>
    </div>
  )
}

function PersonalityStep({ formData, setFormData }) {
  const personalityTypes = [
    { value: "analytical", label: "Analytical", description: "Data-driven, logical thinker" },
    { value: "creative", label: "Creative", description: "Innovative, artistic mindset" },
    { value: "social", label: "Social", description: "People-focused, collaborative" },
    { value: "practical", label: "Practical", description: "Hands-on, solution-oriented" },
  ]

  const workPreferenceOptions = [
    "Team collaboration",
    "Independent work",
    "Flexible schedule",
    "Structured environment",
    "Fast-paced",
    "Steady pace",
    "Innovation focus",
    "Process improvement",
    "Client interaction",
    "Behind-the-scenes work",
  ]

  const toggleWorkPreference = (preference) => {
    setFormData((prev) => ({
      ...prev,
      workPreferences: prev.workPreferences.includes(preference)
        ? prev.workPreferences.filter((p) => p !== preference)
        : [...prev.workPreferences, preference],
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-lg font-semibold mb-4 block">Personality Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personalityTypes.map((type) => (
            <div
              key={type.value}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                formData.personalityType === type.value
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, personalityType: type.value }))}
            >
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{type.label}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-lg font-semibold mb-4 block">Work Preferences</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {workPreferenceOptions.map((preference) => (
            <Badge
              key={preference}
              variant={formData.workPreferences.includes(preference) ? "default" : "outline"}
              className="cursor-pointer p-3 text-center justify-center hover:scale-105 transition-transform"
              onClick={() => toggleWorkPreference(preference)}
            >
              {preference}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

function PreferencesStep({ formData, setFormData }) {
  const remoteOptions = [
    { value: "remote", label: "Fully Remote" },
    { value: "hybrid", label: "Hybrid (2-3 days office)" },
    { value: "office", label: "Fully In-Office" },
    { value: "flexible", label: "Flexible" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-lg font-semibold mb-4 block">Location</Label>
        <Input
          placeholder="City, State/Country"
          value={formData.location}
          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
        />
      </div>

      <div>
        <Label className="text-lg font-semibold mb-4 block">Remote Work Preference</Label>
        <Select
          value={formData.remotePreference}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, remotePreference: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your preference" />
          </SelectTrigger>
          <SelectContent>
            {remoteOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-lg font-semibold mb-4 block">Salary Expectations (USD)</Label>
        <div className="space-y-4">
          <div>
            <Label className="text-sm mb-2 block">Minimum: ${formData.salaryExpectation.min.toLocaleString()}</Label>
            <Slider
              value={[formData.salaryExpectation.min]}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  salaryExpectation: { ...prev.salaryExpectation, min: value[0] },
                }))
              }
              max={200000}
              min={30000}
              step={5000}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-sm mb-2 block">Maximum: ${formData.salaryExpectation.max.toLocaleString()}</Label>
            <Slider
              value={[formData.salaryExpectation.max]}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  salaryExpectation: { ...prev.salaryExpectation, max: value[0] },
                }))
              }
              max={300000}
              min={50000}
              step={5000}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
