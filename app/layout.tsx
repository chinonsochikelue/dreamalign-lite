import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/provider/theme-provider"
import { ConvexClientProvider } from "./ConvexClientProvider"
import Provider from "./Provider"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import { AnalyticsDebug } from "@/components/analytics-debug"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Dreamalign-Lite - AI-Powered Career Development",
  description: "Discover your ideal career path and master interviews with AI-powered guidance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} appearance={{ baseTheme: "dark" }}>
            <ConvexClientProvider>
              <Suspense fallback={null}>
                <Provider>{children}</Provider>
              </Suspense>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
        <Analytics />
        <AnalyticsDebug />
      </body>
    </html>
  )
}
