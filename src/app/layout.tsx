import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nerva - AI Podcast Generator',
  description: 'Transform any content into engaging AI-powered podcasts',
  icons: {
    icon: [
      { url: '/microphone.png', type: 'image/png' },
      { url: '/microphone.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/microphone.png',
    apple: '/microphone.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black min-h-screen`}>
        <div className="grid-bg fixed inset-0 pointer-events-none" />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
