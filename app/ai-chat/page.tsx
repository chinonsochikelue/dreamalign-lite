"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DashboardNav } from "@/components/dashboard-nav"
import { AIProviderSelector } from "@/components/ai-provider-selector"
import { useAnalytics } from "@/lib/analytics"
import { getUserPreferredProvider, type AIProvider } from "@/lib/ai-provider"
import {
    MessageSquare,
    Send,
    Sparkles,
    User,
    Bot,
    Loader2,
    TrendingUp,
    Briefcase,
    BookOpen,
    Target,
    Settings,
    ChevronLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: number
}

export default function AIChatPage() {
    const router = useRouter()
    const { user, isLoaded } = useUser()
    const analytics = useAnalytics()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [aiProvider, setAiProvider] = useState<AIProvider>("openai")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const getUserByEmail = useQuery(
        api.users.getByEmail,
        user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip"
    )

    const getUserProfile = useQuery(
        api.users.getProfile,
        getUserByEmail?._id ? { userId: getUserByEmail._id } : "skip"
    )

    const getCareerRecommendations = useQuery(
        api.users.getCareerRecommendations,
        getUserByEmail?._id ? { userId: getUserByEmail._id } : "skip"
    )

    const interviewSessions = useQuery(
        api.interviews.getUserSessions,
        getUserByEmail?._id ? { userId: getUserByEmail._id } : "skip"
    )

    const saveChatMessage = useMutation(api.aiChat.saveChatMessage)
    const getChatHistory = useQuery(
        api.aiChat.getChatHistory,
        getUserByEmail?._id ? { userId: getUserByEmail._id } : "skip"
    )

    useEffect(() => {
        const preferred = getUserPreferredProvider()
        setAiProvider(preferred)
    }, [])

    useEffect(() => {
        if (getChatHistory) {
            const formattedMessages = getChatHistory.map((msg) => ({
                id: msg._id,
                role: msg.role as "user" | "assistant",
                content: msg.content,
                timestamp: msg.timestamp,
            }))
            setMessages(formattedMessages)
        }
    }, [getChatHistory])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if (isLoaded && user) {
            analytics.track("ai_chat_viewed", {
                page: "/ai-chat",
                metadata: {
                    user_id: user.id,
                    message_count: messages.length,
                }
            })
        }
    }, [isLoaded, user])

    const handleSendMessage = async () => {
        if (!input.trim() || !getUserByEmail?._id) return

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: input.trim(),
            timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            // Save user message
            await saveChatMessage({
                userId: getUserByEmail._id,
                role: "user",
                content: userMessage.content,
            })

            // Track AI interaction
            analytics.trackAiInteraction(aiProvider, "chat", "generation_start", {
                metadata: {
                    message_length: userMessage.content.length,
                }
            })

            // Prepare context for AI
            const userContext = {
                profile: getUserProfile,
                careerPaths: getCareerRecommendations,
                recentInterviews: interviewSessions?.slice(0, 5),
                interests: getUserByEmail.interests,
                skills: getUserByEmail.skills,
                experienceLevel: getUserByEmail.experienceLevel,
            }

            // Call AI chat API
            const response = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.content,
                    context: userContext,
                    provider: aiProvider,
                    conversationHistory: messages.slice(-5), // Last 5 messages for context
                }),
            })

            if (!response.ok) throw new Error("Failed to get AI response")

            const data = await response.json()

            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: data.message,
                timestamp: Date.now(),
            }

            setMessages((prev) => [...prev, assistantMessage])

            // Save assistant message
            await saveChatMessage({
                userId: getUserByEmail._id,
                role: "assistant",
                content: assistantMessage.content,
            })

            analytics.trackAiGeneration(
                aiProvider,
                "chat",
                data.inputTokens,
                data.outputTokens,
                data.latency
            )
        } catch (error) {
            console.error("Error sending message:", error)
            analytics.trackAiError(aiProvider, "chat", error instanceof Error ? error.message : "Unknown error")

            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: "I apologize, but I encountered an error. Please try again.",
                timestamp: Date.now(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const suggestedQuestions = [
        { icon: TrendingUp, text: "How can I improve my interview scores?" },
        { icon: Briefcase, text: "What career paths suit my profile?" },
        { icon: BookOpen, text: "Recommend courses for my skill gaps" },
        { icon: Target, text: "Help me set career goals" },
    ]

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <DashboardNav />
            <div className="flex mt-18 flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden lg:flex flex-col w-80 bg-white/90 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">AI Career Assistant</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">ChatGPT-like Experience</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full mb-2" onClick={() => setMessages([])}>
                        + New Chat
                    </Button>
                    <div className="space-y-4">
                        <Card className="border-0 bg-white/80 dark:bg-slate-800/80 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center text-slate-800 dark:text-slate-100">
                                    <Target className="w-5 h-5 mr-2 text-indigo-600" />
                                    Your Context
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Interests</span>
                                        <Badge variant="secondary">{getUserByEmail?.interests?.length || 0}</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {getUserByEmail?.interests?.slice(0, 3).map((interest) => (
                                            <Badge key={interest} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{interest}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Career Paths</span>
                                        <Badge variant="secondary">{getCareerRecommendations?.length || 0}</Badge>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">AI has access to your career recommendations</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Interviews</span>
                                        <Badge variant="secondary">{interviewSessions?.length || 0}</Badge>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">AI can analyze your interview performance</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Skills</span>
                                        <Badge variant="secondary">{getUserByEmail?.skills?.length || 0}</Badge>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">AI knows your skill set and experience level</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center text-slate-800 dark:text-slate-100">
                                    <Sparkles className="w-5 h-5 mr-2 text-amber-600" />
                                    Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li className="flex items-start gap-2"><span className="text-amber-600 mt-1">•</span><span>Ask specific questions about your career path</span></li>
                                    <li className="flex items-start gap-2"><span className="text-amber-600 mt-1">•</span><span>Request personalized learning recommendations</span></li>
                                    <li className="flex items-start gap-2"><span className="text-amber-600 mt-1">•</span><span>Get feedback on your interview performance</span></li>
                                    <li className="flex items-start gap-2"><span className="text-amber-600 mt-1">•</span><span>Explore new skills to develop</span></li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => setShowSettings(!showSettings)}>
                            <Settings className="w-4 h-4 mr-2" /> Settings
                        </Button>
                        {showSettings && (
                            <Card className="border-0 bg-white/80 dark:bg-slate-800/80 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">AI Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <AIProviderSelector onProviderChange={setAiProvider} showDescription={true} compact={false} />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </aside>
                {/* Chat Main Area */}
                <main className="flex-1 flex flex-col relative bg-white/80 dark:bg-slate-900/80">
                    {/* Header for mobile */}
                    <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-7 h-7 text-indigo-600" />
                            <span className="font-bold text-lg">AI Career Assistant</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                    {/* Chat messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-8 mb-12 space-y-6" style={{ scrollBehavior: 'smooth' }}>
                        {messages.length === 0 && (
                            <div className="text-center py-12">
                                <Bot className="w-16 h-16 mx-auto mb-4 text-indigo-500 opacity-50" />
                                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Start a conversation</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ask me anything about your career, skills, or goals</p>
                                <div className="grid md:grid-cols-2 gap-3 mx-auto">
                                    {suggestedQuestions.map((q, idx) => (
                                        <Button key={idx} variant="outline" className="text-left w-full justify-start h-auto py-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400" onClick={() => setInput(q.text)}>
                                            <q.icon className="w-4 h-4 mr-2 flex-shrink-0 text-indigo-600" />
                                            <span className="text-sm">{q.text}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {messages.map((message, idx) => (
                            <div key={message.id} className={`flex gap-3 items-end ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                {message.role === "assistant" && (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[70%] rounded-2xl px-5 py-4 shadow ${message.role === "user" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"}`}>
                                    <ReactMarkdown className="text-base prose dark:prose-invert max-w-none">
                                        {message.content}
                                    </ReactMarkdown>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</span>
                                        {message.role === "assistant" && idx === messages.length - 1 && (
                                            <Button variant="ghost" size="sm" className="ml-2 px-2 py-1 text-xs" onClick={() => setInput(messages[messages.length - 2]?.content || "")}>Regenerate</Button>
                                        )}
                                    </div>
                                </div>
                                {message.role === "user" && (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 items-end justify-start">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 py-4 shadow">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {/* Fixed Input Bar */}
                    <div className="fixed bottom-0 left-0 xl:ml-40 lg:ml-84 w-full p-4 z-60 lg:w-[70%] xl:w-full flex justify-center">
                        <div className="w-full max-w-4xl mx-auto bg-white/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-4 py-4 shadow-lg rounded-t-2xl flex items-center gap-2">
                            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." className="flex-1 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 border-none h-12" disabled={isLoading} />
                            <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                                {isLoading ? (<Loader2 className="w-4 h-4 animate-spin" />) : (<Send className="w-4 h-4" />)}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}