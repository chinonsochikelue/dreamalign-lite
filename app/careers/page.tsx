"use client"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OnboardingGuard } from "@/components/onboarding-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { scrapeJobsClient } from "@/lib/scraping-client"
import {
  Search,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Briefcase,
  Users,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Code,
  Palette,
  BarChart3,
  Shield,
  Cloud,
  Smartphone,
  Heart,
  Gamepad2,
  Globe,
  Building,
  Rocket,
} from "lucide-react"

const CAREER_CATEGORIES = [
  { id: "all", label: "All Careers", icon: Globe },
  { id: "technology", label: "Technology", icon: Code },
  { id: "design", label: "Design", icon: Palette },
  { id: "business", label: "Business", icon: BarChart3 },
  { id: "security", label: "Security", icon: Shield },
  { id: "cloud", label: "Cloud", icon: Cloud },
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
]

const EXPERIENCE_LEVELS = [
  { value: "all", label: "All Levels" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "executive", label: "Executive" },
]

const SALARY_RANGES = [
  { value: "all", label: "All Salaries" },
  { value: "0-50k", label: "$0 - $50k" },
  { value: "50k-75k", label: "$50k - $75k" },
  { value: "75k-100k", label: "$75k - $100k" },
  { value: "100k-150k", label: "$100k - $150k" },
  { value: "150k+", label: "$150k+" },
]

