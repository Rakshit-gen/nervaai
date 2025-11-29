'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEpisodeStore } from '@/stores/episode-store'
import { useAuthStore } from '@/stores/auth-store'
import { EpisodeCard } from '@/components/dashboard/episode-card'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { episodes, fetchEpisodes, isLoading } = useEpisodeStore()

  useEffect(() => {
    fetchEpisodes()
  }, [fetchEpisodes])

  const stats = {
    total: episodes.length,
    completed: episodes.filter(e => e.status === 'completed').length,
    processing: episodes.filter(e => e.status === 'processing').length,
    failed: episodes.filter(e => e.status === 'failed').length,
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Ready to create something amazing?
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button variant="neon-solid" size="default" className="sm:size-lg">
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">New Episode</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <Card className="neon-border bg-black/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Episodes
            </CardTitle>
            <Image 
              src="/microphone.svg" 
              alt="Episodes" 
              width={16} 
              height={16}
              className="h-4 w-4"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="neon-border bg-black/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="neon-border bg-black/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Processing
            </CardTitle>
            <Clock className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-cyan">{stats.processing}</div>
          </CardContent>
        </Card>

        <Card className="neon-border bg-black/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Failed
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent episodes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Episodes</h2>
          <Link href="/dashboard/episodes">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              View all
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="neon-border bg-black/50 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : episodes.length === 0 ? (
          <Card className="neon-border bg-black/50">
            <CardContent className="p-12 text-center">
              <Image 
                src="/microphone.svg" 
                alt="No episodes" 
                width={48} 
                height={48}
                className="h-12 w-12 mx-auto mb-4 opacity-60"
              />
              <h3 className="text-lg font-medium text-white mb-2">
                No episodes yet
              </h3>
              <p className="text-gray-400 mb-4">
                Create your first AI-powered podcast episode
              </p>
              <Link href="/dashboard/create">
                <Button variant="neon">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Episode
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.slice(0, 6).map(episode => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
