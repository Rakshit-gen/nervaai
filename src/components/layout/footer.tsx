import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center">
          {/* Brand */}
          <div className="space-y-4 mb-8">
            <Link href="/" className="flex items-center justify-center space-x-2">
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
            <p className="text-sm text-gray-400 max-w-md">
              Transform any content into engaging AI-powered podcasts with natural-sounding voices.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Nerva. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

