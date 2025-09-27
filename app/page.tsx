'use client';

import { Brain, CheckCircle, Rocket, Star, Target, TrendingUp, Users, Zap } from "lucide-react";
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
      
    </div>
  )
}