'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  Clock,
  Calendar,
  FileText,
  Users,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEpisodeStore } from '@/stores/episode-store'
import { useToast } from '@/components/ui/use-toast'
import { AudioPlayer } from '@/components/audio/audio-player'
import { api } from '@/lib/api'
import { formatDuration, formatDate, getStatusColor, getStatusBgColor } from '@/lib/utils'

export default function EpisodeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const episodeId = params.id as string

  const { currentEpisode, fetchEpisode, pollEpisodeStatus, deleteEpisode, isLoading, error } = useEpisodeStore()
  const [transcript, setTranscript] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    if (episodeId) {
      setFetchError(null)
      fetchEpisode(episodeId).catch((error) => {
        console.error('Failed to fetch episode:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to load episode. Please try again later.'
        setFetchError(errorMessage)
        toast({
          title: 'Failed to load episode',
          description: errorMessage,
          variant: 'destructive',
        })
      })
    }
  }, [episodeId, fetchEpisode, toast])

  // Poll for status if processing
  useEffect(() => {
    if (!currentEpisode) return
    if (currentEpisode.status !== 'processing' && currentEpisode.status !== 'pending') return

    setIsPolling(true)
    const interval = setInterval(async () => {
      try {
        const status = await pollEpisodeStatus(currentEpisode.id)
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval)
          setIsPolling(false)
          fetchEpisode(episodeId)
        }
      } catch (error) {
        console.error('Poll error:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [currentEpisode?.status, currentEpisode?.id, pollEpisodeStatus, fetchEpisode, episodeId])

  // Fetch transcript when completed
  useEffect(() => {
    if (currentEpisode?.status === 'completed') {
      api.getTranscript(currentEpisode.id)
        .then(data => setTranscript(data.script || data.transcript || null))
        .catch(console.error)
    }
  }, [currentEpisode?.status, currentEpisode?.id])

  // Stop audio when navigating away or episode changes
  useEffect(() => {
    return () => {
      // Stop any playing audio when component unmounts or episode changes
      // This ensures audio stops when navigating away
      const audioElements = document.querySelectorAll('audio')
      audioElements.forEach(audio => {
        audio.pause()
        audio.currentTime = 0
      })
      
      // Also stop any Web Audio API contexts that might be playing
      if (window.AudioContext || (window as any).webkitAudioContext) {
        // WaveSurfer uses Web Audio API, but it's cleaned up in the component
        // This is just an extra safety measure
      }
    }
  }, [episodeId])

  const handleDownload = async () => {
    if (!currentEpisode) return
    
    setIsDownloading(true)
    try {
      const audioUrl = api.getAudioUrl(currentEpisode.id)
      const headers = api.getHeaders()
      
      // Convert headers to Record<string, string> for fetch
      const fetchHeaders: Record<string, string> = {}
      if (headers && typeof headers === 'object' && !Array.isArray(headers) && !(headers instanceof Headers)) {
        const headerObj = headers as Record<string, string>
        if (headerObj['X-User-ID']) fetchHeaders['X-User-ID'] = headerObj['X-User-ID']
        if (headerObj['Authorization']) fetchHeaders['Authorization'] = headerObj['Authorization']
      }
      
      const response = await fetch(audioUrl, {
        headers: fetchHeaders,
      })
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`)
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentEpisode.title.replace(/[^a-z0-9]/gi, '_')}.mp3`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: 'Download started',
        description: 'Your podcast is downloading.',
        variant: 'success',
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: 'Download failed',
        description: (error as Error).message || 'Failed to download podcast',
        variant: 'destructive',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    if (!currentEpisode) return
    
    setIsSharing(true)
    try {
      const episodeUrl = `${window.location.origin}/dashboard/episodes/${currentEpisode.id}`
      const shareData = {
        title: currentEpisode.title,
        text: currentEpisode.description || `Check out this podcast: ${currentEpisode.title}`,
        url: episodeUrl,
      }
      
      // Try Web Share API first (mobile and modern browsers)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast({
          title: 'Shared successfully',
          description: 'Episode shared!',
          variant: 'success',
        })
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(episodeUrl)
        toast({
          title: 'Link copied!',
          description: 'Episode link copied to clipboard.',
          variant: 'success',
        })
      }
    } catch (error) {
      // User cancelled share or clipboard failed
      if ((error as Error).name !== 'AbortError') {
        console.error('Share error:', error)
        // Try fallback to clipboard if Web Share API failed
        try {
          const episodeUrl = `${window.location.origin}/dashboard/episodes/${currentEpisode.id}`
          await navigator.clipboard.writeText(episodeUrl)
          toast({
            title: 'Link copied!',
            description: 'Episode link copied to clipboard.',
            variant: 'success',
          })
        } catch (clipboardError) {
          toast({
            title: 'Share failed',
            description: 'Unable to share. Please copy the link manually.',
            variant: 'destructive',
          })
        }
      }
    } finally {
      setIsSharing(false)
    }
  }

  const handleDelete = async () => {
    if (!currentEpisode) return
    if (!confirm('Are you sure you want to delete this episode?')) return

    try {
      await deleteEpisode(currentEpisode.id)
      toast({
        title: 'Episode deleted',
        variant: 'success',
      })
      router.push('/dashboard/episodes')
    } catch (error) {
      toast({
        title: 'Failed to delete episode',
        description: (error as Error).message,
        variant: 'destructive',
      })
    }
  }

  if (isLoading && !currentEpisode && !fetchError) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-neon-cyan" />
      </div>
    )
  }

  if (fetchError || (error && !currentEpisode)) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/episodes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <Card className="neon-border bg-black/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-red-400">{fetchError || error || 'Failed to load episode'}</p>
              <Button
                variant="neon"
                onClick={() => {
                  if (episodeId) {
                    setFetchError(null)
                    fetchEpisode(episodeId).catch((err) => {
                      setFetchError(err instanceof Error ? err.message : 'Failed to load episode')
                    })
                  }
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentEpisode) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-neon-cyan" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/episodes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{currentEpisode.title}</h1>
            <div className="flex items-center space-x-3 mt-1">
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${getStatusBgColor(
                  currentEpisode.status
                )} ${getStatusColor(currentEpisode.status)}`}
              >
                {currentEpisode.status}
              </span>
              {currentEpisode.created_at && (
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(currentEpisode.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentEpisode.status === 'completed' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
                disabled={isSharing}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {isSharing ? 'Sharing...' : 'Share'}
              </Button>
              <Button 
                variant="neon" 
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="text-red-400" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Processing status */}
      {(currentEpisode.status === 'processing' || currentEpisode.status === 'pending') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="neon-border bg-black/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-5 w-5 text-neon-cyan animate-spin" />
                  <div>
                    <p className="font-medium text-white">
                      {currentEpisode.status === 'pending' ? 'Queued for processing' : 'Generating your podcast'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {currentEpisode.status_message || 'Please wait...'}
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-neon-cyan">
                  {currentEpisode.progress}%
                </span>
              </div>
              <Progress value={currentEpisode.progress} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error state */}
      {currentEpisode.status === 'failed' && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-6">
            <p className="text-red-400 font-medium">Generation Failed</p>
            <p className="text-sm text-gray-400 mt-1">
              {currentEpisode.error_message || 'An error occurred during generation.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Audio player for completed episodes */}
      {currentEpisode.status === 'completed' && currentEpisode.audio_url && (
        <AudioPlayer
          audioUrl={api.getAudioUrl(currentEpisode.id)}
          title={currentEpisode.title}
          coverUrl={currentEpisode.cover_url ? api.getCoverUrl(currentEpisode.id) : undefined}
        />
      )}

      {/* Details tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="transcript" disabled={!transcript}>
            Transcript
          </TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="neon-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-lg">Episode Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentEpisode.description && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-gray-300">{currentEpisode.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Source Type</p>
                    <p className="text-white capitalize">{currentEpisode.source_type}</p>
                  </div>
                  {currentEpisode.duration_seconds && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="text-white flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-neon-cyan" />
                        {formatDuration(currentEpisode.duration_seconds)}
                      </p>
                    </div>
                  )}
                  {currentEpisode.word_count && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Word Count</p>
                      <p className="text-white">{currentEpisode.word_count.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {currentEpisode.cover_url && currentEpisode.status === 'completed' && (
              <Card className="neon-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-lg">Cover Art</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={api.getCoverUrl(currentEpisode.id)}
                    alt="Episode cover"
                    className="w-full rounded-lg"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="transcript" className="mt-4">
          <Card className="neon-border bg-black/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-neon-cyan" />
                Transcript
              </CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">
                  {transcript}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personas" className="mt-4">
          <Card className="neon-border bg-black/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-neon-pink" />
                Personas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEpisode.personas?.map((persona, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-white/10 bg-white/5"
                  >
                    <p className="font-medium text-white">{persona.name}</p>
                    <p className="text-sm text-gray-400 capitalize">{persona.role}</p>
                    {persona.personality && (
                      <p className="text-xs text-gray-500 mt-2">{persona.personality}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
