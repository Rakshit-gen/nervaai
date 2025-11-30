'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Plus, Trash2, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEpisodeStore } from '@/stores/episode-store'
import { Persona } from '@/lib/api'
import { cn } from '@/lib/utils'

const archetypes = [
  { 
    id: 'curious', 
    label: 'Curious Explorer', 
    description: 'Asks thoughtful questions and seeks deeper understanding. Speaks with genuine interest and uses phrases like "That\'s fascinating!" and "Can you tell me more about that?" Uses a warm, engaging tone.' 
  },
  { 
    id: 'expert', 
    label: 'Subject Expert', 
    description: 'Provides deep insights and knowledge with confidence. Speaks clearly and uses professional terminology when appropriate, but makes complex topics accessible. Uses phrases like "Based on my research..." and "What\'s interesting is..."' 
  },
  { 
    id: 'storyteller', 
    label: 'Storyteller', 
    description: 'Weaves narratives and examples into the conversation. Speaks with vivid descriptions and uses phrases like "Let me share a story..." and "Imagine this scenario..." Uses expressive language and varied pacing.' 
  },
  { 
    id: 'skeptic', 
    label: 'Thoughtful Skeptic', 
    description: 'Challenges assumptions constructively and asks probing questions. Speaks with measured skepticism and uses phrases like "But wait, what about..." and "I\'m not sure I agree because..." Uses logical reasoning and respectful disagreement.' 
  },
  { 
    id: 'enthusiast', 
    label: 'Enthusiast', 
    description: 'Brings energy and excitement to the conversation. Speaks with high energy and uses phrases like "This is amazing!" and "I love this!" Uses upbeat tone and frequent positive affirmations.' 
  },
  { 
    id: 'analyst', 
    label: 'Analyst', 
    description: 'Breaks down complex topics systematically. Speaks methodically and uses phrases like "Let\'s break this down..." and "The key factors are..." Uses structured explanations and clear transitions.' 
  },
]

const roles = ['host', 'guest', 'narrator']
const genders = ['male', 'female', 'neutral']

interface PersonaStepProps {
  onNext: () => void
  onBack: () => void
}

export function PersonaStep({ onNext, onBack }: PersonaStepProps) {
  const { wizardData, updateWizardData } = useEpisodeStore()
  const [personas, setPersonas] = useState<Persona[]>(
    wizardData.personas || [
      { name: 'Alex', role: 'host', gender: 'male', personality: 'Friendly and curious, speaks with enthusiasm and asks thoughtful questions. Uses casual language and occasional humor.' },
      { name: 'Sam', role: 'guest', gender: 'female', personality: 'Expert and insightful, provides deep analysis with clear explanations. Speaks confidently and uses professional yet accessible language.' },
    ]
  )
  const [error, setError] = useState('')

  const addPersona = () => {
    if (personas.length >= 4) {
      setError('Maximum 4 personas allowed')
      return
    }
    setPersonas([
      ...personas,
      { name: '', role: 'guest', gender: 'male', personality: '' },
    ])
    setError('')
  }

  const removePersona = (index: number) => {
    if (personas.length <= 1) {
      setError('At least one persona is required')
      return
    }
    setPersonas(personas.filter((_, i) => i !== index))
    setError('')
  }

  const updatePersona = (index: number, field: keyof Persona, value: string) => {
    const updated = [...personas]
    updated[index] = { ...updated[index], [field]: value }
    setPersonas(updated)
    setError('')
  }

  const applyArchetype = (index: number, archetypeId: string) => {
    const archetype = archetypes.find(a => a.id === archetypeId)
    if (archetype) {
      updatePersona(index, 'personality', archetype.description)
    }
  }

  const validateAndNext = () => {
    setError('')

    for (let i = 0; i < personas.length; i++) {
      if (!personas[i].name?.trim()) {
        setError(`Please enter a name for persona ${i + 1}`)
        return
      }
    }

    updateWizardData({ personas })
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Configure Personas</h2>
          <p className="text-sm text-gray-400 mt-1">
            Define the speakers for your podcast conversation
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addPersona}
          disabled={personas.length >= 4}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Persona
        </Button>
      </div>

      {/* Personas list */}
      <div className="space-y-4">
        {personas.map((persona, index) => (
          <Card key={index} className="neon-border bg-black/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    index === 0 ? 'bg-neon-cyan/20' : 'bg-neon-pink/20'
                  )}>
                    <User className={cn(
                      'h-5 w-5',
                      index === 0 ? 'text-neon-cyan' : 'text-neon-pink'
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      Persona {index + 1}
                    </p>
                    <p className="text-xs text-gray-500">
                      {persona.role || 'guest'}
                    </p>
                  </div>
                </div>
                {personas.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-400"
                    onClick={() => removePersona(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    placeholder="e.g., Alex"
                    value={persona.name}
                    onChange={(e) => updatePersona(index, 'name', e.target.value)}
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={persona.role}
                    onValueChange={(value) => updatePersona(index, 'role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>Voice Gender</Label>
                  <Select
                    value={persona.gender || 'male'}
                    onValueChange={(value) => updatePersona(index, 'gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map(gender => (
                        <SelectItem key={gender} value={gender}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Archetype quick select */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Quick Archetype</Label>
                  <div className="flex flex-wrap gap-2">
                    {archetypes.map(arch => (
                      <Button
                        key={arch.id}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => applyArchetype(index, arch.id)}
                      >
                        {arch.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Personality */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Personality & Speaking Style</Label>
                  <Textarea
                    placeholder="Describe personality traits, speaking style, tone, and typical phrases. Example: Friendly and curious, speaks with enthusiasm and asks thoughtful questions. Uses casual language and occasional humor. Often says things like 'That's interesting!' and 'Tell me more about that.'"
                    value={persona.personality || ''}
                    onChange={(e) => updatePersona(index, 'personality', e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    Be specific! Include speaking patterns, tone, and example phrases to make characters more distinct.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="neon-solid" onClick={validateAndNext}>
          Next: Preview
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
