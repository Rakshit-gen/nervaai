'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Plus,
  Library,
  Settings,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Episode', href: '/dashboard/create', icon: Plus },
  { name: 'Episode Library', href: '/dashboard/episodes', icon: Library },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface DashboardSidebarProps {
  onClose?: () => void
}

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname()

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (onClose && window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <div className="h-full w-64 glass border-r border-white/10 flex flex-col bg-black/95 lg:bg-black/80">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="relative">
            <Image 
              src="/microphone.svg" 
              alt="Nerva Logo" 
              width={32} 
              height={32}
              className="h-8 w-8"
            />
            <div className="absolute inset-0 blur-sm bg-neon-cyan/50 rounded-full" />
          </div>
          <span className="text-xl font-bold gradient-text">Nerva</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} onClick={handleLinkClick}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start',
                  isActive
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span className="hidden sm:inline">{item.name}</span>
                <span className="sm:hidden">{item.name.split(' ')[0]}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

    </div>
  )
}
