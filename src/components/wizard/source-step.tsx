'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Youtube, Link, Type, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useEpisodeStore } from '@/stores/episode-store'
import { cn, isValidUrl } from '@/lib/utils'

const sourceTypes = [
  {
    id: 'text',
    icon: Type,
    label: 'Raw Text',
    description: 'Paste your content directly',
    available: true,
  },
  {
    id: 'url',
    icon: Link,
    label: 'Web URL',
    description: 'Extract from any webpage',
    available: true,
  },
  {
    id: 'youtube',
    icon: Youtube,
    label: 'YouTube',
    description: 'Under Development',
    available: false,
  },
  {
    id: 'pdf',
    icon: FileText,
    label: 'PDF Document',
    description: 'Under Development',
    available: false,
  },
]

interface SourceStepProps {
  onNext: () => void
}

export function SourceStep({ onNext }: SourceStepProps) {
  const { wizardData, updateWizardData } = useEpisodeStore()
  // Ensure default is an available type (not youtube or pdf)
  const defaultType = wizardData.source_type && ['text', 'url'].includes(wizardData.source_type) 
    ? wizardData.source_type 
    : 'text'
  const [selectedType, setSelectedType] = useState(defaultType)
  const [error, setError] = useState('')

  const handleTypeSelect = (type: string) => {
    const sourceType = sourceTypes.find(t => t.id === type)
    if (!sourceType?.available) {
      setError(`${sourceType?.label} is currently under development. Please use Text or Web URL instead.`)
      return
    }
    setSelectedType(type as any)
    updateWizardData({ source_type: type as any, source_url: '', source_content: '' })
    setError('')
  }

  const validateAndNext = () => {
    setError('')

    if (!wizardData.title?.trim()) {
      setError('Please enter a title for your podcast')
      return
    }

    if (selectedType === 'url') {
      if (!wizardData.source_url || !isValidUrl(wizardData.source_url)) {
        setError('Please enter a valid URL')
        return
      }
    }

    // Block YouTube and PDF (under development)
    if (selectedType === 'youtube' || selectedType === 'pdf') {
      setError('This feature is currently under development. Please use Text or Web URL instead.')
      return
    }

    if (selectedType === 'text') {
      if (!wizardData.source_content?.trim() || wizardData.source_content.length < 100) {
        setError('Please enter at least 100 characters of content')
        return
      }
    }

    updateWizardData({ source_type: selectedType as any })
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
          onChange={(e) => updateWizardData({ title: e.target.value })}
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

      {/* Source type selection */}
      <div className="space-y-3">
        <Label>Content Source *</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sourceTypes.map((type) => (
            <Card
              key={type.id}
              className={cn(
                'transition-all',
                type.available
                  ? 'cursor-pointer hover:scale-105'
                  : 'cursor-not-allowed opacity-60',
                selectedType === type.id && type.available
                  ? 'neon-border bg-neon-cyan/10'
                  : 'border-white/10 bg-black/50',
                type.available && 'hover:border-white/20'
              )}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardContent className="p-4 text-center relative">
                {!type.available && (
                  <span className="absolute top-2 right-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                    Coming Soon
                  </span>
                )}
                <type.icon
                  className={cn(
                    'h-8 w-8 mx-auto mb-2',
                    selectedType === type.id && type.available
                      ? 'text-neon-cyan'
                      : type.available
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  )}
                />
                <p
                  className={cn(
                    'font-medium text-sm',
                    selectedType === type.id && type.available
                      ? 'text-white'
                      : type.available
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  )}
                >
                  {type.label}
                </p>
                <p className={cn(
                  'text-xs mt-1',
                  type.available ? 'text-gray-500' : 'text-yellow-500/70'
                )}>
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Source input based on type */}
      <div className="space-y-2">
        {selectedType === 'text' && (
          <>
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
          </>
        )}

        {selectedType === 'url' && (
          <>
            <Label htmlFor="url">Website URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/article"
              value={wizardData.source_url || ''}
              onChange={(e) => updateWizardData({ source_url: e.target.value })}
            />
          </>
        )}

        {selectedType === 'youtube' && (
          <div className="neon-border rounded-lg p-6 text-center bg-black/50 border-yellow-500/30">
            <Youtube className="h-12 w-12 mx-auto text-yellow-500/70 mb-3" />
            <p className="text-lg font-medium text-yellow-400 mb-2">Under Development</p>
            <p className="text-sm text-gray-400">
              YouTube transcript extraction is currently being improved. Please use Text or Web URL for now.
            </p>
          </div>
        )}

        {selectedType === 'pdf' && (
          <div className="neon-border rounded-lg p-6 text-center bg-black/50 border-yellow-500/30">
            <FileText className="h-12 w-12 mx-auto text-yellow-500/70 mb-3" />
            <p className="text-lg font-medium text-yellow-400 mb-2">Under Development</p>
            <p className="text-sm text-gray-400">
              PDF extraction is currently being improved. Please use Text or Web URL for now.
            </p>
          </div>
        )}
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
