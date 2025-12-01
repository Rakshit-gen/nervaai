'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useEpisodeStore } from '@/stores/episode-store'

interface SourceStepProps {
  onNext: () => void
}

export function SourceStep({ onNext }: SourceStepProps) {
  const { wizardData, updateWizardData } = useEpisodeStore()
  const [error, setError] = useState('')

  const validateAndNext = () => {
    setError('')

    if (!wizardData.title?.trim()) {
      setError('Please enter a title for your podcast')
      return
    }

    if (!wizardData.source_content?.trim() || wizardData.source_content.length < 100) {
      setError('Please enter at least 100 characters of content')
      return
    }

    updateWizardData({ source_type: 'text' as any })
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Title input */}
      <div className="space-y-2">
        <Label htmlFor="title">Podcast Title *</Label>
        <Input
          id="title"
          placeholder="Enter your podcast episode title"
          value={wizardData.title || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateWizardData({ title: e.target.value })}
        />
      </div>

      {/* Description input */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="A brief description of your episode"
          value={wizardData.description || ''}
          onChange={(e) => updateWizardData({ description: e.target.value })}
          rows={2}
        />
      </div>

      {/* Source input */}
      <div className="space-y-2">
        <Label htmlFor="content">Your Content *</Label>
        <Textarea
          id="content"
          placeholder="Paste your article, blog post, or any text content here..."
          value={wizardData.source_content || ''}
          onChange={(e) => updateWizardData({ source_content: e.target.value })}
          rows={8}
          className="font-mono text-sm"
        />
        <p className="text-xs text-gray-500">
          {wizardData.source_content?.length || 0} characters (minimum 100)
        </p>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button variant="neon-solid" onClick={validateAndNext}>
          Next: Configure Personas
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
