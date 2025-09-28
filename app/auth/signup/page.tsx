'use client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Github, Chrome, Check, X, Shield, Zap, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    setIsVisible(true)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Calculate password strength
  useEffect(() => {
    const { password } = formData
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }, [formData.password])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500))
    setIsLoading(false)
  }

  const getPasswordStrengthInfo = () => {
    const levels = [
      { label: "Very Weak", color: "text-red-500", bgColor: "bg-red-500" },
      { label: "Weak", color: "text-orange-500", bgColor: "bg-orange-500" },
      { label: "Fair", color: "text-yellow-500", bgColor: "bg-yellow-500" },
      { label: "Good", color: "text-blue-500", bgColor: "bg-blue-500" },
      { label: "Strong", color: "text-green-500", bgColor: "bg-green-500" }
    ]
    return levels[passwordStrength] || levels[0]
  }

  const isFormValid = formData.name && formData.email && formData.password && passwordStrength >= 2 && agreedToTerms

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Dynamic background with mouse tracking */}
      <div
        className="fixed inset-0 opacity-30 transition-all duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(139, 92, 246, 0.1), transparent 40%)`
        }}
      />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/30 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-blue-400/30 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-pink-400/30 rounded-full animate-ping delay-1000"></div>
      </div>

      {/* Main sign-up card */}
      <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Card className="w-full max-w-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500">
          <CardHeader className="text-center pb-8">
            {/* Enhanced logo */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 rounded-md">
                  <Image src="/logo.svg" alt="Logo" width={100} height={100} />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-pulse flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>

                {/* Orbiting elements */}
                <div className="absolute -inset-4 opacity-30">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-spin" style={{
                    transformOrigin: '40px 40px',
                    animation: 'spin 8s linear infinite'
                  }}></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-3xl font-black bg-gradient-to-r from-slate-900 via-purple-600 to-blue-600 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                Join DreamAlign
              </CardTitle>
              <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                Where your dreams meet opportunity
              </div>
            </div>

            <CardDescription className="text-slate-600 dark:text-slate-300 text-base mt-4">
              Start your AI-powered journey to discover and align with your dream career
            </CardDescription>

            {/* Benefits preview */}
            <div className="flex justify-center space-x-6 mt-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">Dream Discovery</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">AI Coaching</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">Success Tracking</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social sign-up options */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 group"
              >
                <Chrome className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-300 group-hover:text-purple-600 transition-colors" />
                Sign up with Google
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 group"
              >
                <Github className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-300 group-hover:text-purple-600 transition-colors" />
                Sign up with GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400 font-medium">
                  Or create with email
                </span>
              </div>
            </div>

            {/* Full Name input */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:bg-white dark:hover:bg-slate-800"
                />
                {formData.name && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:bg-white dark:hover:bg-slate-800"
                />
                {formData.email && formData.email.includes('@') && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-12 pr-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:bg-white dark:hover:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1 flex-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength
                              ? getPasswordStrengthInfo().bgColor
                              : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-medium ${getPasswordStrengthInfo().color}`}>
                      {getPasswordStrengthInfo().label}
                    </span>
                  </div>

                  {/* Password requirements */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center space-x-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-slate-400'}`}>
                      {formData.password.length >= 8 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-slate-400'}`}>
                      {/[A-Z]/.test(formData.password) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Uppercase</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-slate-400'}`}>
                      {/[0-9]/.test(formData.password) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Number</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-slate-400'}`}>
                      {/[^A-Za-z0-9]/.test(formData.password) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Special char</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                I agree to DreamAlign's{" "}
                <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:underline">
                  Terms of Service
                </button>
                {" "}and{" "}
                <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:underline">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Create account button */}
            <Button
              onClick={handleSignUp}
              disabled={isLoading || !isFormValid}
              className="w-full h-12 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating your account...</span>
                  </div>
                ) : (
                  <>
                    Create Your DreamAlign Account
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </Button>

            {/* Sign in link */}
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-300">
                Already have an account?{" "}
                <Link href="/auth/signin">
                  <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold hover:underline transition-all duration-300 group cursor-pointer">
                    Sign in here
                    <ArrowRight className="inline w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                ✨ Free 7-day trial • No credit card required
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom decorative elements */}
        <div className="flex justify-center mt-8 space-x-2 opacity-50">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-600"></div>
        </div>
      </div>

      {/* Floating trust signals */}
      <div className="fixed bottom-20 left-8 opacity-40 animate-bounce">
        <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-slate-600 dark:text-slate-300">98% success rate</span>
        </div>
      </div>

      <div className="fixed bottom-20 right-8 opacity-40 animate-bounce delay-1000">
        <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <Shield className="w-3 h-3 text-purple-500" />
          <span className="text-xs text-slate-600 dark:text-slate-300">Secure & private</span>
        </div>
      </div>

      <div className="fixed top-20 right-8 opacity-40 animate-bounce delay-500">
        <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <Sparkles className="w-3 h-3 text-yellow-500" />
          <span className="text-xs text-slate-600 dark:text-slate-300">25K+ dream careers</span>
        </div>
      </div>
    </div>
  )
}