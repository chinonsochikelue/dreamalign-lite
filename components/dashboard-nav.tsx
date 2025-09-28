"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Home,
  MessageSquare,
  Target,
  User,
  BarChart3,
  ChevronDown,
  Settings,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { ModeToggle } from "@/components/ModeToggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const primaryNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Interviews", href: "/interview", icon: MessageSquare },
  { name: "Career Paths", href: "/career-paths", icon: Target },
]

const secondaryNavigation = [
  { name: "Progress", href: "/dashboard?tab=progress", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export function DashboardNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className="hidden lg:flex fixed w-full z-50 bg-white/10 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-purple-500/10"
      >
        <div
          className={`transition-all duration-500 border-b ease-out ${
            scrollY > 50
              ? "max-w-[95%] mx-auto mt-4 rounded-2xl px-2 md:px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-purple-500/10"
              : "w-full px-4 bg-transparent"
          }`}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="flex items-center space-x-3">
                  <div className="relative group">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ${
                        isScrolled ? "scale-95" : ""
                      }`}
                    >
                      <Image src="/logo.svg" alt="Logo" width={100} height={100} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <span className="text-xl font-black bg-gradient-to-r from-slate-800 via-purple-600 to-blue-600 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                      DreamAlign <span className="text-sm font-normal">Lite</span>
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1 hidden lg:flex">
                      Where Dreams Meet Opportunity
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex items-center space-x-1">
                {primaryNavigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  )
                })}

                {/* More dropdown for secondary navigation */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <span>More</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {secondaryNavigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link href={item.href} className="flex items-center space-x-2 w-full">
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ModeToggle />

              {/* User Profile Section */}
              <div className="flex items-center space-x-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
                {user && (
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-sm font-medium text-foreground">{user.firstName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

      {/* Mobile Navigation */}
      <nav
        className="lg:hidden fixed w-full z-50 bg-white/10 dark:bg-slate-900/30 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-purple-500/10"
      >
        <div
          className={`transition-all duration-500 border-b ease-out ${
            scrollY > 50
              ? "max-w-[95%] mx-auto mt-4 rounded-2xl px-2 md:px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-purple-500/10"
              : "w-full px-4 bg-transparent"
          }`}
        >
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ${
                      isScrolled ? "scale-95" : ""
                    }`}
                  >
                    <Image src="/logo.svg" alt="Logo" width={100} height={100} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-xl font-black bg-gradient-to-r from-slate-800 via-purple-600 to-blue-600 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                    DreamAlign <span className="text-sm font-normal">Lite</span>
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1 hidden md:flex">
                    Where Dreams Meet Opportunity
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex items-center space-x-2">
              <ModeToggle />
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7",
                  },
                }}
              />
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border bg-card">

            {user && (
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="px-4 py-2 space-y-1">
              {[...primaryNavigation, ...secondaryNavigation].map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
