'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Clock, MoreVertical, Trash2, Download, Eye, Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Episode, api } from '@/lib/api'
import { formatDuration, formatRelativeTime, getStatusColor, getStatusBgColor } from '@/lib/utils'
import { useEpisodeStore } from '@/stores/episode-store'
import { useToast } from '@/components/ui/use-toast'

interface EpisodeCardProps {
  episode: Episode
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const { deleteEpisode } = useEpisodeStore()
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const audioUrl = api.getAudioUrl(episode.id)
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
      a.download = `${episode.title.replace(/[^a-z0-9]/gi, '_')}.mp3`
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
    setIsSharing(true)
    try {
      const episodeUrl = `${window.location.origin}/dashboard/episodes/${episode.id}`
      const shareData = {
        title: episode.title,
        text: episode.description || `Check out this podcast: ${episode.title}`,
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
          const episodeUrl = `${window.location.origin}/dashboard/episodes/${episode.id}`
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
    if (confirm('Are you sure you want to delete this episode?')) {
      await deleteEpisode(episode.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="neon-border bg-black/50 hover:bg-black/80 transition-all group">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <Link href={`/dashboard/episodes/${episode.id}`}>
                <h3 className="font-semibold text-white truncate hover:text-neon-cyan transition-colors">
                  {episode.title}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                {episode.created_at && formatRelativeTime(episode.created_at)}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/episodes/${episode.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                {episode.status === 'completed' && (
                  <>
                    <DropdownMenuItem onClick={handleShare} disabled={isSharing}>
                      <Share2 className="mr-2 h-4 w-4" />
                      {isSharing ? 'Sharing...' : 'Share'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
                      <Download className="mr-2 h-4 w-4" />
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  className="text-red-400 focus:text-red-400"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status badge */}
          <div className="flex items-center space-x-2 mb-3">
            <span
              className={`px-2 py-0.5 text-xs rounded-full border ${getStatusBgColor(
                episode.status
              )} ${getStatusColor(episode.status)}`}
            >
              {episode.status}
            </span>
            {episode.source_type && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-400">
                {episode.source_type}
              </span>
            )}
          </div>

          {/* Progress for processing episodes */}
          {episode.status === 'processing' && (
            <div className="mb-3">
              <Progress value={episode.progress} className="h-1" />
              <p className="text-xs text-gray-500 mt-1">{episode.progress}% complete</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            {episode.duration_seconds ? (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(episode.duration_seconds)}
              </div>
            ) : (
              <div />
            )}

            {episode.status === 'completed' && (
              <Link href={`/dashboard/episodes/${episode.id}`}>
                <Button variant="neon" size="sm" className="h-8">
                  <Play className="h-3 w-3 mr-1" fill="currentColor" />
                  Play
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
