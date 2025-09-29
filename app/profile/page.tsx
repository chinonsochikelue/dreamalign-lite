"use client"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  Brain,
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Mail,
  Target,
  Star,
  Shield,
  Download,
  Bell,
  Plus,
  Check,
  Camera,
  Award,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Heart,
  Zap,
  Users,
  Code,
  Palette,
  BarChart3,
  Globe,
  Lightbulb,
  Rocket,
  BookOpen,
  Coffee,
  Music,
  Gamepad2,
  Plane,
  Mountain,
} from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAnalytics } from "@/lib/analytics"

const INTEREST_OPTIONS = [
  { value: "ai-ml", label: "AI/ML", icon: Brain },
  { value: "web-dev", label: "Web Development", icon: Code },
  { value: "mobile-dev", label: "Mobile Development", icon: Zap },
  { value: "data-science", label: "Data Science", icon: BarChart3 },
  { value: "product-management", label: "Product Management", icon: Rocket },
  { value: "design", label: "UI/UX Design", icon: Palette },
  { value: "marketing", label: "Digital Marketing", icon: Globe },
  { value: "entrepreneurship", label: "Entrepreneurship", icon: Lightbulb },
  { value: "leadership", label: "Leadership", icon: Users },
  { value: "finance", label: "Finance", icon: TrendingUp },
  { value: "consulting", label: "Consulting", icon: Briefcase },
  { value: "education", label: "Education", icon: BookOpen },
  { value: "healthcare", label: "Healthcare", icon: Heart },
  { value: "gaming", label: "Gaming", icon: Gamepad2 },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "fitness", label: "Fitness", icon: Mountain },
  { value: "music", label: "Music", icon: Music },
  { value: "food", label: "Food & Culinary", icon: Coffee },
]

const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (2-4 years)" },
  { value: "advanced", label: "Advanced (5-7 years)" },
  { value: "expert", label: "Expert (8+ years)" },
]

const PERSONALITY_TRAITS = [
  { value: "analytical", label: "Analytical Thinker" },
  { value: "creative", label: "Creative Problem Solver" },
  { value: "collaborative", label: "Team Collaborator" },
  { value: "independent", label: "Independent Worker" },
  { value: "detail-oriented", label: "Detail-Oriented" },
  { value: "big-picture", label: "Big Picture Thinker" },
  { value: "adaptable", label: "Adaptable" },
  { value: "leadership", label: "Natural Leader" },
]

