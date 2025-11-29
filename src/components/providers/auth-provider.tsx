'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

/**
 * AuthProvider - Initializes authentication on app startup
 * This ensures users stay logged in across page reloads
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore()

  useEffect(() => {
    // Initialize auth on app startup
    // This checks for existing session and sets up auth state listener
    initialize()
  }, [initialize])

  return <>{children}</>
}

