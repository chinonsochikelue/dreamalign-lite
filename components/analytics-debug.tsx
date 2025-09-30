"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAnalytics } from "@/lib/analytics"
import { BarChart3, EyeOff, Download, Trash2 } from "lucide-react"

export function AnalyticsDebug() {
  const [isVisible, setIsVisible] = useState(false)
  const analytics = useAnalytics()
  const debugInfo = analytics.getDebugInfo()

  const downloadLogs = () => {
    const dataStr = JSON.stringify(debugInfo.logs, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `analytics-logs-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const clearLogs = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("analytics_log")
      window.location.reload()
    }
  }

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics Debug
        </Button>
      ) : (
        <Card className="w-96 max-h-96 bg-white shadow-2xl border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-purple-900">Analytics Debug</CardTitle>
                <CardDescription className="text-xs">Development mode only</CardDescription>
              </div>
              <Button onClick={() => setIsVisible(false)} size="sm" variant="ghost" className="h-6 w-6 p-0">
                <EyeOff className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-600">Status:</span>
                <Badge variant={debugInfo.isEnabled ? "default" : "secondary"} className="ml-1 text-xs">
                  {debugInfo.isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div>
                <span className="text-slate-600">Events:</span>
                <Badge variant="outline" className="ml-1 text-xs">
                  {debugInfo.logs.length}
                </Badge>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <div>
                <span className="text-slate-600">User ID:</span> {debugInfo.userId || "Not set"}
              </div>
              <div>
                <span className="text-slate-600">Session:</span> {debugInfo.sessionId.slice(-8)}...
              </div>
              <div>
                <span className="text-slate-600">Duration:</span> {Math.floor(debugInfo.sessionDuration / 1000)}s
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-700">Recent Events</span>
                <div className="flex space-x-1">
                  <Button
                    onClick={downloadLogs}
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs bg-transparent"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button onClick={clearLogs} size="sm" variant="outline" className="h-6 px-2 text-xs bg-transparent">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-32 border rounded p-2 bg-slate-50">
                <div className="space-y-1">
                  {debugInfo.logs
                    .slice(-10)
                    .reverse()
                    .map((log, index) => (
                      <div key={index} className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-purple-600">{log.event}</span>
                          <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        {log.properties.page && <div className="text-slate-600 ml-2">→ {log.properties.page}</div>}
                      </div>
                    ))}
                  {debugInfo.logs.length === 0 && (
                    <div className="text-xs text-slate-500 text-center py-4">No events logged yet</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
