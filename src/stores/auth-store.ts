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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      initialize: async () => {
        try {
          set({ isLoading: true })
          
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            api.setAuth(session.user.id, session.access_token)
            set({
              user: session.user,
              session,
              isAuthenticated: true,
            })
          }
          
          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
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
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
        } finally {
          set({ isLoading: false })
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
