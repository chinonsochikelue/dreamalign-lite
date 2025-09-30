"use client"
import { useUser } from "@clerk/nextjs"
import type React from "react"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sparkles, CheckCircle, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface OnboardingGuardProps {
  children: React.ReactNode
  requireOnboarding?: boolean
}

export function OnboardingGuard({ children, requireOnboarding = false }: OnboardingGuardProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [redirectMessage, setRedirectMessage] = useState("")

  const onboardingStatus = useQuery(
    api.users.getOnboardingStatus,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip",
  )

  useEffect(() => {
    if (isLoaded && user && onboardingStatus) {
      // If user exists but hasn't completed onboarding, redirect to onboarding
      if (onboardingStatus.exists && !onboardingStatus.profileCompleted && !requireOnboarding) {
        setIsRedirecting(true)
        setRedirectMessage("Setting up your personalized experience...")
        setTimeout(() => {
          router.push("/onboarding")
        }, 1500)
      }
      // If user has completed onboarding but is on onboarding page, redirect to dashboard
      else if (onboardingStatus.exists && onboardingStatus.profileCompleted && requireOnboarding) {
        setIsRedirecting(true)
        setRedirectMessage("Welcome back! Taking you to your dashboard...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      }
    }
  }, [isLoaded, user, onboardingStatus, router, requireOnboarding])

  // Show loading state while checking onboarding status
  if (!isLoaded || (user && !onboardingStatus)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl mb-6 animate-pulse mx-auto">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Loading your profile...</h3>
            <p className="text-slate-600 dark:text-slate-300">Please wait while we prepare your experience</p>
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show redirect message
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-500">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl mb-6 mx-auto">
              {requireOnboarding ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <Sparkles className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{redirectMessage}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">Redirecting you now...</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Please wait</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
