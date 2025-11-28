'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  description: string
}

interface WizardProgressProps {
  steps: Step[]
  currentStep: number
}

export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isCompleted
                    ? 'bg-neon-cyan border-neon-cyan'
                    : isCurrent
                    ? 'bg-black border-neon-cyan neon-glow'
                    : 'bg-black border-white/20'
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-black" />
                ) : (
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isCurrent ? 'text-neon-cyan' : 'text-gray-500'
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Label */}
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCurrent ? 'text-white' : 'text-gray-500'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
