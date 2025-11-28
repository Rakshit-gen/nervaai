import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Podcast Generator',
  description: 'Transform any content into engaging AI-powered podcasts',
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
        {children}
        <Toaster />
      </body>
    </html>
  )
}