export default function CareersPage() {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedSalary, setSelectedSalary] = useState("all")
  const [selectedCareer, setSelectedCareer] = useState(null)

  const [liveJobs, setLiveJobs] = useState([])
  const [isScrapingJobs, setIsScrapingJobs] = useState(false)

  const getUserByEmail = useQuery(
    api.users.getByEmail,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip",
  )

  const getCareerRecommendations = useQuery(
    api.users.getCareerRecommendations,
    getUserByEmail?._id ? { userId: getUserByEmail._id } : "skip",
  )

  const generateCareerPaths = useMutation(api.users.generateCareerPaths)

  const allCareerPaths = [
    {
      id: "full-stack-dev",
      title: "Full Stack Developer",
      category: "technology",
      description: "Build end-to-end web applications using modern technologies and frameworks",
      matchScore: 95,
      salaryRange: { min: 70000, max: 120000, currency: "USD" },
      experienceLevel: "mid",
      growth: "+22%",
      demandLevel: "High",
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git"],
      jobTitles: ["Full Stack Developer", "Web Developer", "Software Engineer"],
      companies: ["Google", "Meta", "Netflix", "Airbnb", "Stripe"],
      courses: [
        {
          title: "Complete Web Development Bootcamp",
          provider: "Udemy",
          duration: "65 hours",
          level: "Beginner to Advanced",
          rating: 4.7,
          students: "850k+",
          price: "$89.99",
        },
        {
          title: "React - The Complete Guide",
          provider: "Udemy",
          duration: "48 hours",
          level: "Intermediate",
          rating: 4.6,
          students: "500k+",
          price: "$94.99",
        },
        {
          title: "Node.js Developer Course",
          provider: "Coursera",
          duration: "6 weeks",
          level: "Intermediate",
          rating: 4.5,
          students: "200k+",
          price: "$49/month",
        },
      ],
      learningPath: [
        { title: "HTML/CSS Fundamentals", duration: "2 weeks", completed: true },
        { title: "JavaScript ES6+", duration: "3 weeks", completed: true },
        { title: "React Fundamentals", duration: "4 weeks", completed: false },
        { title: "Backend with Node.js", duration: "4 weeks", completed: false },
        { title: "Database Design", duration: "2 weeks", completed: false },
        { title: "Deployment & DevOps", duration: "2 weeks", completed: false },
      ],
      dayInLife: [
        "Review code from team members",
        "Implement new features for web application",
        "Debug and fix reported issues",
        "Collaborate with designers on UI/UX",
        "Participate in daily standup meetings",
        "Write unit tests for new functionality",
      ],
    },
    {
      id: "ai-ml-engineer",
      title: "AI/ML Engineer",
      category: "technology",
      description: "Develop intelligent systems and machine learning models to solve complex problems",
      matchScore: 92,
      salaryRange: { min: 90000, max: 160000, currency: "USD" },
      experienceLevel: "mid",
      growth: "+31%",
      demandLevel: "Very High",
      skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "Statistics"],
      jobTitles: ["AI Engineer", "ML Engineer", "Data Scientist", "Research Scientist"],
      companies: ["OpenAI", "Google DeepMind", "Tesla", "NVIDIA", "Microsoft"],
      courses: [
        {
          title: "Machine Learning A-Z",
          provider: "Udemy",
          duration: "44 hours",
          level: "Beginner to Advanced",
          rating: 4.5,
          students: "1M+",
          price: "$84.99",
        },
        {
          title: "Deep Learning Specialization",
          provider: "Coursera",
          duration: "3 months",
          level: "Intermediate",
          rating: 4.8,
          students: "800k+",
          price: "$49/month",
        },
      ],
      learningPath: [
        { title: "Python Programming", duration: "3 weeks", completed: true },
        { title: "Statistics & Probability", duration: "2 weeks", completed: false },
        { title: "Machine Learning Basics", duration: "4 weeks", completed: false },
        { title: "Deep Learning", duration: "6 weeks", completed: false },
        { title: "Computer Vision", duration: "4 weeks", completed: false },
        { title: "NLP & LLMs", duration: "4 weeks", completed: false },
      ],
      dayInLife: [
        "Analyze datasets and identify patterns",
        "Train and optimize ML models",
        "Collaborate with data scientists",
        "Deploy models to production",
        "Monitor model performance",
        "Research new AI techniques",
      ],
    },
    {
      id: "product-manager",
      title: "Product Manager",
      category: "business",
      description: "Lead product strategy and development from conception to launch",
      matchScore: 87,
      salaryRange: { min: 80000, max: 140000, currency: "USD" },
      experienceLevel: "mid",
      growth: "+19%",
      demandLevel: "High",
      skills: ["Product Strategy", "User Research", "Analytics", "Agile", "Leadership", "Communication"],
      jobTitles: ["Product Manager", "Senior Product Manager", "Product Owner", "VP of Product"],
      companies: ["Apple", "Amazon", "Spotify", "Slack", "Notion"],
      courses: [
        {
          title: "Product Management Fundamentals",
          provider: "Coursera",
          duration: "6 weeks",
          level: "Beginner",
          rating: 4.6,
          students: "300k+",
          price: "$49/month",
        },
        {
          title: "Advanced Product Management",
          provider: "Udacity",
          duration: "4 months",
          level: "Advanced",
          rating: 4.4,
          students: "50k+",
          price: "$399/month",
        },
      ],
      learningPath: [
        { title: "Product Strategy", duration: "2 weeks", completed: true },
        { title: "User Research Methods", duration: "3 weeks", completed: false },
        { title: "Data Analytics", duration: "3 weeks", completed: false },
        { title: "Agile Methodologies", duration: "2 weeks", completed: false },
        { title: "Leadership Skills", duration: "4 weeks", completed: false },
        { title: "Go-to-Market Strategy", duration: "2 weeks", completed: false },
      ],
      dayInLife: [
        "Define product roadmap and priorities",
        "Conduct user interviews and research",
        "Analyze product metrics and KPIs",
        "Collaborate with engineering teams",
        "Present to stakeholders and executives",
        "Gather feedback from customers",
      ],
    },
    {
      id: "ux-designer",
      title: "UX/UI Designer",
      category: "design",
      description: "Create intuitive and beautiful user experiences for digital products",
      matchScore: 85,
      salaryRange: { min: 65000, max: 110000, currency: "USD" },
      experienceLevel: "mid",
      growth: "+13%",
      demandLevel: "High",
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems", "HTML/CSS"],
      jobTitles: ["UX Designer", "UI Designer", "Product Designer", "Design Lead"],
      companies: ["Figma", "Adobe", "Airbnb", "Uber", "Dropbox"],
      courses: [
        {
          title: "Google UX Design Certificate",
          provider: "Coursera",
          duration: "6 months",
          level: "Beginner",
          rating: 4.7,
          students: "500k+",
          price: "$49/month",
        },
        {
          title: "Advanced Figma Masterclass",
          provider: "Udemy",
          duration: "25 hours",
          level: "Intermediate",
          rating: 4.8,
          students: "100k+",
          price: "$79.99",
        },
      ],
      learningPath: [
        { title: "Design Fundamentals", duration: "2 weeks", completed: true },
        { title: "User Research", duration: "3 weeks", completed: false },
        { title: "Wireframing & Prototyping", duration: "3 weeks", completed: false },
        { title: "Visual Design", duration: "4 weeks", completed: false },
        { title: "Design Systems", duration: "3 weeks", completed: false },
        { title: "Usability Testing", duration: "2 weeks", completed: false },
      ],
      dayInLife: [
        "Conduct user research and interviews",
        "Create wireframes and prototypes",
        "Design user interfaces in Figma",
        "Collaborate with developers",
        "Present designs to stakeholders",
        "Iterate based on user feedback",
      ],
    },
    {
      id: "cybersecurity-analyst",
      title: "Cybersecurity Analyst",
      category: "security",
      description: "Protect organizations from cyber threats and security breaches",
      matchScore: 78,
      salaryRange: { min: 75000, max: 130000, currency: "USD" },
      experienceLevel: "mid",
      growth: "+35%",
      demandLevel: "Very High",
      skills: [
        "Network Security",
        "Incident Response",
        "Risk Assessment",
        "SIEM Tools",
        "Penetration Testing",
        "Compliance",
      ],
      jobTitles: ["Security Analyst", "Information Security Specialist", "SOC Analyst", "Security Engineer"],
      companies: ["CrowdStrike", "Palo Alto Networks", "FireEye", "Symantec", "IBM Security"],
      courses: [
        {
          title: "CompTIA Security+ Certification",
          provider: "Udemy",
          duration: "40 hours",
          level: "Beginner to Intermediate",
          rating: 4.6,
          students: "200k+",
          price: "$89.99",
        },
        {
          title: "Ethical Hacking Course",
          provider: "Coursera",
          duration: "4 months",
          level: "Intermediate",
          rating: 4.5,
          students: "150k+",
          price: "$49/month",
        },
      ],
      learningPath: [
        { title: "Network Fundamentals", duration: "3 weeks", completed: false },
        { title: "Security Principles", duration: "2 weeks", completed: false },
        { title: "Threat Analysis", duration: "3 weeks", completed: false },
        { title: "Incident Response", duration: "4 weeks", completed: false },
        { title: "Penetration Testing", duration: "5 weeks", completed: false },
        { title: "Compliance & Governance", duration: "2 weeks", completed: false },
      ],
      dayInLife: [
        "Monitor security alerts and incidents",
        "Analyze potential security threats",
        "Implement security measures",
        "Conduct vulnerability assessments",
        "Create security reports",
        "Train employees on security practices",
      ],
    },
    {
      id: "cloud-architect",
      title: "Cloud Solutions Architect",
      category: "cloud",
      description: "Design and implement scalable cloud infrastructure solutions",
      matchScore: 82,
      salaryRange: { min: 95000, max: 170000, currency: "USD" },
      experienceLevel: "senior",
      growth: "+25%",
      demandLevel: "Very High",
      skills: ["AWS", "Azure", "Google Cloud", "Kubernetes", "Docker", "Terraform", "DevOps"],
      jobTitles: ["Cloud Architect", "Solutions Architect", "DevOps Engineer", "Site Reliability Engineer"],
      companies: ["Amazon Web Services", "Microsoft Azure", "Google Cloud", "Salesforce", "Oracle"],
      courses: [
        {
          title: "AWS Solutions Architect",
          provider: "A Cloud Guru",
          duration: "30 hours",
          level: "Intermediate",
          rating: 4.7,
          students: "400k+",
          price: "$29/month",
        },
        {
          title: "Kubernetes Complete Course",
          provider: "Udemy",
          duration: "22 hours",
          level: "Intermediate",
          rating: 4.6,
          students: "180k+",
          price: "$94.99",
        },
      ],
      learningPath: [
        { title: "Cloud Fundamentals", duration: "2 weeks", completed: false },
        { title: "AWS Core Services", duration: "4 weeks", completed: false },
        { title: "Container Technologies", duration: "3 weeks", completed: false },
        { title: "Infrastructure as Code", duration: "3 weeks", completed: false },
        { title: "Monitoring & Security", duration: "3 weeks", completed: false },
        { title: "Cost Optimization", duration: "2 weeks", completed: false },
      ],
      dayInLife: [
        "Design cloud architecture solutions",
        "Optimize cloud infrastructure costs",
        "Implement security best practices",
        "Collaborate with development teams",
        "Monitor system performance",
        "Plan disaster recovery strategies",
      ],
    },
  ]

  const [filteredCareers, setFilteredCareers] = useState(allCareerPaths)

  useEffect(() => {
    let filtered = allCareerPaths

    if (searchQuery) {
      filtered = filtered.filter(
        (career) =>
          career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          career.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((career) => career.category === selectedCategory)
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((career) => career.experienceLevel === selectedLevel)
    }

    if (selectedSalary !== "all") {
      const [min, max] = selectedSalary.split("-").map((s) => {
        if (s.includes("+")) return [Number.parseInt(s.replace("k+", "000")), Number.POSITIVE_INFINITY]
        return Number.parseInt(s.replace("k", "000"))
      })

      if (selectedSalary.includes("+")) {
        filtered = filtered.filter((career) => career.salaryRange.min >= min)
      } else {
        filtered = filtered.filter((career) => career.salaryRange.min >= min && career.salaryRange.max <= max)
      }
    }

    filtered.sort((a, b) => b.matchScore - a.matchScore)

    setFilteredCareers(filtered)
  }, [searchQuery, selectedCategory, selectedLevel, selectedSalary, allCareerPaths])

  const getDemandColor = (level) => {
    switch (level) {
      case "Very High":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 80) return "text-blue-600 dark:text-blue-400"
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-slate-600 dark:text-slate-400"
  }

  const scrapeLiveJobs = async (career) => {
    setIsScrapingJobs(true)
    try {
      const jobs = await scrapeJobsClient({
        interests: [career.category],
        skills: career.skills.slice(0, 3),
        experienceLevel: career.experienceLevel,
        location: "Remote",
        jobTitle: career.title,
      })
      setLiveJobs(jobs.slice(0, 8))
    } catch (error) {
      console.error("Failed to scrape jobs:", error)
      setLiveJobs([])
    } finally {
      setIsScrapingJobs(false)
    }
  }

  const handleCareerSelect = (career) => {
    setSelectedCareer(career)
    scrapeLiveJobs(career)
  }

  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <DashboardNav />

        <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Rocket className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-4">
              Explore Career Paths
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Discover your perfect career match with AI-powered recommendations and comprehensive learning paths
            </p>
          </div>

          <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search careers, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAREER_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSalary} onValueChange={setSelectedSalary}>
                  <SelectTrigger>
                    <SelectValue placeholder="Salary Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {selectedCareer ? (
            <div className="space-y-8">
              <Button onClick={() => setSelectedCareer(null)} variant="outline" className="mb-4">
                ← Back to Career List
              </Button>

              <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-1">
                  <CardHeader className="pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                          {selectedCareer.title}
                        </CardTitle>
                        <CardDescription className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                          {selectedCareer.description}
                        </CardDescription>
                        <div className="flex items-center space-x-4">
                          <Badge className={`${getDemandColor(selectedCareer.demandLevel)} text-white`}>
                            {selectedCareer.demandLevel} Demand
                          </Badge>
                          <Badge className="bg-green-500 text-white">{selectedCareer.growth} Growth</Badge>
                          <Badge
                            className={`${getMatchScoreColor(selectedCareer.matchScore)} bg-transparent border-current`}
                          >
                            {selectedCareer.matchScore}% Match
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                          ${selectedCareer.salaryRange.min.toLocaleString()} - $
                          {selectedCareer.salaryRange.max.toLocaleString()}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Average Salary</p>
                      </div>
                    </div>
                  </CardHeader>
                </div>
                <CardContent className="p-8">
                  <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="learning">Learning Path</TabsTrigger>
                      <TabsTrigger value="courses">Courses</TabsTrigger>
                      <TabsTrigger value="companies">Companies</TabsTrigger>
                      <TabsTrigger value="day-in-life">Day in Life</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                          <CardHeader>
                            <CardTitle className="flex items-center text-slate-800 dark:text-slate-100">
                              <Target className="w-5 h-5 mr-2" />
                              Required Skills
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {selectedCareer.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                          <CardHeader>
                            <CardTitle className="flex items-center text-slate-800 dark:text-slate-100">
                              <Briefcase className="w-5 h-5 mr-2" />
                              Job Titles
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedCareer.jobTitles.map((title) => (
                                <div key={title} className="text-sm text-slate-600 dark:text-slate-400">
                                  • {title}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="learning" className="space-y-6">
                      <div className="space-y-4">
                        {selectedCareer.learningPath.map((step, index) => (
                          <Card
                            key={index}
                            className={`border-0 ${step.completed ? "bg-green-50 dark:bg-green-900/20" : "bg-slate-50 dark:bg-slate-800/50"}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      step.completed ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                                  >
                                    {step.completed ? (
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    ) : (
                                      <span className="text-sm font-bold text-white">{index + 1}</span>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">{step.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{step.duration}</p>
                                  </div>
                                </div>
                                {!step.completed && (
                                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                                    Start Learning
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="courses" className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {selectedCareer.courses.map((course, index) => (
                          <Card
                            key={index}
                            className="border-0 bg-white/50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-200"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{course.title}</h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">{course.provider}</p>
                                </div>
                                <Badge className="bg-yellow-500 text-white">★ {course.rating}</Badge>
                              </div>
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                                  <span className="font-medium">{course.duration}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-600 dark:text-slate-400">Level:</span>
                                  <span className="font-medium">{course.level}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-600 dark:text-slate-400">Students:</span>
                                  <span className="font-medium">{course.students}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                  {course.price}
                                </span>
                                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Course
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="companies" className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        {selectedCareer.companies.map((company) => (
                          <Card
                            key={company}
                            className="border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-700/50 hover:shadow-lg transition-all duration-200"
                          >
                            <CardContent className="p-6 text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Building className="w-8 h-8 text-white" />
                              </div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{company}</h4>
                              <Button size="sm" variant="outline" className="w-full bg-transparent">
                                View Jobs
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="mt-8">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2 text-green-500" />
                            Live Job Openings
                            <Badge className="ml-2 bg-green-500 text-white">Real-time</Badge>
                          </h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => scrapeLiveJobs(selectedCareer)}
                            disabled={isScrapingJobs}
                          >
                            {isScrapingJobs ? "Searching..." : "Refresh"}
                          </Button>
                        </div>

                        {isScrapingJobs ? (
                          <div className="grid md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="animate-pulse">
                                <div className="bg-slate-200 dark:bg-slate-700 rounded-xl h-24"></div>
                              </div>
                            ))}
                          </div>
                        ) : liveJobs.length > 0 ? (
                          <div className="grid md:grid-cols-2 gap-4">
                            {liveJobs.map((job, index) => (
                              <Card
                                key={index}
                                className="border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 hover:shadow-lg transition-all duration-200"
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                                        {job.title}
                                      </h4>
                                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                                        <span>{job.company}</span>
                                        <span>•</span>
                                        <span>{job.location}</span>
                                      </div>
                                      {job.salary && (
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                          {job.salary}
                                        </p>
                                      )}
                                      {job.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                                          {job.description}
                                        </p>
                                      )}
                                    </div>
                                    <Button size="sm" variant="outline" asChild className="ml-4 bg-transparent">
                                      <a href={job.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Briefcase className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">
                              No live jobs found. Try refreshing or check back later.
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="day-in-life" className="space-y-6">
                      <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                        <CardHeader>
                          <CardTitle className="flex items-center text-slate-800 dark:text-slate-100">
                            <Clock className="w-5 h-5 mr-2" />A Day in the Life
                          </CardTitle>
                          <CardDescription>What does a typical day look like in this role?</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedCareer.dayInLife.map((activity, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg"
                              >
                                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {index + 1}
                                </div>
                                <span className="text-slate-700 dark:text-slate-300">{activity}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCareers.map((career, index) => (
                <Card
                  key={career.id}
                  className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleCareerSelect(career)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                          {career.title}
                        </CardTitle>
                        <Badge className={`${getMatchScoreColor(career.matchScore)} bg-transparent border-current`}>
                          {career.matchScore}%
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {career.description}
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          ${career.salaryRange.min.toLocaleString()} - ${career.salaryRange.max.toLocaleString()}
                        </span>
                      </div>
                      <Badge className={`${getDemandColor(career.demandLevel)} text-white text-xs`}>
                        {career.demandLevel}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{career.growth} growth</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{career.experienceLevel}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {career.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {career.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{career.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Explore Career
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredCareers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No careers found</h3>
              <p className="text-slate-600 dark:text-slate-400">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </OnboardingGuard>
  )
}
