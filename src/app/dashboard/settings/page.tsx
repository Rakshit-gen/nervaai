'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/stores/auth-store'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [episodeComplete, setEpisodeComplete] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [productUpdates, setProductUpdates] = useState(true)
  const [animations, setAnimations] = useState(true)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="neon-border bg-black/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-neon-cyan" />
              Profile
            </CardTitle>
            <CardDescription>
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input placeholder="Enter your name" />
            </div>
            <Button variant="neon">Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="neon-border bg-black/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-neon-pink" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Episode Complete</p>
                <p className="text-sm text-gray-500">
                  Get notified when your podcast is ready
                </p>
              </div>
              <Switch checked={episodeComplete} onCheckedChange={setEpisodeComplete} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Weekly Digest</p>
                <p className="text-sm text-gray-500">
                  Receive a summary of your podcast stats
                </p>
              </div>
              <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Product Updates</p>
                <p className="text-sm text-gray-500">
                  Stay informed about new features
                </p>
              </div>
              <Switch checked={productUpdates} onCheckedChange={setProductUpdates} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="neon-border bg-black/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2 text-neon-purple" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Dark Mode</p>
                <p className="text-sm text-gray-500">
                  Always enabled for that cyberpunk vibe
                </p>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Animations</p>
                <p className="text-sm text-gray-500">
                  Enable smooth animations
                </p>
              </div>
              <Switch checked={animations} onCheckedChange={setAnimations} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400">
              <Shield className="h-5 w-5 mr-2" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Delete All Episodes</p>
                <p className="text-sm text-gray-500">
                  Permanently delete all your episodes
                </p>
              </div>
              <Button variant="outline" className="text-red-400 border-red-400/50 hover:bg-red-400/10">
                Delete All
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Delete Account</p>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and data
                </p>
              </div>
              <Button variant="outline" className="text-red-400 border-red-400/50 hover:bg-red-400/10">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
