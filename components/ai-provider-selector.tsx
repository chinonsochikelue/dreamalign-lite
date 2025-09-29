"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Brain } from "lucide-react"
import { type AIProvider, AI_PROVIDERS, getUserPreferredProvider, setUserPreferredProvider } from "@/lib/ai-provider"

interface AIProviderSelectorProps {
  onProviderChange?: (provider: AIProvider) => void
  showDescription?: boolean
  compact?: boolean
}

export function AIProviderSelector({
  onProviderChange,
  showDescription = true,
  compact = false,
}: AIProviderSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>("openai")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const preferred = getUserPreferredProvider()
    setSelectedProvider(preferred)
  }, [])

  const handleProviderSelect = async (provider: AIProvider) => {
    if (provider === selectedProvider) return

    setIsLoading(true)
    try {
      setSelectedProvider(provider)
      setUserPreferredProvider(provider)
      onProviderChange?.(provider)
    } catch (error) {
      console.error("Failed to switch AI provider:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderIcon = (providerId: AIProvider) => {
    switch (providerId) {
      case "openai":
        return <Brain className="w-4 h-4" />
      case "gemini":
        return <Zap className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  if (compact) {
    return (
      <div className="flex gap-2">
        {AI_PROVIDERS.map((provider) => (
          <Button
            key={provider.id}
            variant={selectedProvider === provider.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleProviderSelect(provider.id)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {getProviderIcon(provider.id)}
            {provider.name}
            {selectedProvider === provider.id && <Check className="w-3 h-3" />}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">AI Interview Coach</h3>
        <Badge variant="secondary" className="text-xs">
          Choose your preferred AI
        </Badge>
      </div>

      <div className="grid gap-3">
        {AI_PROVIDERS.map((provider) => (
          <Card
            key={provider.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedProvider === provider.id
                ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
            onClick={() => handleProviderSelect(provider.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {getProviderIcon(provider.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">{provider.name}</h4>
                      {selectedProvider === provider.id && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    {showDescription && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{provider.description}</p>
                    )}
                  </div>
                </div>

                {selectedProvider === provider.id && <Check className="w-5 h-5 text-blue-600" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 mt-3">
        Your preference is saved automatically and will be used for all interview sessions.
      </div>
    </div>
  )
}
