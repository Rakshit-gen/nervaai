import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeTime(dateString: string): string {
  // Parse the date string - handle both UTC and local timezone formats
  // If the string doesn't end with 'Z' or timezone offset, assume it's UTC
  let dateStr = dateString
  if (!dateStr.endsWith('Z') && !dateStr.match(/[+-]\d{2}:\d{2}$/)) {
    // If no timezone info, assume UTC and append 'Z'
    dateStr = dateStr.endsWith('Z') ? dateStr : dateStr + 'Z'
  }
  
  const date = new Date(dateStr)
  const now = new Date()
  
  // Validate date
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string:', dateString)
    return 'Recently'
  }
  
  const diff = now.getTime() - date.getTime()

  // Handle negative diff (date in future) - should be very small due to clock skew
  if (diff < 0) {
    // If negative but less than 1 minute, treat as "just now"
    if (Math.abs(diff) < 60000) {
      return 'Just now'
    }
    // Otherwise, something is wrong with the date
    console.warn('Date is in the future:', dateString, 'diff:', diff)
    return 'Recently'
  }

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(dateString)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-neon-green'
    case 'processing':
      return 'text-neon-cyan'
    case 'pending':
      return 'text-yellow-500'
    case 'failed':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-neon-green/20 border-neon-green/50'
    case 'processing':
      return 'bg-neon-cyan/20 border-neon-cyan/50'
    case 'pending':
      return 'bg-yellow-500/20 border-yellow-500/50'
    case 'failed':
      return 'bg-red-500/20 border-red-500/50'
    default:
      return 'bg-gray-500/20 border-gray-500/50'
  }
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

export function isValidYouTubeUrl(url: string): boolean {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)/
  return pattern.test(url)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
