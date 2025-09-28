'use client';

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, CheckCircle, ChevronDown, Globe, Lightbulb, LinkedinIcon, MessageSquare, Play, Rocket, Sparkles, Star, Target, TrendingUp, TwitterIcon, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";


export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY || 0)
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    setIsVisible(true)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Target,
      title: "Dream Discovery",
      description: "AI-powered analysis of your passions, values, and natural talents to uncover your true career calling",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600",
      hoverColor: "group-hover:bg-purple-500/20"
    },
    {
      icon: Brain,
      title: "AI Career Coach",
      description: "Intelligent mentoring that adapts to your learning style and provides personalized guidance every step of the way",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600",
      hoverColor: "group-hover:bg-blue-500/20"
    },
    {
      icon: Zap,
      title: "Alignment Tracking",
      description: "Real-time progress monitoring with smart insights to keep you aligned with your dream career path",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-600",
      hoverColor: "group-hover:bg-yellow-500/20"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded professionals and mentors who share your vision and can accelerate your journey",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-600",
      hoverColor: "group-hover:bg-green-500/20"
    },
    {
      icon: Target,
      title: "Dream Discovery",
      description: "AI-powered analysis of your passions, values, and natural talents to uncover your true career calling",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600",
      hoverColor: "group-hover:bg-purple-500/20"
    }
  ]

  const stats = [
    { number: "25K+", label: "Dreams Aligned", icon: TrendingUp, color: "text-purple-600" },
    { number: "98%", label: "Success Rate", icon: CheckCircle, color: "text-green-600" },
    { number: "1000+", label: "Career Paths", icon: Rocket, color: "text-blue-600" },
    { number: "4.9★", label: "User Rating", icon: Star, color: "text-yellow-600" }
  ]

  const testimonials = [
    {
      quote: "Dreamalign-Lite transformed my career journey. The AI career coach provided personalized guidance that helped me land my dream job.",
      name: "Alice Johnson",
      role: "Software Engineer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The dream discovery feature was a game-changer. It helped me identify my true passions and align my career path accordingly.",
      name: "Michael Smith",
      role: "Product Manager",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
      quote: "I love the community support in Dreamalign-Lite. Connecting with like-minded professionals has accelerated my career growth.",
      name: "Sofia Martinez",
      role: "UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      quote: "The alignment tracking feature kept me on track with real-time insights. I highly recommend Dreamalign-Lite to anyone serious about their career.",
      name: "David Lee",
      role: "Data Scientist",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg"
    }
  ]
  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 overflow-x-hidden">

      {/* Mouse follower background */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.05), transparent 40%)`
        }}
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-400/10 to-yellow-400/10 rounded-full blur-2xl animate-bounce"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/40 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-blue-400/40 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-pink-400/40 rounded-full animate-ping delay-1000"></div>
      </div>

      <nav className="fixed w-full z-50">
        <div
          className={`transition-all duration-500 border-b ease-out ${scrollY > 50
            ? 'max-w-[95%] mx-auto mt-4 rounded-2xl px-2 md:px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-purple-500/10'
            : 'w-full px-4 bg-transparent'
            }`}
        >
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Image src="/logo.svg" alt="Logo" width={100} height={100} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-slate-800 via-purple-600 to-blue-600 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                  DreamAlign <span className="text-sm font-normal">Lite</span>
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1 hidden md:flex">Where Dreams Meet Opportunity</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Link href="/auth/signin">
                <Button variant="ghost" className="hidden md:flex hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group cursor-pointer h-8 w-20 md:h-full md:w-full">
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 via-blue-100 to-cyan-100 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-cyan-900/30 border border-purple-200 dark:border-purple-700 mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2 animate-spin" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-700 to-blue-700 dark:from-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                  AI-Powered Dream Discovery
                </span>
                <div className="ml-2 px-2 py-1 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 text-xs text-white font-bold">
                  NEW
                </div>
              </div>

              <h1 className="text-6xl sm:text-8xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                  Where Dreams
                </span>
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
                  Meet Opportunity
                </span>
              </h1>

              <p className="text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-5xl mx-auto leading-relaxed">
                Discover your true calling and align your career with your deepest aspirations.
                <span className="text-purple-600 font-semibold"> Transform your professional journey</span> with
                AI-powered guidance that understands your unique path.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="text-xl px-12 py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-110 group relative overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center">
                      Start Your Journey
                      <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-12 py-6 border-2 border-slate-300 dark:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 group"
                >
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`text-center transition-all duration-700 delay-${index * 200} transform hover:scale-110 cursor-pointer group`}
                  >
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300 shadow-lg">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">{stat.number}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Scroll Indicator */}
              <div className="mt-20 flex justify-center">
                <div className="animate-bounce">
                  <ChevronDown className="w-8 h-8 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white/60 to-blue-50/60 dark:from-slate-800/20 dark:to-blue-900/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-700 mb-8">
                <Lightbulb className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Powerful Features</span>
              </div>

              <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-8">
                Your complete
                <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  dream alignment platform
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Discover how we help professionals bridge the gap between their current reality and their dream career with cutting-edge AI technology.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`group border-0 bg-white/80 dark:bg-slate-800/60 backdrop-blur-lg hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer overflow-hidden relative ${activeFeature === index ? 'ring-2 ring-purple-500 bg-white dark:bg-slate-800' : ''
                    }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <CardHeader className="relative p-8">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 group-hover:opacity-10 transition-all duration-500`}></div>

                    <div className={`w-16 h-16 ${feature.bgColor} ${feature.hoverColor} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-125 transition-all duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden`}>
                      <feature.icon className={`w-8 h-8 ${feature.textColor} relative z-10`} />
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    </div>

                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors duration-300 mb-4">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                      {feature.description}
                    </CardDescription>

                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <ArrowRight className="w-5 h-5 text-purple-600" />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-32 mb-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 border border-green-200 dark:border-green-700 mb-8">
                <MessageSquare className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Success Stories</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Dreams that became reality
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                See how professionals like you discovered and aligned with their dream careers
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg flex flex-col">
                  <p className="text-slate-600 dark:text-slate-400 flex-grow">"{testimonial.quote}"</p>
                  <div className="mt-4 flex items-center">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10"></div>
          <div className="max-w-5xl mx-auto text-center relative">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-700 mb-8">
              <Rocket className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Ready to Transform?</span>
            </div>

            <h2 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white mb-8">
              Your dream career
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                is waiting for you
              </span>
            </h2>
            <p className="text-2xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              Join thousands of professionals who have discovered their true calling and transformed their careers with DreamAlign's AI-powered guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="text-xl px-16 py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-110 group relative overflow-hidden cursor-pointer w-full"
                >
                  <span className="relative z-10 flex items-center">
                    Start Dream Discovery
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="text-xl px-12 py-6 border-2 border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-105"
              >
                Learn More
              </Button>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              ✨ Free 7-day trial • No credit card required • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}

      <footer className="relative border-t border-white/20 bg-gradient-to-br from-white/60 to-slate-100/60 dark:from-slate-900/60 dark:to-slate-800/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Image src="/logo.svg" alt="Logo" width={100} height={100} />
                </div>
                <div>
                  <span className="text-2xl font-black bg-gradient-to-r from-slate-800 via-purple-600 to-blue-600 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                    DreamAlign
                  </span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Where Dreams Meet Opportunity</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md">
                Empowering professionals to discover their true calling and align their careers with their deepest aspirations through AI-powered guidance.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                  <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                  <TwitterIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                  <LinkedinIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:gap-80">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Product</h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Features</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Pricing</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">API</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Integrations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">About</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Blog</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Careers</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Contact</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4 md:mb-0">
              © 2025 DreamAlign. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-slate-600 dark:text-slate-300">
              <span className="hover:text-purple-600 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-purple-600 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-purple-600 cursor-pointer transition-colors">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}