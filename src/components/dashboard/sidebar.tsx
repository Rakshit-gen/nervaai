'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Mic2,
  LayoutDashboard,
  Plus,
  Library,
  Settings,
  HelpCircle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Episode', href: '/dashboard/create', icon: Plus },
  { name: 'Episode Library', href: '/dashboard/episodes', icon: Library },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="relative">
            <Mic2 className="h-8 w-8 text-neon-cyan" />
            <div className="absolute inset-0 blur-sm bg-neon-cyan/50 rounded-full" />
          </div>
          <span className="text-xl font-bold gradient-text">Nerva</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
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
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Help section */}
      <div className="p-4 border-t border-white/10">
        <div className="neon-border rounded-lg p-4 bg-black/50">
          <div className="flex items-center space-x-3 mb-3">
            <HelpCircle className="h-5 w-5 text-neon-cyan" />
            <span className="text-sm font-medium text-white">Need help?</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Check our documentation or contact support.
          </p>
          <Button variant="outline" size="sm" className="w-full">
            View Docs
          </Button>
        </div>
      </div>
    </div>
  )
}
