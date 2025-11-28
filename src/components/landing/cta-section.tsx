'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 mb-8">
            <Sparkles className="h-4 w-4 text-neon-cyan" />
            <span className="text-sm text-neon-cyan">Start Free Today</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Ready to Create Your</span>
            <br />
            <span className="gradient-text">First AI Podcast?</span>
          </h2>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are transforming their content into
            engaging podcasts with the power of AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button variant="neon-solid" size="xl" className="group">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              No credit card required • Free tier available
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
