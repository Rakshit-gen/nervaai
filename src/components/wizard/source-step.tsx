'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Youtube, Link, Type, ArrowRight, Globe } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEpisodeStore } from '@/stores/episode-store'
import { cn, isValidUrl } from '@/lib/utils'

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
]

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
    description: 'Extract from video transcript',
    available: true,
  },
  {
    id: 'pdf',
    icon: FileText,
    label: 'PDF Document',
    description: 'Upload and extract text',
    available: true,
  },
]

interface SourceStepProps {
  onNext: () => void
}

export function SourceStep({ onNext }: SourceStepProps) {
  const { wizardData, updateWizardData } = useEpisodeStore()
  const defaultType = wizardData.source_type || 'text'
  const [selectedType, setSelectedType] = useState(defaultType)
  const [error, setError] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleTypeSelect = (type: string) => {
    const sourceType = sourceTypes.find(t => t.id === type)
    if (!sourceType?.available) {
      setError(`${sourceType?.label} is currently under development. Please use Text or Web URL instead.`)
      return
    }
    setSelectedType(type as any)
    updateWizardData({ source_type: type as any, source_url: '', source_content: '' })
    setPdfFile(null)
    setError('')
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('PDF file size must be less than 10MB')
      return
    }

    setPdfFile(file)
    setIsUploading(true)
    setError('')

    try {
      const { fileToBase64 } = await import('@/lib/utils')
      const base64 = await fileToBase64(file)
      updateWizardData({ source_content: base64 })
    } catch (err) {
      setError('Failed to process PDF file')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
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

    if (selectedType === 'youtube') {
      if (!wizardData.source_url || !wizardData.source_url.includes('youtube.com') && !wizardData.source_url.includes('youtu.be')) {
        setError('Please enter a valid YouTube URL')
        return
      }
    }

    if (selectedType === 'pdf') {
      if (!wizardData.source_content || !pdfFile) {
        setError('Please upload a PDF file')
        return
      }
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

      {/* Language selection */}
      <div className="space-y-2">
        <Label htmlFor="language">
          <Globe className="inline h-4 w-4 mr-2" />
          Podcast Language
        </Label>
        <Select
          value={wizardData.language || 'en'}
          onValueChange={(value) => updateWizardData({ language: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name} ({lang.native})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Select the language for script generation and voice synthesis
        </p>
      </div>

      {/* Source type selection */}
      <div className="space-y-3">
        <Label>Content Source *</Label>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
          <>
            <Label htmlFor="youtube-url">YouTube URL *</Label>
            <Input
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={wizardData.source_url || ''}
              onChange={(e) => updateWizardData({ source_url: e.target.value })}
            />
            <p className="text-xs text-gray-500">
              Paste a YouTube video URL. We'll extract the transcript automatically.
            </p>
          </>
        )}

        {selectedType === 'pdf' && (
          <>
            <Label htmlFor="pdf-upload">PDF Document *</Label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-neon-cyan/50 transition-colors">
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfUpload}
                className="hidden"
                disabled={isUploading}
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FileText className="h-10 w-10 text-gray-400 mb-2" />
                {isUploading ? (
                  <p className="text-sm text-gray-400">Processing PDF...</p>
                ) : pdfFile ? (
                  <>
                    <p className="text-sm font-medium text-white mb-1">{pdfFile.name}</p>
                    <p className="text-xs text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-white mb-1">Click to upload PDF</p>
                    <p className="text-xs text-gray-500">Maximum file size: 10MB</p>
                  </>
                )}
              </label>
            </div>
          </>
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
