import { track } from "@vercel/analytics"

// Analytics event types
export type AnalyticsEvent =
  // Onboarding events
  | "onboarding_started"
  | "onboarding_step_completed"
  | "onboarding_completed"
  | "onboarding_abandoned"

  // Interview events
  | "interview_session_started"
  | "interview_question_answered"
  | "interview_session_completed"
  | "interview_session_abandoned"
  | "interview_feedback_viewed"

  // Career path events
  | "career_path_viewed"
  | "career_path_bookmarked"
  | "career_path_shared"
  | "career_match_calculated"

  // Dashboard events
  | "dashboard_viewed"
  | "progress_milestone_reached"
  | "achievement_unlocked"
  | "learning_objective_completed"

  // Profile events
  | "profile_viewed"
  | "profile_updated"
  | "profile_picture_changed"

  // Navigation events
  | "page_viewed"
  | "feature_clicked"
  | "external_link_clicked"

  // Performance events
  | "page_load_time"
  | "api_response_time"
  | "error_occurred"

  // AI interaction events
  | "ai_interaction"
  | "ai_generation_started"
  | "ai_generation_completed"
  | "ai_generation_failed"
  | "ai_feedback_provided"

// Analytics properties interface
export interface AnalyticsProperties {
  // User properties
  userId?: string
  userEmail?: string
  userExperienceLevel?: string
  userInterests?: string[]

  // Session properties
  sessionId?: string
  sessionDuration?: number

  // Page properties
  page?: string
  referrer?: string

  // Feature properties
  feature?: string
  action?: string
  value?: string | number

  // Onboarding properties
  onboardingStep?: number
  completionRate?: number
  timeSpent?: number

  // Interview properties
  interviewType?: string
  questionIndex?: number
  questionCategory?: string
  responseTime?: number
  score?: number

  // Career path properties
  careerPathId?: string
  matchScore?: number

  // Error properties
  errorMessage?: string
  errorStack?: string

  // Performance properties
  loadTime?: number
  responseTime?: number

  // AI properties
  provider?: string
  model?: string
  aiEventType?: "generation_start" | "generation_complete" | "generation_error" | "feedback_received"
  inputTokens?: number
  outputTokens?: number
  latency?: number
  cost?: number
  quality?: number
  feedback?: string
  metadata?: any

  // Schema-compliant properties
  component?: string

  // Custom properties
  [key: string]: any
}

// Analytics utility class
class Analytics {
  private isEnabled = true
  private userId: string | null = null
  private sessionId: string
  private sessionStartTime: number
  private pageStartTime: number = Date.now()

