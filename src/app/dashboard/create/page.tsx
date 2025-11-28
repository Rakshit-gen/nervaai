'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useEpisodeStore } from '@/stores/episode-store'
import { useToast } from '@/components/ui/use-toast'
import { SourceStep } from '@/components/wizard/source-step'
import { PersonaStep } from '@/components/wizard/persona-step'
import { PreviewStep } from '@/components/wizard/preview-step'
import { GenerateStep } from '@/components/wizard/generate-step'
import { WizardProgress } from '@/components/wizard/wizard-progress'

const steps = [
  { id: 0, title: 'Content Source', description: 'Choose your content' },
  { id: 1, title: 'Personas', description: 'Configure speakers' },
  { id: 2, title: 'Preview', description: 'Review your podcast' },
  { id: 3, title: 'Generate', description: 'Create your episode' },
]

export default function CreateEpisodePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { wizardStep, setWizardStep, wizardData, createEpisode, resetWizard } = useEpisodeStore()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleNext = () => {
    if (wizardStep < steps.length - 1) {
      setWizardStep(wizardStep + 1)
    }
  }

  const handleBack = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1)
    }
  }

  const handleGenerate = async () => {
    if (!wizardData.title || !wizardData.source_type) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)

    try {
      const episode = await createEpisode({
        title: wizardData.title!,
        description: wizardData.description,
        source_type: wizardData.source_type!,
        source_url: wizardData.source_url,
        source_content: wizardData.source_content,
        personas: wizardData.personas || [],
        generate_cover: wizardData.generate_cover ?? true,
      })

      toast({
        title: 'Episode created!',
        description: 'Your podcast is being generated.',
        variant: 'success',
      })

      resetWizard()
      router.push(`/dashboard/episodes/${episode.id}`)
    } catch (error) {
      toast({
        title: 'Failed to create episode',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Create New Episode</h1>
        <p className="text-gray-400">
          Transform your content into an engaging AI podcast
        </p>
      </motion.div>

      {/* Progress indicator */}
      <WizardProgress steps={steps} currentStep={wizardStep} />

      {/* Step content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8"
      >
        <AnimatePresence mode="wait">
          {wizardStep === 0 && (
            <SourceStep key="source" onNext={handleNext} />
          )}
          {wizardStep === 1 && (
            <PersonaStep key="persona" onNext={handleNext} onBack={handleBack} />
          )}
          {wizardStep === 2 && (
            <PreviewStep key="preview" onNext={handleNext} onBack={handleBack} />
          )}
          {wizardStep === 3 && (
            <GenerateStep
              key="generate"
              onBack={handleBack}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
