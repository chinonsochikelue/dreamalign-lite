"use client"
import { SignUp } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Target, Zap, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignUpPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    setIsVisible(true)

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Dynamic background with mouse tracking */}
      <div
        className="fixed inset-0 opacity-30 transition-all duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(139, 92, 246, 0.1), transparent 40%)`,
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
      <div
        className={`relative z-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <Card className="w-full max-w-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500">
          <CardHeader className="text-center pb-8">
            {/* Enhanced logo */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <Link href="/" className="cursor-pointer">
                  <div className="flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 rounded-md">
                    <Image src="/logo.svg" alt="Logo" width={100} height={100} />
                  </div>
                </Link>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-pulse flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>

                {/* Orbiting elements */}
                <div className="absolute -inset-4 opacity-30">
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-spin"
                    style={{
                      transformOrigin: "40px 40px",
                      animation: "spin 8s linear infinite",
                    }}
                  ></div>
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
            <div className="flex justify-center">
              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
                    card: "bg-transparent shadow-none",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton:
                      "border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300",
                    formFieldInput:
                      "border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:bg-white dark:hover:bg-slate-800",
                    footerActionLink:
                      "text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold hover:underline transition-all duration-300",
                  },
                }}
                redirectUrl="/onboarding"
                signInUrl="/auth/signin"
              />
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
