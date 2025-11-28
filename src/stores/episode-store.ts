import { create } from 'zustand'
import { api, Episode, EpisodeCreateRequest, Persona, JobStatus } from '@/lib/api'

interface EpisodeState {
  episodes: Episode[]
  currentEpisode: Episode | null
  isLoading: boolean
  error: string | null
  
  // Pagination
  page: number
  totalPages: number
  total: number
  
  // Wizard state
  wizardStep: number
  wizardData: Partial<EpisodeCreateRequest>
  
  // Actions
  fetchEpisodes: (page?: number, status?: string) => Promise<void>
  fetchEpisode: (id: string) => Promise<Episode>
  createEpisode: (data: EpisodeCreateRequest) => Promise<Episode>
  deleteEpisode: (id: string) => Promise<void>
  pollEpisodeStatus: (id: string) => Promise<JobStatus>
  
  // Wizard actions
  setWizardStep: (step: number) => void
  updateWizardData: (data: Partial<EpisodeCreateRequest>) => void
  resetWizard: () => void
  
  setCurrentEpisode: (episode: Episode | null) => void
  setError: (error: string | null) => void
}

const initialWizardData: Partial<EpisodeCreateRequest> = {
  title: '',
  description: '',
  source_type: 'text',
  source_content: '',
  personas: [
    { name: 'Alex', role: 'host', personality: 'Friendly and curious' },
    { name: 'Sam', role: 'guest', personality: 'Expert and insightful' },
  ],
  generate_cover: true,
}

export const useEpisodeStore = create<EpisodeState>((set, get) => ({
  episodes: [],
  currentEpisode: null,
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,
  wizardStep: 0,
  wizardData: { ...initialWizardData },

  fetchEpisodes: async (page = 1, status?: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.getEpisodes(page, 20, status)
      set({
        episodes: response.episodes,
        page: response.page,
        totalPages: response.total_pages,
        total: response.total,
      })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchEpisode: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const episode = await api.getEpisode(id)
      set({ currentEpisode: episode })
      return episode
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  createEpisode: async (data: EpisodeCreateRequest) => {
    set({ isLoading: true, error: null })
    try {
      const episode = await api.createEpisode(data)
      set((state) => ({
        episodes: [episode, ...state.episodes],
        currentEpisode: episode,
      }))
      return episode
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  deleteEpisode: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await api.deleteEpisode(id)
      set((state) => ({
        episodes: state.episodes.filter((ep) => ep.id !== id),
        currentEpisode: state.currentEpisode?.id === id ? null : state.currentEpisode,
      }))
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  pollEpisodeStatus: async (id: string) => {
    try {
      const status = await api.getEpisodeStatus(id)
      
      // Update the episode in the list
      set((state) => ({
        episodes: state.episodes.map((ep) =>
          ep.id === id
            ? { ...ep, status: status.status as Episode['status'], progress: status.progress }
            : ep
        ),
        currentEpisode:
          state.currentEpisode?.id === id
            ? { ...state.currentEpisode, status: status.status as Episode['status'], progress: status.progress }
            : state.currentEpisode,
      }))
      
      return status
    } catch (error) {
      console.error('Poll status error:', error)
      throw error
    }
  },

  setWizardStep: (step: number) => set({ wizardStep: step }),

  updateWizardData: (data: Partial<EpisodeCreateRequest>) =>
    set((state) => ({
      wizardData: { ...state.wizardData, ...data },
    })),

  resetWizard: () =>
    set({
      wizardStep: 0,
      wizardData: { ...initialWizardData },
    }),

  setCurrentEpisode: (episode: Episode | null) => set({ currentEpisode: episode }),
  
  setError: (error: string | null) => set({ error }),
}))
