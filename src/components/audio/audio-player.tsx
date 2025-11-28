'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import WaveSurfer from 'wavesurfer.js'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent } from '@/components/ui/card'
import { formatDuration } from '@/lib/utils'
import { api } from '@/lib/api'

interface AudioPlayerProps {
  audioUrl: string
  title: string
  coverUrl?: string
}

export function AudioPlayer({ audioUrl, title, coverUrl }: AudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(0, 255, 255, 0.3)',
      progressColor: 'rgba(0, 255, 255, 0.8)',
      cursorColor: '#ff00ff',
      cursorWidth: 2,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      height: 80,
      normalize: true,
      backend: 'WebAudio',
    })

    // Fetch audio with auth headers, then load into WaveSurfer
    const loadAudio = async () => {
      try {
        const headers = api.getHeaders()
        // Remove Content-Type for binary audio
        const audioHeaders: Record<string, string> = {}
        if (headers && typeof headers === 'object' && !Array.isArray(headers) && !(headers instanceof Headers)) {
          const headerObj = headers as Record<string, string>
          if (headerObj['X-User-ID']) audioHeaders['X-User-ID'] = headerObj['X-User-ID']
          if (headerObj['Authorization']) audioHeaders['Authorization'] = headerObj['Authorization']
        }

        const response = await fetch(audioUrl, {
          headers: audioHeaders,
        })

        if (!response.ok) {
          throw new Error(`Failed to load audio: ${response.status} ${response.statusText}`)
        }

        const blob = await response.blob()
        objectUrlRef.current = URL.createObjectURL(blob)
        wavesurfer.load(objectUrlRef.current)
      } catch (error) {
        console.error('Error loading audio:', error)
      }
    }

    loadAudio()

    wavesurfer.on('ready', () => {
      setDuration(wavesurfer.getDuration())
      setIsReady(true)
      wavesurfer.setVolume(volume)
    })

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime())
    })

    wavesurfer.on('play', () => setIsPlaying(true))
    wavesurfer.on('pause', () => setIsPlaying(false))
    wavesurfer.on('finish', () => setIsPlaying(false))

    wavesurferRef.current = wavesurfer

    return () => {
      wavesurfer.destroy()
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [audioUrl])

  const togglePlay = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause()
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (wavesurferRef.current) {
      if (isMuted) {
        wavesurferRef.current.setVolume(volume)
      } else {
        wavesurferRef.current.setVolume(0)
      }
      setIsMuted(!isMuted)
    }
  }, [isMuted, volume])

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(newVolume)
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }, [isMuted])

  const skip = useCallback((seconds: number) => {
    if (wavesurferRef.current) {
      const newTime = Math.max(0, Math.min(currentTime + seconds, duration))
      wavesurferRef.current.seekTo(newTime / duration)
    }
  }, [currentTime, duration])

  return (
    <Card className="neon-border bg-black/80 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          {/* Cover art */}
          {coverUrl && (
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-neon-cyan to-neon-pink p-0.5">
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-lg font-semibold text-white truncate mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {isReady ? formatDuration(duration) : 'Loading...'}
            </p>

            {/* Waveform */}
            <div
              ref={containerRef}
              className="waveform-container mb-4 cursor-pointer"
            />

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Skip backward */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skip(-10)}
                  disabled={!isReady}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                {/* Play/Pause */}
                <Button
                  variant="neon-solid"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={togglePlay}
                  disabled={!isReady}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" fill="currentColor" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                  )}
                </Button>

                {/* Skip forward */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skip(10)}
                  disabled={!isReady}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* Time */}
              <div className="text-sm text-gray-400">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </div>

              {/* Volume */}
              <div className="flex items-center space-x-2 w-32">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
