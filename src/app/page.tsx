'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { DemoSection } from '@/components/landing/demo-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/layout/footer'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  )
}
