import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  setSession: (session: Session | null) => void
}

// Track if auth listener is already set up to prevent duplicates
let authListenerSetup = false

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      initialize: async () => {
        // Prevent multiple initializations if already done
        const currentState = get()
        if (!currentState.isLoading && authListenerSetup) {
          // Already initialized, just check session
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user && !currentState.isAuthenticated) {
            // Session exists but state wasn't set, update it
            api.setAuth(session.user.id, session.access_token)
            set({
              user: session.user,
              session,
              isAuthenticated: true,
            })
          }
          return
        }

        try {
          set({ isLoading: true })
          
          // Get existing session from Supabase (reads from localStorage)
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Error getting session:', error)
            // Clear any invalid session
            await supabase.auth.signOut()
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
            })
            return
          }
          
          if (session?.user) {
            // Check if session is expired
            const expiresAt = session.expires_at
            const now = Math.floor(Date.now() / 1000)
            
            if (expiresAt && expiresAt < now) {
              // Session expired, try to refresh
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
              
              if (refreshError || !refreshData.session) {
                // Refresh failed, sign out
                await supabase.auth.signOut()
                api.clearAuth()
                set({
                  user: null,
                  session: null,
                  isAuthenticated: false,
                  isLoading: false,
                })
                return
              }
              
              // Use refreshed session
              const refreshedSession = refreshData.session
              api.setAuth(refreshedSession.user.id, refreshedSession.access_token)
              set({
                user: refreshedSession.user,
                session: refreshedSession,
                isAuthenticated: true,
                isLoading: false,
              })
            } else {
              // Session is valid
              api.setAuth(session.user.id, session.access_token)
              set({
                user: session.user,
                session,
                isAuthenticated: true,
                isLoading: false,
              })
            }
          } else {
            // No session found
            api.clearAuth()
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
          
          // Set up auth state change listener (only once)
          // This will handle future auth changes (login, logout, token refresh)
          if (!authListenerSetup) {
            supabase.auth.onAuthStateChange(async (event, session) => {
              console.log('Auth state changed:', event)
              
              if (session?.user) {
                api.setAuth(session.user.id, session.access_token)
                set({
                  user: session.user,
                  session,
                  isAuthenticated: true,
                  isLoading: false,
                })
              } else {
                api.clearAuth()
                set({
                  user: null,
                  session: null,
                  isAuthenticated: false,
                  isLoading: false,
                })
              }
            })
            authListenerSetup = true
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          api.clearAuth()
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        if (data.session) {
          api.setAuth(data.session.user.id, data.session.access_token)
          set({
            user: data.session.user,
            session: data.session,
            isAuthenticated: true,
          })
        }
      },

      signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error
        
        if (data.session) {
          api.setAuth(data.session.user.id, data.session.access_token)
          set({
            user: data.session.user,
            session: data.session,
            isAuthenticated: true,
          })
        }
      },

      signInWithGoogle: async () => {
        // Use environment variable if available, otherwise use current origin
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
        const redirectTo = `${appUrl}/dashboard`
        
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
          },
        })
        
        if (error) throw error
      },

      signOut: async () => {
        await supabase.auth.signOut()
        api.clearAuth()
        set({
          user: null,
          session: null,
          isAuthenticated: false,
        })
      },

      setSession: (session: Session | null) => {
        if (session) {
          api.setAuth(session.user.id, session.access_token)
          set({
            user: session.user,
            session,
            isAuthenticated: true,
          })
        } else {
          api.clearAuth()
          set({
            user: null,
            session: null,
            isAuthenticated: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({}), // Don't persist sensitive data
    }
  )
)
