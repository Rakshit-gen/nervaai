const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface Persona {
  name: string
  role: string
  gender?: string
  voice_id?: string
  personality?: string
}

export interface EpisodeCreateRequest {
  title: string
  description?: string
  source_type: 'pdf' | 'text' | 'youtube' | 'url'
  source_url?: string
  source_content?: string
  personas: Persona[]
  generate_cover?: boolean
}

export interface Episode {
  id: string
  user_id: string
  title: string
  description?: string
  source_type?: string
  source_url?: string
  personas: Persona[]
  audio_url?: string
  cover_url?: string
  duration_seconds?: number
  word_count?: number
  job_id?: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  progress: number
  status_message?: string
  error_message?: string
  created_at?: string
  updated_at?: string
  completed_at?: string
}

export interface JobStatus {
  job_id: string
  episode_id?: string
  status: string
  progress: number
  message?: string
  result?: Record<string, unknown>
  error?: string
}

export interface EpisodeListResponse {
  episodes: Episode[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface ExportResponse {
  episode_id: string
  audio_url?: string
  transcript_url?: string
  metadata: Record<string, unknown>
}

export interface TranscriptResponse {
  episode_id: string
  title: string
  script?: string
  transcript?: string
  word_count?: number
}

class ApiClient {
  private baseUrl: string
  private userId: string | null = null
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setAuth(userId: string, token: string) {
    this.userId = userId
    this.token = token
  }

  clearAuth() {
    this.userId = null
    this.token = null
  }

  getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.userId) {
      headers['X-User-ID'] = this.userId
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: `HTTP ${response.status}: ${response.statusText}` }))
        throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`)
      }

      if (response.status === 204) {
        return null as T
      }

      return response.json()
    } catch (error) {
      // Handle network errors, timeouts, etc.
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach the server. Please check your connection.')
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout: The server took too long to respond.')
      }
      throw error
    }
  }

  // Episodes
  async createEpisode(data: EpisodeCreateRequest): Promise<Episode> {
    return this.request<Episode>('/episodes/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getEpisodes(
    page: number = 1,
    perPage: number = 20,
    status?: string
  ): Promise<EpisodeListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    if (status) {
      params.append('status', status)
    }
    return this.request<EpisodeListResponse>(`/episodes/?${params}`)
  }

  async getEpisode(episodeId: string): Promise<Episode> {
    return this.request<Episode>(`/episodes/${episodeId}`)
  }

  async getEpisodeStatus(episodeId: string): Promise<JobStatus> {
    return this.request<JobStatus>(`/episodes/${episodeId}/status`)
  }

  async deleteEpisode(episodeId: string): Promise<void> {
    return this.request<void>(`/episodes/${episodeId}`, {
      method: 'DELETE',
    })
  }

  // Jobs
  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.request<JobStatus>(`/jobs/${jobId}`)
  }

  // Export
  async getExportUrls(episodeId: string): Promise<ExportResponse> {
    return this.request<ExportResponse>(`/export/${episodeId}`)
  }

  async getTranscript(episodeId: string): Promise<TranscriptResponse> {
    return this.request<TranscriptResponse>(`/export/${episodeId}/transcript`)
  }

  getAudioUrl(episodeId: string): string {
    return `${this.baseUrl}/export/${episodeId}/audio`
  }

  getCoverUrl(episodeId: string): string {
    return `${this.baseUrl}/export/${episodeId}/cover`
  }

  // Health
  async healthCheck(): Promise<{ status: string; version: string }> {
    return this.request<{ status: string; version: string }>('/health')
  }
}

export const api = new ApiClient(API_URL)