  constructor() {
    this.sessionId = this.generateSessionId()
    this.sessionStartTime = Date.now()

    // Initialize session tracking
    if (typeof window !== "undefined") {
      this.trackPageView()
      this.setupPerformanceTracking()
      this.setupErrorTracking()
      this.setupUnloadTracking()
    }
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Set user information
  setUser(userId: string, email?: string, properties?: Record<string, any>) {
    this.userId = userId
    this.track("user_identified", {
      metadata: {
        userId,
        userEmail: email,
        ...properties,
      }
    })
  }

  // Main tracking method
  track(event: AnalyticsEvent, properties: AnalyticsProperties = {}) {
    if (!this.isEnabled) return

    // Separate allowed properties from metadata
    const { 
      page, 
      component, 
      action, 
      value,
      // Extract metadata if provided
      metadata: providedMetadata,
      // All other properties go into metadata
      ...customProperties 
    } = properties

    // Build properties that match Convex schema
    const schemaCompliantProperties = {
      page,
      component,
      action,
      value,
      // Wrap everything else in metadata
      metadata: {
        ...customProperties,
        ...providedMetadata,
        // Add enriched data to metadata
        timestamp: Date.now(),
        referrer: typeof window !== "undefined" ? document.referrer : undefined,
        userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
        sessionDuration: Date.now() - this.sessionStartTime,
      }
    }

    // Send to Vercel Analytics with all enriched data
    const enrichedProperties = {
      ...properties,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      page: page || (typeof window !== "undefined" ? window.location.pathname : undefined),
      referrer: typeof window !== "undefined" ? document.referrer : undefined,
      userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
      sessionDuration: Date.now() - this.sessionStartTime,
    }

    track(event, enrichedProperties)

    // Send to backend with schema-compliant properties
    this.sendToBackend(event, schemaCompliantProperties)

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] ${event}:`, enrichedProperties)
    }

    // Store in localStorage for debugging
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      const analyticsLog = JSON.parse(localStorage.getItem("analytics_log") || "[]")
      analyticsLog.push({ event, properties: enrichedProperties, timestamp: new Date().toISOString() })

      // Keep only last 100 events
      if (analyticsLog.length > 100) {
        analyticsLog.splice(0, analyticsLog.length - 100)
      }

      localStorage.setItem("analytics_log", JSON.stringify(analyticsLog))
    }
  }

  private async sendToBackend(event: AnalyticsEvent, properties: AnalyticsProperties) {
    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: event,
          eventName: event,
          properties,
          userId: this.userId,
          sessionId: this.sessionId,
        }),
      })

      if (!response.ok) {
        console.error("[Analytics] Failed to send to backend:", response.statusText)
      }
    } catch (error) {
      console.error("[Analytics] Error sending to backend:", error)
    }
  }

  // Track page views
  trackPageView(page?: string) {
    const currentPage = page || (typeof window !== "undefined" ? window.location.pathname : "")
    this.pageStartTime = Date.now()

    this.track("page_viewed", {
      page: currentPage,
      metadata: {
        title: typeof document !== "undefined" ? document.title : undefined,
      }
    })
  }

  // Track onboarding funnel
  trackOnboardingStep(step: number, data?: Record<string, any>) {
    this.track("onboarding_step_completed", {
      metadata: {
        onboardingStep: step,
        timeSpent: Date.now() - this.pageStartTime,
        ...data,
      }
    })
  }

  trackOnboardingCompleted(totalTime: number, completionRate: number) {
    this.track("onboarding_completed", {
      metadata: {
        totalTime,
        completionRate,
        sessionDuration: Date.now() - this.sessionStartTime,
      }
    })
  }

  trackOnboardingAbandoned(step: number, timeSpent: number) {
    this.track("onboarding_abandoned", {
      metadata: {
        onboardingStep: step,
        timeSpent,
        abandonmentRate: step / 5, // Assuming 5 total steps
      }
    })
  }

  // Track interview sessions
  trackInterviewStarted(interviewType: string, difficulty: string) {
    this.track("interview_session_started", {
      metadata: {
        interviewType,
        difficulty,
        sessionId: this.generateSessionId(),
      }
    })
  }

  trackQuestionAnswered(questionIndex: number, category: string, responseTime: number, score?: number) {
    this.track("interview_question_answered", {
      metadata: {
        questionIndex,
        questionCategory: category,
        responseTime,
        score,
      }
    })
  }

  trackInterviewCompleted(totalQuestions: number, averageScore: number, totalTime: number) {
    this.track("interview_session_completed", {
      metadata: {
        totalQuestions,
        averageScore,
        totalTime,
        completionRate: 100,
      }
    })
  }

  trackAiInteraction(
    provider: string,
    model: string,
    eventType: "generation_start" | "generation_complete" | "generation_error" | "feedback_received",
    data?: Partial<AnalyticsProperties>,
  ) {
    this.track("ai_interaction", {
      metadata: {
        provider,
        model,
        aiEventType: eventType,
        ...data,
      }
    })
  }

  trackAiGeneration(
    provider: string,
    model: string,
    inputTokens?: number,
    outputTokens?: number,
    latency?: number,
    cost?: number,
  ) {
    this.track("ai_generation_completed", {
      metadata: {
        provider,
        model,
        aiEventType: "generation_complete",
        inputTokens,
        outputTokens,
        latency,
        cost,
      }
    })
  }

  trackAiError(provider: string, model: string, error: string, metadata?: any) {
    this.track("ai_generation_failed", {
      metadata: {
        provider,
        model,
        aiEventType: "generation_error",
        errorMessage: error,
        ...metadata,
      }
    })
  }

  trackAiFeedback(provider: string, model: string, quality: number, feedback?: string) {
    this.track("ai_feedback_provided", {
      metadata: {
        provider,
        model,
        aiEventType: "feedback_received",
        quality,
        feedback,
      }
    })
  }

  // Track career path interactions
  trackCareerPathViewed(pathId: string, matchScore: number) {
    this.track("career_path_viewed", {
      metadata: {
        careerPathId: pathId,
        matchScore,
      }
    })
  }

  trackCareerPathBookmarked(pathId: string) {
    this.track("career_path_bookmarked", {
      metadata: {
        careerPathId: pathId,
      }
    })
  }

  // Track feature usage
  trackFeatureClick(feature: string, action: string, value?: string | number) {
    this.track("feature_clicked", {
      action,
      value,
      metadata: {
        feature,
      }
    })
  }

  // Track profile updates
  trackProfileUpdated(changes: string[]) {
    this.track("profile_updated", {
      metadata: {
        changedFields: changes,
        changeCount: changes.length,
      }
    })
  }

  // Track errors
  trackError(error: Error, context?: string) {
    this.track("error_occurred", {
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
      metadata: {
        errorMessage: error.message,
        errorStack: error.stack,
        context,
      }
    })
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, context?: string) {
    this.track("page_load_time", {
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
      value,
      metadata: {
        metric,
        loadTime: value,
        context,
      }
    })
  }

  // Setup automatic performance tracking
  private setupPerformanceTracking() {
    if (typeof window === "undefined") return

    // Track page load time
    window.addEventListener("load", () => {
      const loadTime = performance.now()
      this.trackPerformance("page_load", loadTime, window.location.pathname)
    })

    // Track navigation timing
    if ("navigation" in performance) {
      const navigation = performance.navigation
      const timing = performance.timing

      window.addEventListener("load", () => {
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart
        const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart
        const firstByteTime = timing.responseStart - timing.navigationStart

        this.track("page_load_time", {
          page: window.location.pathname,
          metadata: {
            pageLoadTime,
            domContentLoadedTime,
            firstByteTime,
            navigationType: navigation.type,
          }
        })
      })
    }
  }

  // Setup error tracking
  private setupErrorTracking() {
    if (typeof window === "undefined") return

    window.addEventListener("error", (event) => {
      this.trackError(event.error, "global_error_handler")
    })

    window.addEventListener("unhandledrejection", (event) => {
      this.trackError(new Error(event.reason), "unhandled_promise_rejection")
    })
  }

  // Setup page unload tracking
  private setupUnloadTracking() {
    if (typeof window === "undefined") return

    window.addEventListener("beforeunload", () => {
      const timeOnPage = Date.now() - this.pageStartTime
      const sessionDuration = Date.now() - this.sessionStartTime

      // Use sendBeacon for reliable tracking on page unload
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          event: "page_unload",
          properties: {
            metadata: {
              timeOnPage,
              sessionDuration,
              page: window.location.pathname,
              userId: this.userId,
              sessionId: this.sessionId,
            }
          },
        })

        navigator.sendBeacon("/api/analytics", data)
      }
    })
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  // Get analytics debug info
  getDebugInfo() {
    return {
      isEnabled: this.isEnabled,
      userId: this.userId,
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.sessionStartTime,
      logs: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("analytics_log") || "[]") : [],
    }
  }
}

// Create singleton instance
export const analytics = new Analytics()

// Convenience functions
export const trackEvent = (event: AnalyticsEvent, properties?: AnalyticsProperties) => {
  analytics.track(event, properties)
}

export const trackPageView = (page?: string) => {
  analytics.trackPageView(page)
}

export const setUser = (userId: string, email?: string, properties?: Record<string, any>) => {
  analytics.setUser(userId, email, properties)
}

export const trackError = (error: Error, context?: string) => {
  analytics.trackError(error, context)
}

export const trackAiInteraction = (
  provider: string,
  model: string,
  eventType: "generation_start" | "generation_complete" | "generation_error" | "feedback_received",
  data?: Partial<AnalyticsProperties>,
) => {
  analytics.trackAiInteraction(provider, model, eventType, data)
}

export const trackAiGeneration = (
  provider: string,
  model: string,
  inputTokens?: number,
  outputTokens?: number,
  latency?: number,
  cost?: number,
) => {
  analytics.trackAiGeneration(provider, model, inputTokens, outputTokens, latency, cost)
}

// React hook for analytics
export const useAnalytics = () => analytics

export default analytics