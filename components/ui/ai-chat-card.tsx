"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export function AIChatCard() {
  const router = useRouter()

  return (
    <Card className="border-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-xl">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
          <MessageSquare className="w-8 h-8 text-white" />
          <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">AI Career Assistant</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Chat with your personal AI coach for guidance, advice, and career insights
        </p>
        <Button
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={() => router.push("/ai-chat")}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Start Conversation
        </Button>
      </CardContent>
    </Card>
  )
}