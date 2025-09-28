'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  TrendingUp
} from "lucide-react"

interface UserProfile {
  name: string
  email: string
  location: string
  bio: string
  joinedDate: string
  interests: string[]
  goals: string[]
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    location: "San Francisco, CA",
    bio: "Passionate software developer looking to advance my career in AI and machine learning. I enjoy building innovative solutions and learning new technologies.",
    joinedDate: "2025-01-10",
    interests: ["AI/ML", "Web Development", "Product Management", "Data Science"],
    goals: ["Land a senior developer role", "Master system design", "Improve leadership skills"],
  })

  const [editedProfile, setEditedProfile] = useState(profile)
  const [newInterest, setNewInterest] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [showAddInterest, setShowAddInterest] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
    setShowAddInterest(false)
    setShowAddGoal(false)
    setNewInterest("")
    setNewGoal("")
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
    setShowAddInterest(false)
    setShowAddGoal(false)
    setNewInterest("")
    setNewGoal("")
  }

  const removeInterest = (interest) => {
    setEditedProfile({
      ...editedProfile,
      interests: editedProfile.interests.filter((i) => i !== interest),
    })
  }

  const addInterest = () => {
    if (newInterest.trim()) {
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
    if (newGoal.trim()) {
      setEditedProfile({
        ...editedProfile,
        goals: [...editedProfile.goals, newGoal.trim()],
      })
      setNewGoal("")
      setShowAddGoal(false)
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
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Navigation */}
      <nav className="border-b border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button className="flex items-center space-x-3 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Career Companion
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Profile Settings</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl mb-4">
              {getInitials(profile.name)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
              <Camera className="w-4 h-4 text-blue-500" />
            </button>
          </div>
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div></div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {isEditing ? "Edit Profile" : profile.name}
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
                  className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
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
                    <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg">{profile.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-slate-800 dark:text-slate-200 font-semibold flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-slate-500" />
                        {profile.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-700 dark:text-slate-300 font-medium">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                      className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-slate-800 dark:text-slate-200 font-semibold flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                      {profile.location}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-slate-700 dark:text-slate-300 font-medium">About Me</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 min-h-24 resize-none"
                      placeholder="Tell us about yourself and your career aspirations..."
                    />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{profile.bio}</p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {formatDate(profile.joinedDate)}</span>
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
                <div className="flex flex-wrap gap-3">
                  {(isEditing ? editedProfile.interests : profile.interests).map((interest, index) => (
                    <Badge 
                      key={interest} 
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40 transition-all duration-200 text-sm font-medium"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
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
                  ))}
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      {showAddInterest ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            placeholder="Add new interest..."
                            className="w-40 h-8 text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                          />
                          <Button size="sm" onClick={addInterest} className="h-8 w-8 p-0">
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {setShowAddInterest(false); setNewInterest("")}} className="h-8 w-8 p-0">
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
                          Add Interest
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
                  {(isEditing ? editedProfile.goals : profile.goals).map((goal, index) => (
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
                            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                          />
                          <Button onClick={addGoal} className="px-4">
                            <Check className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                          <Button variant="outline" onClick={() => {setShowAddGoal(false); setNewGoal("")}}>
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
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">85%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Profile Complete</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-lg font-semibold text-blue-600">{profile.interests.length}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Interests</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-lg font-semibold text-green-600">{profile.goals.length}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Goals</p>
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