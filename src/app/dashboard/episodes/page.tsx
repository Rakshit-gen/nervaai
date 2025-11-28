'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEpisodeStore } from '@/stores/episode-store'
import { EpisodeCard } from '@/components/dashboard/episode-card'

export default function EpisodesPage() {
  const { episodes, fetchEpisodes, isLoading, page, totalPages } = useEpisodeStore()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const status = statusFilter === 'all' ? undefined : statusFilter
    fetchEpisodes(1, status)
  }, [statusFilter, fetchEpisodes])

  const filteredEpisodes = episodes.filter(ep => 
    ep.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Episode Library</h1>
          <p className="text-gray-400 mt-1">
            Manage all your generated podcasts
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button variant="neon-solid">
            <Plus className="mr-2 h-5 w-5" />
            New Episode
          </Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Episodes grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 neon-border rounded-xl bg-black/50 animate-pulse" />
            ))}
          </div>
        ) : filteredEpisodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              {searchQuery ? 'No episodes match your search' : 'No episodes found'}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/create">
                <Button variant="neon">
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first episode
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEpisodes.map(episode => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? 'neon' : 'outline'}
              size="sm"
              onClick={() => fetchEpisodes(i + 1, statusFilter === 'all' ? undefined : statusFilter)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
