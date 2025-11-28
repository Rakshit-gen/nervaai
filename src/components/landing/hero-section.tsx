'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Sparkles, Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 mb-8"
        >
          <Sparkles className="h-4 w-4 text-neon-cyan" />
          <span className="text-sm text-neon-cyan">AI-Powered Podcast Generation</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="text-white">Transform Content into</span>
          <br />
          <span className="gradient-text">Engaging Podcasts</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Upload any document, paste a YouTube link, or write your content.
          Our AI creates natural multi-voice conversations in minutes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/auth/signup">
            <Button variant="neon-solid" size="xl" className="group">
              <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Generate Your First Podcast
            </Button>
          </Link>
          <Link href="#demo">
            <Button variant="outline" size="xl">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </Link>
        </motion.div>

        {/* Floating preview cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative"
        >
          {/* Main preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="neon-border rounded-2xl p-1 bg-gradient-to-b from-neon-cyan/20 to-transparent">
              <div className="bg-black rounded-xl p-6 sm:p-8">
                {/* Audio visualization mockup */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center">
                    <Image 
                      src="/microphone.svg" 
                      alt="Podcast" 
                      width={32} 
                      height={32}
                      className="h-8 w-8"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">The Future of AI Technology</h3>
                    <p className="text-sm text-gray-400">Generated from article • 12:34 duration</p>
                  </div>
                  <Button variant="neon" size="icon" className="rounded-full h-12 w-12">
                    <Play className="h-5 w-5" fill="currentColor" />
                  </Button>
                </div>

                {/* Waveform visualization */}
                <div className="h-20 flex items-center justify-center space-x-1">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 8 }}
                      animate={{
                        height: [8, Math.random() * 60 + 20, 8],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: 'easeInOut',
                      }}
                      className="w-1 bg-gradient-to-t from-neon-cyan to-neon-pink rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-8 -left-8 glass rounded-xl p-4 border border-neon-cyan/30"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-sm text-white">Alex (Host)</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-8 -right-8 glass rounded-xl p-4 border border-neon-pink/30"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-neon-pink animate-pulse" />
                <span className="text-sm text-white">Sam (Guest)</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
