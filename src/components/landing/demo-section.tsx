'use client'

import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="py-24 relative" id="demo">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-white">Hear the</span>{' '}
            <span className="gradient-text">Difference</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Listen to a sample podcast generated entirely by our AI from a simple article.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="neon-border rounded-2xl p-4 sm:p-8 bg-black/80">
            {/* Demo player header */}
            <div className="flex items-start justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink p-0.5 flex-shrink-0">
                  <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl">🎙️</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-xl font-semibold text-white truncate">
                    The Rise of Artificial Intelligence
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    A conversation between Alex & Sam
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-gray-500">
                    <span>12:34 duration</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Generated from article</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Waveform visualization */}
            <div className="relative mb-4 sm:mb-6">
              <div className="h-16 sm:h-24 flex items-center justify-center space-x-0.5 overflow-hidden">
                {Array.from({ length: 100 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 8 }}
                    animate={
                      isPlaying
                        ? {
                            height: [8, Math.random() * 80 + 16, 8],
                          }
                        : { height: Math.sin(i * 0.2) * 30 + 40 }
                    }
                    transition={
                      isPlaying
                        ? {
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.02,
                            ease: 'easeInOut',
                          }
                        : { duration: 0 }
                    }
                    className="w-1 bg-gradient-to-t from-neon-cyan/50 to-neon-pink/50 rounded-full"
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={isPlaying ? { width: '100%' } : { width: '30%' }}
                  transition={isPlaying ? { duration: 30, ease: 'linear' } : { duration: 0 }}
                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink"
                />
              </div>
            </div>

            {/* Player controls */}
            <div className="flex items-center justify-center space-x-6">
              <Button
                variant="neon-solid"
                size="lg"
                className="rounded-full h-12 w-12 sm:h-14 sm:w-14"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" />
                ) : (
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-1" fill="currentColor" />
                )}
              </Button>
            </div>

            {/* Transcript preview */}
            <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 italic">
                <span className="text-neon-cyan font-medium">Alex:</span> "Welcome to the show! Today we're diving into the fascinating world of artificial intelligence..."
              </p>
              <p className="text-sm text-gray-400 italic mt-2">
                <span className="text-neon-pink font-medium">Sam:</span> "Thanks for having me, Alex. AI has really transformed how we think about technology..."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
