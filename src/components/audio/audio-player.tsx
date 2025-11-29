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
      // Stop and pause audio before destroying
      try {
        if (wavesurfer.isPlaying()) {
          wavesurfer.pause()
        }
        wavesurfer.stop()
      } catch (error) {
        console.error('Error stopping audio:', error)
      }
      
      // Destroy wavesurfer instance
      try {
        wavesurfer.destroy()
      } catch (error) {
        console.error('Error destroying wavesurfer:', error)
      }
      
      // Clean up object URL
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      
      wavesurferRef.current = null
    }
  }, [audioUrl])

  // Stop audio when component unmounts or page is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (wavesurferRef.current) {
        try {
          if (wavesurferRef.current.isPlaying()) {
            wavesurferRef.current.pause()
          }
          wavesurferRef.current.stop()
        } catch (error) {
          console.error('Error stopping audio on page unload:', error)
        }
      }
    }

    // Stop audio when page is about to unload
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Also stop on visibility change (tab switch, etc.)
    const handleVisibilityChange = () => {
      if (document.hidden && wavesurferRef.current) {
        try {
          if (wavesurferRef.current.isPlaying()) {
            wavesurferRef.current.pause()
          }
        } catch (error) {
          console.error('Error pausing audio on visibility change:', error)
        }
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      // Final cleanup - ensure audio is stopped
      if (wavesurferRef.current) {
        try {
          if (wavesurferRef.current.isPlaying()) {
            wavesurferRef.current.pause()
          }
          wavesurferRef.current.stop()
        } catch (error) {
          console.error('Error stopping audio on cleanup:', error)
        }
      }
    }
  }, [])

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
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Cover art */}
          {coverUrl && (
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gradient-to-br from-neon-cyan to-neon-pink p-0.5">
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0 w-full">
            {/* Title */}
            <h3 className="text-base sm:text-lg font-semibold text-white truncate mb-1">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
              {isReady ? formatDuration(duration) : 'Loading...'}
            </p>

            {/* Waveform */}
            <div
              ref={containerRef}
              className="waveform-container mb-3 sm:mb-4 cursor-pointer"
            />

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
              {/* Playback controls */}
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                {/* Skip backward */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skip(-10)}
                  disabled={!isReady}
                  className="h-9 w-9 sm:h-10 sm:w-10"
                >
                  <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                {/* Play/Pause */}
                <Button
                  variant="neon-solid"
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                  onClick={togglePlay}
                  disabled={!isReady}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" fill="currentColor" />
                  )}
                </Button>

                {/* Skip forward */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skip(10)}
                  disabled={!isReady}
                  className="h-9 w-9 sm:h-10 sm:w-10"
                >
                  <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              {/* Time - show on all screens */}
              <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </div>

              {/* Volume - hide on very small screens, show on larger */}
              <div className="hidden md:flex items-center space-x-2 w-32">
                <Button variant="ghost" size="icon" onClick={toggleMute} className="h-9 w-9">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                />
              </div>
              
              {/* Mobile volume button */}
              <div className="md:hidden flex items-center justify-center">
                <Button variant="ghost" size="icon" onClick={toggleMute} className="h-9 w-9">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