export default function ProfilePage() {
  const { user: clerkUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const user = useQuery(api.users.getCurrentUser)
  const updateUser = useMutation(api.users.updateUserProfile)
  const updateOnboardingData = useMutation(api.users.updateOnboardingData)

  const analytics = useAnalytics()

  const [editedProfile, setEditedProfile] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    interests: [],
    goals: [],
    skills: [],
    experienceLevel: "",
    personalityTraits: [],
    workPreferences: {
      remoteWork: false,
      teamSize: "",
      workEnvironment: "",
      careerGoals: [],
    },
  })

  const [newInterest, setNewInterest] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [showAddInterest, setShowAddInterest] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddSkill, setShowAddSkill] = useState(false)

  useEffect(() => {
    if (user && clerkUser) {
      setEditedProfile({
        name: clerkUser.fullName || user.name || "",
        email: clerkUser.primaryEmailAddress?.emailAddress || user.email || "",
        location: user.location || "",
        bio: user.bio || "",
        interests: user.interests || [],
        goals: user.goals || [],
        skills: user.skills || [],
        experienceLevel: user.experienceLevel || "",
        personalityTraits: user.personalityTraits || [],
        workPreferences: {
          remoteWork: user.workPreferences?.remoteWork || false,
          teamSize: user.workPreferences?.teamSize || "",
          workEnvironment: user.workPreferences?.workEnvironment || "",
          careerGoals: user.workPreferences?.careerGoals || [],
        },
      })
    }
  }, [user, clerkUser])

  useEffect(() => {
    if (user) {
      analytics.track("profile_viewed", {
        userId: user._id,
        profileCompleteness: Math.round(
          (((user.interests?.length > 0 ? 1 : 0) +
            (user.goals?.length > 0 ? 1 : 0) +
            (user.skills?.length > 0 ? 1 : 0) +
            (user.bio ? 1 : 0) +
            (user.experienceLevel ? 1 : 0)) /
            5) *
            100,
        ),
      })
    }
  }, [user, analytics])

  const handleSave = async () => {
    const changedFields = []

    // Detect what changed
    if (user) {
      if (editedProfile.name !== (clerkUser?.fullName || user.name)) changedFields.push("name")
      if (editedProfile.location !== user.location) changedFields.push("location")
      if (editedProfile.bio !== user.bio) changedFields.push("bio")
      if (JSON.stringify(editedProfile.interests) !== JSON.stringify(user.interests)) changedFields.push("interests")
      if (JSON.stringify(editedProfile.goals) !== JSON.stringify(user.goals)) changedFields.push("goals")
      if (JSON.stringify(editedProfile.skills) !== JSON.stringify(user.skills)) changedFields.push("skills")
      if (editedProfile.experienceLevel !== user.experienceLevel) changedFields.push("experienceLevel")
      if (JSON.stringify(editedProfile.personalityTraits) !== JSON.stringify(user.personalityTraits))
        changedFields.push("personalityTraits")
      if (JSON.stringify(editedProfile.workPreferences) !== JSON.stringify(user.workPreferences))
        changedFields.push("workPreferences")
    }

    try {
      await updateUser({
        name: editedProfile.name,
        location: editedProfile.location,
        bio: editedProfile.bio,
      })

      await updateOnboardingData({
        interests: editedProfile.interests,
        goals: editedProfile.goals,
        skills: editedProfile.skills,
        experienceLevel: editedProfile.experienceLevel,
        personalityTraits: editedProfile.personalityTraits,
        workPreferences: editedProfile.workPreferences,
      })

      analytics.trackProfileUpdated(changedFields)

      setIsEditing(false)
      setShowAddInterest(false)
      setShowAddGoal(false)
      setShowAddSkill(false)
      setNewInterest("")
      setNewGoal("")
      setNewSkill("")

      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      analytics.trackError(error, "profile_update")
      toast.error("Failed to update profile. Please try again.")
    }
  }

  const handleCancel = () => {
    if (user && clerkUser) {
      setEditedProfile({
        name: clerkUser.fullName || user.name || "",
        email: clerkUser.primaryEmailAddress?.emailAddress || user.email || "",
        location: user.location || "",
        bio: user.bio || "",
        interests: user.interests || [],
        goals: user.goals || [],
        skills: user.skills || [],
        experienceLevel: user.experienceLevel || "",
        personalityTraits: user.personalityTraits || [],
        workPreferences: {
          remoteWork: user.workPreferences?.remoteWork || false,
          teamSize: user.workPreferences?.teamSize || "",
          workEnvironment: user.workPreferences?.workEnvironment || "",
          careerGoals: user.workPreferences?.careerGoals || [],
        },
      })
    }
    setIsEditing(false)
    setShowAddInterest(false)
    setShowAddGoal(false)
    setShowAddSkill(false)
    setNewInterest("")
    setNewGoal("")
    setNewSkill("")
  }

  const removeInterest = (interest) => {
    setEditedProfile({
      ...editedProfile,
      interests: editedProfile.interests.filter((i) => i !== interest),
    })
  }

  const addInterest = () => {
    if (newInterest.trim() && !editedProfile.interests.includes(newInterest.trim())) {
      setEditedProfile({
        ...editedProfile,
        interests: [...editedProfile.interests, newInterest.trim()],
      })
      setNewInterest("")
      setShowAddInterest(false)
    }
  }

  const removeGoal = (goal) => {
    setEditedProfile({
      ...editedProfile,
      goals: editedProfile.goals.filter((g) => g !== goal),
    })
  }

  const addGoal = () => {
    if (newGoal.trim() && !editedProfile.goals.includes(newGoal.trim())) {
      setEditedProfile({
        ...editedProfile,
        goals: [...editedProfile.goals, newGoal.trim()],
      })
      setNewGoal("")
      setShowAddGoal(false)
    }
  }

  const removeSkill = (skill) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((s) => s !== skill),
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !editedProfile.skills.includes(newSkill.trim())) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, newSkill.trim()],
      })
      setNewSkill("")
      setShowAddSkill(false)
    }
  }

  const togglePersonalityTrait = (trait) => {
    const currentTraits = editedProfile.personalityTraits || []
    if (currentTraits.includes(trait)) {
      setEditedProfile({
        ...editedProfile,
        personalityTraits: currentTraits.filter((t) => t !== trait),
      })
    } else {
      setEditedProfile({
        ...editedProfile,
        personalityTraits: [...currentTraits, trait],
      })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  const getInterestIcon = (interestValue) => {
    const interest = INTEREST_OPTIONS.find((opt) => opt.value === interestValue || opt.label === interestValue)
    return interest?.icon || Star
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <DashboardNav />

      <div className="max-w-6xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl mb-4">
              {getInitials(editedProfile.name)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
              <Camera className="w-4 h-4 text-blue-500" />
            </button>
          </div>
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div></div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {isEditing ? "Edit Profile" : editedProfile.name || "Your Profile"}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-4">Manage your career journey</p>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-center mb-8">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl p-1 shadow-lg">
              <div className="flex space-x-1">
                {[
                  { id: "personal", label: "Personal Info", icon: User },
                  { id: "interests", label: "Interests & Goals", icon: Star },
                  { id: "skills", label: "Skills & Experience", icon: GraduationCap },
                  { id: "preferences", label: "Work Preferences", icon: Briefcase },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            {(!isEditing || activeTab === "personal") && (
              <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-1">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">
                        Full Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg">{editedProfile.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                        Email Address
                      </Label>
                      <p className="text-slate-800 dark:text-slate-200 font-semibold flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-slate-500" />
                        {editedProfile.email}
                      </p>
                      {isEditing && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Email is managed by your account provider
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-700 dark:text-slate-300 font-medium">
                      Location
                    </Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., San Francisco, CA"
                      />
                    ) : (
                      <p className="text-slate-800 dark:text-slate-200 font-semibold flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                        {editedProfile.location || "Not specified"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-slate-700 dark:text-slate-300 font-medium">
                      About Me
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                        className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 min-h-24 resize-none"
                        placeholder="Tell us about yourself and your career aspirations..."
                      />
                    ) : (
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {editedProfile.bio || "No bio provided yet."}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {formatDate(user._creationTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Active Member
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Career Interests & Goals */}
            {(!isEditing || activeTab === "interests") && (
              <>
                {/* Career Interests */}
                <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-1">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        Career Interests
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Areas you're passionate about exploring professionally
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6">
                    {isEditing && activeTab === "interests" && (
                      <div className="mb-6">
                        <Label className="text-slate-700 dark:text-slate-300 font-medium mb-3 block">
                          Select from popular interests:
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          {INTEREST_OPTIONS.map((interest) => {
                            const Icon = interest.icon
                            const isSelected =
                              editedProfile.interests.includes(interest.value) ||
                              editedProfile.interests.includes(interest.label)
                            return (
                              <button
                                key={interest.value}
                                onClick={() => {
                                  if (isSelected) {
                                    setEditedProfile({
                                      ...editedProfile,
                                      interests: editedProfile.interests.filter(
                                        (i) => i !== interest.value && i !== interest.label,
                                      ),
                                    })
                                  } else {
                                    setEditedProfile({
                                      ...editedProfile,
                                      interests: [...editedProfile.interests, interest.label],
                                    })
                                  }
                                }}
                                className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                                  isSelected
                                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                    : "border-slate-200 dark:border-slate-600 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
                                }`}
                              >
                                <Icon className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">{interest.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {editedProfile.interests.map((interest, index) => {
                        const Icon = getInterestIcon(interest)
                        return (
                          <Badge
                            key={interest}
                            className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40 transition-all duration-200 text-sm font-medium"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            <span>{interest}</span>
                            {isEditing && (
                              <button
                                onClick={() => removeInterest(interest)}
                                className="ml-2 hover:text-red-500 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        )
                      })}
                      {isEditing && (
                        <div className="flex items-center gap-2">
                          {showAddInterest ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={newInterest}
                                onChange={(e) => setNewInterest(e.target.value)}
                                placeholder="Add custom interest..."
                                className="w-40 h-8 text-sm"
                                onKeyPress={(e) => e.key === "Enter" && addInterest()}
                              />
                              <Button size="sm" onClick={addInterest} className="h-8 w-8 p-0">
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setShowAddInterest(false)
                                  setNewInterest("")
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowAddInterest(true)}
                              className="px-4 py-2 border-dashed border-purple-300 dark:border-purple-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Custom
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Career Goals */}
                <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 p-1">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        Career Goals
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        What you want to achieve in your professional journey
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {editedProfile.goals.map((goal, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all duration-200"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <TrendingUp className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-slate-800 dark:text-slate-200 font-medium">{goal}</span>
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => removeGoal(goal)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <div className="pt-2">
                          {showAddGoal ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={newGoal}
                                onChange={(e) => setNewGoal(e.target.value)}
                                placeholder="Add a new career goal..."
                                className="flex-1"
                                onKeyPress={(e) => e.key === "Enter" && addGoal()}
                              />
                              <Button onClick={addGoal} className="px-4">
                                <Check className="w-4 h-4 mr-2" />
                                Add
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowAddGoal(false)
                                  setNewGoal("")
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => setShowAddGoal(true)}
                              className="w-full border-dashed border-green-300 dark:border-green-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add New Goal
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Skills & Experience */}
            {(!isEditing || activeTab === "skills") && (
              <>
                <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-1">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        Skills & Experience
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Your technical and professional skills
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    {isEditing && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-medium">Experience Level</Label>
                          <Select
                            value={editedProfile.experienceLevel}
                            onValueChange={(value) => setEditedProfile({ ...editedProfile, experienceLevel: value })}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              {SKILL_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-slate-700 dark:text-slate-300 font-medium">Personality Traits</Label>
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            {PERSONALITY_TRAITS.map((trait) => (
                              <div key={trait.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={trait.value}
                                  checked={editedProfile.personalityTraits?.includes(trait.value) || false}
                                  onCheckedChange={() => togglePersonalityTrait(trait.value)}
                                />
                                <Label htmlFor={trait.value} className="text-sm">
                                  {trait.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-slate-700 dark:text-slate-300 font-medium">Skills</Label>
                        {!isEditing && editedProfile.experienceLevel && (
                          <Badge variant="outline" className="text-xs">
                            {SKILL_LEVELS.find((l) => l.value === editedProfile.experienceLevel)?.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editedProfile.skills.map((skill, index) => (
                          <Badge
                            key={skill}
                            className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                          >
                            <span>{skill}</span>
                            {isEditing && (
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 hover:text-red-500 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                        {isEditing && (
                          <div className="flex items-center gap-2">
                            {showAddSkill ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={newSkill}
                                  onChange={(e) => setNewSkill(e.target.value)}
                                  placeholder="Add a skill..."
                                  className="w-32 h-8 text-sm"
                                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                                />
                                <Button size="sm" onClick={addSkill} className="h-8 w-8 p-0">
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setShowAddSkill(false)
                                    setNewSkill("")
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAddSkill(true)}
                                className="px-3 py-1 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Skill
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {editedProfile.personalityTraits && editedProfile.personalityTraits.length > 0 && (
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300 font-medium mb-3 block">
                          Personality Traits
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {editedProfile.personalityTraits.map((trait) => {
                            const traitData = PERSONALITY_TRAITS.find((t) => t.value === trait)
                            return (
                              <Badge
                                key={trait}
                                className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700"
                              >
                                {traitData?.label || trait}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Work Preferences */}
            {(!isEditing || activeTab === "preferences") && (
              <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-1">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-slate-100 text-xl">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      Work Preferences
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Your ideal work environment and preferences
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-6">
                  {isEditing && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remoteWork"
                          checked={editedProfile.workPreferences.remoteWork}
                          onCheckedChange={(checked) =>
                            setEditedProfile({
                              ...editedProfile,
                              workPreferences: {
                                ...editedProfile.workPreferences,
                                remoteWork: checked,
                              },
                            })
                          }
                        />
                        <Label htmlFor="remoteWork">Open to remote work</Label>
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300 font-medium">Preferred Team Size</Label>
                        <Select
                          value={editedProfile.workPreferences.teamSize}
                          onValueChange={(value) =>
                            setEditedProfile({
                              ...editedProfile,
                              workPreferences: {
                                ...editedProfile.workPreferences,
                                teamSize: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select preferred team size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small (2-5 people)</SelectItem>
                            <SelectItem value="medium">Medium (6-15 people)</SelectItem>
                            <SelectItem value="large">Large (16+ people)</SelectItem>
                            <SelectItem value="no-preference">No preference</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300 font-medium">Work Environment</Label>
                        <Select
                          value={editedProfile.workPreferences.workEnvironment}
                          onValueChange={(value) =>
                            setEditedProfile({
                              ...editedProfile,
                              workPreferences: {
                                ...editedProfile.workPreferences,
                                workEnvironment: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select preferred work environment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="startup">Startup</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="agency">Agency</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                            <SelectItem value="nonprofit">Non-profit</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg">
                        <span className="text-slate-700 dark:text-slate-300">Remote Work</span>
                        <Badge variant={editedProfile.workPreferences.remoteWork ? "default" : "secondary"}>
                          {editedProfile.workPreferences.remoteWork ? "Open" : "Not specified"}
                        </Badge>
                      </div>

                      {editedProfile.workPreferences.teamSize && (
                        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg">
                          <span className="text-slate-700 dark:text-slate-300">Team Size</span>
                          <Badge variant="outline">
                            {editedProfile.workPreferences.teamSize.charAt(0).toUpperCase() +
                              editedProfile.workPreferences.teamSize.slice(1)}
                          </Badge>
                        </div>
                      )}

                      {editedProfile.workPreferences.workEnvironment && (
                        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg">
                          <span className="text-slate-700 dark:text-slate-300">Work Environment</span>
                          <Badge variant="outline">
                            {editedProfile.workPreferences.workEnvironment.charAt(0).toUpperCase() +
                              editedProfile.workPreferences.workEnvironment.slice(1)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Quick Stats & Settings */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-slate-800 dark:text-slate-100 text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {Math.round(
                      (((editedProfile.interests.length > 0 ? 1 : 0) +
                        (editedProfile.goals.length > 0 ? 1 : 0) +
                        (editedProfile.skills.length > 0 ? 1 : 0) +
                        (editedProfile.bio ? 1 : 0) +
                        (editedProfile.experienceLevel ? 1 : 0)) /
                        5) *
                        100,
                    )}
                    %
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Profile Complete</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-lg font-semibold text-blue-600">{editedProfile.interests.length}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Interests</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-lg font-semibold text-green-600">{editedProfile.goals.length}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Goals</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-lg font-semibold text-purple-600">{editedProfile.skills.length}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Skills</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-lg font-semibold text-orange-600">
                      {editedProfile.personalityTraits?.length || 0}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Traits</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800 dark:text-slate-100">
                    <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center mr-2">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                    Account Settings
                  </CardTitle>
                </CardHeader>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-600/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 text-sm">Notifications</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Email & push settings</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-600/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-green-500" />
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 text-sm">Privacy</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Control visibility</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-600/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Download className="w-4 h-4 text-purple-500" />
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 text-sm">Export Data</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Download your info</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
