
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bot, Home, Search, BarChart3 } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Tool Finder - Discover Perfect AI Tools for Your Needs',
  description: 'Find personalized AI tool recommendations through our intelligent screening process. Perfect for SMEs, professionals, and individuals seeking the right AI solutions.',
  keywords: 'AI tools, artificial intelligence, productivity tools, business automation, AI recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <Bot className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-xl text-gray-900">AI Tool Finder</span>
                </Link>
                
                <nav className="hidden md:flex items-center space-x-4">
                  <Link href="/">
                    <Button variant="ghost" size="sm">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Link href="/screening">
                    <Button variant="ghost" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Find Tools
                    </Button>
                  </Link>
                </nav>
                
                <div className="md:hidden">
                  <Link href="/screening">
                    <Button size="sm">
                      Find Tools
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">AI Tool Finder</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Helping you discover the perfect AI tools for your unique needs
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                  <Link href="/" className="hover:text-gray-900 transition-colors">
                    Home
                  </Link>
                  <Link href="/screening" className="hover:text-gray-900 transition-colors">
                    Find Tools
                  </Link>
                </div>
              </div>
            </div>
          </footer>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
