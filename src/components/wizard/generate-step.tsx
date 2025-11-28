'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Sparkles, Rocket } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface GenerateStepProps {
  onBack: () => void
  onGenerate: () => void
  isGenerating: boolean
}

export function GenerateStep({ onBack, onGenerate, isGenerating }: GenerateStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink p-0.5">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              {isGenerating ? (
                <Loader2 className="h-10 w-10 text-neon-cyan animate-spin" />
              ) : (
                <Rocket className="h-10 w-10 text-neon-cyan" />
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-neon-cyan/30"
          />
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {isGenerating ? 'Creating Your Podcast...' : 'Ready to Generate!'}
      </h2>
      
      <p className="text-gray-400 max-w-md mx-auto mb-8">
        {isGenerating
          ? 'Our AI is hard at work crafting your podcast. This may take a few minutes.'
          : 'Click the button below to start the AI podcast generation process.'}
      </p>

      {isGenerating ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-neon-cyan">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-sm">Extracting content...</span>
          </div>
          <p className="text-xs text-gray-500">
            You can close this page. We'll notify you when it's ready.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            variant="neon-solid"
            size="xl"
            onClick={onGenerate}
            className="min-w-[200px]"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Podcast
          </Button>
          
          <div>
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      )}

      {/* Fun facts while waiting */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-12 max-w-md mx-auto"
        >
          <div className="neon-border rounded-lg p-4 bg-black/50">
            <p className="text-sm text-gray-400">
              <span className="text-neon-cyan font-medium">Did you know?</span> Our AI analyzes
              your content to create natural-sounding conversations between multiple speakers,
              complete with personality and emotion.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
