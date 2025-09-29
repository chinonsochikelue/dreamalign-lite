import * as openai from "./integrations/openai"
import * as gemini from "./integrations/gemini"

export type AIProvider = "openai" | "gemini"

export interface AIProviderConfig {
  id: AIProvider
  name: string
  description: string
  model: string
  icon: string
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI GPT-4",
    description: "Advanced reasoning and comprehensive responses",
    model: "openai/gpt-4o-mini",
    icon: "🤖",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Fast, efficient, and creative responses",
    model: "google/gemini-1.5-flash",
    icon: "✨",
  },
]

// Provider-agnostic interface
export interface AIService {
  analyzeCareerInterests(interests: string[]): Promise<any[]>
  generateInterviewQuestions(jobRole: string, interviewType: string): Promise<string[]>
  evaluateInterviewAnswer(
    question: string,
    answer: string,
    jobRole: string,
  ): Promise<{ score: number; feedback: string }>
}

// Get AI service instance based on provider
export function getAIService(provider: AIProvider): AIService {
  switch (provider) {
    case "openai":
      return openai
    case "gemini":
      return gemini
    default:
      return openai // Default fallback
  }
}

// Get provider config
export function getProviderConfig(provider: AIProvider): AIProviderConfig {
  return AI_PROVIDERS.find((p) => p.id === provider) || AI_PROVIDERS[0]
}

// Storage keys for user preferences
export const AI_PROVIDER_STORAGE_KEY = "dreamalign_ai_provider"

// Get user's preferred provider from localStorage
export function getUserPreferredProvider(): AIProvider {
  if (typeof window === "undefined") return "openai"

  try {
    const stored = localStorage.getItem(AI_PROVIDER_STORAGE_KEY)
    if (stored && AI_PROVIDERS.some((p) => p.id === stored)) {
      return stored as AIProvider
    }
  } catch (error) {
    console.warn("Failed to get AI provider preference:", error)
  }

  return "openai" // Default
}

// Set user's preferred provider
export function setUserPreferredProvider(provider: AIProvider): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(AI_PROVIDER_STORAGE_KEY, provider)
  } catch (error) {
    console.warn("Failed to save AI provider preference:", error)
  }
}
