import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Strategic AI Solutions - Jaspreet Chager',
  description: 'Strategic AI Solutions for Real-World Impact. We bridge two decades of healthcare leadership with cutting-edge AI education.',
  keywords: 'AI solutions, healthcare AI, AI education, strategic AI, Jaspreet Chager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
