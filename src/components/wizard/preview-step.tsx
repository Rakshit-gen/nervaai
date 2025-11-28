'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, FileText, User, Image, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useEpisodeStore } from '@/stores/episode-store'
import { cn } from '@/lib/utils'

interface PreviewStepProps {
  onNext: () => void
  onBack: () => void
}

export function PreviewStep({ onNext, onBack }: PreviewStepProps) {
  const { wizardData, updateWizardData } = useEpisodeStore()

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-white">Review Your Podcast</h2>
        <p className="text-sm text-gray-400 mt-1">
          Confirm the details before generating your episode
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Episode details */}
        <Card className="neon-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-neon-cyan" />
              Episode Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-400 text-xs">Title</Label>
              <p className="text-white font-medium">{wizardData.title}</p>
            </div>
            
            {wizardData.description && (
              <div>
                <Label className="text-gray-400 text-xs">Description</Label>
                <p className="text-gray-300 text-sm">{wizardData.description}</p>
              </div>
            )}

            <div>
              <Label className="text-gray-400 text-xs">Source Type</Label>
              <p className="text-white capitalize">{wizardData.source_type}</p>
            </div>

            {wizardData.source_url && (
              <div>
                <Label className="text-gray-400 text-xs">Source URL</Label>
                <p className="text-neon-cyan text-sm truncate">{wizardData.source_url}</p>
              </div>
            )}

            {wizardData.source_type === 'text' && wizardData.source_content && (
              <div>
                <Label className="text-gray-400 text-xs">Content Preview</Label>
                <p className="text-gray-300 text-sm line-clamp-3">
                  {wizardData.source_content.slice(0, 200)}...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personas */}
        <Card className="neon-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2 text-neon-pink" />
              Personas ({wizardData.personas?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {wizardData.personas?.map((persona, index) => (
              <div
                key={index}
                className={cn(
                  'p-3 rounded-lg border',
                  index === 0
                    ? 'border-neon-cyan/30 bg-neon-cyan/5'
                    : 'border-neon-pink/30 bg-neon-pink/5'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{persona.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{persona.role}</p>
                  </div>
                  <Check className={cn(
                    'h-4 w-4',
                    index === 0 ? 'text-neon-cyan' : 'text-neon-pink'
                  )} />
                </div>
                {persona.personality && (
                  <p className="text-xs text-gray-500 mt-2">{persona.personality}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Options */}
      <Card className="neon-border bg-black/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Image className="h-5 w-5 mr-2 text-neon-purple" />
            Generation Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Generate Cover Art</Label>
              <p className="text-xs text-gray-500 mt-1">
                AI will create a unique cover image for your podcast
              </p>
            </div>
            <Switch
              checked={wizardData.generate_cover ?? true}
              onCheckedChange={(checked) => updateWizardData({ generate_cover: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="neon-border rounded-lg p-4 bg-gradient-to-r from-neon-cyan/10 to-neon-pink/10">
        <h3 className="font-medium text-white mb-2">What will be generated:</h3>
        <ul className="space-y-1 text-sm text-gray-300">
          <li className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-neon-cyan" />
            AI-powered podcast script with natural dialogue
          </li>
          <li className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-neon-cyan" />
            High-quality audio with {wizardData.personas?.length || 2} distinct voices
          </li>
          <li className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-neon-cyan" />
            Full transcript and metadata
          </li>
          {wizardData.generate_cover && (
            <li className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-neon-cyan" />
              AI-generated cover art
            </li>
          )}
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="neon-solid" onClick={onNext}>
          Ready to Generate
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
