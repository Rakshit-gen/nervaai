'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  Youtube,
  Link,
  Users,
  Wand2,
  Music,
  Image,
  Clock,
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Multiple Sources',
    description: 'Upload PDFs, paste text, or link to articles. We extract and process it all.',
    color: 'neon-cyan',
  },
  {
    icon: Youtube,
    title: 'YouTube Integration',
    description: 'Paste any YouTube URL and we\'ll extract the transcript automatically.',
    color: 'neon-pink',
  },
  {
    icon: Users,
    title: 'Multi-Persona Voices',
    description: 'Create engaging dialogues with multiple AI voices and personalities.',
    color: 'neon-purple',
  },
  {
    icon: Wand2,
    title: 'AI Script Generation',
    description: 'Our AI transforms dry content into natural, conversational podcast scripts.',
    color: 'neon-cyan',
  },
  {
    icon: Music,
    title: 'Natural TTS',
    description: 'State-of-the-art text-to-speech that sounds human and engaging.',
    color: 'neon-pink',
  },
  {
    icon: Image,
    title: 'Cover Art Generation',
    description: 'AI-generated podcast cover art that matches your content perfectly.',
    color: 'neon-purple',
  },
  {
    icon: Clock,
    title: 'Async Processing',
    description: 'Generate podcasts in the background while you continue working.',
    color: 'neon-cyan',
  },
  {
    icon: Link,
    title: 'Export & Share',
    description: 'Download MP3s, transcripts, and metadata. Share anywhere.',
    color: 'neon-pink',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-white">Everything You Need to</span>
            <br />
            <span className="gradient-text">Create Amazing Podcasts</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Powerful features designed to transform any content into professional-quality podcasts.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full neon-border rounded-xl p-6 bg-black/50 hover:bg-black/80 transition-all duration-300 hover:scale-105">
                <div
                  className={`w-12 h-12 rounded-lg bg-${feature.color}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
