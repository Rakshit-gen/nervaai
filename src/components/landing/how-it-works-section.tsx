'use client'

import { motion } from 'framer-motion'
import { Upload, Users, Wand2, Download } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Content',
    description: 'Choose your source: PDF documents, web URLs, YouTube videos, or paste raw text.',
    color: 'neon-cyan',
  },
  {
    number: '02',
    icon: Users,
    title: 'Customize Personas',
    description: 'Select or create AI personas with unique voices and personalities for your podcast.',
    color: 'neon-pink',
  },
  {
    number: '03',
    icon: Wand2,
    title: 'AI Generates Script',
    description: 'Our AI transforms your content into an engaging, conversational podcast script.',
    color: 'neon-purple',
  },
  {
    number: '04',
    icon: Download,
    title: 'Download & Share',
    description: 'Get your podcast as MP3 with transcript and cover art. Share it anywhere.',
    color: 'neon-green',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            <span className="text-white">How It</span>{' '}
            <span className="gradient-text">Works</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            From content to podcast in four simple steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple hidden lg:block" />

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Step card */}
                <div className="neon-border rounded-xl p-6 bg-black/80 h-full relative z-10">
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-black border-2 border-neon-cyan flex items-center justify-center">
                    <span className="text-xs font-bold text-neon-cyan">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-${step.color}/20 flex items-center justify-center mb-4 mt-4`}
                  >
                    <step.icon className={`h-7 w-7 text-${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>

                {/* Arrow (for desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-8 h-8 rounded-full bg-black border-2 border-white/20 flex items-center justify-center">
                      <span className="text-white/50">→</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
